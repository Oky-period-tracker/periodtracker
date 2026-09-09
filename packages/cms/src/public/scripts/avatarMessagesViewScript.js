// Update variable content in Modal when it shows from the edit button
$('#dynamicModal').on('show.bs.modal', event => {
  var button = $(event.relatedTarget) // Button that triggered the modal
  var avatarMessageID = button.data('value') // Extract info from data-* attributes
  if (avatarMessageID === 0) {
    $('.modal-title').text('Insert New Avatar Message')
    $('#col0TableModal').val('')
    $('#itemID').text(0)
    return
  }
  var avatarMessages = JSON.parse($('#avatarMessagesJSON').text())
  var avatarMessageInfo = avatarMessages.find(item => {
    return item.id === avatarMessageID
  })

  $('.modal-title').text('Edit Avatar Message')
  $('#col0TableModal').val(avatarMessageInfo.content)
  $('#itemID').text(avatarMessageID)
})

//  and create confirmation
$('#btnEditConfirm').on('click', () => {
  const avatarMessageID = $('#itemID').text()

  const data = {
    content: $('#col0TableModal').val(),
    live: false,
  }
  if (data.content === '' || data.content >= 150) {
    $('#error1').show()
    return
  }
  // if the ID is 0 we are creating a new entry
  $.ajax({
    url: '/avatar-message' + (avatarMessageID === '0' ? '' : '/' + avatarMessageID),
    type: avatarMessageID === '0' ? 'POST' : 'PUT',
    data: data,
    success: result => {
      $('#dynamicModal').modal('hide')
      $('#infoArticleModal').modal('show')
      setTimeout(() => location.reload(), 1500)
    },
    error: error => {
      console.log(error)
    },
  })
})

// ==================== Live check =============================
$('.liveCheckbox').on('click', () => {
  var button = $(event.currentTarget) // Button that triggered the modal
  var avatarMessageID = button.data('value') // Extract info from data-* attributes
  changeRelevantAvatarMessage(avatarMessageID, 'live', button.prop('checked'))
})

function changeRelevantAvatarMessage(avatarMessageID, key, value) {
  var avatarMessages = JSON.parse($('#avatarMessagesJSON').text())
  var avatarMessageInfo = avatarMessages.find(item => {
    return item.id === avatarMessageID
  })

  const data = {
    content: avatarMessageInfo.content,
    live: key === 'live' ? value : avatarMessageInfo.live,
  }
  // if the ID is 0 we are creating a new entry
  $.ajax({
    url: '/avatar-message/' + avatarMessageID,
    type: 'PUT',
    data: data,
    success: result => {
      location.reload()
    },
    error: error => {
      console.log(error)
    },
  })
}

// ==================== Delete =============================

$('.deleteAvatarMessage').on('click', event => {
  var button = $(event.currentTarget) // currentTarget is the outer
  var avatarMessageID = button.data('value') // Extract info from data-* attributes
  var result = confirm('Are you sure? This will permanently delete the item')
  if (result) {
    $.ajax({
      url: '/avatar-message/' + avatarMessageID,
      type: 'DELETE',
      success: result => {
        location.reload()
      },
      error: error => {
        console.log(error)
      },
    })
  }
})

var filterList = $('#avatarMessageContainer')
var items = filterList.children()
var filteredItems = false
var sortAlphabetStatus = false

var sortAlphabetically = function({ column }) {
  filteredItems = filteredItems ? filteredItems : items
  if (!sortAlphabetStatus) {
    var sortList = Array.prototype.sort.bind(filteredItems)

    sortList(function(a, b) {
      var aText = a.children[column].innerHTML
      var bText = b.children[column].innerHTML
      if (aText < bText) {
        return -1
      }
      if (aText > bText) {
        return 1
      }
      return 0
    })
    sortAlphabetStatus = true
  } else {
    var sortList = Array.prototype.sort.bind(filteredItems)
    sortList(function(a, b) {
      var aText = a.children[column].innerHTML
      var bText = b.children[column].innerHTML
      if (aText > bText) {
        return -1
      }
      if (aText < bText) {
        return 1
      }
      return 0
    })
    sortAlphabetStatus = false
  }
  filterList.append(filteredItems)
}

$('#avatarMessageContent').click(() => sortAlphabetically({ column: 0 }))
// =========================================================

function makeUpdateCountdown({ countdownElement, tableElement, maxLength }) {
  function updateCountdown() {
    var remaining = maxLength - tableElement.val().length
    countdownElement.text(remaining + ' characters remaining.')
  }

  $(document).ready(function($) {
    updateCountdown()
    tableElement.change(updateCountdown)
    tableElement.keyup(updateCountdown)
  })
}

$('#countdown1').show()
$('#countdown2').show()

makeUpdateCountdown({
  countdownElement: $('#countdown1'),
  tableElement: $('#col0TableModal'),
  maxLength: 40,
})

makeUpdateCountdown({
  countdownElement: $('#countdown2'),
  tableElement: $('#col1TableModal'),
  maxLength: 150,
})
