import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import useDocumentTitle from './useDocumentTitle'

describe('useDocumentTitle', () => {
    it('aplica el título indicado y vuelve al título predeterminado si está vacío', () => {
        const { rerender } = renderHook(
            ({ title }) => useDocumentTitle(title),
            { initialProps: { title: 'Pikachu | Pokédex' } },
        )

        expect(document.title).toBe('Pikachu | Pokédex')

        rerender({ title: '' })

        expect(document.title).toBe('Pokédex | Explorador Pokémon')
    })
})
