import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setTrainerName } from '../store/slices/trainerName.slice'
import { setTrainerGender } from '../store/slices/trainerGender.slice'
import { useNavigate } from 'react-router-dom'
import useDocumentTitle from '../hooks/useDocumentTitle'
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

    useDocumentTitle('Welcome | Pokédex')

    const handleSubmit = e => {
        e.preventDefault()
        const trainerName = textInput.current.value.trim()

        if (trainerName.length < 3) {
            setValidationError('Enter a name with at least 3 characters.')
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
        <img src='/pokedex.png' alt='Pokédex' />

        <h1 className='hpTitle'>Welcome trainer!</h1>
        <h2>Choose your trainer and give us your name</h2>
        <form onSubmit={handleSubmit} className='hpForm'>
            <fieldset className='trainerGenderPicker'>
                <legend>Select your trainer</legend>
                <div className='trainerGenderOptions'>
                    {[
                        { value: TRAINER_GENDERS.FEMALE, label: 'Woman' },
                        { value: TRAINER_GENDERS.MALE, label: 'Man' },
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
                <label className='srOnly' htmlFor='trainerName'>Trainer name</label>
                <input
                    id='trainerName'
                    type='text'
                    ref={textInput}
                    placeholder='Your name...'
                    minLength='3'
                    required
                    aria-describedby={validationError ? 'trainerNameError' : undefined}
                />
                <button type='submit'>Catch them all!</button>
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
