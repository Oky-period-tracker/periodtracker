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
})
