import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { Suggestion } from '../entity/Suggestion'
import { v4 as uuid } from 'uuid'
import { logger } from '../logger'

// Longest value stored per field. The message is the only free text, the app
// sends `reason` as a { label, value } option and `dateRec` as an ISO date.
export const SUGGESTION_FIELD_LIMITS = {
  name: 255,
  dateRec: 255,
  organization: 255,
  platform: 255,
  reason: 255,
  email: 255,
  status: 255,
  content: 5000,
  lang: 255,
}

const fieldLength = (value: unknown) =>
  value === undefined || value === null
    ? 0
    : typeof value === 'string'
    ? value.length
    : JSON.stringify(value).length

export class SuggestionController {
  private suggestionRepository = getRepository(Suggestion)

  async all(request: Request, response: Response, next: NextFunction) {
    return this.suggestionRepository.find({
      where: { lang: request.user.lang },
      order: {
        id: 'ASC',
      },
    })
  }

  async save(request: Request, response: Response, next: NextFunction) {
    try {
      const body = request.body
      // An array would be saved as many suggestions in one request
      if (!body || typeof body !== 'object' || Array.isArray(body)) {
        response.status(400).send({ error: 'Invalid suggestion' })
        return
      }
      const suggestionToSave: Partial<Suggestion> = { id: uuid() }
      for (const [field, maxLength] of Object.entries(SUGGESTION_FIELD_LIMITS)) {
        if (fieldLength(body[field]) > maxLength) {
          logger.warn('Suggestion rejected: field too long', { field })
          response.status(400).send({ error: `${field} is longer than ${maxLength} characters` })
          return
        }
        suggestionToSave[field] = body[field]
      }
      await this.suggestionRepository.save(suggestionToSave)
      logger.info('Suggestion saved', { id: suggestionToSave.id })
      return suggestionToSave
    } catch (error) {
      logger.error('SuggestionController.save failed', {
        message: error?.message,
        stack: error?.stack,
      })
      throw error
    }
  }

  async updateStatus(request: Request, response: Response, next: NextFunction) {
    try {
      const suggestionToUpdate = await this.suggestionRepository.findOne(request.body.id)
      if (!suggestionToUpdate) {
        logger.warn('Suggestion not found for status update', { id: request.body.id })
        response.status(404).send({ error: 'Suggestion not found' })
        return
      }
      suggestionToUpdate.status = request.body.status === '1' ? 'open' : 'close'
      await this.suggestionRepository.save(suggestionToUpdate)
      logger.info('Suggestion status updated', {
        id: request.body.id,
        status: suggestionToUpdate.status,
      })
      return suggestionToUpdate
    } catch (error) {
      logger.error('SuggestionController.updateStatus failed', {
        id: request.body.id,
        message: error?.message,
        stack: error?.stack,
      })
      throw error
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const surveyToRemove = await this.suggestionRepository.findOne(request.params.id)
      if (!surveyToRemove) {
        logger.warn('Suggestion not found for removal', { id: request.params.id })
        response.status(404).send({ error: 'Suggestion not found' })
        return
      }
      await this.suggestionRepository.remove(surveyToRemove)
      logger.info('Suggestion removed', { id: request.params.id })
      return surveyToRemove
    } catch (error) {
      logger.error('SuggestionController.remove failed', {
        id: request.params.id,
        message: error?.message,
        stack: error?.stack,
      })
      throw error
    }
  }
}
