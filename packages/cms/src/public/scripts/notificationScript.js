$('#btnEditConfirm').on('click', () => {
  const permanentAlertID = '0'
  const selectedVersions = []
  $('.list-group-item.active').each((item, object) => {
    selectedVersions.push(object.innerHTML)
  })

  const data = {
    message: $('#permAlert0').val(),
    versions: selectedVersions.join(', '), //$('#permAlert0').val(),
    isPermanent: $('#permAlert2').prop('checked'),
    live: $('#permAlert3').prop('checked'),
  }

  if (data.message === '' || data.message.length > 60) {
    $('#error0').show()
    return
  }
  // if the ID is 0 we are creating a new entry
  $.ajax({
    url: '/permanent-alert' + (permanentAlertID === '0' ? '' : '/' + permanentAlertID),
    type: permanentAlertID === '0' ? 'POST' : 'PUT',
    data: data,
    success: result => {
      location.reload()
    },
    error: error => {
      console.log(error)
    },
  })
})

$('.liveCheckbox').on('click', () => {
  var button = $(event.currentTarget) // Button that triggered
  var permanentAlertID = button.data('value') // Extract info from data-* attributes
  changeRelevantPermanentNotification(permanentAlertID, 'live', button.prop('checked'))
})

$('.permanentCheckbox').on('click', () => {
  var button = $(event.currentTarget) // Button that triggered
  var permanentAlertID = button.data('value') // Extract info from data-* attributes
  changeRelevantPermanentNotification(permanentAlertID, 'isPermanent', button.prop('checked'))
})

$('.deletePermanentNotification').on('click', event => {
  var button = $(event.currentTarget) // currentTarget is the outer
  var permanentAlertID = button.data('value') // Extract info from data-* attributes
  var result = confirm('Are you sure? This will permanently delete the item')
  if (result) {
    $.ajax({
      url: '/permanent-alert/' + permanentAlertID,
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

function changeRelevantPermanentNotification(permanentAlertID, key, value) {
  var permanentAlerts = JSON.parse($('#permanentAlertsJSON').text())
  var permanentAlertInfo = permanentAlerts.find(item => {
    return item.id === permanentAlertID
  })
  const data = {
    message: permanentAlertInfo.message,
    versions: permanentAlertInfo.versions,
    isPermanent: key === 'isPermanent' ? value : permanentAlertInfo.isPermanent,
    live: key === 'live' ? value : permanentAlertInfo.live,
  }
  // if the ID is 0 we are creating a new entry
  $.ajax({
    url: '/permanent-alert/' + permanentAlertID,
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
