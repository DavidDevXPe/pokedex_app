import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setTrainerName } from '../store/slices/trainerName.slice'
import { setTrainerGender } from '../store/slices/trainerGender.slice'
import { useNavigate } from 'react-router-dom'
import useDocumentTitle from '../hooks/useDocumentTitle'
import useTranslation from '../hooks/useTranslation'
import PreferenceControls from '../components/PreferenceControls'
import {
    getTrainerAvatarPath,
    TRAINER_GENDERS,
} from '../utils/trainerGender'
import './styles/homePage.css'

const HomePage = () => {
    const textInput = useRef();
    const storedGender = useSelector(store => store.trainerGender)
    const [trainerGender, selectTrainerGender] = useState(
        storedGender ?? TRAINER_GENDERS.MALE,
    )
    const [validationError, setValidationError] = useState('')
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation()

    useDocumentTitle(t('home.documentTitle'))

    const handleSubmit = e => {
        e.preventDefault()
        const trainerName = textInput.current.value.trim()

        if (trainerName.length < 3) {
            setValidationError(t('home.validation'))
            textInput.current.focus()
            return
        }

        setValidationError('')
        dispatch(setTrainerGender(trainerGender))
        dispatch(setTrainerName(trainerName))
        navigate('/pokedex');
    }
  return (
    <main className='hpWrapper'>
        <PreferenceControls className='homePreferences' />
        <img src='/pokedex.png' alt='Pokédex' />

        <h1 className='hpTitle'>{t('home.title')}</h1>
        <h2>{t('home.subtitle')}</h2>
        <form onSubmit={handleSubmit} className='hpForm'>
            <fieldset className='trainerGenderPicker'>
                <legend>{t('home.selectTrainer')}</legend>
                <div className='trainerGenderOptions'>
                    {[
                        { value: TRAINER_GENDERS.FEMALE, label: t('home.woman') },
                        { value: TRAINER_GENDERS.MALE, label: t('home.man') },
                    ].map(option => (
                        <label
                            className={`trainerGenderOption ${trainerGender === option.value ? 'selected' : ''}`}
                            key={option.value}
                        >
                            <input
                                type='radio'
                                name='trainerGender'
                                value={option.value}
                                checked={trainerGender === option.value}
                                onChange={() => selectTrainerGender(option.value)}
                            />
                            <img src={getTrainerAvatarPath(option.value)} alt='' aria-hidden='true' />
                            <span>{option.label}</span>
                        </label>
                    ))}
                </div>
            </fieldset>
            <div className='hpNameRow'>
                <label className='srOnly' htmlFor='trainerName'>{t('home.nameLabel')}</label>
                <input
                    id='trainerName'
                    type='text'
                    ref={textInput}
                    placeholder={t('home.namePlaceholder')}
                    minLength='3'
                    required
                    aria-describedby={validationError ? 'trainerNameError' : undefined}
                />
                <button type='submit'>{t('home.submit')}</button>
            </div>
        </form>
        {validationError && (
          <p id='trainerNameError' className='formError' role='alert'>{validationError}</p>
        )}
        <footer className='hpBar'>
          <div className='hpDot'>
            <div className='hpDot2'></div>
          </div>
        </footer>
    </main>
  )
}

export default HomePage
