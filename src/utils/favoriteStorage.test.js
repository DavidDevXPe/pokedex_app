import { describe, expect, it, vi } from 'vitest'
import {
    FAVORITES_STORAGE_KEY,
    loadFavoritePokemonIds,
    normalizeFavoritePokemonIds,
    persistFavoritePokemonIds,
} from './favoriteStorage'

describe('favorite storage', () => {
    it('normalizes duplicate and invalid Pokémon ids', () => {
        expect(normalizeFavoritePokemonIds([25, '25', 1, -4, 2.5, 'invalid']))
            .toEqual([25, 1])
    })

    it('loads a safe list and ignores malformed storage values', () => {
        const validStorage = {
            getItem: vi.fn(() => '[25,"1",null,-2]'),
        }
        const invalidStorage = {
            getItem: vi.fn(() => '{invalid-json'),
        }

        expect(loadFavoritePokemonIds(validStorage)).toEqual([25, 1])
        expect(loadFavoritePokemonIds(invalidStorage)).toEqual([])
    })

    it('persists favorites and removes an empty collection', () => {
        const storage = {
            setItem: vi.fn(),
            removeItem: vi.fn(),
        }

        persistFavoritePokemonIds([25, 1], storage)
        expect(storage.setItem).toHaveBeenCalledWith(FAVORITES_STORAGE_KEY, '[25,1]')

        persistFavoritePokemonIds([], storage)
        expect(storage.removeItem).toHaveBeenCalledWith(FAVORITES_STORAGE_KEY)
    })
})
