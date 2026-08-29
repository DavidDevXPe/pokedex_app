import axios from 'axios'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
    API_CACHE_MAX_ENTRIES,
    API_CACHE_TTL_MS,
    API_ERROR_CODES,
    API_REQUEST_TIMEOUT_MS,
    canonicalizeApiUrl,
    clearApiClientState,
    normalizeApiError,
    subscribeToApiRequest,
} from './pokeApiClient'

vi.mock('axios', () => ({
    default: {
        get: vi.fn(),
    },
}))

describe('PokéAPI client', () => {
    beforeEach(() => {
        clearApiClientState()
        vi.clearAllMocks()
    })

    afterEach(() => {
        clearApiClientState()
        vi.restoreAllMocks()
    })

    it('canonicalizes trailing slashes, fragments and query order', () => {
        expect(canonicalizeApiUrl(
            'https://POKEAPI.co/api/v2/pokemon/25/?z=2&a=1#profile',
        )).toBe('https://pokeapi.co/api/v2/pokemon/25?a=1&z=2')
        expect(canonicalizeApiUrl('https://pokeapi.co/api/v2/pokemon/25'))
            .toBe('https://pokeapi.co/api/v2/pokemon/25')
    })

    it('uses a timeout and reuses fresh responses for canonical URLs', async () => {
        const pokemon = { id: 25, name: 'pikachu' }
        axios.get.mockResolvedValueOnce({ data: pokemon })

        const firstRequest = subscribeToApiRequest(
            'https://pokeapi.co/api/v2/pokemon/25/',
        )
        await expect(firstRequest.promise).resolves.toEqual(pokemon)
        firstRequest.release()

        const secondRequest = subscribeToApiRequest(
            'https://pokeapi.co/api/v2/pokemon/25',
        )

        expect(secondRequest.cached).toBe(true)
        expect(secondRequest.data).toEqual(pokemon)
        expect(axios.get).toHaveBeenCalledTimes(1)
        expect(axios.get).toHaveBeenCalledWith(
            'https://pokeapi.co/api/v2/pokemon/25/',
            expect.objectContaining({
                signal: expect.any(AbortSignal),
                timeout: API_REQUEST_TIMEOUT_MS,
            }),
        )
    })

    it('expires cached responses after the configured TTL', async () => {
        let now = 1_000
        vi.spyOn(Date, 'now').mockImplementation(() => now)
        axios.get
            .mockResolvedValueOnce({ data: { version: 1 } })
            .mockResolvedValueOnce({ data: { version: 2 } })

        const firstRequest = subscribeToApiRequest('https://example.test/pokemon/1/')
        await firstRequest.promise
        firstRequest.release()

        now += API_CACHE_TTL_MS + 1

        const secondRequest = subscribeToApiRequest('https://example.test/pokemon/1')
        await expect(secondRequest.promise).resolves.toEqual({ version: 2 })
        secondRequest.release()

        expect(secondRequest.cached).toBe(false)
        expect(axios.get).toHaveBeenCalledTimes(2)
    })

    it('evicts the least recently used response when the cache is full', async () => {
        axios.get.mockImplementation(url => Promise.resolve({ data: { url } }))

        for (let index = 0; index <= API_CACHE_MAX_ENTRIES; index += 1) {
            const request = subscribeToApiRequest(
                `https://example.test/pokemon/${index}`,
            )
            await request.promise
            request.release()
        }

        const evictedRequest = subscribeToApiRequest('https://example.test/pokemon/0/')
        await evictedRequest.promise
        evictedRequest.release()

        expect(evictedRequest.cached).toBe(false)
        expect(axios.get).toHaveBeenCalledTimes(API_CACHE_MAX_ENTRIES + 2)
    })

    it('deduplicates requests without letting one subscriber cancel another', () => {
        axios.get.mockReturnValueOnce(new Promise(() => {}))

        const firstRequest = subscribeToApiRequest('https://example.test/pokemon/7/')
        const secondRequest = subscribeToApiRequest('https://example.test/pokemon/7')
        const sharedSignal = axios.get.mock.calls[0][1].signal

        expect(axios.get).toHaveBeenCalledTimes(1)
        expect(firstRequest.promise).toBe(secondRequest.promise)

        firstRequest.release()
        expect(sharedSignal.aborted).toBe(false)

        secondRequest.release()
        expect(sharedSignal.aborted).toBe(true)
    })

    it('does not cache payloads rejected by a subscriber validator', async () => {
        const validateList = data => Array.isArray(data?.results)
        axios.get
            .mockResolvedValueOnce({ data: { results: null } })
            .mockResolvedValueOnce({ data: { results: [] } })

        const invalidRequest = subscribeToApiRequest(
            'https://example.test/pokemon',
            validateList,
        )
        await expect(invalidRequest.promise).rejects.toMatchObject({
            code: API_ERROR_CODES.INVALID_RESPONSE,
        })
        invalidRequest.release()

        const retryRequest = subscribeToApiRequest(
            'https://example.test/pokemon',
            validateList,
        )
        expect(retryRequest.cached).toBe(false)
        await expect(retryRequest.promise).resolves.toEqual({ results: [] })
        retryRequest.release()

        expect(axios.get).toHaveBeenCalledTimes(2)
    })

    it('stops applying a validator after its subscriber is released', async () => {
        let resolveRequest
        axios.get.mockReturnValueOnce(new Promise(resolve => {
            resolveRequest = resolve
        }))

        const releasedRequest = subscribeToApiRequest(
            'https://example.test/pokemon/25',
            () => false,
        )
        const activeRequest = subscribeToApiRequest(
            'https://example.test/pokemon/25/',
            data => data?.id === 25,
        )

        releasedRequest.release()
        resolveRequest({ data: { id: 25 } })

        await expect(activeRequest.promise).resolves.toEqual({ id: 25 })
        activeRequest.release()
    })

    it('classifies HTTP, timeout and network failures', () => {
        expect(normalizeApiError({ response: { status: 404 } }).toDetails())
            .toMatchObject({
                code: API_ERROR_CODES.NOT_FOUND,
                statusCode: 404,
                retryable: false,
            })
        expect(normalizeApiError({ code: 'ECONNABORTED' }).toDetails())
            .toMatchObject({
                code: API_ERROR_CODES.TIMEOUT,
                statusCode: null,
                retryable: true,
            })
        expect(normalizeApiError({ request: {} }).toDetails())
            .toMatchObject({
                code: API_ERROR_CODES.NETWORK,
                retryable: true,
            })
    })
})
