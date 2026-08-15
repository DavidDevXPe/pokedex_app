import PropTypes from 'prop-types'
import useTranslation from '../../hooks/useTranslation'
import { POKEMON_TYPE_NAMES } from '../../utils/pokemonTypeAssets'
import './styles/selectType.css'

const SelectType = ({ value, onTypeChange }) => {
    const { t, translateType } = useTranslation()

    return (
    <div className='selectorGroup'>
        <label htmlFor='pokemonType'>{t('select.type')}</label>
        <select
            id='pokemonType'
            value={value}
            onChange={event => onTypeChange(event.target.value)}
            className='selector'
        >
            <option value='all'>{t('select.all')}</option>
            {POKEMON_TYPE_NAMES.map(typeName => (
                <option value={typeName} key={typeName}>{translateType(typeName)}</option>
            ))}
        </select>
    </div>
    )
}

SelectType.propTypes = {
    value: PropTypes.string.isRequired,
    onTypeChange: PropTypes.func.isRequired,
}

export default SelectType
