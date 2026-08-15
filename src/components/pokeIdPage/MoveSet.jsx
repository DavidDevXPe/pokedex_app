import { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { formatPokemonName } from '../../utils/pokedex'
import './styles/moveSet.css'

const INITIAL_VISIBLE_MOVES = 24

const MoveSet = ({ pokeData }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const moves = useMemo(
    () => [...pokeData.moves].sort((firstMove, secondMove) => (
      firstMove.move.name.localeCompare(secondMove.move.name)
    )),
    [pokeData.moves],
  )
  const visibleMoves = isExpanded ? moves : moves.slice(0, INITIAL_VISIBLE_MOVES)
  const hasMoreMoves = moves.length > INITIAL_VISIBLE_MOVES

  return (
    <div className='moveContainer'>
        <h2>Moves <span>({moves.length})</span></h2>

        {moves.length === 0 ? (
          <p className='emptyMoves'>No moves are available for this Pokémon.</p>
        ) : (
          <ul id='pokemonMoves' className='movementWrapper'>
            {visibleMoves.map(move => (
              <li key={move.move.url} className='movement'>
                {formatPokemonName(move.move.name)}
              </li>
            ))}
          </ul>
        )}

        {hasMoreMoves && (
          <button
            className='moveToggle'
            type='button'
            aria-expanded={isExpanded}
            aria-controls='pokemonMoves'
            onClick={() => setIsExpanded(currentValue => !currentValue)}
          >
            {isExpanded ? 'Show fewer moves' : `Show all ${moves.length} moves`}
          </button>
        )}
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
