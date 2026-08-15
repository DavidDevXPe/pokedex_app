import { configureStore } from '@reduxjs/toolkit'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import PokedexPage from './PokedexPage'

const apiMocks = vi.hoisted(() => ({
    getApi: vi.fn(),
    getApiType: vi.fn(),
}))

const pokemonResults = Array.from({ length: 30 }, (_, index) => ({
    name: index === 0 ? 'bulbasaur' : `pokemon-${index + 1}`,
    url: `https://pokeapi.co/api/v2/pokemon/${index + 1}`,
}))

vi.mock('../hooks/useFetch', () => ({
    default: () => ({
        apiData: { results: pokemonResults },
        isLoading: false,
        error: null,
        getApi: apiMocks.getApi,
        getApiType: apiMocks.getApiType,
    }),
}))

vi.mock('../components/pokedexPage/PokeCard', () => ({
    default: () => <article data-testid='pokemon-card'>Pokémon card</article>,
}))

vi.mock('../components/pokedexPage/SelectType', () => ({
    default: () => <div>Type selector</div>,
}))

const LocationDisplay = () => {
    const location = useLocation()
    return <output data-testid='location-search'>{location.search}</output>
}

const renderPage = (initialEntry, favoritePokemonIds = []) => {
    const store = configureStore({
        reducer: {
            trainerName: () => 'Ash',
            favoritePokemonIds: () => favoritePokemonIds,
        },
    })

    render(
        <Provider store={store}>
            <MemoryRouter initialEntries={[initialEntry]}>
                <Routes>
                    <Route
                        path='/pokedex'
                        element={
                            <>
                                <PokedexPage />
                                <LocationDisplay />
                            </>
                        }
                    />
                </Routes>
            </MemoryRouter>
        </Provider>,
    )
}

describe('PokedexPage URL state', () => {
    beforeEach(() => {
        apiMocks.getApi.mockClear()
        apiMocks.getApiType.mockClear()
    })

    it('restores type and search filters from the URL', async () => {
        renderPage('/pokedex?search=bul&type=grass')

        await waitFor(() => {
            expect(apiMocks.getApiType).toHaveBeenCalledWith('https://pokeapi.co/api/v2/type/grass')
        })
        expect(screen.getByRole('searchbox')).toHaveValue('bul')
        expect(screen.getAllByTestId('pokemon-card')).toHaveLength(1)
    })

    it('writes the selected page to the URL', () => {
        renderPage('/pokedex')

        fireEvent.click(screen.getByRole('button', { name: 'Página 2' }))

        expect(screen.getByTestId('location-search')).toHaveTextContent('?page=2')
        expect(screen.getAllByTestId('pokemon-card')).toHaveLength(6)
    })

    it('filters favorites and stores that choice in the URL', () => {
        renderPage('/pokedex', [1, 3])

        fireEvent.click(screen.getByRole('button', { name: 'Favoritos (2)' }))

        expect(screen.getByTestId('location-search')).toHaveTextContent('?favorites=1')
        expect(screen.getAllByTestId('pokemon-card')).toHaveLength(2)
        expect(screen.getByRole('button', { name: 'Favoritos (2)' }))
            .toHaveAttribute('aria-pressed', 'true')
    })

    it('removes an unsupported type from the URL instead of requesting it', async () => {
        renderPage('/pokedex?type=not-a-real-type')

        await waitFor(() => {
            expect(screen.getByTestId('location-search')).toHaveTextContent('')
        })
        expect(apiMocks.getApi).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/?limit=1500')
        expect(apiMocks.getApiType).not.toHaveBeenCalled()
    })
})
