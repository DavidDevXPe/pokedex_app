import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom'
import { useState } from 'react'
import PropTypes from 'prop-types'
import { describe, expect, it } from 'vitest'
import { RouteFocusManager, SkipLink } from './App'

const RouteHarness = () => (
    <>
        <RouteFocusManager />
        <Routes>
            <Route
                path='/first'
                element={(
                    <main id='main-content'>
                        <h1>First page</h1>
                        <Link to='/second'>Go to second page</Link>
                    </main>
                )}
            />
            <Route
                path='/second'
                element={(
                    <main id='main-content'>
                        <h1>Second page</h1>
                    </main>
                )}
            />
        </Routes>
    </>
)

const HashRouteHarness = ({ initialAbout = false }) => {
    const [showAbout, setShowAbout] = useState(initialAbout)

    return (
        <>
            <RouteFocusManager />
            <main id='main-content'>
                <Link to='/pokedex'>Pokémon</Link>
                <Link to='/pokedex#about'>About</Link>
                <button type='button' onClick={() => setShowAbout(true)}>Load about</button>
                <section id='filters'>Filters</section>
                {showAbout && <section id='about'>About content</section>}
            </main>
        </>
    )
}

HashRouteHarness.propTypes = {
    initialAbout: PropTypes.bool,
}

describe('RouteFocusManager', () => {
    it('moves focus to the main landmark after client-side navigation', async () => {
        render(
            <MemoryRouter initialEntries={['/first']}>
                <RouteHarness />
            </MemoryRouter>,
        )

        fireEvent.click(screen.getByRole('link', { name: 'Go to second page' }))

        await waitFor(() => {
            expect(screen.getByRole('main')).toHaveFocus()
        })
        expect(screen.getByRole('main')).toHaveAttribute('tabindex', '-1')
    })

    it('waits for a deferred hash target and moves focus to it', async () => {
        render(
            <MemoryRouter initialEntries={['/pokedex']}>
                <HashRouteHarness />
            </MemoryRouter>,
        )

        fireEvent.click(screen.getByRole('link', { name: 'About' }))
        fireEvent.click(screen.getByRole('button', { name: 'Load about' }))

        const aboutSection = await screen.findByText('About content')
        await waitFor(() => expect(aboutSection).toHaveFocus())
        expect(aboutSection).toHaveAttribute('tabindex', '-1')
    })

    it('returns to the top-level content when a hash is cleared', async () => {
        render(
            <MemoryRouter initialEntries={['/pokedex#about']}>
                <HashRouteHarness initialAbout />
            </MemoryRouter>,
        )

        await waitFor(() => expect(screen.getByText('About content')).toHaveFocus())
        window.scrollTo.mockClear()
        fireEvent.click(screen.getByRole('link', { name: 'Pokémon' }))

        await waitFor(() => expect(screen.getByRole('main')).toHaveFocus())
        expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' })
    })

    it('offers a translated skip link that focuses the stable main target', () => {
        render(
            <MemoryRouter>
                <SkipLink />
                <main id='main-content'>Main content</main>
            </MemoryRouter>,
        )

        fireEvent.click(screen.getByRole('link', { name: 'Saltar al contenido principal' }))

        expect(screen.getByRole('main')).toHaveFocus()
        expect(screen.getByRole('main')).toHaveAttribute('tabindex', '-1')
    })
})
