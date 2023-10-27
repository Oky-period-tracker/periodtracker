import { OkyUserApplicationService } from '../../../src/application/oky/OkyUserApplicationService'
import { SignupCommand } from '../../../src/application/oky/commands/SignupCommand'
import { AuthenticationService } from '../../../src/domain/oky/AuthenticationService'
import { OkyUserRepository } from '../../../src/domain/oky/OkyUserRepository'

describe('OkyUserApplicationService', () => {
  let authenticationService: AuthenticationService
  let okyUserRepository: OkyUserRepository
  let okyUserApplicationService: OkyUserApplicationService
  const mockOkyUser = {
    id: '123',
    name: 'aaa',
    resetPassword: jest.fn(),
    deleteFromPassword: jest.fn(),
    replaceStore: jest.fn(),
    editInfo: jest.fn(),
    editSecretAnswer: jest.fn(),
  }

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

  describe('deleteUser', () => {
    it('should successfully delete a user', async () => {
      // Mock repository methods
      ;(okyUserRepository.byId as jest.Mock).mockResolvedValue(mockOkyUser)
      ;(okyUserRepository.delete as jest.Mock).mockResolvedValue(undefined) // Assuming delete returns true on success

      // Call deleteUser method
      const result = await okyUserApplicationService.deleteUser({ userId: 'someUserId' })

      // Verify result and method calls
      expect(result).toBe(undefined)
      expect(okyUserRepository.byId).toHaveBeenCalledWith('someUserId')
      expect(okyUserRepository.delete).toHaveBeenCalledWith(mockOkyUser)
    })

    it('should not fail if the user is not found', async () => {
      // Mock repository methods to return null for non-existing user
      ;(okyUserRepository.byId as jest.Mock).mockResolvedValue(null)

      // Call deleteUser method
      const result = await okyUserApplicationService.deleteUser({ userId: 'someNonExistingUserId' })

      // Verify result and method calls
      expect(result).toBeUndefined()
      expect(okyUserRepository.byId).toHaveBeenCalledWith('someNonExistingUserId')
      expect(okyUserRepository.delete).not.toHaveBeenCalled()
    })
  })

  describe('deleteUserFromPassword', () => {
    it('should successfully delete a user from password', async () => {
      // Mock repository methods
      ;(okyUserRepository.nextIdentity as jest.Mock).mockResolvedValue('newId')
      ;(okyUserRepository.byId as jest.Mock).mockResolvedValue(null)
      ;(okyUserRepository.byName as jest.Mock).mockResolvedValue(mockOkyUser)
      ;(okyUserRepository.save as jest.Mock).mockResolvedValue(mockOkyUser)

      // Mock repository methods
      ;(okyUserRepository.byId as jest.Mock).mockResolvedValue(mockOkyUser)
      ;(okyUserRepository.delete as jest.Mock).mockResolvedValue(undefined)

      // Call deleteUser method
      const result = await okyUserApplicationService.deleteUserFromPassword({
        userName: 'aaa',
        password: 'aaa',
      })

      // Verify result and method calls
      expect(result).toBe(undefined)
      expect(okyUserRepository.byName).toHaveBeenCalledWith('aaa')
      expect(mockOkyUser.deleteFromPassword).toHaveBeenCalled()
    })

    it('should not fail if the user is not found', async () => {
      // Mock repository methods to return null for non-existing user
      ;(okyUserRepository.byId as jest.Mock).mockResolvedValue(null)

      // Call deleteUser method
      const result = await okyUserApplicationService.deleteUser({ userId: 'someNonExistingUserId' })

      // Verify result and method calls
      expect(result).toBeUndefined()
      expect(okyUserRepository.byId).toHaveBeenCalledWith('someNonExistingUserId')
      expect(okyUserRepository.delete).not.toHaveBeenCalled()
    })
  })

  describe('replaceStore', () => {
    it('should successfully replace store', async () => {
      // Mock repository methods
      ;(okyUserRepository.byId as jest.Mock).mockResolvedValue(mockOkyUser)
      ;(okyUserRepository.save as jest.Mock).mockResolvedValue(mockOkyUser)

      // Call replaceStore method
      const result = await okyUserApplicationService.replaceStore({
        userId: 'someUserId',
        storeVersion: 1,
        appState: { some: 'appState' },
      })

      // Verify result and method calls
      expect(result).toBe(mockOkyUser)
      expect(okyUserRepository.byId).toHaveBeenCalledWith('someUserId')
      expect(mockOkyUser.replaceStore).toHaveBeenCalledWith(1, { some: 'appState' })
    })

    it('should throw an error if the user is not found', async () => {
      // Mock repository methods
      ;(okyUserRepository.byId as jest.Mock).mockResolvedValue(null)

      // Try-Catch to handle expected thrown error
      try {
        await okyUserApplicationService.replaceStore({
          userId: 'someUserId',
          storeVersion: 1,
          appState: { some: 'appState' },
        })
        fail('should have thrown an error') // fail if it didn't throw an error
      } catch (e) {
        expect(e.message).toBe(`Cannot replace store for missing someUserId user`)
      }

      // Verify that byId was called with the correct userId
      expect(okyUserRepository.byId).toHaveBeenCalledWith('someUserId')
    })
  })

  describe('editInfo', () => {
    it('should successfully edit info', async () => {
      // Mock repository methods
      ;(okyUserRepository.byId as jest.Mock).mockResolvedValue(mockOkyUser)
      ;(okyUserRepository.save as jest.Mock).mockResolvedValue(mockOkyUser)

      // Call replaceStore method
      const command = {
        userId: 'someUserId',
        name: 'bbb',
        dateOfBirth: new Date(),
        location: 'Urban',
        gender: 'Male' as const,
        secretQuestion: 'favourite_actor',
      }

      const result = await okyUserApplicationService.editInfo(command)

      // Verify result and method calls
      expect(result).toBe(mockOkyUser)
      expect(okyUserRepository.byId).toHaveBeenCalledWith('someUserId')
      expect(mockOkyUser.editInfo).toHaveBeenCalledWith({ ...command, userId: undefined })
    })

    it('should throw an error if the user is not found', async () => {
      // Mock repository methods
      ;(okyUserRepository.byId as jest.Mock).mockResolvedValue(null)

      // Try-Catch to handle expected thrown error
      try {
        const command = {
          userId: 'someUserId',
          name: 'bbb',
          dateOfBirth: new Date(),
          location: 'Urban',
          gender: 'Male' as const,
          secretQuestion: 'favourite_actor',
        }

        await okyUserApplicationService.editInfo(command)
        fail('should have thrown an error') // fail if it didn't throw an error
      } catch (e) {
        expect(e.message).toBe(`Cannot edit info for missing someUserId user`)
      }

      // Verify that byId was called with the correct userId
      expect(okyUserRepository.byId).toHaveBeenCalledWith('someUserId')
    })
  })

  describe('editSecretAnswer', () => {
    it('should successfully edit secret answer', async () => {
      // Mock repository methods
      ;(okyUserRepository.byId as jest.Mock).mockResolvedValue(mockOkyUser)
      ;(okyUserRepository.save as jest.Mock).mockResolvedValue(mockOkyUser)

      // Call replaceStore method
      const command = {
        userId: 'someUserId',
        previousSecretAnswer: 'a',
        nextSecretAnswer: 'b',
      }

      const result = await okyUserApplicationService.editSecretAnswer(command)

      // Verify result and method calls
      expect(result).toBe(mockOkyUser)
      expect(okyUserRepository.byId).toHaveBeenCalledWith('someUserId')
      expect(mockOkyUser.editSecretAnswer).toHaveBeenCalledWith('a', 'b')
    })

    it('should throw an error if the user is not found', async () => {
      // Mock repository methods
      ;(okyUserRepository.byId as jest.Mock).mockResolvedValue(null)

      // Try-Catch to handle expected thrown error
      try {
        const command = {
          userId: 'someUserId',
          previousSecretAnswer: 'a',
          nextSecretAnswer: 'b',
        }

        await okyUserApplicationService.editSecretAnswer(command)
        fail('should have thrown an error') // fail if it didn't throw an error
      } catch (e) {
        expect(e.message).toBe(`Cannot edit info for missing someUserId user`)
      }

      // Verify that byId was called with the correct userId
      expect(okyUserRepository.byId).toHaveBeenCalledWith('someUserId')
    })
  })
})
