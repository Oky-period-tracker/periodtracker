import { NextFunction, Request, Response } from 'express'
import { getRepository } from 'typeorm'
import { Article } from '../entity/Article'
import { Quiz } from '../entity/Quiz'
import { DidYouKnow } from '../entity/DidYouKnow'
import { HelpCenter } from '../entity/HelpCenter'
import { About } from '../entity/About'
import { AvatarMessages } from '../entity/AvatarMessages'
import { TermsAndConditions } from '../entity/TermsAndConditions'
import { PrivacyPolicy } from '../entity/PrivacyPolicy'
import xlsx from 'xlsx'
import { v4 as uuidv4 } from 'uuid'

import {
  fromEncyclopedia,
  fromQuizzes,
  fromDidYouKnows,
  fromHelpCenters,
  fromAvatarMessages,
  // appTranslations,
  // content,
  defaultLocale,
  countries,
  provinces,
  EncyclopediaResponseItem,
  EncyclopediaResponse,
  // cmsTranslations,
} from '@oky/core'
// import { EncyclopediaResponse, EncyclopediaResponseItem } from '@oky/core/src/api/types'
import { env } from '../env'

export class DataController {
  private articleRepository = getRepository(Article)
  private quizRepository = getRepository(Quiz)
  private didYouKnowRepository = getRepository(DidYouKnow)
  private helpCenterRepository = getRepository(HelpCenter)
  private aboutRepository = getRepository(About)
  private termsAndConditionsRepository = getRepository(TermsAndConditions)
  private privacyPolicyRepository = getRepository(PrivacyPolicy)
  private avatarMessagesRepository = getRepository(AvatarMessages)

  async generateContentTs(request: Request, response: Response, next: NextFunction) {
    const live = request.query?.live === 'true'

    // ========== Encyclopedia ========== //
    const encyclopediaRaw = await this.articleRepository.query(
      `SELECT ar.id, ca.title as category_title, 
      ca.id as cat_id, sc.title as subcategory_title, 
      sc.id as subcat_id, 
      ar.article_heading, 
      ar.article_text, 
      ca.primary_emoji,
      ca.primary_emoji_name,
      ar.lang,
      ar.live
      FROM ${env.db.schema}.article ar 
      INNER JOIN ${env.db.schema}.category ca 
      ON ar.category = ca.id::varchar
      INNER JOIN ${env.db.schema}.subcategory sc  
      ON ar.subcategory = sc.id::varchar
      WHERE ar.lang = $1
      ${live ? 'AND ar.live = true' : ''}
      ORDER BY ca.title, sc.title ASC
      `,
      [request.user.lang],
    )

    const { articles, categories, subCategories } = fromEncyclopedia({
      encyclopediaResponse: encyclopediaRaw,
    })

    // ========== Quiz ========== //
    const quizzesRaw = await this.quizRepository.find({
      where: { lang: request.user.lang, live },
      order: {
        topic: 'ASC',
      },
    })

    const { quizzes } = fromQuizzes(quizzesRaw)

    // ========== Did you know ========== //
    const didYouKnowsRaw = await this.didYouKnowRepository.find({
      where: { lang: request.user.lang, live },
    })

    const { didYouKnows } = fromDidYouKnows(didYouKnowsRaw)

    // ========== Help ========== //
    const helpCentersRaw = await this.helpCenterRepository.find({
      where: { lang: request.user.lang },
    })

    const { helpCenters } = fromHelpCenters(helpCentersRaw)

    // ========== Avatars ========== //
    const avatarMessagesRaw = await this.avatarMessagesRepository.find({
      where: { lang: request.user.lang, live },
    })

    const { avatarMessages } = fromAvatarMessages(avatarMessagesRaw)

    // ========== Privacy ========== //
    const allPoliciesVersions = await this.privacyPolicyRepository.find({
      where: { lang: request.user.lang },
    })

    const latestPrivacyPolicy = allPoliciesVersions[allPoliciesVersions.length - 1]
    const privacyPolicy = latestPrivacyPolicy.json_dump

    // ========== Terms ========== //
    const allTermsAndConditionVersions = await this.termsAndConditionsRepository.find({
      where: { lang: request.user.lang },
    })
    const latestTermsAndConditions =
      allTermsAndConditionVersions[allTermsAndConditionVersions.length - 1]
    const termsAndConditions = latestTermsAndConditions.json_dump

    // ========== About ========== //
    const allAboutVersions = await this.aboutRepository.find({
      where: { lang: request.user.lang },
    })
    const latestAbout = allAboutVersions[allAboutVersions.length - 1]
    const about = latestAbout.json_dump

    // ========== File ========== //
    const fileContent = `
      // THIS FILE IS AUTO GENERATED. DO NOT EDIT MANUALLY
      import { StaticContent } from '../../../types'

      export const ${request.user.lang}: StaticContent = {
        locale: '${request.user.lang}',
        categories: ${JSON.stringify(categories)},
        subCategories: ${JSON.stringify(subCategories)},
        articles: ${JSON.stringify(articles)},
        quizzes: ${JSON.stringify(quizzes)},
        didYouKnows: ${JSON.stringify(didYouKnows)},
        helpCenters: ${JSON.stringify(helpCenters)},
        avatarMessages: ${JSON.stringify(avatarMessages)},
        privacyPolicy: ${privacyPolicy},
        termsAndConditions: ${termsAndConditions},
        about: ${about},
        aboutBanner: '',
      }
      `

    const fileName = `content-${request.user.lang}-${getDate()}.ts`

    // Set the headers to inform the browser about file type and suggested filename
    response.setHeader('Content-disposition', 'attachment; filename=' + fileName)
    response.setHeader('Content-type', 'text/plain')
    response.send(fileContent) // Send the file data as a response
  }

  async generateContentSheet(request: Request, response: Response, next: NextFunction) {
    const shouldFilter = request.query?.filter === 'new'

    const encyclopediaRaw = (await this.articleRepository.query(
      `SELECT 
      ar.id, 
      ca.id as cat_id, 
      sc.id as subcat_id, 
      ca.title as category_title, 
      sc.title as subcategory_title, 
      ar.article_heading, 
      ar.article_text, 
      ca.primary_emoji,
      ca.primary_emoji_name,
      ar.live
      FROM ${env.db.schema}.article ar 
      INNER JOIN ${env.db.schema}.category ca 
      ON ar.category = ca.id::varchar
      INNER JOIN ${env.db.schema}.subcategory sc  
      ON ar.subcategory = sc.id::varchar
      WHERE ar.lang = $1
      ORDER BY ca.title, sc.title ASC
      `,
      [request.user.lang],
    )) as EncyclopediaResponse
    // AND ar.live = true

    const encyclopediaRawExtraCols = encyclopediaRaw.map((item) => {
      return {
        id: item.id,
        cat_id: item.cat_id,
        subcat_id: item.subcat_id,
        category_title_original: item.category_title,
        category_title: '',
        subcategory_title_original: item.subcategory_title,
        subcategory_title: '',
        article_heading_original: item.article_heading,
        article_heading: '',
        article_text_original: item.article_text,
        article_text: '',
        primary_emoji: item.primary_emoji,
        primary_emoji_name: item.primary_emoji_name,
        live: item.live,
      }
    })

    const encyclopediaFiltered = encyclopediaRawExtraCols.filter((item) => {
      // if (shouldFilter) {
      //   const existsInTs = content[request.user.lang].articles.allIds.includes(item.id)
      //   return !existsInTs
      // }
      return true
    })

    const encyclopediaByCategory = encyclopediaFiltered.reduce<
      Record<string, Array<Omit<EncyclopediaResponseItem, 'lang'>>>
    >((acc, row) => {
      const title =
        row.category_title_original.length > 31
          ? row.category_title_original.replace('and', '&')
          : row.category_title_original

      if (!acc[title]) {
        acc[title] = [row]
        return acc
      }

      acc[title].push(row)
      return acc
    }, {})

    // ========== Quiz ========== //
    const quizzesRaw = await this.quizRepository.find({
      where: { lang: request.user.lang, live: true },
      order: {
        topic: 'ASC',
      },
    })

    const quizzesRawExtraCols = quizzesRaw.map((item) => {
      return {
        id: item.id,
        topic_original: item.topic,
        topic: '',
        question_original: item.question,
        question: '',
        option1_original: item.option1,
        option1: '',
        option2_original: item.option2,
        option2: '',
        option3_original: item.option3,
        option3: '',
        right_answer_original: item.right_answer,
        right_answer: '',
        wrong_answer_response_original: item.wrong_answer_response,
        wrong_answer_response: '',
        right_answer_response_original: item.right_answer_response,
        right_answer_response: '',
        answer: '',
        isAgeRestricted: item.isAgeRestricted,
        live: item.live,
      }
    })

    const quizzesFiltered = quizzesRawExtraCols.filter((item) => {
      // if (shouldFilter) {
      //   const existsInTs = content[request.user.lang].quizzes.allIds.includes(item.id)
      //   return !existsInTs
      // }
      return true
    })

    // ========== Did you know ========== //
    const didYouKnowsRaw = await this.didYouKnowRepository.find({
      where: { lang: request.user.lang },
    })

    const didYouKnowsRawExtraCols = didYouKnowsRaw.map((item) => {
      return {
        id: item.id,
        title_original: item.title,
        title: '',
        content_original: item.content,
        content: '',
        isAgeRestricted: item.isAgeRestricted,
      }
    })

    const didYouKnowsFiltered = didYouKnowsRawExtraCols.filter((item) => {
      // if (shouldFilter) {
      //   const existsInTs = content[request.user.lang].didYouKnows.allIds.includes(item.id)
      //   return !existsInTs
      // }
      return true
    })

    // ========== Help ========== //
    const helpCentersRaw = await this.helpCenterRepository.find({
      where: { lang: request.user.lang },
    })

    // ========== Avatars ========== //
    const avatarMessagesRaw = await this.avatarMessagesRepository.find({
      where: { lang: request.user.lang },
    })

    const avatarMessagesExtraCols = avatarMessagesRaw.map((item) => {
      return {
        id: item.id,
        content_original: item.content,
        content: '',
      }
    })

    const avatarMessagesFiltered = avatarMessagesExtraCols.filter((item) => {
      // if (shouldFilter) {
      //   const existsInTs = content[request.user.lang].avatarMessages
      //     .map((message) => message.id)
      //     .includes(item.id)
      //   return !existsInTs
      // }
      return true
    })

    // ========== Privacy ========== //
    const allPoliciesVersions = await this.privacyPolicyRepository.find({
      where: { lang: request.user.lang },
    })

    const latestPrivacyPolicy = allPoliciesVersions[allPoliciesVersions.length - 1]
    const privacyPolicy = JSON.parse(latestPrivacyPolicy.json_dump)

    // ========== Terms ========== //
    const allTermsAndConditionVersions = await this.termsAndConditionsRepository.find({
      where: { lang: request.user.lang },
    })
    const latestTermsAndConditions =
      allTermsAndConditionVersions[allTermsAndConditionVersions.length - 1]
    const termsAndConditions = JSON.parse(latestTermsAndConditions.json_dump)

    // ========== About ========== //
    const allAboutVersions = await this.aboutRepository.find({
      where: { lang: request.user.lang },
    })
    const latestAbout = allAboutVersions[allAboutVersions.length - 1]
    const about = JSON.parse(latestAbout.json_dump)

    // ========== Spread sheet ========== //
    const encyclopediaIdColumns = [0, 1, 2]
    const encyclopediaSheets = Object.entries(encyclopediaByCategory).reduce(
      (acc, [key, value]) => {
        const worksheet = xlsx.utils.json_to_sheet(value)
        const maxColumns = value[0] ? Object.keys(value[0]).length : 0
        worksheet['!cols'] = Array(maxColumns)
          .fill({})
          .map((col, index) => {
            if (encyclopediaIdColumns.includes(index)) {
              return { hidden: true }
            }
            return col
          })

        acc[key] = worksheet
        return acc
      },
      {},
    )

    const otherContentWithIds = {
      Quizzes: quizzesFiltered,
      'Did you know': didYouKnowsFiltered,
      Avatars: avatarMessagesFiltered,
    }

    const idColumn = 0
    const otherSheetsWithIds = Object.entries(otherContentWithIds).reduce((acc, [key, value]) => {
      const worksheet = xlsx.utils.json_to_sheet(value)
      const maxColumns = value[0] ? Object.keys(value[0]).length : 0
      worksheet['!cols'] = Array(maxColumns)
        .fill({})
        .map((col, index) => {
          if (idColumn === index) {
            return { hidden: true }
          }
          return col
        })
      acc[key] = worksheet
      return acc
    }, {})

    const otherData = {
      Privacy: privacyPolicy.map((item) => ({
        type: item.type,
        content_original: item.content,
        content: '',
      })),
      Terms: termsAndConditions.map((item) => ({
        type: item.type,
        content_original: item.content,
        content: '',
      })),
      About: about.map((item) => ({
        type: item.type,
        content_original: item.content,
        content: '',
      })),
    }

    const otherSheets = Object.entries(otherData).reduce((acc, [key, value]) => {
      const worksheet = xlsx.utils.json_to_sheet(value)
      acc[key] = worksheet
      return acc
    }, {})

    const allSheets = {
      ...encyclopediaSheets,
      ...otherSheetsWithIds,
      ...otherSheets,
      Help: helpCentersRaw,
    }

    // Create a new workbook
    const workbook = {
      SheetNames: Object.keys(allSheets),
      Sheets: allSheets,
    }

    // Get the buffer
    const buffer = xlsx.write(workbook, { type: 'buffer' })

    const filename = `content-${request.user.lang}-${getDate()}.xlsx`

    // Set the headers to inform the browser about file type and suggested filename
    response.setHeader('Content-disposition', `attachment; filename=${filename}`)
    response.setHeader(
      'Content-type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )
    response.send(buffer) // Send the file data as a response
  }

  async uploadContentSheet(request: Request, response: Response, next: NextFunction) {
    // Ensure a file was uploaded
    if (!request.file || !request.file.buffer) {
      return response.status(400).send('No file was uploaded.')
    }

    const locale = request.body.locale?.length ? request.body.locale : request.user.lang

    // Create a workbook from the xlsx data
    const workbook = xlsx.read(request.file.buffer, { type: 'buffer' })

    const otherSheetNames = [
      'Quizzes',
      'Did you know',
      'Help',
      'Avatars',
      'Privacy',
      'Terms',
      'About',
    ]

    const encyclopediaSheetNames = workbook.SheetNames.filter(
      (name) => !otherSheetNames.includes(name),
    )

    const encyclopediaJson = encyclopediaSheetNames.reduce((acc, name) => {
      const worksheet = workbook.Sheets[name]
      if (!worksheet) {
        return acc
      }
      const sheetJson = xlsx.utils.sheet_to_json(worksheet)
      return [...acc, ...sheetJson]
    }, [])

    const otherJson = otherSheetNames.reduce((acc, name) => {
      const worksheet = workbook.Sheets[name]
      if (!worksheet) {
        return acc
      }
      const sheetJson = xlsx.utils.sheet_to_json(worksheet)
      const json = removeOriginals(sheetJson)
      return { ...acc, [name]: json }
    }, {})

    // Generate new Ids for everything if it is a new locale
    // const isNewLocale = !content[locale] TODO:
    const isNewLocale = true

    const { articles, categories, subCategories } = formatEncyclopediaData(
      encyclopediaJson,
      isNewLocale,
    )

    const quizzesJson = replaceIdsInJson(
      otherJson['Quizzes'],
      otherJson['Quizzes'].map((item) => item.id),
      isNewLocale,
    )

    const { quizzes } = fromQuizzes(quizzesJson)

    const didYouKnowsJson = replaceIdsInJson(
      otherJson['Did you know'],
      otherJson['Did you know'].map((item) => item.id),
      isNewLocale,
    )

    const { didYouKnows } = fromDidYouKnows(didYouKnowsJson)

    const avatarMessagesJson = replaceIdsInJson(
      otherJson['Avatars'],
      otherJson['Avatars'].map((item) => item.id),
      isNewLocale,
    )

    const { avatarMessages } = fromAvatarMessages(avatarMessagesJson)

    // ========== File ========== //
    const fileContent = `
      // THIS FILE IS AUTO GENERATED. DO NOT EDIT MANUALLY
      import { StaticContent } from '../../../types'

      export const ${locale}: StaticContent = {
        locale: '${locale}',
        categories: ${JSON.stringify(categories)},
        subCategories: ${JSON.stringify(subCategories)},
        articles: ${JSON.stringify(articles)},
        quizzes: ${JSON.stringify(quizzes)},
        didYouKnows: ${JSON.stringify(didYouKnows)},
        helpCenters: ${JSON.stringify(otherJson['Help'])},
        avatarMessages: ${JSON.stringify(avatarMessages)},
        privacyPolicy: ${JSON.stringify(otherJson['Privacy'])},
        termsAndConditions: ${JSON.stringify(otherJson['Terms'])},
        about: ${JSON.stringify(otherJson['About'])},
        aboutBanner: '',
      }
      `

    const fileName = `${locale}.ts`

    // Set the headers to inform the browser about file type and suggested filename
    response.setHeader('Content-disposition', 'attachment; filename=' + fileName)
    response.setHeader('Content-type', 'text/plain')
    response.send(fileContent) // Send the file data as a response
  }

  /*   
async generateAppTranslationsSheet(request: Request, response: Response, next: NextFunction) {
    const buffer = generateSingleTabSheet(appTranslations[defaultLocale], 'app')

    const filename = 'app-translations.xlsx'

    // Set the headers to inform the browser about file type and suggested filename
    response.setHeader('Content-disposition', `attachment; filename=${filename}`)
    response.setHeader(
      'Content-type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )
    response.send(buffer) // Send the file data as a response
  } 
    */

  // async generateCmsTranslationsSheet(request: Request, response: Response, next: NextFunction) {
  //   const buffer = generateSingleTabSheet(cmsTranslations[defaultLocale], 'cms')

  //   const filename = 'cms-translations.xlsx'

  //   // Set the headers to inform the browser about file type and suggested filename
  //   response.setHeader('Content-disposition', `attachment; filename=${filename}`)
  //   response.setHeader(
  //     'Content-type',
  //     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //   )
  //   response.send(buffer) // Send the file data as a response
  // }

  async uploadAppTranslationsSheet(request: Request, response: Response, next: NextFunction) {
    // Ensure a file was uploaded
    if (!request.file || !request.file.buffer) {
      return response.status(400).send('No file was uploaded.')
    }

    const locale = request.body.locale?.length ? request.body.locale : request.user.lang

    const sheetData = getSimpleSheetData(request.file.buffer)

    const fileContent = `
    // THIS FILE IS AUTO GENERATED. DO NOT EDIT MANUALLY
    import { AppTranslations } from '../../../types'

    export const ${locale}: AppTranslations = ${JSON.stringify({
      empty: '',
      ...sheetData,
    })}
    `

    const fileName = `${locale}.ts`

    // Set the headers to inform the browser about file type and suggested filename
    response.setHeader('Content-disposition', 'attachment; filename=' + fileName)
    response.setHeader('Content-type', 'text/plain')
    response.send(fileContent) // Send the file data as a response
  }

  async uploadCmsTranslationsSheet(request: Request, response: Response, next: NextFunction) {
    // Ensure a file was uploaded
    if (!request.file || !request.file.buffer) {
      return response.status(400).send('No file was uploaded.')
    }

    const locale = request.body.locale?.length ? request.body.locale : request.user.lang

    const sheetData = getSimpleSheetData(request.file.buffer)

    const fileContent = JSON.stringify(sheetData)

    const fileName = `${locale}.json`

    // Set the headers to inform the browser about file type and suggested filename
    response.setHeader('Content-disposition', 'attachment; filename=' + fileName)
    response.setHeader('Content-type', 'text/plain')
    response.send(fileContent) // Send the file data as a response
  }

  async generateCountriesSheet(request: Request, response: Response, next: NextFunction) {
    // Create a new workbook
    const workbook = {
      SheetNames: [],
      Sheets: {},
    }

    const headers = ['code', ...Object.keys(Object.values(countries)[0])]
    const dataArray = Object.entries(countries).map(([key, value]) => [
      key,
      ...Object.values(value),
    ])

    const sheetArray = [headers, ...dataArray]

    // Convert the array of arrays to a worksheet
    const worksheet = xlsx.utils.aoa_to_sheet(sheetArray)

    // Add the worksheet to the workbook
    workbook.SheetNames.push('countries')
    workbook.Sheets['countries'] = worksheet

    // Get the buffer
    const buffer = xlsx.write(workbook, { type: 'buffer' })

    const filename = 'countries.xlsx'

    // Set the headers to inform the browser about file type and suggested filename
    response.setHeader('Content-disposition', `attachment; filename=${filename}`)
    response.setHeader(
      'Content-type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )
    response.send(buffer) // Send the file data as a response
  }

  async generateProvincesSheet(request: Request, response: Response, next: NextFunction) {
    const buffer = generateSingleTabSheetFromArray(provinces, 'provinces')

    const filename = 'provinces.xlsx'

    // Set the headers to inform the browser about file type and suggested filename
    response.setHeader('Content-disposition', `attachment; filename=${filename}`)
    response.setHeader(
      'Content-type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )
    response.send(buffer) // Send the file data as a response
  }

  async uploadCountriesSheet(request: Request, response: Response, next: NextFunction) {
    // Ensure a file was uploaded
    if (!request.file || !request.file.buffer) {
      return response.status(400).send('No file was uploaded.')
    }

    const workbook = xlsx.read(request.file.buffer, { type: 'buffer' })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]

    // Convert the worksheet to JSON
    const jsonRaw = xlsx.utils.sheet_to_json(worksheet, {
      header: 1,
    }) as string[][]

    // Calculate max length of the array (to know how many columns there are)
    const maxLength = Math.max(...jsonRaw.map((row) => row.length))

    // Loop through rows and fill missing columns with empty string, so that no rows are lost
    const json = jsonRaw.map((row) => {
      while (row.length < maxLength && row.length !== 0) {
        row.push('')
      }
      return row
    })

    const headers = json[0]
    const data = json.slice(1)

    const reformattedArray = data.map((row) => {
      return row.reduce((acc, value, index) => {
        acc[headers[index]] = value
        return acc
      }, {})
    })

    const result = reformattedArray.reduce((acc, item) => {
      // @ts-ignore
      const { code, ...rest } = item
      acc[code] = rest
      return acc
    }, {})

    const fileContent = `
    import { Locale } from '.'

    type Country = Record<Locale, string>

    export const countries: Record<string, Country> = ${JSON.stringify(result)}
    `

    const fileName = `countries.ts`

    // Set the headers to inform the browser about file type and suggested filename
    response.setHeader('Content-disposition', 'attachment; filename=' + fileName)
    response.setHeader('Content-type', 'text/plain')
    response.send(fileContent) // Send the file data as a response
  }

  async uploadProvincesSheet(request: Request, response: Response, next: NextFunction) {
    // Ensure a file was uploaded
    if (!request.file || !request.file.buffer) {
      return response.status(400).send('No file was uploaded.')
    }

    const workbook = xlsx.read(request.file.buffer, { type: 'buffer' })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]

    // Convert the worksheet to JSON
    const jsonRaw = xlsx.utils.sheet_to_json(worksheet, {
      header: 1,
    }) as string[][]

    // Calculate max length of the array (to know how many columns there are)
    const maxLength = Math.max(...jsonRaw.map((row) => row.length))

    // Loop through rows and fill missing columns with empty string, so that no rows are lost
    const json = jsonRaw.map((row) => {
      while (row.length < maxLength && row.length !== 0) {
        row.push('')
      }
      return row
    })

    const headers = json[0]
    const data = json.slice(1)

    const reformattedData = data.map((row) => {
      return row.reduce((acc, value, index) => {
        acc[headers[index]] = value
        return acc
      }, {})
    })

    const fileContent = `
    import { Locale } from '.'

    type Province = {
      code: string
      uid: number
    } & {
      [K in Locale]: string
    }
    
    export const provinces: Province[] =  ${JSON.stringify(reformattedData)}
    `

    const fileName = `provinces.ts`

    // Set the headers to inform the browser about file type and suggested filename
    response.setHeader('Content-disposition', 'attachment; filename=' + fileName)
    response.setHeader('Content-type', 'text/plain')
    response.send(fileContent) // Send the file data as a response
  }
}

const getSimpleSheetData = (buffer, flatten = true) => {
  // Create a workbook from the xlsx data
  const workbook = xlsx.read(buffer, { type: 'buffer' })

  // Initialize the output object
  const output: Record<string, unknown> = {}

  // Loop over each sheet in the workbook
  for (const sheetName of workbook.SheetNames) {
    // Get the worksheet
    const worksheet = workbook.Sheets[sheetName]

    // Convert the worksheet to JSON
    const jsonRaw = xlsx.utils.sheet_to_json(worksheet, {
      header: 1,
    }) as string[][]

    // Calculate max length of the array (to know how many columns there are)
    const maxLength = Math.max(...jsonRaw.map((row) => row.length))

    // Loop through rows and fill missing columns with empty string, so that no rows are lost
    const json = jsonRaw.map((row) => {
      while (row.length < maxLength && row.length !== 0) {
        row.push('')
      }
      return row
    })

    // Convert the array of arrays to an object
    const obj = json.reduce((acc, [key, _original, value]) => {
      acc[key] = value
      return acc
    }, {})

    // Add the object to the output object
    output[sheetName] = obj
  }

  if (flatten) {
    return Object.entries(output).reduce<Record<string, unknown>>((acc, [key, item]) => {
      if (typeof item === 'object') {
        return { ...acc, ...item }
      }

      return {
        ...acc,
        [key]: item,
      }
    }, {})
  }

  return output
}

const generateSingleTabSheet = (data, tabName, maxColumns = 3) => {
  // Create a new workbook
  const workbook = {
    SheetNames: [],
    Sheets: {},
  }

  // Convert each object to an array of arrays, with each inner array representing a row
  const sheetArray = Object.entries(data).map(([key, value]) => [key, value, ''])

  // Convert the array of arrays to a worksheet
  const worksheet = xlsx.utils.aoa_to_sheet(sheetArray)
  worksheet['!cols'] = Array(maxColumns)
    .fill({})
    .map((col, index) => {
      if (index === 0) {
        return { hidden: true }
      }
      return col
    })

  // Add the worksheet to the workbook
  workbook.SheetNames.push(tabName)
  workbook.Sheets[tabName] = worksheet

  // Get the buffer
  const buffer = xlsx.write(workbook, { type: 'buffer' })
  return buffer
}

const generateSingleTabSheetFromArray = (data, tabName, maxColumns = 3) => {
  // Create a new workbook
  const workbook = {
    SheetNames: [],
    Sheets: {},
  }

  const headers = [...Object.entries(data[0]).map((item) => item[0])]
  const dataArray = data.map((item) => [...Object.values(item)])
  const sheetArray = [headers, ...dataArray]

  // Convert the array of arrays to a worksheet
  const worksheet = xlsx.utils.aoa_to_sheet(sheetArray)

  // Add the worksheet to the workbook
  workbook.SheetNames.push(tabName)
  workbook.Sheets[tabName] = worksheet

  // Get the buffer
  const buffer = xlsx.write(workbook, { type: 'buffer' })
  return buffer
}

const generateSimpleSheet = (data) => {
  // Create a new workbook
  const workbook = {
    SheetNames: [],
    Sheets: {},
  }

  // Loop over each item in the data object
  for (const [sheetName, sheetData] of Object.entries(data)) {
    // Convert each object to an array of arrays, with each inner array representing a row
    const sheetArray = Object.entries(sheetData).map(([key, value]) => [key, value, ''])

    // Convert the array of arrays to a worksheet
    const worksheet = xlsx.utils.aoa_to_sheet(sheetArray)
    const maxColumns = 3
    worksheet['!cols'] = Array(maxColumns)
      .fill({})
      .map((col, index) => {
        if (index === 0) {
          return { hidden: true }
        }
        return col
      })

    // Add the worksheet to the workbook
    workbook.SheetNames.push(sheetName)
    workbook.Sheets[sheetName] = worksheet
  }

  // Get the buffer
  const buffer = xlsx.write(workbook, { type: 'buffer' })
  return buffer
}

const replaceIdsInJson = (data: unknown, idsToReplace: string[], shouldReplace: boolean) => {
  if (!shouldReplace) {
    return data
  }

  const dataString = JSON.stringify(data)

  const dataNewIds = idsToReplace.reduce<string>((acc, id) => {
    const uuidRegex = new RegExp(id, 'g')
    return acc.replace(uuidRegex, uuidv4())
  }, dataString)

  return JSON.parse(dataNewIds)
}

const formatEncyclopediaData = (encyclopediaJson, shouldReplace) => {
  const dataNoOriginals = removeOriginalsFromArray(encyclopediaJson)
  const data = fromEncyclopedia({ encyclopediaResponse: dataNoOriginals })

  if (!shouldReplace) {
    return data
  }

  const categoryIds = data.categories.allIds
  const subCategoryIds = data.subCategories.allIds
  const articleIds = data.articles.allIds

  const idsToReplace = [...categoryIds, ...subCategoryIds, ...articleIds]

  const dataString = JSON.stringify(data)
  const dataNewIds = idsToReplace.reduce<string>((acc, id) => {
    const uuidRegex = new RegExp(id, 'g')

    return acc.replace(uuidRegex, uuidv4())
  }, dataString)

  return JSON.parse(dataNewIds)
}

const getDate = () => {
  const now = new Date()
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
}

const removeOriginals = (obj) => {
  for (const key in obj) {
    // If the key contains '_original', delete it
    if (key.includes('_original')) {
      delete obj[key]
    } else if (typeof obj[key] === 'object') {
      // If the value is an object, do a recursive call
      removeOriginals(obj[key])
    }
  }

  return obj
}

const removeOriginalsFromArray = (arr) => {
  return arr.map((item) => removeOriginals(item))
}
