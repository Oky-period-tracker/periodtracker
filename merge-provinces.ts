import fs from 'fs'
import { provinces } from '@oky/core'

// Temporarily add locales to this array then execute this script to merge them into the locales.ts file in your /translations submodule
const localesToMerge = []

// Temporarily add provinces to this array then execute this script to merge them into the provinces.ts file in your /translations submodule
const provincesToMerge = []

const outputFilepath = './packages/core/src/modules/translations/provinces.ts'

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

mergeProvinces()
