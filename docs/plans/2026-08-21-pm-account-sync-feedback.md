# PM Account and Sync Feedback Implementation Plan

**Goal:** Correct device-user UI, account deletion, and multi-account cycle synchronization in the shared React Native frontend.

**Architecture:** Keep per-user encrypted Redux stores. Add durable device-level queues for server work that must survive logout, account switching, and offline periods. A connectivity watcher processes pending account registrations, store uploads, and deletions for every registered user. Fresh-device online login continues to hydrate the user store from the server snapshot.

**Stack:** Expo/React Native, TypeScript, Redux/Redux Saga, redux-persist, AsyncStorage, Keychain, Jest/React Native Testing Library.

## 1. UI and copy

- Add failing tests for cloud color, login progress, neutral credential errors, empty-state copy, and user-row username prefill.
- Use design-system light blue for all cloud status icons.
- Add translated `logging_in`, `incorrect_username_or_passcode`, users-page title, and empty-state copy.
- Extend auth-screen state with a username prefill; selecting a device user opens login with that username.
- Keep Manage Users read-only.
- Verify password-manager warning keys resolve in every bundled locale.

## 2. Durable account deletion

- Add failing service tests for local-only deletion, online deletion, queued offline deletion, retry, and login blocking.
- Remove logged-out deletion entry; deletion remains in logged-in Settings.
- For a local-only account, erase locally immediately.
- For a synced account online, require server deletion before final cleanup.
- For a synced account offline/transient failure, hide/remove local account data but retain minimum encrypted deletion credentials in a tombstone.
- Process tombstones on startup and network reconnection; clear secrets only after success or server-not-found.
- Resolve a tombstone before allowing that username to log in again.

## 3. All-account cycle synchronization

- Add failing tests with multiple device accounts and distinct `prediction`/`verifiedDates` snapshots.
- Persist a versioned dirty snapshot whenever an active store changes and before switch/logout.
- Iterate all registry accounts when the app starts or connectivity returns; do not require each user to become active.
- Register pending offline accounts, save returned server identity/token, then immediately upload their snapshot.
- Upload dirty snapshots for synced inactive accounts sequentially with retry-safe queue semantics.
- Keep cycle payload limited to server-supported `app`, `prediction`, `verifiedDates`, and `helpCenters` data.

## 4. Cycle restore

- Add a fresh-device online-login test proving server cycle data is dispatched under the returned user ID.
- Preserve local dirty data for known device accounts; server hydrate applies to a fresh local account only.
- Verify offline-to-online local/server ID mapping.

## 5. Verification and delivery

- Run focused Jest tests during implementation.
- Run full Jest suite, TypeScript check, and lint on changed files.
- Confirm DEV Expo/EAS environment resolves to `https://api-dev.okyapp.info` and `https://cms-dev.okyapp.info`.
- Generate/install DEV APK if build credentials and Android tooling remain available; launch-smoke test with `adb`.
- Review diff for unrelated changes, commit on `fix/pm-account-sync-feedback`, and report exact test/build results.
