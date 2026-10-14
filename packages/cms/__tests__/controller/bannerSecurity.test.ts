import { readFileSync } from 'fs'
import { resolve } from 'path'
import ejs from 'ejs'

it('escapes legacy banner values so they cannot create HTML elements or attributes', () => {
  const template = readFileSync(resolve(__dirname, '../../src/views/About.ejs'), 'utf8')
    .split('\n')
    .find((line) => line.includes('id="aboutBanner"'))!
  const html = ejs.render(template, {
    image: 'x><script>document.body.dataset.injected=1</script>',
  })
  expect(html).not.toContain('<script>')
  expect(html).toContain('src="')
  expect(html).toContain('&lt;script&gt;')
})

import { isSafeBannerImage } from '../../src/helpers/safeUtils'

it.each(['https://example.com/banner.png', '/banner.png', 'data:image/png;base64,aGVsbG8=', ''])(
  'accepts supported banner source %s',
  (value) => {
    expect(isSafeBannerImage(value)).toBe(true)
  },
)
it.each([
  'javascript:alert(1)',
  'x><script>alert(1)</script>',
  'x onerror=alert(1)',
  '//example.com/a',
  'data:text/html;base64,YQ==',
])('rejects unsafe banner source %s', (value) => {
  expect(isSafeBannerImage(value)).toBe(false)
})
