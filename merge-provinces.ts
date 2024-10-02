import fs from 'fs'
import { logger } from './logger'
import { provinces } from '@oky/core'

// Temporarily add locales to this array then execute this script to merge them into the locales.ts file in your /translations submodule
const localesToMerge = []

// Temporarily add provinces to this array then execute this script to merge them into the provinces.ts file in your /translations submodule
const provincesToMerge = []

const outputFilepath = './app/src/resources/translations/provinces.ts'

// ========================= Merge ========================= //
const mergeProvinces = () => {
  const mergedProvinces = provinces.map((province, index) => {
    if (
      province.code !== provincesToMerge[index].code ||
      province.uid !== provincesToMerge[index].uid
    ) {
      throw new Error('Error, mismatch between arrays')
    }

    const newValues = Object.keys(provincesToMerge[index]).reduce((acc, key) => {
      if (localesToMerge.includes(key)) {
        acc[key] = provincesToMerge[index][key]
      }

      return acc
    }, {})

    return {
      ...province,
      ...newValues,
    }
  })

  const outputString = `
  import { Locale } from '.'

  type Province = {
    code: string
    uid: number
  } & {
    [K in Locale]: string
  }
  
  export const provinces: Province[] = ${JSON.stringify(mergedProvinces)}`

  fs.writeFileSync(outputFilepath, outputString)
}

// ========================= Add Locales ========================= //
const localeToInsert = 'es'

const addLocale = () => {
  const updatedProvinces = provinces.map((province, index) => {
    return {
      ...province,
      [localeToInsert]: province.en, // TODO: This simply copies the english value
    }
  })

  const outputString = `
  import { Locale } from '.'

  type Province = {
    code: string
    uid: number
  } & {
    [K in Locale]: string
  }
  
  export const provinces: Province[] = ${JSON.stringify(updatedProvinces)}`

  fs.writeFileSync(outputFilepath, outputString)
}

// ========================= Execute ========================= //
// mergeProvinces()
// addLocale()

logger('===== EDIT THIS FILE BEFORE EXECUTING IT =====')
