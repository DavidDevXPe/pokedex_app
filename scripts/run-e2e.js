/* eslint-env node */
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { fileURLToPath } from 'node:url'

const projectRoot = fileURLToPath(new URL('../', import.meta.url))
const viteCli = fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url))
const playwrightCli = fileURLToPath(new URL('../node_modules/@playwright/test/cli.js', import.meta.url))
const configuredBasePath = process.env.VITE_BASE_PATH?.trim() ?? '/'
const localBasePath = !configuredBasePath || configuredBasePath === '/'
  ? '/'
  : configuredBasePath === './'
    ? '/'
    : `/${configuredBasePath.replace(/^\/+|\/+$/g, '')}/`
const localBaseURL = new URL(localBasePath, 'http://127.0.0.1:4173/').toString()
const externalBaseURL = process.env.E2E_BASE_URL?.trim()
const playwrightArguments = process.argv.slice(2)

const runNode = (script, argumentsList, options = {}) => new Promise((resolve, reject) => {
  const childProcess = spawn(process.execPath, [script, ...argumentsList], {
    cwd: projectRoot,
    stdio: 'inherit',
    windowsHide: true,
    ...options,
  })

  childProcess.once('error', reject)
  childProcess.once('exit', code => resolve(code ?? 1))
})

const waitForServer = async (previewProcess, serverOutput) => {
  const deadline = Date.now() + 30_000

  while (Date.now() < deadline) {
    if (previewProcess.exitCode !== null) {
      throw new Error(`Vite preview terminó antes de estar disponible.\n${serverOutput.value}`)
    }

    try {
      const response = await globalThis.fetch(localBaseURL, {
        signal: globalThis.AbortSignal.timeout(1_000),
      })

      if (response.ok) return
    } catch {
      // El servidor aún está arrancando.
    }

    await new Promise(resolve => setTimeout(resolve, 250))
  }

  throw new Error(`Vite preview no respondió en 30 segundos.\n${serverOutput.value}`)
}

const stopPreview = async previewProcess => {
  if (!previewProcess || previewProcess.exitCode !== null) return

  previewProcess.kill()
  await Promise.race([
    once(previewProcess, 'exit'),
    new Promise(resolve => setTimeout(resolve, 3_000)),
  ])

  if (previewProcess.exitCode === null) previewProcess.kill('SIGKILL')
}

let previewProcess

try {
  if (!externalBaseURL) {
    const buildExitCode = await runNode(viteCli, ['build'])
    if (buildExitCode !== 0) process.exitCode = buildExitCode

    if (buildExitCode === 0) {
      const serverOutput = { value: '' }
      previewProcess = spawn(process.execPath, [
        viteCli,
        'preview',
        '--host',
        '127.0.0.1',
        '--port',
        '4173',
        '--strictPort',
      ], {
        cwd: projectRoot,
        stdio: ['ignore', 'pipe', 'pipe'],
        windowsHide: true,
      })

      const collectOutput = chunk => {
        serverOutput.value = `${serverOutput.value}${chunk}`.slice(-4_000)
      }

      previewProcess.stdout.on('data', collectOutput)
      previewProcess.stderr.on('data', collectOutput)
      await waitForServer(previewProcess, serverOutput)
    }
  }

  if (process.exitCode === undefined) {
    process.exitCode = await runNode(playwrightCli, ['test', ...playwrightArguments], {
      env: {
        ...process.env,
        E2E_BASE_URL: externalBaseURL || localBaseURL,
      },
    })
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
} finally {
  await stopPreview(previewProcess)
}
