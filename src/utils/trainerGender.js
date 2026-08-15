import { getPublicAssetUrl } from './publicAsset'

export const TRAINER_GENDER_STORAGE_KEY = 'pokedex.trainerGender'

export const TRAINER_GENDERS = Object.freeze({
    FEMALE: 'female',
    MALE: 'male',
})

export const DEFAULT_TRAINER_GENDER = TRAINER_GENDERS.MALE

export const normalizeTrainerGender = gender => (
    Object.values(TRAINER_GENDERS).includes(gender)
        ? gender
        : DEFAULT_TRAINER_GENDER
)

export const getTrainerAvatarPath = gender => (
    getPublicAssetUrl(`assets/trainers/${normalizeTrainerGender(gender)}.png`)
)

export const getTrainerGenderLabel = gender => (
    normalizeTrainerGender(gender) === TRAINER_GENDERS.FEMALE ? 'Woman' : 'Man'
)

const getSessionStorage = () => {
    try {
        if (typeof window === 'undefined') return null
        return window.sessionStorage
    } catch {
        return null
    }
}

export const loadTrainerGender = storage => {
    try {
        const resolvedStorage = storage === undefined ? getSessionStorage() : storage
        if (!resolvedStorage) return DEFAULT_TRAINER_GENDER

        return normalizeTrainerGender(
            resolvedStorage.getItem(TRAINER_GENDER_STORAGE_KEY),
        )
    } catch {
        return DEFAULT_TRAINER_GENDER
    }
}

export const persistTrainerGender = (gender, storage) => {
    try {
        const resolvedStorage = storage === undefined ? getSessionStorage() : storage
        if (!resolvedStorage) return

        resolvedStorage.setItem(
            TRAINER_GENDER_STORAGE_KEY,
            normalizeTrainerGender(gender),
        )
    } catch {
        // Storage can be unavailable in private or restricted browser contexts.
    }
}
