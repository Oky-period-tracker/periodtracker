import sanitizeHtml from 'sanitize-html'

export function makeLinksClickable(text) {
  return text.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" target="_blank" style="color: #0056b3">$1</a>',
  )
}

export function cleanHTML(input) {
  const finalInput = `<p style="color: #000; font-weight: 600">${sanitizeHtml(input).replace(
    /\n/g,
    '<br/>',
  )}</p>`
  return makeLinksClickable(finalInput)
}
