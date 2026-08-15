const TYPE_ASSET_NAMES = new Set([
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

export const getPokemonTypeAsset = typeName => (
    TYPE_ASSET_NAMES.has(typeName) ? `/assets/types/${typeName}.png` : null
)
