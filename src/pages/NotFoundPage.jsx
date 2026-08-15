import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import './styles/notFoundPage.css'

const NotFoundPage = () => {
    const trainerName = useSelector(store => store.trainerName)
    const destination = trainerName ? '/pokedex' : '/'

    return (
        <main className='notFoundPage'>
            <div className='notFoundBall' aria-hidden='true'>
                <span></span>
            </div>
            <p className='notFoundCode'>404</p>
            <h1>This route escaped the Pokédex</h1>
            <p>The page you are looking for does not exist or has moved.</p>
            <Link className='notFoundLink' to={destination}>
                {trainerName ? 'Return to the Pokédex' : 'Return home'}
            </Link>
        </main>
    )
}

export default NotFoundPage
