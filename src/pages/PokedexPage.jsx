import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useSearchParams } from 'react-router-dom'
import useFetch from '../hooks/useFetch'
import useDocumentTitle from '../hooks/useDocumentTitle'
import useTranslation from '../hooks/useTranslation'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import PokeCard from '../components/pokedexPage/PokeCard'
import SelectType from '../components/pokedexPage/SelectType'
import Pagination from '../components/pokedexPage/Pagination'
import {
    ALL_POKEMONS,
    POKEMON_PER_PAGE,
    filterFavoritePokemons,
    filterPokemons,
    getPageFromSearchParams,
    normalizeSearch,
} from '../utils/pokedex'
import { POKEMON_TYPE_NAMES } from '../utils/pokemonTypeAssets'
import { getPublicAssetUrl } from '../utils/publicAsset'
import './styles/pokedexPage.css'

const POKEMON_LIST_URL = 'https://pokeapi.co/api/v2/pokemon/?limit=1500'
const POKEMON_TYPE_URL = 'https://pokeapi.co/api/v2/type'
const POKEBALL_ASSET_URL = getPublicAssetUrl('pokeball-icon.png')

const PokedexPage = () => {
    const trainerName = useSelector(store => store.trainerName)
    const favoritePokemonIds = useSelector(store => store.favoritePokemonIds ?? [])
    const location = useLocation()
    const [searchParams, setSearchParams] = useSearchParams()
    const searchTerm = normalizeSearch(searchParams.get('search') ?? '')
    const requestedType = normalizeSearch(searchParams.get('type') ?? ALL_POKEMONS) || ALL_POKEMONS
    const selectedType = requestedType === ALL_POKEMONS || POKEMON_TYPE_NAMES.includes(requestedType)
        ? requestedType
        : ALL_POKEMONS
    const currentPage = getPageFromSearchParams(searchParams)
    const showFavorites = searchParams.get('favorites') === '1'
    const [searchInput, setSearchInput] = useState(searchTerm)
    const [syncedSearchTerm, setSyncedSearchTerm] = useState(searchTerm)
    const resultsHeadingRef = useRef(null)
    const previousResultCountRef = useRef(null)
    const prefersReducedMotion = usePrefersReducedMotion()
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

    if (searchTerm !== syncedSearchTerm) {
        setSyncedSearchTerm(searchTerm)
        setSearchInput(searchTerm)
    }

    useEffect(() => {
        if (requestedType === selectedType) return
        updateSearchParams({ type: null, page: null }, { replace: true })
    }, [requestedType, selectedType, updateSearchParams])

    useEffect(() => {
        const sectionId = location.hash.slice(1)
        if (!sectionId) return

        document.getElementById(sectionId)?.scrollIntoView({
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
            block: 'start',
        })
    }, [location.hash, prefersReducedMotion])

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
        const previousCount = previousResultCountRef.current
        previousResultCountRef.current = filteredPokemons.length

        if (showFavorites && previousCount !== null && filteredPokemons.length < previousCount) {
            resultsHeadingRef.current?.focus({ preventScroll: true })
        }
    }, [filteredPokemons.length, showFavorites])

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
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
        })
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
        <main className='pokedex' aria-busy={isLoading}>
            <section className='pokeHeader' id='filters'>
                <h1 className='srOnly'>{t('pokedex.heading', { name: trainerName })}</h1>
                <div className='pokeControls'>
                    <form className='pokemonSearchForm' onSubmit={handleSubmit}>
                        <label className='srOnly' htmlFor='pokemonSearch'>{t('pokedex.searchLabel')}</label>
                        <span className='searchIcon' aria-hidden='true'></span>
                        <input
                            id='pokemonSearch'
                            type='search'
                            value={searchInput}
                            onChange={event => setSearchInput(event.target.value)}
                            placeholder={t('pokedex.searchPlaceholder')}
                            maxLength='80'
                        />
                        <button type='submit'>
                            <img className='buttonBallImage' src={POKEBALL_ASSET_URL} alt='' aria-hidden='true' />
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
                        <span aria-hidden='true'>♥</span> {t('pokedex.favorites', { count: favoritePokemonIds.length })}
                    </button>
                </div>
                {searchTerm && (
                    <div className='activeSearch'>
                        <span>{t('pokedex.activeSearch', { term: searchTerm })}</span>
                        <button type='button' onClick={clearSearch}>{t('pokedex.clear')}</button>
                    </div>
                )}
            </section>

            <h2 ref={resultsHeadingRef} className='resultsHeading' tabIndex='-1'>
                {t('pokedex.resultsHeading')}
            </h2>
            {pokemons && !isLoading && !error && (
                <p className='srOnly' role='status' aria-live='polite' aria-atomic='true'>
                    {t('pokedex.resultsSummary', {
                        count: filteredPokemons.length,
                        page: currentPage,
                        totalPages,
                    })}
                </p>
            )}

            {isLoading && <p className='statusMessage' role='status'>{t('pokedex.loading')}</p>}

            {error && (
                <div className='statusMessage' role='alert'>
                    <p>{translateError(error)}</p>
                    <button type='button' onClick={loadPokemons}>{t('pokedex.retry')}</button>
                </div>
            )}

            {pokemons && !isLoading && !error && currentPokemons.length === 0 && (
                <p className='statusMessage'>
                    {showFavorites
                        ? favoritePokemonIds.length === 0
                            ? t('pokedex.noFavorites')
                            : t('pokedex.noFavoriteMatches')
                        : t('pokedex.noMatches')}
                </p>
            )}

            {!isLoading && !error && currentPokemons.length > 0 && (
                <section
                    className='pokeContainer'
                    aria-label={t('pokedex.results')}
                >
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

            {pokemons && !isLoading && !error && (
                <section className='pokedexFeatures' id='about' aria-label={t('pokedex.aboutLabel')}>
                    <article className='featureItem'>
                        <span className='featureIcon featureIconRed' aria-hidden='true'>
                            <img className='featureBallImage' src={POKEBALL_ASSET_URL} alt='' />
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
                        <span className='featureIcon featureIconGold' aria-hidden='true'>★</span>
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
