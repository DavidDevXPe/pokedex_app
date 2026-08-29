import favoritePokemonIds, { toggleFavoritePokemon } from './favoritePokemonIds.slice'
import { describe, expect, it } from 'vitest'
import trainerGender, { setTrainerGender } from './trainerGender.slice'
import trainerName, { setTrainerName } from './trainerName.slice'

describe('store slices', () => {
    it('actualiza nombre y género del entrenador', () => {
        expect(trainerName('', setTrainerName('Misty'))).toBe('Misty')
        expect(trainerGender('male', setTrainerGender('female'))).toBe('female')
    })

    it('añade, elimina e ignora identificadores favoritos inválidos', () => {
        const withPikachu = favoritePokemonIds([], toggleFavoritePokemon(25))
        expect(withPikachu).toEqual([25])
        expect(favoritePokemonIds(withPikachu, toggleFavoritePokemon('25'))).toEqual([])
        expect(favoritePokemonIds([], toggleFavoritePokemon(0))).toEqual([])
        expect(favoritePokemonIds([], toggleFavoritePokemon('invalid'))).toEqual([])
    })
})
