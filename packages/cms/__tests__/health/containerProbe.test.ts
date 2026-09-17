import { createServer } from 'http'
import { execFile } from 'child_process'
import { promisify } from 'util'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { runInNewContext } from 'vm'

const cms = resolve(__dirname, '../..')
const dockerfile = readFileSync(resolve(cms, 'Dockerfile'), 'utf8')
const dockerCommands = Array.from(dockerfile.matchAll(/CMD node -e "([^"\n]+)"/g), match => match[1])
const compose = readFileSync(resolve(cms, '../../docker-compose.yml'), 'utf8')
const composeLine = compose.split('\n').find(line => line.trim().startsWith('test:'))!
const composeCommand = JSON.parse(composeLine.slice(composeLine.indexOf('[')))[3]
const commands = [...dockerCommands, composeCommand]

describe('container health probes', () => {
  it('covers both image stages and Compose', () => expect(commands).toHaveLength(3))
  it.each(commands)('reaches a real HTTP server on a custom port: %#', async command => {
    const paths: string[] = []
    const server = createServer((req, res) => { paths.push(req.url!); res.end('healthy') })
    await new Promise<void>(resolve => server.listen(0, resolve))
    try {
      const port = (server.address() as any).port
      await promisify(execFile)(process.execPath, ['-e', command], {
        env: { ...process.env, CMS_PORT: String(port) }, timeout: 3000,
      })
      expect(paths).toEqual(['/health'])
    } finally {
      await new Promise<void>(resolve => server.close(() => resolve()))
    }
  })

  it.each(commands)('uses the configured port and preserves health exit codes: %#', command => {
    for (const configured of [undefined, '5123']) {
      for (const status of [200, 503]) {
        let target: any
        const exit = jest.fn()
        const http = { get: (options: any, callback: Function) => {
          target = typeof options === 'string' ? new URL(options) : options
          callback({ statusCode: status })
          return { on: jest.fn(), setTimeout: jest.fn() }
        } }
        runInNewContext(command, { require: () => http, process: { env: { CMS_PORT: configured }, exit } })
        expect(Number(target.port)).toBe(configured ? 5123 : 5000)
        expect(target.hostname).toBe('localhost')
        expect(target.path || target.pathname).toBe('/health')
        expect(exit).toHaveBeenCalledWith(status === 200 ? 0 : 1)
      }
    }
  })
})
