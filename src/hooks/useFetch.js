import axios from 'axios'
import { useCallback, useEffect, useRef, useState } from 'react'

const responseCache = new Map()

const getErrorMessage = (error) => {
    if (error.response?.status === 404) {
        return 'No se encontró la información solicitada.'
    }

    return 'No fue posible conectarse con PokéAPI. Inténtalo nuevamente.'
}

const useFetch = () => {
    const [apiData, setApiData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const controllerRef = useRef(null)

    const request = useCallback(async (url, transform = data => data) => {
        controllerRef.current?.abort()

        if (responseCache.has(url)) {
            setApiData(transform(responseCache.get(url)))
            setError(null)
            setIsLoading(false)
            return
        }

        const controller = new AbortController()
        controllerRef.current = controller
        setApiData(null)
        setError(null)
        setIsLoading(true)

        try {
            const response = await axios.get(url, { signal: controller.signal })
            responseCache.set(url, response.data)
            setApiData(transform(response.data))
        } catch (requestError) {
            if (requestError.code !== 'ERR_CANCELED') {
                setError(getErrorMessage(requestError))
            }
        } finally {
            if (controllerRef.current === controller) {
                setIsLoading(false)
            }
        }
    }, [])

    const getApi = useCallback(
        url => request(url),
        [request],
    )

    const getApiType = useCallback(
        url => request(url, data => ({
            results: data.pokemon.map(({ pokemon }) => pokemon),
        })),
        [request],
    )

    useEffect(() => () => controllerRef.current?.abort(), [])

    return { apiData, isLoading, error, getApi, getApiType }
}

export default useFetch
