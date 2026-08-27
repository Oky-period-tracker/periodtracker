import { appTranslations } from '../../../src/resources/translations'

describe('account feedback translations', () => {
  it('bundles required account strings in every locale', () => {
    Object.values(appTranslations).forEach((translations) => {
      expect(translations.password_manager_warning_title).toBeTruthy()
      expect(translations.password_manager_warning).toBeTruthy()
      expect(translations.logging_in).toBeTruthy()
      expect(translations.incorrect_username_or_passcode).toBeTruthy()
      expect(translations.manage_users).toBeTruthy()
      expect(translations.no_users).toBeTruthy()
      expect(translations.sync_account_in_progress).toBeTruthy()
      expect(translations.account_saved_confirmation).toBeTruthy()
      expect(translations.logout_account_title).toBeTruthy()
      expect(translations.cloud_icon_explainer_title).toBeTruthy()
      expect(translations.cloud_icon_explainer_synced).toBeTruthy()
      expect(translations.cloud_icon_explainer_offline).toBeTruthy()
    })
  })
})
