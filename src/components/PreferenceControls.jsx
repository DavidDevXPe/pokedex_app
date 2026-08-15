import PropTypes from 'prop-types'
import { usePreferences } from '../contexts/preferences'
import useTranslation from '../hooks/useTranslation'
import { LANGUAGES, THEMES } from '../utils/preferences'
import './styles/preferenceControls.css'

const PreferenceControls = ({ className = '' }) => {
    const { language, setLanguage, theme, toggleTheme } = usePreferences()
    const { t } = useTranslation()
    const nextLanguage = language === LANGUAGES.SPANISH
        ? LANGUAGES.ENGLISH
        : LANGUAGES.SPANISH
    const languageLabel = language === LANGUAGES.SPANISH
        ? t('preferences.toEnglish')
        : t('preferences.toSpanish')
    const themeLabel = theme === THEMES.LIGHT
        ? t('preferences.toDark')
        : t('preferences.toLight')

    return (
        <div className={`preferenceControls ${className}`.trim()}>
            <button
                className='preferenceButton languageButton'
                type='button'
                aria-label={languageLabel}
                title={languageLabel}
                onClick={() => setLanguage(nextLanguage)}
            >
                {nextLanguage.toUpperCase()}
            </button>
            <button
                className='preferenceButton themeButton'
                type='button'
                aria-label={themeLabel}
                title={themeLabel}
                aria-pressed={theme === THEMES.DARK}
                onClick={toggleTheme}
            >
                <span aria-hidden='true'>{theme === THEMES.LIGHT ? '\u263E' : '\u2600'}</span>
            </button>
        </div>
    )
}

PreferenceControls.propTypes = {
    className: PropTypes.string,
}

export default PreferenceControls
