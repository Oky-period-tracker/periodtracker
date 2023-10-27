import { OkyUserApplicationService } from '../../../../src/application/oky/OkyUserApplicationService'
import { SignupCommand } from '../../../../src/application/oky/commands/SignupCommand'
import { AuthenticationService } from '../../../../src/domain/oky/AuthenticationService'
import { OkyUser } from '../../../../src/domain/oky/OkyUser'
import { OkyUserRepository } from '../../../../src/domain/oky/OkyUserRepository'

describe('OkyUserApplicationService', () => {
  let authenticationService: AuthenticationService
  let okyUserRepository: OkyUserRepository
  let okyUserApplicationService: OkyUserApplicationService

  beforeEach(() => {
    okyUserRepository = {
      nextIdentity: jest.fn(),
      byId: jest.fn(),
      byName: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as OkyUserRepository

    authenticationService = new AuthenticationService(okyUserRepository)
    authenticationService.authenticateUser = jest.fn()

    // Initialize the service with mock instances
    okyUserApplicationService = new OkyUserApplicationService(
      authenticationService,
      okyUserRepository,
    )
  })

  describe('userDescriptor', () => {
    it('should return null if user is not found', async () => {
      // Arrange
      ;(okyUserRepository.byName as jest.Mock).mockResolvedValueOnce(null)

      // Act
      const result = await okyUserApplicationService.userDescriptor('nonexistent')

      // Assert
      expect(result).toBeNull()
    })

    it('should return user descriptor if user is found', async () => {
      // Arrange
      const mockUser = {
        getId: jest.fn().mockReturnValue('id123'),
        getMemorableQuestion: jest.fn().mockReturnValue('What is your favorite color?'),
      }
      ;(okyUserRepository.byName as jest.Mock).mockResolvedValueOnce(mockUser)

      // Act
      const result = await okyUserApplicationService.userDescriptor('existingUser')

      // Assert
      expect(result).toEqual({
        id: 'id123',
        secretQuestion: 'What is your favorite color?',
      })
    })
  })

  describe('signup', () => {
    it('should successfully signup a new user', async () => {
      ;(okyUserRepository.nextIdentity as jest.Mock).mockResolvedValue('newId')
      ;(okyUserRepository.byId as jest.Mock).mockResolvedValue(null)
      ;(okyUserRepository.byName as jest.Mock).mockResolvedValue(null)
      ;(okyUserRepository.save as jest.Mock).mockResolvedValue('someValue')

      const command: SignupCommand = {
        preferredId: '123',
        name: 'aaa',
        plainPassword: 'aaa',
        secretQuestion: 'favourite_actor',
        secretAnswer: 'a',
        gender: 'Female',
        location: 'Urban',
        country: 'AF',
        province: '0',
        dateOfBirth: new Date(),
      }

      const result = await okyUserApplicationService.signup(command)
      expect(result).toBe('someValue')
    })

    it('should fail if the username is already taken', async () => {
      ;(okyUserRepository.byName as jest.Mock).mockResolvedValue({
        // Simulate an existing user
      })
      const command: SignupCommand = {
        preferredId: '123',
        name: 'aaa',
        plainPassword: 'aaa',
        secretQuestion: 'favourite_actor',
        secretAnswer: 'a',
        gender: 'Female',
        location: 'Urban',
        country: 'AF',
        province: '0',
        dateOfBirth: new Date(),
      }

      await expect(okyUserApplicationService.signup(command)).rejects.toThrow(
        'User with this name already exists',
      )
    })

    // Add more conditions like invalid password, age restriction, etc.
  })

  describe('login', () => {
    it('should successfully login a user', async () => {
      ;(authenticationService.authenticateUser as jest.Mock).mockResolvedValue('someValue')

      const result = await okyUserApplicationService.login({
        name: 'aaa',
        password: 'aaa',
      })

      expect(result).toBe('someValue')
    })

    it('should fail if the username is not found', async () => {
      ;(okyUserRepository.byName as jest.Mock).mockResolvedValue(null)

      const result = await okyUserApplicationService.login({
        name: 'aaa',
        password: 'aaa',
      })

      expect(result).toBeUndefined()
    })
  })

  describe('resetPassword', () => {
    it('should successfully reset password', async () => {
      // Mocking the OkyUser instance
      const mockOkyUser = {
        resetPassword: jest.fn(),
      }

      // Mock repository methods
      ;(okyUserRepository.nextIdentity as jest.Mock).mockResolvedValue('newId')
      ;(okyUserRepository.byId as jest.Mock).mockResolvedValue(null)
      ;(okyUserRepository.byName as jest.Mock).mockResolvedValue(null)
      ;(okyUserRepository.save as jest.Mock).mockResolvedValue(mockOkyUser)

      // Mock signup command
      const command: SignupCommand = {
        preferredId: '123',
        name: 'aaa',
        plainPassword: 'aaa',
        secretQuestion: 'favourite_actor',
        secretAnswer: 'a',
        gender: 'Female',
        location: 'Urban',
        country: 'AF',
        province: '0',
        dateOfBirth: new Date(),
      }

      // Signup a new user
      const okyUser = await okyUserApplicationService.signup(command)

      // Verify signup
      expect(okyUser).toBe(mockOkyUser)

      // Mock repository byName method to return the signed-up user
      ;(okyUserRepository.byName as jest.Mock).mockResolvedValue(mockOkyUser)

      // Perform password reset
      const result = await okyUserApplicationService.resetPassword({
        userName: 'aaa',
        secretAnswer: 'a',
        newPassword: 'bbb',
      })

      // Verify result and method calls
      expect(result).toBe(mockOkyUser)
      expect(mockOkyUser.resetPassword).toHaveBeenCalledWith('a', 'bbb')
    })

    it('should fail if the user is not found', async () => {
      ;(okyUserRepository.byId as jest.Mock).mockResolvedValue(null)
      await expect(
        okyUserApplicationService.resetPassword({
          userName: 'aaa',
          secretAnswer: 'a',
          newPassword: 'bbb',
        }),
      ).rejects.toThrow("User with this name doesn't exists")
    })
  })

  // Add more test cases for other methods
})
