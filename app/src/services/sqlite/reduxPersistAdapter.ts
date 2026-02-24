import { getDatabase, execAsync, initializeDatabase } from './database'
import { userRepository } from './userRepository'

// Initialize database check flag
let dbInitialized = false

async function ensureDbInitialized(): Promise<void> {
  if (!dbInitialized) {
    try {
      console.log('[PersistAdapter] Ensuring database initialization...')
      // Force initialization through initializeDatabase to ensure tables are created
      const db = await initializeDatabase()
      if (!db) {
        throw new Error('initializeDatabase returned null')
      }
      dbInitialized = true
      console.log('[PersistAdapter] Database ready with tables')
    } catch (error) {
      console.error('[PersistAdapter] Failed to ensure database initialization:', error)
      // Don't suppress - let it fail so we know what's wrong
      throw error
    }
  }
}

/**
 * Redux-Persist storage adapter for SQLite
 * Stores Redux state in SQLite instead of AsyncStorage
 */
export const reduxPersistSQLiteAdapter = {
  // Get item from SQLite
  getItem: async (key: string): Promise<string | null> => {
    try {
      // Ensure database is initialized and tables are created
      await ensureDbInitialized()

      // Extract userId from key (format: "primary_userId" or just "primary")
      const userId = key.split('_')[1] || key

      if (!userId || userId === 'primary') {
        console.log('[PersistAdapter] Skipping primary key')
        return null
      }

      console.log('[PersistAdapter] Getting app state for userId:', userId)
      const appState = await userRepository.getAppState(userId)

      if (!appState) {
        console.log('[PersistAdapter] No app state found for userId:', userId)
        return null
      }

      // Redux-persist expects stringified data
      return appState.appState
    } catch (error) {
      console.error('[PersistAdapter] Error getting item from SQLite:', error)
      // Don't throw, let redux-persist handle missing data gracefully
      return null
    }
  },

  // Set item in SQLite
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      // Ensure database is initialized
      await ensureDbInitialized()

      // Extract userId from key
      const userId = key.split('_')[1] || key

      if (!userId || userId === 'primary' || !value) {
        console.log('[PersistAdapter] Skipping setItem for key:', key)
        return
      }

      console.log('[PersistAdapter] Saving app state for userId:', userId)

      // Parse to get storeVersion if available
      let storeVersion = 1
      try {
        const parsed = JSON.parse(value)
        storeVersion = parsed._persist?.version || 1
      } catch {
        // If parse fails, use default version
      }

      // Save to SQLite
      await userRepository.saveAppState(userId, storeVersion, value)
      console.log('[PersistAdapter] Saved app state for userId:', userId)
    } catch (error) {
      console.error('[PersistAdapter] Error setting item in SQLite:', error)
      // Don't throw - allow app to continue even if persistence fails
    }
  },

  // Remove item from SQLite
  removeItem: async (key: string): Promise<void> => {
    try {
      // Ensure database is initialized
      await ensureDbInitialized()

      const userId = key.split('_')[1] || key

      if (!userId || userId === 'primary') {
        return
      }

      // Delete from user_app_state
      const db = await getDatabase()
      await execAsync(db, 'DELETE FROM user_app_state WHERE userId = ?', [userId])
    } catch (error) {
      console.error('Error removing item from SQLite:', error)
    }
  },

  // Clear all items (not used typically, but required by interface)
  clear: async (): Promise<void> => {
    try {
      // Ensure database is initialized
      await ensureDbInitialized()

      const db = await getDatabase()
      await execAsync(db, 'DELETE FROM user_app_state')
    } catch (error) {
      console.error('Error clearing SQLite storage:', error)
    }
  },

  // Get all keys
  getAllKeys: async (): Promise<string[]> => {
    try {
      // Ensure database is initialized
      await ensureDbInitialized()

      const db = await getDatabase()
      const result = await execAsync(
        db,
        'SELECT userId FROM user_app_state'
      )

      const keys: string[] = []
      result.rows._array.forEach((row: any) => {
        // Row is array format: [userId]
        const userId = Array.isArray(row) ? row[0] : row.userId
        keys.push(`primary_${userId}`)
      })

      return keys
    } catch (error) {
      console.error('Error getting all keys from SQLite:', error)
      return []
    }
  },
}
