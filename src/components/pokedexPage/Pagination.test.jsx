import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Pagination from './Pagination'

describe('Pagination', () => {
    it('marks the current page and changes to the next page', () => {
        const onPageChange = vi.fn()

        render(
            <Pagination
                currentPage={5}
                postPerPage={10}
                totalPosts={100}
                onPageChange={onPageChange}
            />,
        )

        expect(screen.getByRole('button', { name: 'Página 5' })).toHaveAttribute('aria-current', 'page')

        fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }))

        expect(onPageChange).toHaveBeenCalledWith(6)
    })

    it('disables previous on the first page', () => {
        render(
            <Pagination
                currentPage={1}
                postPerPage={10}
                totalPosts={20}
                onPageChange={() => {}}
            />,
        )

        expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled()
    })
})
