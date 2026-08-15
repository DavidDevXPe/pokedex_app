import { act, render, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PokeCard from './PokeCard'

const fetchMocks = vi.hoisted(() => ({
    getApi: vi.fn(),
}))

vi.mock('../../hooks/useFetch', () => ({
    default: () => ({
        apiData: null,
        isLoading: false,
        error: null,
        getApi: fetchMocks.getApi,
    }),
}))

vi.mock('../../hooks/useTranslation', () => ({
    default: () => ({
        t: key => key,
        translateStat: statName => statName,
        translateType: typeName => typeName,
    }),
}))

vi.mock('../FavoriteButton', () => ({
    default: () => <button type='button'>Favorite</button>,
}))

vi.mock('../PokemonArtwork', () => ({
    default: () => <img alt='Pokémon' />,
}))

const POKEMON_URL = 'https://pokeapi.co/api/v2/pokemon/25/'

const renderCard = () => render(
    <MemoryRouter>
        <PokeCard url={POKEMON_URL} />
    </MemoryRouter>,
)

describe('PokeCard deferred loading', () => {
    let observerCallback
    let observer

    beforeEach(() => {
        fetchMocks.getApi.mockClear()
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

        expect(skeleton).toBeInTheDocument()
        expect(skeleton).toHaveAttribute('aria-hidden', 'true')
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
