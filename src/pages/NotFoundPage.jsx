import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import useDocumentTitle from '../hooks/useDocumentTitle'
import useTranslation from '../hooks/useTranslation'
import PreferenceControls from '../components/PreferenceControls'
import './styles/notFoundPage.css'

const NotFoundPage = () => {
    const trainerName = useSelector(store => store.trainerName)
    const destination = trainerName ? '/pokedex' : '/'
    const { t } = useTranslation()

    useDocumentTitle(t('notFound.document'))

    return (
        <main id='main-content' className='notFoundPage'>
            <PreferenceControls className='notFoundPreferences' />
            <div className='notFoundBall' aria-hidden='true'>
                <span></span>
            </div>
            <p className='notFoundCode'>404</p>
            <h1>{t('notFound.title')}</h1>
            <p>{t('notFound.description')}</p>
            <Link className='notFoundLink' to={destination}>
                {trainerName ? t('notFound.returnPokedex') : t('notFound.returnHome')}
            </Link>
        </main>
    )
}

export default NotFoundPage
