import { describe, expect, it } from 'vitest'
import { LANGUAGES } from '../utils/preferences'
import {
    formatLocalizedNumber,
    getErrorTranslationKey,
    translate,
    translatePokemonStat,
    translatePokemonType,
} from './translations'

describe('translations', () => {
    it('selects singular and plural messages for the active language', () => {
        expect(translate(LANGUAGES.SPANISH, 'pokedex.resultsSummary', {
            count: 1,
            page: 1,
            totalPages: 1,
        })).toBe('1 resultado. Página 1 de 1.')
        expect(translate(LANGUAGES.SPANISH, 'pokedex.resultsSummary', {
            count: 2,
            page: 1,
            totalPages: 1,
        })).toBe('2 resultados. Página 1 de 1.')
        expect(translate(LANGUAGES.ENGLISH, 'pokedex.favorites', { count: 1 }))
            .toBe('Favorite (1)')
        expect(translate(LANGUAGES.ENGLISH, 'pokedex.favorites', { count: 2 }))
            .toBe('Favorites (2)')
    })

    it('formats measurements with locale-aware decimal separators and units', () => {
        expect(formatLocalizedNumber(LANGUAGES.SPANISH, 54.5, {
            style: 'unit',
            unit: 'kilogram',
            unitDisplay: 'short',
            maximumFractionDigits: 1,
        })).toMatch(/^54,5\s*kg$/)
        expect(formatLocalizedNumber(LANGUAGES.ENGLISH, 1.3, {
            style: 'unit',
            unit: 'meter',
            unitDisplay: 'short',
            maximumFractionDigits: 1,
        })).toMatch(/^1\.3\s*m$/)
    })

    it('uses safe fallbacks for keys, types, stats and errors', () => {
        expect(translate('fr', 'pokedex.find')).toBe('Buscar Pokémon')
        expect(translate('es', 'missing.key')).toBe('missing.key')
        expect(translatePokemonType('es', 'electric')).toBe('Eléctrico')
        expect(translatePokemonType('en', 'mystery-type')).toBe('Mystery Type')
        expect(translatePokemonStat('es', 'special-defense')).toBe('Def. Esp.')
        expect(translatePokemonStat('en', 'accuracy-rate')).toBe('Accuracy Rate')
        expect(getErrorTranslationKey('Resource could not be found')).toBe('errors.notFound')
        expect(getErrorTranslationKey('Network Error')).toBe('errors.api')
        expect(getErrorTranslationKey()).toBe('errors.api')
    })
})
