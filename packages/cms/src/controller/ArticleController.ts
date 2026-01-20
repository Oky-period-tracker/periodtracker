import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { Article } from '../entity/Article'
import { v4 as uuid } from 'uuid'
import { env } from '../env'
import { bulkUpdateRowReorder } from '../helpers/common'
import { ProvinceFilterService } from '../helpers/ProvinceFilterService'
import { OkyUser } from '../entity/OkyUser'

export class ArticleController {
  private articleRepository = getRepository(Article)
  private provinceColumnsExist: boolean | null = null

  async all(request: Request, response: Response, next: NextFunction) {
    return this.articleRepository.find({
      where: {
        lang: request.user.lang,
      },
      order: {
        sortingKey: 'ASC',
      },
    })
  }
  async mobileArticlesByLanguage(request: Request, response: Response, next: NextFunction) {
    // Get user province from query parameter or from user ID lookup
    let userProvince: string | null = null
    
    if (request.query.userId) {
      try {
      const okyUserRepository = getRepository(OkyUser)
      const user = await okyUserRepository.findOne(request.query.userId as string)
      userProvince = user?.province || null
      } catch (userLookupError) {
        // User lookup failed - continue without province filtering
        console.log('[ArticleController] User lookup failed, proceeding without province filter:', userLookupError.message)
        userProvince = null
      }
    }

    // Build province filter conditions for raw SQL
    // Check if provinceRestricted column exists (cached after first check)
    let provinceFilter = ''
    const queryParams: any[] = [request.params.lang]
    
    // Cache column existence check to avoid repeated database queries
    if (this.provinceColumnsExist === null) {
      try {
        // Test if province columns exist
        await this.articleRepository.query(`SELECT "provinceRestricted" FROM ${env.db.schema}.article LIMIT 1`)
        this.provinceColumnsExist = true
        console.log('[ArticleController] Province columns detected and cached')
      } catch (error) {
        this.provinceColumnsExist = false
        console.log('[ArticleController] Province columns not found, caching this result')
      }
    }
    
    // Apply province filter if columns exist
    if (this.provinceColumnsExist) {
    if (!userProvince) {
      // User has no province - show only global content
        provinceFilter = 'AND (ar."provinceRestricted" IS NULL OR ar."provinceRestricted" = false)'
    } else {
      // User has province - show global OR province-specific content
      queryParams.push(userProvince)
      queryParams.push(`%,${userProvince},%`)
      queryParams.push(`${userProvince},%`)
      queryParams.push(`%,${userProvince}`)
      provinceFilter = `AND (
          ar."provinceRestricted" IS NULL OR
        ar."provinceRestricted" = false 
        OR (
          ar."provinceRestricted" = true 
          AND (
            ar."allowedProvinces" = $2
            OR ar."allowedProvinces" LIKE $3
            OR ar."allowedProvinces" LIKE $4
            OR ar."allowedProvinces" LIKE $5
          )
        )
      )`
      }
    }

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
      ${provinceFilter}
      ORDER BY ca."sortingKey" ASC, sc."sortingKey" ASC, ar."sortingKey" ASC
      `,
      queryParams,
    )
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.articleRepository.findOne(request.params.id)
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const article = await this.articleRepository.findOne({
      article_heading: request.body.article_heading,
    })
    if (article) {
      return { article, isExist: true }
    }
    const articleToSave = request.body
    articleToSave.lang = request.user.lang
    articleToSave.id = uuid()
    
    // Handle province restrictions with better validation
    const provinceRestricted = request.body.provinceRestricted === 'true' || 
                               request.body.provinceRestricted === true
    articleToSave.provinceRestricted = provinceRestricted
    
    // Check if allowedProvinces exists and is not null/undefined/empty string/"null"
    const hasProvinces = request.body.allowedProvinces && 
                         request.body.allowedProvinces !== 'null' && 
                         request.body.allowedProvinces !== ''
    
    if (provinceRestricted && hasProvinces) {
      const provinces = Array.isArray(request.body.allowedProvinces)
        ? request.body.allowedProvinces
        : String(request.body.allowedProvinces).split(',')
      
      // Filter out empty values
      const filteredProvinces = provinces.filter(p => p && String(p).trim() && String(p).trim() !== 'null')
      
      articleToSave.allowedProvinces = filteredProvinces.length > 0 
        ? filteredProvinces.join(',')
        : null
    } else {
      articleToSave.allowedProvinces = null
    }
    
    await this.articleRepository.save(articleToSave)
    return articleToSave
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      // Validation: Check if article exists
      if (!request.params.id) {
        return response.status(400).json({
          error: true,
          message: 'Article ID is required'
        })
      }

      const articleToUpdate = await this.articleRepository.findOne(request.params.id)
      if (!articleToUpdate) {
        return response.status(404).json({
          error: true,
          message: 'Article not found'
        })
      }

      // Check for duplicate article_heading
      if (request.body.article_heading) {
    const article = await this.articleRepository.findOne({
      article_heading: request.body.article_heading,
    })
    if (article && request.params.id !== article.id) {
      return { article, isExist: true }
    }
      }

      // Update fields
      const booleanFromString = request.body.live === 'true' || request.body.live === true
      articleToUpdate.category = request.body.category || articleToUpdate.category
      articleToUpdate.subcategory = request.body.subcategory || articleToUpdate.subcategory
      articleToUpdate.article_heading = request.body.article_heading || articleToUpdate.article_heading
      articleToUpdate.article_text = request.body.article_text || articleToUpdate.article_text
      articleToUpdate.contentFilter = request.body.contentFilter || articleToUpdate.contentFilter || '0'
      articleToUpdate.ageRestrictionLevel = request.body.ageRestrictionLevel 
        ? Number(request.body.ageRestrictionLevel) 
        : articleToUpdate.ageRestrictionLevel || 0
    // TODO:PH isAgeRestricted is redundant?
      articleToUpdate.isAgeRestricted = articleToUpdate.ageRestrictionLevel === 0 ? false : true
    articleToUpdate.live = booleanFromString
    articleToUpdate.lang = request.user.lang
    
      // Handle province restrictions with better validation
      const provinceRestricted = request.body.provinceRestricted === 'true' || 
                                 request.body.provinceRestricted === true
      articleToUpdate.provinceRestricted = provinceRestricted
      
      // Check if allowedProvinces exists and is not null/undefined/empty string/"null"
      const hasProvinces = request.body.allowedProvinces && 
                           request.body.allowedProvinces !== 'null' && 
                           request.body.allowedProvinces !== ''
      
      if (provinceRestricted && hasProvinces) {
        const provinces = Array.isArray(request.body.allowedProvinces)
          ? request.body.allowedProvinces
          : String(request.body.allowedProvinces).split(',')
        
        // Filter out empty values
        const filteredProvinces = provinces.filter(p => p && String(p).trim() && String(p).trim() !== 'null')
        
        articleToUpdate.allowedProvinces = filteredProvinces.length > 0 
          ? filteredProvinces.join(',')
          : null
    } else {
      articleToUpdate.allowedProvinces = null
    }
    
    await this.articleRepository.save(articleToUpdate)
    return articleToUpdate
    } catch (error) {
      console.error('[ArticleController] Update failed:', error)
      return response.status(500).json({
        error: true,
        message: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const articleToRemove = await this.articleRepository.findOne(request.params.id)
    await this.articleRepository.remove(articleToRemove)
    return articleToRemove
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
