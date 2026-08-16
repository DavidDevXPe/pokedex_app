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
                <svg
                    className='themeIcon'
                    viewBox='0 0 24 24'
                    aria-hidden='true'
                    focusable='false'
                >
                    {theme === THEMES.LIGHT ? (
                        <path
                            d='M20.2 15.7A8.5 8.5 0 0 1 8.3 3.8 8.5 8.5 0 1 0 20.2 15.7Z'
                            fill='currentColor'
                        />
                    ) : (
                        <>
                            <circle cx='12' cy='12' r='4.25' fill='currentColor' />
                            <path
                                d='M12 2.25V5M12 19v2.75M2.25 12H5M19 12h2.75M5.1 5.1l1.95 1.95M16.95 16.95l1.95 1.95M18.9 5.1l-1.95 1.95M7.05 16.95 5.1 18.9'
                                fill='none'
                                stroke='currentColor'
                                strokeLinecap='round'
                                strokeWidth='1.8'
                            />
                        </>
                    )}
                </svg>
            </button>
        </div>
    )
}

PreferenceControls.propTypes = {
    className: PropTypes.string,
}

export default PreferenceControls
