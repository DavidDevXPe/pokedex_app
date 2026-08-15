import { getPublicAssetUrl } from './publicAsset'

export const POKEMON_TYPE_NAMES = Object.freeze([
    'bug',
    'dark',
    'dragon',
    'electric',
    'fairy',
    'fighting',
    'fire',
    'flying',
    'ghost',
    'grass',
    'ground',
    'ice',
    'normal',
    'poison',
    'psychic',
    'rock',
    'steel',
    'water',
])

const TYPE_ASSET_NAMES = new Set(POKEMON_TYPE_NAMES)

export const getPokemonTypeAsset = typeName => (
    TYPE_ASSET_NAMES.has(typeName)
        ? getPublicAssetUrl(`assets/types/${typeName}.png`)
        : null
)
