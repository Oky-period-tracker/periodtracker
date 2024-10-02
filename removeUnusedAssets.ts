import * as fs from 'fs-extra'
import * as path from 'path'

const assetsFolder = './app/src/resources/assets'

const foldersToIgnore = ['mobile']

async function getRequiredPaths() {
  const filePath = `${assetsFolder}/index.ts`
  const content = await fs.readFile(filePath, 'utf-8')

  const requireRegex = /require\('(.+?)'\)/g
  let match
  const paths = []

  match = requireRegex.exec(content)

  while (match !== null) {
    paths.push(match[1])
    match = requireRegex.exec(content)
  }

  const absolutePaths = paths.map((p) => path.join(assetsFolder, p.substring(1)))

  return absolutePaths
}

async function getFiles(dirPath: string = assetsFolder) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true })

  let files = entries
    .filter((fileEnt) => !fileEnt.isDirectory())
    .map((fileEnt) => path.join(dirPath, fileEnt.name))

  const folders = entries.filter((folderEnt) => folderEnt.isDirectory())

  for (const folderEnt of folders) {
    if (foldersToIgnore.includes(folderEnt.name)) {
      continue
    }
    const subFiles = await getFiles(path.join(dirPath, folderEnt.name))
    files = files.concat(subFiles)
  }

  return files
}

const removeUnusedAssets = async () => {
  const files = await getFiles()

  const requiredPaths = await getRequiredPaths()

  const fileExtensionsToRemove = ['.json', '.png', '.jpg', '.svg']

  const allUnusedFiles = files.filter((file) => {
    const fileWithoutModifier = file.replace(/@\d+x/g, '') // remove @2x, @3x, etc
    return !requiredPaths.includes(fileWithoutModifier)
  })

  const filesToRemove = allUnusedFiles.filter((file) => {
    const ext = path.extname(file)
    return fileExtensionsToRemove.includes(ext)
  })

  for (const filePath of filesToRemove) {
    try {
      await fs.remove(filePath)
      console.log(`Deleted: ${filePath}`) // tslint:disable-line
    } catch (error) {
      console.error(`Error deleting ${filePath}:`, error) // tslint:disable-line
    }
  }
}

removeUnusedAssets()
