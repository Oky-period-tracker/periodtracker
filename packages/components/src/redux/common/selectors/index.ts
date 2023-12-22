import * as analyticsSelectors from './analyticsSelectors'
import * as answerSelectors from './answerSelectors'
import * as appSelectors from './appSelectors'
import * as authSelectors from './authSelectors'
import * as contentSelectors from './contentSelectors'

export const commonSelectors = {
  ...analyticsSelectors,
  ...answerSelectors,
  ...appSelectors,
  ...authSelectors,
  ...contentSelectors,
}
