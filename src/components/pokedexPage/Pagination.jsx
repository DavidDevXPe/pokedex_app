import PropTypes from 'prop-types'
import useTranslation from '../../hooks/useTranslation'
import './styles/pagination.css'

const getVisiblePages = (currentPage, totalPages) => {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, index) => index + 1)
    }

    let startPage = Math.max(2, currentPage - 1)
    let endPage = Math.min(totalPages - 1, currentPage + 1)

    if (currentPage <= 3) {
        endPage = 4
    }

    if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3
    }

    const pages = [1]

    if (startPage > 2) pages.push('start-ellipsis')

    for (let page = startPage; page <= endPage; page += 1) {
        pages.push(page)
    }

    if (endPage < totalPages - 1) pages.push('end-ellipsis')

    pages.push(totalPages)
    return pages
}

const Pagination = ({ currentPage, postPerPage, totalPosts, onPageChange }) => {
    const { t } = useTranslation()
    const totalPages = Math.ceil(totalPosts / postPerPage)
    const visiblePages = getVisiblePages(currentPage, totalPages)

    return (
    <nav aria-label={t('pagination.label')}>
        <ul className='pagination'>
            <li>
                <button
                    type='button'
                    className='pageButton'
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    {t('pagination.previous')}
                </button>
            </li>
            {visiblePages.map(page => (
                typeof page === 'number' ? (
                    <li key={page}>
                        <button
                            type='button'
                            className={`pageButton ${page === currentPage ? 'active' : ''}`}
                            aria-current={page === currentPage ? 'page' : undefined}
                            aria-label={t('pagination.page', { page })}
                            onClick={() => onPageChange(page)}
                        >
                            {page}
                        </button>
                    </li>
                ) : (
                    <li key={page} className='pageEllipsis' aria-hidden='true'>…</li>
                )
            ))}
            <li>
                <button
                    type='button'
                    className='pageButton'
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    {t('pagination.next')}
                </button>
            </li>
        </ul>
    </nav>
    )
}

Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    postPerPage: PropTypes.number.isRequired,
    totalPosts: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
}

export default Pagination
