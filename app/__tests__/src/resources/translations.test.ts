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
    })
  })
})
