$('#subcategoryModal').on('show.bs.modal', (event) => {
  var button = $(event.relatedTarget) // Button that triggered the modal
  var subcategoryId = button.data('value') // Extract info from data-* attributes
  $('#errorSubcat1').hide()
  $('#errorSubcat2').hide()
  $('#errorSubcatUniq1').hide()
  if (subcategoryId === 0) {
    $('.modal-title').text('Insert New Sub Category')
    $('#colSubcategory0TableModal').val('')
    $('#colSubcategory1TableModal').val('')
    $('#itemID').text(0)
    return
  }
  var subcategories = JSON.parse($('#subcategoriesJSON').text())
  var subcategoryInfo = subcategories.find((item) => {
    return item.id === subcategoryId
  })

  $('.modal-title').text(subcategoryInfo.title)
  $('#colSubcategory0TableModal').val(subcategoryInfo.title)
  $('#colSubcategory1TableModal').val(subcategoryInfo.parent_category_id)
  $('#itemID').text(subcategoryId)
})

$('#btnSubcategoryConfirm').on('click', () => {
  const subcategoryId = $('#itemID').text()
  const data = {
    title: $('#colSubcategory0TableModal').val(),
    parent_category: $('#colSubcategory1TableModal').val(),
  }
  if (data.title === '' || data.title.length >= 40 || data.parent_category === '') {
    $('#errorSubcat1').show()
    $('#errorSubcat2').show()
    return
  }
  // if the article ID is 0 we are creating a new entry
  $.ajax({
    url: '/subcategories' + (subcategoryId === '0' ? '' : '/' + subcategoryId),
    type: subcategoryId === '0' ? 'POST' : 'PUT',
    data: data,
    success: (result) => {
      if (result.duplicate) {
        $('#errorSubcatUniq1').css('display', 'block')
        return false
      }
      location.reload()
    },
    error: (error) => {
      console.log(error)
    },
  })
})

function deleteSubcategory(subcategoryId) {
  var result = confirm('Are you sure? This will permanently delete the item')
  if (result) {
    $.ajax({
      url: '/subcategories/' + subcategoryId,
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

function makeUpdateCountdown({ countdownElement, tableElement, maxLength }) {
  function updateCountdown() {
    var remaining = maxLength - tableElement.val().length
    countdownElement.text(remaining + ' characters remaining.')
  }

  $(document).ready(function ($) {
    updateCountdown()
    tableElement.change(updateCountdown)
    tableElement.keyup(updateCountdown)
  })
}

makeUpdateCountdown({
  countdownElement: $('#countdown3'),
  tableElement: $('#colSubcategory0TableModal'),
  maxLength: 40,
})

$(document).ready(() => {
  const subCategories = JSON.parse($('#subcategoriesJSON').html())
  initializeSubcategoriesDataTable(subCategories)
})

var subcategoryRowReorderResult = null

const initializeSubcategoriesDataTable = (data) => {
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
        return `
          <a href="/subcategories-management/${rowPayload.id}">
            ${rowPayload.title}
          </a>`
      },
    },
    {
      data: 'parent_category',
      render: (_, __, rowPayload) => {
        return rowPayload.parent_category
      },
    },
  ]

  const table = $('#subcategoryTable').DataTable({
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
              data-target="#subcategoryModal"
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
          type="button" onclick="deleteSubcategory('${row.id}')" class="btn btn-sm"
          >
            <i class="fas fa-trash" aria-hidden="true"></i>
          </button>
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
    subcategoryRowReorderResult = diff.map((d) => d.toUpdate)
    $('#subcategoryRowReorderModal').modal({ show: true })
    $('#subcategoryRowReorderConfirmationBody').html(result)
  })
}

const saveSubcategoryReorder = (isSave) => {
  if (!isSave) {
    location.reload()
  }

  $.ajax({
    url: '/subcategories',
    type: 'PUT',
    data: { rowReorderResult: subcategoryRowReorderResult },
    success: (result) => {
      location.reload()
    },
    error: (error) => {
      console.log(error)
    },
  })
}
