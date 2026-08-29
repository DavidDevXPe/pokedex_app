import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Atributes from './Atributes'

const pokemon = {
    types: [
        { slot: 1, type: { name: 'electric' } },
        { slot: 2, type: { name: 'flying' } },
    ],
    abilities: [
        { slot: 1, ability: { name: 'static' } },
        { slot: 2, ability: { name: 'lightning-rod' } },
    ],
}

describe('Atributes', () => {
    it('presenta tipos traducidos y habilidades formateadas', () => {
        render(<Atributes pokeData={pokemon} />)

        expect(screen.getByRole('heading', { name: 'Tipo' })).toBeInTheDocument()
        expect(screen.getByText('Eléctrico')).toBeInTheDocument()
        expect(screen.getByText('Volador')).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: 'Habilidades' })).toBeInTheDocument()
        expect(screen.getByText('Static')).toBeInTheDocument()
        expect(screen.getByText('Lightning Rod')).toBeInTheDocument()
    })
})
