import { describe, expect, it } from 'vitest'
import { getPublicAssetUrl } from './publicAsset'

describe('public asset URLs', () => {
    it('joins root-relative and relative paths with the configured Vite base', () => {
        expect(getPublicAssetUrl('/pokeball-icon.png'))
            .toBe(`${import.meta.env.BASE_URL}pokeball-icon.png`)
        expect(getPublicAssetUrl('assets/types/fire.png'))
            .toBe(`${import.meta.env.BASE_URL}assets/types/fire.png`)
    })
})
