import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { Category } from '../entity/Category'
import { Subcategory } from '../entity/Subcategory'
import { Article } from '../entity/Article'
import { v4 as uuid } from 'uuid'
import { bulkUpdateRowReorder } from '../helpers/common'
import { logger } from '../logger'

export class CategoryController {
  private categoryRepository = getRepository(Category)
  private subcategoryRepository = getRepository(Subcategory)
  private articleRepository = getRepository(Article)

  async all(request: Request, response: Response, next: NextFunction) {
    return this.categoryRepository.find({ where: { lang: request.user.lang } })
  }

  // Only a title or emoji in the editor's language is a duplicate
  private duplicateInLanguage(request: Request) {
    const lang = request.user.lang
    return this.categoryRepository.findOne({
      where: [
        { title: request.body.title, lang },
        { primary_emoji: request.body.primary_emoji, lang },
      ],
    })
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const category = await this.categoryRepository.findOne({
      id: request.params.id,
      lang: request.user.lang,
    })
    if (!category) response.status(404).send({ error: 'Category not found' })
    return category
  }

  async save(request: Request, response: Response, next: NextFunction) {
    try {
      const duplicate = await this.duplicateInLanguage(request)
      if (duplicate) return { duplicate: true, category: duplicate, body: request.body }
      await this.categoryRepository.save({
        id: uuid(),
        title: request.body.title,
        primary_emoji: request.body.primary_emoji,
        primary_emoji_name: request.body.primary_emoji_name,
        lang: request.user.lang,
      })
      logger.info('Category created', { title: request.body.title })
      return request.body
    } catch (error) {
      logger.error('CategoryController.save failed', {
        message: error?.message,
        stack: error?.stack,
      })
      throw error
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      // Scoped to the editor's language, which the category keeps: an edit never moves it
      const categoryToUpdate = await this.categoryRepository.findOne({
        id: request.params.id,
        lang: request.user.lang,
      })
      if (!categoryToUpdate) {
        logger.warn('Category not found for update', {
          id: request.params.id,
          lang: request.user.lang,
        })
        response.status(404).send({ error: 'Category not found' })
        return
      }
      const duplicate = await this.duplicateInLanguage(request)
      if (duplicate && duplicate.id !== categoryToUpdate.id)
        return { duplicate: true, category: duplicate, body: request.body }
      categoryToUpdate.title = request.body.title
      categoryToUpdate.primary_emoji = request.body.primary_emoji
      categoryToUpdate.primary_emoji_name = request.body.primary_emoji_name
      await this.categoryRepository.save(categoryToUpdate)
      logger.info('Category updated', { id: request.params.id, title: request.body.title })
      return categoryToUpdate
    } catch (error) {
      logger.error('CategoryController.update failed', {
        id: request.params.id,
        message: error?.message,
        stack: error?.stack,
      })
      throw error
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const categoryToRemove = await this.categoryRepository.findOne({
        id: request.params.id,
        lang: request.user.lang,
      })
      if (!categoryToRemove) {
        logger.warn('Category not found for removal', {
          id: request.params.id,
          lang: request.user.lang,
        })
        response.status(404).send({ error: 'Category not found' })
        return
      }
      const subcategoriesToRemove = await this.subcategoryRepository.find({
        where: {
          parent_category: categoryToRemove.id,
        },
      })
      const articlesToRemove = await this.articleRepository.find({
        where: {
          category: categoryToRemove.id,
        },
      })
      await this.categoryRepository.remove(categoryToRemove)
      await this.subcategoryRepository.remove(subcategoriesToRemove)
      await this.articleRepository.remove(articlesToRemove)
      logger.info('Category removed with cascade', {
        id: request.params.id,
        subcategoriesRemoved: subcategoriesToRemove.length,
        articlesRemoved: articlesToRemove.length,
      })
      return categoryToRemove
    } catch (error) {
      logger.error('CategoryController.remove failed', {
        id: request.params.id,
        message: error?.message,
        stack: error?.stack,
      })
      throw error
    }
  }

  async reorderRows(request: Request, response: Response, next: NextFunction) {
    try {
      if (request.body.rowReorderResult && request.body.rowReorderResult.length) {
        return await bulkUpdateRowReorder(
          this.categoryRepository,
          request.body.rowReorderResult,
          request.user.lang,
        )
      }

      return await this.categoryRepository.find({
        where: {
          lang: request.user.lang,
        },
        order: {
          sortingKey: 'ASC',
        },
      })
    } catch (error) {
      logger.error('CategoryController.reorderRows failed', {
        message: error?.message,
        stack: error?.stack,
      })
      throw error
    }
  }
}
