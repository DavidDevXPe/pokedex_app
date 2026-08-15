import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { setTrainerName } from '../../store/slices/trainerName.slice'
import './styles/pokeHeader.css'

const PokeHeader = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChangeTrainer = () => {
    dispatch(setTrainerName(''))
    navigate('/', { replace: true })
  }

  return (
    <header className='headerBar'>
        <Link className='headerBrand' to='/pokedex' aria-label='Go to the Pokédex'>
          <img src='/pokedex.png' alt='Pokédex' />
        </Link>
        <button className='trainerSwitch' type='button' onClick={handleChangeTrainer}>
          Change trainer
        </button>
        <div className='headerDot' aria-hidden='true'>
            <div className='headerDot2'></div>
        </div>
    </header>
  )
}

export default PokeHeader
