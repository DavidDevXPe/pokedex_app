import { beforeEach, describe, expect, it } from 'vitest'
import {
    TRAINER_STORAGE_KEY,
    loadTrainerName,
    persistTrainerName,
} from './trainerStorage'

describe('trainer session storage', () => {
    beforeEach(() => {
        window.sessionStorage.clear()
    })

    it('stores and restores the trainer name', () => {
        persistTrainerName('Misty')

        expect(window.sessionStorage.getItem(TRAINER_STORAGE_KEY)).toBe('Misty')
        expect(loadTrainerName()).toBe('Misty')
    })

    it('removes the stored trainer when the name is cleared', () => {
        window.sessionStorage.setItem(TRAINER_STORAGE_KEY, 'Brock')

        persistTrainerName('')

        expect(loadTrainerName()).toBe('')
    })

    it('recovers when the browser blocks access to sessionStorage itself', () => {
        const descriptor = Object.getOwnPropertyDescriptor(window, 'sessionStorage')
        Object.defineProperty(window, 'sessionStorage', {
            configurable: true,
            get: () => {
                throw new DOMException('Blocked', 'SecurityError')
            },
        })

        try {
            expect(loadTrainerName()).toBe('')
            expect(() => persistTrainerName('Misty')).not.toThrow()
        } finally {
            Object.defineProperty(window, 'sessionStorage', descriptor)
        }
    })
})
