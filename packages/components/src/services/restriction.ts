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
  const { contentFilter = 0 } = article

  if (contentFilter === 0) {
    // Available to all
    return true
  }

  if (isEmpty(user) || !user.contentSelection) {
    // Cannot verify - Restricted
    return false
  }

  return user.contentSelection === article.contentFilter
}

export const canAccessArticle = (article: Article, user?: User) => {
  if (!article) {
    return false
  }
  const passesAgeRestriction = handleAgeRestriction(article, user)
  const passesVersionRestriction = handleVersionRestriction(article, user)
  return passesAgeRestriction && passesVersionRestriction
}
