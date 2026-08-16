import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { toggleFavoritePokemon } from '../store/slices/favoritePokemonIds.slice'
import useTranslation from '../hooks/useTranslation'

const FavoriteButton = ({ pokemonId, pokemonName, className = '' }) => {
    const dispatch = useDispatch()
    const favoritePokemonIds = useSelector(store => store.favoritePokemonIds ?? [])
    const { t } = useTranslation()
    const isFavorite = favoritePokemonIds.includes(pokemonId)
    const accessibleLabel = isFavorite
        ? t('favorite.remove', { name: pokemonName })
        : t('favorite.add', { name: pokemonName })

    return (
        <button
            className={`favoriteButton ${isFavorite ? 'isFavorite' : ''} ${className}`.trim()}
            type='button'
            aria-label={accessibleLabel}
            aria-pressed={isFavorite}
            title={accessibleLabel}
            onClick={() => dispatch(toggleFavoritePokemon(pokemonId))}
        >
            <svg
                className='favoriteIcon'
                viewBox='0 0 24 24'
                aria-hidden='true'
                focusable='false'
            >
                <path
                    d='M20.8 8.7c0 5.1-8.8 10.1-8.8 10.1S3.2 13.8 3.2 8.7A4.7 4.7 0 0 1 12 6.3a4.7 4.7 0 0 1 8.8 2.4Z'
                    fill={isFavorite ? 'currentColor' : 'none'}
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='1.9'
                />
            </svg>
        </button>
    )
}

FavoriteButton.propTypes = {
    pokemonId: PropTypes.number.isRequired,
    pokemonName: PropTypes.string.isRequired,
    className: PropTypes.string,
}

export default FavoriteButton
