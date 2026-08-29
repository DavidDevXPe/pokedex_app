import { expect, test } from '@playwright/test'
import axe from 'axe-core'

const artwork = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='

const pokemonSeeds = [
  [25, 'pikachu', 'electric'],
  [1, 'bulbasaur', 'grass'],
  [4, 'charmander', 'fire'],
  [7, 'squirtle', 'water'],
  [10, 'caterpie', 'bug'],
  [16, 'pidgey', 'flying'],
  [19, 'rattata', 'normal'],
  [27, 'sandshrew', 'ground'],
  [29, 'nidoran-f', 'poison'],
  [35, 'clefairy', 'fairy'],
  [37, 'vulpix', 'fire'],
  [41, 'zubat', 'poison'],
  [52, 'meowth', 'normal'],
  [54, 'psyduck', 'water'],
  [56, 'mankey', 'fighting'],
  [63, 'abra', 'psychic'],
  [66, 'machop', 'fighting'],
  [72, 'tentacool', 'water'],
  [74, 'geodude', 'rock'],
  [81, 'magnemite', 'steel'],
  [92, 'gastly', 'ghost'],
  [95, 'onix', 'rock'],
  [124, 'jynx', 'ice'],
  [133, 'eevee', 'normal'],
  [147, 'dratini', 'dragon'],
  [197, 'umbreon', 'dark'],
].map(([id, name, type]) => ({ id, name, type }))

const createPokemon = ({ id, name, type }) => ({
  id,
  name,
  height: id === 25 ? 4 : 10,
  weight: id === 25 ? 60 : 100,
  sprites: { other: { home: { front_default: artwork } } },
  types: [{
    slot: 1,
    type: { name: type, url: `https://pokeapi.co/api/v2/type/${type}/` },
  }],
  abilities: [{
    slot: 1,
    ability: {
      name: id === 25 ? 'static' : 'run-away',
      url: `https://pokeapi.co/api/v2/ability/${id}/`,
    },
  }],
  stats: [
    ['hp', 35, 1],
    ['attack', 55, 2],
    ['defense', 40, 3],
    ['special-attack', 50, 4],
    ['special-defense', 50, 5],
    ['speed', 90, 6],
  ].map(([statName, baseStat, statId]) => ({
    base_stat: baseStat,
    stat: { name: statName, url: `https://pokeapi.co/api/v2/stat/${statId}/` },
  })),
  moves: [{
    move: {
      name: id === 25 ? 'thunder-shock' : 'tackle',
      url: `https://pokeapi.co/api/v2/move/${id}/`,
    },
  }],
})

const pokemonFixtures = pokemonSeeds.map(createPokemon)

const fulfillJson = (route, json) => route.fulfill({
  status: 200,
  contentType: 'application/json',
  body: JSON.stringify(json),
})

const mockPokeApi = page => page.route('https://pokeapi.co/api/v2/**', route => {
  const requestURL = new URL(route.request().url())

  if (
    requestURL.pathname === '/api/v2/pokemon/'
    && requestURL.searchParams.get('limit') === '1500'
  ) {
    return fulfillJson(route, {
      results: pokemonSeeds.map(({ id, name }) => ({
        name,
        url: `https://pokeapi.co/api/v2/pokemon/${id}/`,
      })),
    })
  }

  if (requestURL.pathname === '/api/v2/type') {
    return fulfillJson(route, {
      results: [...new Set(pokemonSeeds.map(({ type }) => type))].map(type => ({
        name: type,
        url: `https://pokeapi.co/api/v2/type/${type}/`,
      })),
    })
  }

  const typeMatch = requestURL.pathname.match(/^\/api\/v2\/type\/([^/]+)\/?$/)
  if (typeMatch) {
    const requestedType = decodeURIComponent(typeMatch[1])
    return fulfillJson(route, {
      pokemon: pokemonSeeds
        .filter(({ type }) => type === requestedType)
        .map(({ id, name }) => ({
          pokemon: {
            name,
            url: `https://pokeapi.co/api/v2/pokemon/${id}/`,
          },
          slot: 1,
        })),
    })
  }

  const detailMatch = requestURL.pathname.match(/^\/api\/v2\/pokemon\/(\d+)\/?$/)
  if (detailMatch) {
    const pokemon = pokemonFixtures.find(({ id }) => id === Number(detailMatch[1]))
    if (pokemon) return fulfillJson(route, pokemon)
  }

  return route.fulfill({
    status: 404,
    contentType: 'application/json',
    body: JSON.stringify({ detail: 'Not found' }),
  })
})

const gradientContrastChecks = [
  {
    selector: ":root[data-theme='light'] .hpTitle",
    foreground: '#b3142c',
    backgrounds: ['#ffffff', '#f6f7f9', '#e3e8ef'],
  },
  {
    selector: ":root[data-theme='light'] .hpWrapper > h2",
    foreground: '#505a6b',
    backgrounds: ['#ffffff', '#f6f7f9', '#e3e8ef'],
  },
  {
    selector: ":root[data-theme='light'] .trainerGenderPicker legend",
    foreground: '#191c20',
    backgrounds: ['#ffffff', '#f6f7f9', '#e3e8ef'],
  },
  {
    selector: ":root[data-theme='dark'] .hpTitle",
    foreground: '#ff929c',
    backgrounds: ['#242c37', '#151b23', '#0d1117'],
  },
  {
    selector: ":root[data-theme='dark'] .hpWrapper > h2",
    foreground: '#abb5c4',
    backgrounds: ['#242c37', '#151b23', '#0d1117'],
  },
  {
    selector: ":root[data-theme='dark'] .trainerGenderPicker legend",
    foreground: '#f4f6f8',
    backgrounds: ['#242c37', '#151b23', '#0d1117'],
  },
  {
    selector: '.headerBrand, .headerNavLink:not(.active), .trainerSwitch, .headerPreferences .preferenceButton',
    foreground: '#ffffff',
    backgrounds: ['#a90816', '#bd0c1a', '#a50715'],
  },
  {
    selector: '.headerNavLink.active',
    foreground: '#ffffff',
    backgrounds: ['#272b30', '#111315'],
  },
  {
    selector: '.pokemonSearchForm button[type="submit"], .favoriteFilter.active, .pageButton.active',
    foreground: '#ffffff',
    backgrounds: ['#b70d1a', '#920711'],
  },
  {
    selector: ":root[data-theme='light'] .resultsHeading",
    foreground: '#191c20',
    backgrounds: ['#ffffff', '#f8fafc'],
  },
  {
    selector: ":root[data-theme='light'] .selectorGroup label",
    foreground: '#505a6b',
    backgrounds: ['#ffffff', '#f8fafc'],
  },
  {
    selector: ":root[data-theme='dark'] .resultsHeading",
    foreground: '#f4f6f8',
    backgrounds: ['#252d38', '#131921', '#0d1117'],
  },
  {
    selector: ":root[data-theme='dark'] .selectorGroup label",
    foreground: '#abb5c4',
    backgrounds: ['#252d38', '#131921', '#0d1117'],
  },
  {
    selector: '.pokeNumber',
    foreground: '#3f4752',
    backgrounds: ['#ffffff'],
  },
  {
    selector: ":root[data-theme='light'] .pageButton:not(.active)",
    foreground: '#191c20',
    backgrounds: ['#ffffff'],
  },
  {
    selector: ":root[data-theme='dark'] .pageButton:not(.active)",
    foreground: '#f4f6f8',
    backgrounds: ['#181e27'],
  },
  {
    selector: '.featureIconGold',
    foreground: '#1f2937',
    backgrounds: ['#e6a800'],
  },
  {
    selector: '.featureIconPurple',
    foreground: '#ffffff',
    backgrounds: ['#781394'],
  },
  {
    selector: ":root[data-theme='light'] .notFoundCode",
    foreground: '#c20e1c',
    backgrounds: ['#ffffff', '#f4f6f8', '#e4e8ed'],
  },
  {
    selector: ":root[data-theme='light'] .notFoundPage h1",
    foreground: '#191c20',
    backgrounds: ['#ffffff', '#f4f6f8', '#e4e8ed'],
  },
  {
    selector: ":root[data-theme='light'] .notFoundPage > p:not(.notFoundCode)",
    foreground: '#505a6b',
    backgrounds: ['#ffffff', '#f4f6f8', '#e4e8ed'],
  },
  {
    selector: ":root[data-theme='dark'] .notFoundCode",
    foreground: '#ff929c',
    backgrounds: ['#242c37', '#151b23', '#0d1117'],
  },
  {
    selector: ":root[data-theme='dark'] .notFoundPage h1",
    foreground: '#f4f6f8',
    backgrounds: ['#242c37', '#151b23', '#0d1117'],
  },
]

const getRelativeLuminance = hexColor => {
  const channels = hexColor.match(/[\da-f]{2}/gi).map(channel => (
    Number.parseInt(channel, 16) / 255
  )).map(channel => (
    channel <= 0.03928
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4
  ))

  return (0.2126 * channels[0]) + (0.7152 * channels[1]) + (0.0722 * channels[2])
}

const getContrastRatio = (firstColor, secondColor) => {
  const firstLuminance = getRelativeLuminance(firstColor)
  const secondLuminance = getRelativeLuminance(secondColor)
  const lighter = Math.max(firstLuminance, secondLuminance)
  const darker = Math.min(firstLuminance, secondLuminance)
  return (lighter + 0.05) / (darker + 0.05)
}

const expectDeclaredGradientContrast = () => {
  gradientContrastChecks.forEach(({ backgrounds, foreground, selector }) => {
    backgrounds.forEach(background => {
      expect(
        getContrastRatio(foreground, background),
        `Contraste insuficiente declarado para ${selector}: ${foreground} sobre ${background}`,
      ).toBeGreaterThanOrEqual(4.5)
    })
  })
}

const expectNoAccessibilityViolations = async page => {
  expectDeclaredGradientContrast()

  await page.evaluate(() => {
    globalThis.axe = undefined
  })
  await page.addScriptTag({ content: axe.source })

  const audit = await page.evaluate(async approvedGradientSelectors => {
    const results = await globalThis.axe.run(globalThis.document, {
      runOnly: {
        type: 'tag',
        values: [
          'wcag2a',
          'wcag2aa',
          'wcag21a',
          'wcag21aa',
          'wcag22a',
          'wcag22aa',
          'best-practice',
        ],
      },
    })

    const summarize = ({ help, id, impact, nodes }) => ({
      help,
      id,
      impact,
      nodes: nodes.map(node => ({
        failureSummary: node.failureSummary,
        target: node.target,
      })),
    })

    const seriousIncomplete = results.incomplete
      .filter(result => ['critical', 'serious'].includes(result.impact))
      .map(result => ({
        ...result,
        nodes: result.nodes.filter(node => {
          if (result.id !== 'color-contrast') return true

          return !node.target.some(target => {
            const element = globalThis.document.querySelector(target)
            return element && approvedGradientSelectors.some(selector => (
              element.matches(selector) || element.closest(selector)
            ))
          })
        }),
      }))
      .filter(result => result.nodes.length > 0)

    return {
      violations: results.violations.map(summarize),
      unresolved: seriousIncomplete.map(summarize),
    }
  }, gradientContrastChecks.map(({ selector }) => selector))

  expect(audit.violations, JSON.stringify(audit.violations, null, 2)).toEqual([])
  expect(audit.unresolved, JSON.stringify(audit.unresolved, null, 2)).toEqual([])
}

const enterPokedex = async (page, trainerName = 'Misty') => {
  await page.goto('./')
  await page.getByLabel('Nombre del entrenador').fill(trainerName)
  await page.getByRole('button', { name: '¡Atrápalos a todos!' }).click()
  await expect(page).toHaveURL(/#\/pokedex$/)
  await expect(page.getByRole('heading', { name: 'Pikachu', exact: true })).toBeVisible()
}

test('completa el recorrido principal hasta el detalle de un Pokémon', async ({ page }) => {
  await mockPokeApi(page)
  await page.goto('./')

  await expect(page.getByRole('heading', { name: '¡Bienvenido, entrenador!' })).toBeVisible()
  await expectNoAccessibilityViolations(page)
  await page.getByRole('button', { name: 'Modo oscuro' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expectNoAccessibilityViolations(page)
  await page.getByLabel('Nombre del entrenador').fill('Misty')
  await page.getByRole('button', { name: '¡Atrápalos a todos!' }).click()

  await expect(page).toHaveURL(/#\/pokedex$/)
  await expect(page.getByRole('heading', { name: 'Pikachu', exact: true })).toBeVisible()
  await expectNoAccessibilityViolations(page)
  await page.getByRole('link', { name: 'Ver detalles de Pikachu' }).click()

  await expect(page).toHaveURL(/#\/pokedex\/25$/)
  await expect(page.getByRole('heading', { name: 'Pikachu', exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Estadísticas' })).toBeVisible()
  await expect(page.getByText('Thunder Shock')).toBeVisible()
  await expectNoAccessibilityViolations(page)
})

test('busca, filtra por tipo y conserva favoritos', async ({ page }) => {
  await mockPokeApi(page)
  await enterPokedex(page)

  await page.getByRole('searchbox', { name: 'Buscar un Pokémon' }).fill('Pika')
  await page.getByRole('button', { name: 'Buscar Pokémon' }).click()
  await expect(page).toHaveURL(/search=pika/)
  await expect(page.getByRole('heading', { name: 'Pikachu', exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Bulbasaur', exact: true })).toHaveCount(0)

  await page.getByRole('button', { name: 'Limpiar' }).click()
  await page.getByRole('combobox', { name: 'Tipo' }).selectOption('electric')
  await expect(page).toHaveURL(/type=electric/)
  await expect(page.getByRole('heading', { name: 'Pikachu', exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Bulbasaur', exact: true })).toHaveCount(0)

  const favoriteButton = page.getByRole('button', { name: 'Favorito: Pikachu' })
  await favoriteButton.focus()
  await page.keyboard.press('Space')
  await expect(favoriteButton).toHaveAttribute('aria-pressed', 'true')

  await page.getByRole('combobox', { name: 'Tipo' }).selectOption('all')
  const favoritesFilter = page.getByRole('button', { name: 'Favorito (1)' })
  await favoritesFilter.click()
  await expect(page).toHaveURL(/favorites=1/)
  await expect(favoritesFilter).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('heading', { name: 'Pikachu', exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Bulbasaur', exact: true })).toHaveCount(0)
})

test('pagina más de 24 resultados mediante el teclado', async ({ page }) => {
  await mockPokeApi(page)
  await enterPokedex(page)

  const secondPage = page.getByRole('button', { name: 'Página 2' })
  await secondPage.focus()
  await page.keyboard.press('Enter')

  await expect(page).toHaveURL(/page=2/)
  await expect(page.getByText('26 resultados. Página 2 de 2.')).toBeAttached()
  await expect(page.getByRole('heading', { name: 'Dratini', exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Umbreon', exact: true })).toBeVisible()
})

test('localiza la validación y los controles al cambiar a inglés', async ({ page }) => {
  await mockPokeApi(page)
  await page.goto('./')

  await page.getByRole('button', { name: 'EN: Cambiar a inglés' }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.getByRole('heading', { name: 'Welcome trainer!' })).toBeVisible()
  await page.getByRole('button', { name: 'Catch them all!' }).click()
  await expect(page.getByRole('alert')).toHaveText('Enter your trainer name.')

  const nameInput = page.getByRole('textbox', { name: 'Trainer name' })
  await nameInput.fill('Ash')
  await nameInput.press('Enter')
  await expect(page).toHaveURL(/#\/pokedex$/)
  await expect(page.getByRole('button', { name: 'Favorites (0)' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Pikachu', exact: true })).toBeVisible()
})

test('muestra una salida segura para una ruta desconocida', async ({ page }) => {
  await page.goto('./#/ruta-inexistente')

  await expect(page.getByRole('heading', {
    name: 'Esta ruta escapó de la Pokédex',
  })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Volver al inicio' })).toBeVisible()
  await expectNoAccessibilityViolations(page)
})
