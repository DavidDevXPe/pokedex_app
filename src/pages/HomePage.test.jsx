import { configureStore } from '@reduxjs/toolkit'
import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import trainerGender from '../store/slices/trainerGender.slice'
import trainerName from '../store/slices/trainerName.slice'
import { TRAINER_GENDERS } from '../utils/trainerGender'
import HomePage from './HomePage'

const renderHomePage = (initialGender = TRAINER_GENDERS.MALE) => {
    const store = configureStore({
        reducer: { trainerGender, trainerName },
        preloadedState: {
            trainerGender: initialGender,
            trainerName: '',
        },
    })

    render(
        <Provider store={store}>
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/pokedex' element={<p>Pokédex route</p>} />
                </Routes>
            </MemoryRouter>
        </Provider>,
    )

    return store
}

describe('HomePage trainer selection', () => {
    it('restores the selected trainer gender', () => {
        renderHomePage(TRAINER_GENDERS.FEMALE)

        expect(screen.getByRole('radio', { name: 'Woman' })).toBeChecked()
        expect(screen.getByRole('radio', { name: 'Man' })).not.toBeChecked()
    })

    it('stores the chosen gender together with the trainer name', () => {
        const store = renderHomePage()

        fireEvent.click(screen.getByRole('radio', { name: 'Woman' }))
        fireEvent.change(screen.getByRole('textbox', { name: 'Trainer name' }), {
            target: { value: 'Misty' },
        })
        fireEvent.click(screen.getByRole('button', { name: 'Catch them all!' }))

        expect(store.getState()).toMatchObject({
            trainerGender: TRAINER_GENDERS.FEMALE,
            trainerName: 'Misty',
        })
        expect(screen.getByText('Pokédex route')).toBeInTheDocument()
    })
})
