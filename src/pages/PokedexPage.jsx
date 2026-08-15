import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setPokemonName } from '../store/slices/pokemonName.slice';
import useFetch from '../hooks/useFetch';
import PokeCard from '../components/pokedexPage/PokeCard';
import SelectType from '../components/pokedexPage/SelectType';
import './styles/pokedexPage.css'
import Pagination from '../components/pokedexPage/Pagination';

const ALL_POKEMONS = 'allPokemons'
const POKEMON_LIST_URL = 'https://pokeapi.co/api/v2/pokemon/?limit=1500'
const POKEMON_PER_PAGE = 24

const PokedexPage = () => {
    const trainerName = useSelector(store => store.trainerName);
    const textInput = useRef()
    const pokemonName = useSelector(store => store.pokemonName)
    const dispatch = useDispatch()
    const {
        apiData: pokemons,
        isLoading,
        error,
        getApi: getPokemons,
        getApiType: getPerType,
    } = useFetch()
    const [selectValue, setSelectValue] = useState(ALL_POKEMONS)
    const [currentPage, setCurrentPage] = useState(1)

    const loadPokemons = useCallback(() => {
        if (selectValue === ALL_POKEMONS) {
            getPokemons(POKEMON_LIST_URL)
        } else {
            getPerType(selectValue)
        }
    }, [getPerType, getPokemons, selectValue])

    const handleSubmit = e => {
        e.preventDefault()
        dispatch(setPokemonName(textInput.current.value.trim().toLowerCase()))
        textInput.current.value = ''
        setCurrentPage(1)
    }

    useEffect(() => {
        loadPokemons()
    }, [loadPokemons])

    const handleTypeChange = value => {
        setSelectValue(value)
        setCurrentPage(1)
    }

    const filteredPokemons = useMemo(() => {
        const results = pokemons?.results ?? []

        if (!pokemonName) {
            return results
        }

        return results.filter(pokemon => pokemon.name.includes(pokemonName))
    }, [pokemonName, pokemons])

    const indexOfLastPokemon = currentPage * POKEMON_PER_PAGE
    const indexOfFirstPokemon = indexOfLastPokemon - POKEMON_PER_PAGE
    const currentPokemons = filteredPokemons.slice(
        indexOfFirstPokemon,
        indexOfLastPokemon,
    )

    return (
        <div className='pokedex'>
            <section className='pokeHeader'>
                <h3><span>Welcome {trainerName}!</span> Here you will find your favorite pokémon</h3>
                <div>
                    <form onSubmit={handleSubmit}>
                        <label className='srOnly' htmlFor='pokemonSearch'>Search a Pokémon</label>
                        <input
                            id='pokemonSearch'
                            type='search'
                            ref={textInput}
                            placeholder='Pokémon name...'
                        />
                        <button type='submit'>Find Pokémon</button>
                    </form>
                    <SelectType
                        value={selectValue}
                        onTypeChange={handleTypeChange}
                    />
                </div>
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
                        onPageChange={setCurrentPage}
                    />
                </section>
            )}
        </div>
    )
}

export default PokedexPage
