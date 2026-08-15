import { createSlice } from '@reduxjs/toolkit'
import { loadFavoritePokemonIds } from '../../utils/favoriteStorage'

const favoritePokemonIdsSlice = createSlice({
    name: 'favoritePokemonIds',
    initialState: loadFavoritePokemonIds(),
    reducers: {
        toggleFavoritePokemon: (currentIds, action) => {
            const pokemonId = Number(action.payload)

            if (!Number.isInteger(pokemonId) || pokemonId <= 0) return

            const existingIndex = currentIds.indexOf(pokemonId)

            if (existingIndex >= 0) {
                currentIds.splice(existingIndex, 1)
            } else {
                currentIds.push(pokemonId)
            }
        },
    },
})

export const { toggleFavoritePokemon } = favoritePokemonIdsSlice.actions
export default favoritePokemonIdsSlice.reducer
