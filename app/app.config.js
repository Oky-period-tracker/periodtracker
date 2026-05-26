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

export default ({ config }) => {
  const merged = { ...config, ...customConfig }
  if (!merged.expo) return merged
  return { ...merged, expo: { ...merged.expo, plugins: patchIosBuildProperties(merged.expo.plugins) } }
}
