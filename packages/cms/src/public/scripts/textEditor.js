let lastActiveEditorElement = null
let editMode = false
const initialData = JSON.parse($('#data-dump').text())

window.addEventListener('load', () => {
  populateEditor(initialData)
  turnOffEditItems()
})

$('.btnEditMode').on('click', () => {
  editMode = !editMode
  if (!editMode) {
    //@TODO: save and post
    // exportToJSON()
    //set to original Text
    turnOffEditItems()
    submitJson()
  }
  if (editMode) {
    $('.editItems').show()
    $('#cancelButton').show()
    $('.editor-text-box').attr('contentEditable', 'true')
    $('.btnEditMode').html('Save')
  }
})

$('#cancelButton').on('click', () => {
  editMode = !editMode
  // remove and repopulate with the initial
  $('.container-text-block').remove()
  lastActiveEditorElement = null
  populateEditor(initialData)
  turnOffEditItems()
})

function populateEditor(editorData) {
  if (!editorData[editorData.length - 1]) {
    ;[{ type: 'HEADING', content: '' }].map(item => {
      createEditor(item.content, item.type)
    })
  } else {
    var json = JSON.parse(editorData[editorData.length - 1].json_dump)
    json.map(item => {
      createEditor(item.content, item.type)
    })
  }
  document.body.scrollTop = 0
  document.documentElement.scrollTop = 0
}

function createEditor(initialContent, type) {
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- INIT THE EDITOR
  let editor = document.createElement('span')
  editor.className = 'editor-text-box CONTENT'
  editor.setAttribute('role', 'textbox')
  editor.setAttribute('aria-multiline', 'true')
  editor.setAttribute('contentEditable', 'true')

  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- HEADING BUTTON
  const headingButton = document.createElement('button')
  headingButton.className = 'heading-button btn editItems'
  // Make the icon to use as the button
  var headingIcon = document.createElement('i')
  headingIcon.className = 'fas fa-heading icon-sizer-light'
  headingButton.appendChild(headingIcon)
  // Change to heading
  headingButton.onclick = () => {
    if (editor.className == 'editor-text-box CONTENT') {
      editor.className = 'editor-text-box HEADING'
      headingIcon.className = 'fas fa-heading icon-sizer-dark'
    } else {
      editor.className = 'editor-text-box CONTENT'
      headingIcon.className = 'fas fa-heading icon-sizer-light'
    }
  }
  //SET THE STYLING BASED ON THE TYPE OF THE INITIAL STATES
  if (type !== undefined) {
    if (type === 'HEADING') {
      editor.className = 'editor-text-box HEADING'
      headingIcon.className = 'fas fa-heading icon-sizer-dark'
    }
    if (type === 'CONTENT') {
      editor.className = 'editor-text-box CONTENT'
      headingIcon.className = 'fas fa-heading icon-sizer-light'
    }
  }

  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- DELETE BUTTON
  const deleteButton = document.createElement('button')
  deleteButton.className = 'heading-button btn editItems'
  var deleteIcon = document.createElement('i')
  deleteIcon.className = 'fas fa-trash'
  deleteButton.appendChild(deleteIcon)
  deleteButton.onclick = () => {
    deleteRow(editor)
  }
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- ADD BUTTON
  const addButton = document.createElement('button')
  addButton.className = 'heading-button btn editItems'
  var addIcon = document.createElement('i')
  addIcon.className = 'fas fa-plus'
  addButton.appendChild(addIcon)
  addButton.onclick = event => {
    lastActiveEditorElement = event.currentTarget
    addRow(event)
  }

  editor.spellcheck = true
  editor.autocapitalize = 'on'
  editor.textContent = initialContent || ''
  var container = document.createElement('div')
  container.className = 'container-text-block'
  container.appendChild(headingButton)
  container.appendChild(addButton)
  container.appendChild(editor)
  container.appendChild(deleteButton)
  setupHeadingButton(headingButton, editor)
  setupEditor(editor)
  if (lastActiveEditorElement !== null) {
    insertAfter(container, lastActiveEditorElement.parentElement)
  } else {
    document.getElementById('sampleeditor').appendChild(container)
  }
  editor.focus()
}

function insertAfter(newNode, existingNode) {
  existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling)
}

function setupEditor(element) {
  element.addEventListener('focus', function handleFocus() {
    lastActiveEditorElement = element
  })
  element.addEventListener('keydown', function handleKeydown(event) {
    if (event.keyCode === 8 && element.textContent === '') {
      return deleteRow(element)
    }

    if (event.keyCode === 38) {
      lastActiveEditorElement.parentElement.previousSibling.children[2].focus()
    }

    if (event.keyCode === 40) {
      lastActiveEditorElement.parentElement.nextSibling.children[2].focus()
    }

    return true
  })
  element.dispatchEvent(new Event('input'))
}

function exportToJSON() {
  let children = document.getElementById('sampleeditor').children
  let chunk = []
  for (let i = 0; i < children.length; i++) {
    let child = children[i]
    const current = {
      type: `${child.children[2].classList[1]}`,
      content: `${child.children[2].innerHTML}`,
    }
    chunk.push(current)
  }
  console.log('*********')
  console.log(chunk)
}

function deleteRow(element) {
  const prevEditor = element.parentElement.previousElementSibling.querySelector('.editor-text-box')
  if (!prevEditor) {
    return
  }
  prevEditor.focus()
  element.parentElement.remove()
  return true
}

function addRow(event) {
  const children = document.getElementById('sampleeditor').children
  let insertAfterIndex = children.length
  for (let i = 0; i < children.length; i++) {
    if (children[i].children[1] === lastActiveEditorElement) {
      insertAfterIndex = i
    }
  }
  createEditor('', lastActiveEditorElement)
  event.preventDefault()
  return false
}

function setupHeadingButton(element, elementToFocus) {
  element.addEventListener('click', () => {
    elementToFocus.focus()
  })
}

function format(command, value) {
  document.execCommand(command, false, value)
}

function turnOffEditItems() {
  $('.editItems').hide()
  $('#cancelButton').hide()
  $('.editor-text-box').attr('contentEditable', 'false')
  $('.btnEditMode').html('Edit')
}
