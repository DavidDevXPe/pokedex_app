import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import useFetch from '../../hooks/useFetch'
import { Link, useLocation } from 'react-router-dom'
import { formatPokemonName, getPokemonIdFromUrl } from '../../utils/pokedex'
import { getPokemonTypeAsset } from '../../utils/pokemonTypeAssets'
import PokemonArtwork from '../PokemonArtwork'
import FavoriteButton from '../FavoriteButton'
import useTranslation from '../../hooks/useTranslation'
import './styles/pokeCard.css'

const MAX_STAT_PREVIEW = 180

const PokeCard = ({ pokemonSummary }) => {
    const cardRef = useRef(null)
    const [shouldLoad, setShouldLoad] = useState(
      () => typeof IntersectionObserver === 'undefined',
    )
    const location = useLocation()
    const { t, translateStat, translateType } = useTranslation()
    const pokemonId = getPokemonIdFromUrl(pokemonSummary.url)
    const formattedName = formatPokemonName(pokemonSummary.name)
    const routeIdentifier = pokemonId ?? pokemonSummary.name
    const returnPath = `${location.pathname}${location.search}`
    const {
      apiData: pokemonDetails,
      isLoading,
      error,
      getApi: getPokemon,
    } = useFetch()

    useEffect(() => {
      if (shouldLoad || typeof IntersectionObserver === 'undefined') return undefined

      const card = cardRef.current
      if (!card) return undefined

      const observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          setShouldLoad(true)
          observer.disconnect()
        }
      }, { rootMargin: '320px 0px' })

      observer.observe(card)
      return () => observer.disconnect()
    }, [shouldLoad])

    useEffect(() => {
      if (shouldLoad) getPokemon(pokemonSummary.url)
    }, [getPokemon, pokemonSummary.url, shouldLoad])

    const resolvedPokemonId = pokemonId ?? pokemonDetails?.id ?? null
    const displayId = resolvedPokemonId === null
      ? null
      : String(resolvedPokemonId).padStart(3, '0')
    const detailsLinkProps = {
      to: `/pokedex/${routeIdentifier}`,
      state: { from: returnPath },
      className: 'pokeCardLink',
      'aria-label': t('card.viewDetails', { name: formattedName }),
    }

    const cardHeader = (
      <>
        {displayId && <span className='pokeNumber'>#{displayId}</span>}
        <span className='cardBallMark' aria-hidden='true'></span>
        {resolvedPokemonId !== null && (
          <FavoriteButton
            className='cardFavorite'
            pokemonId={resolvedPokemonId}
            pokemonName={formattedName}
          />
        )}
      </>
    )

    if (!shouldLoad || isLoading || (!pokemonDetails && !error)) {
      return (
        <article
          ref={cardRef}
          className='pokeCard pokeCardSkeleton'
          aria-busy='true'
        >
          {cardHeader}
          <Link {...detailsLinkProps}>
            <figure className='cardSkeletonFigure' aria-hidden='true'>
              <span className='cardSkeletonArtwork'></span>
            </figure>
            <div className='pokeCardBody'>
              <h3>{formattedName}</h3>
              <div className='cardSkeletonDetails' aria-hidden='true'>
                <span className='cardSkeletonLine'></span>
                <span className='cardSkeletonLine'></span>
                <span className='cardSkeletonLine'></span>
              </div>
            </div>
          </Link>
        </article>
      )
    }

    if (error) {
      return (
        <article ref={cardRef} className='pokeCard'>
          {cardHeader}
          <Link {...detailsLinkProps}>
            <div className='pokeCardBody pokeCardErrorBody'>
              <h3>{formattedName}</h3>
              <p role='alert'>{t('card.error', { name: formattedName })}</p>
            </div>
          </Link>
          <button
            className='cardRetry'
            type='button'
            aria-label={t('card.retry', { name: formattedName })}
            onClick={() => getPokemon(pokemonSummary.url)}
          >
            {t('pokedex.retry')}
          </button>
        </article>
      )
    }

    if (!pokemonDetails) return null

    const primaryType = pokemonDetails.types?.[0]?.type.name ?? 'normal'

  return (
    <article className={`pokeCard type-${primaryType}`}>
      {cardHeader}
      <Link {...detailsLinkProps}>
        <div
          className={`pokeCardBackdrop pokemonTypeSurface type-${primaryType}`}
          aria-hidden='true'
        ></div>
        <figure>
          <PokemonArtwork
            pokemon={pokemonDetails}
            className='cardArtwork'
            alt={t('card.renderAlt', { name: formattedName })}
            loading='lazy'
          />
        </figure>
          <div className='pokeCardBody'>
            <h3>{formattedName}</h3>
            <ul className='pokeTypes' aria-label={t('card.typesLabel', { name: formattedName })}>
              {pokemonDetails.types.map(type => {
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
              {pokemonDetails.stats.map(stat => (
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
  pokemonSummary: PropTypes.shape({
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
}

export default PokeCard
