import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { Subcategory } from '../entity/Subcategory'
import { Article } from '../entity/Article'
import { v4 as uuid } from 'uuid'

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
    return request.body
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const sub_category = await this.subCategoryRepository.findOne({
      title: request.body.title,
      parent_category: request.body.parent_category,
    })
    if (sub_category && sub_category.id !== request.params.id) return { duplicate: true }
    const subCategoryToUpdate = await this.subCategoryRepository.findOne(request.params.id)
    subCategoryToUpdate.title = request.body.title
    subCategoryToUpdate.parent_category = request.body.parent_category
    subCategoryToUpdate.lang = request.user.lang
    await this.subCategoryRepository.save(subCategoryToUpdate)
    return subCategoryToUpdate
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const subCategoryToRemove = await this.subCategoryRepository.findOne(request.params.id)
    const articlesToRemove = await this.articleRepository.find({
      where: {
        subcategory: subCategoryToRemove.id,
      },
    })
    await this.subCategoryRepository.remove(subCategoryToRemove)
    await this.articleRepository.remove(articlesToRemove)
    return subCategoryToRemove
  }
}
