import store from './index'
import { describe, expect, it } from 'vitest'
import { toggleFavoritePokemon } from './slices/favoritePokemonIds.slice'
import { setTrainerGender } from './slices/trainerGender.slice'
import { setTrainerName } from './slices/trainerName.slice'
import { FAVORITES_STORAGE_KEY } from '../utils/favoriteStorage'
import { TRAINER_GENDER_STORAGE_KEY } from '../utils/trainerGender'
import { TRAINER_STORAGE_KEY } from '../utils/trainerStorage'

describe('store', () => {
    it('persiste las preferencias del entrenador y sus favoritos', () => {
        store.dispatch(setTrainerName('Brock'))
        store.dispatch(setTrainerGender('male'))
        store.dispatch(toggleFavoritePokemon(95))

        expect(window.sessionStorage.getItem(TRAINER_STORAGE_KEY)).toBe('Brock')
        expect(window.sessionStorage.getItem(TRAINER_GENDER_STORAGE_KEY)).toBe('male')
        expect(JSON.parse(window.localStorage.getItem(FAVORITES_STORAGE_KEY))).toContain(95)
    })
})
