import PropTypes from 'prop-types'

const LoadingIndicator = ({ label, className = '' }) => (
    <div className={`loadingIndicator ${className}`.trim()} role='status'>
        <img
            className='loadingSpinnerAsset'
            src='/assets/ui/pokeball_spinner.png'
            alt=''
            aria-hidden='true'
        />
        <span>{label}</span>
    </div>
)

LoadingIndicator.propTypes = {
    label: PropTypes.string.isRequired,
    className: PropTypes.string,
}

export default LoadingIndicator
