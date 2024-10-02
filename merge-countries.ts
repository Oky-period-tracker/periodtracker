import fs from 'fs'
import { logger } from './logger'
import { countries } from '@oky/core'

// Temporarily add locales to this array, to chose which locales to merge
const localesToMerge = ['fr']

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

const outputFilepath = './app/src/resources/translations/countries.ts'

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
// *** Edit this to add desired locale to the countries object *** //
const localeToInsert = 'fr'

const addLocale = () => {
  const updatedItems = { ...countries }
  Object.entries(updatedItems).map(([key, value]) => {
    updatedItems[key] = {
      ...value,
      // @ts-ignore
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

// *** Uncomment the function you want to execute *** //

// mergeArray()
// addLocale()

logger('===== EDIT THIS FILE BEFORE EXECUTING IT =====')
