import { Authentication } from '../../src/access/authentication'
import * as typeorm from 'typeorm'
import bcrypt from 'bcrypt'

jest.mock('typeorm', () => {
  return {
    getRepository: jest.fn(),
    BaseEntity: class Mock {},
    ObjectType: () => null,
    Entity: () => null,
    InputType: () => null,
    Index: () => null,
    PrimaryGeneratedColumn: () => null,
    Column: () => null,
    CreateDateColumn: () => null,
    UpdateDateColumn: () => null,
    OneToMany: () => null,
    ManyToOne: () => null,
  }
})

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}))

describe('Authentication', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should authenticate successfully', async () => {
    const mockUser = { username: 'john', password: 'hashed_password' }
    ;(typeorm.getRepository as jest.Mock).mockReturnValue({
      findOne: jest.fn().mockResolvedValue(mockUser),
    })
    ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)

    const done = jest.fn()
    await Authentication.authenticate('john', 'password', done)

    expect(done).toHaveBeenCalledWith(null, mockUser)
  })

  it('should fail authentication if user not found', async () => {
    ;(typeorm.getRepository as jest.Mock).mockReturnValue({
      findOne: jest.fn().mockResolvedValue(null),
    })

    const done = jest.fn()
    await Authentication.authenticate('john', 'password', done)

    expect(done).toHaveBeenCalledWith(null, false, { message: 'No user registered' })
  })

  it('should fail authentication if password does not match', async () => {
    const mockUser = { username: 'john', password: 'hashed_password' }
    ;(typeorm.getRepository as jest.Mock).mockReturnValue({
      findOne: jest.fn().mockResolvedValue(mockUser),
    })
    ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

    const done = jest.fn()
    await Authentication.authenticate('john', 'wrong_password', done)

    expect(done).toHaveBeenCalledWith(null, false, { message: 'No password match' })
  })
})
