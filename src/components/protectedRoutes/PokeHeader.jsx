import './styles/pokeHeader.css'

const PokeHeader = () => {
  return (
    <div className='headerBar'>
        <img src='/pokedex.png' alt='Pokédex' />
        <div className='headerDot'>
            <div className='headerDot2'></div>
        </div>
    </div>
  )
}

export default PokeHeader
