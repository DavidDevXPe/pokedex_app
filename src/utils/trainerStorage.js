export const TRAINER_STORAGE_KEY = 'pokedex.trainerName'

const getSessionStorage = () => {
    try {
        if (typeof window === 'undefined') return null
        return window.sessionStorage
    } catch {
        return null
    }
}

export const loadTrainerName = storage => {
    try {
        const resolvedStorage = storage === undefined ? getSessionStorage() : storage
        if (!resolvedStorage) return ''

        return resolvedStorage.getItem(TRAINER_STORAGE_KEY) ?? ''
    } catch {
        return ''
    }
}

export const persistTrainerName = (trainerName, storage) => {
    try {
        const resolvedStorage = storage === undefined ? getSessionStorage() : storage
        if (!resolvedStorage) return

        if (trainerName) {
            resolvedStorage.setItem(TRAINER_STORAGE_KEY, trainerName)
        } else {
            resolvedStorage.removeItem(TRAINER_STORAGE_KEY)
        }
    } catch {
        // Storage can be unavailable in private or restricted browser contexts.
    }
}
