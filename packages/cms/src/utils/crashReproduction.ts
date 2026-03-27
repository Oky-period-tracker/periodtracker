/**
 * Crash Reproduction Utility
 *
 * CLI script to simulate crash scenarios against the CMS for testing
 * auto-restart, health check, and diagnostics capabilities.
 *
 * Usage:
 *   npx ts-node src/utils/crashReproduction.ts <scenario> [--base-url=http://localhost:5000]
 *
 * Scenarios:
 *   memory-leak         Trigger requests that grow memory usage
 *   rapid-errors        Flood endpoints to generate 500s
 *   timeout-simulation  Hit slow endpoints to trigger timeout detection
 *   health-check        Poll /health and report status changes
 *   full-diagnostic     Run all scenarios and print the crash report
 */

import http from 'http'

const BASE_URL = process.argv.find((a) => a.startsWith('--base-url='))?.split('=')[1] || 'http://localhost:5000'
const scenario = process.argv[2]

// ─── HTTP helpers ─────────────────────────────────────────────────

function get(path: string, timeout = 30000): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}${path}`
    const req = http.get(url, (res) => {
      let body = ''
      res.on('data', (chunk) => (body += chunk))
      res.on('end', () => resolve({ status: res.statusCode || 0, body }))
    })
    req.on('error', reject)
    req.setTimeout(timeout, () => {
      req.destroy()
      reject(new Error(`Timeout after ${timeout}ms`))
    })
  })
}

// ─── Scenarios ────────────────────────────────────────────────────

async function healthCheck() {
  console.log('\n=== Health Check Monitor ===')
  for (let i = 0; i < 10; i++) {
    try {
      const { status, body } = await get('/health')
      const data = JSON.parse(body)
      console.log(`[${i + 1}/10] Status: ${data.status} (HTTP ${status}) | DB: ${data.checks?.database?.status} | Uptime: ${data.uptime}s`)
    } catch (error) {
      console.log(`[${i + 1}/10] FAILED: ${(error as Error).message}`)
    }
    await sleep(2000)
  }
}

async function rapidErrors() {
  console.log('\n=== Rapid Error Generation ===')
  console.log('Sending requests to non-existent/invalid endpoints...')

  const badPaths = [
    '/api/nonexistent',
    '/articles/invalid-id',
    '/categories/00000000-0000-0000-0000-000000000000',
    '/quizzes/delete/invalid',
  ]

  let errorCount = 0
  for (let i = 0; i < 20; i++) {
    const path = badPaths[i % badPaths.length]
    try {
      const { status } = await get(path)
      if (status >= 400) errorCount++
      process.stdout.write(`  Request ${i + 1}/20: ${path} → ${status}\n`)
    } catch {
      errorCount++
      process.stdout.write(`  Request ${i + 1}/20: ${path} → CONNECTION ERROR\n`)
    }
  }

  console.log(`\nGenerated ${errorCount} error responses`)
  console.log('Check /diagnostics/exceptions for captured errors')
}

async function timeoutSimulation() {
  console.log('\n=== Timeout Simulation ===')
  console.log('Hitting endpoints that may be slow...')

  const endpoints = [
    '/data/generate-content-ts',
    '/data/generate-content-sheet',
    '/encyclopedia',
    '/analytics',
  ]

  for (const path of endpoints) {
    const start = Date.now()
    try {
      const { status } = await get(path, 15000)
      const duration = Date.now() - start
      console.log(`  ${path} → ${status} (${duration}ms)`)
    } catch (error) {
      const duration = Date.now() - start
      console.log(`  ${path} → FAILED after ${duration}ms: ${(error as Error).message}`)
    }
  }

  console.log('\nCheck /diagnostics/timeouts for detected timeouts')
}

async function memoryCheck() {
  console.log('\n=== Memory Analysis ===')
  try {
    const { body } = await get('/diagnostics/memory')
    const data = JSON.parse(body)
    console.log(`Current Memory:`)
    console.log(`  Heap Used: ${data.current.heapUsedFormatted} (${data.current.heapUsedPercent}%)`)
    console.log(`  RSS: ${data.current.rssFormatted}`)
    console.log(`  Trend: ${data.trend}`)
    console.log(`  Spikes detected: ${data.spikes.length}`)

    if (data.spikes.length > 0) {
      console.log(`  Last spike: ${data.spikes[data.spikes.length - 1].timestamp}`)
    }
  } catch (error) {
    console.log(`Failed to get memory data: ${(error as Error).message}`)
  }
}

async function fullDiagnostic() {
  console.log('\n=== Full Crash Diagnostic Report ===')

  // Run all checks
  await healthCheck()
  await rapidErrors()
  await timeoutSimulation()
  await memoryCheck()

  // Pull the full report
  console.log('\n=== Fetching Full Report ===')
  try {
    const { body } = await get('/diagnostics/report')
    const report = JSON.parse(body)

    console.log('\n--- Summary ---')
    console.log(`  Total Exceptions: ${report.summary.totalExceptions}`)
    console.log(`  Total Timeouts: ${report.summary.totalTimeouts}`)
    console.log(`  Memory Spikes: ${report.summary.memorySpikesDetected}`)
    console.log(`  Unhealthy Endpoints: ${report.summary.unhealthyEndpoints}`)

    if (report.exceptions.topErrors.length > 0) {
      console.log('\n--- Top Errors ---')
      for (const err of report.exceptions.topErrors.slice(0, 5)) {
        console.log(`  [${err.count}x] ${err.message}`)
      }
    }

    if (report.failingEndpoints.length > 0) {
      console.log('\n--- Failing Endpoints ---')
      for (const ep of report.failingEndpoints) {
        console.log(`  ${ep.route}: ${ep.failureRate}% failure (${ep.failedRequests}/${ep.totalRequests})`)
      }
    }

    console.log('\n--- System ---')
    console.log(`  Node: ${report.system.nodeVersion}`)
    console.log(`  Platform: ${report.system.platform}`)
    console.log(`  CPU Load: ${report.system.loadAvg.map((n: number) => n.toFixed(2)).join(', ')}`)
    console.log(`  Free Memory: ${(report.system.freeMemory / 1024 / 1024).toFixed(0)} MB`)

    console.log('\nFull report available at: GET /diagnostics/report')
  } catch (error) {
    console.log(`Failed to fetch report: ${(error as Error).message}`)
  }
}

// ─── Main ─────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function printUsage() {
  console.log(`
Crash Reproduction Utility
Usage: npx ts-node src/utils/crashReproduction.ts <scenario> [--base-url=URL]

Scenarios:
  health-check        Poll /health endpoint and report status
  rapid-errors        Generate rapid error requests
  timeout-simulation  Hit potentially-slow endpoints
  memory-check        Check current memory state and trends
  full-diagnostic     Run all scenarios and generate crash report

Options:
  --base-url=URL      CMS base URL (default: http://localhost:5000)
`)
}

async function main() {
  if (!scenario) {
    printUsage()
    process.exit(1)
  }

  console.log(`Target: ${BASE_URL}`)

  switch (scenario) {
    case 'health-check':
      await healthCheck()
      break
    case 'rapid-errors':
      await rapidErrors()
      break
    case 'timeout-simulation':
      await timeoutSimulation()
      break
    case 'memory-check':
      await memoryCheck()
      break
    case 'full-diagnostic':
      await fullDiagnostic()
      break
    default:
      console.error(`Unknown scenario: ${scenario}`)
      printUsage()
      process.exit(1)
  }
}

main().catch((error) => {
  console.error('Fatal error:', error.message)
  process.exit(1)
})
