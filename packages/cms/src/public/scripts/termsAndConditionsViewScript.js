function submitJson() {
  let children = document.getElementById('sampleeditor').children
  let chunk = []
  for (let i = 0; i < children.length; i++) {
    let child = children[i]
    const plainTextFromChildren = Array.from(child.children[2].childNodes)
      .map(node => node.textContent)
      .join('\n')

    const current = {
      type: `${child.children[2].classList[1]}`,
      content: `${plainTextFromChildren}`,
    }
    chunk.push(current)
  }
  const time = new Date()
  console.log(chunk)

  const stringifiedChunk = JSON.stringify(chunk)
  const data = {
    json_dump: stringifiedChunk,
    timestamp: time.toISOString(),
  }

  // if the ID is 0 we are creating a new entry

  $.ajax({
    url: '/terms-and-conditions',
    type: 'POST',
    data: data,
    success: result => {
      location.reload()
    },
    error: error => {
      console.log(error)
    },
  })
}
