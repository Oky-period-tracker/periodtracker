// Update variable content in Modal when it shows from the edit button
$('#dynamicModal').on('show.bs.modal', event => {
  var button = $(event.relatedTarget) // Button that triggered the modal
  var helpCenterID = button.data('value') // Extract info from data-* attributes
  if (helpCenterID === 0) {
    $('.modal-title').text('Insert Help Center')
    $('#col0TableModal').val('')
    $('#col1TableModal').val('')
    $('#col2TableModal').val('')
    $('#col3TableModal').val('')
    $('#col4TableModal').val('')
    $('#col5TableModal').val('')
    $('#itemID').text(0)
    return
  }
  var helpCenters = JSON.parse($('#helpCentersJSON').text())
  var helpCenterInfo = helpCenters.find(item => {
    return item.id === helpCenterID
  })

  $('.modal-title').text('Edit Help Center')
  $('#col0TableModal').val(helpCenterInfo.title)
  $('#col1TableModal').val(helpCenterInfo.caption)
  $('#col2TableModal').val(helpCenterInfo.contactOne)
  $('#col3TableModal').val(helpCenterInfo.contactTwo)
  $('#col4TableModal').val(helpCenterInfo.address)
  $('#col5TableModal').val(helpCenterInfo.website)
  $('#itemID').text(helpCenterID)
})

//  and create confirmation
$('#btnEditConfirm').on('click', () => {
  const helpCenterID = $('#itemID').text()
  const data = {
    title: $('#col0TableModal').val(),
    caption: $('#col1TableModal').val(),
    contactOne: $('#col2TableModal').val(),
    contactTwo: $('#col3TableModal').val(),
    address: $('#col4TableModal').val(),
    website: $('#col5TableModal').val(),
  }
  // if the ID is 0 we are creating a new entry
  $.ajax({
    url: '/help-center' + (helpCenterID === '0' ? '' : '/' + helpCenterID),
    type: helpCenterID === '0' ? 'POST' : 'PUT',
    data: data,
    success: result => {
      location.reload()
    },
    error: error => {
      console.log(error)
    },
  })
})

// ==================== Delete =============================

$('.deleteHelpCenter').on('click', event => {
  var button = $(event.currentTarget) // currentTarget is the outer
  var helpCenterID = button.data('value') // Extract info from data-* attributes
  var result = confirm('Are you sure? This will permanently delete the item')
  if (result) {
    $.ajax({
      url: '/help-center/' + helpCenterID,
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
