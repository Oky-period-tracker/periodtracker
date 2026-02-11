import { PersistMigrate } from 'redux-persist'

export const reduxStoreVersion = 0

export const reduxMigrations: { [key: number]: PersistMigrate } = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  0: (oldState: any) => {
    if (!oldState?.auth?.user) {
      // No user to migrate
      return oldState
    }

    if (oldState?.auth?.user?.metadata) {
      // Already migrated
      return oldState
    }

    return {
      ...oldState,
      auth: {
        ...oldState.auth,
        user: {
          ...oldState.auth.user,
          metadata: {
            accommodationRequirement: oldState.auth.user.accommodationRequirement,
            religion: oldState.auth.user.isProfileUpdateSkipped,
            contentSelection: oldState.auth.user.encyclopediaVersion === 'Yes' ? 2 : 1,
            isProfileUpdateSkipped: oldState.auth.user.isProfileUpdateSkipped,
            city: oldState.auth.user.city,
          },
        },
      },
    }
  },
}
