import axios from 'axios'

export const API_REQUEST_TIMEOUT_MS = 10_000
export const API_CACHE_TTL_MS = 5 * 60 * 1_000
export const API_CACHE_MAX_ENTRIES = 150

export const API_ERROR_CODES = Object.freeze({
    CANCELED: 'canceled',
    HTTP: 'http',
    INVALID_RESPONSE: 'invalid-response',
    NETWORK: 'network',
    NOT_FOUND: 'not-found',
    TIMEOUT: 'timeout',
    UNKNOWN: 'unknown',
})

const NOT_FOUND_MESSAGE = 'The requested information could not be found.'
const API_ERROR_MESSAGE = 'Could not connect to PokéAPI. Please try again.'
const TIMEOUT_MESSAGE = 'The PokéAPI request timed out. Please try again.'

const responseCache = new Map()
const pendingRequests = new Map()

export class ApiClientError extends Error {
    constructor({ code, message, statusCode = null, retryable = false, cause }) {
        super(message, cause ? { cause } : undefined)
        this.name = 'ApiClientError'
        this.code = code
        this.statusCode = statusCode
        this.retryable = retryable
    }

    toDetails() {
        return {
            code: this.code,
            message: this.message,
            statusCode: this.statusCode,
            retryable: this.retryable,
        }
    }
}

export const canonicalizeApiUrl = url => {
    if (typeof url !== 'string') return ''

    const trimmedUrl = url.trim()
    if (!trimmedUrl) return ''

    try {
        const parsedUrl = new URL(trimmedUrl)
        parsedUrl.hash = ''
        parsedUrl.searchParams.sort()

        if (parsedUrl.pathname.length > 1) {
            parsedUrl.pathname = parsedUrl.pathname.replace(/\/+$/, '')
        }

        return parsedUrl.toString()
    } catch {
        return trimmedUrl
            .replace(/#.*$/, '')
            .replace(/\/+$/, '')
    }
}

const safelyValidateResponse = (validateResponse, data) => {
    try {
        return Boolean(validateResponse(data))
    } catch {
        return false
    }
}

const readCachedResponse = (cacheKey, validateResponse) => {
    const cachedResponse = responseCache.get(cacheKey)
    if (!cachedResponse) return { hit: false, data: undefined }

    if (cachedResponse.expiresAt <= Date.now()) {
        responseCache.delete(cacheKey)
        return { hit: false, data: undefined }
    }

    if (!safelyValidateResponse(validateResponse, cachedResponse.data)) {
        responseCache.delete(cacheKey)
        return { hit: false, data: undefined }
    }

    // Reinserting the entry makes Map insertion order an inexpensive LRU list.
    responseCache.delete(cacheKey)
    responseCache.set(cacheKey, cachedResponse)
    return { hit: true, data: cachedResponse.data }
}

const cacheResponse = (cacheKey, data) => {
    responseCache.delete(cacheKey)
    responseCache.set(cacheKey, {
        data,
        expiresAt: Date.now() + API_CACHE_TTL_MS,
    })

    while (responseCache.size > API_CACHE_MAX_ENTRIES) {
        const leastRecentlyUsedKey = responseCache.keys().next().value
        responseCache.delete(leastRecentlyUsedKey)
    }
}

const isTimeoutError = error => (
    error?.code === 'ECONNABORTED'
    || error?.code === 'ETIMEDOUT'
)

const isCanceledError = error => (
    error?.code === 'ERR_CANCELED'
    || error?.name === 'CanceledError'
    || error?.name === 'AbortError'
)

export const normalizeApiError = error => {
    if (error instanceof ApiClientError) return error

    const statusCode = Number.isInteger(error?.response?.status)
        ? error.response.status
        : null

    if (statusCode === 404) {
        return new ApiClientError({
            code: API_ERROR_CODES.NOT_FOUND,
            message: NOT_FOUND_MESSAGE,
            statusCode,
            retryable: false,
            cause: error,
        })
    }

    if (isTimeoutError(error)) {
        return new ApiClientError({
            code: API_ERROR_CODES.TIMEOUT,
            message: TIMEOUT_MESSAGE,
            statusCode,
            retryable: true,
            cause: error,
        })
    }

    if (isCanceledError(error)) {
        return new ApiClientError({
            code: API_ERROR_CODES.CANCELED,
            message: API_ERROR_MESSAGE,
            statusCode,
            retryable: false,
            cause: error,
        })
    }

    if (statusCode !== null) {
        return new ApiClientError({
            code: API_ERROR_CODES.HTTP,
            message: API_ERROR_MESSAGE,
            statusCode,
            retryable: statusCode === 408 || statusCode === 429 || statusCode >= 500,
            cause: error,
        })
    }

    if (error?.request) {
        return new ApiClientError({
            code: API_ERROR_CODES.NETWORK,
            message: API_ERROR_MESSAGE,
            retryable: true,
            cause: error,
        })
    }

    return new ApiClientError({
        code: API_ERROR_CODES.UNKNOWN,
        message: API_ERROR_MESSAGE,
        retryable: true,
        cause: error,
    })
}

export const createInvalidResponseError = cause => new ApiClientError({
    code: API_ERROR_CODES.INVALID_RESPONSE,
    message: API_ERROR_MESSAGE,
    retryable: true,
    cause,
})

const createPendingRequest = (url, cacheKey) => {
    const controller = new AbortController()
    const entry = {
        controller,
        subscriberCount: 0,
        settled: false,
        validators: new Set(),
        promise: null,
    }

    entry.promise = axios.get(url, {
        signal: controller.signal,
        timeout: API_REQUEST_TIMEOUT_MS,
    }).then(response => {
        if (!response || response.data === undefined) {
            throw createInvalidResponseError()
        }

        const hasInvalidPayload = [...entry.validators].some(
            subscription => !safelyValidateResponse(
                subscription.validateResponse,
                response.data,
            ),
        )
        if (hasInvalidPayload) throw createInvalidResponseError()

        cacheResponse(cacheKey, response.data)
        return response.data
    }).catch(error => {
        throw normalizeApiError(error)
    })

    pendingRequests.set(cacheKey, entry)

    entry.promise.then(
        () => {
            entry.settled = true
            if (pendingRequests.get(cacheKey) === entry) {
                pendingRequests.delete(cacheKey)
            }
        },
        () => {
            entry.settled = true
            if (pendingRequests.get(cacheKey) === entry) {
                pendingRequests.delete(cacheKey)
            }
        },
    )

    return entry
}

export const subscribeToApiRequest = (url, validateResponse = () => true) => {
    const cacheKey = canonicalizeApiUrl(url)
    if (!cacheKey) {
        throw createInvalidResponseError()
    }

    const cachedResponse = readCachedResponse(cacheKey, validateResponse)
    if (cachedResponse.hit) {
        return {
            cached: true,
            data: cachedResponse.data,
            promise: Promise.resolve(cachedResponse.data),
            release: () => {},
        }
    }

    let entry = pendingRequests.get(cacheKey)
    if (entry?.controller.signal.aborted) {
        pendingRequests.delete(cacheKey)
        entry = null
    }

    if (!entry) {
        entry = createPendingRequest(url, cacheKey)
    }

    const validatorSubscription = { validateResponse }
    entry.validators.add(validatorSubscription)
    entry.subscriberCount += 1
    let released = false

    return {
        cached: false,
        data: undefined,
        promise: entry.promise,
        release: () => {
            if (released) return

            released = true
            entry.validators.delete(validatorSubscription)
            entry.subscriberCount = Math.max(0, entry.subscriberCount - 1)

            if (entry.subscriberCount === 0 && !entry.settled) {
                entry.controller.abort()
            }
        },
    }
}

export const clearApiClientState = () => {
    pendingRequests.forEach(entry => entry.controller.abort())
    pendingRequests.clear()
    responseCache.clear()
}
