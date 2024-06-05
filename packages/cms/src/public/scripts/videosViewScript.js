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
  $('#colVideo2TableModal').val(videoInfo.youtubeId)
  $('#colVideo3TableModal').val(videoInfo.assetName)
  $('#colVideo4TableModal').prop('checked', videoInfo.live)
  $('#videoID').text(videoId)
  $('#countdown').text(40 - videoInfo.title.length + ' characters remaining.')
})

$('#btnVideoConfirm').on('click', () => {
  const videoID = $('#videoID').text()
  const data = {
    title: $('#colVideo0TableModal').val(),
    youtubeId: $('#colVideo2TableModal').val(),
    assetName: $('#colVideo3TableModal').val(),
    live: $('#colVideo4TableModal').prop('checked'),
  }

  if (
    data.title === '' ||
    data.title.length > 40 ||
    (data.youtubeId === '' && data.assetName === '')
  ) {
    console.log('*** ERROR')

    $('#errorVideo1').show()
    $('#errorVideo2').show()
    $('#errorVideo3').show()
    $('#errorVideo4').show()
    return
  }

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
})

// ==================== Deletion =============================
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

// ==================== Live check =============================
$(document).on('click', '.liveCheckbox', () => {
  var button = $(event.target) // Button that triggered the modal
  var videoId = button.data('value') // Extract info from data-* attributes
  var videos = JSON.parse($('#videosJSON').text())
  var videoInfo = videos.find((item) => {
    return item.id === videoId
  })

  const data = {
    title: videoInfo.title,
    youtubeId: videoInfo.youtubeId,
    assetName: videoInfo.title,
    live: button.prop('checked'),
  }

  // if the ID is 0 we are creating a new entry
  $.ajax({
    url: '/videos/' + videoId,
    type: 'PUT',
    data: data,
    success: (result) => {
      location.reload()
    },
    error: (error) => {
      console.log(error)
    },
  })
})

// ==================== Deletion =============================
function deleteVideo(id) {
  var result = confirm('Are you sure? This will permanently delete the item')
  if (result) {
    $.ajax({
      url: '/videos/' + id,
      type: 'DELETE',
      success: (result) => {
        location.reload()
      },
      error: (error) => {
        console.log(error)
      },
    })
  }
}

// ==================== Sorting ==================== //

$(document).ready(() => {
  const videos = JSON.parse($('#videosJSON').html())
  initializeVideoDataTable(videos)
})

var rowReorderResult = null

const initializeVideoDataTable = (data) => {
  const columns = [
    {
      data: 'sortingKey',
      render: (_, __, ___, meta) => {
        return meta.row + 1
      },
    },
    {
      data: 'title',
      render: (_, __, rowPayload) => {
        return rowPayload.title
      },
    },
    {
      data: 'youtubeId',
      render: (_, __, rowPayload) => {
        if (!!rowPayload.youtubeId) {
          return `
          <td><a href="https://www.youtube.com/watch?v=${rowPayload.youtubeId}" target="_blank" style="color:#007bff;">${rowPayload.youtubeId}</a></td>
          `
        }
        return `<td>-</td>`
      },
    },
    {
      data: 'assetName',
      render: (rowPayload) => {
        return rowPayload?.assetName ? rowPayload.assetName : '-'
      },
    },
  ]

  const table = $('#videoTable').DataTable({
    columns,
    data,
    orderCellsTop: true,
    fixedHeader: true,
    autoWidth: false,
    rowReorder: {
      dataSrc: 'sortingKey',
    },
    lengthMenu: [25, 50, 75, 100, 200],
    initComplete: function () {
      var api = this.api()

      api.columns().eq(0)
    },
    columnDefs: [
      {
        orderable: false,
        searchable: false,
        sortable: false,
        className: 'reorder',
        targets: 0,
      },
      {
        targets: columns.length, //column number in array
        searchable: false,
        render: (_, __, row) => {
          return `
            <button
              type="button"
              class="btn"
              data-toggle="modal"
              data-target="#videoModal"
              data-value="${row.id}"
            >
              <i class="fas fa-edit" aria-hidden="true"></i>
            </button>
         `
        },
      },
      {
        targets: columns.length + 1, //column number in array
        searchable: false,
        render: (_, __, row) => {
          return `
          <button
          type="button" onclick="deleteVideo('${row.id}')" class="btn btn-sm"
          >
            <i class="fas fa-trash" aria-hidden="true"></i>
          </button>
         `
        },
      },
      {
        targets: columns.length + 2, //column number in array
        searchable: false,
        render: (_, __, row) => {
          return `
             <label class="switch">
               <input data-value="${row.id}" class='liveCheckbox' type="checkbox" ${
            row.live ? 'checked' : ''
          }/>
               <span class="slider round"></span>
             </label>
           `
        },
      },
    ],
  })

  table.on('row-reorder', function (e, diff, edit) {
    let result = `
      Reorder started on row: 
        <span class="text-warning">
        ${edit.triggerRow.data().sortingKey} - ${edit.triggerRow.data().title} 
        </span>
      <br />`

    for (var i = 0, ien = diff.length; i < ien; i++) {
      var rowData = table.row(diff[i].node).data()
      diff[i].toUpdate = rowData
      result += `
        <span class="text-success">
          ${rowData.title} 
        </span>
        updated to be in position
        <span class="text-success"> 
          ${diff[i].newPosition + 1} 
        </span>
        <span class="text-warning"> 
          (was ${diff[i].oldPosition + 1})
        </span>
        <br />
        `
    }
    rowReorderResult = diff.map((d) => d.toUpdate)
    $('#videoRowReorderModal').modal({ show: true })
    $('#videoRowReorderConfirmationBody').html(result)
  })
}

const saveVideoReorder = (isSave) => {
  if (!isSave) {
    location.reload()
  }

  $.ajax({
    url: '/videos',
    type: 'PUT',
    data: { rowReorderResult: rowReorderResult },
    success: (result) => {
      location.reload()
    },
    error: (error) => {
      console.log(error)
    },
  })
}
