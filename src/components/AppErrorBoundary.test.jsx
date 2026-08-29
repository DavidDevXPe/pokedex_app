import { fireEvent, render, screen, waitFor } from '@testing-library/react'
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

  it('recovers when any part of the route location changes', async () => {
    const boundaryProps = {
      actionLabel: 'Reload',
      description: 'Try again.',
      onReset: () => {},
      title: 'Something went wrong',
    }
    const { rerender } = render(
      <AppErrorBoundary {...boundaryProps} resetKey='/pokedex?search=pi#filters'>
        <ThrowingChild />
      </AppErrorBoundary>,
    )

    rerender(
      <AppErrorBoundary {...boundaryProps} resetKey='/pokedex?search=pika#about'>
        <p>Recovered route</p>
      </AppErrorBoundary>,
    )

    await waitFor(() => {
      expect(screen.getByText('Recovered route')).toBeInTheDocument()
    })
  })
})
