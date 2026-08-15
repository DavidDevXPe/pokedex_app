import { useEffect } from 'react'
import PropTypes from 'prop-types'
import useFetch from '../../hooks/useFetch'
import { Link, useLocation } from 'react-router-dom'
import { formatPokemonName } from '../../utils/pokedex'
import PokemonArtwork from '../PokemonArtwork'
import FavoriteButton from '../FavoriteButton'
import './styles/pokeCard.css'

const STAT_LABELS = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  'special-attack': 'SP. ATK',
  'special-defense': 'SP. DEF',
  speed: 'SPD',
}

const MAX_STAT_PREVIEW = 180

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
    const displayId = String(pokemon.id).padStart(3, '0')

  return (
    <article className={`pokeCard type-${primaryType}`}>
      <span className='pokeNumber'>#{displayId}</span>
      <span className='cardBallMark' aria-hidden='true'></span>
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
          <div className='pokeCardBody'>
            <h3>{formattedName}</h3>
            <ul className='pokeTypes' aria-label={`${formattedName} types`}>
              {pokemon.types.map(type => (
                <li
                  key={type.type.url}
                  className={`pokemonTypeBadge type-${type.type.name}`}
                >
                  {formatPokemonName(type.type.name)}
                </li>
              ))}
            </ul>
            <ul className='pokeStats' aria-label={`${formattedName} base stats`}>
              {pokemon.stats.map(stat => (
                <li key={stat.stat.url}>
                  <span className='statLabel'>
                    {STAT_LABELS[stat.stat.name] ?? formatPokemonName(stat.stat.name)}
                  </span>
                  <strong>{stat.base_stat}</strong>
                  <span className='statTrack' aria-hidden='true'>
                    <span
                      className='statBar'
                      style={{ width: `${Math.min(stat.base_stat / MAX_STAT_PREVIEW * 100, 100)}%` }}
                    ></span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
      </Link>
    </article>
  )
}

PokeCard.propTypes = {
  url: PropTypes.string.isRequired,
}

export default PokeCard
