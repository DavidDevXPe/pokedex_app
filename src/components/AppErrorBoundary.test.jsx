import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import AppErrorBoundary from './AppErrorBoundary'

const ThrowingChild = () => {
  throw new Error('Render failed')
}

describe('AppErrorBoundary', () => {
  const preventExpectedErrorLogging = event => event.preventDefault()

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    window.addEventListener('error', preventExpectedErrorLogging)
  })

  afterEach(() => {
    window.removeEventListener('error', preventExpectedErrorLogging)
  })

  it('shows a recoverable fallback when a descendant fails', () => {
    const onReset = vi.fn()

    render(
      <AppErrorBoundary
        actionLabel='Reload'
        description='Try again.'
        onReset={onReset}
        resetKey='/pokedex'
        title='Something went wrong'
      >
        <ThrowingChild />
      </AppErrorBoundary>,
    )

    expect(screen.getByRole('heading', { name: 'Something went wrong' }))
      .toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent('Try again.')

    fireEvent.click(screen.getByRole('button', { name: 'Reload' }))
    expect(onReset).toHaveBeenCalledOnce()
  })
})
