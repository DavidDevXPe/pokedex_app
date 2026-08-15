import { configureStore } from "@reduxjs/toolkit";
import trainerName from "./slices/trainerName.slice.js";
import trainerGender from './slices/trainerGender.slice.js';
import favoritePokemonIds from './slices/favoritePokemonIds.slice.js';
import { persistTrainerName } from '../utils/trainerStorage.js';
import { persistTrainerGender } from '../utils/trainerGender.js';
import { persistFavoritePokemonIds } from '../utils/favoriteStorage.js';

const store = configureStore({
    reducer: {
        trainerName,
        trainerGender,
        favoritePokemonIds,
    }
})

store.subscribe(() => {
    const state = store.getState()
    persistTrainerName(state.trainerName)
    persistTrainerGender(state.trainerGender)
    persistFavoritePokemonIds(state.favoritePokemonIds)
})

export default store
