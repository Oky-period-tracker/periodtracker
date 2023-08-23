import * as shell from 'shelljs'

const syncFolders: any = {
  './src/views': './dist/src/views',
  './src/public': './dist/src/public',
  './src/i18n': './dist/src/i18n',
}

Object.keys(syncFolders).map(sourceFolder => {
  const distFolder = syncFolders[sourceFolder]

  shell.rm('-rf', distFolder)
  shell.cp('-R', sourceFolder, distFolder)
})
