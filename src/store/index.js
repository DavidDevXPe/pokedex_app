import { configureStore } from "@reduxjs/toolkit";
import trainerName from "./slices/trainerName.slice.js";
import { persistTrainerName } from '../utils/trainerStorage.js';

const store = configureStore({
    reducer: {
        trainerName,
    }
})

store.subscribe(() => {
    persistTrainerName(store.getState().trainerName)
})

export default store
