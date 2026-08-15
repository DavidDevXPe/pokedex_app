import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import usePrefersReducedMotion from './usePrefersReducedMotion'

const originalMatchMedia = window.matchMedia

const installMatchMedia = initialMatches => {
    let changeListener
    const mediaQuery = {
        matches: initialMatches,
        addEventListener: vi.fn((eventName, listener) => {
            if (eventName === 'change') changeListener = listener
        }),
        removeEventListener: vi.fn(),
    }

    Object.defineProperty(window, 'matchMedia', {
        configurable: true,
        value: vi.fn(() => mediaQuery),
    })

    return {
        mediaQuery,
        changePreference: matches => changeListener({ matches }),
    }
}

afterEach(() => {
    Object.defineProperty(window, 'matchMedia', {
        configurable: true,
        value: originalMatchMedia,
    })
})

describe('usePrefersReducedMotion', () => {
    it('reads the current system preference', () => {
        installMatchMedia(true)

        const { result } = renderHook(() => usePrefersReducedMotion())

        expect(result.current).toBe(true)
    })

    it('reacts to preference changes and removes its listener', () => {
        const { mediaQuery, changePreference } = installMatchMedia(false)
        const { result, unmount } = renderHook(() => usePrefersReducedMotion())

        act(() => changePreference(true))
        expect(result.current).toBe(true)

        unmount()
        expect(mediaQuery.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
    })
})
