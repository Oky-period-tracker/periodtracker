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
    const form = { username: 'cm', password: 'plain-secret', type: 'contentManager', lang: 'en' }

    beforeEach(() => {
      const stored = {
        id: 7,
        username: 'cm',
        password: 'hash:old',
        type: 'contentManager',
        lang: 'en',
      }
      // Hands the hash back as if it had been selected, so only the controller
      // stands between it and the response
      ;(getRepository as jest.Mock).mockReturnValue({
        findOne: jest.fn(async (idOrOptions) =>
          typeof idOrOptions === 'object' ? undefined : { ...stored },
        ),
        save: jest.fn(async (entity) => ({ id: 8, ...entity })),
        remove: jest.fn(async (entity) => entity),
      })
    })

    it.each([
      ['save', {}],
      ['update', { id: 7 }],
      ['remove', { id: 7 }],
    ])('%s answers with the public fields only', async (action, params) => {
      const response: any = { status: jest.fn().mockReturnThis(), send: jest.fn() }
      const result = await (new UserController() as any)[action](
        { user: superAdmin, params, body: form },
        response,
        jest.fn(),
      )

      expect(response.status).not.toHaveBeenCalled()
      expect(result).toEqual({
        id: expect.any(Number),
        username: 'cm',
        type: 'contentManager',
        lang: 'en',
      })
      expect(JSON.stringify(result)).not.toMatch(/password|hash:|plain-secret/)
    })
  })
})
