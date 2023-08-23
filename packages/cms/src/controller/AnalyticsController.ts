import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { Analytics } from '../entity/Analytics'

export class AnalyticsController {
  private analyticsRepository = getRepository(Analytics)

  async all(request: Request, response: Response, next: NextFunction) {
    return this.analyticsRepository.find()
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const analyticsEntry = request.body
    analyticsEntry.payload = request.body.payload ? request.body.payload : {}
    analyticsEntry.metadata = request.body.metadata ? request.body.metadata : {}
    await this.analyticsRepository.save(analyticsEntry)
    return analyticsEntry
  }
}
