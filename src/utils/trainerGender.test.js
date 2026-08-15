import { beforeEach, describe, expect, it } from 'vitest'
import {
    DEFAULT_TRAINER_GENDER,
    getTrainerAvatarPath,
    loadTrainerGender,
    persistTrainerGender,
    TRAINER_GENDERS,
    TRAINER_GENDER_STORAGE_KEY,
} from './trainerGender'

describe('trainer gender session storage', () => {
    beforeEach(() => {
        window.sessionStorage.clear()
    })

    it('stores and restores the selected trainer gender', () => {
        persistTrainerGender(TRAINER_GENDERS.FEMALE)

        expect(window.sessionStorage.getItem(TRAINER_GENDER_STORAGE_KEY)).toBe('female')
        expect(loadTrainerGender()).toBe(TRAINER_GENDERS.FEMALE)
    })

    it('falls back to the default for invalid stored values', () => {
        window.sessionStorage.setItem(TRAINER_GENDER_STORAGE_KEY, 'invalid')

        expect(loadTrainerGender()).toBe(DEFAULT_TRAINER_GENDER)
    })

    it('returns the matching avatar path', () => {
        expect(getTrainerAvatarPath(TRAINER_GENDERS.FEMALE))
            .toBe(`${import.meta.env.BASE_URL}assets/trainers/female.png`)
        expect(getTrainerAvatarPath(TRAINER_GENDERS.MALE))
            .toBe(`${import.meta.env.BASE_URL}assets/trainers/male.png`)
    })

    it('recovers when sessionStorage access is restricted', () => {
        const storage = {
            getItem: () => {
                throw new DOMException('Blocked', 'SecurityError')
            },
            setItem: () => {
                throw new DOMException('Blocked', 'SecurityError')
            },
        }

        expect(loadTrainerGender(storage)).toBe(DEFAULT_TRAINER_GENDER)
        expect(() => persistTrainerGender(TRAINER_GENDERS.FEMALE, storage))
            .not.toThrow()
    })
})
