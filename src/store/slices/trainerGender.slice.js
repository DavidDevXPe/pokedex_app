import { createSlice } from '@reduxjs/toolkit'
import { loadTrainerGender } from '../../utils/trainerGender'

const trainerGenderSlice = createSlice({
    name: 'trainerGender',
    initialState: loadTrainerGender(),
    reducers: {
        setTrainerGender: (currentValue, action) => action.payload,
    },
})

export const { setTrainerGender } = trainerGenderSlice.actions
export default trainerGenderSlice.reducer
