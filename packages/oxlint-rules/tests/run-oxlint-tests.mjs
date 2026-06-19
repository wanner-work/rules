import { spawn } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const packageDir = path.resolve(scriptDir, '..', '..')
const testsDir = scriptDir
const configPath = path.join(testsDir, 'oxlint.test.config.ts')
const oxlintBinaryBasePath = path.join(
  packageDir,
  'node_modules',
  '.bin',
  'oxlint'
)
const oxlintBinaryPath =
  process.platform === 'win32'
    ? `${oxlintBinaryBasePath}.cmd`
    : oxlintBinaryBasePath
const oxlintCommand = existsSync(oxlintBinaryPath) ? oxlintBinaryPath : 'oxlint'
const maxWorkers = Number.parseInt(process.env.OXLINT_CHECK_JOBS ?? '', 10)
const workerCount = Number.isFinite(maxWorkers)
  ? Math.max(1, maxWorkers)
  : Math.max(1, Math.min(4, os.availableParallelism()))

const ruleDirs = readdirSync(testsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort((a, b) => a.localeCompare(b))

const failures = []

function runOxlint(targetPath) {
  return new Promise((resolve) => {
    const child = spawn(oxlintCommand, ['--config', configPath, targetPath], {
      cwd: packageDir,
      stdio: ['ignore', 'pipe', 'pipe']
    })

    let stdout = ''
    let stderr = ''

    child.stdout.on('data', (chunk) => {
      stdout += String(chunk)
    })

    child.stderr.on('data', (chunk) => {
      stderr += String(chunk)
    })

    child.on('close', (status) => {
      resolve({
        status: typeof status === 'number' ? status : 1,
        stdout,
        stderr
      })
    })
  })
}

async function runCase(ruleName, caseName, shouldPass) {
  const targetPath = path.join(testsDir, ruleName, caseName)
  const result = await runOxlint(targetPath)

  const didPass = result.status === 0
  const ok = shouldPass ? didPass : !didPass
  const expectation = shouldPass ? 'pass' : 'fail'

  if (ok) {
    console.log(`OK   ${ruleName}/${caseName} (${expectation})`)
    return
  }

  failures.push({
    ruleName,
    caseName,
    expectation,
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr
  })

  console.error(`FAIL ${ruleName}/${caseName} expected ${expectation}`)
}

const cases = ruleDirs.flatMap((ruleName) => [
  { ruleName, caseName: 'happy', shouldPass: true },
  { ruleName, caseName: 'error', shouldPass: false }
])

let nextCaseIndex = 0

async function runWorker() {
  while (nextCaseIndex < cases.length) {
    const caseToRun = cases[nextCaseIndex]

    nextCaseIndex += 1

    await runCase(caseToRun.ruleName, caseToRun.caseName, caseToRun.shouldPass)
  }
}

await Promise.all(
  Array.from({ length: Math.min(workerCount, cases.length) }, () => runWorker())
)

if (failures.length > 0) {
  console.error(`\n${failures.length} case(s) failed.`)

  for (const failure of failures) {
    const output = [failure.stdout, failure.stderr].filter(Boolean).join('\n')

    console.error(`\n--- ${failure.ruleName}/${failure.caseName} ---`)
    console.error(`Expected: ${failure.expectation}`)
    console.error(`Exit code: ${String(failure.status)}`)

    if (output.trim().length > 0) {
      console.error(output.trim())
    }
  }

  process.exit(1)
}

console.log('\nAll codestyle fixture checks passed.')
