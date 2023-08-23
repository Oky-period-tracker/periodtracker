const reader = new FileReader()
$(document).ready(() => {
  $('.tooltip').hide()
})

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
    url: '/about',
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

$('#aboutBannerContainer').on('click', () => {
  if (!editMode) return
  $('#file-input')[0].click()
})

$('.btnEditMode').on('click', () => {
  if (!editMode) {
    $('#aboutBanner').removeClass('pressable')
  }
  if (editMode) {
    $('#aboutBanner').addClass('pressable')
  }
})

$('#cancelButton').on('click', () => {
  $('#aboutBanner').removeClass('pressable')
})

function readURL(input) {
  if (input.files && input.files[0]) {
    reader.onload = function(e) {
      $('#aboutBanner').attr('src', e.target.result)
      const image = e.target.result // base64 image
      const time = new Date()
      const data = {
        image,
        timestamp: time.toISOString(),
      }

      $.ajax({
        url: '/about-banner-management',
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

    reader.readAsDataURL(input.files[0])
  }
}

$('#file-input').change(function() {
  readURL(this)
})
