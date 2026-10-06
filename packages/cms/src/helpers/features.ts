import { env } from '../env'

/**
 * Remove the data of disabled features from content sent to the mobile app,
 * so values saved while a feature was enabled have no effect once it is
 * turned off. See FEATURE_FLAGS.md.
 */
export function withoutDisabledFeatures<T>(items: T[], options: { articles?: boolean } = {}): T[] {
  const { voiceOver, contentFilter, ageRestrictionLevels } = env.features
  if (!Array.isArray(items) || (voiceOver && contentFilter && ageRestrictionLevels)) {
    return items
  }
  return items.map((item: any) => {
    const result = { ...item }
    if (!voiceOver && 'voiceOverKey' in result) {
      result.voiceOverKey = null
    }
    if (!contentFilter && 'contentFilter' in result) {
      result.contentFilter = 0
    }
    if (!ageRestrictionLevels) {
      if ('ageRestrictionLevel' in result) {
        result.ageRestrictionLevel = 0
      }
      // Without levels, articles are not age restricted at all. Quizzes,
      // surveys and did you knows keep their age restricted toggle.
      if (options.articles && 'isAgeRestricted' in result) {
        result.isAgeRestricted = false
      }
    }
    return result
  })
}
