import { configureStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import NotFoundPage from './NotFoundPage'

const renderNotFound = trainerName => {
    const store = configureStore({
        reducer: { trainerName: () => trainerName },
    })

    render(
        <Provider store={store}>
            <MemoryRouter>
                <NotFoundPage />
            </MemoryRouter>
        </Provider>,
    )
}

describe('NotFoundPage', () => {
    it('returns a visitor to the home page', () => {
        renderNotFound('')

        expect(screen.getByRole('link', { name: 'Volver al inicio' })).toHaveAttribute('href', '/')
    })

    it('returns an identified trainer to the Pokédex', () => {
        renderNotFound('Ash')

        expect(screen.getByRole('link', { name: 'Volver a la Pokédex' })).toHaveAttribute('href', '/pokedex')
    })
})
