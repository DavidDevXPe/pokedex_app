import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { setTrainerName } from '../../store/slices/trainerName.slice'
import {
  getTrainerAvatarPath,
  TRAINER_GENDERS,
} from '../../utils/trainerGender'
import PreferenceControls from '../PreferenceControls'
import useTranslation from '../../hooks/useTranslation'
import { getPublicAssetUrl } from '../../utils/publicAsset'
import './styles/pokeHeader.css'

const POKEBALL_ASSET_URL = getPublicAssetUrl('pokeball-icon.png')

const PokeHeader = () => {
  const dispatch = useDispatch()
  const { hash, pathname } = useLocation()
  const navigate = useNavigate()
  const trainerName = useSelector(store => store.trainerName)
  const trainerGender = useSelector(store => store.trainerGender)
  const { t } = useTranslation()
  const trainerRole = trainerGender === TRAINER_GENDERS.FEMALE
    ? t('header.womanTrainer')
    : t('header.manTrainer')
  const changeTrainerLabel = `${trainerName}, ${trainerRole}. ${t('header.changeTrainer')}`
  const isPokedexPage = pathname === '/pokedex'
  const isPokemonCurrent = isPokedexPage && !hash
  const isTypesCurrent = isPokedexPage && hash === '#filters'
  const isAboutCurrent = isPokedexPage && hash === '#about'
  const getNavLinkClass = isCurrent => (
    `headerNavLink ${isCurrent ? 'active' : ''}`.trim()
  )

  const handleChangeTrainer = () => {
    dispatch(setTrainerName(''))
    navigate('/', { replace: true })
  }

  return (
    <header className='headerBar'>
        <div className='headerInner'>
          <Link
            className='headerBrand'
            to='/pokedex'
            aria-label={`Pokédex. ${t('header.goToPokedex')}`}
          >
            <span>P</span>
            <img className='brandBallImage' src={POKEBALL_ASSET_URL} alt='' aria-hidden='true' />
            <span>KÉDEX</span>
          </Link>

          <nav className='headerNav' aria-label={t('header.sections')}>
            <Link
              className={getNavLinkClass(isPokemonCurrent)}
              to='/pokedex'
              aria-current={isPokemonCurrent ? 'page' : undefined}
            >
              <img className='navBallImage' src={POKEBALL_ASSET_URL} alt='' aria-hidden='true' />
              {t('header.pokemon')}
            </Link>
            <Link
              className={getNavLinkClass(isTypesCurrent)}
              to='/pokedex#filters'
              aria-current={isTypesCurrent ? 'location' : undefined}
            >
              {t('header.types')}
            </Link>
            <Link
              className={getNavLinkClass(isAboutCurrent)}
              to='/pokedex#about'
              aria-current={isAboutCurrent ? 'location' : undefined}
            >
              {t('header.about')}
            </Link>
          </nav>

          <PreferenceControls className='headerPreferences' />

          <button
            className='trainerSwitch'
            type='button'
            aria-label={changeTrainerLabel}
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
          <img className='headerBallImage' src={POKEBALL_ASSET_URL} alt='' />
        </div>
    </header>
  )
}

export default PokeHeader
