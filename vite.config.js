import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { configDefaults } from 'vitest/config'

const normalizeBasePath = value => {
  const basePath = value.trim()

  if (!basePath || basePath === '/') return '/'
  if (basePath === './') return './'

  return `/${basePath.replace(/^\/+|\/+$/g, '')}/`
}

// VITE_BASE_PATH defaults to / and can target a static-hosting subdirectory,
// for example /pokedex_app/ on GitHub Pages.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const base = normalizeBasePath(env.VITE_BASE_PATH ?? '/')

  return {
    base,
    plugins: [react()],
    test: {
      environment: 'jsdom',
      setupFiles: './src/test/setup.js',
      globals: true,
      restoreMocks: true,
      exclude: [
        ...configDefaults.exclude,
        'e2e/**',
      ],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
        reportsDirectory: 'coverage',
        thresholds: {
          statements: 85,
          branches: 70,
          functions: 80,
          lines: 85,
        },
      },
    },
  }
})
