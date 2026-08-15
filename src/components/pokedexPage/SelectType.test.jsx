import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { POKEMON_TYPE_NAMES } from '../../utils/pokemonTypeAssets'
import SelectType from './SelectType'

const useFetchMock = vi.hoisted(() => vi.fn())

vi.mock('../../hooks/useFetch', () => ({
    default: useFetchMock,
}))

vi.mock('../../hooks/useTranslation', () => ({
    default: () => ({
        t: key => ({
            'select.all': 'Todos los tipos',
            'select.type': 'Tipo',
        })[key] ?? key,
        translateType: typeName => typeName,
    }),
}))

describe('SelectType', () => {
    beforeEach(() => {
        useFetchMock.mockClear()
    })

    it('renders the 18 local Pokémon types without using the API hook', () => {
        render(<SelectType value='all' onTypeChange={vi.fn()} />)

        const select = screen.getByRole('combobox', { name: 'Tipo' })
        const options = within(select).getAllByRole('option')

        expect(options).toHaveLength(POKEMON_TYPE_NAMES.length + 1)
        expect(options.map(option => option.value)).toEqual([
            'all',
            ...POKEMON_TYPE_NAMES,
        ])
        expect(POKEMON_TYPE_NAMES).toHaveLength(18)
        expect(useFetchMock).not.toHaveBeenCalled()
    })

    it('reports a locally selected type to its consumer', () => {
        const onTypeChange = vi.fn()
        render(<SelectType value='all' onTypeChange={onTypeChange} />)

        fireEvent.change(screen.getByRole('combobox', { name: 'Tipo' }), {
            target: { value: 'grass' },
        })

        expect(onTypeChange).toHaveBeenCalledOnce()
        expect(onTypeChange).toHaveBeenCalledWith('grass')
    })
})
