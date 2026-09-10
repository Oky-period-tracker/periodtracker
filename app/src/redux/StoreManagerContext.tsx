// Boots the store manager (after running the one-time legacy migration) and hands the active
// per-user store/persistor to the app via a render prop, re-rendering whenever the active
// user switches so PersistGate remounts cleanly on the new user's key.
import * as React from 'react'
import { getActiveBundle, initStoreManager, subscribeBundle, StoreBundle } from './storeManager'
import { runLegacyMigration } from '../services/migration/legacyMigration'

export function StoreManagerProvider({
  children,
}: {
  children: (bundle: StoreBundle) => React.ReactNode
}) {
  const [bundle, setBundle] = React.useState<StoreBundle | null>(getActiveBundle())

  React.useEffect(() => {
    let mounted = true
    const unsubscribe = subscribeBundle((next) => {
      if (mounted) {
        setBundle(next)
      }
    })
    void (async () => {
      // Migration MUST complete before the store is built for the active user.
      await runLegacyMigration()
      const built = await initStoreManager()
      if (mounted) {
        setBundle(built)
      }
    })()
    return () => {
      mounted = false
      unsubscribe()
    }
  }, [])

  if (!bundle) {
    return null
  }
  return <>{children(bundle)}</>
}
