import { Component } from 'react'
import PropTypes from 'prop-types'

class AppErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidUpdate(previousProps) {
    if (
      this.state.hasError
      && previousProps.resetKey !== this.props.resetKey
    ) {
      this.setState({ hasError: false })
    }
  }

  render() {
    if (this.state.hasError) {
      const { actionLabel, description, onReset, title } = this.props

      return (
        <main className='fatalError'>
          <div role='alert'>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          <button type='button' onClick={onReset}>{actionLabel}</button>
        </main>
      )
    }

    return this.props.children
  }
}

AppErrorBoundary.propTypes = {
  actionLabel: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  description: PropTypes.string.isRequired,
  onReset: PropTypes.func.isRequired,
  resetKey: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}

export default AppErrorBoundary
