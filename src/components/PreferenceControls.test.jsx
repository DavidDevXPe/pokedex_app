import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PreferencesProvider } from '../contexts/PreferencesContext'
import { PREFERENCES_STORAGE_KEY } from '../utils/preferences'
import PreferenceControls from './PreferenceControls'

describe('PreferenceControls', () => {
    it('changes language and theme and persists both choices', async () => {
        render(
            <PreferencesProvider>
                <PreferenceControls />
            </PreferencesProvider>,
        )

        expect(document.documentElement).toHaveAttribute('lang', 'es')
        expect(screen.getByRole('button', { name: 'Cambiar a modo oscuro' })
            .querySelector('.themeIcon')).toBeInTheDocument()
        fireEvent.click(screen.getByRole('button', { name: 'Cambiar a inglés' }))
        expect(screen.getByRole('button', { name: 'Switch to Spanish' })).toBeInTheDocument()

        fireEvent.click(screen.getByRole('button', { name: 'Switch to dark mode' }))

        await waitFor(() => {
            expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
            expect(JSON.parse(window.localStorage.getItem(PREFERENCES_STORAGE_KEY))).toEqual({
                language: 'en',
                theme: 'dark',
            })
        })
    })
})
