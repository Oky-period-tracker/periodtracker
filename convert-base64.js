const fs = require('fs')

const base64String = ''

const imageBuffer = Buffer.from(base64String, 'base64')

fs.writeFileSync('about-banner.jpg', imageBuffer)
