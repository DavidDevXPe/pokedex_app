import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Stats from './Stats'

describe('Stats', () => {
    it('limita visualmente la barra y conserva el valor real accesible', () => {
        render(<Stats pokeData={{
            stats: [
                { base_stat: 35, stat: { name: 'hp' } },
                { base_stat: 300, stat: { name: 'attack' } },
            ],
        }} />)

        expect(screen.getByRole('heading', { name: 'Estadísticas' })).toBeInTheDocument()
        expect(screen.getByRole('progressbar', { name: 'PS' })).toHaveAttribute('aria-valuenow', '35')

        const attackProgress = screen.getByRole('progressbar', { name: 'Ataque' })
        expect(attackProgress).toHaveAttribute('aria-valuenow', '300')
        expect(attackProgress.firstElementChild).toHaveStyle({ width: '100%' })
    })
})
