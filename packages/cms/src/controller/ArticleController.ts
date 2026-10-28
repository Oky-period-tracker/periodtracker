import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { Article } from '../entity/Article'
import { Category } from '../entity/Category'
import { Subcategory } from '../entity/Subcategory'
import { v4 as uuid } from 'uuid'
import { env } from '../env'
import { bulkUpdateRowReorder } from '../helpers/common'
import { toLevel } from '../helpers/safeUtils'
import { withoutDisabledFeatures } from '../helpers/features'
import { logger } from '../logger'

export class ArticleController {
  private articleRepository = getRepository(Article)
  private categoryRepository = getRepository(Category)
  private subcategoryRepository = getRepository(Subcategory)

  // The parents come from the request, so they must be in the editor's language too
  private async parentsInLanguage(request: Request) {
    const [category, subcategory] = await Promise.all([
      this.categoryRepository.findOne({ id: request.body.category, lang: request.user.lang }),
      this.subcategoryRepository.findOne({ id: request.body.subcategory, lang: request.user.lang }),
    ])
    return !!category && !!subcategory
  }

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
    const articles = await this.articleRepository.query(
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
    return withoutDisabledFeatures(articles, { articles: true })
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const article = await this.articleRepository.findOne({
      id: request.params.id,
      lang: request.user.lang,
    })
    if (!article) response.status(404).send({ error: 'Article not found' })
    return article
  }

  async save(request: Request, response: Response, next: NextFunction) {
    try {
      if (!(await this.parentsInLanguage(request))) {
        response.status(404).send({ error: 'Category or subcategory not found' })
        return
      }
      const article = await this.articleRepository.findOne({
        article_heading: request.body.article_heading,
      })
      if (article) {
        return { article, isExist: true }
      }
      const articleToSave = request.body
      articleToSave.lang = request.user.lang
      articleToSave.id = uuid()
      articleToSave.contentFilter = env.features.contentFilter
        ? toLevel(request.body.contentFilter)
        : 0
      articleToSave.ageRestrictionLevel = env.features.ageRestrictionLevels
        ? toLevel(request.body.ageRestrictionLevel)
        : 0
      articleToSave.isAgeRestricted = articleToSave.ageRestrictionLevel > 0
      await this.articleRepository.save(articleToSave)
      logger.info('Article created', {
        id: articleToSave.id,
        heading: articleToSave.article_heading,
      })
      return articleToSave
    } catch (error) {
      logger.error('ArticleController.save failed', {
        message: error?.message,
        stack: error?.stack,
      })
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
      // Scoped to the editor's language, which the article keeps: an edit never moves it
      const articleToUpdate = await this.articleRepository.findOne({
        id: request.params.id,
        lang: request.user.lang,
      })
      if (!articleToUpdate) {
        logger.warn('Article not found for update', {
          id: request.params.id,
          lang: request.user.lang,
        })
        response.status(404).send({ error: 'Article not found' })
        return
      }
      if (!(await this.parentsInLanguage(request))) {
        response.status(404).send({ error: 'Category or subcategory not found' })
        return
      }
      articleToUpdate.category = request.body.category
      articleToUpdate.subcategory = request.body.subcategory
      articleToUpdate.article_heading = request.body.article_heading
      articleToUpdate.article_text = request.body.article_text
      // Requests that send no levels keep the stored ones instead of resetting them.
      if (env.features.contentFilter && request.body.contentFilter !== undefined) {
        articleToUpdate.contentFilter = toLevel(request.body.contentFilter)
      }
      if (env.features.ageRestrictionLevels && request.body.ageRestrictionLevel !== undefined) {
        articleToUpdate.ageRestrictionLevel = toLevel(request.body.ageRestrictionLevel)
        // TODO:PH isAgeRestricted is redundant?
        articleToUpdate.isAgeRestricted = articleToUpdate.ageRestrictionLevel > 0
      }
      articleToUpdate.live = booleanFromString
      await this.articleRepository.save(articleToUpdate)
      logger.info('Article updated', { id: request.params.id })
      return articleToUpdate
    } catch (error) {
      logger.error('ArticleController.update failed', {
        id: request.params.id,
        message: error?.message,
        stack: error?.stack,
      })
      throw error
    }
  }

  // The Live toggle only changes the publish status: it must not go through update(), which
  // rewrites the whole article from the page snapshot and can refuse it as a duplicate title.
  async updateLive(request: Request, response: Response, next: NextFunction) {
    try {
      const { live } = request.body
      if (![true, false, 'true', 'false'].includes(live)) {
        response.status(400).send({ error: 'live must be true or false' })
        return
      }
      // Scoped to the editor's language: the page only lists those articles, so an
      // article in another language is treated as not found
      const articleToUpdate = await this.articleRepository.findOne({
        id: request.params.id,
        lang: request.user.lang,
      })
      if (!articleToUpdate) {
        logger.warn('Article not found for live update', {
          id: request.params.id,
          lang: request.user.lang,
        })
        response.status(404).send({ error: 'Article not found' })
        return
      }
      articleToUpdate.live = String(live) === 'true'
      await this.articleRepository.save(articleToUpdate)
      logger.info('Article live status updated', {
        id: request.params.id,
        live: articleToUpdate.live,
      })
      return { id: articleToUpdate.id, live: articleToUpdate.live }
    } catch (error) {
      logger.error('ArticleController.updateLive failed', {
        id: request.params.id,
        message: error?.message,
        stack: error?.stack,
      })
      throw error
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const articleToRemove = await this.articleRepository.findOne({
        id: request.params.id,
        lang: request.user.lang,
      })
      if (!articleToRemove) {
        logger.warn('Article not found for removal', {
          id: request.params.id,
          lang: request.user.lang,
        })
        response.status(404).send({ error: 'Article not found' })
        return
      }
      await this.articleRepository.remove(articleToRemove)
      logger.info('Article removed', { id: request.params.id })
      return articleToRemove
    } catch (error) {
      logger.error('ArticleController.remove failed', {
        id: request.params.id,
        message: error?.message,
        stack: error?.stack,
      })
      throw error
    }
  }

  async reorderRows(request: Request, response: Response, next: NextFunction) {
    if (request.body.rowReorderResult && request.body.rowReorderResult.length) {
      return await bulkUpdateRowReorder(
        this.articleRepository,
        request.body.rowReorderResult,
        request.user.lang,
      )
    }

    return await this.articleRepository.find({
      where: {
        lang: request.user.lang,
      },
      order: {
        sortingKey: 'ASC',
      },
    })
  }
}
