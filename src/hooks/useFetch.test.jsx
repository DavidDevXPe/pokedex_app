import { act, renderHook } from '@testing-library/react'
import axios from 'axios'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
    API_ERROR_CODES,
    API_REQUEST_TIMEOUT_MS,
    clearApiClientState,
} from '../api/pokeApiClient'
import useFetch from './useFetch'

vi.mock('axios', () => ({
    default: {
        get: vi.fn(),
    },
}))

describe('useFetch', () => {
    beforeEach(() => {
        clearApiClientState()
    })

    afterEach(() => {
        clearApiClientState()
        vi.clearAllMocks()
    })

    it('exposes loading and stores a successful response', async () => {
        let resolveRequest
        axios.get.mockReturnValueOnce(new Promise(resolve => {
            resolveRequest = resolve
        }))
        const { result } = renderHook(() => useFetch())

        act(() => {
            result.current.getApi('https://example.test/pokemon-success')
        })

        expect(result.current.isLoading).toBe(true)

        await act(async () => {
            resolveRequest({ data: { id: 25, name: 'pikachu' } })
        })

        expect(result.current.apiData).toEqual({ id: 25, name: 'pikachu' })
        expect(result.current.error).toBeNull()
        expect(result.current.statusCode).toBeNull()
        expect(result.current.isLoading).toBe(false)
        expect(axios.get).toHaveBeenCalledWith(
            'https://example.test/pokemon-success',
            expect.objectContaining({ timeout: API_REQUEST_TIMEOUT_MS }),
        )
    })

    it('provides a useful message for a missing resource', async () => {
        axios.get.mockRejectedValueOnce({ response: { status: 404 } })
        const { result } = renderHook(() => useFetch())

        await act(async () => {
            await result.current.getApi('https://example.test/pokemon-missing')
        })

        expect(result.current.apiData).toBeNull()
        expect(result.current.error).toMatch(/could not be found/i)
        expect(result.current.errorDetails).toEqual({
            code: API_ERROR_CODES.NOT_FOUND,
            message: expect.stringMatching(/could not be found/i),
            statusCode: 404,
            retryable: false,
        })
        expect(result.current.statusCode).toBe(404)
    })

    it('cancels the active request when the consumer unmounts', () => {
        axios.get.mockReturnValueOnce(new Promise(() => {}))
        const { result, unmount } = renderHook(() => useFetch())

        act(() => {
            result.current.getApi('https://example.test/pokemon-cancel')
        })

        const requestSignal = axios.get.mock.calls[0][1].signal
        unmount()

        expect(requestSignal.aborted).toBe(true)
    })

    it('deduplicates canonical URLs without cross-canceling consumers', async () => {
        let resolveRequest
        axios.get.mockReturnValueOnce(new Promise(resolve => {
            resolveRequest = resolve
        }))
        const firstHook = renderHook(() => useFetch())
        const secondHook = renderHook(() => useFetch())

        act(() => {
            firstHook.result.current.getApi('https://example.test/pokemon/25/')
            secondHook.result.current.getApi('https://example.test/pokemon/25')
        })

        const requestSignal = axios.get.mock.calls[0][1].signal
        expect(axios.get).toHaveBeenCalledTimes(1)

        firstHook.unmount()
        expect(requestSignal.aborted).toBe(false)

        await act(async () => {
            resolveRequest({ data: { id: 25, name: 'pikachu' } })
        })

        expect(secondHook.result.current.apiData).toEqual({
            id: 25,
            name: 'pikachu',
        })
        expect(secondHook.result.current.isLoading).toBe(false)
    })

    it('reports invalid type payloads without throwing in the UI', async () => {
        axios.get
            .mockResolvedValueOnce({ data: { pokemon: null } })
            .mockResolvedValueOnce({ data: { pokemon: [] } })
        const { result } = renderHook(() => useFetch())

        await act(async () => {
            await result.current.getApiType('https://example.test/type/unknown')
        })

        expect(result.current.apiData).toBeNull()
        expect(result.current.error).toBeTruthy()
        expect(result.current.errorDetails.code)
            .toBe(API_ERROR_CODES.INVALID_RESPONSE)
        expect(result.current.statusCode).toBeNull()

        await act(async () => {
            await result.current.getApiType('https://example.test/type/unknown')
        })

        expect(result.current.apiData).toEqual({ results: [] })
        expect(result.current.error).toBeNull()
        expect(axios.get).toHaveBeenCalledTimes(2)
    })

    it('rejects malformed PokéAPI detail payloads before rendering them', async () => {
        axios.get.mockResolvedValueOnce({ data: { id: 25, name: 'pikachu' } })
        const { result } = renderHook(() => useFetch())

        await act(async () => {
            await result.current.getApi('https://pokeapi.co/api/v2/pokemon/25')
        })

        expect(result.current.apiData).toBeNull()
        expect(result.current.errorDetails.code)
            .toBe(API_ERROR_CODES.INVALID_RESPONSE)
    })
})
