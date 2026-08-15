/* eslint-env node */
import { defineConfig, devices } from '@playwright/test'

const externalBaseURL = process.env.E2E_BASE_URL?.trim()
const configuredBasePath = process.env.VITE_BASE_PATH?.trim() ?? '/'
const localBasePath = !configuredBasePath || configuredBasePath === '/'
  ? '/'
  : configuredBasePath === './'
    ? '/'
    : `/${configuredBasePath.replace(/^\/+|\/+$/g, '')}/`
const localBaseURL = new URL(localBasePath, 'http://127.0.0.1:4173/').toString()
const baseURL = externalBaseURL
  ? `${externalBaseURL.replace(/\/+$/, '')}/`
  : localBaseURL

export default defineConfig({
  testDir: './e2e',
  outputDir: './e2e/.results',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  timeout: 30_000,
  expect: {
    timeout: 8_000,
  },
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 7'] },
    },
  ],
  webServer: externalBaseURL
    ? undefined
    : {
        command: 'node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4173 --strictPort',
        url: localBaseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
})
