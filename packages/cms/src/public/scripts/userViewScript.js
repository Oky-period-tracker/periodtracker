// Update variable content in Modal when it shows from the edit button
$('#dynamicModal').on('show.bs.modal', event => {
  $('#errorCat409').hide()
  var button = $(event.relatedTarget) // Button that triggered the modal
  var userId = button.data('value') // Extract info from data-* attributes
  if (userId === 0) {
    $('#col1TableEntry').show()
    $('#col1TableHeading').show()
    $('.modal-title').text('Add a New User')
    $('#col0TableModal').val('')
    $('#col1TableModal').val('')
    $('#col2TableModal').val('')
    $('#col3TableModal').val('')
    $('#itemID').text(0)
    return
  }
  var users = JSON.parse($('#usersJSON').text())
  var userInfo = users.find(item => {
    return item.id === userId
  })
  $('.modal-title').text(userInfo.username)
  $('#col0TableModal').val(userInfo.username)
  $('#col1TableEntry').hide()
  $('#col1TableHeading').hide()
  $('#col2TableModal').val(userInfo.type)
  $('#itemID').text(userId)
})

//  and create confirmation
$('#btnEditConfirm').on('click', () => {
  const userID = $('#itemID').text()
  const data = {
    username: $('#col0TableModal').val(),
    password: $('#col1TableModal').val(),
    type: $('#col2TableModal').val(),
    lang: 'en',
  }
  // if the article ID is 0 we are creating a new entry
  $.ajax({
    url: '/user' + (userID === '0' ? '' : '/' + userID),
    type: userID === '0' ? 'POST' : 'PUT',
    data: data,
    success: result => {
      location.reload()
    },
    error: error => {
      console.log(error)
      $('#errorCat409').show()
    },
  })
})

$('.deleteUser').on('click', event => {
  var button = $(event.currentTarget)
  var userID = button.data('value')
  var result = confirm('Are you sure? This will permanently delete the item')
  if (result) {
    $.ajax({
      url: '/user/' + userID,
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

//=================== Sorting =====================

var userList = $('#users')
var users = userList.children()
var sortStatus = false
var filteredItems = false
var sort = function({ column }) {
  filteredItems = filteredItems ? filteredItems : users
  if (!sortStatus) {
    var sortList = Array.prototype.sort.bind(filteredItems)

    sortList(function(a, b) {
      var aText = new Date(a.children[column].innerHTML)
      var bText = new Date(b.children[column].innerHTML)
      if (aText < bText) {
        return -1
      }
      if (aText > bText) {
        return 1
      }
      return 0
    })
    sortStatus = true
  } else {
    var sortList = Array.prototype.sort.bind(filteredItems)
    sortList(function(a, b) {
      var aText = new Date(a.children[column].innerHTML)
      var bText = new Date(b.children[column].innerHTML)
      if (aText > bText) {
        return -1
      }
      if (aText < bText) {
        return 1
      }
      return 0
    })
    sortStatus = false
  }
  userList.append(filteredItems)
}

$('.pointer').click(() => sort({ column: 3 }))

//Filtering

$('#clearFilter').click(event => {
  $('#filterInput').val('')
  userList.empty().prepend(users)
  filteredItems = false
})
