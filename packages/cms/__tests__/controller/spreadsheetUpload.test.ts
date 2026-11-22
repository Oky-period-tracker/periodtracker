import xlsx from 'xlsx'
import { DataController } from '../../src/controller/DataController'
import { NO_FILE, UNREADABLE_FILE } from '../../src/helpers/spreadsheetUpload'

jest.mock('typeorm', () => ({ ...jest.requireActual('typeorm'), getRepository: () => ({}) }))
jest.mock('@oky/core', () => ({
  fromEncyclopedia: () => ({
    articles: { allIds: [] },
    categories: { allIds: [] },
    subCategories: { allIds: [] },
  }),
  fromQuizzes: () => ({ quizzes: {} }),
  fromDidYouKnows: () => ({ didYouKnows: {} }),
  fromHelpCenters: () => ({ helpCenters: [] }),
  fromAvatarMessages: () => ({ avatarMessages: [] }),
}))
jest.mock('../../src/logger', () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}))

// Written like the CMS templates: one header row made of the object keys
const xlsxFile = (sheets: Record<string, object[]>) =>
  xlsx.write(
    {
      SheetNames: Object.keys(sheets),
      Sheets: Object.keys(sheets).reduce(
        (acc, name) => ({ ...acc, [name]: xlsx.utils.json_to_sheet(sheets[name]) }),
        {},
      ),
    },
    { type: 'buffer' },
  )

// Rows as they are in the sheet, for the translation sheets that have no header row
const xlsxRows = (rows: string[][]) =>
  xlsx.write(
    { SheetNames: ['app'], Sheets: { app: xlsx.utils.aoa_to_sheet(rows) } },
    { type: 'buffer' },
  )

const translated = (columns: string[], values: object) =>
  columns.reduce(
    (acc, column) => ({ ...acc, [`${column}_original`]: values[column], [column]: '' }),
    {},
  )

// The sheets of generateContentSheet, one category of articles included
const contentTemplate = (sheets: Record<string, object[]> = {}) => ({
  Periods: [
    {
      id: 'a1',
      cat_id: 'c1',
      subcat_id: 's1',
      ...translated(['category_title', 'subcategory_title', 'article_heading', 'article_text'], {
        category_title: 'Periods',
        subcategory_title: 'Basics',
        article_heading: 'Heading',
        article_text: 'Text',
      }),
      primary_emoji: '🩸',
      primary_emoji_name: 'drop',
      live: true,
    },
  ],
  Quizzes: [
    {
      id: 'q1',
      ...translated(
        [
          'topic',
          'question',
          'option1',
          'option2',
          'option3',
          'right_answer',
          'wrong_answer_response',
          'right_answer_response',
        ],
        {
          topic: 'Topic',
          question: 'Question',
          option1: 'A',
          option2: 'B',
          option3: 'C',
          right_answer: '1',
          wrong_answer_response: 'No',
          right_answer_response: 'Yes',
        },
      ),
      answer: '',
      isAgeRestricted: false,
      live: true,
    },
  ],
  'Did you know': [
    {
      id: 'd1',
      ...translated(['title', 'content'], { title: 'T', content: 'C' }),
      isAgeRestricted: false,
    },
  ],
  Avatars: [{ id: 'v1', ...translated(['content'], { content: 'Hi' }) }],
  Privacy: [{ type: 'p', ...translated(['content'], { content: 'Privacy' }) }],
  Terms: [{ type: 'p', ...translated(['content'], { content: 'Terms' }) }],
  About: [{ type: 'p', ...translated(['content'], { content: 'About' }) }],
  // The template writes this sheet empty
  Help: [],
  ...sheets,
})

const countriesTemplate = () => xlsxFile({ countries: [{ code: 'GB', en: 'United Kingdom' }] })
const provincesTemplate = () => xlsxFile({ provinces: [{ code: 'GB', uid: 1, en: 'England' }] })

type Upload =
  | 'uploadContentSheet'
  | 'uploadAppTranslationsSheet'
  | 'uploadCmsTranslationsSheet'
  | 'uploadCountriesSheet'
  | 'uploadProvincesSheet'

const upload = async (handler: Upload, buffer?: Buffer) => {
  const request: any = {
    file: buffer && { buffer },
    body: { locale: 'en' },
    user: { lang: 'en' },
    originalUrl: '/data/upload',
    flash: jest.fn(),
  }
  const response: any = { setHeader: jest.fn(), send: jest.fn(), redirect: jest.fn() }
  await new DataController()[handler](request, response, jest.fn())
  return {
    message: request.flash.mock.calls.map(([, message]) => message).join(' ') || null,
    redirect: response.redirect.mock.calls[0]?.[0] || null,
    downloaded: response.send.mock.calls.length > 0,
  }
}

const refused = (message: string) => ({ message, redirect: '/data', downloaded: false })
const accepted = { message: null, redirect: null, downloaded: true }

const uploads: Upload[] = [
  'uploadContentSheet',
  'uploadAppTranslationsSheet',
  'uploadCmsTranslationsSheet',
  'uploadCountriesSheet',
  'uploadProvincesSheet',
]

describe('spreadsheet uploads', () => {
  it.each(uploads)('%s refuses a file that is not an Excel file', async (handler) => {
    const text = Buffer.from('This is a plain text note, renamed to .xlsx')
    const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
    expect(await upload(handler, text)).toEqual(refused(UNREADABLE_FILE))
    expect(await upload(handler, png)).toEqual(refused(UNREADABLE_FILE))
  })

  it.each(uploads)('%s asks for a file when none was chosen', async (handler) => {
    expect(await upload(handler)).toEqual(refused(NO_FILE))
  })

  it('accepts the templates', async () => {
    expect(await upload('uploadContentSheet', xlsxFile(contentTemplate()))).toEqual(accepted)
    expect(await upload('uploadCountriesSheet', countriesTemplate())).toEqual(accepted)
    expect(await upload('uploadProvincesSheet', provincesTemplate())).toEqual(accepted)
    const translations = xlsxRows([['welcome', 'Welcome', 'Bienvenue']])
    expect(await upload('uploadAppTranslationsSheet', translations)).toEqual(accepted)
    expect(await upload('uploadCmsTranslationsSheet', translations)).toEqual(accepted)
  })

  it('accepts content sheets the template leaves empty', async () => {
    const noQuizzes = xlsxFile(contentTemplate({ Quizzes: [], Avatars: [] }))
    expect(await upload('uploadContentSheet', noQuizzes)).toEqual(accepted)
  })

  it('names the sheet a content file is missing', async () => {
    expect(await upload('uploadContentSheet', countriesTemplate())).toEqual(
      refused("This file doesn't match the template: sheet 'Quizzes' is missing."),
    )
  })

  it('names the column a sheet is missing', async () => {
    const quizzes = contentTemplate().Quizzes.map(({ question, ...rest }: any) => rest)
    expect(
      await upload('uploadContentSheet', xlsxFile(contentTemplate({ Quizzes: quizzes }))),
    ).toEqual(
      refused(
        "This file doesn't match the template: column 'question' is missing in sheet 'Quizzes'.",
      ),
    )
    expect(await upload('uploadCountriesSheet', xlsxFile(contentTemplate()))).toEqual(
      refused("This file doesn't match the template: column 'code' is missing in sheet 'Periods'."),
    )
    expect(await upload('uploadProvincesSheet', countriesTemplate())).toEqual(
      refused(
        "This file doesn't match the template: column 'uid' is missing in sheet 'countries'.",
      ),
    )
  })

  it('refuses sheets without rows', async () => {
    const empty = xlsxFile({ countries: [] })
    expect(await upload('uploadCountriesSheet', empty)).toEqual(
      refused("This file doesn't match the template: sheet 'countries' has no rows."),
    )
    expect(await upload('uploadAppTranslationsSheet', empty)).toEqual(
      refused("This file doesn't match the template: it has no rows."),
    )
  })
})
