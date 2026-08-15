export const ALL_POKEMONS = 'all'
export const POKEMON_PER_PAGE = 24

export const normalizeSearch = value => value.trim().toLowerCase()

export const formatPokemonName = value => value
    .split('-')
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

export const getPokemonArtwork = pokemon => (
    pokemon?.sprites?.other?.['official-artwork']?.front_default
    ?? pokemon?.sprites?.other?.home?.front_default
    ?? pokemon?.sprites?.front_default
    ?? null
)

export const getPokedexReturnPath = from => (
    typeof from === 'string' && (from === '/pokedex' || from.startsWith('/pokedex?'))
        ? from
        : '/pokedex'
)

export const getPageFromSearchParams = searchParams => {
    const parsedPage = Number.parseInt(searchParams.get('page') ?? '1', 10)
    return Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1
}

export const filterPokemons = (pokemons, searchTerm) => {
    const normalizedSearch = normalizeSearch(searchTerm)

    if (!normalizedSearch) return pokemons

    return pokemons.filter(pokemon => pokemon.name.includes(normalizedSearch))
}
