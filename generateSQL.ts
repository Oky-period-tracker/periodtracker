import * as fs from 'fs'
import { Quiz, StaticContent } from './app/src/core/types'
import { content as staleContent } from './app/src/resources/translations/content'

const columnNames = {
  category: ['id', 'title', 'primary_emoji', 'primary_emoji_name', 'lang'],
  subcategory: ['id', 'title', 'parent_category', 'lang'],
  article: ['id', 'category', 'subcategory', 'article_heading', 'article_text', 'live', 'lang'],
  video: ['id', 'title', 'youtubeId', 'assetName', 'live', 'lang'],
  quiz: [
    'id',
    'topic',
    'question',
    'option1',
    'option2',
    'option3',
    'right_answer',
    'wrong_answer_response',
    'right_answer_response',
    'isAgeRestricted',
    'live',
    'lang',
  ],
  did_you_know: ['id', 'title', 'content', 'isAgeRestricted', 'live', 'lang'],
  help_center: ['id', 'title', 'caption', 'contactOne', 'contactTwo', 'address', 'website', 'lang'],
  help_center_attribute: ['id', 'name', 'emoji', 'isActive', 'lang'],
  avatar_messages: ['id', 'content', 'live', 'lang'],
  privacy_policy: ['json_dump', 'timestamp', 'lang'],
  terms_and_conditions: ['json_dump', 'timestamp', 'lang'],
  about: ['json_dump', 'timestamp', 'lang'],
}

// ==================== Utils ==================== //
const toColumnsString = (columns: string[]) => {
  return columns.map((col) => `"${col}"`).join(', ')
}

const toValuesString = (values: Array<Array<string | number | null>>) => {
  return values
    .map((valuesArray) => {
      return `(${valuesArray
        .map((v) =>
          typeof v === 'number' ? v : v === null ? `null` : `'${escapeSingleQuotes(v)}'`,
        )
        .join(', ')})`
    })
    .join(', ')
}

const escapeSingleQuotes = (str: string) => {
  if (!str || typeof str !== 'string') return str
  return str.replace(/(?<!')'(?!')/g, "''")
}

const generateSql = ({
  name,
  columns,
  values,
}: {
  name: string
  columns: string[]
  values: Array<Array<string | number>>
}) => {
  if (!values.length) {
    return ''
  }
  const columnsString = toColumnsString(columns)
  const valueString = toValuesString(values)
  return `INSERT INTO "${name}" (${columnsString}) VALUES ${valueString};\n\n`
}

// ==================== Extractors ==================== //

const getEncyclopedia = (content: StaticContent) => {
  const allValues = Object.values(content.categories.byId).reduce<{
    categoryValues: string[][]
    subCategoryValues: string[][]
    articleValues: string[][]
  }>(
    (acc, category) => {
      const categoryValuesArray = [
        category.id,
        category.name,
        category.tags.primary.emoji,
        category.tags.primary.name,
        content.locale,
      ]

      const { subCategoryValuesArray, articleValuesArray } = category.subCategories.reduce<{
        subCategoryValuesArray: string[][]
        articleValuesArray: string[][]
      }>(
        (subAcc, subCategoryId) => {
          const subCategory = content.subCategories.byId[subCategoryId]

          const articles = subCategory.articles.reduce<string[][]>((articlesAcc, articleId) => {
            const article = content.articles.byId[articleId]

            const values = [
              article.id,
              category.id,
              subCategory.id,
              article.title,
              article.content,
              article.live === false ? '0' : '1',
              content.locale,
            ]

            return [...articlesAcc, values]
          }, [])

          const subCategories = [subCategory.id, subCategory.name, category.id, content.locale]

          return {
            subCategoryValuesArray: [...subAcc.subCategoryValuesArray, subCategories],
            articleValuesArray: [...subAcc.articleValuesArray, ...articles],
          }
        },
        {
          subCategoryValuesArray: [],
          articleValuesArray: [],
        },
      )

      return {
        categoryValues: [...acc.categoryValues, categoryValuesArray],
        subCategoryValues: [...acc.subCategoryValues, ...subCategoryValuesArray],
        articleValues: [...acc.articleValues, ...articleValuesArray],
      }
    },
    {
      categoryValues: [],
      subCategoryValues: [],
      articleValues: [],
    },
  )

  return allValues
}

const getQuiz = (content: StaticContent) => {
  const getCorrectAnswer = (quiz: Quiz) => {
    const index = quiz.answers.findIndex((a) => a.isCorrect)
    if (index === -1) {
      throw new Error(`No correct answer found in quiz with id: ${quiz.id}`)
    }

    return (index + 1).toString()
  }

  return Object.values(content.quizzes.byId).reduce<string[][]>((acc, quiz) => {
    const valuesArray = [
      quiz.id,
      quiz.topic,
      quiz.question,
      quiz.answers[0].text,
      quiz.answers[1].text,
      quiz.answers[2]?.text || 'NA',
      getCorrectAnswer(quiz),
      quiz.response.in_correct,
      quiz.response.correct,
      quiz.isAgeRestricted ? '1' : '0',
      quiz.live ? '1' : '0',
      content.locale,
    ]

    return [...acc, valuesArray]
  }, [])
}

const getVideos = (content: StaticContent) => {
  if (!content.videos) {
    return []
  }

  return Object.values(content.videos.byId).reduce<string[][]>((acc, video) => {
    const valuesArray = [
      video.id,
      video.title,
      video.youtubeId ?? null,
      video.assetName ?? null,
      video.live ? '1' : '0',
      content.locale,
    ]

    return [...acc, valuesArray]
  }, [])
}

const getDidYouKnows = (content: StaticContent) => {
  return Object.values(content.didYouKnows.byId).reduce<string[][]>((acc, entry) => {
    const valuesArray = [
      entry.id,
      entry.title,
      entry.content,
      entry.isAgeRestricted ? '1' : '0',
      entry.live ? '1' : '0',
      content.locale,
    ]

    return [...acc, valuesArray]
  }, [])
}

const getHelpCenters = (content: StaticContent) => {
  return content.helpCenters.map((entry) => {
    return [
      entry.id,
      entry.title,
      entry.caption,
      entry.contactOne,
      entry?.contactTwo || '',
      entry.address,
      entry.website,
      content.locale,
    ]
  })
}

const getHelpCenterAttributes = (content: StaticContent) => {
  return content.helpCenterAttributes.map((entry) => {
    return [entry.id, entry.name, entry.emoji, entry.isActive, content.locale]
  })
}

const getAvatarMessages = (content: StaticContent) => {
  return content.avatarMessages.map((entry) => {
    return [entry.id, entry.content, entry.live ? '1' : '0', content.locale]
  })
}

const getPrivacyPolicy = (content: StaticContent) => {
  return [
    [
      JSON.stringify(content.privacyPolicy),
      '2021-12-01 11:06:21.064', // TODO_ALEX
      content.locale,
    ],
  ]
}

const getTermsAndConditions = (content: StaticContent) => {
  return [
    [
      JSON.stringify(content.termsAndConditions),
      '2021-12-01 11:06:21.064', // TODO_ALEX
      content.locale,
    ],
  ]
}

const getAbout = (content: StaticContent) => {
  return [
    [
      JSON.stringify(content.about),
      '2021-12-01 11:06:21.064', // TODO_ALEX
      content.locale,
    ],
  ]
}

// ==================== Write the files ==================== //
const locales = Object.keys(staleContent)

locales.forEach((locale) => {
  const contentData = staleContent[locale]

  const { categoryValues, subCategoryValues, articleValues } = getEncyclopedia(contentData)

  const values = {
    category: categoryValues,
    subcategory: subCategoryValues,
    article: articleValues,
    video: getVideos(contentData),
    quiz: getQuiz(contentData),
    did_you_know: getDidYouKnows(contentData),
    help_center: getHelpCenters(contentData),
    help_center_attribute: getHelpCenterAttributes(contentData),
    avatar_messages: getAvatarMessages(contentData),
    privacy_policy: getPrivacyPolicy(contentData),
    terms_and_conditions: getTermsAndConditions(contentData),
    about: getAbout(contentData),
  }

  const tables = Object.keys(values).map((key) => {
    return {
      name: key,
      columns: columnNames[key],
      values: values[key],
    }
  })

  let sql = `-- THIS FILE IS AUTOGENERATED - DO NOT EDIT THIS FILE MANUALLY\n\n`

  sql += tables.reduce((acc, table) => {
    return acc + generateSql(table)
  }, '')

  const outputFilepath = `./app/src/resources/translations/content/insert-content-${locale}.sql`

  fs.writeFileSync(outputFilepath, sql)
})
