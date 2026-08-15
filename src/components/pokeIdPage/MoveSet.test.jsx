import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import MoveSet from './MoveSet'

const createPokemon = moveCount => ({
    moves: Array.from({ length: moveCount }, (_, index) => ({
        move: {
            name: `move-${String(index + 1).padStart(2, '0')}`,
            url: `https://pokeapi.co/api/v2/move/${index + 1}`,
        },
    })),
})

describe('MoveSet', () => {
    it('shows a manageable initial list and lets the user expand it', () => {
        render(<MoveSet pokeData={createPokemon(30)} />)

        expect(screen.getAllByRole('listitem')).toHaveLength(24)

        const toggle = screen.getByRole('button', { name: 'Mostrar los 30 movimientos' })
        expect(toggle).toHaveAttribute('aria-expanded', 'false')
        fireEvent.click(toggle)

        expect(screen.getAllByRole('listitem')).toHaveLength(30)
        expect(screen.getByRole('button', { name: 'Mostrar menos movimientos' }))
            .toHaveAttribute('aria-expanded', 'true')
    })

    it('renders an empty state without an expansion control', () => {
        render(<MoveSet pokeData={createPokemon(0)} />)

        expect(screen.getByText('No hay movimientos disponibles para este Pokémon.')).toBeInTheDocument()
        expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
})
