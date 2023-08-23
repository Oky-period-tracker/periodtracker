import * as fs from 'fs-extra'
import * as path from 'path'

const sources = [
  {
    name: 'iOS',
    source: './packages/components/src/assets/mobile/Images.xcassets',
    destination: './packages/mobile/ios/oky/Images.xcassets',
  },
  {
    name: 'android',
    source: './packages/components/src/assets/mobile/android',
    destination: './packages/mobile/android/app/src/main/res',
  },
]

async function getFiles(
  dirPath: string,
  parentPath: string = '',
): Promise<string[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true })

  const files = entries
    .filter((fileEnt) => !fileEnt.isDirectory())
    .map((fileEnt) => path.join(parentPath, fileEnt.name))

  const folders = entries.filter((folderEnt) => folderEnt.isDirectory())

  for (const folderEnt of folders) {
    const subDirPath = path.join(dirPath, folderEnt.name)
    const subParentPath = path.join(parentPath, folderEnt.name)
    const subFiles = await getFiles(subDirPath, subParentPath)
    files.push(...subFiles)
  }

  return files
}

const copyAssets = async ({ source, destination, name }) => {
  const files = await getFiles(source)

  for (const relativePath of files) {
    const srcPath = path.join(source, relativePath)
    const destinationPath = path.join(destination, relativePath)
    await fs.copy(srcPath, destinationPath)
  }

  // tslint:disable-next-line
  console.log(`Copied ${name} assets`)
}

sources.forEach((folder) => {
  copyAssets(folder)
})
