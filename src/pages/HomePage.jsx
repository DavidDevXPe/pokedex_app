import { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setTrainerName } from '../store/slices/trainerName.slice'
import { useNavigate } from 'react-router-dom'
import './styles/homePage.css'

const HomePage = () => {
    const textInput = useRef();
    const [validationError, setValidationError] = useState('')
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = e => {
        e.preventDefault()
        const trainerName = textInput.current.value.trim()

        if (trainerName.length < 3) {
            setValidationError('Enter a name with at least 3 characters.')
            textInput.current.focus()
            return
        }

        setValidationError('')
        dispatch(setTrainerName(trainerName))
        navigate('/pokedex');
    }
  return (
    <main className='hpWrapper'>
        <img src='/pokedex.png' alt='Pokédex' />

        <h1 className='hpTitle'>Welcome trainer!</h1>
        <h2>To begin, give us your name</h2>
        <br /><br />
        <form onSubmit={handleSubmit} className='hpForm'>
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
