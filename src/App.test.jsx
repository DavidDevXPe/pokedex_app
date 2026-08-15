import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { RouteFocusManager } from './App'

const RouteHarness = () => (
    <>
        <RouteFocusManager />
        <Routes>
            <Route
                path='/first'
                element={(
                    <main>
                        <h1>First page</h1>
                        <Link to='/second'>Go to second page</Link>
                    </main>
                )}
            />
            <Route
                path='/second'
                element={(
                    <main>
                        <h1>Second page</h1>
                    </main>
                )}
            />
        </Routes>
    </>
)

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
})
