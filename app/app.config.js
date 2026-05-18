/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const fs = require('fs')

// When OKY_PRIVATE_RESOURCES=1 and the private checkout exists, load the
// private app.json and rewrite any ./src/resources/... asset paths it
// contains to ./src/resources-global/... so Expo prebuild picks up the
// branded Firebase files, icon and splash from the private repo.
// Otherwise load the public committed app.json.

let usePrivate = process.env.OKY_PRIVATE_RESOURCES === '1'
if (!process.env.OKY_PRIVATE_RESOURCES) {
  try {
    const envFile = path.join(__dirname, '.env')
    if (fs.existsSync(envFile)) {
      const match = fs
        .readFileSync(envFile, 'utf8')
        .match(/^\s*OKY_PRIVATE_RESOURCES=([^\s#]*)/m)
      if (match && match[1].replace(/["']/g, '') === '1') {
        usePrivate = true
      }
    }
  } catch (e) {
    // ignore
  }
}

const privateJson = path.join(__dirname, 'src/resources-global/app.json')
const publicJson = path.join(__dirname, 'src/resources/app.json')

const rewritePaths = (value) => {
  if (typeof value === 'string') {
    return value.replace('./src/resources/', './src/resources-global/')
  }
  if (Array.isArray(value)) {
    return value.map(rewritePaths)
  }
  if (value && typeof value === 'object') {
    const next = {}
    for (const [k, v] of Object.entries(value)) {
      next[k] = rewritePaths(v)
    }
    return next
  }
  return value
}

let customConfig = {}
try {
  if (usePrivate && fs.existsSync(privateJson)) {
    customConfig = rewritePaths(require(privateJson))
  } else {
    customConfig = require(publicJson)
  }
} catch (e) {
  console.log('Failed to load custom config')
}

export default ({ config }) => {
  const nestedExpo = customConfig && customConfig.expo ? customConfig.expo : customConfig
  return { ...config, ...nestedExpo }
}
