import { act, renderHook } from '@testing-library/react'
import axios from 'axios'
import { afterEach, describe, expect, it, vi } from 'vitest'
import useFetch from './useFetch'

vi.mock('axios', () => ({
    default: {
        get: vi.fn(),
    },
}))

describe('useFetch', () => {
    afterEach(() => {
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
        expect(result.current.isLoading).toBe(false)
    })

    it('provides a useful message for a missing resource', async () => {
        axios.get.mockRejectedValueOnce({ response: { status: 404 } })
        const { result } = renderHook(() => useFetch())

        await act(async () => {
            await result.current.getApi('https://example.test/pokemon-missing')
        })

        expect(result.current.apiData).toBeNull()
        expect(result.current.error).toMatch(/No se encontró/)
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
})
