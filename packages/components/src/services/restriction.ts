import { isEmpty } from 'lodash'
import { User } from '../redux/reducers/authReducer'
import { Article } from '../types'
import moment from 'moment'

const handleAgeRestriction = (article: Article, user?: User) => {
  const maxAgeRestriction = 18
  const isAgeRestricted = article.isAgeRestricted || article?.ageRestrictionLevel !== 0
  const ageRestrictionLevel = article?.ageRestrictionLevel ?? maxAgeRestriction

  if (!isAgeRestricted) {
    // No restriction
    return true
  }

  if (isEmpty(user)) {
    // Cannot verify age - Restricted
    return false
  }

  const age = moment().diff(moment(user.dateOfBirth), 'years')

  if (isAgeRestricted && age < ageRestrictionLevel) {
    // Too young
    return false
  }

  return true
}

const handleVersionRestriction = (article: Article, user?: User) => {
  // @TODO:PH standardise this ?
  /**
   * Content Filter Levels
   * 0 - Available to all
   * 1 - Show only to Muslims
   * 2 - Show only to non-Muslims
   */
  const { contentFilter = 0 } = article

  if (contentFilter === 0) {
    // No restriction
    return true
  }

  if (isEmpty(user) || !user.encyclopediaVersion) {
    // Cannot verify - Restricted
    return false
  }

  // TODO:PH 'Yes' means is muslim ?
  // TODO:PH refactor this to user.encyclopediaVersion === article.contentFilter / encyclopediaVersion
  if (user.encyclopediaVersion === 'Yes' && article.contentFilter === 1) {
    return true
  }

  if (user.encyclopediaVersion !== 'Yes' && article.contentFilter === 2) {
    return true
  }

  return false
}

export const canAccessArticle = (article: Article, user?: User) => {
  const passesAgeRestriction = handleAgeRestriction(article, user)
  const passesVersionRestriction = handleVersionRestriction(article, user)
  return passesAgeRestriction && passesVersionRestriction
}
