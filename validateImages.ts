import * as fs from 'fs-extra'
import * as path from 'path'

// README: Sharp package caused errors in the Docker environment, so it is not installed as a dependency in the package.json, it is instead installed when you run the yarn script that executes this file.
// This means that the package.json will be updated with the sharp package, do not commit this change.

// @ts-ignore
import sharp from 'sharp'

const assetsFolder = './app/src/resources/assets'

const logger = (...values) => {
  console.log(...values) // tslint:disable-line
}

async function generatePathsMapping() {
  const filePath = `${assetsFolder}/index.ts`
  const outputPath = `${assetsFolder}/paths.ts`

  let content = await fs.readFile(filePath, 'utf8')

  content = content.replace(/require\((['"])(.+?)\1\)/g, "'$2'")

  const importStatement = `import { AppAssets } from '@oky/core'`
  const exportStatement = `export const assets: AppAssets`

  content = content.replace(
    importStatement,
    '// THIS FILE IS AUTO GENERATED, DO NOT EDIT IT MANUALLY',
  )
  content = content.replace(exportStatement, 'export const assetsPaths')

  await fs.writeFile(outputPath, content, 'utf8')
}

const allowedExts = ['.png', '.jpg']

const getPathMetadata = async (filePath: string) => {
  const ext = path.extname(filePath)

  if (!allowedExts.includes(ext)) {
    return undefined
  }

  const absolutePath = path.join(assetsFolder, filePath.substring(1))
  const image = sharp(absolutePath)
  const metadata = await image.metadata()
  const stats = await fs.statSync(absolutePath)

  return {
    path: filePath,
    format: metadata.format,
    width: metadata.width,
    height: metadata.height,
    size: stats.size,
  }
}

const getMetadata = async (obj) => {
  const output = {}

  for (const [key, value] of Object.entries(obj)) {
    output[key] = value
    if (typeof value === 'string') {
      output[key] = await getPathMetadata(value)
    }
    if (typeof value === 'object') {
      output[key] = await getMetadata(value)
    }
  }

  return output
}

const generateMetadata = async () => {
  const assetPathsFile = require(`${assetsFolder}/paths`)

  const data = await getMetadata(assetPathsFile.assetsPaths)

  const content = `
  // THIS FILE IS AUTO GENERATED, DO NOT EDIT IT MANUALLY

  export const metaData = ${JSON.stringify(data)}`

  await fs.writeFile(`${assetsFolder}/metaData.ts`, content, 'utf8')
}

const isWithinTolerance = (a: number, b: number, percentage: number = 0.1) => {
  const tolerance = a * percentage
  return Math.abs(a - b) <= tolerance
}

const compareMetadata = () => {
  const coreMetaDataFile = require(`./metaData`)
  const assetsMetaDataFile = require(`${assetsFolder}/metaData`)
  const coreData = coreMetaDataFile.metaData
  const metaData = assetsMetaDataFile.metaData

  ;['avatars', 'backgrounds'].forEach((dataKey) => {
    Object.values(metaData[dataKey]).forEach((item) => {
      Object.entries(item).forEach(([imageKey, image]) => {
        if (!image.path) {
          return
        }
        Object.entries(image).forEach(([key, value]) => {
          if (typeof value !== 'number') {
            return
          }

          if (!coreData[dataKey][imageKey]) {
            return
          }

          const coreValue = coreData[dataKey][imageKey][key]
          if (!coreValue) {
            return
          }

          if (key === 'size') {
            if (value > coreValue) {
              logMismatch(key, value, coreValue, image.path)
            }
            return
          }

          if (!isWithinTolerance(value, coreValue)) {
            logMismatch(key, value, coreValue, image.path)
          }
        })
      })
    })
  })
}

const logMismatch = (key, value, coreValue, filePath) => {
  logger(`WARNING: Image ${key} mismatch`, filePath)
  logger(`Expected ${key}: ${coreValue}`)
  logger(`Actual ${key}: ${value}`)
  logger(`\n`)
}

async function validateAssets() {
  await generatePathsMapping()
  await generateMetadata()
  compareMetadata()
}

validateAssets()
