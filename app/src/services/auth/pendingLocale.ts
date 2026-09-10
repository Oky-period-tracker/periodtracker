// A language the user explicitly picked on the logged-out auth screen (the anon store). Language
// is stored per account, so without this an account's own saved language would always win on
// login and the deliberate pick on the login screen would be discarded. This holds that pick (in
// memory, for the session) so the next login/switch can apply it to the account being opened.
let pending: string | null = null

export function setPendingLocale(locale: string): void {
  pending = locale
}

// Returns the pending locale once and clears it (so it applies to a single login/switch only).
export function consumePendingLocale(): string | null {
  const locale = pending
  pending = null
  return locale
}
