import { useMemo } from 'react'
import { usePreferences } from '../contexts/preferences'
import {
    getErrorTranslationKey,
    formatLocalizedNumber,
    translate,
    translatePokemonStat,
    translatePokemonType,
} from '../i18n/translations'

const useTranslation = () => {
    const { language } = usePreferences()

    return useMemo(() => ({
        language,
        formatNumber: (value, options) => formatLocalizedNumber(language, value, options),
        t: (key, values) => translate(language, key, values),
        translateError: error => translate(language, getErrorTranslationKey(error)),
        translateStat: statName => translatePokemonStat(language, statName),
        translateType: typeName => translatePokemonType(language, typeName),
    }), [language])
}

export default useTranslation
