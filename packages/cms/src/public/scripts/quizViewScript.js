var chartOne
var chartTwo

$('#dynamicModal').on('show.bs.modal', event => {
  var button = $(event.relatedTarget) // Button that triggered the modal
  var quizId = button.data('value') // Extract info from data-* attributes
  $('#error1').hide()
  $('#error2').hide()
  $('#error3').hide()
  $('#error4').hide()
  $('#error5').hide()
  $('#error6').hide()
  $('#error7').hide()
  $('#error8').hide()
  if (quizId === 0) {
    $('.modal-title').text('Insert New Quiz')
    $('#col0TableModal').val('')
    $('#col1TableModal').val('')
    $('#col2TableModal').val('')
    $('#col3TableModal').val('')
    $('#col4TableModal').val('')
    $('#col5TableModal').val('')
    $('#col6TableModal').val('')
    $('#col7TableModal').val('')
    $('#col8TableModal').prop('checked', false)
    $('#itemID').text(0)
    return
  }
  var quizzes = JSON.parse($('#quizzesJSON').text())
  var quizInfo = quizzes.find(item => {
    return item.id === quizId
  })

  $('.modal-title').text(quizInfo.topic)
  $('#col0TableModal').val(quizInfo.topic)
  $('#col1TableModal').val(quizInfo.question)
  $('#col2TableModal').val(quizInfo.option1)
  $('#col3TableModal').val(quizInfo.option2)
  $('#col4TableModal').val(quizInfo.option3)
  $('#col5TableModal').val(quizInfo.right_answer)
  $('#col6TableModal').val(quizInfo.wrong_answer_response)
  $('#col7TableModal').val(quizInfo.right_answer_response)
  $('#col8TableModal').prop('checked', quizInfo.isAgeRestricted)
  $('#col9TableModal').prop('checked', quizInfo.live)
  $('#itemID').text(quizId)
})

$('#btnEditConfirm').on('click', () => {
  const quizID = $('#itemID').text()
  const data = {
    topic: $('#col0TableModal').val(),
    question: $('#col1TableModal').val(),
    option1: $('#col2TableModal').val(),
    option2: $('#col3TableModal').val(),
    option3: $('#col4TableModal').val(),
    right_answer: $('#col5TableModal').val(),
    wrong_answer_response: $('#col6TableModal').val(),
    right_answer_response: $('#col7TableModal').val(),
    isAgeRestricted: $('#col8TableModal').prop('checked'),
    live: $('#col9TableModal').prop('checked'),
  }
  if (
    data.topic === '' ||
    data.question === '' ||
    data.question.length > 65 ||
    data.option1 === '' ||
    data.option1.length > 20 ||
    data.option2 === '' ||
    data.option2.length > 20 ||
    data.option3 === '' ||
    data.option3.length > 20 ||
    data.right_answer === '' ||
    data.wrong_answer_response === '' ||
    data.wrong_answer_response.length > 160 ||
    data.right_answer_response === '' ||
    data.right_answer_response.length > 160
  ) {
    $('#error1').show()
    $('#error2').show()
    $('#error3').show()
    $('#error4').show()
    $('#error5').show()
    $('#error6').show()
    $('#error7').show()
    $('#error8').show()
    return
  }

  // if the ID is 0 we are creating a new entry
  $.ajax({
    url: '/quiz' + (quizID === '0' ? '' : '/' + quizID),
    type: quizID === '0' ? 'POST' : 'PUT',
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
  var quizId = button.data('value') // Extract info from data-* attributes
  changeRelevantQuiz(quizId, 'live', button.prop('checked'))
})

$('.ageRestrictionCheckbox').on('click', () => {
  var button = $(event.currentTarget) // Button that triggered
  var quizId = button.data('value') // Extract info from data-* attributes
  changeRelevantQuiz(quizId, 'age', button.prop('checked'))
})

function changeRelevantQuiz(quizId, key, value) {
  var quizzes = JSON.parse($('#quizzesJSON').text())
  var quizInfo = quizzes.find(item => {
    return item.id === quizId
  })
  const data = {
    topic: quizInfo.topic,
    question: quizInfo.question,
    option1: quizInfo.option1,
    option2: quizInfo.option2,
    option3: quizInfo.option3,
    right_answer: quizInfo.right_answer,
    wrong_answer_response: quizInfo.wrong_answer_response,
    right_answer_response: quizInfo.right_answer_response,
    isAgeRestricted: key === 'age' ? value : quizInfo.isAgeRestricted,
    live: key === 'live' ? value : quizInfo.live,
  }
  // if the ID is 0 we are creating a new entry
  $.ajax({
    url: '/quiz/' + quizId,
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

$('#graphModal').on('show.bs.modal', event => {
  var button = $(event.relatedTarget) // Button that triggered the modal
  var answeredQuizzes = JSON.parse($('#answeredQuizzesJSON').text())
  var quizID = button.data('value') // Extract info from data-* attributes
  var quizAnswered = answeredQuizzes.find(item => {
    return item.id === quizID
  })
  if (!quizAnswered) {
    renderPieChart({ 'No Data': 1 }, 'chart1Div', false)
    renderPieChart({ 'No Data': 1 }, 'chart2Div', true)
    return
  }
  renderPieChart(
    { Correct: quizAnswered.total_correct, Incorrect: quizAnswered.total_incorrect },
    'chart1Div',
    false,
  )
  renderPieChart(
    {
      'Option 1': quizAnswered.total_option1,
      'Option 2': quizAnswered.total_option2,
      'Option 3': quizAnswered.total_option3,
    },
    'chart2Div',
    true,
  )
})

$('#graphModal').on('hide.bs.modal', event => {
  !!chartOne ? chartOne.dispose() : null
  !!chartTwo ? chartTwo.dispose() : null
})

$('.deleteQuiz').on('click', event => {
  var button = $(event.currentTarget) // currentTarget is the outer
  var quizId = button.data('value') // Extract info from data-* attributes
  var result = confirm('Are you sure? This will permanently delete the item')
  if (result) {
    $.ajax({
      url: '/quiz/' + quizId,
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

$('#downloadCSV').on('click', () => {
  var answeredQuizzes = JSON.parse($('#answeredQuizzesJSON').text())
  var quizzes = JSON.parse($('#quizzesJSON').text())
  var relevantQuiz = ''
  var rows = []
  answeredQuizzes.forEach((item, index) => {
    relevantQuiz = quizzes.find(innerItem => {
      return innerItem.id === item.id
    })
    if (!relevantQuiz) return
    rows.push([
      relevantQuiz.question,
      'Total Correct',
      'Total Incorrect',
      'Total Option 1',
      'Total Option 2',
      'Total Option 3',
    ])
    rows.push([
      '',
      item.total_correct,
      item.total_incorrect,
      item.total_option1,
      item.total_option2,
      item.total_option3,
    ])
  })
  exportToCsv('Quiz Analytics', rows)
})

exportToCsv = (filename, rows) => {
  var processRow = function(row) {
    var finalVal = ''
    for (var j = 0; j < row.length; j++) {
      var innerValue = row[j] === null ? '' : row[j].toString()
      if (row[j] instanceof Date) {
        innerValue = row[j].toLocaleString()
      }
      var result = innerValue.replace(/"/g, '""')
      if (result.search(/("|,|\n)/g) >= 0) result = '"' + result + '"'
      if (j > 0) finalVal += ','
      finalVal += result
    }
    return finalVal + '\n'
  }

  var csvFile = ''
  for (var i = 0; i < rows.length; i++) {
    csvFile += processRow(rows[i])
  }

  var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' })
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, filename)
  } else {
    var link = document.createElement('a')
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}

renderPieChart = (data, location, toggles) => {
  // Set theme
  am4core.useTheme(am4themes_animated)
  chartRef = am4core.create(location, am4charts.PieChart3D)
  chartRef.innerRadius = am4core.percent(30)
  chartRef.legend = new am4charts.Legend()
  chartRef.legend.position = 'left'
  chartRef.legend.valign = 'middle'
  if (toggles) {
    chartTwo = chartRef
  }
  if (!toggles) {
    chartOne = chartRef
  }

  chartRef.data = Object.keys(data).map((key, index) => {
    return {
      answer: key,
      amount: parseInt(data[key]),
    }
  })

  var pieSeries = chartRef.series.push(new am4charts.PieSeries3D())
  pieSeries.dataFields.value = 'amount'
  pieSeries.dataFields.category = 'answer'
  pieSeries.slices.template.stroke = am4core.color('#fff')
  pieSeries.slices.template.strokeWidth = 2
  pieSeries.slices.template.strokeOpacity = 1
  pieSeries.labels.template.disabled = true
  pieSeries.ticks.template.disabled = true
  chartRef.numberFormatter.numberFormat = '#.'
  pieSeries.legendSettings.labelText = '[bold {color}]{name}[/]'
  var label = pieSeries.createChild(am4core.Label)
  label.text = 'Total: [bold {color}]{values.value.sum}[/]'
  label.isMeasured = false
  label.fontSize = 16
  label.x = -30
  label.y = -15
  pieSeries.legendSettings.valueText = '{value.value} '
  pieSeries.slices.template.states.getKey('hover').properties.shiftRadius = 0
  pieSeries.slices.template.states.getKey('hover').properties.scale = 1.1
}

//================= Filtering =======================

var filterButton = $('#filterButton')
var filterList = $('#quizzesContainer')
var items = filterList.children()

filterButton.click(e => {
  e.preventDefault()
  var filterText = $('#filterInput')
    .val()
    .toLowerCase()
    .trim()
  var filtered = items.filter((index, elem) =>
    elem.children[0].innerText.toLowerCase().includes(filterText),
  )
  filterList.empty().prepend(filtered)
})

$('#clearFilter').click(e => {
  $('#filterInput').val('')
  filterList.empty().prepend(items)
})

//================= Sorting =======================================

var sortDateStatus = false
var sortAlphabetStatus = false
var sortAgeStatus = false
var filteredItems = false

var sortAge = function({ column }) {
  filteredItems = filteredItems ? filteredItems : items
  if (!sortAgeStatus) {
    var sortList = Array.prototype.sort.bind(filteredItems)
    sortList(function(a, b) {
      var aText = a.children[column].firstElementChild.firstElementChild.checked ? 1 : 0
      var bText = b.children[column].firstElementChild.firstElementChild.checked ? 1 : 0
      if (aText < bText) {
        return -1
      }
      if (aText > bText) {
        return 1
      }
      return 0
    })
    sortAgeStatus = true
  } else {
    var sortList = Array.prototype.sort.bind(filteredItems)
    sortList(function(a, b) {
      var aText = a.children[column].firstElementChild.firstElementChild.checked ? 1 : 0
      var bText = b.children[column].firstElementChild.firstElementChild.checked ? 1 : 0
      if (aText > bText) {
        return -1
      }
      if (aText < bText) {
        return 1
      }
      return 0
    })
    sortAgeStatus = false
  }
  filterList.append(filteredItems)
}

var sortDate = function({ column }) {
  filteredItems = filteredItems ? filteredItems : items

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
  filterList.append(filteredItems)
}

var sortAlphabetically = function({ column }) {
  filteredItems = filteredItems ? filteredItems : items
  if (!sortAlphabetStatus) {
    var sortList = Array.prototype.sort.bind(filteredItems)

    sortList(function(a, b) {
      var aText = a.children[column].innerHTML
      var bText = b.children[column].innerHTML
      if (aText < bText) {
        return -1
      }
      if (aText > bText) {
        return 1
      }
      return 0
    })
    sortAlphabetStatus = true
  } else {
    var sortList = Array.prototype.sort.bind(filteredItems)
    sortList(function(a, b) {
      var aText = a.children[column].innerHTML
      var bText = b.children[column].innerHTML
      if (aText > bText) {
        return -1
      }
      if (aText < bText) {
        return 1
      }
      return 0
    })
    sortAlphabetStatus = false
  }
  filterList.append(filteredItems)
}
$('#dateSort').click(() => sortDate({ column: 13 }))
$('#ageRestricted').click(() => sortAge({ column: 11 }))
$('#quizTopic').click(() => sortAlphabetically({ column: 0 }))
$('#quizQuestion').click(() => sortAlphabetically({ column: 1 }))

//==================== Live All Button =============================

var liveAllCheckbox = $('.liveAllCheckbox')
var isAllLive = true

items.map((index, elem) => {
  if (!elem.children[12].firstElementChild.firstElementChild.checked) {
    isAllLive = false
  }
})
liveAllCheckbox.prop('checked', isAllLive)

$('.liveAllCheckbox').on('click', () => {
  var checkBoxVal = liveAllCheckbox.prop('checked')
  if (!checkBoxVal) {
    $('.liveCheckbox:checked').trigger('click')
  } else {
    $('.liveCheckbox:not(:checked)').trigger('click')
  }
})

//==================== Countdown logic =============================
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
  tableElement: $('#col1TableModal'),
  maxLength: 65,
})

makeUpdateCountdown({
  countdownElement: $('#countdown2'),
  tableElement: $('#col2TableModal'),
  maxLength: 20,
})
makeUpdateCountdown({
  countdownElement: $('#countdown3'),
  tableElement: $('#col3TableModal'),
  maxLength: 20,
})
makeUpdateCountdown({
  countdownElement: $('#countdown4'),
  tableElement: $('#col4TableModal'),
  maxLength: 20,
})
makeUpdateCountdown({
  countdownElement: $('#countdown5'),
  tableElement: $('#col6TableModal'),
  maxLength: 160,
})
makeUpdateCountdown({
  countdownElement: $('#countdown6'),
  tableElement: $('#col7TableModal'),
  maxLength: 160,
})
