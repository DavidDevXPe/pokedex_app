const PUBLIC_BASE_URL = import.meta.env.BASE_URL

export const getPublicAssetUrl = assetPath => (
    `${PUBLIC_BASE_URL}${String(assetPath).replace(/^\/+/, '')}`
)
