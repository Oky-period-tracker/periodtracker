# Custom Avatar Feature Toggle

This document explains how to enable or disable the custom avatar (friend avatar) feature in both the mobile app and the API.

---

## Overview

The custom avatar feature is controlled by **environment variables** on both the app and API sides. Both must be enabled for the feature to work end-to-end.

| Side | Environment Variable | File |
|------|---------------------|------|
| App (React Native) | `EXPO_PUBLIC_USE_AVATAR_CUSTOMIZATION` | `app/.env` |
| API (Node.js) | `USE_AVATAR_CUSTOMIZATION` | `packages/api/.env` |

---

## App Configuration

### Environment Variable

Set in `app/.env`:

```env
# Enable custom avatar feature
EXPO_PUBLIC_USE_AVATAR_CUSTOMIZATION=true

# Disable custom avatar feature
EXPO_PUBLIC_USE_AVATAR_CUSTOMIZATION=false
```

The template file `app/.env.dist` includes this variable for reference when setting up new environments.

### How It Works

1. **Config** (`app/src/config/env.ts`): Reads the environment variable and exports a boolean:
   ```typescript
   export const USE_AVATAR_CUSTOMIZATION = process.env.EXPO_PUBLIC_USE_AVATAR_CUSTOMIZATION === 'true'
   ```

2. **Hook** (`app/src/hooks/useAvatarCustomization.ts`): Provides the flag to components:
   ```typescript
   export const useAvatarCustomization = () => {
     return USE_AVATAR_CUSTOMIZATION
   }
   ```

3. **Components** call `useAvatarCustomization()` to conditionally render avatar features.

### What Changes When Disabled

When `EXPO_PUBLIC_USE_AVATAR_CUSTOMIZATION=false`:

| Component | Behavior |
|-----------|----------|
| **Avatar Selection Screen** (`AvatarScreen/index.tsx`) | The "friend" avatar option is hidden from the avatar list |
| **Main Screen** (`MainScreen/index.tsx`) | The friend unlock modal never appears |
| **Avatar Messages** (`AvatarMessageContext.tsx`) | Lock messages ("Enter your period days to unlock...") are not shown |
| **Progress Section** (`Avatar/ProgressSection.tsx`) | Avatar lock icons are not displayed |
| **Profile Details** (`ProfileScreen/components/ProfileDetails.tsx`) | Avatar name editing section is hidden |

The `CustomAvatar` screen remains registered in the navigation stack but is unreachable since all entry points are hidden.

---

## API Configuration

### Environment Variable

Set in `packages/api/.env`:

```env
# Enable custom avatar feature
USE_AVATAR_CUSTOMIZATION=true

# Disable custom avatar feature
USE_AVATAR_CUSTOMIZATION=false
```

The template file `packages/api/.env.dist` includes this variable for reference.

### How It Works

1. **Config** (`packages/api/src/interfaces/env.ts`): Reads the environment variable:
   ```typescript
   features: {
     useAvatarCustomization: toBool(process.env.USE_AVATAR_CUSTOMIZATION || 'false'),
   }
   ```
   Note: defaults to `false` if the variable is not set.

2. **Endpoint guard** (`packages/api/src/interfaces/api/controllers/account/AccountController.ts`):
   The `POST /account/update-avatar` endpoint checks the flag before processing:
   ```typescript
   if (!env.features.useAvatarCustomization) {
     throw new UnauthorizedError('Avatar customization is not enabled')
   }
   ```

### What Changes When Disabled

When `USE_AVATAR_CUSTOMIZATION=false`:

| Endpoint | Behavior |
|----------|----------|
| `POST /account/update-avatar` | Returns `401 Unauthorized` with message "Avatar customization is not enabled" |

All other endpoints (user registration, login, metadata updates, etc.) continue to work normally.

---

## Enabling the Feature

To fully enable the custom avatar feature:

1. **App**: Set `EXPO_PUBLIC_USE_AVATAR_CUSTOMIZATION=true` in `app/.env`
2. **API**: Set `USE_AVATAR_CUSTOMIZATION=true` in `packages/api/.env`
3. **Database**: Run the migration `sql/1774259288785-custom-avatar-update.sql` to add the `avatar` column
4. **Rebuild** the app and restart the API server

## Disabling the Feature

To fully disable the custom avatar feature:

1. **App**: Set `EXPO_PUBLIC_USE_AVATAR_CUSTOMIZATION=false` in `app/.env`
2. **API**: Set `USE_AVATAR_CUSTOMIZATION=false` in `packages/api/.env`
3. **Rebuild** the app and restart the API server

No database changes are needed when disabling. Existing avatar data is preserved and will be available again if the feature is re-enabled.

---

## Important Notes

- Both the app and API flags should be set consistently. If the app flag is enabled but the API flag is disabled, users will see the avatar UI but saving will fail.
- The flag is read at **build time** for the app (via Expo's environment variable system). Changing the `.env` file requires rebuilding the app.
- The flag is read at **startup time** for the API. Changing the `.env` file requires restarting the API server.
- When the feature is enabled, users must still complete 3 menstrual cycles before the custom avatar unlocks. See [index.md](./index.md#unlock-conditions) for details on the unlock mechanism.
