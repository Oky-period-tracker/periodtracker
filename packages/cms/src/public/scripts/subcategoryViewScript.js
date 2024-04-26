// =============== Modal Population ========================
$('#articleModal').on('show.bs.modal', (event) => {
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
  var articleInfo = articles.find((item) => {
    return item.id === articleId
  })

  $('.modal-title').text(articleInfo.article_heading)
  $('#col0TableModal').val(articleInfo.category_id)
  $('#col1TableModal').val(articleInfo.subcategory_id)
  $('#col2TableModal').val(articleInfo.article_heading)
  $('#col3TableModal').val(articleInfo.article_text)
  $('#col4TableModal').prop('checked', articleInfo.live)
  $('#itemID').text(articleId)
  $('#countdown2').text(70 - articleInfo.article_heading.length + ' characters remaining.')
  handleSubCategorySelect(articleInfo.category_id)
})

$('#categoryModal').on('show.bs.modal', (event) => {
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
  var categoryInfo = categories.find((item) => {
    return item.id === categoryId
  })

  $('.modal-title').text(categoryInfo.title)
  $('#colCategory0TableModal').val(categoryInfo.title)
  $('#colCategory1TableModal').val(categoryInfo.primary_emoji_name)
  $('#colCategory2TableModal').val(categoryInfo.primary_emoji)
  $('#itemID').text(categoryId)
})

$('#subcategoryModal').on('show.bs.modal', (event) => {
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
  var subcategoryInfo = subcategories.find((item) => {
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
    !data.category ||
    !data.subcategory ||
    !data.article_heading ||
    data.article_heading.length > 70 ||
    !data.article_text
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
    success: (result) => {
      if (result.isExist) {
        $('#errorTitle2').show()
      } else {
        $('#articleModal').modal('hide')
        $('#infoArticleModal').modal('show')
        setTimeout(() => location.reload(), 1500)
      }
    },
    error: (error) => {
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
    success: (result) => {
      location.reload()
    },
    error: (error) => {
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
    success: (result) => {
      location.reload()
    },
    error: (error) => {
      console.log(error)
    },
  })
})

// ==================== Live check =============================
$(document).on('click', '.liveCheckbox', () => {
  var button = $(event.target) // Button that triggered the modal
  var articleId = button.data('value') // Extract info from data-* attributes
  var articles = JSON.parse($('#articlesJSON').text())
  var articleInfo = articles.find((item) => {
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
    success: (result) => {
      location.reload()
    },
    error: (error) => {
      console.log(error)
    },
  })
})

// ==================== Deletion =============================
function deleteArticle(id) {
  var result = confirm('Are you sure? This will permanently delete the item')
  if (result) {
    $.ajax({
      url: '/articles/' + id,
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

//===================== Sorting and Filtering =========================

//Sorting

var articleList = $('#articles')
var articles = articleList.children()
var sortStatus = [false, false]
var filteredArticles = false
var sort = function (child) {
  filteredArticles = filteredArticles ? filteredArticles : articles
  if (!sortStatus[child]) {
    var sortList = Array.prototype.sort.bind(filteredArticles)

    sortList(function (a, b) {
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
    sortList(function (a, b) {
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

$('#categoryTag').click(() => sort(0))
$('#subCategoryTag').click(() => sort(1))

//Filtering

var filterButton = $('#filterButton')
var filteredArticles = false
filterButton.click((event) => {
  event.preventDefault()
  var filterText = $('#filterInput').val().toLowerCase().trim()
  if (filterText == '') {
    articleList.empty().prepend(articles)
    return
  }
  filteredArticles = articles.filter((index, elem) =>
    new Array(articles[0].children.length)
      .fill()
      .some((_, childIndex) =>
        elem.children[childIndex].innerText.toLowerCase().includes(filterText.toLowerCase()),
      ),
  )
  articleList.empty().prepend(filteredArticles)
})

$('#clearFilter').click((event) => {
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

  $(document).ready(function ($) {
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
$('#col0TableModal').change((event) => {
  $('#col1TableModal').val('')
  var catId = event.target.value
  handleSubCategorySelect(catId)
})
const handleSubCategorySelect = (catId) => {
  $('#col1TableModal').attr('disabled', false)
  $('#col1TableModal')
    .children()
    .map((_, child) => {
      if (child.dataset.id == catId) $(child).css('display', 'block')
      else $(child).css('display', 'none')
    })
}

$(document).ready(() => {
  const articles = $('#articlesJSON').html()
  const categories = $('#categoriesJSON').html()
  const subCategories = $('#subcategoriesJSON').html()

  const data = {
    articles,
    categories,
    subCategories,
  }

  initializeDataTable(data)
})

var rowReorderResult = null
const initializeDataTable = (result) => {
  const { articles, categories, subCategories } = result

  const data = JSON.parse(articles).map((article, articleKey) => {
    JSON.parse(categories).forEach((category) => {
      if (article.category_id === category.id) {
        articles[articleKey].categoryPayload = category
      }
    })

    JSON.parse(subCategories).forEach((subCategory) => {
      if (article.subcategory === subCategory.id) {
        articles[articleKey].subcategoryPayload = subCategory
      }
    })

    return article
  })

  const columns = [
    {
      data: 'sortingKey',
      render: (_, __, ___, meta) => {
        return meta.row + 1
      },
    },
    {
      data: 'categoryTag',
      render: (_, __, rowPayload) => {
        return `
          <a href="/categories-management/${rowPayload.category_id}">
            ${rowPayload.category_title}
          </a>
          `
      },
    },
    {
      data: 'subcategoryTag',
      render: (_, __, rowPayload) => {
        return rowPayload.subcategory_title
      },
    },
    { data: 'article_heading' },
    {
      data: 'article_text',
      render: (_, __, rowPayload) => {
        let text = rowPayload.article_text
        if (text.length > 140) {
          text = text.substring(0, 140) + '...'
        }
        return makeLinksClickable(text)
      },
    },
    {
      data: 'date_created', // Assuming 'article_date' is the key in your data
      render: function (_, __, rowPayload) {
        return new Date(rowPayload.date_created).toLocaleDateString() // Formatting the date
      },
    },
    {
      data: 'voiceOverKey',
      render: (_, __, rowPayload) => {
        return `
          <td
            class="voice-over-column"
            data-source="article"
            data-id="${rowPayload.id}"
            data-json="${JSON.stringify(rowPayload)}"
          >
            <input type="file" id="upload-${rowPayload.id}"/>
          </td>
        `
      },
      createdCell: (td, cellData, rowData, row, col) => {
        $(td).attr('class', 'voice-over-column')
        $(td).attr('data-source', 'article')
        $(td).attr('data-id', rowData.id)
        $(td).attr('data-json', JSON.stringify(rowData))
        $(td).attr('id', `article-${rowData.id}`)
        $(td)[0].firstElementChild.setAttribute('id', `upload-${rowData.id}`)
      },
    },
  ]

  $('#articleTable thead tr').clone(true).addClass('filters').appendTo('#articleTable thead')

  // remove spaces
  $('.filters th').html('')

  const table = $('#articleTable').DataTable({
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

      initializeVoiceOver(articles)
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
                class="btn btn-sm"
                data-toggle="modal"
                data-target="#articleModal"
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
              <button type="button" onclick="deleteArticle('${row.id}')" class="btn btn-sm">
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
          ${edit.triggerRow.data().sortingKey} - ${edit.triggerRow.data().article_heading} 
          </span>
        <br />`

    for (var i = 0, ien = diff.length; i < ien; i++) {
      var rowData = table.row(diff[i].node).data()
      diff[i].toUpdate = rowData
      result += `
          <span class="text-success">
            ${rowData.article_heading} 
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
    $('#rowReorderModal').modal({ show: true })
    $('#rowReorderConfirmationBody').html(result)
  })
}

const saveReorder = (isSave) => {
  if (!isSave) {
    location.reload()
  }

  $.ajax({
    url: '/articles',
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

function makeLinksClickable(text) {
  return text.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" target="_blank" style="color: #0056b3">$1</a>',
  )
}
