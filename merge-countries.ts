import fs from 'fs'
import { countries } from '@oky/core'
import { logger } from './logger'

// Temporarily add locales to this array, to chose which locales to merge
const localesToMerge = []

// Use this to merge object instead of an array
// const itemsObject = {}
// const itemsArray = Object.entries(itemsObject).map(([key, value]) => {
//   const values = value as Record<string, string>
//   return {
//     code: key,
//     ...values,
//   }
// })

// Temporarily add countries to this array then execute this script to merge them into your /translations submodule
const itemsArray = []

const outputFilepath = './packages/core/src/modules/translations/countries.ts'

// ========================= Merge ========================= //
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

// ========================= Add Locales ========================= //
const localeToInsert = 'es'

const addLocale = () => {
  const updatedItems = { ...countries }
  Object.entries(updatedItems).map(([key, value]) => {
    updatedItems[key] = {
      ...value,
      [localeToInsert]: value.en, // TODO: This simply copies the english value
    }
  })

  const outputString = `
  import { Locale } from '.'

  type Country = Record<Locale, string>
  
  export const countries: Record<string, Country> = ${JSON.stringify(updatedItems)}`

  fs.writeFileSync(outputFilepath, outputString)
}

// ========================= Execute ========================= //
// mergeArray()
// addLocale()

logger('===== EDIT THIS FILE BEFORE EXECUTING IT =====')
