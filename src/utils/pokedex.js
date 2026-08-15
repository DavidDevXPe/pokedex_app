export const ALL_POKEMONS = 'all'
export const POKEMON_PER_PAGE = 24

export const normalizeSearch = value => value.trim().toLowerCase()

export const getPageFromSearchParams = searchParams => {
    const parsedPage = Number.parseInt(searchParams.get('page') ?? '1', 10)
    return Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1
}

export const filterPokemons = (pokemons, searchTerm) => {
    const normalizedSearch = normalizeSearch(searchTerm)

    if (!normalizedSearch) return pokemons

    return pokemons.filter(pokemon => pokemon.name.includes(normalizedSearch))
}
