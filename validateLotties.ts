import * as fs from 'fs-extra'
import * as path from 'path'
import * as lottie from 'lottie-parser'

const folderPath = './app/src/resources/assets/lottie'

const maxLottieSize = 2000 // KB
const expectedAspectRatio = 0.5

const logger = (...values) => {
  // tslint:disable-next-line
  console.log(...values)
}

async function validateAssets() {
  const files = await fs.readdir(folderPath)

  for (const file of files) {
    if (path.extname(file) === '.json') {
      const filePath = path.join(folderPath, file)
      const content = await fs.readFile(filePath, 'utf-8')
      const animation = lottie.parse(JSON.parse(content))
      const stats = await fs.stat(filePath)

      const size = Math.round(stats.size / 1024) // Convert bytes to KB
      const aspectRatio = (animation.width / animation.height).toFixed(2)

      logger(`---\n`)
      logger(`File: ${file}`)
      logger(`Size: ${size} KB`)
      logger(`Default viewport size: ${animation.width} x ${animation.height}`)
      logger(`Aspect ratio: ${aspectRatio}`)

      if (size > maxLottieSize) {
        logger(`\nWARNING: Lottie file is larger than ${maxLottieSize} KB`)
      }
      if (size > maxLottieSize) {
        logger(`WARNING: Incorrect aspect ratio, expected ${expectedAspectRatio}`)
      }
    }
  }
}

validateAssets().catch(console.error)
