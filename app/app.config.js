const path = require('path')
const fs = require('fs')

let customConfig = {}
const configPath = path.join(__dirname, 'src', 'resources', 'app.json')
try {
  const raw = fs.readFileSync(configPath, 'utf8')
  customConfig = JSON.parse(raw)
} catch (e) {
  console.error('Failed to load custom config from', configPath, e.message)
}

export default ({ config }) => ({
  ...config,
  ...(customConfig.expo ?? customConfig),
})
