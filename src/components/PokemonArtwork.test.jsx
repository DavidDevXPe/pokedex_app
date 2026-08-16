import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import PokemonArtwork from './PokemonArtwork'

const pokemon = {
    sprites: {
        front_default: '/sprite.png',
        other: {
            'official-artwork': { front_default: '/official.png' },
            home: { front_default: '/home.png' },
        },
    },
}

describe('PokemonArtwork', () => {
    it('uses the preferred artwork source', () => {
        render(
            <PokemonArtwork
                pokemon={pokemon}
                alt='Imagen de Pikachu'
                className='testArtwork'
            />,
        )

        expect(screen.getByRole('img', { name: 'Imagen de Pikachu' }))
            .toHaveAttribute('src', '/home.png')
    })

    it('replaces an image that fails to load with an accessible fallback', () => {
        render(
            <PokemonArtwork
                pokemon={pokemon}
                alt='Imagen de Pikachu'
                className='testArtwork'
            />,
        )

        fireEvent.error(screen.getByRole('img', { name: 'Imagen de Pikachu' }))

        expect(screen.getByRole('img', { name: /Imagen no disponible/ }))
            .toHaveTextContent('Imagen no disponible')
    })
})
