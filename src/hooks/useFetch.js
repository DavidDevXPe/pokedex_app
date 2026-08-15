import { useCallback, useEffect, useRef, useState } from 'react'
import {
    API_ERROR_CODES,
    createInvalidResponseError,
    normalizeApiError,
    subscribeToApiRequest,
} from '../api/pokeApiClient'

const isNamedApiResource = value => (
    typeof value?.name === 'string'
    && typeof value?.url === 'string'
)

const isPokemonListPayload = data => (
    Array.isArray(data?.results)
    && data.results.every(isNamedApiResource)
)

const isPokemonDetailPayload = data => (
    Number.isInteger(data?.id)
    && typeof data.name === 'string'
    && Number.isFinite(data.height)
    && Number.isFinite(data.weight)
    && Array.isArray(data.types)
    && data.types.every(item => isNamedApiResource(item?.type))
    && Array.isArray(data.abilities)
    && data.abilities.every(item => isNamedApiResource(item?.ability))
    && Array.isArray(data.stats)
    && data.stats.every(item => (
        Number.isFinite(item?.base_stat)
        && isNamedApiResource(item?.stat)
    ))
    && Array.isArray(data.moves)
    && data.moves.every(item => isNamedApiResource(item?.move))
)

const validateDefaultPayload = (url, data) => {
    try {
        const parsedUrl = new URL(url)
        if (parsedUrl.hostname !== 'pokeapi.co') return data !== undefined

        const pathname = parsedUrl.pathname.replace(/\/+$/, '')
        if (pathname === '/api/v2/pokemon') return isPokemonListPayload(data)
        if (pathname.startsWith('/api/v2/pokemon/')) return isPokemonDetailPayload(data)

        return data !== undefined
    } catch {
        return data !== undefined
    }
}

const isPokemonTypePayload = data => (
    Array.isArray(data?.pokemon)
    && data.pokemon.every(item => isNamedApiResource(item?.pokemon))
)

const useFetch = () => {
    const [apiData, setApiData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [errorDetails, setErrorDetails] = useState(null)
    const [statusCode, setStatusCode] = useState(null)
    const activeRequestRef = useRef(null)
    const requestVersionRef = useRef(0)

    const request = useCallback(async (
        url,
        transform = data => data,
        validateResponse = data => data !== undefined,
    ) => {
        if (activeRequestRef.current) {
            activeRequestRef.current.canceled = true
            activeRequestRef.current.release()
            activeRequestRef.current = null
        }

        const requestVersion = requestVersionRef.current + 1
        requestVersionRef.current = requestVersion
        setError(null)
        setErrorDetails(null)
        setStatusCode(null)

        let subscription
        const requestContext = {
            canceled: false,
            release: () => {},
        }

        try {
            subscription = subscribeToApiRequest(url, validateResponse)
            requestContext.release = subscription.release

            if (!subscription.cached) {
                activeRequestRef.current = requestContext
                setApiData(null)
                setIsLoading(true)
            }

            const responseData = subscription.cached
                ? subscription.data
                : await subscription.promise

            if (requestContext.canceled || requestVersionRef.current !== requestVersion) {
                return
            }

            try {
                setApiData(transform(responseData))
            } catch (transformError) {
                throw createInvalidResponseError(transformError)
            }
        } catch (requestError) {
            const normalizedError = normalizeApiError(requestError)
            const isCurrentRequest = requestVersionRef.current === requestVersion

            if (
                !requestContext.canceled
                && isCurrentRequest
                && normalizedError.code !== API_ERROR_CODES.CANCELED
            ) {
                const details = normalizedError.toDetails()
                setApiData(null)
                setError(details.message)
                setErrorDetails(details)
                setStatusCode(details.statusCode)
            }
        } finally {
            subscription?.release()

            if (activeRequestRef.current === requestContext) {
                activeRequestRef.current = null
            }

            if (
                !requestContext.canceled
                && requestVersionRef.current === requestVersion
            ) {
                setIsLoading(false)
            }
        }
    }, [])

    const getApi = useCallback(
        url => request(url, data => data, data => validateDefaultPayload(url, data)),
        [request],
    )

    const getApiType = useCallback(
        url => request(url, data => ({
            results: data.pokemon.map(({ pokemon }) => pokemon),
        }), isPokemonTypePayload),
        [request],
    )

    useEffect(() => () => {
        requestVersionRef.current += 1

        if (activeRequestRef.current) {
            activeRequestRef.current.canceled = true
            activeRequestRef.current.release()
            activeRequestRef.current = null
        }
    }, [])

    return {
        apiData,
        isLoading,
        error,
        errorDetails,
        statusCode,
        getApi,
        getApiType,
    }
}

export default useFetch
