import { useEffect } from 'react'
import PropTypes from 'prop-types'
import useFetch from '../../hooks/useFetch'
import useTranslation from '../../hooks/useTranslation'
import './styles/selectType.css'

const TYPE_LIST_URL = 'https://pokeapi.co/api/v2/type'

const SelectType = ({ value, onTypeChange }) => {
    const { t, translateType } = useTranslation()
    const {
        apiData: types,
        isLoading,
        error,
        getApi: getTypes,
    } = useFetch()

    useEffect(() => {
        getTypes(TYPE_LIST_URL)
    }, [getTypes])

    return (
    <div className='selectorGroup'>
        <label htmlFor='pokemonType'>
            <img className='selectorFilterIcon' src='/assets/ui/filter.png' alt='' aria-hidden='true' />
            {t('select.type')}
        </label>
        <select
            id='pokemonType'
            value={value}
            onChange={event => onTypeChange(event.target.value)}
            className='selector'
            disabled={isLoading}
        >
            <option value='all'>{t('select.all')}</option>
            {types?.results.map(type => (
                <option value={type.name} key={type.url}>{translateType(type.name)}</option>
            ))}
        </select>
        {error && <span className='selectorError' role='alert'>{t('select.unavailable')}</span>}
    </div>
    )
}

SelectType.propTypes = {
    value: PropTypes.string.isRequired,
    onTypeChange: PropTypes.func.isRequired,
}

export default SelectType
