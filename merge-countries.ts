import fs from 'fs'
import { countries } from '@oky/core'

// Temporarily add locales to this array, to chose which locales to merge
const localesToMerge = []

// const itemsObject = {}

// Temporarily add countries to this array then execute this script to merge them into your /translations submodule
const itemsArray = []

const outputFilepath = './packages/core/src/modules/translations/countries.ts'

const mergeArray = () => {
  const mergedItems = { ...countries }
  itemsArray.forEach((item) => {
    const newValues = localesToMerge.reduce((acc, locale) => {
      return {
        ...acc,
        [locale]: item[locale],
      }
    }, {})

    mergedItems[item.code] = {
      ...mergedItems[item.code],
      ...newValues,
    }
  })

  const outputString = `
  import { Locale } from '.'

  type Country = Record<Locale, string>
  
  export const countries: Record<string, Country> = ${JSON.stringify(mergedItems)}`

  fs.writeFileSync(outputFilepath, outputString)
}

mergeArray()
