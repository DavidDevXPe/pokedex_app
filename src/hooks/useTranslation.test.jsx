import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PreferencesContext } from '../contexts/preferences'
import { LANGUAGES, THEMES } from '../utils/preferences'
import useTranslation from './useTranslation'

const englishWrapper = ({ children }) => (
    <PreferencesContext.Provider value={{
        language: LANGUAGES.ENGLISH,
        theme: THEMES.LIGHT,
        setLanguage: vi.fn(),
        toggleTheme: vi.fn(),
    }}>
        {children}
    </PreferencesContext.Provider>
)

describe('useTranslation', () => {
    it('expone traducciones, tipos, estadísticas y errores en el idioma activo', () => {
        const { result } = renderHook(() => useTranslation(), {
            wrapper: englishWrapper,
        })

        expect(result.current.language).toBe('en')
        expect(result.current.t('pokedex.find')).toBe('Find Pokémon')
        expect(result.current.translateType('fire')).toBe('Fire')
        expect(result.current.translateStat('special-attack')).toBe('SP. ATK')
        expect(result.current.translateError('The resource could not be found')).toBe(
            'The requested information could not be found.',
        )
        expect(result.current.translateError('Network Error')).toBe(
            'Could not connect to PokéAPI. Please try again.',
        )
    })
})
