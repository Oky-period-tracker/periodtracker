import * as SQLite from 'expo-sqlite'
import type { SQLiteDatabase } from 'expo-sqlite'

interface ExecuteSqlResult {
  rows: {
    _array: Record<string, unknown>[]
    [key: number]: Record<string, unknown>
    length: number
  }
  rowsAffected: number
  insertId?: number
}

let db: SQLiteDatabase | null = null

// Helper to use the proper v15 API with prepared statements
async function execAsync(
  database: SQLiteDatabase,
  sql: string,
  params: (string | number | null)[] = []
): Promise<ExecuteSqlResult> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dbAny = database as any

    // Verify database object is valid
    if (!dbAny || typeof dbAny !== 'object') {
      throw new Error(`[SQLite] Invalid database object: ${typeof dbAny}`)
    }

    const sqlPreview = sql.substring(0, 80).replace(/\n/g, ' ')
    console.log('[SQLite] Executing SQL:', sqlPreview + (sql.length > 80 ? '...' : ''))
    if (params.length > 0) {
      console.log('[SQLite] Params:', params)
    }

    // Determine if this is a SELECT statement
    const isSelect = sql.trim().toUpperCase().startsWith('SELECT')
    
    // If no parameters and it's DDL (CREATE, ALTER, DROP), use execAsync directly
    if (!isSelect && params.length === 0 && typeof dbAny.execAsync === 'function') {
      console.log('[SQLite] Using database.execAsync() for DDL')
      const result = await dbAny.execAsync(sql)
      console.log('[SQLite] DDL executed successfully')
      return {
        rows: { _array: [], length: 0 },
        rowsAffected: 0,
        insertId: undefined,
      }
    }

    // v15 API: use prepareAsync for parameterized queries
    if (typeof dbAny.prepareAsync === 'function') {
      console.log('[SQLite] Using prepareAsync API (v15)')
      
      const statement = await dbAny.prepareAsync(sql)
      console.log('[SQLite] Statement prepared successfully')
      
      // Bind parameters - convert null to undefined for Kotlin compatibility
      const sanitizedParams = params.map(p => p === null ? undefined : p)
      
      let rows: any[] = []
      if (isSelect) {
        // For SELECT statements - use executeForRawResultAsync to get a statement-like result
        console.log('[SQLite] Executing SELECT with executeForRawResultAsync')
        
        const result = await statement.executeForRawResultAsync(...sanitizedParams)
        console.log('[SQLite] SELECT executed, result type:', typeof result)
        
        // The result is a statement-like object with getAllAsync() method
        if (result && typeof result.getAllAsync === 'function') {
          console.log('[SQLite] Calling getAllAsync() to get rows')
          rows = await result.getAllAsync()
          console.log('[SQLite] Got rows:', rows?.length || 0)
        } else if (Array.isArray(result)) {
          rows = result
        } else if (result && result._array && Array.isArray(result._array)) {
          rows = result._array
        } else {
          console.warn('[SQLite] Result is a statement object:', Object.keys(result || {}).join(', '))
          rows = []
        }
        console.log('[SQLite] Rows retrieved:', rows?.length || 0)
      } else {
        // For DDL (CREATE, ALTER, DROP) and DML (INSERT, UPDATE, DELETE)
        console.log('[SQLite] Executing DDL/DML with executeAsync')
        
        await statement.executeAsync(...sanitizedParams)
        console.log('[SQLite] DDL/DML statement executed')
      }
      
      // Finalize the statement
      await statement.finalizeAsync()
      console.log('[SQLite] Statement finalized')
      
      return {
        rows: {
          _array: (rows as Record<string, unknown>[]) || [],
          length: rows?.length || 0,
        },
        rowsAffected: statement.changes || 0,
        insertId: undefined,
      }
    }

    throw new Error(`[SQLite] Database has no prepareAsync method. Available: ${Object.keys(dbAny).join(', ')}`)
  } catch (error) {
    console.error('[SQLite] execAsync error:', error)
    console.error('[SQLite] Error SQL:', sql.substring(0, 100))
    if (params.length > 0) {
      console.error('[SQLite] Error params:', params)
    }
    throw error
  }
}

export async function initializeDatabase(): Promise<SQLiteDatabase> {
  if (db) {
    console.log('[SQLite] Database already initialized')
    return db
  }

  try {
    console.log('[SQLite] Opening database with openDatabaseAsync...')
    
    // v14 API: use openDatabaseAsync
    db = await SQLite.openDatabaseAsync('periodtracker.db')

    console.log('[SQLite] Database opened successfully')
    if (db && typeof db === 'object') {
      const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(db))
      console.log('[SQLite] Database methods:', methods.slice(0, 10).join(', '))
    }

    // Create tables sequentially
    console.log('[SQLite] Creating tables...')
    await createTables(db)

    console.log('[SQLite] Database initialized successfully')
    return db
  } catch (error) {
    console.error('[SQLite] Error initializing database:', error)
    db = null
    throw error
  }
}

async function createTables(database: SQLiteDatabase): Promise<void> {
  try {
    // Users table
    console.log('[SQLite] Creating users table...')
    await execAsync(database, `
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        deviceId TEXT NOT NULL,
        name TEXT NOT NULL,
        password TEXT NOT NULL,
        gender TEXT,
        location TEXT,
        country TEXT,
        province TEXT,
        dateOfBirth TEXT,
        secretQuestion TEXT,
        secretAnswer TEXT,
        metadata TEXT,
        dateSignedUp TEXT,
        dateAccountSaved TEXT,
        appToken TEXT,
        isActive INTEGER DEFAULT 0,
        isPendingSync INTEGER DEFAULT 0,
        isPendingDelete INTEGER DEFAULT 0,
        isPendingPasswordChange INTEGER DEFAULT 0,
        createdAt TEXT,
        syncedAt TEXT,
        UNIQUE(deviceId, name)
      )
    `)
    console.log('[SQLite] Users table created')

    // User app state table
    console.log('[SQLite] Creating user_app_state table...')
    await execAsync(database, `
      CREATE TABLE IF NOT EXISTS user_app_state (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT NOT NULL UNIQUE,
        storeVersion INTEGER,
        appState TEXT,
        createdAt TEXT,
        updatedAt TEXT,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `)
    console.log('[SQLite] User app state table created')

    // Device info table
    console.log('[SQLite] Creating device_info table...')
    await execAsync(database, `
      CREATE TABLE IF NOT EXISTS device_info (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        deviceId TEXT UNIQUE,
        totalUsers INTEGER DEFAULT 0,
        createdAt TEXT
      )
    `)
    console.log('[SQLite] Device info table created')

    console.log('[SQLite] All tables created successfully')
  } catch (error) {
    console.error('[SQLite] Error creating tables:', error)
    // IMPORTANT: Must throw the error so initialization fails
    throw error
  }
}

export async function getDatabase(): Promise<SQLiteDatabase> {
  if (!db) {
    return await initializeDatabase()
  }
  return db
}

export async function closeDatabase(): Promise<void> {
  if (db) {
    try {
      db = null
      console.log('Database closed')
    } catch (error) {
      console.error('Error closing database:', error)
    }
  }
}

export async function resetDatabase(): Promise<void> {
  if (!db) {
    db = await getDatabase()
  }

  try {
    await execAsync(db, 'DROP TABLE IF EXISTS user_app_state')
    await execAsync(db, 'DROP TABLE IF EXISTS users')
    await execAsync(db, 'DROP TABLE IF EXISTS device_info')
    console.log('[SQLite] Database reset')
    
    // Recreate tables
    await createTables(db)
  } catch (error) {
    console.error('[SQLite] Error resetting database:', error)
    throw error
  }
}

export async function verifyDatabaseData() {
  try {
    const database = await getDatabase()
    
    console.log('\n========== DATABASE VERIFICATION ==========')
    
    // Check users table
    const usersResult = await execAsync(
      database,
      'SELECT COUNT(*) as count FROM users;',
      []
    )
    console.log('[SQLite] Users count result:', JSON.stringify(usersResult.rows._array))
    // Data comes as array of arrays: [[3]]
    const userCount = Array.isArray(usersResult.rows._array[0]) 
      ? usersResult.rows._array[0][0] 
      : usersResult.rows._array[0]?.count || 0
    console.log(`[SQLite] Total users in database: ${userCount}`)
    
    // Get all users
    let allUsers: any = null
    if (userCount > 0) {
      allUsers = await execAsync(
        database,
        'SELECT id, name, password, appToken, isPendingSync, createdAt FROM users ORDER BY createdAt DESC;',
        []
      )
      console.log('[SQLite] Raw user data:', JSON.stringify(allUsers.rows._array))
      console.log('[SQLite] First user type:', typeof allUsers.rows._array[0])
      console.log('[SQLite] First user:', allUsers.rows._array[0])
      
      // Convert array format to object format if needed
      const users = allUsers.rows._array.map((user: any) => {
        if (Array.isArray(user)) {
          // Data comes as [id, name, password, appToken, isPendingSync, createdAt]
          return {
            id: user[0],
            name: user[1],
            password: user[2],
            appToken: user[3],
            isPendingSync: user[4],
            createdAt: user[5],
          }
        }
        // Already an object
        return user
      })
      
      console.log('[SQLite] Users in database:')
      users.forEach((user: any, idx: number) => {
        console.log(
          `  ${idx + 1}. Username: ${user.name}, Token: ${user.appToken ? 'YES' : 'NO'}, PendingSync: ${user.isPendingSync ? 'YES' : 'SYNCED'}, Created: ${user.createdAt}`
        )
      })
      
      allUsers.rows._array = users
    }
    
    // Check app state table
    const appStateResult = await execAsync(
      database,
      'SELECT COUNT(*) as count FROM user_app_state;',
      []
    )
    console.log('[SQLite] App states count result:', JSON.stringify(appStateResult.rows._array))
    // Data comes as array of arrays: [[1]]
    const appStateCount = Array.isArray(appStateResult.rows._array[0])
      ? appStateResult.rows._array[0][0]
      : appStateResult.rows._array[0]?.count || 0
    console.log(`\n[SQLite] Total app states saved: ${appStateCount}`)
    
    let appStates: any = null
    if (appStateCount > 0) {
      appStates = await execAsync(
        database,
        'SELECT userId, storeVersion, updatedAt FROM user_app_state ORDER BY updatedAt DESC LIMIT 5;',
        []
      )
      console.log('[SQLite] Raw app state data:', JSON.stringify(appStates.rows._array))
      
      // Convert array format to object format if needed
      const states = appStates.rows._array.map((state: any) => {
        if (Array.isArray(state)) {
          // Data comes as [userId, storeVersion, updatedAt]
          return {
            userId: state[0],
            storeVersion: state[1],
            updatedAt: state[2],
          }
        }
        return state // Already an object
      })
      
      console.log('[SQLite] Latest app states:')
      states.forEach((state: any, idx: number) => {
        console.log(
          `  ${idx + 1}. UserId: ${state.userId}, Version: ${state.storeVersion}, Updated: ${state.updatedAt}`
        )
      })
      
      appStates.rows._array = states
    }
    
    console.log('==========================================\n')
    
    return {
      userCount,
      appStateCount,
      users: allUsers?.rows._array || [],
      appStates: appStates?.rows._array || [],
    }
  } catch (error) {
    console.error('[SQLite] Failed to verify database:', error)
    throw error
  }
}

// Make this globally accessible for debugging
if (typeof globalThis !== 'undefined') {
  (globalThis as any).__verifyDatabase = verifyDatabaseData
}

export { execAsync }
