import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { usePreferences } from './preferences'

describe('PreferencesContext', () => {
    it('ofrece valores seguros incluso fuera del provider', () => {
        const { result } = renderHook(() => usePreferences())

        expect(result.current.language).toBe('es')
        expect(result.current.theme).toBe('light')
        expect(() => {
            act(() => {
                result.current.setLanguage('en')
                result.current.toggleTheme()
            })
        }).not.toThrow()
    })
})
