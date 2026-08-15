import { LANGUAGES } from '../utils/preferences'

const dictionaries = {
    es: {
        'app.loading': 'Cargando página...',
        'app.errorTitle': 'Algo salió mal',
        'app.errorDescription': 'La Pokédex encontró un error inesperado. Recarga la página para continuar.',
        'app.reload': 'Recargar Pokédex',
        'preferences.toEnglish': 'Cambiar a inglés',
        'preferences.toSpanish': 'Cambiar a español',
        'preferences.toDark': 'Cambiar a modo oscuro',
        'preferences.toLight': 'Cambiar a modo claro',
        'home.documentTitle': 'Bienvenido | Pokédex',
        'home.title': '¡Bienvenido, entrenador!',
        'home.subtitle': 'Elige tu entrenador y dinos tu nombre',
        'home.selectTrainer': 'Selecciona tu entrenador',
        'home.woman': 'Mujer',
        'home.man': 'Hombre',
        'home.nameLabel': 'Nombre del entrenador',
        'home.namePlaceholder': 'Tu nombre...',
        'home.submit': '¡Atrápalos a todos!',
        'home.validation': 'Escribe un nombre de al menos 3 caracteres.',
        'header.goToPokedex': 'Ir a la Pokédex',
        'header.sections': 'Secciones de la Pokédex',
        'header.pokemon': 'Pokémon',
        'header.types': 'Tipos',
        'header.about': 'Acerca de',
        'header.changeTrainer': 'Cambiar entrenador',
        'header.womanTrainer': 'Entrenadora',
        'header.manTrainer': 'Entrenador',
        'pokedex.documentTitle': 'Pokédex | Explorador Pokémon',
        'pokedex.heading': 'Pokédex de {name}',
        'pokedex.searchLabel': 'Buscar un Pokémon',
        'pokedex.searchPlaceholder': 'Nombre del Pokémon...',
        'pokedex.find': 'Buscar Pokémon',
        'pokedex.favorites': 'Favoritos ({count})',
        'pokedex.favoritesLabel': 'Favoritos',
        'pokedex.activeSearch': 'Búsqueda: “{term}”',
        'pokedex.clear': 'Limpiar',
        'pokedex.loading': 'Cargando Pokémon...',
        'pokedex.retry': 'Reintentar',
        'pokedex.noFavorites': 'Todavía no tienes Pokémon favoritos.',
        'pokedex.noFavoriteMatches': 'Ningún Pokémon favorito coincide con los filtros activos.',
        'pokedex.noMatches': 'Ningún Pokémon coincide con tu búsqueda.',
        'pokedex.results': 'Resultados de Pokémon',
        'pokedex.resultsHeading': 'Resultados de la Pokédex',
        'pokedex.resultsSummary': '{count} resultados. Página {page} de {totalPages}.',
        'pokedex.aboutLabel': 'Acerca de esta Pokédex',
        'pokedex.discover': 'Descúbrelos todos',
        'pokedex.types': 'Tipos',
        'pokedex.filterByType': 'Filtra por tipo',
        'pokedex.buildTeam': 'Forma tu propio equipo',
        'pokedex.realTime': 'En tiempo real',
        'pokedex.data': 'Datos',
        'pokedex.poweredBy': 'Con datos de PokéAPI',
        'select.type': 'Tipo',
        'select.all': 'Todos los Pokémon',
        'select.unavailable': 'Tipos no disponibles',
        'pagination.label': 'Páginas de resultados Pokémon',
        'pagination.previous': 'Anterior',
        'pagination.next': 'Siguiente',
        'pagination.page': 'Página {page}',
        'card.loading': 'Cargando...',
        'card.error': 'No se pudo cargar este Pokémon.',
        'card.viewDetails': 'Ver detalles de {name}',
        'card.renderAlt': 'Render 3D de {name}',
        'card.typesLabel': 'Tipos de {name}',
        'card.statsLabel': 'Estadísticas base de {name}',
        'favorite.add': 'Añadir a {name} a favoritos',
        'favorite.remove': 'Quitar a {name} de favoritos',
        'artwork.unavailable': 'Imagen no disponible',
        'detail.notFoundDocument': 'Pokémon no encontrado | Pokédex',
        'detail.document': 'Detalles del Pokémon | Pokédex',
        'detail.loading': 'Cargando detalles del Pokémon...',
        'detail.notFound': 'Pokémon no encontrado',
        'detail.back': '← Volver a resultados',
        'detail.backPlain': 'Volver a resultados',
        'detail.renderAlt': 'Render 3D de {name}',
        'detail.weight': 'Peso',
        'detail.height': 'Altura',
        'attributes.type': 'Tipo',
        'attributes.abilities': 'Habilidades',
        'stats.title': 'Estadísticas',
        'moves.title': 'Movimientos',
        'moves.empty': 'No hay movimientos disponibles para este Pokémon.',
        'moves.showFewer': 'Mostrar menos movimientos',
        'moves.showAll': 'Mostrar los {count} movimientos',
        'notFound.document': 'Página no encontrada | Pokédex',
        'notFound.title': 'Esta ruta escapó de la Pokédex',
        'notFound.description': 'La página que buscas no existe o fue trasladada.',
        'notFound.returnPokedex': 'Volver a la Pokédex',
        'notFound.returnHome': 'Volver al inicio',
        'errors.notFound': 'No se pudo encontrar la información solicitada.',
        'errors.api': 'No se pudo conectar con PokéAPI. Inténtalo nuevamente.',
    },
    en: {
        'app.loading': 'Loading page...',
        'app.errorTitle': 'Something went wrong',
        'app.errorDescription': 'The Pokédex encountered an unexpected error. Reload the page to continue.',
        'app.reload': 'Reload Pokédex',
        'preferences.toEnglish': 'Switch to English',
        'preferences.toSpanish': 'Switch to Spanish',
        'preferences.toDark': 'Switch to dark mode',
        'preferences.toLight': 'Switch to light mode',
        'home.documentTitle': 'Welcome | Pokédex',
        'home.title': 'Welcome trainer!',
        'home.subtitle': 'Choose your trainer and give us your name',
        'home.selectTrainer': 'Select your trainer',
        'home.woman': 'Woman',
        'home.man': 'Man',
        'home.nameLabel': 'Trainer name',
        'home.namePlaceholder': 'Your name...',
        'home.submit': 'Catch them all!',
        'home.validation': 'Enter a name with at least 3 characters.',
        'header.goToPokedex': 'Go to the Pokédex',
        'header.sections': 'Pokédex sections',
        'header.pokemon': 'Pokémon',
        'header.types': 'Types',
        'header.about': 'About',
        'header.changeTrainer': 'Change trainer',
        'header.womanTrainer': 'Woman trainer',
        'header.manTrainer': 'Man trainer',
        'pokedex.documentTitle': 'Pokédex | Pokémon Explorer',
        'pokedex.heading': "{name}'s Pokédex",
        'pokedex.searchLabel': 'Search a Pokémon',
        'pokedex.searchPlaceholder': 'Pokémon name...',
        'pokedex.find': 'Find Pokémon',
        'pokedex.favorites': 'Favorites ({count})',
        'pokedex.favoritesLabel': 'Favorites',
        'pokedex.activeSearch': 'Search: “{term}”',
        'pokedex.clear': 'Clear',
        'pokedex.loading': 'Loading Pokémon...',
        'pokedex.retry': 'Try again',
        'pokedex.noFavorites': 'You have no favorite Pokémon yet.',
        'pokedex.noFavoriteMatches': 'No favorite Pokémon match the active filters.',
        'pokedex.noMatches': 'No Pokémon match your search.',
        'pokedex.results': 'Pokémon results',
        'pokedex.resultsHeading': 'Pokédex results',
        'pokedex.resultsSummary': '{count} results. Page {page} of {totalPages}.',
        'pokedex.aboutLabel': 'About this Pokédex',
        'pokedex.discover': 'Discover them all',
        'pokedex.types': 'Types',
        'pokedex.filterByType': 'Filter by type',
        'pokedex.buildTeam': 'Build your own team',
        'pokedex.realTime': 'Real-time',
        'pokedex.data': 'Data',
        'pokedex.poweredBy': 'Powered by PokéAPI',
        'select.type': 'Type',
        'select.all': 'All Pokémon',
        'select.unavailable': 'Types unavailable',
        'pagination.label': 'Pokémon result pages',
        'pagination.previous': 'Previous',
        'pagination.next': 'Next',
        'pagination.page': 'Page {page}',
        'card.loading': 'Loading...',
        'card.error': 'Could not load this Pokémon.',
        'card.viewDetails': 'View details for {name}',
        'card.renderAlt': '{name} 3D render',
        'card.typesLabel': '{name} types',
        'card.statsLabel': '{name} base stats',
        'favorite.add': 'Add {name} to favorites',
        'favorite.remove': 'Remove {name} from favorites',
        'artwork.unavailable': 'Artwork unavailable',
        'detail.notFoundDocument': 'Pokémon not found | Pokédex',
        'detail.document': 'Pokémon details | Pokédex',
        'detail.loading': 'Loading Pokémon details...',
        'detail.notFound': 'Pokémon not found',
        'detail.back': '← Back to results',
        'detail.backPlain': 'Back to results',
        'detail.renderAlt': '{name} 3D render',
        'detail.weight': 'Weight',
        'detail.height': 'Height',
        'attributes.type': 'Type',
        'attributes.abilities': 'Abilities',
        'stats.title': 'Stats',
        'moves.title': 'Moves',
        'moves.empty': 'No moves are available for this Pokémon.',
        'moves.showFewer': 'Show fewer moves',
        'moves.showAll': 'Show all {count} moves',
        'notFound.document': 'Page not found | Pokédex',
        'notFound.title': 'This route escaped the Pokédex',
        'notFound.description': 'The page you are looking for does not exist or has moved.',
        'notFound.returnPokedex': 'Return to the Pokédex',
        'notFound.returnHome': 'Return home',
        'errors.notFound': 'The requested information could not be found.',
        'errors.api': 'Could not connect to PokéAPI. Please try again.',
    },
}

const typeNames = {
    es: {
        bug: 'Bicho', dark: 'Siniestro', dragon: 'Dragón', electric: 'Eléctrico',
        fairy: 'Hada', fighting: 'Lucha', fire: 'Fuego', flying: 'Volador',
        ghost: 'Fantasma', grass: 'Planta', ground: 'Tierra', ice: 'Hielo',
        normal: 'Normal', poison: 'Veneno', psychic: 'Psíquico', rock: 'Roca',
        steel: 'Acero', water: 'Agua', stellar: 'Estelar', shadow: 'Sombra',
        unknown: 'Desconocido',
    },
    en: {},
}

const statNames = {
    es: {
        hp: 'PS', attack: 'Ataque', defense: 'Defensa',
        'special-attack': 'At. Esp.', 'special-defense': 'Def. Esp.', speed: 'Velocidad',
    },
    en: {
        hp: 'HP', attack: 'ATK', defense: 'DEF',
        'special-attack': 'SP. ATK', 'special-defense': 'SP. DEF', speed: 'SPD',
    },
}

const interpolate = (template, values) => Object.entries(values).reduce(
    (translated, [key, value]) => translated.replaceAll(`{${key}}`, String(value)),
    template,
)

export const translate = (language, key, values = {}) => {
    const normalizedLanguage = language === LANGUAGES.ENGLISH ? 'en' : 'es'
    const template = dictionaries[normalizedLanguage][key]
        ?? dictionaries.es[key]
        ?? key

    return interpolate(template, values)
}

export const translatePokemonType = (language, typeName) => {
    const normalizedLanguage = language === LANGUAGES.ENGLISH ? 'en' : 'es'
    return typeNames[normalizedLanguage][typeName]
        ?? typeName.split('-').map(part => (
            part.charAt(0).toUpperCase() + part.slice(1)
        )).join(' ')
}

export const translatePokemonStat = (language, statName) => {
    const normalizedLanguage = language === LANGUAGES.ENGLISH ? 'en' : 'es'
    return statNames[normalizedLanguage][statName]
        ?? statName.split('-').map(part => (
            part.charAt(0).toUpperCase() + part.slice(1)
        )).join(' ')
}

export const getErrorTranslationKey = error => (
    error?.toLowerCase().includes('could not be found')
        ? 'errors.notFound'
        : 'errors.api'
)
