import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { DidYouKnow } from '../entity/DidYouKnow'
import { v4 as uuid } from 'uuid'
import { ProvinceFilterService } from '../helpers/ProvinceFilterService'
import { OkyUser } from '../entity/OkyUser'

export class DidYouKnowController {
  private didYouKnowRepository = getRepository(DidYouKnow)

  async all(request: Request, response: Response, next: NextFunction) {
    return this.didYouKnowRepository.find({ where: { lang: request.user.lang } })
  }
  async mobileDidYouKnowByLanguage(request: Request, response: Response, next: NextFunction) {
    // Get user province from query parameter or from user ID lookup
    let userProvince: string | null = null
    
    if (request.query.userId) {
      const okyUserRepository = getRepository(OkyUser)
      const user = await okyUserRepository.findOne(request.query.userId as string)
      userProvince = user?.province || null
    }

    // Build query with province filter
    const queryBuilder = this.didYouKnowRepository
      .createQueryBuilder('did_you_know')
      .where('did_you_know.lang = :lang', { lang: request.params.lang })
      .andWhere('did_you_know.live = :live', { live: true })
      .orderBy('did_you_know.title', 'ASC')

    // Apply province filter
    ProvinceFilterService.applyProvinceFilter(queryBuilder, userProvince, 'did_you_know')

    return queryBuilder.getMany()
  }
  async one(request: Request, response: Response, next: NextFunction) {
    return this.didYouKnowRepository.findOne(request.params.id)
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const didYouKnowToSave = request.body
    didYouKnowToSave.id = uuid()
    didYouKnowToSave.lang = request.user.lang
    
    // Handle province restrictions
    didYouKnowToSave.provinceRestricted = request.body.provinceRestricted === 'true' || request.body.provinceRestricted === true
    if (didYouKnowToSave.provinceRestricted && request.body.allowedProvinces) {
      didYouKnowToSave.allowedProvinces = Array.isArray(request.body.allowedProvinces)
        ? request.body.allowedProvinces.join(',')
        : request.body.allowedProvinces
    } else {
      didYouKnowToSave.allowedProvinces = null
    }
    
    await this.didYouKnowRepository.save(didYouKnowToSave)
    return didYouKnowToSave
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      if (!request.params.id) {
        return response.status(400).json({
          error: true,
          message: 'Did You Know ID is required'
        })
      }

    const didYouKnowToUpdate = await this.didYouKnowRepository.findOne(request.params.id)
      if (!didYouKnowToUpdate) {
        return response.status(404).json({
          error: true,
          message: 'Did You Know not found'
        })
      }

      const booleanFromStringLive = request.body.live === 'true' || request.body.live === true
      const booleanFromStringAge = request.body.isAgeRestricted === 'true' || request.body.isAgeRestricted === true

      didYouKnowToUpdate.title = request.body.title || didYouKnowToUpdate.title
      didYouKnowToUpdate.content = request.body.content || didYouKnowToUpdate.content
    didYouKnowToUpdate.lang = request.user.lang
    didYouKnowToUpdate.isAgeRestricted = booleanFromStringAge
    didYouKnowToUpdate.live = booleanFromStringLive
    
    // Handle province restrictions
    didYouKnowToUpdate.provinceRestricted = request.body.provinceRestricted === 'true' || request.body.provinceRestricted === true
    if (didYouKnowToUpdate.provinceRestricted && request.body.allowedProvinces) {
      didYouKnowToUpdate.allowedProvinces = Array.isArray(request.body.allowedProvinces)
        ? request.body.allowedProvinces.join(',')
        : request.body.allowedProvinces
    } else {
      didYouKnowToUpdate.allowedProvinces = null
    }
    
    await this.didYouKnowRepository.save(didYouKnowToUpdate)
    return didYouKnowToUpdate
    } catch (error) {
      console.error('[DidYouKnowController] Update failed:', error)
      return response.status(500).json({
        error: true,
        message: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const didYouKnowToRemove = await this.didYouKnowRepository.findOne(request.params.id)
    await this.didYouKnowRepository.remove(didYouKnowToRemove)
    return didYouKnowToRemove
  }
}
