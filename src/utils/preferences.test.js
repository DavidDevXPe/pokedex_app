import { describe, expect, it } from 'vitest'
import {
    DEFAULT_PREFERENCES,
    loadPreferences,
    persistPreferences,
    PREFERENCES_STORAGE_KEY,
} from './preferences'

describe('preferences storage', () => {
    it('uses Spanish and light mode by default', () => {
        expect(loadPreferences()).toEqual(DEFAULT_PREFERENCES)
    })

    it('persists and restores valid preferences', () => {
        persistPreferences({ language: 'en', theme: 'dark' })

        expect(loadPreferences()).toEqual({ language: 'en', theme: 'dark' })
        expect(window.localStorage.getItem(PREFERENCES_STORAGE_KEY)).toBe(
            JSON.stringify({ language: 'en', theme: 'dark' }),
        )
    })

    it('recovers safely from invalid stored data', () => {
        window.localStorage.setItem(PREFERENCES_STORAGE_KEY, '{invalid json')

        expect(loadPreferences()).toEqual(DEFAULT_PREFERENCES)
    })

    it('recovers when the browser blocks access to localStorage itself', () => {
        const descriptor = Object.getOwnPropertyDescriptor(window, 'localStorage')
        Object.defineProperty(window, 'localStorage', {
            configurable: true,
            get: () => {
                throw new DOMException('Blocked', 'SecurityError')
            },
        })

        try {
            expect(loadPreferences()).toEqual(DEFAULT_PREFERENCES)
            expect(() => persistPreferences({ language: 'en', theme: 'dark' }))
                .not.toThrow()
        } finally {
            Object.defineProperty(window, 'localStorage', descriptor)
        }
    })
})
