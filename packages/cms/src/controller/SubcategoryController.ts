import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { Subcategory } from '../entity/Subcategory'
import { Article } from '../entity/Article'
import { v4 as uuid } from 'uuid'
import { bulkUpdateRowReorder } from '../helpers/common'
import { logger } from '../logger'

export class SubcategoryController {
  private subCategoryRepository = getRepository(Subcategory)
  private articleRepository = getRepository(Article)

  async all(request: Request, response: Response, next: NextFunction) {
    return this.subCategoryRepository.find()
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.subCategoryRepository.findOne(request.params.id)
  }

  async save(request: Request, response: Response, next: NextFunction) {
    try {
      const sub_category = await this.subCategoryRepository.findOne({
        title: request.body.title,
        parent_category: request.body.parent_category,
      })
      if (sub_category) return { duplicate: true }
      await this.subCategoryRepository.save({
        id: uuid(),
        title: request.body.title,
        parent_category: request.body.parent_category,
        lang: request.user.lang,
      })
      logger.info('Subcategory created', { title: request.body.title })
      return request.body
    } catch (error) {
      logger.error('SubcategoryController.save failed', { message: error?.message, stack: error?.stack })
      throw error
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const sub_category = await this.subCategoryRepository.findOne({
        title: request.body.title,
        parent_category: request.body.parent_category,
      })
      if (sub_category && sub_category.id !== request.params.id) return { duplicate: true }
      const subCategoryToUpdate = await this.subCategoryRepository.findOne(request.params.id)
      if (!subCategoryToUpdate) {
        logger.warn('Subcategory not found for update', { id: request.params.id })
        response.status(404).send({ error: 'Subcategory not found' })
        return
      }
      subCategoryToUpdate.title = request.body.title
      subCategoryToUpdate.parent_category = request.body.parent_category
      subCategoryToUpdate.lang = request.user.lang
      await this.subCategoryRepository.save(subCategoryToUpdate)
      logger.info('Subcategory updated', { id: request.params.id, title: request.body.title })
      return subCategoryToUpdate
    } catch (error) {
      logger.error('SubcategoryController.update failed', { id: request.params.id, message: error?.message, stack: error?.stack })
      throw error
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const subCategoryToRemove = await this.subCategoryRepository.findOne(request.params.id)
      if (!subCategoryToRemove) {
        logger.warn('Subcategory not found for removal', { id: request.params.id })
        response.status(404).send({ error: 'Subcategory not found' })
        return
      }
      const articlesToRemove = await this.articleRepository.find({
        where: {
          subcategory: subCategoryToRemove.id,
        },
      })
      await this.subCategoryRepository.remove(subCategoryToRemove)
      await this.articleRepository.remove(articlesToRemove)
      logger.info('Subcategory removed with cascade', { id: request.params.id, articlesRemoved: articlesToRemove.length })
      return subCategoryToRemove
    } catch (error) {
      logger.error('SubcategoryController.remove failed', { id: request.params.id, message: error?.message, stack: error?.stack })
      throw error
    }
  }

  async reorderRows(request: Request, response: Response, next: NextFunction) {
    try {
      if (request.body.rowReorderResult && request.body.rowReorderResult.length) {
        return await bulkUpdateRowReorder(this.subCategoryRepository, request.body.rowReorderResult)
      }

      return await this.subCategoryRepository.find({
        where: {
          lang: request.params.lang,
        },
        order: {
          sortingKey: 'ASC',
        },
      })
    } catch (error) {
      logger.error('SubcategoryController.reorderRows failed', { message: error?.message, stack: error?.stack })
      throw error
    }
  }
}
