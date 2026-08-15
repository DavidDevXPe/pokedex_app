export const FAVORITES_STORAGE_KEY = 'pokedex.favoritePokemonIds'

const getLocalStorage = () => {
    if (typeof window === 'undefined') return null
    return window.localStorage
}

export const normalizeFavoritePokemonIds = favoritePokemonIds => {
    if (!Array.isArray(favoritePokemonIds)) return []

    return [...new Set(
        favoritePokemonIds
            .map(Number)
            .filter(pokemonId => Number.isInteger(pokemonId) && pokemonId > 0),
    )]
}

export const loadFavoritePokemonIds = (storage = getLocalStorage()) => {
    if (!storage) return []

    try {
        const storedValue = storage.getItem(FAVORITES_STORAGE_KEY)
        return storedValue ? normalizeFavoritePokemonIds(JSON.parse(storedValue)) : []
    } catch {
        return []
    }
}

export const persistFavoritePokemonIds = (
    favoritePokemonIds,
    storage = getLocalStorage(),
) => {
    if (!storage) return

    try {
        const normalizedIds = normalizeFavoritePokemonIds(favoritePokemonIds)

        if (normalizedIds.length > 0) {
            storage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(normalizedIds))
        } else {
            storage.removeItem(FAVORITES_STORAGE_KEY)
        }
    } catch {
        // Storage can be unavailable in private or restricted browser contexts.
    }
}
