import { useMemo } from 'react'
import { usePreferences } from '../contexts/preferences'
import {
    getErrorTranslationKey,
    translate,
    translatePokemonStat,
    translatePokemonType,
} from '../i18n/translations'

const useTranslation = () => {
    const { language } = usePreferences()

    return useMemo(() => ({
        language,
        t: (key, values) => translate(language, key, values),
        translateError: error => translate(language, getErrorTranslationKey(error)),
        translateStat: statName => translatePokemonStat(language, statName),
        translateType: typeName => translatePokemonType(language, typeName),
    }), [language])
}

export default useTranslation
