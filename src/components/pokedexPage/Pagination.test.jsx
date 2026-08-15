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

        expect(screen.getByRole('button', { name: '5' })).toHaveAttribute('aria-current', 'page')

        const nextButton = screen.getByRole('button', { name: 'Siguiente' })
        expect(nextButton.querySelector('img')).toHaveAttribute('src', '/assets/ui/arrow_right.png')
        fireEvent.click(nextButton)

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

        const previousButton = screen.getByRole('button', { name: 'Anterior' })
        expect(previousButton).toBeDisabled()
        expect(previousButton.querySelector('img')).toHaveAttribute('src', '/assets/ui/arrow_left.png')
    })
})
