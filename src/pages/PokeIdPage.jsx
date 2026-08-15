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
    return (
      <main className='detailStatus'>
        <h1 className='srOnly'>{t('detail.document')}</h1>
        <p role='status'>{t('detail.loading')}</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className='detailStatus'>
        <h1 className={statusCode === 404 ? '' : 'srOnly'}>
          {statusCode === 404 ? t('detail.notFound') : t('detail.document')}
        </h1>
        <div role='alert'>
          <p>{translateError(error)}</p>
          <div className='detailStatusActions'>
            {statusCode !== 404 && (
              <button type='button' onClick={loadPokemon}>{t('pokedex.retry')}</button>
            )}
            <Link className='detailStatusLink' to={returnPath}>{t('detail.backPlain')}</Link>
          </div>
        </div>
      </main>
    )
  }

  if (!pokeData) return null

  const primaryType = pokeData.types[0]?.type.name ?? 'normal'
  return (
    <main className='idWrapper'>
      <Link className='detailBackLink' to={returnPath}>{t('detail.back')}</Link>
      <div className={`typeBox pokemonTypeSurface type-${primaryType}`} aria-hidden='true'></div>
      <section className='idCard profileCard' aria-labelledby='pokemonDetailTitle'>
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
        <p className={`pokemonTypeTitle type-${primaryType} id`}>#{pokeData.id}</p>
        <div className='divider'>
          <div className='linea' aria-hidden='true'></div>
          <h1 id='pokemonDetailTitle' className={`pokemonTypeTitle type-${primaryType}`}>
            {formattedName}
          </h1>
          <div className='linea' aria-hidden='true'></div>
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

      </section>

      <section className='idCard movesCard'>
        <div className='moveSet'>
          <MoveSet
          key={pokeData.id}
          pokeData={pokeData}
          />
        </div>
      </section>
    </main>
  )
}

export default PokeIdPage
