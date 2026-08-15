import { expect, test } from '@playwright/test'
import axe from 'axe-core'

const artwork = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='

const pikachu = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  sprites: {
    other: {
      home: {
        front_default: artwork,
      },
    },
  },
  types: [
    {
      slot: 1,
      type: {
        name: 'electric',
        url: 'https://pokeapi.co/api/v2/type/13/',
      },
    },
  ],
  abilities: [
    {
      slot: 1,
      ability: {
        name: 'static',
        url: 'https://pokeapi.co/api/v2/ability/9/',
      },
    },
  ],
  stats: [
    ['hp', 35, 1],
    ['attack', 55, 2],
    ['defense', 40, 3],
    ['special-attack', 50, 4],
    ['special-defense', 50, 5],
    ['speed', 90, 6],
  ].map(([name, baseStat, id]) => ({
    base_stat: baseStat,
    stat: {
      name,
      url: `https://pokeapi.co/api/v2/stat/${id}/`,
    },
  })),
  moves: [
    {
      move: {
        name: 'thunder-shock',
        url: 'https://pokeapi.co/api/v2/move/84/',
      },
    },
  ],
}

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
      results: [
        {
          name: 'pikachu',
          url: 'https://pokeapi.co/api/v2/pokemon/25/',
        },
      ],
    })
  }

  if (requestURL.pathname === '/api/v2/type') {
    return fulfillJson(route, {
      results: [
        {
          name: 'electric',
          url: 'https://pokeapi.co/api/v2/type/13/',
        },
      ],
    })
  }

  if (requestURL.pathname === '/api/v2/pokemon/25/') {
    return fulfillJson(route, pikachu)
  }

  return route.fulfill({
    status: 404,
    contentType: 'application/json',
    body: JSON.stringify({ detail: 'Not found' }),
  })
})

const expectNoAccessibilityViolations = async page => {
  // A fresh axe instance avoids stale computed-style caches after changing
  // theme or replacing a lazy route in the same document.
  await page.evaluate(() => {
    globalThis.axe = undefined
  })
  await page.addScriptTag({ content: axe.source })

  const audit = await page.evaluate(async () => {
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
          computedStyles: node.target.map(selector => {
            const element = globalThis.document.querySelector(selector)
            if (!element) return null

            const style = globalThis.getComputedStyle(element)
            return {
              backgroundColor: style.backgroundColor,
              color: style.color,
              opacity: style.opacity,
            }
          }),
          failureSummary: node.failureSummary,
          target: node.target,
        })),
    })

    const seriousIncomplete = results.incomplete.filter(
      result => ['critical', 'serious'].includes(result.impact),
    )

    return {
      violations: results.violations.map(summarize),
      // axe cannot calculate text contrast over the app's CSS gradients.
      // Those color pairs are reviewed separately; every other serious
      // indeterminate result remains a failing condition.
      unresolved: seriousIncomplete
        .filter(result => result.id !== 'color-contrast')
        .map(summarize),
    }
  })

  expect(audit.violations, JSON.stringify(audit.violations, null, 2)).toEqual([])
  expect(audit.unresolved, JSON.stringify(audit.unresolved, null, 2)).toEqual([])
}

test('completa el recorrido principal hasta el detalle de un Pokémon', async ({ page }) => {
  await mockPokeApi(page)
  await page.goto('./')

  await expect(page.getByRole('heading', { name: '¡Bienvenido, entrenador!' })).toBeVisible()
  await expectNoAccessibilityViolations(page)
  await page.getByRole('button', { name: 'Cambiar a modo oscuro' }).click()
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

test('muestra una salida segura para una ruta desconocida', async ({ page }) => {
  await page.goto('./#/ruta-inexistente')

  await expect(page.getByRole('heading', {
    name: 'Esta ruta escapó de la Pokédex',
  })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Volver al inicio' })).toBeVisible()
  await expectNoAccessibilityViolations(page)
})
