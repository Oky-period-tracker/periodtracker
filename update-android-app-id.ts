import * as fs from 'fs'
import * as path from 'path'
import { logger } from './logger'

const placeholder = '{APPLICATION_ID}'

const templates = [
  'app/android/app/src/main/AndroidManifest.xml.dist',
  'app/android/app/src/templates/MainActivity.kt.dist',
  'app/android/app/src/templates/MainApplication.kt.dist',
]

const destinations = [
  'app/android/app/src/main/AndroidManifest.xml',
  'app/android/app/src/main/java/{APPLICATION_PATH}/MainActivity.kt',
  'app/android/app/src/main/java/{APPLICATION_PATH}/MainApplication.kt',
]

const foldersToClean = ['app/android/app/src/debug/java', 'app/android/app/src/main/java']

const gradlePropertiesPath = path.join(__dirname, 'app/android/gradle.properties')
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
