// Update variable content in Modal when it shows from the edit button
$('#dynamicModal').on('show.bs.modal', event => {
  var button = $(event.relatedTarget) // Button that triggered the modal
  var didyouknowID = button.data('value') // Extract info from data-* attributes
  if (didyouknowID === 0) {
    $('.modal-title').text('Insert New Did You Know')
    $('#col0TableModal').val('')
    $('#col1TableModal').val('')
    $('#itemID').text(0)
    return
  }
  var didYouKnows = JSON.parse($('#didYouKnowsJSON').text())
  var didYouKnowInfo = didYouKnows.find(item => {
    return item.id === didyouknowID
  })

  $('.modal-title').text('Edit Did You Know')
  $('#col0TableModal').val(didYouKnowInfo.title)
  $('#col1TableModal').val(didYouKnowInfo.content)
  $('#itemID').text(didyouknowID)
})

//  and create confirmation
$('#btnEditConfirm').on('click', () => {
  const didyouknowID = $('#itemID').text()

  const data = {
    title: $('#col0TableModal').val(),
    content: $('#col1TableModal').val(),
    isAgeRestricted: false,
    live: false,
  }
  if (data.title === '' || data.title >= 40 || data.content === '' || data.content >= 150) {
    $('#error1').show()
    $('#error2').show()
    return
  }
  // if the ID is 0 we are creating a new entry
  $.ajax({
    url: '/didyouknow' + (didyouknowID === '0' ? '' : '/' + didyouknowID),
    type: didyouknowID === '0' ? 'POST' : 'PUT',
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
  var didyouknowID = button.data('value') // Extract info from data-* attributes
  changeRelevantDidYouKnow(didyouknowID, 'live', button.prop('checked'))
})

$('.ageRestrictionCheckbox').on('click', () => {
  var button = $(event.currentTarget) // Button that triggered the modal
  var didyouknowID = button.data('value') // Extract info from data-* attributes
  changeRelevantDidYouKnow(didyouknowID, 'age', button.prop('checked'))
})

function changeRelevantDidYouKnow(didyouknowID, key, value) {
  var didYouKnows = JSON.parse($('#didYouKnowsJSON').text())
  var didYouKnowInfo = didYouKnows.find(item => {
    return item.id === didyouknowID
  })

  const data = {
    title: didYouKnowInfo.title,
    content: didYouKnowInfo.content,
    isAgeRestricted: key === 'age' ? value : didYouKnowInfo.isAgeRestricted,
    live: key === 'live' ? value : didYouKnowInfo.live,
  }
  // if the ID is 0 we are creating a new entry
  $.ajax({
    url: '/didyouknow/' + didyouknowID,
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

$('.deleteDidYouKnow').on('click', event => {
  var button = $(event.currentTarget) // currentTarget is the outer
  var didyouknowID = button.data('value') // Extract info from data-* attributes
  var result = confirm('Are you sure? This will permanently delete the item')
  if (result) {
    $.ajax({
      url: '/didyouknow/' + didyouknowID,
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

var filterList = $('#didYouKnowContainer')
var items = filterList.children()
var filteredItems = false
var sortAlphabetStatus = false
var sortAgeStatus = false

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

var sortAge = function({ column }) {
  filteredItems = filteredItems ? filteredItems : items
  if (!sortAgeStatus) {
    var sortList = Array.prototype.sort.bind(filteredItems)
    sortList(function(a, b) {
      var aText = a.children[column].firstElementChild.firstElementChild.checked ? 1 : 0
      var bText = b.children[column].firstElementChild.firstElementChild.checked ? 1 : 0
      if (aText < bText) {
        return -1
      }
      if (aText > bText) {
        return 1
      }
      return 0
    })
    sortAgeStatus = true
  } else {
    var sortList = Array.prototype.sort.bind(filteredItems)
    sortList(function(a, b) {
      var aText = a.children[column].firstElementChild.firstElementChild.checked ? 1 : 0
      var bText = b.children[column].firstElementChild.firstElementChild.checked ? 1 : 0
      if (aText > bText) {
        return -1
      }
      if (aText < bText) {
        return 1
      }
      return 0
    })
    sortAgeStatus = false
  }
  filterList.append(filteredItems)
}

$('#didYouKnowTopic').click(() => sortAlphabetically({ column: 0 }))
$('#didYouKnowContent').click(() => sortAlphabetically({ column: 1 }))
$('#ageRestricted').click(() => sortAge({ column: 4 }))

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
