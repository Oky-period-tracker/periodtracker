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
      projectId: "45542012-f867-4e19-915d-e5af67ac6eb3"
    }
  }
})
