import * as shell from 'shelljs'

const syncFolders: any = {
  // ...
}

Object.keys(syncFolders).map(sourceFolder => {
  const distFolder = syncFolders[sourceFolder]

  shell.rm('-rf', distFolder)
  shell.cp('-R', sourceFolder, distFolder)
})
