import * as fs from 'fs'
import * as path from 'path'
import { logger } from './logger'

const placeholder = '{APPLICATION_ID}'

const templates = [
  'packages/mobile/android/app/BUCK.dist',
  'packages/mobile/android/app/src/main/AndroidManifest.xml.dist',
  'packages/mobile/android/app/templates/MainActivity.java.dist',
  'packages/mobile/android/app/templates/MainApplication.java.dist',
  'packages/mobile/android/app/templates/ReactNativeFilpper.java.dist',
]

const destinations = [
  'packages/mobile/android/app/BUCK',
  'packages/mobile/android/app/src/main/AndroidManifest.xml',
  'packages/mobile/android/app/src/main/java/{APPLICATION_PATH}/MainActivity.java',
  'packages/mobile/android/app/src/main/java/{APPLICATION_PATH}/MainApplication.java',
  'packages/mobile/android/app/src/debug/java/{APPLICATION_PATH}/ReactNativeFilpper.java',
]

const foldersToClean = [
  'packages/mobile/android/app/src/debug/java',
  'packages/mobile/android/app/src/main/java',
]

const gradlePropertiesPath = path.join(__dirname, 'packages/mobile/android/gradle.properties')
const gradleProperties = fs.readFileSync(gradlePropertiesPath, 'utf8')

const applicationIdMatch = gradleProperties.match(/^APPLICATION_ID=(.+)$/m)
const applicationId = applicationIdMatch ? applicationIdMatch[1] : null

if (!applicationId) {
  console.error('APPLICATION_ID not found in gradle.properties')
  process.exit(1)
}

const APPLICATION_PATH = applicationId.split('.').join('/')

const updateFiles = async () => {
  const deleteFolderRecursive = async (filePath) => {
    try {
      await fs.promises.rm(filePath, { recursive: true, force: true })
    } catch (error) {
      console.error(`Error removing the directory: ${filePath}`, error)
    }
  }

  const createFoldersRecursive = async (filePath) => {
    try {
      // The recursive option will create all necessary parent directories
      await fs.promises.mkdir(`${filePath}/${APPLICATION_PATH}`, { recursive: true })
    } catch (error) {
      console.error(`Error creating the directory: ${filePath}`, error)
    }
  }

  for (const filePath of foldersToClean) {
    await deleteFolderRecursive(filePath)
  }

  for (const filePath of foldersToClean) {
    await createFoldersRecursive(filePath)
  }

  templates.forEach((template, index) => {
    const fileContent = fs.readFileSync(template, 'utf8')
    const updatedContent = fileContent.replaceAll(placeholder, applicationId)
    const destination = destinations[index].replace('{APPLICATION_PATH}', APPLICATION_PATH)
    // fs.mkdir()
    fs.writeFileSync(destination, updatedContent)
  })

  logger(`============================================================`)
  logger(`Updated android config with Application ID: ${applicationId}`)
  logger(`============================================================`)
}

updateFiles()
