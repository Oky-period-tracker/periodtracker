import * as analyticsActions from './analyticsActions'
import * as answerActions from './answerActions'
import * as appActions from './appActions'
import * as authActions from './authActions'
import * as contentActions from './contentActions'
import * as predictionActions from './predictionActions'

export const commonActions = {
  ...analyticsActions,
  ...answerActions,
  ...appActions,
  ...authActions,
  ...contentActions,
  ...predictionActions,
}
