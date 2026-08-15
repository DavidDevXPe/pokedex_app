import { useEffect } from 'react'

const DEFAULT_TITLE = 'Pokédex | Pokémon Explorer'

const useDocumentTitle = title => {
    useEffect(() => {
        document.title = title || DEFAULT_TITLE
    }, [title])
}

export default useDocumentTitle
