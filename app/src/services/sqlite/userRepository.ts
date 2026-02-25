import { getDatabase, execAsync } from './database'

export interface User {
  id: string
  deviceId: string
  name: string
  password: string
  gender?: string
  location?: string
  country?: string
  province?: string
  dateOfBirth?: string
  secretQuestion?: string
  secretAnswer?: string
  metadata?: string
  dateSignedUp?: string
  dateAccountSaved?: string
  appToken?: string
  isActive: number
  isPendingSync: number
  isPendingDelete: number
  isPendingPasswordChange: number
  createdAt: string
  syncedAt?: string
}

export interface AppState {
  userId: string
  storeVersion: number
  appState: string
  createdAt: string
  updatedAt: string
}

class UserRepository {
  private mapRowToUser(row: Record<string, unknown>): User {
    return {
      id: row.id as string,
      deviceId: row.deviceId as string,
      name: row.name as string,
      password: row.password as string,
      gender: row.gender as string | undefined,
      location: row.location as string | undefined,
      country: row.country as string | undefined,
      province: row.province as string | undefined,
      dateOfBirth: row.dateOfBirth as string | undefined,
      secretQuestion: row.secretQuestion as string | undefined,
      secretAnswer: row.secretAnswer as string | undefined,
      metadata: row.metadata as string | undefined,
      dateSignedUp: row.dateSignedUp as string | undefined,
      dateAccountSaved: row.dateAccountSaved as string | undefined,
      appToken: row.appToken as string | undefined,
      isActive: row.isActive as number,
      isPendingSync: row.isPendingSync as number,
      isPendingDelete: row.isPendingDelete as number,
      isPendingPasswordChange: row.isPendingPasswordChange as number,
      createdAt: row.createdAt as string,
      syncedAt: row.syncedAt as string | undefined,
    }
  }

  // Get user by ID
  async getUserById(id: string): Promise<User | null> {
    const db = await getDatabase()
    try {
      const result = await execAsync(db, 'SELECT * FROM users WHERE id = ?', [id])
      if (result.rows.length === 0) {
        return null
      }
      
      const row = result.rows._array[0]
      // Convert array format to object if needed
      let userObj = row
      if (Array.isArray(row)) {
        userObj = {
          id: row[0],
          deviceId: row[1],
          name: row[2],
          password: row[3],
          gender: row[4],
          location: row[5],
          country: row[6],
          province: row[7],
          dateOfBirth: row[8],
          secretQuestion: row[9],
          secretAnswer: row[10],
          metadata: row[11],
          dateSignedUp: row[12],
          dateAccountSaved: row[13],
          appToken: row[14],
          isActive: row[15],
          isPendingSync: row[16],
          isPendingDelete: row[17],
          isPendingPasswordChange: row[18],
          createdAt: row[19],
          syncedAt: row[20],
        }
      }
      
      return this.mapRowToUser(userObj as any)
    } catch (error) {
      console.error('Error getting user by ID:', error)
      return null
    }
  }

  // Get user by name on device
  async getUserByName(name: string, deviceId: string): Promise<User | null> {
    const db = await getDatabase()
    try {
      const result = await execAsync(
        db,
        'SELECT * FROM users WHERE name = ? AND deviceId = ?',
        [name, deviceId]
      )
      console.log('[SQLite] getUserByName result:', JSON.stringify(result.rows._array))
      console.log('[SQLite] Result type:', typeof result.rows._array, 'IsArray:', Array.isArray(result.rows._array))
      console.log('[SQLite] Result length:', result.rows._array.length, result.rows._array.length === 0 ? '(EMPTY - no user found)' : '(FOUND USER)')
      
      // Explicit check for empty result
      if (!result.rows._array || result.rows._array.length === 0) {
        console.log('[SQLite] No user found for name:', name, 'deviceId:', deviceId)
        return null
      }
      
      const row = result.rows._array[0]
      console.log('[SQLite] Row data:', row, 'Type:', typeof row, 'IsArray:', Array.isArray(row))
      
      // Convert array format to object if needed
      let userObj = row
      if (Array.isArray(row)) {
        console.log('[SQLite] Converting array to object, length:', row.length)
        // SELECT * returns: [id, deviceId, name, password, gender, location, country, province, dateOfBirth, secretQuestion, secretAnswer, metadata, dateSignedUp, dateAccountSaved, appToken, isActive, isPendingSync, isPendingDelete, isPendingPasswordChange, createdAt, syncedAt]
        userObj = {
          id: row[0],
          deviceId: row[1],
          name: row[2],
          password: row[3],
          gender: row[4],
          location: row[5],
          country: row[6],
          province: row[7],
          dateOfBirth: row[8],
          secretQuestion: row[9],
          secretAnswer: row[10],
          metadata: row[11],
          dateSignedUp: row[12],
          dateAccountSaved: row[13],
          appToken: row[14],
          isActive: row[15],
          isPendingSync: row[16],
          isPendingDelete: row[17],
          isPendingPasswordChange: row[18],
          createdAt: row[19],
          syncedAt: row[20],
        }
        console.log('[SQLite] Converted - id:', userObj.id, 'name:', userObj.name, 'deviceId:', userObj.deviceId)
      }
      
      const user = this.mapRowToUser(userObj as any)
      console.log('User found:', user.name, 'id:', user.id)
      return user
    } catch (error) {
      console.error('[SQLite] Error getting user by name:', error)
      return null
    }
  }

  // Get all users on device
  async getUsersByDevice(deviceId: string): Promise<User[]> {
    const db = await getDatabase()
    try {
      const result = await execAsync(
        db,
        'SELECT * FROM users WHERE deviceId = ? ORDER BY createdAt DESC',
        [deviceId]
      )

      return result.rows._array.map((row: any) => {
        // Convert array format to object if needed
        let userObj = row
        if (Array.isArray(row)) {
          userObj = {
            id: row[0],
            deviceId: row[1],
            name: row[2],
            password: row[3],
            gender: row[4],
            location: row[5],
            country: row[6],
            province: row[7],
            dateOfBirth: row[8],
            secretQuestion: row[9],
            secretAnswer: row[10],
            metadata: row[11],
            dateSignedUp: row[12],
            dateAccountSaved: row[13],
            appToken: row[14],
            isActive: row[15],
            isPendingSync: row[16],
            isPendingDelete: row[17],
            isPendingPasswordChange: row[18],
            createdAt: row[19],
            syncedAt: row[20],
          }
        }
        return this.mapRowToUser(userObj as any) as User
      })
    } catch (error) {
      console.error('Error getting users by device:', error)
      return []
    }
  }

  // Check if username is taken on this device
  async isNameTakenOnDevice(name: string, deviceId: string): Promise<boolean> {
    const user = await this.getUserByName(name, deviceId)
    return !!user
  }

  // Get user count on device
  async getUserCount(deviceId: string): Promise<number> {
    const db = await getDatabase()
    try {
      const result = await execAsync(
        db,
        'SELECT COUNT(*) FROM users WHERE deviceId = ?',
        [deviceId]
      )
      // COUNT(*) returns array with single value: [[count]]
      const countValue = result.rows._array[0]
      if (Array.isArray(countValue)) {
        return (countValue[0] as number) || 0
      }
      return (countValue?.count as number) || 0
    } catch (error) {
      console.error('Error getting user count:', error)
      return 0
    }
  }

  // Create user
  async createUser(user: Omit<User, 'createdAt' | 'syncedAt'>): Promise<User> {
    const db = await getDatabase()
    try {
      const createdAt = new Date().toISOString()
      
      console.log('[SQLite] Creating user with deviceId:', user.deviceId)
      
      // Use INSERT OR REPLACE to handle concurrent creates
      await execAsync(
        db,
        `INSERT OR REPLACE INTO users (
          id, deviceId, name, password, gender, location, country, province,
          dateOfBirth, secretQuestion, secretAnswer, metadata, dateSignedUp,
          dateAccountSaved, appToken, isActive, isPendingSync, isPendingDelete,
          isPendingPasswordChange, createdAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user.id, user.deviceId, user.name, user.password,
          user.gender ?? null, user.location ?? null, user.country ?? null, user.province ?? null,
          user.dateOfBirth ?? null, user.secretQuestion ?? null, user.secretAnswer ?? null,
          user.metadata ?? null, user.dateSignedUp ?? null, user.dateAccountSaved ?? null,
          user.appToken ?? null, user.isActive ? 1 : 0, user.isPendingSync ? 1 : 0,
          user.isPendingDelete ? 1 : 0, user.isPendingPasswordChange ? 1 : 0, createdAt
        ]
      )
      console.log('[SQLite] User created/updated:', user.id, 'isPendingSync:', user.isPendingSync ? 1 : 0, 'deviceId:', user.deviceId)
      return { ...user, createdAt, syncedAt: undefined }
    } catch (error) {
      console.error('[SQLite] Error creating user:', error)
      throw error
    }
  }

  // Update user
  async updateUser(user: User): Promise<void> {
    const db = await getDatabase()
    try {
      await execAsync(
        db,
        `UPDATE users SET
          name = ?, password = ?, gender = ?, location = ?, country = ?,
          province = ?, dateOfBirth = ?, secretQuestion = ?, secretAnswer = ?,
          metadata = ?, dateSignedUp = ?, dateAccountSaved = ?, appToken = ?,
          isActive = ?, isPendingSync = ?, isPendingDelete = ?,
          isPendingPasswordChange = ?, syncedAt = ?
        WHERE id = ?`,
        [
          user.name, user.password, user.gender ?? null, user.location ?? null, user.country ?? null,
          user.province ?? null, user.dateOfBirth ?? null, user.secretQuestion ?? null,
          user.secretAnswer ?? null, user.metadata ?? null, user.dateSignedUp ?? null,
          user.dateAccountSaved ?? null, user.appToken ?? null, user.isActive ? 1 : 0,
          user.isPendingSync ? 1 : 0, user.isPendingDelete ? 1 : 0,
          user.isPendingPasswordChange ? 1 : 0, user.syncedAt ?? null, user.id
        ]
      )
      console.log('[SQLite] User updated:', user.id, 'isPendingSync:', user.isPendingSync ? 1 : 0)
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }

  // Delete user
  async deleteUser(id: string): Promise<void> {
    const db = await getDatabase()
    try {
      await execAsync(db, 'DELETE FROM users WHERE id = ?', [id])
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  }

  // Get users with pending delete
  async getUsersWithPendingDelete(): Promise<User[]> {
    const db = await getDatabase()
    try {
      const result = await execAsync(db, 'SELECT * FROM users WHERE isPendingDelete = 1')
      return result.rows._array.map((row: any) => {
        let userObj = row
        if (Array.isArray(row)) {
          userObj = {
            id: row[0],
            deviceId: row[1],
            name: row[2],
            password: row[3],
            gender: row[4],
            location: row[5],
            country: row[6],
            province: row[7],
            dateOfBirth: row[8],
            secretQuestion: row[9],
            secretAnswer: row[10],
            metadata: row[11],
            dateSignedUp: row[12],
            dateAccountSaved: row[13],
            appToken: row[14],
            isActive: row[15],
            isPendingSync: row[16],
            isPendingDelete: row[17],
            isPendingPasswordChange: row[18],
            createdAt: row[19],
            syncedAt: row[20],
          }
        }
        return this.mapRowToUser(userObj as any) as User
      })
    } catch (error) {
      console.error('Error getting pending deletes:', error)
      return []
    }
  }

  // Get users with pending password change
  async getUsersWithPendingPasswordChange(): Promise<User[]> {
    const db = await getDatabase()
    try {
      const result = await execAsync(db, 'SELECT * FROM users WHERE isPendingPasswordChange = 1')
      return result.rows._array.map((row: any) => {
        let userObj = row
        if (Array.isArray(row)) {
          userObj = {
            id: row[0],
            deviceId: row[1],
            name: row[2],
            password: row[3],
            gender: row[4],
            location: row[5],
            country: row[6],
            province: row[7],
            dateOfBirth: row[8],
            secretQuestion: row[9],
            secretAnswer: row[10],
            metadata: row[11],
            dateSignedUp: row[12],
            dateAccountSaved: row[13],
            appToken: row[14],
            isActive: row[15],
            isPendingSync: row[16],
            isPendingDelete: row[17],
            isPendingPasswordChange: row[18],
            createdAt: row[19],
            syncedAt: row[20],
          }
        }
        return this.mapRowToUser(userObj as any) as User
      })
    } catch (error) {
      console.error('Error getting pending password changes:', error)
      return []
    }
  }

  // Get users with pending sync
  async getUsersWithPendingSync(): Promise<User[]> {
    const db = await getDatabase()
    try {
      // First, get all users to see their isPendingSync values
      const allResult = await execAsync(db, 'SELECT id, isPendingSync FROM users')
      console.log('[SQLite] All users isPendingSync values:', allResult.rows._array)
      
      const result = await execAsync(db, 'SELECT * FROM users WHERE isPendingSync = 1')
      console.log('[SQLite] getUsersWithPendingSync raw result count:', result.rows._array.length)
      console.log('[SQLite] getUsersWithPendingSync raw result:', result.rows._array)
      const mapped = result.rows._array.map((row: any) => {
        let userObj = row
        if (Array.isArray(row)) {
          userObj = {
            id: row[0],
            deviceId: row[1],
            name: row[2],
            password: row[3],
            gender: row[4],
            location: row[5],
            country: row[6],
            province: row[7],
            dateOfBirth: row[8],
            secretQuestion: row[9],
            secretAnswer: row[10],
            metadata: row[11],
            dateSignedUp: row[12],
            dateAccountSaved: row[13],
            appToken: row[14],
            isActive: row[15],
            isPendingSync: row[16],
            isPendingDelete: row[17],
            isPendingPasswordChange: row[18],
            createdAt: row[19],
            syncedAt: row[20],
          }
        }
        console.log('[SQLite] Mapped user:', { id: userObj.id, deviceId: userObj.deviceId, name: userObj.name })
        return this.mapRowToUser(userObj as any) as User
      })
      console.log('[SQLite] Final mapped users with deviceId:', mapped.map(u => ({ id: u.id, deviceId: u.deviceId })))
      return mapped
    } catch (error) {
      console.error('Error getting pending syncs:', error)
      return []
    }
  }

  // Clear pending flags
  async clearPendingFlags(userId: string): Promise<void> {
    const db = await getDatabase()
    try {
      await execAsync(
        db,
        `UPDATE users SET
          isPendingSync = 0, isPendingDelete = 0, isPendingPasswordChange = 0
        WHERE id = ?`,
        [userId]
      )
    } catch (error) {
      console.error('Error clearing pending flags:', error)
    }
  }

  // Mark user for deletion
  async markForDeletion(userId: string): Promise<void> {
    const db = await getDatabase()
    try {
      await execAsync(
        db,
        'UPDATE users SET isPendingDelete = 1, isPendingSync = 1 WHERE id = ?',
        [userId]
      )
    } catch (error) {
      console.error('Error marking user for deletion:', error)
    }
  }

  // Mark password change pending
  async markPasswordChangeSync(userId: string): Promise<void> {
    const db = await getDatabase()
    try {
      await execAsync(
        db,
        'UPDATE users SET isPendingPasswordChange = 1, isPendingSync = 1 WHERE id = ?',
        [userId]
      )
    } catch (error) {
      console.error('Error marking password change sync:', error)
    }
  }

  // Save app state
  async saveAppState(userId: string, storeVersion: number, appState: string): Promise<void> {
    const db = await getDatabase()
    try {
      const now = new Date().toISOString()
      // Use INSERT ... ON CONFLICT DO UPDATE (UPSERT) for safe concurrent updates
      await execAsync(
        db,
        `INSERT INTO user_app_state (userId, storeVersion, appState, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(userId) DO UPDATE SET
           storeVersion = excluded.storeVersion,
           appState = excluded.appState,
           updatedAt = excluded.updatedAt`,
        [userId, storeVersion, appState, now, now]
      )
    } catch (error) {
      console.error('Error saving app state:', error)
      throw error
    }
  }

  // Get app state
  async getAppState(userId: string): Promise<AppState | null> {
    const db = await getDatabase()
    try {
      const result = await execAsync(
        db,
        'SELECT * FROM user_app_state WHERE userId = ? ORDER BY updatedAt DESC LIMIT 1',
        [userId]
      )

      if (result.rows.length === 0) {
        return null
      }

      const row = result.rows._array[0]
      
      // Convert array format to object if needed
      let appStateObj = row
      if (Array.isArray(row)) {
        // SELECT * returns: [id, userId, storeVersion, appState, createdAt, updatedAt]
        appStateObj = {
          userId: row[1],
          storeVersion: row[2],
          appState: row[3],
          createdAt: row[4],
          updatedAt: row[5],
        }
      }

      return {
        userId: appStateObj.userId as string,
        storeVersion: appStateObj.storeVersion as number,
        appState: appStateObj.appState as string,
        createdAt: appStateObj.createdAt as string,
        updatedAt: appStateObj.updatedAt as string,
      }
    } catch (error) {
      console.error('Error getting app state:', error)
      return null
    }
  }
}

export const userRepository = new UserRepository()
