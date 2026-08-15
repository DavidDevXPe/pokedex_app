import { useCallback, useEffect } from 'react'
import useFetch from '../hooks/useFetch'
import { useParams } from 'react-router-dom'
import './styles/pokeIdPage.css'
import Atributes from '../components/pokeIdPage/Atributes'
import Stats from '../components/pokeIdPage/Stats'
import MoveSet from '../components/pokeIdPage/MoveSet'

const PokeIdPage = () => {
  const { id } = useParams()
  const {
    apiData: pokeData,
    isLoading,
    error,
    getApi: getPokeData,
  } = useFetch()

  const loadPokemon = useCallback(() => {
    getPokeData(`https://pokeapi.co/api/v2/pokemon/${id}`)
  }, [getPokeData, id])

  useEffect(() => {
    loadPokemon()
  }, [loadPokemon])

  if (isLoading) {
    return <p className='detailStatus' role='status'>Loading Pokémon details...</p>
  }

  if (error) {
    return (
      <div className='detailStatus' role='alert'>
        <p>{error}</p>
        <button type='button' onClick={loadPokemon}>Try again</button>
      </div>
    )
  }

  if (!pokeData) return null

  const primaryType = pokeData.types[0]?.type.name ?? 'normal'
  const formattedName = pokeData.name.charAt(0).toUpperCase() + pokeData.name.slice(1)

  return (
    <article className='idWrapper'>
      <div className={`typeBox pokemonTypeSurface type-${primaryType}`} aria-hidden='true'></div>
      <div className='idCard profileCard'>
        <img
          src={pokeData.sprites.other['official-artwork'].front_default}
          alt={`${pokeData.name} official artwork`}
        />
        <h2 className={`pokemonTypeTitle type-${primaryType} id`}>#{pokeData.id}</h2>
        <div className='divider'>
          <div className="linea">&nbsp;</div>
          <h3 className={`pokemonTypeTitle type-${primaryType}`}>{formattedName}</h3>
          <div className="linea">&nbsp;</div>
        </div>
        <ul className='pokeSize'>
          <li>Weight <span>{pokeData.weight / 10} kg</span></li>
          <li>Height <span>{pokeData.height / 10} m</span></li>
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
          pokeData={pokeData}
          />
        </div>
      </div>
    </article>
  )
}

export default PokeIdPage
