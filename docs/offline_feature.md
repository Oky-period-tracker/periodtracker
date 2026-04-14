# Offline Multi-User Feature

This document describes the offline account management feature, including how accounts are stored locally, how passwords are protected, and how accounts are synchronised to the server when a connection becomes available.

---

## Overview

Users can create and manage up to 3 accounts on a single device without an internet connection. Accounts are stored locally in a SQLite database. When the device comes online, pending accounts are automatically synced to the backend API.

---

## Account Storage

Accounts are stored in a local SQLite database (`periodtracker.db`) using the `users` table.

The following rules apply to sensitive fields:

- `password` column is always stored as an empty string. The plain password is never written to SQLite.
- `secretAnswer` column is always stored as null. The plain secret answer is never written to SQLite.
- `passwordHash` and `passwordSalt` store the result of PBKDF2-equivalent hashing (1000 rounds of SHA-256 with a random 16-byte salt per user) using `expo-crypto`.
- `secretAnswerHash` and `secretAnswerSalt` store the hashed secret answer using the same algorithm.

---

## Password Hashing

Hashing is implemented in `app/src/services/sqlite/hashUtils.ts`.

The algorithm iterates SHA-256 over the input concatenated with a random salt, 1000 times. This is a practical tradeoff because `expo-crypto` runs on the Hermes JavaScript thread and higher iteration counts cause noticeable UI lag on mobile. The PBKDF2 standard recommends 100,000+ iterations in server environments.

Each user gets a unique random salt generated at account creation time. The salt is stored alongside the hash in SQLite.

---

## Secure Storage (Keychain / Keystore)

The plain password and plain secret answer are stored temporarily in iOS Keychain or Android Keystore using `expo-secure-store`. This is implemented in `app/src/services/sqlite/secureStorage.ts`.

The lifecycle is:

1. Account is created offline. Plain password and secret answer are saved to secure storage.
2. When the device comes online, the sync process reads the plain credentials from secure storage and sends them to the API.
3. After a successful sync, the plain credentials are deleted from secure storage.

If `expo-secure-store` is not available (for example, in Expo Go during development), an in-memory Map is used as a fallback. This fallback does not persist across app restarts.

Key prefixes used in secure storage:

- Password: `oky_sync_pw_<userId>`
- Secret answer: `oky_sync_sa_<userId>`

---

## Background Sync

The `syncPendingAccounts` saga runs in the background every 60 seconds. It checks for any accounts with `isPendingSync = 1` and attempts to register them with the API.

For each pending account:

1. The plain password is read from secure storage.
2. The plain secret answer is read from secure storage, with a fallback to the SQLite column for legacy accounts created before this feature was added.
3. The account is submitted to `POST /account/signup` with `preferredId` and `deviceId` included.
4. On success, the account is updated with the `appToken` returned from the server and marked as synced.
5. The plain credentials are deleted from secure storage.

If sync fails for an account, it is skipped and retried on the next cycle.

---

## Device Limit

A maximum of 3 accounts are allowed per device. This is enforced in the saga before creating a new account, with a final check just before the SQLite insert to prevent race conditions.

---

## Legacy Account Compatibility

Accounts created before the hashing feature was added do not have `passwordHash` or `secretAnswerHash` values. The login and forgot password flows check for the presence of a hash before verifying. If no hash exists, the plain value stored in the `password` or `secretAnswer` column is compared directly as a fallback.

---

## Database Migration

When the app opens on a device that already has a `users` table without the hash columns, a silent migration is run:

```sql
ALTER TABLE users ADD COLUMN passwordHash TEXT
ALTER TABLE users ADD COLUMN passwordSalt TEXT
ALTER TABLE users ADD COLUMN secretAnswerHash TEXT
ALTER TABLE users ADD COLUMN secretAnswerSalt TEXT
```

Errors from `ALTER TABLE` (column already exists) are caught and ignored.

---

## Files Changed

| File | Description |
| --- | --- |
| `app/src/services/sqlite/hashUtils.ts` | PBKDF2-equivalent hashing using expo-crypto |
| `app/src/services/sqlite/secureStorage.ts` | Keychain / Keystore wrapper with Expo Go fallback |
| `app/src/services/sqlite/database.ts` | Hash columns added to CREATE TABLE and migration |
| `app/src/services/sqlite/userRepository.ts` | Hashing on create/update, secure storage lifecycle |
| `app/src/redux/sagas/authSaga.ts` | Offline login, background sync, deviceId forwarding |
| `app/src/screens/AuthScreen/components/ForgotPassword.tsx` | Offline forgot password with hash verification |
| `app/src/services/HttpClient.ts` | deviceId forwarded to signup API |
