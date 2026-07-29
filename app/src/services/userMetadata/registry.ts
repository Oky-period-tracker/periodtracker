// The account registry: the list of local accounts plus the active user id, kept in
// AsyncStorage under a single key. All writes go through a serialized queue so concurrent
// mutations (e.g. signup racing a sync) cannot clobber each other.
import AsyncStorage from '@react-native-async-storage/async-storage'
import { USERS_REGISTRY_KEY } from '../storage/storageKeys'
import { deleteCredential } from '../auth/credentialVault'
import {
  ENFORCE_ACCOUNT_LIMIT,
  MAX_ACCOUNTS_PER_DEVICE,
  RegisteredUser,
  UsersRegistry,
} from './types'

export const MAX_ACCOUNTS_ERROR = 'MAX_ACCOUNTS'

let writeChain: Promise<unknown> = Promise.resolve()

async function load(): Promise<UsersRegistry> {
  try {
    const raw = await AsyncStorage.getItem(USERS_REGISTRY_KEY)
    if (!raw) {
      return { users: [], activeUserId: null }
    }
    const parsed = JSON.parse(raw) as UsersRegistry
    return { users: parsed.users || [], activeUserId: parsed.activeUserId ?? null }
  } catch {
    return { users: [], activeUserId: null }
  }
}

// Serialize read-modify-write so concurrent callers never lose an update.
function mutate<T>(fn: (reg: UsersRegistry) => { next: UsersRegistry; result: T }): Promise<T> {
  const run = writeChain.then(async () => {
    const reg = await load()
    const { next, result } = fn(reg)
    await AsyncStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(next))
    return result
  })
  writeChain = run.then(
    () => undefined,
    () => undefined,
  )
  return run
}

export async function listUsers(): Promise<RegisteredUser[]> {
  return (await load()).users
}

export async function getActiveUserId(): Promise<string | null> {
  return (await load()).activeUserId
}

export async function getUser(id: string): Promise<RegisteredUser | null> {
  return (await load()).users.find((u) => u.id === id) ?? null
}

export async function findUserByName(name: string): Promise<RegisteredUser | null> {
  const target = name.trim().toLowerCase()
  return (await load()).users.find((u) => u.name.trim().toLowerCase() === target) ?? null
}

export async function userCount(): Promise<number> {
  return (await load()).users.length
}

export async function addUser(
  user: Omit<RegisteredUser, 'isActive' | 'createdAt'> & { createdAt?: string },
): Promise<RegisteredUser> {
  return mutate((reg) => {
    const exists = reg.users.some((u) => u.id === user.id)
    if (ENFORCE_ACCOUNT_LIMIT && !exists && reg.users.length >= MAX_ACCOUNTS_PER_DEVICE) {
      throw new Error(MAX_ACCOUNTS_ERROR)
    }
    const record: RegisteredUser = {
      ...user,
      isActive: false,
      createdAt: user.createdAt ?? new Date().toISOString(),
    }
    const others = reg.users.filter((u) => u.id !== user.id)
    return { next: { ...reg, users: [...others, record] }, result: record }
  })
}

export async function updateUser(id: string, patch: Partial<RegisteredUser>): Promise<void> {
  await mutate((reg) => ({
    next: { ...reg, users: reg.users.map((u) => (u.id === id ? { ...u, ...patch } : u)) },
    result: undefined,
  }))
}

export async function setActiveUser(id: string | null): Promise<void> {
  await mutate((reg) => ({
    next: {
      activeUserId: id,
      users: reg.users.map((u) => ({
        ...u,
        isActive: u.id === id,
        lastActiveAt: u.id === id ? new Date().toISOString() : u.lastActiveAt,
      })),
    },
    result: undefined,
  }))
}

export async function markSynced(
  id: string,
  serverId: string,
  appToken?: string | null,
): Promise<void> {
  await updateUser(id, { isPendingSync: false, serverId, appToken: appToken ?? null })
}

export async function markPendingDelete(id: string): Promise<void> {
  await updateUser(id, { isPendingDelete: true })
}

import { purgeUserStorage } from '../../redux/storeManager'

// Fully remove an account: registry entry, its encrypted per-user store blob, and its
// credentials.
export async function removeUser(id: string): Promise<void> {
  await purgeUserStorage(id)
  await deleteCredential(id)
  await mutate((reg) => {
    const users = reg.users.filter((u) => u.id !== id)
    const activeUserId = reg.activeUserId === id ? null : reg.activeUserId
    return { next: { users, activeUserId }, result: undefined }
  })
}
