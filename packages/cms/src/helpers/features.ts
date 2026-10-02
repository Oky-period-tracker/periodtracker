import { env } from '../env'

/**
 * Remove the data of disabled features from content sent to the mobile app,
 * so values saved while a feature was enabled have no effect once it is
 * turned off. See FEATURE_FLAGS.md.
 */
export function withoutDisabledFeatures<T>(items: T[]): T[] {
  if (!Array.isArray(items) || (env.features.voiceOver && env.features.contentFilter)) {
    return items
  }
  return items.map((item: any) => {
    const result = { ...item }
    if (!env.features.voiceOver && 'voiceOverKey' in result) {
      result.voiceOverKey = null
    }
    if (!env.features.contentFilter && 'contentFilter' in result) {
      result.contentFilter = 0
    }
    return result
  })
}
