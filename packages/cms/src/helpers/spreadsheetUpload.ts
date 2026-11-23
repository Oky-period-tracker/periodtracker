import xlsx, { WorkBook } from 'xlsx'

/**
 * Checks the spreadsheets uploaded on Data Management before they are converted,
 * so a wrong file gets a message the editor can act on instead of a server error.
 */
export class RefusedUpload extends Error {}

export const NO_FILE = 'Choose a file to upload.'
export const UNREADABLE_FILE =
  "This file can't be read. Please upload an Excel file (.xlsx) based on the template."

const doesNotMatch = (detail: string) =>
  new RefusedUpload(`This file doesn't match the template: ${detail}.`)

// The columns each content converter reads. See generateContentSheet for the template
const CONTENT_SHEET_COLUMNS: Record<string, string[]> = {
  Quizzes: [
    'id',
    'question',
    'option1',
    'option2',
    'option3',
    'right_answer',
    'wrong_answer_response',
    'right_answer_response',
    'isAgeRestricted',
  ],
  'Did you know': ['id', 'title', 'content', 'isAgeRestricted'],
  Help: [],
  Avatars: ['id', 'content'],
  Privacy: ['type', 'content'],
  Terms: ['type', 'content'],
  About: ['type', 'content'],
}
export const CONTENT_SHEETS = Object.keys(CONTENT_SHEET_COLUMNS)

// Every other sheet of the content template is a category of articles
const ARTICLE_COLUMNS = [
  'id',
  'cat_id',
  'subcat_id',
  'category_title',
  'subcategory_title',
  'article_heading',
  'article_text',
  'primary_emoji',
  'primary_emoji_name',
]

// An .xlsx file is a zip archive. The parser also turns plain text into a
// one-sheet table, so a renamed text file would otherwise get through
const isZip = (buffer: Buffer) => buffer.length >= 4 && buffer.readUInt32LE(0) === 0x04034b50

export function readWorkbook(buffer: Buffer): WorkBook {
  if (!isZip(buffer)) {
    throw new RefusedUpload(UNREADABLE_FILE)
  }
  let workbook: WorkBook
  try {
    workbook = xlsx.read(buffer, { type: 'buffer' })
  } catch (error) {
    throw new RefusedUpload(UNREADABLE_FILE)
  }
  if (!workbook.SheetNames.length) {
    throw new RefusedUpload(UNREADABLE_FILE)
  }
  return workbook
}

const rowsOf = (workbook: WorkBook, sheet: string) =>
  xlsx.utils.sheet_to_json(workbook.Sheets[sheet], { header: 1 }) as unknown[][]

// The first row holds the column names
const requireColumns = (
  workbook: WorkBook,
  sheet: string,
  columns: string[],
  { allowEmpty }: { allowEmpty: boolean },
) => {
  const [header] = rowsOf(workbook, sheet)
  if (!header) {
    if (allowEmpty) {
      return
    }
    throw doesNotMatch(`sheet '${sheet}' has no rows`)
  }
  const missing = columns.find((column) => !header.includes(column))
  if (missing) {
    throw doesNotMatch(`column '${missing}' is missing in sheet '${sheet}'`)
  }
}

export function checkContentSheet(workbook: WorkBook) {
  const missing = CONTENT_SHEETS.find((sheet) => !workbook.SheetNames.includes(sheet))
  if (missing) {
    throw doesNotMatch(`sheet '${missing}' is missing`)
  }
  for (const sheet of workbook.SheetNames) {
    // The template writes an empty sheet when there is no content of that kind
    requireColumns(workbook, sheet, CONTENT_SHEET_COLUMNS[sheet] || ARTICLE_COLUMNS, {
      allowEmpty: true,
    })
  }
}

// Translation sheets have no header row: each row is key, original text, translation
export function checkTranslationsSheet(workbook: WorkBook) {
  const hasRows = workbook.SheetNames.some((sheet) =>
    rowsOf(workbook, sheet).some((row) => row.length > 0),
  )
  if (!hasRows) {
    throw doesNotMatch('it has no rows')
  }
}

export const checkCountriesSheet = (workbook: WorkBook) =>
  requireColumns(workbook, workbook.SheetNames[0], ['code'], { allowEmpty: false })

export const checkProvincesSheet = (workbook: WorkBook) =>
  requireColumns(workbook, workbook.SheetNames[0], ['code', 'uid'], { allowEmpty: false })
