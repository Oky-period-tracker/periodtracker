import { AuthenticationDescriptor } from '../../../src/domain/oky/AuthenticationDescriptor'
import { AuthenticationService } from '../../../src/domain/oky/AuthenticationService'
import { OkyUserRepository } from '../../../src/domain/oky/OkyUserRepository'

describe('AuthenticationService', () => {
  let authService: AuthenticationService
  let mockOkyUserRepository: OkyUserRepository
  let mockUser: any

  beforeEach(() => {
    mockOkyUserRepository = {
      byName: jest.fn(),
      nextIdentity: jest.fn(),
      byId: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    }

    mockUser = {
      verifyPassword: jest.fn(),
    }

    authService = new AuthenticationService()
    authService.setRepository(mockOkyUserRepository)
  })

  it('should authenticate user successfully', async () => {
    mockOkyUserRepository.byName = (jest.fn(
      mockOkyUserRepository.byName,
    ) as jest.Mock).mockResolvedValue(mockUser)

    mockUser.verifyPassword = jest.fn().mockResolvedValue(true)

    const result = await authService.authenticateUser('john', '1234')

    expect(result).toEqual(AuthenticationDescriptor.success(mockUser))
  })

  it('should fail if no user is found', async () => {
    mockOkyUserRepository.byName = jest.fn().mockResolvedValue(undefined)
    mockOkyUserRepository.byName(mockUser)

    const result = await authService.authenticateUser('john', '1234')

    expect(result).toEqual(AuthenticationDescriptor.fail('no_user_in_database'))
  })

  it('should fail if password is incorrect', async () => {
    mockOkyUserRepository.byName = (jest.fn(
      mockOkyUserRepository.byName,
    ) as jest.Mock).mockResolvedValue(mockUser)

    mockUser.verifyPassword = jest.fn().mockResolvedValue(false)

    const result = await authService.authenticateUser('john', '1234')

    expect(result).toEqual(AuthenticationDescriptor.fail('password_incorrect'))
  })
})
