import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

Object.defineProperty(window, 'scrollTo', {
    configurable: true,
    value: vi.fn(),
})

afterEach(() => {
    cleanup()
    window.sessionStorage.clear()
    window.localStorage.clear()
    document.documentElement.lang = 'es'
    document.documentElement.dataset.theme = 'light'
})
