import 'reflect-metadata'
import { getMetadataArgsStorage, getRepository } from 'typeorm'
import { User } from '../../src/entity/User'
import { UserController } from '../../src/controller/UserController'

// Real decorators, so the column metadata below is what TypeORM sees at runtime
jest.mock('typeorm', () => ({ ...jest.requireActual('typeorm'), getRepository: jest.fn() }))
jest.mock('bcrypt', () => ({ hash: jest.fn(async (password) => `hash:${password}`) }))
jest.mock('../../src/logger', () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}))

describe('CMS user password hash', () => {
  it('is left out of default queries, so user reads and req.user never load it', () => {
    const password = getMetadataArgsStorage().columns.find(
      (column) => column.target === User && column.propertyName === 'password',
    )

    expect(password.options.select).toBe(false)
  })

  describe('user management responses', () => {
    const superAdmin = { id: 1, username: 'superAdmin', type: 'superAdmin', lang: 'en' }
    const stored = {
      id: 7,
      username: 'cm',
      password: 'hash:old',
      type: 'contentManager',
      lang: 'en',
      date_created: '2026-01-01T00:00:00.000Z',
      sessionVersion: 3,
    }
    const form = { username: 'renamed', password: 'plain-secret', type: 'admin', lang: 'fr' }
    const fromForm = { username: 'renamed', type: 'admin', lang: 'fr' }
    const fromStored = { id: 7, username: 'cm', type: 'contentManager', lang: 'en' }

    beforeEach(() => {
      // Hands every column back, hash included, whatever select asks for, so
      // only the controller stands between them and the response
      ;(getRepository as jest.Mock).mockReturnValue({
        findOne: jest.fn(async () => ({ ...stored })),
        find: jest.fn(async ({ where }) =>
          where.username === stored.username ? [{ ...stored }] : [],
        ),
        save: jest.fn(async (entity) => ({ id: 8, ...entity })),
        // Like TypeORM, which clears the primary key of the entity it removed
        remove: jest.fn(async (entity) => {
          delete entity.id
          return entity
        }),
      })
    })

    it.each([
      ['one', { id: 7 }, fromStored],
      ['save', {}, { id: 8, ...fromForm }],
      ['update', { id: 7 }, { id: 7, ...fromForm }],
      ['remove', { id: 7 }, fromStored],
    ])('%s answers with the public fields only', async (action, params, expected) => {
      const response: any = { status: jest.fn().mockReturnThis(), send: jest.fn() }
      const result = await (new UserController() as any)[action](
        { user: superAdmin, params, body: form },
        response,
        jest.fn(),
      )

      expect(response.status).not.toHaveBeenCalled()
      expect(result).toEqual(expected)
      expect(Object.keys(result).sort()).toEqual(['id', 'lang', 'type', 'username'])
      expect(JSON.stringify(result)).not.toMatch(/password|hash:|plain-secret|sessionVersion/)
    })
  })
})
