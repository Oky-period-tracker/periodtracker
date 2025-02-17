import { isEmpty } from 'lodash'
import { User } from '../redux/reducers/authReducer'
import moment from 'moment'
import { Article } from '../core/types'

const handleAgeRestriction = (article: Article, user: User | null) => {
  const defaultAgeRestriction = 15
  const isAgeRestricted = article.isAgeRestricted || article?.ageRestrictionLevel !== 0
  const ageRestrictionLevel = article?.ageRestrictionLevel ?? defaultAgeRestriction

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

const handleVersionRestriction = (article: Article, user: User | null) => {
  const { contentFilter = 0 } = article

  if (contentFilter === 0) {
    // Available to all
    return true
  }

  if (isEmpty(user) || !user?.metadata?.contentSelection) {
    // Cannot verify - Restricted
    return false
  }

  return user?.metadata?.contentSelection === article.contentFilter
}

export const canAccessContent = (article: Article, user: User | null) => {
  if (!article) {
    return false
  }
  const passesAgeRestriction = handleAgeRestriction(article, user)
  const passesVersionRestriction = handleVersionRestriction(article, user)
  return passesAgeRestriction && passesVersionRestriction
}

// // Common column is 'ageRestrictionLevel' i.e Article, HelpCenter
// type Repo = { ageRestrictionLevel: number }

// export const filterContent = (user: User, repository: Repo[]) => {
//   // @ts-expect-error TODO: Incorrect type because this can be reused for Articles, help centers and more
//   return repository.filter((item) => canAccessContent(item, user))
// }
