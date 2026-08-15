export const TRAINER_STORAGE_KEY = 'pokedex.trainerName'

const getSessionStorage = () => {
    if (typeof window === 'undefined') return null
    return window.sessionStorage
}

export const loadTrainerName = (storage = getSessionStorage()) => {
    if (!storage) return ''

    try {
        return storage.getItem(TRAINER_STORAGE_KEY) ?? ''
    } catch {
        return ''
    }
}

export const persistTrainerName = (trainerName, storage = getSessionStorage()) => {
    if (!storage) return

    try {
        if (trainerName) {
            storage.setItem(TRAINER_STORAGE_KEY, trainerName)
        } else {
            storage.removeItem(TRAINER_STORAGE_KEY)
        }
    } catch {
        // Storage can be unavailable in private or restricted browser contexts.
    }
}
