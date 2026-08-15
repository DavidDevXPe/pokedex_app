import { createSlice } from "@reduxjs/toolkit";
import { loadTrainerName } from '../../utils/trainerStorage.js';

const trainerNameSlice = createSlice({
    name: 'trainerName',
    initialState: loadTrainerName(),
    reducers:{
        setTrainerName: (currentValue, action) => action.payload,
    }
})

export const { setTrainerName } = trainerNameSlice.actions;
export default trainerNameSlice.reducer;
