import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { Category } from '../entity/Category'
import { Subcategory } from '../entity/Subcategory'
import { Article } from '../entity/Article'
import { v4 as uuid } from 'uuid'
import { env } from '../env'
import { bulkUpdateRowReorder } from '../helpers/common'

export class CategoryController {
  private categoryRepository = getRepository(Category)
  private subcategoryRepository = getRepository(Subcategory)
  private articleRepository = getRepository(Article)

  async all(request: Request, response: Response, next: NextFunction) {
    return this.categoryRepository.find()
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.categoryRepository.findOne(request.params.id)
  }

  async save(request: Request, response: Response, next: NextFunction) {
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
    return request.body
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const category = await this.categoryRepository.query(
      `SELECT * FROM ${env.db.schema}.category WHERE title = $1 or primary_emoji = $2`,
      [request.body.title, request.body.primary_emoji],
    )
    if (category && category.length && category[0].id !== request.params.id)
      return { duplicate: true, category: category[0], body: request.body }
    const categoryToUpdate = await this.categoryRepository.findOne(request.params.id)
    categoryToUpdate.title = request.body.title
    categoryToUpdate.primary_emoji = request.body.primary_emoji
    categoryToUpdate.primary_emoji_name = request.body.primary_emoji_name
    categoryToUpdate.lang = request.user.lang
    await this.categoryRepository.save(categoryToUpdate)
    return categoryToUpdate
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const categoryToRemove = await this.categoryRepository.findOne(request.params.id)
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
    return categoryToRemove
  }

  async reorderRows(request: Request, response: Response, next: NextFunction) {
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
  }
}
