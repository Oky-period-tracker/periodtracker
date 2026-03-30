import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { Article } from '../entity/Article'
import { v4 as uuid } from 'uuid'
import { env } from '../env'
import { bulkUpdateRowReorder } from '../helpers/common'
import { logger } from '../logger'

export class ArticleController {
  private articleRepository = getRepository(Article)

  async all(request: Request, response: Response, next: NextFunction) {
    try {
      return await this.articleRepository.find({
        where: {
          lang: request.user.lang,
        },
        order: {
          sortingKey: 'ASC',
        },
      })
    } catch (error) {
      logger.error('ArticleController.all failed', { message: error?.message, stack: error?.stack })
      throw error
    }
  }
  async mobileArticlesByLanguage(request: Request, response: Response, next: NextFunction) {
    return this.articleRepository.query(
      `SELECT ar.id, ca.title as category_title, 
      ca.id as cat_id, sc.title as subcategory_title, 
      sc.id as subcat_id, 
      ar.article_heading, 
      ar.article_text, 
      ca.primary_emoji,
      ca.primary_emoji_name,
      ar."voiceOverKey",
      ar."isAgeRestricted",
      ar."ageRestrictionLevel",
      ar."contentFilter",
      ar.lang 
      FROM ${env.db.schema}.article ar 
      INNER JOIN ${env.db.schema}.category ca 
      ON ar.category = ca.id::varchar
      INNER JOIN ${env.db.schema}.subcategory sc  
      ON ar.subcategory = sc.id::varchar
      WHERE ar.lang = $1
      AND ar.live = true
      ORDER BY ca."sortingKey" ASC, sc."sortingKey" ASC, ar."sortingKey" ASC
      `,
      [request.params.lang],
    )
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.articleRepository.findOne(request.params.id)
  }

  async save(request: Request, response: Response, next: NextFunction) {
    try {
      const article = await this.articleRepository.findOne({
        article_heading: request.body.article_heading,
      })
      if (article) {
        return { article, isExist: true }
      }
      const articleToSave = request.body
      articleToSave.lang = request.user.lang
      articleToSave.id = uuid()
      await this.articleRepository.save(articleToSave)
      logger.info('Article created', { id: articleToSave.id, heading: articleToSave.article_heading })
      return articleToSave
    } catch (error) {
      logger.error('ArticleController.save failed', { message: error?.message, stack: error?.stack })
      throw error
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const article = await this.articleRepository.findOne({
        article_heading: request.body.article_heading,
      })
      if (article && request.params.id !== article.id) {
        return { article, isExist: true }
      }
      const booleanFromString = request.body.live === 'true'
      const articleToUpdate = await this.articleRepository.findOne(request.params.id)
      if (!articleToUpdate) {
        logger.warn('Article not found for update', { id: request.params.id })
        response.status(404).send({ error: 'Article not found' })
        return
      }
      articleToUpdate.category = request.body.category
    articleToUpdate.subcategory = request.body.subcategory
    articleToUpdate.article_heading = request.body.article_heading
    articleToUpdate.article_text = request.body.article_text
    articleToUpdate.contentFilter = request.body.contentFilter
    articleToUpdate.ageRestrictionLevel = Number(request.body.ageRestrictionLevel)
    // TODO:PH isAgeRestricted is redundant?
    articleToUpdate.isAgeRestricted = request.body.ageRestrictionLevel === '0' ? false : true
    articleToUpdate.live = booleanFromString
    articleToUpdate.lang = request.user.lang
    await this.articleRepository.save(articleToUpdate)
    logger.info('Article updated', { id: request.params.id })
    return articleToUpdate
    } catch (error) {
      logger.error('ArticleController.update failed', { id: request.params.id, message: error?.message, stack: error?.stack })
      throw error
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const articleToRemove = await this.articleRepository.findOne(request.params.id)
      if (!articleToRemove) {
        logger.warn('Article not found for removal', { id: request.params.id })
        response.status(404).send({ error: 'Article not found' })
        return
      }
      await this.articleRepository.remove(articleToRemove)
      logger.info('Article removed', { id: request.params.id })
      return articleToRemove
    } catch (error) {
      logger.error('ArticleController.remove failed', { id: request.params.id, message: error?.message, stack: error?.stack })
      throw error
    }
  }

  async reorderRows(request: Request, response: Response, next: NextFunction) {
    if (request.body.rowReorderResult && request.body.rowReorderResult.length) {
      return await bulkUpdateRowReorder(this.articleRepository, request.body.rowReorderResult)
    }

    return await this.articleRepository.find({
      where: {
        lang: request.params.lang,
      },
      order: {
        sortingKey: 'ASC',
      },
    })
  }
}
