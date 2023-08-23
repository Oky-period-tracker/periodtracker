// =============== Modal Population ========================
$('#articleModal').on('show.bs.modal', event => {
  $('#error1').hide()
  $('#error2').hide()
  $('#errorTitle2').hide()
  $('#error3').hide()
  $('#error4').hide()
  var button = $(event.relatedTarget) // Button that triggered the modal
  var articleId = button.data('value') // Extract info from data-* attributes
  if (articleId === 0) {
    $('.modal-title').text('Insert New Article')
    $('#col0TableModal').val('')
    $('#col1TableModal').val('')
    $('#col2TableModal').val('')
    $('#col3TableModal').val('')
    $('#col4TableModal').prop('checked', false)
    $('#itemID').text(0)
    $('#countdown2').text(70 + ' characters remaining.')
    $('#col1TableModal').attr('disabled', true)
    return
  }
  var articles = JSON.parse($('#articlesJSON').text())
  var articleInfo = articles.find(item => {
    return item.id === articleId
  })

  $('.modal-title').text(articleInfo.article_heading)
  $('#col0TableModal').val(articleInfo.category_id)
  $('#col1TableModal').val(articleInfo.subcategory_id)
  $('#col2TableModal').val(articleInfo.article_heading)
  $('#col3TableModal').val(articleInfo.article_text)
  $('#col4TableModal').prop('checked', articleInfo.live)
  $('#itemID').text(articleId)
  $('#countdown2').text(70- articleInfo.article_heading.length + ' characters remaining.')
  handleSubCategorySelect(articleInfo.category_id);
})

$('#categoryModal').on('show.bs.modal', event => {
  var button = $(event.relatedTarget) // Button that triggered the modal
  var categoryId = button.data('value') // Extract info from data-* attributes
  $('#errorCat1').hide()
  $('#errorCat2').hide()
  $('#errorCat3').hide()
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
  $('#colSubcategory1TableModal').val(subcategoryInfo.parent_category)
  $('#itemID').text(subcategoryId)
})

// =============== Modal Confirmation ========================
$('#btnArticleEditConfirm').on('click', () => {
  const articleID = $('#itemID').text()
  const data = {
    category: $('#col0TableModal').val(),
    subcategory: $('#col1TableModal').val(),
    article_heading: $('#col2TableModal').val(),
    article_text: $('#col3TableModal').val(),
    live: $('#col4TableModal').prop('checked'),
  }
  if (
    data.category === '' ||
    data.subcategory === '' ||
    data.article_heading === '' ||
    data.article_heading.length > 70 ||
    data.article_text === ''
  ) {
    $('#error1').show()
    $('#error2').show()
    $('#error3').show()
    $('#error4').show()
    return
  }
  $.ajax({
    url: '/articles' + (articleID === '0' ? '' : '/' + articleID),
    type: articleID === '0' ? 'POST' : 'PUT',
    data: data,
    success: result => {
      if (result.isExist){
        $('#errorTitle2').show();
      } else {
        $('#articleModal').modal('hide')
        $('#infoArticleModal').modal('show')
        setTimeout(() => location.reload(), 1500)
      }
    },
    error: error => {
      console.log(error)
    },
  })
})

$('#btnCategoryConfirm').on('click', () => {
  const categoryId = $('#itemID').text()
  const data = {
    title: $('#colCategory0TableModal').val(),
    primary_emoji_name: $('#colCategory1TableModal').val(),
    primary_emoji: $('#colCategory2TableModal').val(),
  }
  if (data.title === '' || data.primary_emoji === '' || data.secondary_emoji === '') {
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
      location.reload()
    },
    error: error => {
      console.log(error)
    },
  })
})

$('#btnSubcategoryConfirm').on('click', () => {
  const categoryId = $('#itemID').text()
  const data = {
    title: $('#colSubcategory0TableModal').val(),
    parent_category: $('#colSubcategory1TableModal').val(),
  }
  if (data.title === '' || data.parent_category === '') {
    $('#errorSubcat1').show()
    $('#errorSubcat2').show()
    return
  }
  // if the article ID is 0 we are creating a new entry
  $.ajax({
    url: '/subcategories' + (categoryId === '0' ? '' : '/' + categoryId),
    type: categoryId === '0' ? 'POST' : 'PUT',
    data: data,
    success: result => {
      location.reload()
    },
    error: error => {
      console.log(error)
    },
  })
})

// ==================== Live check =============================
$(document).on('click','.liveCheckbox', () => {
  var button = $(event.target) // Button that triggered the modal
  var articleId = button.data('value') // Extract info from data-* attributes
  var articles = JSON.parse($('#articlesJSON').text())
  var articleInfo = articles.find(item => {
    return item.id === articleId
  })
  const data = {
    category: articleInfo.category,
    subcategory: articleInfo.subcategory,
    article_heading: articleInfo.article_heading,
    article_text: articleInfo.article_text,
    live: button.prop('checked'),
  }
  // if the ID is 0 we are creating a new entry
  $.ajax({
    url: '/articles/' + articleId,
    type: 'PUT',
    data: data,
    success: result => {
      location.reload()
    },
    error: error => {
      console.log(error)
    },
  })
})

// ==================== Deletion =============================

$('.deleteArticle').on('click', event => {
  var button = $(event.currentTarget) // currentTarget is the outer
  var articleId = button.data('value') // Extract info from data-* attributes
  var result = confirm('Are you sure? This will permanently delete the item')
  if (result) {
    $.ajax({
      url: '/articles/' + articleId,
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

//===================== Sorting and Filtering =========================

//Sorting

var articleList = $('#articles')
var articles = articleList.children()
var sortStatus = [false, false]
var filteredArticles = false
var sort = function(child) {
  filteredArticles = filteredArticles ? filteredArticles : articles
  if (!sortStatus[child]) {
    var sortList = Array.prototype.sort.bind(filteredArticles)

    sortList(function(a, b) {
      var aText = a.children[child].innerHTML
      var bText = b.children[child].innerHTML
      if (aText < bText) {
        return -1
      }
      if (aText > bText) {
        return 1
      }
      return 0
    })
    sortStatus[child] = true
  } else {
    var sortList = Array.prototype.sort.bind(filteredArticles)
    sortList(function(a, b) {
      var aText = a.children[child].innerHTML
      var bText = b.children[child].innerHTML
      if (aText > bText) {
        return -1
      }
      if (aText < bText) {
        return 1
      }
      return 0
    })
    sortStatus[child] = false
  }
  articleList.append(filteredArticles)
}
//=================== Sorting =====================

var sortDateStatus = false
var filteredItems = false
var sortDate = function({ column }) {
  filteredItems = filteredItems ? filteredItems : articles

  if (!sortDateStatus) {
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
    sortDateStatus = true
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
    sortDateStatus = false
  }
  articleList.append(filteredItems)
}

$('#dateSort').click(() => sortDate({ column: 7 }))
$('#categoryTag').click(() => sort(0))
$('#subCategoryTag').click(() => sort(1))

//Filtering

var filterButton = $('#filterButton')
var filteredArticles = false
filterButton.click(event => {
  event.preventDefault()
  var filterText = $('#filterInput')
    .val()
    .toLowerCase()
    .trim()
  if (filterText == '') {
    articleList.empty().prepend(articles)
    return
  }
  filteredArticles = articles.filter((index, elem) =>
  new Array(articles[0].children.length).fill().some((_, childIndex) => elem.children[childIndex].innerText.toLowerCase().includes(filterText.toLowerCase()))
  )
  articleList.empty().prepend(filteredArticles)
})

$('#clearFilter').click(event => {
  $('#filterInput').val('')
  articleList.empty().prepend(articles)
  filteredArticles = false
})

//Countdown
$('#countdown2').show()

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
  countdownElement: $('#countdown2'),
  tableElement: $('#col2TableModal'),
  maxLength: 70,
})
//control subcategory select
$('#col0TableModal').change(event => {
  $('#col1TableModal').val('');
  var catId = event.target.value;
  handleSubCategorySelect(catId);
})
const handleSubCategorySelect = (catId) => {
  $('#col1TableModal').attr('disabled', false);
  $('#col1TableModal').children().map((_, child) => {
    if (child.dataset.id == catId) $(child).css('display', 'block');
    else $(child).css('display', 'none')
  })
}