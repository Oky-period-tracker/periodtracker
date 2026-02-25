let customConfig = {}

try {
  // eslint-disable-next-line no-undef
  customConfig = require(`./src/resources/app.json`)
} catch (e) {
  console.log('Failed to load custom config')
}

export default ({ config }) => ({
  ...config,
  ...customConfig,
  extra: {
    ...customConfig.extra,
    eas: {
      projectId: "c44f0fcb-b031-43e9-b7e6-d3b36961d866"
    }
  }
})
