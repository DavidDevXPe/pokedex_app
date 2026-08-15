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
    if (typeof window === 'undefined') return null
    return window.localStorage
}

export const loadPreferences = (storage = getLocalStorage()) => {
    if (!storage) return { ...DEFAULT_PREFERENCES }

    try {
        const storedPreferences = JSON.parse(
            storage.getItem(PREFERENCES_STORAGE_KEY) ?? '{}',
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
    storage = getLocalStorage(),
) => {
    if (!storage) return

    try {
        storage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify({
            language: normalizeLanguage(preferences.language),
            theme: normalizeTheme(preferences.theme),
        }))
    } catch {
        // Storage can be unavailable in private or restricted browser contexts.
    }
}
