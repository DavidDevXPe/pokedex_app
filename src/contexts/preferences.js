import { createContext, useContext } from 'react'
import { DEFAULT_PREFERENCES } from '../utils/preferences'

export const PreferencesContext = createContext({
    ...DEFAULT_PREFERENCES,
    setLanguage: () => {},
    toggleTheme: () => {},
})

export const usePreferences = () => useContext(PreferencesContext)
