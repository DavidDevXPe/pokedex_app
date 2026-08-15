import PropTypes from 'prop-types'
import { formatPokemonName } from '../../utils/pokedex'
import './styles/stats.css'

const MAX_BASE_STAT = 255

const Stats = ({pokeData}) => {
  return (
    <div>
        <h2>Stats</h2>
        {
            pokeData?.stats.map(stat => (
                <div key={stat.stat.name} className='statWrapper'>
                    <div className='statInfo'>
                    <h3>{formatPokemonName(stat.stat.name)}:</h3>
                    <span>{stat.base_stat}</span>
                    </div>
                    <div
                        className='back'
                        role='progressbar'
                        aria-label={stat.stat.name}
                        aria-valuemin='0'
                        aria-valuemax={MAX_BASE_STAT}
                        aria-valuenow={stat.base_stat}
                    >
                        <div
                            className='bar'
                            style={{ width: `${Math.min(stat.base_stat / MAX_BASE_STAT * 100, 100)}%` }}
                        ></div>
                    </div>
                </div>
            ))
        }
    </div>
  )
}

Stats.propTypes = {
    pokeData: PropTypes.shape({
        stats: PropTypes.arrayOf(PropTypes.shape({
            base_stat: PropTypes.number.isRequired,
            stat: PropTypes.shape({
                name: PropTypes.string.isRequired,
            }).isRequired,
        })).isRequired,
    }).isRequired,
}

export default Stats
