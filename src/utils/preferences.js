export const PREFERENCES_STORAGE_KEY = 'pokedex.preferences'

export const LANGUAGES = Object.freeze({
    ENGLISH: 'en',
    SPANISH: 'es',
})

export const THEMES = Object.freeze({
    DARK: 'dark',
    LIGHT: 'light',
})

export const DEFAULT_PREFERENCES = Object.freeze({
    language: LANGUAGES.SPANISH,
    theme: THEMES.LIGHT,
})

export const normalizeLanguage = language => (
    Object.values(LANGUAGES).includes(language)
        ? language
        : DEFAULT_PREFERENCES.language
)

export const normalizeTheme = theme => (
    Object.values(THEMES).includes(theme)
        ? theme
        : DEFAULT_PREFERENCES.theme
)

const getLocalStorage = () => {
    try {
        if (typeof window === 'undefined') return null
        return window.localStorage
    } catch {
        return null
    }
}

export const loadPreferences = storage => {
    try {
        const resolvedStorage = storage === undefined ? getLocalStorage() : storage
        if (!resolvedStorage) return { ...DEFAULT_PREFERENCES }

        const storedPreferences = JSON.parse(
            resolvedStorage.getItem(PREFERENCES_STORAGE_KEY) ?? '{}',
        )

        return {
            language: normalizeLanguage(storedPreferences.language),
            theme: normalizeTheme(storedPreferences.theme),
        }
    } catch {
        return { ...DEFAULT_PREFERENCES }
    }
}

export const persistPreferences = (
    preferences,
    storage,
) => {
    try {
        const resolvedStorage = storage === undefined ? getLocalStorage() : storage
        if (!resolvedStorage) return

        resolvedStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify({
            language: normalizeLanguage(preferences.language),
            theme: normalizeTheme(preferences.theme),
        }))
    } catch {
        // Storage can be unavailable in private or restricted browser contexts.
    }
}
