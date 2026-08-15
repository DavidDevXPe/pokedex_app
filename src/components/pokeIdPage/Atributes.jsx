import PropTypes from 'prop-types'
import { formatPokemonName } from '../../utils/pokedex'
import useTranslation from '../../hooks/useTranslation'
import './styles/atributes.css'

const Atributes = ({ pokeData }) => {
    const { t, translateType } = useTranslation()
    return (
        <div className='aWrapper'>
            <div className='aContainer'>
                <h2>{t('attributes.type')}</h2>
                <ul className='aBoxer'>
                    {
                        pokeData?.types.map(type => (
                            <li
                                key={type.slot}
                                className={`aBox pokemonTypeBadge type-${type.type.name}`}
                            >
                                {translateType(type.type.name)}
                            </li>
                        ))
                    }
                </ul>
            </div>

            <div className='aContainer'>
                <h2>{t('attributes.abilities')}</h2>
                <ul className='aBoxer'>
                    {
                        pokeData?.abilities.map(ability => (
                            <li key={ability.slot} className='aBox'>{formatPokemonName(ability.ability.name)}</li>
                        ))
                    }
                </ul>
            </div>

        </div>
    )
}

Atributes.propTypes = {
    pokeData: PropTypes.shape({
        types: PropTypes.arrayOf(PropTypes.shape({
            slot: PropTypes.number.isRequired,
            type: PropTypes.shape({
                name: PropTypes.string.isRequired,
            }).isRequired,
        })).isRequired,
        abilities: PropTypes.arrayOf(PropTypes.shape({
            slot: PropTypes.number.isRequired,
            ability: PropTypes.shape({
                name: PropTypes.string.isRequired,
            }).isRequired,
        })).isRequired,
    }).isRequired,
}

export default Atributes
