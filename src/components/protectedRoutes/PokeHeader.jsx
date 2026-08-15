import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { setTrainerName } from '../../store/slices/trainerName.slice'
import {
  getTrainerAvatarPath,
  TRAINER_GENDERS,
} from '../../utils/trainerGender'
import PreferenceControls from '../PreferenceControls'
import useTranslation from '../../hooks/useTranslation'
import './styles/pokeHeader.css'

const PokeHeader = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const trainerName = useSelector(store => store.trainerName)
  const trainerGender = useSelector(store => store.trainerGender)
  const { t } = useTranslation()
  const trainerRole = trainerGender === TRAINER_GENDERS.FEMALE
    ? t('header.womanTrainer')
    : t('header.manTrainer')

  const handleChangeTrainer = () => {
    dispatch(setTrainerName(''))
    navigate('/', { replace: true })
  }

  return (
    <header className='headerBar'>
        <div className='headerInner'>
          <Link className='headerBrand' to='/pokedex' aria-label={t('header.goToPokedex')}>
            <span>P</span>
            <img className='brandBallImage' src='/pokeball-icon.png' alt='' aria-hidden='true' />
            <span>KÉDEX</span>
          </Link>

          <nav className='headerNav' aria-label={t('header.sections')}>
            <Link className='headerNavLink active' to='/pokedex'>
              <img className='navBallImage' src='/pokeball-icon.png' alt='' aria-hidden='true' />
              {t('header.pokemon')}
            </Link>
            <Link className='headerNavLink' to='/pokedex#filters'>{t('header.types')}</Link>
            <Link className='headerNavLink' to='/pokedex#about'>{t('header.about')}</Link>
          </nav>

          <PreferenceControls className='headerPreferences' />

          <button
            className='trainerSwitch'
            type='button'
            aria-label={t('header.changeTrainer')}
            title={t('header.changeTrainer')}
            onClick={handleChangeTrainer}
          >
            <img
              className='trainerAvatar'
              src={getTrainerAvatarPath(trainerGender)}
              alt=''
              aria-hidden='true'
            />
            <span className='trainerIdentity'>
              <strong>{trainerName}</strong>
              <small>{trainerRole}</small>
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
