import fs from 'fs'
import { content } from '@oky/core'
import { v4 as uuid } from 'uuid'

const localeToUpdate = 'en'

const outputFilepath = `./packages/core/src/modules/translations/content/${localeToUpdate}.ts`

const replaceContentIds = () => {
  const updatedContent = { ...content[localeToUpdate] }

  let contentString = JSON.stringify(updatedContent)

  // Only the keys which have .allIds
  const keys = ['articles', 'categories', 'subCategories', 'quizzes', 'didYouKnows', 'videos']

  keys.forEach((key) => {
    updatedContent[key]?.allIds.forEach((id) => {
      contentString = contentString.replaceAll(id, uuid())
    })
  })

  const outputString = `
  import { StaticContent } from '../../../types'

  export const ${localeToUpdate}: StaticContent = ${contentString}`

  fs.writeFileSync(outputFilepath, outputString)
}

replaceContentIds()
