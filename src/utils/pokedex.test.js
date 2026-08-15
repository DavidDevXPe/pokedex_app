import { describe, expect, it } from 'vitest'
import {
    filterPokemons,
    getPageFromSearchParams,
    normalizeSearch,
} from './pokedex'

const pokemons = [
    { name: 'bulbasaur', url: '/1' },
    { name: 'ivysaur', url: '/2' },
    { name: 'venusaur', url: '/3' },
]

describe('Pokédex utilities', () => {
    it('normalizes searches before using them in the URL', () => {
        expect(normalizeSearch('  BulBaSaur  ')).toBe('bulbasaur')
    })

    it('filters Pokémon by a partial normalized name', () => {
        expect(filterPokemons(pokemons, '  SAUR ')).toEqual(pokemons)
        expect(filterPokemons(pokemons, 'ivy')).toEqual([pokemons[1]])
    })

    it('returns a safe page for valid and invalid URL values', () => {
        expect(getPageFromSearchParams(new URLSearchParams('page=3'))).toBe(3)
        expect(getPageFromSearchParams(new URLSearchParams('page=-4'))).toBe(1)
        expect(getPageFromSearchParams(new URLSearchParams('page=abc'))).toBe(1)
    })
})
