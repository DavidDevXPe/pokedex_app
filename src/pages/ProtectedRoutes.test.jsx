import { configureStore } from '@reduxjs/toolkit'
import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import trainerName from '../store/slices/trainerName.slice'
import trainerGender from '../store/slices/trainerGender.slice'
import { TRAINER_GENDERS } from '../utils/trainerGender'
import ProtectedRoutes from './ProtectedRoutes'

const renderProtectedRoute = (
    initialTrainerName,
    initialTrainerGender = TRAINER_GENDERS.MALE,
) => {
    const store = configureStore({
        reducer: { trainerGender, trainerName },
        preloadedState: {
            trainerGender: initialTrainerGender,
            trainerName: initialTrainerName,
        },
    })

    return render(
        <Provider store={store}>
            <MemoryRouter initialEntries={['/pokedex']}>
                <Routes>
                    <Route path='/' element={<p>Home page</p>} />
                    <Route element={<ProtectedRoutes />}>
                        <Route path='/pokedex' element={<p>Protected Pokédex</p>} />
                    </Route>
                </Routes>
            </MemoryRouter>
        </Provider>,
    )
}

describe('ProtectedRoutes', () => {
    it('redirects visitors without a valid trainer', () => {
        renderProtectedRoute('')

        expect(screen.getByText('Home page')).toBeInTheDocument()
        expect(screen.queryByText('Protected Pokédex')).not.toBeInTheDocument()
    })

    it('renders protected content for a valid trainer', () => {
        renderProtectedRoute('Ash')

        expect(screen.getByText('Protected Pokédex')).toBeInTheDocument()
    })

    it('lets the current trainer return home and clear access', () => {
        renderProtectedRoute('Ash')

        fireEvent.click(screen.getByRole('button', { name: 'Cambiar entrenador' }))

        expect(screen.getByText('Home page')).toBeInTheDocument()
    })

    it('shows the avatar selected by the trainer', () => {
        renderProtectedRoute('Misty', TRAINER_GENDERS.FEMALE)

        expect(screen.getByRole('button', { name: 'Cambiar entrenador' }).querySelector('img'))
            .toHaveAttribute(
                'src',
                `${import.meta.env.BASE_URL}assets/trainers/female.png`,
            )
        expect(screen.getByText('Entrenadora')).toBeInTheDocument()
    })

    it('identifies the current navigation destination', () => {
        renderProtectedRoute('Ash')

        const pokemonLink = screen.getByRole('link', { name: 'Pokémon' })
        const typesLink = screen.getByRole('link', { name: 'Tipos' })
        expect(pokemonLink).toHaveAttribute('aria-current', 'page')

        fireEvent.click(typesLink)

        expect(pokemonLink).not.toHaveAttribute('aria-current')
        expect(typesLink).toHaveAttribute('aria-current', 'location')
    })
})
