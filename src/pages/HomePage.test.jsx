import { configureStore } from '@reduxjs/toolkit'
import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import trainerGender from '../store/slices/trainerGender.slice'
import trainerName from '../store/slices/trainerName.slice'
import { PreferencesProvider } from '../contexts/PreferencesContext'
import { TRAINER_GENDERS } from '../utils/trainerGender'
import HomePage from './HomePage'

const renderHomePage = (initialGender = TRAINER_GENDERS.MALE) => {
    const store = configureStore({
        reducer: { trainerGender, trainerName },
        preloadedState: {
            trainerGender: initialGender,
            trainerName: '',
        },
    })

    render(
        <PreferencesProvider>
            <Provider store={store}>
                <MemoryRouter initialEntries={['/']}>
                    <Routes>
                        <Route path='/' element={<HomePage />} />
                        <Route path='/pokedex' element={<p>Pokédex route</p>} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        </PreferencesProvider>,
    )

    return store
}

describe('HomePage trainer selection', () => {
    it('restores the selected trainer gender', () => {
        renderHomePage(TRAINER_GENDERS.FEMALE)

        expect(screen.getByRole('radio', { name: 'Mujer' })).toBeChecked()
        expect(screen.getByRole('radio', { name: 'Hombre' })).not.toBeChecked()
    })

    it('stores the chosen gender together with the trainer name', () => {
        const store = renderHomePage()

        fireEvent.click(screen.getByRole('radio', { name: 'Mujer' }))
        fireEvent.change(screen.getByRole('textbox', { name: 'Nombre del entrenador' }), {
            target: { value: 'Misty' },
        })
        fireEvent.click(screen.getByRole('button', { name: '¡Atrápalos a todos!' }))

        expect(store.getState()).toMatchObject({
            trainerGender: TRAINER_GENDERS.FEMALE,
            trainerName: 'Misty',
        })
        expect(screen.getByText('Pokédex route')).toBeInTheDocument()
    })

    it('uses localized React validation and preserves the ARIA error relationship', () => {
        renderHomePage()

        const nameInput = screen.getByRole('textbox', { name: 'Nombre del entrenador' })
        const submitButton = screen.getByRole('button', { name: '¡Atrápalos a todos!' })

        expect(nameInput.closest('form')).toHaveAttribute('novalidate')

        fireEvent.click(submitButton)
        expect(screen.getByRole('alert')).toHaveTextContent('Escribe el nombre de tu entrenador.')
        expect(nameInput).toHaveAttribute('aria-invalid', 'true')
        expect(nameInput).toHaveAttribute('aria-describedby', 'trainerNameError')
        expect(nameInput).toHaveFocus()

        fireEvent.click(screen.getByRole('button', { name: 'EN: Cambiar a inglés' }))
        expect(screen.getByRole('alert')).toHaveTextContent('Enter your trainer name.')
        fireEvent.click(screen.getByRole('button', { name: 'ES: Switch to Spanish' }))

        fireEvent.change(nameInput, { target: { value: 'Al' } })
        fireEvent.click(submitButton)
        expect(screen.getByRole('alert')).toHaveTextContent('El nombre debe tener al menos 3 caracteres.')

        fireEvent.change(nameInput, { target: { value: 'a'.repeat(41) } })
        fireEvent.click(submitButton)
        expect(screen.getByRole('alert')).toHaveTextContent('El nombre no puede superar los 40 caracteres.')
    })

    it('does not expose the decorative bottom bar as a footer landmark', () => {
        renderHomePage()

        expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument()
        expect(document.querySelector('.hpBar')).toHaveAttribute('aria-hidden', 'true')
    })
})
