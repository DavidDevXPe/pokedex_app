import { describe, expect, it } from 'vitest'
import { getPokemonTypeAsset } from './pokemonTypeAssets'

describe('Pokémon type assets', () => {
    it('returns an image for a supported type', () => {
        expect(getPokemonTypeAsset('grass'))
            .toBe(`${import.meta.env.BASE_URL}assets/types/grass.png`)
    })

    it('keeps a text fallback for unsupported API types', () => {
        expect(getPokemonTypeAsset('stellar')).toBeNull()
        expect(getPokemonTypeAsset('unknown')).toBeNull()
    })
})
