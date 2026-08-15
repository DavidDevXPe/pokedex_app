import { configureStore } from "@reduxjs/toolkit";
import trainerName from "./slices/trainerName.slice.js";
import favoritePokemonIds from './slices/favoritePokemonIds.slice.js';
import { persistTrainerName } from '../utils/trainerStorage.js';
import { persistFavoritePokemonIds } from '../utils/favoriteStorage.js';

const store = configureStore({
    reducer: {
        trainerName,
        favoritePokemonIds,
    }
})

store.subscribe(() => {
    const state = store.getState()
    persistTrainerName(state.trainerName)
    persistFavoritePokemonIds(state.favoritePokemonIds)
})

export default store
