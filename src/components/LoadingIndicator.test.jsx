import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import LoadingIndicator from './LoadingIndicator'

describe('LoadingIndicator', () => {
    it('shows a branded, accessible loading state', () => {
        render(<LoadingIndicator label='Cargando Pokémon...' />)

        const status = screen.getByRole('status')
        expect(status).toHaveTextContent('Cargando Pokémon...')
        expect(status.querySelector('img')).toHaveAttribute(
            'src',
            '/assets/ui/pokeball_spinner.png',
        )
    })
})
