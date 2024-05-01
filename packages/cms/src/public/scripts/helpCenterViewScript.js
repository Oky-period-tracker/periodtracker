$(document).ready(() => {
  'use strict'
  // GET help centers
  $.ajax({
    url: '/help-center',
    type: 'GET',
    success: (result) => {
      initializeDataTable(result)
    },
    error: (error) => {
      console.log(error)
    },
  })

  // GET help center attributes
  prepareAttributes()

  var locations = JSON.parse($('#locationsJSON').text())

  locations.sort(function (a, b) {
    return a.name < b.name ? -1 : a.name > b.name ? 1 : 0
  })
  $.each(locations, function (i, location) {
    $('#locationDropdown').append($('<option />').val(location.name).text(location.name))
    if (!$('#locationDropdown').find(':selected').val()) {
      $('#placeDropdown').attr('disabled', true)
    }
  })

  // prepare form validator
  window.addEventListener(
    'load',
    function prepareFormValidation() {
      const forms = document.getElementsByClassName('help-center-needs-validation')
      $.fn.applyFormValidation(forms)
    },
    false,
  )

  // prepare form state
  if ($('.website-input-group').length <= 1) {
    $('.delete-button').attr('style', 'display: none')
  }

  $('#rowReorderModal').modal({
    show: false,
    backdrop: 'static',
    keyboard: false,
  })

  $('#isAvailableNationwide').on('change', (e) => {
    if (e.target.checked) {
      $('#locationDropdown').attr('disabled', true)
      $('#locationDropdown').val(null)
      $('#placeDropdown').attr('disabled', true)
      $('#placeDropdown').val(null)
    } else {
      $('#locationDropdown').removeAttr('disabled')
    }
  })
})

$('#locationDropdown').on('change', (e, params) => {
  $('#placeDropdown').attr('disabled', true)
  $('#placeDropdown').empty()

  var locations = JSON.parse($('#locationsJSON').text())

  const selected = $('#locationDropdown').find(':selected').val()

  if (selected) {
    const location = locations.find((item) => item.name === selected)

    if (!location) {
      return
    }

    location.places.sort(function (a, b) {
      return a.name < b.name ? -1 : a.name > b.name ? 1 : 0
    })
    $.each(location.places, function (i, place) {
      $('#placeDropdown').append($(`<option id=${place.name}/>`).val(place.name).text(place.name))
      if (params) {
        if (params.placeCode === place.name) {
          $(`#${place.name}`).attr('selected', true)
        }
      }
    })
    $('#placeDropdown').attr('disabled', false)
  }
})

$('#add-website-btn').on('click', () => {
  $('#website-input-group').clone().find('input').val('').end().appendTo($('#website-section'))
  if ($('.website-input-group').length > 1) {
    $('.delete-button').removeAttr('style')
  }
})

$('#downloadTemplate').on('click', () => {
  $.ajax({
    url: `/help-center-template`,
    type: 'GET',
    xhrFields: {
      responseType: 'blob',
    },
    success: (data) => {
      const a = document.createElement('a')
      const url = window.URL.createObjectURL(data)
      a.href = url
      a.download = `help_centers_${new Date().toISOString().slice(0, 10)}.xlsx`
      a.click()
      window.URL.revokeObjectURL(url)
    },
    error: (error) => {
      console.log(error)
    },
  })
})

$('#help-center-form').on('submit', (event) => {
  event.preventDefault()
  // merge same keys
  const output = $('#help-center-form')
    .serializeArray()
    .reduce(function (acc, cur) {
      const existing = acc.find(function (item) {
        return item.name === cur.name
      })
      if (!existing) {
        acc.push({
          name: cur.name,
          value: cur.value,
        })
      } else {
        if (!Array.isArray(existing.value)) {
          existing.value = [existing.value]
        }
        existing.value.push(cur.value)
      }
      return acc
    }, [])

  const helpCenter = output.find((element) => element.name === 'helpCenterId')

  const payload = {
    url: Number(helpCenter.value) ? `/help-center/${helpCenter.value}` : '/help-center',
    type: Number(helpCenter.value) ? 'PUT' : 'POST',
    data: output,
  }

  let locationPlace = { location: '', place: '' }
  let isAvailableNationwide = false
  let isAttribExist = false
  let helpCenterError = ''

  output.forEach((o) => {
    const { name, value } = o
    if (
      (name === 'title' && !value) ||
      (name === 'caption' && !value) ||
      (name === 'contactOne' && !value) ||
      // (name === 'address' && !value) ||
      (name === 'primaryAttribute' && !value)
    ) {
      helpCenterError = `Please enter a ${name}`
    }

    if (name === 'isAvailableNationwide') {
      isAvailableNationwide = true
    }

    if (name === 'primaryAttribute') {
      isAttribExist = true
    }

    if (name === 'location') {
      locationPlace.location = value
    }

    if (name === 'place') {
      locationPlace.place = value
    }
  })

  // if (!isAvailableNationwide) {
  //   if (!locationPlace.location || !locationPlace.place) {
  //     helpCenterError = `Please select a location & place, or select available nationwide`
  //   }
  // }

  if (!isAttribExist) {
    helpCenterError = 'Please select a primary attribute'
  }

  if (helpCenterError) {
    $('#helpCenterModalError').text(helpCenterError)
    return
  }

  $.ajax({
    ...payload,
    success: (result) => {
      location.reload()
    },
    error: (error) => {
      $('#helpCenterModalError').text(error)
      console.log(error)
    },
  })
})

$('#saveHelpCenterSpreadsheet').on('click', () => {
  $('#requiredExcel').attr('hidden')
  const uploadedFile = $('#helpCenterSpreadsheet').prop('files')
  if (!uploadedFile.length) {
    $('#requiredExcel').removeAttr('hidden')
  }

  const formData = new FormData()
  formData.append('file', uploadedFile[0])

  $.ajax({
    url: '/help-center-template',
    type: 'POST',
    data: formData,
    processData: false,
    contentType: false,
    success: function (response) {
      if (response.error) {
        alert(
          'Invalid excel data values, please check contents and make sure the fields are correct 😊',
        )
        return
      }
      location.reload()
    },
    error: function (xhr, status, error) {
      alert('Upload error:', error)
    },
  })
})

$('#helpCenterSpreadsheet,#closeSaveHelpCenterSpreadsheet').on('click', () =>
  $('#requiredExcel').attr('hidden', true),
)

// functions
var rowReorderResult = null
const initializeDataTable = (result) => {
  // Setup - add a text input to each footer cell
  const columns = [
    { data: 'sortingKey' },
    { data: 'title' },
    { data: 'caption' },
    { data: 'contactOne' },
    { data: 'contactTwo' },
    { data: 'address' },
    { data: 'location' },
    { data: 'place' },
    { data: 'website' },
  ]
  $('#helpCenterTable thead tr').clone(true).addClass('filters').appendTo('#helpCenterTable thead')

  const table = $('#helpCenterTable').DataTable({
    columns,
    data: result,
    orderCellsTop: true,
    fixedHeader: true,
    autoWidth: false,
    rowReorder: {
      dataSrc: 'sortingKey',
    },

    initComplete: function () {
      var api = this.api()
      // For each column
      api
        .columns()
        .eq(0)
        .each(function (colIdx) {
          // Set the header cell to contain the input element
          var cell = $('.filters th').eq($(api.column(colIdx).header()).index())

          const colName = api.column(colIdx).header().getAttribute('aria-label')
          if ($(api.column(colIdx).header()).index() >= 0 && colName !== 'Order') {
            $(cell).html(`<input type="text" id="helpCenters_filter_${colIdx}"/>`)
          }

          // On every keypress in this input
          $('input', $('.filters th').eq($(api.column(colIdx).header()).index()))
            .off('keyup change')
            .on('change', function (e) {
              saveFilter(colIdx, $(this).val(), 'helpCenters')
              // Get the search value
              $(this).attr('title', $(this).val())
              var regexr = '({search})' //$(this).parents('th').find('select').val();

              // Search the column for that value
              api
                .column(colIdx)
                .search(
                  this.value != '' ? regexr.replace('{search}', '(((' + this.value + ')))') : '',
                  this.value != '',
                  this.value == '',
                )
                .draw()
            })
            .on('keyup', function (e) {
              e.stopPropagation()

              $(this).trigger('change')
              $(this).focus()[0]
            })
        })
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
        targets: 9, //column number in array
        searchable: false,
        render: (data, type, row) => {
          return `
          <div class="d-flex">
              <button
                type="button"
                class="btn btn-sm"
                onclick="prepareEdit(${row.id})"
              >
                <i class="fas fa-edit" aria-hidden="true"></i>
              </button>
              <button type="button" class="btn btn-sm deleteArticle" onclick="deleteHelpCenter(${row.id})">
                <i class="fas fa-trash" aria-hidden="true"></i>
              </button>
          </div>
        `
        },
      },
      {
        targets: 10, //column number in array
        searchable: false,
        render: (data, type, row) => {
          return `
          <label class="switch">
            <input onchange="toggleLive(${row.id}, ${
            row.isActive
          })" class='liveCheckbox' type="checkbox" ${row.isActive ? 'checked' : ''}/>
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
          ${diff[i].newData} 
        </span>
        <span class="text-warning"> 
          (was ${diff[i].oldData})
        </span>
        <br />
        `
    }
    rowReorderResult = diff.map((d) => d.toUpdate)
    $('#rowReorderModal').modal({ show: true })
    $('#rowReorderConfirmationBody').html(result)
  })
  // loadFilters('helpCenters')
}

const deleteWebsite = (action) => {
  action.parent().parent().remove()
  if ($('.website-input-group').length <= 1) {
    $('.delete-button').attr('style', 'display: none')
  }
}

const toggleLive = (id, isActive) => {
  $.ajax({
    url: `/help-center/${id}`,
    type: 'PUT',
    data: { isActive: isActive ? false : true, toggleOnly: 1 },
    success: (result) => {
      location.reload()
    },
    error: (error) => {
      console.log(error)
    },
  })
}

const deleteHelpCenter = (id) => {
  //temp
  const isDelete = window.confirm('Are you sure?')

  if (isDelete) {
    $.ajax({
      url: `/help-center/${id}`,
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

const prepareEdit = (id) => {
  $.ajax({
    url: `/help-center/${id}`,
    type: 'GET',
    success: async (result) => {
      $('#formhelpCenterId').val(id)
      $('#placeDropdown').attr('disabled', false)
      $('#helpCenterModal').modal({ show: true })
      for (key in result) {
        if (key !== 'website' && key !== 'otherAttributes' && key !== 'primaryAttributeId') {
          $(`[name='${key}']`).val(result[key])
        }

        if (key === 'isAvailableNationwide' && result[key]) {
          $('#isAvailableNationwide').attr('checked', true)
        }

        if (key == 'primaryAttributeId') {
          $(`#primary-attribute-select`).val(result[key])
        }

        if (key == 'isActive') {
          $('#isActive').attr('checked', !!result[key])
        }

        if (key == 'website') {
          const website = result.website.split(',')
          let toAppend = `            
            <div class="row mt-2 website-input-group" id="website-input-group">
              <div class="col-md-10">
                <input type="text" class="no-validate" class="website" aria-describedby="emailHelp" name="website" value="__REPLACE__">
              </div>
              <div class="col-md-2">
                <button class="btn btn-danger text-white delete-button" type="button" onclick="deleteWebsite($(this))"><i class="fa-solid fa-trash"></i></button>
              </div>
            </div>
          `
          $('.web-container').html(``)
          website.forEach((website) => {
            $('.web-container').append(toAppend.replace('__REPLACE__', website))
          })
          if (website.length > 1) {
            $('.delete-button').removeAttr('style')
          }
        }

        if (key == 'otherAttributes') {
          if (result[key]) {
            const attributeIds = result[key].split(',')
            attributeIds.forEach((id) => {
              $(`:checkbox[value=${id}]`).prop('checked', true)
            })
          }
        }

        if (key === 'location') {
          $('#locationDropdown').trigger('change', { placeCode: result['place'] })
        }
      }
    },
    error: (error) => {
      console.log(error)
    },
  })
}

// store original modal form values
$('#helpCenterModal').on('hidden.bs.modal', function () {
  $('#formhelpCenterId').val('0')
  const keys = [
    'address',
    'caption',
    'place',
    'contactOne',
    'contactTwo',
    'id',
    'isAvailableNationwide',
    'title',
    'location',
    'otherAttributes',
  ]

  keys.forEach((key) => {
    $(`[name='${key}']`).val('')
    if (key === 'place') {
      $(`#placeDropdown`).empty()
      $(`#placeDropdown`).append('<option selected disabled>N/A</option>')
    }
    if (key === 'otherAttributes') {
      $('#other-attributes-container').html('')
      prepareAttributes()
    }
  })
  $(`[name='primaryAttrubute']`).val(0)
  $('.website-root').html(`
    <div id="website-section">
      <label for="website" class="form-label">Website</label>
      <div class="row mt-2 website-input-group" id="website-input-group">
        <div class="col-md-10">
          <input type="text" class="no-validate" class="website" aria-describedby="emailHelp" name="website">
        </div>
        <div class="col-md-2">
          <button class="btn btn-danger text-white delete-button" type="button" onclick="deleteWebsite($(this))"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
    </div>
    <button type="button" class="btn btn-info text-white mt-2" style="text-decoration: none;" id="add-website-btn">
      <i class="bi bi-plus"></i>Add Website
    </button>
  `)
})

const prepareAttributes = () => {
  const attributes = JSON.parse($('#attributesJSON').text())

  const primaryAttributeDropdown = $('#primary-attribute-select')
  const otherAttributesContainer = $('#other-attributes-container')
  $.each(attributes, (key, attribute) => {
    primaryAttributeDropdown.append(
      $('<option></option>')
        .attr('value', attribute.id)
        .attr('required', true)
        .text(attribute.attributeName),
    )

    otherAttributesContainer.append(
      ` <div class="col-md-6">
                  <div class="mb-3 form-check">
                    <input 
                      name="otherAttributes"
                      type="checkbox" 
                      class="form-check-input other-attributes" 
                      value="${attribute.id}"
                      id="${attribute.attributeName}"
                    />
                    <label class="mb-0" for="${attribute.attributeName}">${attribute.attributeName}</label>
                  </div>
                </div>`,
    )
  })
}

const saveReorder = (isSave) => {
  if (!isSave) {
    location.reload()
  }

  $.ajax({
    url: '/help-center',
    type: 'PUT',
    data: { rowReorderResult },
    success: (result) => {
      location.reload()
    },
    error: (error) => {
      console.log(error)
    },
  })
}
