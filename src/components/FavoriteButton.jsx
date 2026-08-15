import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { toggleFavoritePokemon } from '../store/slices/favoritePokemonIds.slice'

const FavoriteButton = ({ pokemonId, pokemonName, className = '' }) => {
    const dispatch = useDispatch()
    const favoritePokemonIds = useSelector(store => store.favoritePokemonIds ?? [])
    const isFavorite = favoritePokemonIds.includes(pokemonId)
    const accessibleLabel = isFavorite
        ? `Remove ${pokemonName} from favorites`
        : `Add ${pokemonName} to favorites`

    return (
        <button
            className={`favoriteButton ${isFavorite ? 'isFavorite' : ''} ${className}`.trim()}
            type='button'
            aria-label={accessibleLabel}
            aria-pressed={isFavorite}
            title={accessibleLabel}
            onClick={() => dispatch(toggleFavoritePokemon(pokemonId))}
        >
            <span aria-hidden='true'>{isFavorite ? '♥' : '♡'}</span>
        </button>
    )
}

FavoriteButton.propTypes = {
    pokemonId: PropTypes.number.isRequired,
    pokemonName: PropTypes.string.isRequired,
    className: PropTypes.string,
}

export default FavoriteButton
