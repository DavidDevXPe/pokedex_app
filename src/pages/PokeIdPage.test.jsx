import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import PokeIdPage from './PokeIdPage'

const apiMocks = vi.hoisted(() => ({
    getApi: vi.fn(),
}))

vi.mock('../hooks/useFetch', () => ({
    default: () => ({
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
        getApi: apiMocks.getApi,
    }),
}))

vi.mock('../components/pokeIdPage/Atributes', () => ({
    default: () => <div>Attributes</div>,
}))

vi.mock('../components/pokeIdPage/Stats', () => ({
    default: () => <div>Stats</div>,
}))

vi.mock('../components/pokeIdPage/MoveSet', () => ({
    default: () => <div>Moves</div>,
}))

const renderDetails = initialEntry => render(
    <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
            <Route path='/pokedex/:id' element={<PokeIdPage />} />
        </Routes>
    </MemoryRouter>,
)

describe('PokeIdPage navigation', () => {
    it('preserves the result filters in its back link', async () => {
        renderDetails({
            pathname: '/pokedex/122',
            state: { from: '/pokedex?search=mime&type=psychic&page=2' },
        })

        await waitFor(() => {
            expect(apiMocks.getApi).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/122')
        })
        expect(screen.getByRole('link', { name: '← Back to results' }))
            .toHaveAttribute('href', '/pokedex?search=mime&type=psychic&page=2')
        expect(screen.getByRole('heading', { name: 'Mr Mime' })).toBeInTheDocument()
        expect(document.title).toBe('Mr Mime | Pokédex')
    })

    it('returns to the unfiltered Pokédex when opened directly', () => {
        renderDetails('/pokedex/122')

        expect(screen.getByRole('link', { name: '← Back to results' }))
            .toHaveAttribute('href', '/pokedex')
    })
})
