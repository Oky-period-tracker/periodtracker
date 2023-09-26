$('#videoModal').on('show.bs.modal', (event) => {
  $('#errorVideo1').hide()
  $('#errorVideo2').hide()
  $('#errorVideo3').hide()
  $('#errorVideo4').hide()
  var button = $(event.relatedTarget) // Button that triggered the modal
  var videoId = button.data('value') // Extract info from data-* attributes
  if (videoId === 0) {
    $('.modal-title').text('Insert new video')
    $('#colVideo0TableModal').val('')
    $('#colVideo1TableModal').val('')
    $('#colVideo2TableModal').val('')
    $('#colVideo3TableModal').val('')
    $('#colVideo4TableModal').prop('checked', false)
    $('#videoID').text(0)
    $('#countdown').text(40 + ' characters remaining.')
    $('#col1TableModal').attr('disabled', true)
    return
  }
  var videos = JSON.parse($('#videosJSON').text())
  var videoInfo = videos.find((item) => {
    return item.id === videoId
  })

  $('.modal-title').text(videoInfo.title)
  $('#colVideo0TableModal').val(videoInfo.title)
  $('#colVideo1TableModal').val(videoInfo.parent_category)
  $('#colVideo2TableModal').val(videoInfo.youtubeId)
  $('#colVideo3TableModal').val(videoInfo.assetName)
  $('#colVideo4TableModal').prop('checked', videoInfo.live)
  $('#videoID').text(videoId)
  $('#countdown').text(40 - videoInfo.title.length + ' characters remaining.')
  // handleSubCategorySelect(videoInfo.category_id)
})

$('#btnVideoConfirm').on('click', () => {
  console.log('*** A')
  const videoID = $('#videoID').text()
  const data = {
    title: $('#colVideo0TableModal').val(),
    parent_category: $('#colVideo1TableModal').val(),
    youtubeId: $('#colVideo2TableModal').val(),
    assetName: $('#colVideo3TableModal').val(),
    live: $('#colVideo4TableModal').prop('checked'),
  }
  console.log('*** B', data)

  if (
    data.title === '' ||
    data.title.length > 40 ||
    data.parent_category === '' ||
    (data.youtubeId === '' && data.assetName === '')
  ) {
    console.log('*** ERROR')

    $('#errorVideo1').show()
    $('#errorVideo2').show()
    $('#errorVideo3').show()
    $('#errorVideo4').show()
    return
  }
  console.log('*** C')

  $.ajax({
    url: '/videos' + (videoID === '0' ? '' : '/' + videoID),
    type: videoID === '0' ? 'POST' : 'PUT',
    data: data,
    success: (result) => {
      console.log('*** SUCCESS')

      if (result.isExist) {
        $('#errorTitle2').show()
      } else {
        $('#videoModal').modal('hide')
        // $('#infoArticleModal').modal('show')
        setTimeout(() => location.reload(), 1500)
      }
    },
    error: (error) => {
      console.log('***', error)
    },
  })

  console.log('*** Done')
})

$('.deleteVideo').on('click', (event) => {
  var button = $(event.currentTarget) // currentTarget is the outer
  var Id = button.data('value') // Extract info from data-* attributes
  var result = confirm('Are you sure? This will permanently delete the item')
  if (result) {
    $.ajax({
      url: '/videos/' + Id,
      type: 'DELETE',
      success: (result) => {
        location.reload()
      },
      error: (error) => {
        console.log(error)
      },
    })
  }
})
