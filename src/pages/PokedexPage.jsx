import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useSearchParams } from 'react-router-dom'
import useFetch from '../hooks/useFetch'
import useDocumentTitle from '../hooks/useDocumentTitle'
import useTranslation from '../hooks/useTranslation'
import PokeCard from '../components/pokedexPage/PokeCard'
import SelectType from '../components/pokedexPage/SelectType'
import Pagination from '../components/pokedexPage/Pagination'
import LoadingIndicator from '../components/LoadingIndicator'
import {
    ALL_POKEMONS,
    POKEMON_PER_PAGE,
    filterFavoritePokemons,
    filterPokemons,
    getPageFromSearchParams,
    normalizeSearch,
} from '../utils/pokedex'
import './styles/pokedexPage.css'

const POKEMON_LIST_URL = 'https://pokeapi.co/api/v2/pokemon/?limit=1500'
const POKEMON_TYPE_URL = 'https://pokeapi.co/api/v2/type'

const PokedexPage = () => {
    const trainerName = useSelector(store => store.trainerName)
    const favoritePokemonIds = useSelector(store => store.favoritePokemonIds ?? [])
    const location = useLocation()
    const [searchParams, setSearchParams] = useSearchParams()
    const searchTerm = normalizeSearch(searchParams.get('search') ?? '')
    const selectedType = normalizeSearch(searchParams.get('type') ?? ALL_POKEMONS) || ALL_POKEMONS
    const currentPage = getPageFromSearchParams(searchParams)
    const showFavorites = searchParams.get('favorites') === '1'
    const [searchInput, setSearchInput] = useState(searchTerm)
    const { t, translateError } = useTranslation()
    const {
        apiData: pokemons,
        isLoading,
        error,
        getApi: getPokemons,
        getApiType: getPerType,
    } = useFetch()

    useDocumentTitle(t('pokedex.documentTitle'))

    const updateSearchParams = useCallback((updates, options = {}) => {
        setSearchParams(currentParams => {
            const nextParams = new URLSearchParams(currentParams)

            Object.entries(updates).forEach(([key, value]) => {
                if (value === null || value === undefined || value === '') {
                    nextParams.delete(key)
                } else {
                    nextParams.set(key, String(value))
                }
            })

            return nextParams
        }, options)
    }, [setSearchParams])

    const loadPokemons = useCallback(() => {
        if (selectedType === ALL_POKEMONS) {
            getPokemons(POKEMON_LIST_URL)
        } else {
            getPerType(`${POKEMON_TYPE_URL}/${encodeURIComponent(selectedType)}`)
        }
    }, [getPerType, getPokemons, selectedType])

    useEffect(() => {
        loadPokemons()
    }, [loadPokemons])

    useEffect(() => {
        setSearchInput(searchTerm)
    }, [searchTerm])

    useEffect(() => {
        const sectionId = location.hash.slice(1)
        if (!sectionId) return

        document.getElementById(sectionId)?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        })
    }, [location.hash])

    const searchedPokemons = useMemo(
        () => filterPokemons(pokemons?.results ?? [], searchTerm),
        [pokemons, searchTerm],
    )
    const filteredPokemons = useMemo(
        () => showFavorites
            ? filterFavoritePokemons(searchedPokemons, favoritePokemonIds)
            : searchedPokemons,
        [favoritePokemonIds, searchedPokemons, showFavorites],
    )
    const totalPages = Math.max(1, Math.ceil(filteredPokemons.length / POKEMON_PER_PAGE))

    useEffect(() => {
        if (!pokemons || isLoading || currentPage <= totalPages) return

        updateSearchParams(
            { page: totalPages === 1 ? null : totalPages },
            { replace: true },
        )
    }, [currentPage, isLoading, pokemons, totalPages, updateSearchParams])

    const handleSubmit = event => {
        event.preventDefault()
        const normalizedSearch = normalizeSearch(searchInput)
        setSearchInput(normalizedSearch)
        updateSearchParams({ search: normalizedSearch || null, page: null })
    }

    const handleTypeChange = type => {
        updateSearchParams({
            type: type === ALL_POKEMONS ? null : type,
            page: null,
        })
    }

    const handlePageChange = page => {
        updateSearchParams({ page: page === 1 ? null : page })
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleFavoritesFilter = () => {
        updateSearchParams({
            favorites: showFavorites ? null : '1',
            page: null,
        })
    }

    const clearSearch = () => {
        setSearchInput('')
        updateSearchParams({ search: null, page: null })
    }

    const indexOfLastPokemon = currentPage * POKEMON_PER_PAGE
    const indexOfFirstPokemon = indexOfLastPokemon - POKEMON_PER_PAGE
    const currentPokemons = filteredPokemons.slice(
        indexOfFirstPokemon,
        indexOfLastPokemon,
    )

    return (
        <main className='pokedex'>
            <section className='pokeHeader' id='filters'>
                <h1 className='srOnly'>{t('pokedex.heading', { name: trainerName })}</h1>
                <div className='pokeControls'>
                    <form className='pokemonSearchForm' onSubmit={handleSubmit}>
                        <label className='srOnly' htmlFor='pokemonSearch'>{t('pokedex.searchLabel')}</label>
                        <img
                            className='searchIcon'
                            src='/assets/ui/search.png'
                            alt=''
                            aria-hidden='true'
                        />
                        <input
                            id='pokemonSearch'
                            type='search'
                            value={searchInput}
                            onChange={event => setSearchInput(event.target.value)}
                            placeholder={t('pokedex.searchPlaceholder')}
                        />
                        <button type='submit'>
                            <img className='buttonBallImage' src='/pokeball-icon.png' alt='' aria-hidden='true' />
                            {t('pokedex.find')}
                        </button>
                    </form>
                    <SelectType
                        value={selectedType}
                        onTypeChange={handleTypeChange}
                    />
                    <button
                        className={`favoriteFilter ${showFavorites ? 'active' : ''}`}
                        type='button'
                        aria-pressed={showFavorites}
                        onClick={handleFavoritesFilter}
                    >
                        <img className='filterHeartAsset' src='/assets/ui/heart_filled.png' alt='' aria-hidden='true' />
                        {t('pokedex.favorites', { count: favoritePokemonIds.length })}
                    </button>
                </div>
                {searchTerm && (
                    <div className='activeSearch'>
                        <span>{t('pokedex.activeSearch', { term: searchTerm })}</span>
                        <button className='activeSearchClear' type='button' onClick={clearSearch}>
                            <img src='/assets/ui/close.png' alt='' aria-hidden='true' />
                            <span>{t('pokedex.clear')}</span>
                        </button>
                    </div>
                )}
            </section>

            {isLoading && <LoadingIndicator className='statusMessage' label={t('pokedex.loading')} />}

            {error && (
                <div className='statusMessage' role='alert'>
                    <p>{translateError(error)}</p>
                    <button type='button' onClick={loadPokemons}>{t('pokedex.retry')}</button>
                </div>
            )}

            {!isLoading && !error && currentPokemons.length === 0 && (
                <p className='statusMessage'>
                    {showFavorites
                        ? favoritePokemonIds.length === 0
                            ? t('pokedex.noFavorites')
                            : t('pokedex.noFavoriteMatches')
                        : t('pokedex.noMatches')}
                </p>
            )}

            {!isLoading && !error && currentPokemons.length > 0 && (
                <section className='pokeContainer' aria-label={t('pokedex.results')}>
                    {currentPokemons.map(pokemon => (
                        <PokeCard key={pokemon.url} url={pokemon.url} />
                    ))}
                </section>
            )}

            {!isLoading && !error && filteredPokemons.length > POKEMON_PER_PAGE && (
                <section className='pagContainer'>
                    <Pagination
                        currentPage={currentPage}
                        postPerPage={POKEMON_PER_PAGE}
                        totalPosts={filteredPokemons.length}
                        onPageChange={handlePageChange}
                    />
                </section>
            )}

            {!isLoading && !error && (
                <section className='pokedexFeatures' id='about' aria-label={t('pokedex.aboutLabel')}>
                    <article className='featureItem'>
                        <span className='featureIcon featureIconRed' aria-hidden='true'>
                            <img className='featureBallImage' src='/pokeball-icon.png' alt='' />
                        </span>
                        <div>
                            <strong>1,000+</strong>
                            <b>Pokémon</b>
                            <p>{t('pokedex.discover')}</p>
                        </div>
                    </article>
                    <article className='featureItem'>
                        <span className='featureIcon featureIconBlue' aria-hidden='true'>18</span>
                        <div>
                            <strong>18</strong>
                            <b>{t('pokedex.types')}</b>
                            <p>{t('pokedex.filterByType')}</p>
                        </div>
                    </article>
                    <article className='featureItem'>
                        <span className='featureIcon featureIconGold' aria-hidden='true'>
                            <img className='featureStarAsset' src='/assets/ui/star_filled.png' alt='' />
                        </span>
                        <div>
                            <strong>{favoritePokemonIds.length}</strong>
                            <b>{t('pokedex.favoritesLabel')}</b>
                            <p>{t('pokedex.buildTeam')}</p>
                        </div>
                    </article>
                    <article className='featureItem'>
                        <span className='featureIcon featureIconPurple' aria-hidden='true'>↻</span>
                        <div>
                            <strong>{t('pokedex.realTime')}</strong>
                            <b>{t('pokedex.data')}</b>
                            <p>{t('pokedex.poweredBy')}</p>
                        </div>
                    </article>
                </section>
            )}
        </main>
    )
}

export default PokedexPage
