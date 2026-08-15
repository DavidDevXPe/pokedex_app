import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { setTrainerName } from '../../store/slices/trainerName.slice'
import './styles/pokeHeader.css'

const PokeHeader = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const trainerName = useSelector(store => store.trainerName)

  const handleChangeTrainer = () => {
    dispatch(setTrainerName(''))
    navigate('/', { replace: true })
  }

  return (
    <header className='headerBar'>
        <div className='headerInner'>
          <Link className='headerBrand' to='/pokedex' aria-label='Go to the Pokédex'>
            <span>P</span>
            <img className='brandBallImage' src='/pokeball-icon.png' alt='' aria-hidden='true' />
            <span>KÉDEX</span>
          </Link>

          <nav className='headerNav' aria-label='Pokédex sections'>
            <Link className='headerNavLink active' to='/pokedex'>
              <img className='navBallImage' src='/pokeball-icon.png' alt='' aria-hidden='true' />
              Pokémon
            </Link>
            <Link className='headerNavLink' to='/pokedex#filters'>Types</Link>
            <Link className='headerNavLink' to='/pokedex#about'>About</Link>
          </nav>

          <button
            className='trainerSwitch'
            type='button'
            aria-label='Change trainer'
            title='Change trainer'
            onClick={handleChangeTrainer}
          >
            <img
              className='trainerAvatar'
              src='/trainer-avatar.png'
              alt=''
              aria-hidden='true'
            />
            <span className='trainerIdentity'>
              <strong>{trainerName}</strong>
              <small>Trainer</small>
            </span>
            <span className='trainerChevron' aria-hidden='true'></span>
          </button>
        </div>

        <div className='headerRail' aria-hidden='true'>
          <img className='headerBallImage' src='/pokeball-icon.png' alt='' />
        </div>
    </header>
  )
}

export default PokeHeader
