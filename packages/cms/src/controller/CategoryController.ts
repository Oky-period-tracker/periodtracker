import { getManager, getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { Category } from '../entity/Category'
import { Subcategory } from '../entity/Subcategory'
import { Article } from '../entity/Article'
import { v4 as uuid } from 'uuid'
import { env } from '../env'
import { bulkUpdateRowReorder } from '../helpers/common'
import { logger } from '../logger'

export class CategoryController {
  private categoryRepository = getRepository(Category)

  async all(request: Request, response: Response, next: NextFunction) {
    return this.categoryRepository.find()
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.categoryRepository.findOne(request.params.id)
  }

  async save(request: Request, response: Response, next: NextFunction) {
    try {
      const category = await this.categoryRepository.query(
        `SELECT * FROM ${env.db.schema}.category WHERE title = $1 or primary_emoji = $2`,
        [request.body.title, request.body.primary_emoji],
      )
      if (category && category.length)
        return { duplicate: true, category: category[0], body: request.body }
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
      const category = await this.categoryRepository.query(
        `SELECT * FROM ${env.db.schema}.category WHERE title = $1 or primary_emoji = $2`,
        [request.body.title, request.body.primary_emoji],
      )
      if (category && category.length && category[0].id !== request.params.id)
        return { duplicate: true, category: category[0], body: request.body }
      const categoryToUpdate = await this.categoryRepository.findOne(request.params.id)
      if (!categoryToUpdate) {
        logger.warn('Category not found for update', { id: request.params.id })
        response.status(404).send({ error: 'Category not found' })
        return
      }
      categoryToUpdate.title = request.body.title
      categoryToUpdate.primary_emoji = request.body.primary_emoji
      categoryToUpdate.primary_emoji_name = request.body.primary_emoji_name
      categoryToUpdate.lang = request.user.lang
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
        const category = await categories.findOne(request.params.id, {
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
        logger.warn('Category not found for removal', { id: request.params.id })
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
        return await bulkUpdateRowReorder(this.categoryRepository, request.body.rowReorderResult)
      }

      return await this.categoryRepository.find({
        where: {
          lang: request.params.lang,
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
