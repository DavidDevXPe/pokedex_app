import { useState } from 'react'
import PropTypes from 'prop-types'
import { getPokemonArtwork } from '../utils/pokedex'
import useTranslation from '../hooks/useTranslation'

const PokemonArtwork = ({ pokemon, alt, className, loading = 'eager' }) => {
    const { t } = useTranslation()
    const source = getPokemonArtwork(pokemon)
    const [failedSource, setFailedSource] = useState(null)
    const isUnavailable = !source || failedSource === source

    if (isUnavailable) {
        return (
            <span
                className={`pokemonArtworkFallback ${className}`}
                role='img'
                aria-label={`${alt}. ${t('artwork.unavailable')}`}
            >
                {t('artwork.unavailable')}
            </span>
        )
    }

    return (
        <img
            className={className}
            src={source}
            alt={alt}
            loading={loading}
            decoding='async'
            onError={() => setFailedSource(source)}
        />
    )
}

PokemonArtwork.propTypes = {
    pokemon: PropTypes.shape({
        sprites: PropTypes.object,
    }).isRequired,
    alt: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
    loading: PropTypes.oneOf(['eager', 'lazy']),
}

export default PokemonArtwork
