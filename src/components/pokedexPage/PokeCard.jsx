import { useEffect } from 'react'
import PropTypes from 'prop-types'
import useFetch from '../../hooks/useFetch'
import { Link, useLocation } from 'react-router-dom'
import { formatPokemonName } from '../../utils/pokedex'
import { getPokemonTypeAsset } from '../../utils/pokemonTypeAssets'
import PokemonArtwork from '../PokemonArtwork'
import FavoriteButton from '../FavoriteButton'
import LoadingIndicator from '../LoadingIndicator'
import useTranslation from '../../hooks/useTranslation'
import './styles/pokeCard.css'

const MAX_STAT_PREVIEW = 180

const PokeCard = ({url}) => {
    const location = useLocation()
    const { t, translateStat, translateType } = useTranslation()
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
      return <LoadingIndicator className='pokeCard pokeCardStatus' label={t('card.loading')} />
    }

    if (error) {
      return (
        <div className='pokeCard pokeCardStatus' role='alert'>
          <p>{t('card.error')}</p>
          <button type='button' onClick={() => getPokemon(url)}>{t('pokedex.retry')}</button>
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
        aria-label={t('card.viewDetails', { name: formattedName })}
      >
        <div
          className={`pokeCardBackdrop pokemonTypeSurface type-${primaryType}`}
          aria-hidden='true'
        ></div>
        <figure>
          <PokemonArtwork
            pokemon={pokemon}
            className='cardArtwork'
            alt={t('card.renderAlt', { name: formattedName })}
            loading='lazy'
          />
        </figure>
          <div className='pokeCardBody'>
            <h3>{formattedName}</h3>
            <ul className='pokeTypes' aria-label={t('card.typesLabel', { name: formattedName })}>
              {pokemon.types.map(type => {
                const typeName = type.type.name
                const typeAsset = getPokemonTypeAsset(typeName)

                return (
                  <li
                    key={type.type.url}
                    className={`pokemonTypeBadge type-${typeName} ${typeAsset ? 'pokemonTypeBadgeAsset' : ''}`}
                  >
                    {typeAsset && (
                      <span className='typeAssetIcon' aria-hidden='true'>
                        <img src={typeAsset} alt='' loading='lazy' />
                      </span>
                    )}
                    <span>{translateType(typeName)}</span>
                  </li>
                )
              })}
            </ul>
            <ul className='pokeStats' aria-label={t('card.statsLabel', { name: formattedName })}>
              {pokemon.stats.map(stat => (
                <li key={stat.stat.url}>
                  <span className='statLabel'>
                    {translateStat(stat.stat.name)}
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
