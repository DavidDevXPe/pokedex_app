import { useCallback, useEffect } from 'react'
import useFetch from '../hooks/useFetch'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { Link, useLocation, useParams } from 'react-router-dom'
import { formatPokemonName, getPokedexReturnPath } from '../utils/pokedex'
import './styles/pokeIdPage.css'
import Atributes from '../components/pokeIdPage/Atributes'
import Stats from '../components/pokeIdPage/Stats'
import MoveSet from '../components/pokeIdPage/MoveSet'
import PokemonArtwork from '../components/PokemonArtwork'
import FavoriteButton from '../components/FavoriteButton'
import useTranslation from '../hooks/useTranslation'
import LoadingIndicator from '../components/LoadingIndicator'

const PokeIdPage = () => {
  const { t, translateError } = useTranslation()
  const { id } = useParams()
  const location = useLocation()
  const {
    apiData: pokeData,
    isLoading,
    error,
    statusCode,
    getApi: getPokeData,
  } = useFetch()
  const formattedName = pokeData ? formatPokemonName(pokeData.name) : ''
  const returnPath = getPokedexReturnPath(location.state?.from)

  const pageTitle = statusCode === 404
    ? t('detail.notFoundDocument')
    : formattedName
      ? `${formattedName} | Pokédex`
      : t('detail.document')

  useDocumentTitle(pageTitle)

  const loadPokemon = useCallback(() => {
    getPokeData(`https://pokeapi.co/api/v2/pokemon/${id}`)
  }, [getPokeData, id])

  useEffect(() => {
    loadPokemon()
  }, [loadPokemon])

  if (isLoading) {
    return <LoadingIndicator className='detailStatus' label={t('detail.loading')} />
  }

  if (error) {
    return (
      <div className='detailStatus' role='alert'>
        {statusCode === 404 && <h1>{t('detail.notFound')}</h1>}
        <p>{translateError(error)}</p>
        <div className='detailStatusActions'>
          {statusCode !== 404 && (
            <button type='button' onClick={loadPokemon}>{t('pokedex.retry')}</button>
          )}
          <Link className='detailStatusLink' to={returnPath}>{t('detail.backPlain')}</Link>
        </div>
      </div>
    )
  }

  if (!pokeData) return null

  const primaryType = pokeData.types[0]?.type.name ?? 'normal'
  return (
    <article className='idWrapper'>
      <Link className='detailBackLink' to={returnPath}>{t('detail.back')}</Link>
      <div className={`typeBox pokemonTypeSurface type-${primaryType}`} aria-hidden='true'></div>
      <div className='idCard profileCard'>
        <FavoriteButton
          className='detailFavorite'
          pokemonId={pokeData.id}
          pokemonName={formattedName}
        />
        <PokemonArtwork
          pokemon={pokeData}
          className='detailArtwork'
          alt={t('detail.renderAlt', { name: formattedName })}
        />
        <h2 className={`pokemonTypeTitle type-${primaryType} id`}>#{pokeData.id}</h2>
        <div className='divider'>
          <div className="linea">&nbsp;</div>
          <h3 className={`pokemonTypeTitle type-${primaryType}`}>{formattedName}</h3>
          <div className="linea">&nbsp;</div>
        </div>
        <ul className='pokeSize'>
          <li>{t('detail.weight')} <span>{pokeData.weight / 10} kg</span></li>
          <li>{t('detail.height')} <span>{pokeData.height / 10} m</span></li>
        </ul>

        <div className='atributes'>
          <Atributes 
          pokeData={pokeData}
          />
        </div>

        <div className='stats'>
          <Stats 
          pokeData={pokeData}
          />
        </div>

      </div>

      <div className='idCard movesCard'>
        <div className='moveSet'>
          <MoveSet
          key={pokeData.id}
          pokeData={pokeData}
          />
        </div>
      </div>
    </article>
  )
}

export default PokeIdPage
