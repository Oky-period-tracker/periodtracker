import http from 'http'
import { AddressInfo } from 'net'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import path from 'path'
import { spawn } from 'child_process'
import ts from 'typescript'

describe('crash reproduction CLI authentication', () => {
  const cookie = 'session=synthetic-session; session.sig=synthetic-signature'
  let directory: string
  let script: string
  let server: http.Server
  let baseUrl: string
  let received: Array<{ url: string; cookie?: string }>
  let status: number
  let loginAccepted: boolean
  let loginBody: string
  let promptShim: string

  beforeAll(() => {
    directory = mkdtempSync(path.join(tmpdir(), 'oky-cli-test-'))
    script = path.join(directory, 'cli.js')
    promptShim = path.join(directory, 'prompt.js')
    // Simulate readline input; HTTP login and cookie handling remain real.
    writeFileSync(
      promptShim,
      `
      process.stdin.isTTY = process.stdout.isTTY = true;
      require('readline').createInterface = ({ output }) => {
        const rl = new (require('events').EventEmitter)();
        const answers = ['test-admin', 'synthetic-password'];
        rl.question = (label, callback) => {
          output.write(label);
          const answer = answers.shift();
          output.write(answer);
          setImmediate(() => callback(answer));
        };
        rl.close = () => rl.emit('close');
        return rl;
      };
    `,
    )
    const source = readFileSync(
      path.join(__dirname, '../../src/utils/crashReproduction.ts'),
      'utf8',
    )
    writeFileSync(
      script,
      ts.transpileModule(source, {
        compilerOptions: {
          module: ts.ModuleKind.CommonJS,
          target: ts.ScriptTarget.ES2019,
          esModuleInterop: true,
        },
      }).outputText,
    )
  })

  beforeEach(async () => {
    received = []
    status = 200
    loginAccepted = true
    loginBody = ''
    server = http.createServer((req, res) => {
      received.push({ url: req.url!, cookie: req.headers.cookie })
      if (req.url === '/login') {
        expect(req.method).toBe('POST')
        expect(req.headers['content-type']).toContain('application/x-www-form-urlencoded')
        req.on('data', (chunk) => {
          loginBody += chunk
        })
        req.on('end', () => {
          res.writeHead(302, {
            Location: loginAccepted ? '/encyclopedia' : '/login',
            'Set-Cookie': [
              'session=synthetic-session; Path=/; HttpOnly',
              'session.sig=synthetic-signature; Path=/; HttpOnly',
            ],
          })
          res.end()
        })
        return
      }
      res.writeHead(status, { 'Content-Type': 'application/json' })
      res.end(
        JSON.stringify(
          status === 200
            ? {
                current: { heapUsedFormatted: '1 MB', heapUsedPercent: 10, rssFormatted: '2 MB' },
                trend: 'stable',
                spikes: [],
              }
            : { error: 'Denied' },
        ),
      )
    })
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
    baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`
  })

  afterEach(async () => {
    await new Promise<void>((resolve, reject) =>
      server.close((err) => (err ? reject(err) : resolve())),
    )
  })
  afterAll(() => rmSync(directory, { recursive: true, force: true }))

  function run(
    scenario: string,
    session = cookie,
    interactive = false,
  ): Promise<{ code: number | null; output: string }> {
    return new Promise((resolve, reject) => {
      const child = spawn(
        process.execPath,
        [
          ...(interactive ? ['--require', promptShim] : []),
          script,
          scenario,
          `--base-url=${baseUrl}`,
        ],
        {
          env: { ...process.env, CMS_SESSION_COOKIE: session },
        },
      )
      let output = ''
      child.stdout.on('data', (chunk) => {
        output += chunk
      })
      child.stderr.on('data', (chunk) => {
        output += chunk
      })
      child.on('error', reject)
      child.on('close', (code) => resolve({ code, output }))
    })
  }

  it('logs in interactively and uses both signed cookies without printing the password', async () => {
    const result = await run('memory-check', '', true)
    expect(result.code).toBe(0)
    expect(new URLSearchParams(loginBody).get('username')).toBe('test-admin')
    expect(new URLSearchParams(loginBody).get('password')).toBe('synthetic-password')
    expect(received).toEqual([
      { url: '/login', cookie: undefined },
      { url: '/diagnostics/memory', cookie },
    ])
    expect(result.output).toContain('Heap Used: 1 MB')
    expect(result.output).not.toContain('synthetic-password')
    expect(result.output).not.toContain(cookie)
  })

  it('rejects a failed login even if the flash response sets cookies', async () => {
    loginAccepted = false
    const result = await run('memory-check', '', true)
    expect(result.code).toBe(1)
    expect(result.output).toContain('Login failed')
    expect(received.map((entry) => entry.url)).toEqual(['/login'])
  })

  it('rejects a non-admin session before running full diagnostic scenarios', async () => {
    status = 403
    const result = await run('full-diagnostic', '', true)
    expect(result.code).toBe(1)
    expect(result.output).toContain('HTTP 403')
    expect(received.map((entry) => entry.url)).toEqual(['/login', '/diagnostics/memory'])
  })

  it('requires a cookie when no interactive terminal is available', async () => {
    const result = await run('memory-check', '')
    expect(result.code).toBe(1)
    expect(result.output).toContain('terminal')
    expect(result.output).toContain('CMS_SESSION_COOKIE')
    expect(received).toHaveLength(0)
  })

  it('refuses to send login credentials over remote HTTP', async () => {
    baseUrl = 'http://cms.example.com'
    const result = await run('memory-check', '', true)
    expect(result.code).toBe(1)
    expect(result.output).toContain('HTTPS')
    expect(result.output).not.toContain('test-admin')
  })

  it('sends the complete signed session cookie and renders diagnostics', async () => {
    const result = await run('memory-check')
    expect(received).toEqual([{ url: '/diagnostics/memory', cookie }])
    expect(result.code).toBe(0)
    expect(result.output).toContain('Heap Used: 1 MB')
    expect(result.output).not.toContain(cookie)
  })

  it.each([401, 403])('explains HTTP %s and exits unsuccessfully', async (code) => {
    status = code
    const result = await run('memory-check', cookie)
    expect(result.code).toBe(1)
    expect(result.output).toContain(`HTTP ${code}`)
    expect(result.output).toContain('CMS_SESSION_COOKIE')
    expect(result.output).toContain('super-admin')
    expect(result.output).not.toContain('heapUsedFormatted')
    expect(result.output).not.toContain(cookie)
  })

  it('reports other diagnostic HTTP failures before parsing the body', async () => {
    status = 500
    const result = await run('memory-check')
    expect(result.code).toBe(1)
    expect(result.output).toContain('HTTP 500')
  })

  it('does not send the session cookie to error-generation requests', async () => {
    const result = await run('rapid-errors')
    expect(result.code).toBe(0)
    expect(received).toHaveLength(20)
    expect(received.every((entry) => entry.cookie === undefined)).toBe(true)
  })
})
