import PropTypes from 'prop-types'
import './styles/moveSet.css'

const MoveSet = ({pokeData}) => {
  return (
    <div className='moveContainer'>
        <h2>Movements</h2>

        <div className='movementWrapper'>
        {
            pokeData?.moves.map(move => (
                <span key={move.move.url} className='movement'>{move.move.name}</span>
            ))
        }
        </div>
    </div>
  )
}

MoveSet.propTypes = {
    pokeData: PropTypes.shape({
        moves: PropTypes.arrayOf(PropTypes.shape({
            move: PropTypes.shape({
                name: PropTypes.string.isRequired,
                url: PropTypes.string.isRequired,
            }).isRequired,
        })).isRequired,
    }).isRequired,
}

export default MoveSet
