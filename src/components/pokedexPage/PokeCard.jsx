import { useEffect } from 'react'
import PropTypes from 'prop-types'
import useFetch from '../../hooks/useFetch'
import { Link, useLocation } from 'react-router-dom'
import { formatPokemonName } from '../../utils/pokedex'
import PokemonArtwork from '../PokemonArtwork'
import FavoriteButton from '../FavoriteButton'
import './styles/pokeCard.css'

const PokeCard = ({url}) => {
    const location = useLocation()
    const {
      apiData: pokemon,
      isLoading,
      error,
      getApi: getPokemon,
    } = useFetch()

    useEffect(() => {
      getPokemon(url)
    }, [getPokemon, url])

    if (isLoading) {
      return <div className='pokeCard pokeCardStatus' role='status'>Loading...</div>
    }

    if (error) {
      return (
        <div className='pokeCard pokeCardStatus' role='alert'>
          <p>Could not load this Pokémon.</p>
          <button type='button' onClick={() => getPokemon(url)}>Try again</button>
        </div>
      )
    }

    if (!pokemon) return null

    const primaryType = pokemon.types?.[0]?.type.name ?? 'normal'
    const formattedName = formatPokemonName(pokemon.name)
    const returnPath = `${location.pathname}${location.search}`

  return (
    <article className={`pokeCard type-${primaryType}`}>
      <FavoriteButton
        className='cardFavorite'
        pokemonId={pokemon.id}
        pokemonName={formattedName}
      />
      <Link
        to={`/pokedex/${pokemon.id}`}
        state={{ from: returnPath }}
        className='pokeCardLink'
        aria-label={`View details for ${formattedName}`}
      >
        <div
          className={`pokeCardBackdrop pokemonTypeSurface type-${primaryType}`}
          aria-hidden='true'
        ></div>
        <figure>
          <PokemonArtwork
            pokemon={pokemon}
            className='cardArtwork'
            alt={`${formattedName} official artwork`}
            loading='lazy'
          />
        </figure>
          <h3>{formattedName}</h3>
          <ul className='pokeTypes'>
            {
              pokemon.types.map(type=> (
                <li key={type.type.url} className={`slot${type.slot}`}>{formatPokemonName(type.type.name)} </li>
              ))
            }
          </ul>
          <p>type</p>
          <hr />
          <ul className='pokeStats'>
            {
              pokemon.stats.map(stat => (
                <li key={stat.stat.url}>{formatPokemonName(stat.stat.name)} <span>{stat.base_stat}</span></li>
              ))
            }
          </ul>
      </Link>
    </article>
  )
}

PokeCard.propTypes = {
  url: PropTypes.string.isRequired,
}

export default PokeCard
