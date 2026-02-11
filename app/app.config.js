const path = require('path')
const fs = require('fs')
const withRNFBPodfile = require('./plugins/expo-plugin-rnfb-podfile.js')

let customConfig = {}
const configPath = path.join(__dirname, 'src', 'resources', 'app.json')
try {
  const raw = fs.readFileSync(configPath, 'utf8')
  customConfig = JSON.parse(raw)
} catch (e) {
  console.error('Failed to load custom config from', configPath, e.message)
}

const expoCustom = customConfig.expo ?? customConfig

// Paths for local dev only; not in app.json so EAS never sees a reference to gitignored files
const LOCAL_ANDROID_GOOGLE_SERVICES = './src/resources/google-services.json'
const LOCAL_IOS_GOOGLE_SERVICES = './src/resources/GoogleService-Info.plist'

export default ({ config }) => {
  const merged = {
    ...config,
    ...expoCustom,
  }
  // EAS Build: use file env vars. Local: use path only when file exists (never reference missing file).
  if (process.env.GOOGLE_SERVICES_JSON) {
    merged.android = { ...merged.android, googleServicesFile: process.env.GOOGLE_SERVICES_JSON }
  } else if (fs.existsSync(path.join(__dirname, LOCAL_ANDROID_GOOGLE_SERVICES.replace(/^\.\//, '')))) {
    merged.android = { ...merged.android, googleServicesFile: LOCAL_ANDROID_GOOGLE_SERVICES }
  }
  if (process.env.GOOGLE_SERVICE_INFO_PLIST) {
    merged.ios = { ...merged.ios, googleServicesFile: process.env.GOOGLE_SERVICE_INFO_PLIST }
  } else if (fs.existsSync(path.join(__dirname, LOCAL_IOS_GOOGLE_SERVICES.replace(/^\.\//, '')))) {
    merged.ios = { ...merged.ios, googleServicesFile: LOCAL_IOS_GOOGLE_SERVICES }
  }
  return withRNFBPodfile(merged)
}
