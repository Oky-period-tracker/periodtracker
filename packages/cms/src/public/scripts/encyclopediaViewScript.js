// =============== Modal Population ========================
$('#articleModal').on('show.bs.modal', (event) => {
  console.log('[Modal] Opening article modal')
  $('#error1').hide()
  $('#error2').hide()
  $('#errorTitle2').hide()
  $('#error3').hide()
  $('#error4').hide()
  var button = $(event.relatedTarget) // Button that triggered the modal
  var articleId = button.data('value') // Extract info from data-* attributes
  console.log('[Modal] Article ID:', articleId)
  
  if (articleId === 0) {
    console.log('[Modal] Creating new article - resetting fields')
    $('.modal-title').text('Insert New Article')
    $('#col0TableModal').val('')
    $('#col1TableModal').val('')
    $('#col2TableModal').val('')
    $('#col3TableModal').val('')
    $('#contentFilterDropdownForm').val('0')
    $('#ageRestrictionLevelForm').val('0')
    $('#col4TableModal').prop('checked', true) // Default to Live = true for new articles
    $('#itemID').text(0)
    $('#countdown2').text(70 + ' characters remaining.')
    $('#col1TableModal').attr('disabled', true)
    
    // Reset province fields for new articles
    $('#provinceRestricted').prop('checked', false)
    $('#countrySelector').hide()
    $('#provinceSelector').hide()
    $('#allowedCountriesSelect').val([])
    $('#allowedProvincesSelect').val([])
    console.log('[Modal] Province fields reset for new article - Live defaults to true')
    return
  }
  
  var articles = JSON.parse($('#articlesJSON').text())
  var articleInfo = articles.find((item) => {
    return item.id === articleId
  })
  console.log('[Modal] Loading article:', articleInfo)

  $('.modal-title').text(articleInfo.article_heading)
  $('#col0TableModal').val(articleInfo.category_id)
  $('#col1TableModal').val(articleInfo.subcategory_id)
  $('#col2TableModal').val(articleInfo.article_heading)
  $('#col3TableModal').val(articleInfo.article_text)
  $('#contentFilterDropdownForm').val(articleInfo.contentFilter)
  $('#ageRestrictionLevelForm').val(articleInfo.ageRestrictionLevel)
  $('#col4TableModal').prop('checked', articleInfo.live)
  $('#itemID').text(articleId)
  $('#countdown2').text(70 - articleInfo.article_heading.length + ' characters remaining.')
  handleSubCategorySelect(articleInfo.category_id)
  
  // Load province restriction data
  console.log('[Modal] Province restricted:', articleInfo.provinceRestricted)
  console.log('[Modal] Allowed provinces:', articleInfo.allowedProvinces)
  
  if (articleInfo.provinceRestricted) {
    // Enable restriction checkbox
    $('#provinceRestricted').prop('checked', true)
    $('#countrySelector').show()
    
    // Parse allowed provinces (stored as comma-separated string)
    let allowedProvinces = []
    if (articleInfo.allowedProvinces) {
      allowedProvinces = articleInfo.allowedProvinces
        .split(',')
        .map(p => p.trim())
        .filter(p => p.length > 0)
    }
    console.log('[Modal] Parsed allowed provinces:', allowedProvinces)
    
    if (allowedProvinces.length > 0) {
      // Determine which countries are needed based on selected provinces
      const selectedCountries = new Set()
      $('#allowedProvincesSelect option').each(function() {
        const uid = $(this).val().toString()
        if (allowedProvinces.includes(uid)) {
          selectedCountries.add($(this).data('country'))
        }
      })
      console.log('[Modal] Selected countries:', Array.from(selectedCountries))
      
      // Select the countries
      $('#allowedCountriesSelect').val(Array.from(selectedCountries))
      
      // Trigger country change to filter provinces
      $('#allowedCountriesSelect').trigger('change')
      
      // Select the provinces (after filter is applied)
      setTimeout(() => {
        $('#allowedProvincesSelect').val(allowedProvinces)
        console.log('[Modal] Provinces selected:', allowedProvinces)
      }, 50)
    }
  } else {
    // Reset for non-restricted articles
    $('#provinceRestricted').prop('checked', false)
    $('#countrySelector').hide()
    $('#provinceSelector').hide()
    $('#allowedCountriesSelect').val([])
    $('#allowedProvincesSelect').val([])
    console.log('[Modal] Article not province-restricted - fields reset')
  }
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
  console.log('[Submit] Article confirmation button clicked')
  const articleID = $('#itemID').text()
  const provinceRestricted = $('#provinceRestricted').is(':checked')
  const allowedProvincesArray = $('#allowedProvincesSelect').val() || []
  const data = {
    category: $('#col0TableModal').val() || '',
    subcategory: $('#col1TableModal').val() || '',
    article_heading: $('#col2TableModal').val() || '',
    article_text: $('#col3TableModal').val() || '',
    live: $('#col4TableModal').prop('checked'),
    contentFilter: $('#contentFilterDropdownForm').val() || '0',
    ageRestrictionLevel: $('#ageRestrictionLevelForm').val() || '0',
    provinceRestricted: provinceRestricted,
    allowedProvinces: (provinceRestricted && allowedProvincesArray.length > 0) 
      ? allowedProvincesArray 
      : null,
  }
  console.log('[Submit] Article ID:', articleID)
  console.log('[Submit] Form data:', data)
  console.log('[Submit] Province restricted:', data.provinceRestricted)
  console.log('[Submit] Allowed provinces:', data.allowedProvinces)
  
  if (
    !data.category ||
    !data.subcategory ||
    !data.article_heading ||
    data.article_heading.length > 70 ||
    !data.article_text
  ) {
    console.log('[Submit] Validation failed - showing errors')
    console.log('[Submit] Category:', data.category, 'Subcategory:', data.subcategory)
    $('#error1').show()
    $('#error2').show()
    $('#error3').show()
    $('#error4').show()
    return
  }
  
  const url = '/articles' + (articleID === '0' ? '' : '/' + articleID)
  const method = articleID === '0' ? 'POST' : 'PUT'
  console.log('[Submit] Submitting to:', url, 'Method:', method)
  
  $.ajax({
    url: url,
    type: method,
    data: data,
    success: (result) => {
      console.log('[Submit] Success response:', result)
      if (result.isExist) {
        console.log('[Submit] Article title already exists')
        $('#errorTitle2').show()
      } else {
        console.log('[Submit] Article saved successfully, reloading page')
        $('#articleModal').modal('hide')
        $('#infoArticleModal').modal('show')
        setTimeout(() => location.reload(), 1500)
      }
    },
    error: (error) => {
      console.error('[Submit] Error occurred:', error)
      console.error('[Submit] Error details:', error.responseText)
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
  const subcategoryId = $('#itemID').text()
  const data = {
    title: $('#colSubcategory0TableModal').val(),
    parent_category: $('#colSubcategory1TableModal').val(),
  }
  if (data.title === '' || data.parent_category === '') {
    $('#errorSubcat1').show()
    $('#errorSubcat2').show()
    return
  }
  // if the subcategory ID is 0 we are creating a new entry
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

// ==================== Live check =============================
$(document).on('click', '.liveCheckbox', () => {
  var button = $(event.target) // Button that triggered the modal
  var articleId = button.data('value') // Extract info from data-* attributes
  var articles = JSON.parse($('#articlesJSON').text())
  var articleInfo = articles.find((item) => {
    return item.id === articleId
  })
  const data = {
    category: articleInfo.category_id || articleInfo.category,
    subcategory: articleInfo.subcategory_id || articleInfo.subcategory,
    article_heading: articleInfo.article_heading,
    article_text: articleInfo.article_text,
    live: button.prop('checked'),
    contentFilter: articleInfo.contentFilter || '0',
    ageRestrictionLevel: articleInfo.ageRestrictionLevel || '0',
    provinceRestricted: articleInfo.provinceRestricted || false,
    allowedProvinces: articleInfo.allowedProvinces || null,
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
      console.error('[Live Toggle] Error:', error)
      console.error('[Live Toggle] Error details:', error.responseText)
      alert('Failed to update article. Check console for details.')
    },
  })
})

// ==================== Deletion =============================

$('.deleteArticle').on('click', (event) => {
  var button = $(event.currentTarget) // currentTarget is the outer
  var articleId = button.data('value') // Extract info from data-* attributes
  var result = confirm('Are you sure? This will permanently delete the item')
  if (result) {
    $.ajax({
      url: '/articles/' + articleId,
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
var sortDate = function ({ column }) {
  filteredItems = filteredItems ? filteredItems : articles

  if (!sortDateStatus) {
    var sortList = Array.prototype.sort.bind(filteredItems)
    sortList(function (a, b) {
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
    sortList(function (a, b) {
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

var articlesJSON = $('#articlesJSON').text()
initializeVoiceOver(articlesJSON)

//===================== Province Restriction Logic =========================

// Toggle country and province selectors visibility
$('#provinceRestricted').on('change', function() {
  console.log('[Province] Restriction checkbox changed:', $(this).prop('checked'))
  const isRestricted = $(this).prop('checked')
  $('#countrySelector').toggle(isRestricted)
  if (isRestricted) {
    // Show province selector if countries are already selected
    const selectedCountries = $('#allowedCountriesSelect').val()
    $('#provinceSelector').toggle(selectedCountries && selectedCountries.length > 0)
  } else {
    $('#provinceSelector').hide()
  }
})

// Filter provinces based on selected countries
$('#allowedCountriesSelect').on('change', function() {
  const selectedCountries = $(this).val() || []
  console.log('[Province] Countries selected:', selectedCountries)
  const provinceSelect = $('#allowedProvincesSelect')
  
  if (selectedCountries.length === 0) {
    // Hide province selector if no countries selected
    $('#provinceSelector').hide()
    provinceSelect.val([])
    console.log('[Province] No countries selected, hiding province selector')
    return
  }
  
  // Show province selector
  $('#provinceSelector').show()
  console.log('[Province] Showing province selector')
  
  // Filter province options
  provinceSelect.find('option').each(function() {
    const provinceCountry = $(this).data('country')
    if (selectedCountries.includes(provinceCountry)) {
      $(this).show()
    } else {
      $(this).hide()
      // Deselect if hidden
      if ($(this).prop('selected')) {
        $(this).prop('selected', false)
      }
    }
  })
  
  console.log('[Province] Provinces filtered by countries')
})
