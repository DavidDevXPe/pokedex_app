import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PokeCard from './PokeCard'

const fetchMocks = vi.hoisted(() => ({
    getApi: vi.fn(),
    state: {
        apiData: null,
        isLoading: false,
        error: null,
    },
}))

vi.mock('../../hooks/useFetch', () => ({
    default: () => ({
        ...fetchMocks.state,
        getApi: fetchMocks.getApi,
    }),
}))

vi.mock('../../hooks/useTranslation', () => ({
    default: () => ({
        t: (key, values = {}) => values.name ? `${key}: ${values.name}` : key,
        translateStat: statName => statName,
        translateType: typeName => typeName,
    }),
}))

vi.mock('../FavoriteButton', () => ({
    default: () => <button type='button'>Favorite</button>,
}))

vi.mock('../PokemonArtwork', () => ({
    default: () => <img src='/api-home.png' alt='Imagen de Bulbasaur' />,
}))

const POKEMON_URL = 'https://pokeapi.co/api/v2/pokemon/1/'
const POKEMON_SUMMARY = {
    name: 'bulbasaur',
    url: POKEMON_URL,
}
const BULBASAUR = {
    id: 1,
    name: 'bulbasaur',
    sprites: {
        other: {
            home: { front_default: '/api-home.png' },
        },
    },
    types: [
        { type: { name: 'grass', url: '/type/12/' } },
        { type: { name: 'poison', url: '/type/4/' } },
    ],
    stats: [
        { base_stat: 45, stat: { name: 'hp', url: '/stat/1/' } },
        { base_stat: 49, stat: { name: 'attack', url: '/stat/2/' } },
        { base_stat: 49, stat: { name: 'defense', url: '/stat/3/' } },
        { base_stat: 65, stat: { name: 'special-attack', url: '/stat/4/' } },
        { base_stat: 65, stat: { name: 'special-defense', url: '/stat/5/' } },
        { base_stat: 45, stat: { name: 'speed', url: '/stat/6/' } },
    ],
}
const renderCard = () => render(
    <MemoryRouter>
        <PokeCard pokemonSummary={POKEMON_SUMMARY} />
    </MemoryRouter>,
)

describe('PokeCard deferred loading', () => {
    let observerCallback
    let observer

    beforeEach(() => {
        fetchMocks.getApi.mockClear()
        fetchMocks.state.apiData = null
        fetchMocks.state.isLoading = false
        fetchMocks.state.error = null
        observerCallback = null
        observer = null

        class IntersectionObserverMock {
            constructor(callback, options) {
                observerCallback = callback
                this.options = options
                this.observe = vi.fn()
                this.disconnect = vi.fn()
                observer = this
            }
        }

        vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)
    })

    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('waits for intersection before requesting the Pokémon', async () => {
        const { container } = renderCard()
        const skeleton = container.querySelector('.pokeCardSkeleton')
        const detailsLink = screen.getByRole('link', {
            name: 'card.viewDetails: Bulbasaur',
        })

        expect(skeleton).toBeInTheDocument()
        expect(skeleton).toHaveAttribute('aria-busy', 'true')
        expect(skeleton).not.toHaveAttribute('aria-hidden')
        expect(screen.getByRole('heading', { name: 'Bulbasaur' })).toBeInTheDocument()
        expect(detailsLink).toHaveAttribute('href', '/pokedex/1')
        expect(fetchMocks.getApi).not.toHaveBeenCalled()
        expect(observer.observe).toHaveBeenCalledWith(skeleton)
        expect(observer.options).toEqual({ rootMargin: '320px 0px' })

        act(() => {
            observerCallback([{ isIntersecting: false }])
        })
        expect(fetchMocks.getApi).not.toHaveBeenCalled()

        act(() => {
            observerCallback([{ isIntersecting: true }])
        })

        await waitFor(() => {
            expect(fetchMocks.getApi).toHaveBeenCalledOnce()
        })
        expect(fetchMocks.getApi).toHaveBeenCalledWith(POKEMON_URL)
        expect(observer.disconnect).toHaveBeenCalled()
    })

    it('loads immediately when IntersectionObserver is unavailable', async () => {
        vi.stubGlobal('IntersectionObserver', undefined)
        renderCard()

        await waitFor(() => {
            expect(fetchMocks.getApi).toHaveBeenCalledWith(POKEMON_URL)
        })
    })
})

describe('PokeCard content', () => {
    beforeEach(() => {
        fetchMocks.getApi.mockClear()
        fetchMocks.state.apiData = BULBASAUR
        fetchMocks.state.isLoading = false
        fetchMocks.state.error = null
        vi.stubGlobal('IntersectionObserver', undefined)
    })

    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('renders the API artwork, types and six base statistics', () => {
        const { container } = renderCard()
        const card = container.querySelector('.pokeCard.type-grass')
        const detailsLink = screen.getByRole('link', { name: 'card.viewDetails: Bulbasaur' })
        const favoriteButton = screen.getByRole('button', { name: 'Favorite' })
        const statBars = container.querySelectorAll('.statBar')

        expect(card).toBeInTheDocument()
        expect(screen.getByText('#001')).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: 'Bulbasaur' })).toBeInTheDocument()
        expect(screen.getByRole('img', { name: 'Imagen de Bulbasaur' }))
            .toHaveAttribute('src', '/api-home.png')
        expect(screen.getByText('grass')).toBeInTheDocument()
        expect(screen.getByText('poison')).toBeInTheDocument()
        expect(statBars).toHaveLength(6)
        expect(statBars[0]).toHaveStyle({ width: '25%' })
        expect(detailsLink).not.toContainElement(favoriteButton)
    })

    it('offers a retry when the card request fails', async () => {
        fetchMocks.state.apiData = null
        fetchMocks.state.error = 'network error'
        renderCard()

        await waitFor(() => {
            expect(fetchMocks.getApi).toHaveBeenCalledTimes(1)
        })

        fireEvent.click(screen.getByRole('button', { name: 'card.retry: Bulbasaur' }))
        expect(fetchMocks.getApi).toHaveBeenCalledTimes(2)
        expect(fetchMocks.getApi).toHaveBeenLastCalledWith(POKEMON_URL)
        expect(screen.getByRole('alert')).toHaveTextContent('card.error: Bulbasaur')
        expect(screen.getByRole('link', { name: 'card.viewDetails: Bulbasaur' }))
            .toHaveAttribute('href', '/pokedex/1')
    })
})
