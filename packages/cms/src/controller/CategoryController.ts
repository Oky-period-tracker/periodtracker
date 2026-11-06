import { getManager, getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { Category } from '../entity/Category'
import { Subcategory } from '../entity/Subcategory'
import { Article } from '../entity/Article'
import { v4 as uuid } from 'uuid'
import { bulkUpdateRowReorder } from '../helpers/common'
import { logger } from '../logger'

export class CategoryController {
  private categoryRepository = getRepository(Category)

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
      // One transaction for the whole hierarchy: if any delete fails, the category,
      // its subcategories and its articles all survive. The row lock makes concurrent
      // edits or deletes of this category wait until the removal commits or rolls back.
      const removed = await getManager().transaction(async (manager) => {
        const categories = manager.getRepository(Category)
        // Scoped to the editor's language: another language's category answers 404
        const category = await categories.findOne({
          where: { id: request.params.id, lang: request.user.lang },
          lock: { mode: 'pessimistic_write' },
        })
        if (!category) return undefined
        const articles = await manager.getRepository(Article).delete({ category: category.id })
        const subcategories = await manager
          .getRepository(Subcategory)
          .delete({ parent_category: category.id })
        await categories.remove(category)
        return {
          category,
          subcategoriesRemoved: subcategories.affected,
          articlesRemoved: articles.affected,
        }
      })
      if (!removed) {
        logger.warn('Category not found for removal', {
          id: request.params.id,
          lang: request.user.lang,
        })
        response.status(404).send({ error: 'Category not found' })
        return
      }
      logger.info('Category removed with cascade', {
        id: request.params.id,
        subcategoriesRemoved: removed.subcategoriesRemoved,
        articlesRemoved: removed.articlesRemoved,
      })
      return removed.category
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
