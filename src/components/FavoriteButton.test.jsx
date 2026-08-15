import { configureStore } from '@reduxjs/toolkit'
import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { describe, expect, it } from 'vitest'
import favoritePokemonIds from '../store/slices/favoritePokemonIds.slice'
import FavoriteButton from './FavoriteButton'

const renderFavoriteButton = initialFavorites => {
    const store = configureStore({
        reducer: { favoritePokemonIds },
        preloadedState: { favoritePokemonIds: initialFavorites },
    })

    render(
        <Provider store={store}>
            <FavoriteButton pokemonId={25} pokemonName='Pikachu' />
        </Provider>,
    )

    return store
}

describe('FavoriteButton', () => {
    it('adds and removes a Pokémon from favorites', () => {
        const store = renderFavoriteButton([])
        const addButton = screen.getByRole('button', { name: 'Add Pikachu to favorites' })

        expect(addButton).toHaveAttribute('aria-pressed', 'false')
        fireEvent.click(addButton)

        const removeButton = screen.getByRole('button', { name: 'Remove Pikachu from favorites' })
        expect(removeButton).toHaveAttribute('aria-pressed', 'true')
        expect(store.getState().favoritePokemonIds).toEqual([25])

        fireEvent.click(removeButton)
        expect(store.getState().favoritePokemonIds).toEqual([])
    })
})
