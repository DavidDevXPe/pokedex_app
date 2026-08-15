export const FAVORITES_STORAGE_KEY = 'pokedex.favoritePokemonIds'

const getLocalStorage = () => {
    try {
        if (typeof window === 'undefined') return null
        return window.localStorage
    } catch {
        return null
    }
}

export const normalizeFavoritePokemonIds = favoritePokemonIds => {
    if (!Array.isArray(favoritePokemonIds)) return []

    return [...new Set(
        favoritePokemonIds
            .map(Number)
            .filter(pokemonId => Number.isInteger(pokemonId) && pokemonId > 0),
    )]
}

export const loadFavoritePokemonIds = storage => {
    try {
        const resolvedStorage = storage === undefined ? getLocalStorage() : storage
        if (!resolvedStorage) return []

        const storedValue = resolvedStorage.getItem(FAVORITES_STORAGE_KEY)
        return storedValue ? normalizeFavoritePokemonIds(JSON.parse(storedValue)) : []
    } catch {
        return []
    }
}

export const persistFavoritePokemonIds = (
    favoritePokemonIds,
    storage,
) => {
    try {
        const resolvedStorage = storage === undefined ? getLocalStorage() : storage
        if (!resolvedStorage) return

        const normalizedIds = normalizeFavoritePokemonIds(favoritePokemonIds)

        if (normalizedIds.length > 0) {
            resolvedStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(normalizedIds))
        } else {
            resolvedStorage.removeItem(FAVORITES_STORAGE_KEY)
        }
    } catch {
        // Storage can be unavailable in private or restricted browser contexts.
    }
}
