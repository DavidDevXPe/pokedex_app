import { useEffect } from 'react'
import PropTypes from 'prop-types'
import useFetch from '../../hooks/useFetch'
import './styles/selectType.css'

const TYPE_LIST_URL = 'https://pokeapi.co/api/v2/type'

const SelectType = ({ value, onTypeChange }) => {
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
        <label htmlFor='pokemonType'>Type</label>
        <select
            id='pokemonType'
            value={value}
            onChange={event => onTypeChange(event.target.value)}
            className='selector'
            disabled={isLoading}
        >
            <option value='all'>All Pokémon</option>
            {types?.results.map(type => (
                <option value={type.name} key={type.url}>{type.name}</option>
            ))}
        </select>
        {error && <span className='selectorError' role='alert'>Types unavailable</span>}
    </div>
    )
}

SelectType.propTypes = {
    value: PropTypes.string.isRequired,
    onTypeChange: PropTypes.func.isRequired,
}

export default SelectType
