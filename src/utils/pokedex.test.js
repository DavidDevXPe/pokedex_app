import { describe, expect, it } from 'vitest'
import {
    filterPokemons,
    filterFavoritePokemons,
    formatPokemonName,
    getPokemonArtwork,
    getPageFromSearchParams,
    getPokemonIdFromUrl,
    getPokedexReturnPath,
    normalizeSearch,
} from './pokedex'

const pokemons = [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
    { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/' },
]

describe('Pokédex utilities', () => {
    it('normalizes searches before using them in the URL', () => {
        expect(normalizeSearch('  BulBaSaur  ')).toBe('bulbasaur')
        expect(normalizeSearch('  Mr   Mime  ')).toBe('mr mime')
        expect(normalizeSearch(null)).toBe('')
    })

    it('filters Pokémon by a partial normalized name', () => {
        expect(filterPokemons(pokemons, '  SAUR ')).toEqual(pokemons)
        expect(filterPokemons(pokemons, 'ivy')).toEqual([pokemons[1]])
    })

    it('matches displayed spaces and API hyphens interchangeably', () => {
        const compoundNames = [
            { name: 'mr-mime', url: '/pokemon/122/' },
            { name: 'tapu-koko', url: '/pokemon/785/' },
        ]

        expect(filterPokemons(compoundNames, 'Mr Mime')).toEqual([compoundNames[0]])
        expect(filterPokemons(compoundNames, 'tapu-koko')).toEqual([compoundNames[1]])
        expect(filterPokemons(compoundNames, 'TAPU KOKO')).toEqual([compoundNames[1]])
    })

    it('handles invalid result collections safely', () => {
        expect(filterPokemons(null, 'pikachu')).toEqual([])
        expect(filterPokemons([{ name: null }], 'pikachu')).toEqual([])
    })

    it('returns a safe page for valid and invalid URL values', () => {
        expect(getPageFromSearchParams(new URLSearchParams('page=3'))).toBe(3)
        expect(getPageFromSearchParams(new URLSearchParams('page=-4'))).toBe(1)
        expect(getPageFromSearchParams(new URLSearchParams('page=abc'))).toBe(1)
        expect(getPageFromSearchParams(new URLSearchParams('page=2abc'))).toBe(1)
        expect(getPageFromSearchParams(new URLSearchParams('page=2.5'))).toBe(1)
        expect(getPageFromSearchParams(new URLSearchParams(`page=${Number.MAX_SAFE_INTEGER + 1}`))).toBe(1)
    })

    it('formats API names for display', () => {
        expect(formatPokemonName('mr-mime')).toBe('Mr Mime')
        expect(formatPokemonName('tapu-koko')).toBe('Tapu Koko')
    })

    it('only restores safe Pokédex result paths', () => {
        expect(getPokedexReturnPath('/pokedex?type=grass&page=2')).toBe('/pokedex?type=grass&page=2')
        expect(getPokedexReturnPath('/admin')).toBe('/pokedex')
        expect(getPokedexReturnPath(undefined)).toBe('/pokedex')
    })

    it('uses the best available artwork source', () => {
        const pokemon = {
            sprites: {
                front_default: '/sprite.png',
                other: {
                    'official-artwork': { front_default: '/official.png' },
                    home: { front_default: '/home.png' },
                },
            },
        }

        expect(getPokemonArtwork(pokemon)).toBe('/home.png')
        expect(getPokemonArtwork({ sprites: {} })).toBeNull()
    })

    it('extracts ids and filters the result list by favorites', () => {
        expect(getPokemonIdFromUrl('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25)
        expect(getPokemonIdFromUrl('/invalid/25')).toBeNull()
        expect(filterFavoritePokemons(pokemons, [1, 3])).toEqual([
            pokemons[0],
            pokemons[2],
        ])
    })
})
