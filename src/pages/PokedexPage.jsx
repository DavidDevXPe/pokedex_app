import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import useFetch from '../hooks/useFetch'
import PokeCard from '../components/pokedexPage/PokeCard'
import SelectType from '../components/pokedexPage/SelectType'
import Pagination from '../components/pokedexPage/Pagination'
import {
    ALL_POKEMONS,
    POKEMON_PER_PAGE,
    filterPokemons,
    getPageFromSearchParams,
    normalizeSearch,
} from '../utils/pokedex'
import './styles/pokedexPage.css'

const POKEMON_LIST_URL = 'https://pokeapi.co/api/v2/pokemon/?limit=1500'
const POKEMON_TYPE_URL = 'https://pokeapi.co/api/v2/type'

const PokedexPage = () => {
    const trainerName = useSelector(store => store.trainerName)
    const [searchParams, setSearchParams] = useSearchParams()
    const searchTerm = normalizeSearch(searchParams.get('search') ?? '')
    const selectedType = normalizeSearch(searchParams.get('type') ?? ALL_POKEMONS) || ALL_POKEMONS
    const currentPage = getPageFromSearchParams(searchParams)
    const [searchInput, setSearchInput] = useState(searchTerm)
    const {
        apiData: pokemons,
        isLoading,
        error,
        getApi: getPokemons,
        getApiType: getPerType,
    } = useFetch()

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

    const filteredPokemons = useMemo(
        () => filterPokemons(pokemons?.results ?? [], searchTerm),
        [pokemons, searchTerm],
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
            <section className='pokeHeader'>
                <h3><span>Welcome {trainerName}!</span> Here you will find your favorite pokémon</h3>
                <div className='pokeControls'>
                    <form onSubmit={handleSubmit}>
                        <label className='srOnly' htmlFor='pokemonSearch'>Search a Pokémon</label>
                        <input
                            id='pokemonSearch'
                            type='search'
                            value={searchInput}
                            onChange={event => setSearchInput(event.target.value)}
                            placeholder='Pokémon name...'
                        />
                        <button type='submit'>Find Pokémon</button>
                    </form>
                    <SelectType
                        value={selectedType}
                        onTypeChange={handleTypeChange}
                    />
                </div>
                {searchTerm && (
                    <div className='activeSearch'>
                        <span>Search: “{searchTerm}”</span>
                        <button type='button' onClick={clearSearch}>Clear</button>
                    </div>
                )}
            </section>

            {isLoading && <p className='statusMessage' role='status'>Loading Pokémon...</p>}

            {error && (
                <div className='statusMessage' role='alert'>
                    <p>{error}</p>
                    <button type='button' onClick={loadPokemons}>Try again</button>
                </div>
            )}

            {!isLoading && !error && currentPokemons.length === 0 && (
                <p className='statusMessage'>No Pokémon match your search.</p>
            )}

            {!isLoading && !error && currentPokemons.length > 0 && (
                <section className='pokeContainer' aria-label='Pokémon results'>
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
        </main>
    )
}

export default PokedexPage
