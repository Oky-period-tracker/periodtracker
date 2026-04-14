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

async function execAsync(
  database: SQLiteDatabase,
  sql: string,
  params: (string | number | null)[] = []
): Promise<ExecuteSqlResult> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dbAny = database as any

    if (!dbAny || typeof dbAny !== 'object') {
      throw new Error(`[SQLite] Invalid database object: ${typeof dbAny}`)
    }

    const isSelect = sql.trim().toUpperCase().startsWith('SELECT')
    
    if (!isSelect && params.length === 0 && typeof dbAny.execAsync === 'function') {
      await dbAny.execAsync(sql)
      return {
        rows: { _array: [], length: 0 },
        rowsAffected: 0,
        insertId: undefined,
      }
    }

    // v15 API: use prepareAsync for parameterized queries
    if (typeof dbAny.prepareAsync === 'function') {
      const statement = await dbAny.prepareAsync(sql)
      const sanitizedParams = params.map(p => p === null ? undefined : p)
      
      let rows: any[] = []
      if (isSelect) {
        const result = await statement.executeForRawResultAsync(...sanitizedParams)
        if (result && typeof result.getAllAsync === 'function') {
          rows = await result.getAllAsync()
        } else if (Array.isArray(result)) {
          rows = result
        } else if (result && result._array && Array.isArray(result._array)) {
          rows = result._array
        } else {
          rows = []
        }
      } else {
        await statement.executeAsync(...sanitizedParams)
      }
      
      await statement.finalizeAsync()
      
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
    return db
  }

  try {
    db = await SQLite.openDatabaseAsync('periodtracker.db')
    await createTables(db)
    return db
  } catch (error) {
    console.error('[SQLite] Error initializing database:', error)
    db = null
    throw error
  }
}

async function createTables(database: SQLiteDatabase): Promise<void> {
  try {
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
        passwordHash TEXT,
        passwordSalt TEXT,
        secretAnswerHash TEXT,
        secretAnswerSalt TEXT,
        UNIQUE(deviceId, name)
      )
    `)

    // Migration: add hash columns for existing databases
    // Use raw db.execAsync to silently skip if columns already exist
    const dbAny = database as any
    for (const col of ['passwordHash TEXT', 'passwordSalt TEXT', 'secretAnswerHash TEXT', 'secretAnswerSalt TEXT']) {
      try {
        await dbAny.execAsync(`ALTER TABLE users ADD COLUMN ${col}`)
      } catch {
        // Column already exists — safe to ignore
      }
    }

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

    await execAsync(database, `
      CREATE TABLE IF NOT EXISTS device_info (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        deviceId TEXT UNIQUE,
        totalUsers INTEGER DEFAULT 0,
        createdAt TEXT
      )
    `)
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
    await createTables(db)
  } catch (error) {
    console.error('[SQLite] Error resetting database:', error)
    throw error
  }
}

export async function verifyDatabaseData() {
  try {
    const database = await getDatabase()

    const usersResult = await execAsync(database, 'SELECT COUNT(*) as count FROM users;', [])
    const userCount = Array.isArray(usersResult.rows._array[0])
      ? usersResult.rows._array[0][0]
      : usersResult.rows._array[0]?.count || 0

    let allUsers: any = null
    if (userCount > 0) {
      allUsers = await execAsync(
        database,
        'SELECT id, name, appToken, isPendingSync, createdAt FROM users ORDER BY createdAt DESC;',
        [],
      )
      allUsers.rows._array = allUsers.rows._array.map((user: any) => {
        if (Array.isArray(user)) {
          return { id: user[0], name: user[1], appToken: user[2], isPendingSync: user[3], createdAt: user[4] }
        }
        return user
      })
    }

    const appStateResult = await execAsync(database, 'SELECT COUNT(*) as count FROM user_app_state;', [])
    const appStateCount = Array.isArray(appStateResult.rows._array[0])
      ? appStateResult.rows._array[0][0]
      : appStateResult.rows._array[0]?.count || 0

    let appStates: any = null
    if (appStateCount > 0) {
      appStates = await execAsync(
        database,
        'SELECT userId, storeVersion, updatedAt FROM user_app_state ORDER BY updatedAt DESC LIMIT 5;',
        [],
      )
      appStates.rows._array = appStates.rows._array.map((state: any) => {
        if (Array.isArray(state)) {
          return { userId: state[0], storeVersion: state[1], updatedAt: state[2] }
        }
        return state
      })
    }

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
