import { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import {
    loadPreferences,
    normalizeLanguage,
    persistPreferences,
    THEMES,
} from '../utils/preferences'
import { PreferencesContext } from './preferences'

export const PreferencesProvider = ({ children }) => {
    const [preferences, setPreferences] = useState(loadPreferences)

    const setLanguage = useCallback(language => {
        setPreferences(currentPreferences => ({
            ...currentPreferences,
            language: normalizeLanguage(language),
        }))
    }, [])

    const toggleTheme = useCallback(() => {
        setPreferences(currentPreferences => ({
            ...currentPreferences,
            theme: currentPreferences.theme === THEMES.LIGHT
                ? THEMES.DARK
                : THEMES.LIGHT,
        }))
    }, [])

    useEffect(() => {
        document.documentElement.lang = preferences.language
        document.documentElement.dataset.theme = preferences.theme
        persistPreferences(preferences)
    }, [preferences])

    const value = useMemo(() => ({
        ...preferences,
        setLanguage,
        toggleTheme,
    }), [preferences, setLanguage, toggleTheme])

    return (
        <PreferencesContext.Provider value={value}>
            {children}
        </PreferencesContext.Provider>
    )
}

PreferencesProvider.propTypes = {
    children: PropTypes.node.isRequired,
}
