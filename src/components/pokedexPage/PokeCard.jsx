import { useEffect } from 'react'
import PropTypes from 'prop-types'
import useFetch from '../../hooks/useFetch'
import { Link } from 'react-router-dom'
import './styles/pokeCard.css'

const PokeCard = ({url}) => {
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

  return (
    <Link
      to={`/pokedex/${pokemon.id}`}
      className='pokeCard'
      aria-label={`View details for ${pokemon.name}`}
    >
      <div className={primaryType} aria-hidden='true'></div>
      <figure>
        <img
          src={pokemon.sprites.other['official-artwork'].front_default}
          alt={`${pokemon.name} official artwork`}
          loading='lazy'
        />
      </figure>
        <h3>{pokemon.name}</h3>
        <ul className='pokeTypes'>
          {
            pokemon.types.map(type=> (
              <li key={type.type.url} className={`slot${type.slot}`}>{type.type.name} </li>
            ))
          }
        </ul>
        <p>type</p>
        <hr />
        <ul className='pokeStats'>
          {
            pokemon.stats.map(stat => (
              <li key={stat.stat.url}>{stat.stat.name} <span>{stat.base_stat}</span></li>
            ))
          }
        </ul>
    </Link>
  )
}

PokeCard.propTypes = {
  url: PropTypes.string.isRequired,
}

export default PokeCard
