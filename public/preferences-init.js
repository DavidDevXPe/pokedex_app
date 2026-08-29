(() => {
  try {
    const stored = JSON.parse(localStorage.getItem('pokedex.preferences') ?? '{}')
    const language = stored.language === 'en' ? 'en' : 'es'
    const theme = stored.theme === 'dark' ? 'dark' : 'light'

    document.documentElement.lang = language
    document.documentElement.dataset.theme = theme
  } catch {
    // The HTML defaults remain valid when storage is unavailable or corrupt.
  }
})()
