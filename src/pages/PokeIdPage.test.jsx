import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import PokeIdPage from './PokeIdPage'

const apiMocks = vi.hoisted(() => ({
    getApi: vi.fn(),
    result: null,
}))

vi.mock('../hooks/useFetch', () => ({
    default: () => apiMocks.result,
}))

const createSuccessfulResult = () => ({
        apiData: {
            id: 122,
            name: 'mr-mime',
            weight: 545,
            height: 13,
            sprites: {
                other: {
                    'official-artwork': {
                        front_default: 'https://example.test/mr-mime.png',
                    },
                },
            },
            types: [{ slot: 1, type: { name: 'psychic' } }],
        },
        isLoading: false,
        error: null,
        statusCode: null,
        getApi: apiMocks.getApi,
})

vi.mock('../components/pokeIdPage/Atributes', () => ({
    default: () => <div>Attributes</div>,
}))

vi.mock('../components/pokeIdPage/Stats', () => ({
    default: () => <div>Stats</div>,
}))

vi.mock('../components/pokeIdPage/MoveSet', () => ({
    default: () => <div>Moves</div>,
}))

vi.mock('../components/FavoriteButton', () => ({
    default: () => <button type='button'>Favorite</button>,
}))

const renderDetails = initialEntry => render(
    <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
            <Route path='/pokedex/:id' element={<PokeIdPage />} />
        </Routes>
    </MemoryRouter>,
)

describe('PokeIdPage navigation', () => {
    beforeEach(() => {
        apiMocks.getApi.mockClear()
        apiMocks.result = createSuccessfulResult()
    })

    it('preserves the result filters in its back link', async () => {
        renderDetails({
            pathname: '/pokedex/122',
            state: { from: '/pokedex?search=mime&type=psychic&page=2' },
        })

        await waitFor(() => {
            expect(apiMocks.getApi).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/122')
        })
        expect(screen.getByRole('link', { name: '← Volver a resultados' }))
            .toHaveAttribute('href', '/pokedex?search=mime&type=psychic&page=2')
        expect(screen.getByRole('heading', { name: 'Mr Mime' })).toBeInTheDocument()
        expect(document.title).toBe('Mr Mime | Pokédex')
    })

    it('returns to the unfiltered Pokédex when opened directly', () => {
        renderDetails('/pokedex/122')

        expect(screen.getByRole('link', { name: '← Volver a resultados' }))
            .toHaveAttribute('href', '/pokedex')
    })

    it('shows a useful state for a Pokémon that does not exist', () => {
        apiMocks.result = {
            apiData: null,
            isLoading: false,
            error: 'The requested information could not be found.',
            statusCode: 404,
            getApi: apiMocks.getApi,
        }

        renderDetails('/pokedex/not-a-pokemon')

        expect(screen.getByRole('heading', { name: 'Pokémon no encontrado' })).toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'Reintentar' })).not.toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'Volver a resultados' })).toHaveAttribute('href', '/pokedex')
        expect(document.title).toBe('Pokémon no encontrado | Pokédex')
    })
})
