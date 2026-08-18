import { useEffect, useState } from 'react'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

const getInitialPreference = () => (
    typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia(REDUCED_MOTION_QUERY).matches
)

const usePrefersReducedMotion = () => {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(getInitialPreference)

    useEffect(() => {
        if (typeof window.matchMedia !== 'function') return undefined

        const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY)
        const handleChange = event => setPrefersReducedMotion(event.matches)

        if (typeof mediaQuery.addEventListener === 'function') {
            mediaQuery.addEventListener('change', handleChange)
            return () => mediaQuery.removeEventListener('change', handleChange)
        }

        mediaQuery.addListener(handleChange)
        return () => mediaQuery.removeListener(handleChange)
    }, [])

    return prefersReducedMotion
}

export default usePrefersReducedMotion
