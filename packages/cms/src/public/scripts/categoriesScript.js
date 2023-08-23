$('#categoryModal').on('show.bs.modal', event => {
  var button = $(event.relatedTarget) // Button that triggered the modal
  var categoryId = button.data('value') // Extract info from data-* attributes
  $('#errorCat1').hide()
  $('#errorCat2').hide()
  $('#errorCat3').hide()
  $('#errorCatuniq1, #errorCatuniq2, #errorCatuniq3').hide()
  if (categoryId === 0) {
    $('.modal-title').text('Insert New Category')
    $('#colCategory0TableModal').val('')
    $('#colCategory1TableModal').val('')
    $('#colCategory2TableModal').val('')
    $('#itemID').text(0)
    return
  }
  var categories = JSON.parse($('#categoriesJSON').text())
  var categoryInfo = categories.find(item => {
    return item.id === categoryId
  })

  $('.modal-title').text(categoryInfo.title)
  $('#colCategory0TableModal').val(categoryInfo.title)
  $('#colCategory1TableModal').val(categoryInfo.primary_emoji_name)
  $('#colCategory2TableModal').val(categoryInfo.primary_emoji)
  $('#itemID').text(categoryId)
})

$('#subcategoryModal').on('show.bs.modal', event => {
  var button = $(event.relatedTarget) // Button that triggered the modal
  var subcategoryId = button.data('value') // Extract info from data-* attributes
  $('#errorSubcat1').hide()
  $('#errorSubcat2').hide()
  $('#errorSubcatUniq1').hide();
  if (subcategoryId === 0) {
    $('.modal-title').text('Insert New Sub Category')
    $('#colSubcategory0TableModal').val('')
    $('#colSubcategory1TableModal').val('')
    $('#itemID').text(0)
    return
  }
  var subcategories = JSON.parse($('#subcategoriesJSON').text())
  var subcategoryInfo = subcategories.find(item => {
    return item.id === subcategoryId
  })

  $('.modal-title').text(subcategoryInfo.title)
  $('#colSubcategory0TableModal').val(subcategoryInfo.title)
  $('#colSubcategory1TableModal').val(subcategoryInfo.parent_category_id)
  $('#itemID').text(subcategoryId)
})

$('#btnCategoryConfirm').on('click', () => {
  const categoryId = $('#itemID').text()
  const data = {
    title: $('#colCategory0TableModal').val(),
    primary_emoji_name: $('#colCategory1TableModal').val(),
    primary_emoji: $('#colCategory2TableModal').val(),
  }
  if (
    data.title === '' ||
    data.title.length > 35 ||
    data.primary_emoji === '' ||
    data.primary_emoji_name === '' ||
    data.primary_emoji_name.length > 25
  ) {
    $('#errorCat1').show()
    $('#errorCat2').show()
    $('#errorCat3').show()
    return
  }
  // if the article ID is 0 we are creating a new entry
  $.ajax({
    url: '/categories' + (categoryId === '0' ? '' : '/' + categoryId),
    type: categoryId === '0' ? 'POST' : 'PUT',
    data: data,
    success: result => {
      if (result.duplicate){
        if (result.category.title == result.body.title) $('#errorCatuniq1').css('display', 'block');
        if (result.category.primary_emoji_name == result.body.primary_emoji_name) $('#errorCatuniq2').css('display', 'block');
        if (result.category.primary_emoji == result.body.primary_emoji) $('#errorCatuniq3').css('display', 'block');
        return false
      }
      location.reload()
    },
    error: error => {
      console.log(error)
    },
  })
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
    success: result => {
      if (result.duplicate){
        $('#errorSubcatUniq1').css('display', 'block');
        return false
      }
      location.reload()
    },
    error: error => {
      console.log(error)
    },
  })
})

$('.deleteCategory').on('click', event => {
  var button = $(event.currentTarget) // currentTarget is the outer
  var categoryId = button.data('value') // Extract info from data-* attributes
  var result = confirm('Are you sure? This will permanently delete the item')
  if (result) {
    $.ajax({
      url: '/categories/' + categoryId,
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

$('.deleteSubcategory').on('click', event => {
  var button = $(event.currentTarget) // currentTarget is the outer
  var subcategoryId = button.data('value') // Extract info from data-* attributes
  var result = confirm('Are you sure? This will permanently delete the item')
  if (result) {
    $.ajax({
      url: '/subcategories/' + subcategoryId,
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

makeUpdateCountdown({
  countdownElement: $('#countdown1'),
  tableElement: $('#colCategory0TableModal'),
  maxLength: 35,
})

makeUpdateCountdown({
  countdownElement: $('#countdown2'),
  tableElement: $('#colCategory1TableModal'),
  maxLength: 25,
})

makeUpdateCountdown({
  countdownElement: $('#countdown3'),
  tableElement: $('#colSubcategory0TableModal'),
  maxLength: 40,
})
