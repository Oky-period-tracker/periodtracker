import fs from 'fs'
import path from 'path'

let customConfig = {}

try {
  // eslint-disable-next-line no-undef
  customConfig = require(`./src/resources/app.json`)
} catch (e) {
  console.log('Failed to load custom config')
}

// iOS build-mechanics override for RNFB v22 on SDK 54. See docs/ios_build.md.
const FIREBASE_MODULAR_HEADER_PODS = [
  'FirebaseCore',
  'FirebaseCoreExtension',
  'FirebaseInstallations',
  'GoogleDataTransport',
  'GoogleUtilities',
  'nanopb',
]

const patchIosBuildProperties = (plugins) =>
  (plugins ?? []).map((plugin) => {
    if (!Array.isArray(plugin) || plugin[0] !== 'expo-build-properties') return plugin
    const [name, opts = {}] = plugin
    // eslint-disable-next-line no-unused-vars
    const { useFrameworks, ...iosRest } = opts.ios ?? {}
    return [name, {
      ...opts,
      ios: {
        ...iosRest,
        extraPods: [
          ...FIREBASE_MODULAR_HEADER_PODS.map((n) => ({ name: n, modular_headers: true })),
          ...(opts.ios?.extraPods ?? []),
        ],
      },
    }]
  })

// One Firebase project per environment. See docs/setup.md#firebase.
// Production is the default, same as ENV in src/config/env.ts: the
// `googleServicesFile` from app.json is used as is. Any other EXPO_PUBLIC_ENV
// (staging, development client, local native builds) uses its `.dev` sibling.
// eslint-disable-next-line no-undef
const isProduction = () => (process.env.EXPO_PUBLIC_ENV || 'production') === 'production'

// Falls back to the file from app.json when there is no `.dev` sibling, so
// resources with a single Firebase project keep working.
const withFirebaseEnv = (platform) => {
  const file = platform?.googleServicesFile
  if (!file || isProduction()) return platform
  const devFile = `${file}.dev`
  // eslint-disable-next-line no-undef
  const exists = fs.existsSync(path.resolve(__dirname, devFile))
  return exists ? { ...platform, googleServicesFile: devFile } : platform
}

export default ({ config }) => {
  const merged = { ...config, ...customConfig }
  if (!merged.expo) return merged
  return {
    ...merged,
    expo: {
      ...merged.expo,
      android: withFirebaseEnv(merged.expo.android),
      ios: withFirebaseEnv(merged.expo.ios),
      plugins: patchIosBuildProperties(merged.expo.plugins),
    },
  }
}
