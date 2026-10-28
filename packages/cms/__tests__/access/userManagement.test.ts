import { getRepository } from 'typeorm'
import { UserController } from '../../src/controller/UserController'

jest.mock('typeorm', () => ({ getRepository: jest.fn() }))
jest.mock('../../src/entity/User', () => ({ User: class {} }))
jest.mock('bcrypt', () => ({ hash: jest.fn(async (password) => `hash:${password}`) }))
jest.mock('../../src/logger', () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}))

const seed = () => [
  { id: 1, username: 'superAdmin', password: 'hash:sa', type: 'superAdmin', lang: 'en' },
  { id: 2, username: 'admin', password: 'hash:a', type: 'admin', lang: 'en' },
  { id: 3, username: 'contentManager', password: 'hash:cm', type: 'contentManager', lang: 'en' },
  { id: 10, username: 'otherSuperAdmin', password: 'hash:x', type: 'superAdmin', lang: 'en' },
  { id: 11, username: 'otherAdmin', password: 'hash:x', type: 'admin', lang: 'en' },
  { id: 12, username: 'otherCm', password: 'hash:x', type: 'contentManager', lang: 'en' },
  { id: 13, username: 'frenchCm', password: 'hash:x', type: 'contentManager', lang: 'fr' },
]

const actors = { superAdmin: 1, admin: 2, contentManager: 3 }
const targets = { superAdmin: 10, admin: 11, contentManager: 12, otherLangContentManager: 13 }

// Who may manage which account; everything else must be refused
const manageable = {
  superAdmin: ['superAdmin', 'admin', 'contentManager', 'otherLangContentManager'],
  admin: ['contentManager'],
  contentManager: [],
}
const creatable = {
  superAdmin: ['superAdmin', 'admin', 'contentManager'],
  admin: ['contentManager'],
  contentManager: [],
}

const matrix = Object.keys(actors).flatMap((actor) =>
  Object.keys(targets).map((target) => [actor, target, manageable[actor].includes(target)]),
)

describe('CMS user management authorization', () => {
  let users: any[]
  let save: jest.Mock
  let remove: jest.Mock

  const project = (user, select?: string[]) =>
    select ? Object.fromEntries(select.map((key) => [key, user[key]])) : { ...user }

  beforeEach(() => {
    users = seed()
    save = jest.fn(async (entity) => {
      const index = users.findIndex((user) => user.id === entity.id)
      if (index === -1) users.push({ id: users.length + 100, ...entity })
      else users[index] = { ...entity }
      return entity
    })
    remove = jest.fn(async (entity) => {
      users = users.filter((user) => user.id !== entity.id)
      return entity
    })
    ;(getRepository as jest.Mock).mockReturnValue({
      find: jest.fn(async ({ select }) => users.map((user) => project(user, select))),
      findOne: jest.fn(async (idOrOptions, options) => {
        const user =
          typeof idOrOptions === 'object'
            ? users.find((u) => u.username === idOrOptions.where.username)
            : users.find((u) => String(u.id) === String(idOrOptions))
        return user && project(user, options?.select)
      }),
      save,
      remove,
    })
  })

  const call = async (action: string, actor: string, params = {}, body = {}) => {
    const user = users.find((u) => u.id === actors[actor])
    const response: any = { status: jest.fn().mockReturnThis(), send: jest.fn() }
    const result = await new UserController()[action](
      { user: { ...user }, params, body },
      response,
      jest.fn(),
    )
    return {
      status: response.status.mock.calls[0]?.[0] ?? 200,
      body: response.send.mock.calls[0]?.[0] ?? result,
    }
  }

  const stored = (id: number) => users.find((user) => user.id === id)

  describe('list', () => {
    it.each([
      ['superAdmin', [1, 2, 3, 10, 11, 12, 13]],
      ['admin', [3, 12]],
      ['contentManager', []],
    ])('%s only sees the accounts it can manage', async (actor, expected) => {
      const { status, body } = await call('all', actor as string)

      expect(status).toBe(200)
      expect(body.map((user) => user.id)).toEqual(expected)
      body.forEach((user) => expect(user).not.toHaveProperty('password'))
    })
  })

  describe('read', () => {
    it.each(matrix)('%s reading a %s -> allowed: %p', async (actor, target, allowed) => {
      const { status, body } = await call('one', actor as string, { id: targets[target as string] })

      if (allowed) {
        expect(status).toBe(200)
        expect(body.id).toBe(targets[target as string])
        expect(body).not.toHaveProperty('password')
      } else {
        expect(status).toBe(403)
      }
    })
  })

  describe('create', () => {
    it.each(
      Object.keys(actors).flatMap((actor) =>
        ['superAdmin', 'admin', 'contentManager'].map((type) => [
          actor,
          type,
          creatable[actor].includes(type),
        ]),
      ),
    )('%s creating a %s -> allowed: %p', async (actor, type, allowed) => {
      const before = users.length
      const { status } = await call(
        'save',
        actor as string,
        {},
        { username: 'newUser', password: 'secret', type, lang: 'en' },
      )

      if (allowed) {
        expect(status).toBe(200)
        expect(users.find((user) => user.username === 'newUser')).toMatchObject({ type })
      } else {
        expect(status).toBe(403)
        expect(save).not.toHaveBeenCalled()
        expect(users).toHaveLength(before)
      }
    })

    it('creates the account in the admin language whatever the form sends', async () => {
      users.find((user) => user.id === actors.admin).lang = 'fr'

      await call(
        'save',
        'admin',
        {},
        { username: 'newUser', password: 'p', type: 'contentManager', lang: 'en' },
      )

      expect(users.find((user) => user.username === 'newUser').lang).toBe('fr')
    })

    it('refuses before revealing whether a username exists', async () => {
      const { status } = await call(
        'save',
        'contentManager',
        {},
        { username: 'superAdmin', password: 'p', type: 'contentManager', lang: 'en' },
      )
      expect(status).toBe(403)
    })
  })

  describe('update', () => {
    it.each(matrix)('%s editing a %s -> allowed: %p', async (actor, target, allowed) => {
      const id = targets[target as string]
      const before = { ...stored(id) }
      const { status } = await call(
        'update',
        actor as string,
        { id },
        { username: 'renamed', password: 'taken-over', type: before.type, lang: before.lang },
      )

      if (allowed) {
        expect(status).toBe(200)
        expect(stored(id)).toMatchObject({ username: 'renamed', password: 'hash:taken-over' })
      } else {
        expect(status).toBe(403)
        expect(save).not.toHaveBeenCalled()
        expect(stored(id)).toEqual(before)
      }
    })

    it.each([
      ['contentManager', 'superAdmin'],
      ['contentManager', 'admin'],
      ['admin', 'superAdmin'],
      ['admin', 'admin'],
    ])('a %s cannot promote itself to %s', async (actor, type) => {
      const id = actors[actor]
      const before = { ...stored(id) }
      const { status } = await call(
        'update',
        actor,
        { id },
        { username: before.username, password: 'p', type, lang: before.lang },
      )

      expect(status).toBe(403)
      expect(save).not.toHaveBeenCalled()
      expect(stored(id)).toEqual(before)
    })

    it.each(['admin', 'superAdmin', 'unknownRole'])(
      'an admin cannot turn a content manager into %s',
      async (type) => {
        const id = targets.contentManager
        const before = { ...stored(id) }
        const { status } = await call(
          'update',
          'admin',
          { id },
          { username: before.username, type, lang: before.lang },
        )

        expect(status).toBe(403)
        expect(stored(id)).toEqual(before)
      },
    )

    it('lets a superAdmin change roles', async () => {
      const id = targets.contentManager
      const { status } = await call(
        'update',
        'superAdmin',
        { id },
        { username: 'otherCm', type: 'admin', lang: 'en' },
      )

      expect(status).toBe(200)
      expect(stored(id).type).toBe('admin')
    })

    it('keeps the stored password on an edit that does not send one', async () => {
      const id = targets.contentManager
      const { status } = await call(
        'update',
        'superAdmin',
        { id },
        { username: 'renamedCm', type: 'admin', lang: 'fr' },
      )

      expect(status).toBe(200)
      expect(stored(id)).toMatchObject({
        username: 'renamedCm',
        type: 'admin',
        lang: 'fr',
        password: 'hash:x',
      })
    })

    it('replaces the password when the edit sends a new one', async () => {
      const id = targets.contentManager
      const { status } = await call(
        'update',
        'admin',
        { id },
        { username: 'otherCm', password: 'new-secret', type: 'contentManager', lang: 'en' },
      )

      expect(status).toBe(200)
      expect(stored(id).password).toBe('hash:new-secret')
    })

    it.each(['', '   '])('refuses %p as a replacement password', async (password) => {
      const id = targets.contentManager
      const before = { ...stored(id) }
      const { status } = await call(
        'update',
        'admin',
        { id },
        { username: 'renamed', password, type: 'contentManager', lang: 'en' },
      )

      expect(status).toBe(400)
      expect(save).not.toHaveBeenCalled()
      expect(stored(id)).toEqual(before)
    })

    it('keeps an admin from moving a content manager to another language', async () => {
      const id = targets.contentManager
      await call(
        'update',
        'admin',
        { id },
        { username: 'otherCm', type: 'contentManager', lang: 'fr' },
      )

      expect(stored(id).lang).toBe('en')
    })
  })

  describe('delete', () => {
    it.each(matrix)('%s deleting a %s -> allowed: %p', async (actor, target, allowed) => {
      const id = targets[target as string]
      const before = { ...stored(id) }
      const { status } = await call('remove', actor as string, { id })

      if (allowed) {
        expect(status).toBe(200)
        expect(stored(id)).toBeUndefined()
      } else {
        expect(status).toBe(403)
        expect(remove).not.toHaveBeenCalled()
        expect(stored(id)).toEqual(before)
      }
    })
  })
})
