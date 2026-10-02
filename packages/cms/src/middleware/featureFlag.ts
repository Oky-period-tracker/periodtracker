import { Request, Response, NextFunction } from 'express'
import { env } from '../env'

export type FeatureName = keyof typeof env.features

/**
 * Middleware that answers 404 while a feature is disabled, so its endpoints
 * behave as if they did not exist. See FEATURE_FLAGS.md.
 */
export const requireFeature = (feature: FeatureName) => {
  return (_req: Request, res: Response, next: NextFunction) => {
    if (!env.features[feature]) {
      res.status(404).json({ error: 'Not found' })
      return
    }
    next()
  }
}
