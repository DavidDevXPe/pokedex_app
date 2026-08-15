import { configureStore } from '@reduxjs/toolkit'
import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import trainerName from '../store/slices/trainerName.slice'
import ProtectedRoutes from './ProtectedRoutes'

const renderProtectedRoute = initialTrainerName => {
    const store = configureStore({
        reducer: { trainerName },
        preloadedState: { trainerName: initialTrainerName },
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

        fireEvent.click(screen.getByRole('button', { name: 'Change trainer' }))

        expect(screen.getByText('Home page')).toBeInTheDocument()
    })
})
