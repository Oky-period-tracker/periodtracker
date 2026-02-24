import { isEmpty } from 'lodash'
import { User } from '../redux/reducers/authReducer'
import moment from 'moment'
import { Article } from '../core/types'

const handleAgeRestriction = (article: Article, user: User | null) => {
  const isAgeRestricted =
    article.ageRestrictionLevel !== undefined &&
    article.ageRestrictionLevel !== null &&
    article?.ageRestrictionLevel !== 0

  const ageRestrictionLevel = article?.ageRestrictionLevel

  if (!isAgeRestricted) {
    // No restriction
    return true
  }

  if (isEmpty(user)) {
    // Cannot verify age - Restricted
    return false
  }

  const age = moment().diff(moment(user.dateOfBirth), 'years')

  if (age < ageRestrictionLevel) {
    // Too young
    return false
  }

  return true
}

export const canAccessContent = (article: Article, user: User | null) => {
  if (!article) {
    return false
  }

  const passesAgeRestriction = handleAgeRestriction(article, user)

  return passesAgeRestriction
}

// // Common column is 'ageRestrictionLevel' i.e Article, HelpCenter
// type Repo = { ageRestrictionLevel: number }

// export const filterContent = (user: User, repository: Repo[]) => {
//   // @ts-expect-error TODO: Incorrect type because this can be reused for Articles, help centers and more
//   return repository.filter((item) => canAccessContent(item, user))
// }
