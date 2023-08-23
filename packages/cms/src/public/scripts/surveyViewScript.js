var chart
var currentSurveyId
var deletedQuestion = []
var filteredSurveyData=[];
// Update variable content in Modal when it shows from the edit button
$('#dynamicModal').on('hide.bs.modal', event => {
  $('#surveyResponseTypeBtn').addClass('d-none');
});
$('#dynamicModal').on('show.bs.modal', event => {
  $('.new_question').remove();
  var button = $(event.relatedTarget) // Button that triggered the modal
  var surveyId = button.data('value') // Extract info from data-* attributes
  $('#surveyResponseTypeBtn').removeClass('d-none');
  $('.isMultipleCheckbox')[0].checked = true
  if (surveyId === 0) {
    $('.modal-title').text('Insert New Survey');
    $('#col0TableModal').val('')
    $('#col1TableModal').val('').attr('disabled', false)
    $('#col2TableModal').val('').attr('disabled', false)
    $('#col3TableModal').val('').attr('disabled', false)
    $('#col4TableModal').val('').attr('disabled', false)
    $('#col5TableModal').val('').attr('disabled', false)
    $('#col6TableModal').val('')
    $('.isMultipleCheckbox')[0].checked = true
    $('#itemID').text(0)
    const que = $($('.question_parent')[0]).clone();
    que.addClass('new_question').removeClass('d-none');
    que.find('.next_question_field').attr('disabled', true).val('');
    $('.survey_tbody').append(que);
    var el = document.getElementById('surveyTbody');
    Sortable.create(el, {
      handle: ".handle-sort",
      onSort: function (/**Event*/evt) {
        console.log(evt.oldIndex, 'old index');  // element index within parent
        $('.next_question_field').attr('disabled', false).val('')
        $($('.question_parent')[$('.question_parent').length-1]).find('.next_question_field').attr('disabled', true).val(); 
        $('.question_parent').map((i,tr) => {
          $(tr).find('td')[0].textContent = i;
        })     
      }
    });
    return
  }
  var surveys = JSON.parse($('#surveysJSON').text())
  var surveyInfo = surveys.find(item => {
    return item.id === surveyId
  })
  $('.modal-title').text('Edit Survey');
  surveyInfo.questions.sort((a, b) => a.sort_number-b.sort_number).map((question, index) => {
    const que = $($('.question_parent')[0]).clone();
    que.find('td')[0].textContent = index+1;
    let input = que.find('.input_field');
    que.addClass('new_question').removeClass('d-none');
    let next_question_field = que.find('.next_question_field');
    const next_question = question.next_question;
    if (index) {     
      que.find('.remove__question').removeClass('d-none');
    }
    que.find('.id_input').val(question.id);
    input.map((_, field) => {      
      if (field.type == 'checkbox') {
        field.checked = question[field.name.toLocaleLowerCase().split(' ').join('')]; 
      }
      else {
        field.value = question[field.name.toLocaleLowerCase().split(' ').join('')];
        if (field.dataset.length) field.nextElementSibling.nextElementSibling.textContent = `${parseInt(field.dataset.length) - field.value.length} characters remaining.`;
        if (!['Question', 'Response'].includes(field.name) && !question.is_multiple) field.disabled = true
      }
    })
    if (next_question){
      next_question_field.map((_, field) => {
          if (index < surveyInfo.questions.length -1 ) {
            field.value = next_question[field.dataset.name.toLocaleLowerCase().split(' ').join('')];
            // if (!question.is_multiple)  field.disabled = true;
          }        
          else que.find('.next_question_field').attr('disabled', true);     
      }); 
    }   
    $('.survey_tbody').append(que);
  })
    var el = document.getElementById('surveyTbody');
    Sortable.create(el, {
      handle: ".handle-sort",
      onSort: function (/**Event*/evt) {
        console.log(evt.oldIndex, 'old index');  // element index within parent
        $('.next_question_field').attr('disabled', false);
        $($('.question_parent')[$('.question_parent').length-1]).find('.next_question_field').attr('disabled', true).val('');   
        $('.question_parent').map((i,tr) => {
          $(tr).find('td')[0].textContent = i;
        })
      }
    });
  // $('.isMultipleCheckbox')[0].checked = surveyInfo.is_multiple;
  // $('#col0TableModal').val(surveyInfo.question)
  // $('#col1TableModal').val(surveyInfo.option1).attr('disabled', !surveyInfo.is_multiple)
  // $('#col2TableModal').val(surveyInfo.option2).attr('disabled', !surveyInfo.is_multiple)
  // $('#col3TableModal').val(surveyInfo.option3).attr('disabled', !surveyInfo.is_multiple)
  // $('#col4TableModal').val(surveyInfo.option4).attr('disabled', !surveyInfo.is_multiple)
  // $('#col5TableModal').val(surveyInfo.option5).attr('disabled', !surveyInfo.is_multiple)
  // $('#col6TableModal').val(surveyInfo.response)
  $('#itemID').text(surveyId)
})
//  and create confirmation
$('#btnEditConfirm').on('click', (e) => {
  e.preventDefault();
  const surveyId = $('#itemID').text();
  let questions = [];
  let custum_validation = {valid: true, index: 0};
  let next_question_validation = {valid: true, index: 0}
  $('.question_parent.new_question').map((index) => {
    let inputs = {};
    let next_question = {};    
    let isValid = false
    $($('.question_parent.new_question')[index]).find('.input_field').map((_, item) => {      
      if (item.type == 'checkbox') inputs = { ...inputs, [item.name.toLocaleLowerCase().split(' ').join('')]: item.checked };
      else {        
        inputs = { ...inputs, [item.name.toLocaleLowerCase().split(' ').join('')]: item.value };
        if (item.name =='Question' && !item.value && !item.disabled) custum_validation = {valid: false, index};
        if (item.name !=='Question' && item.value && !item.disabled)  isValid = true;
        else if (item.name !=='Question' && item.disabled) isValid = true;
        if(item.name !='Question' && item.name !='Response' ) {
          if (item.value && !item.disabled && $(item.parentElement).find('.next_question_field').val() && $(item.parentElement).find('.next_question_field').val() < item.parentElement.parentElement.rowIndex && index <  $('.question_parent.new_question').length -1) {
            next_question_validation = {valid: false, index, nextQuestion: true};  
            $(item.parentElement).find('.next_question_field').addClass('invalid__field');
          } 
          if (item.disabled && !item.value && index <  $('.question_parent.new_question').length -1) {
            $(item.parentElement).find('.next_question_field').val(item.parentElement.parentElement.rowIndex)
          }  
          next_question = {...next_question, [item.name.toLocaleLowerCase().split(' ').join('')]: $(item.parentElement).find('.next_question_field').val()}
        }
      }
    })
    
    if (!isValid) {
      $('.option_validations').css('visibility', 'visible');
      $($('.question_parent.new_question')[index]).addClass('highlightRow');
      setTimeout(() => $('.option_validations').css('visibility', 'hidden'), 5000);
      custum_validation = {valid: false, index};
    }
    let id = $($('.question_parent.new_question')[index]).find('.id_input').val();
    if (id != '') questions = [...questions, { ...inputs,response: '', sort_number: index, next_question, id }];
    else questions = [...questions, { ...inputs, sort_number: index,response: '', next_question }]
  });
  if (!custum_validation.valid || !next_question_validation.valid) {
    if (!custum_validation.valid){
      $('.survey_form').addClass('submitted-form');
      $('.error__message').css('visibility', 'visible');
      setTimeout(() => $('.error__message').css('visibility', 'hidden'), 5000);
    } 
    if (!next_question_validation.valid) {
      $('.next_error__message').css('visibility', 'visible');
      setTimeout(() => $('.next_error__message').css('visibility', 'hidden'), 5000);
    }
    return false
  }  
  var surveys = JSON.parse($('#surveysJSON').text())
  var surveyInfo = surveys.find(item => {
    return item.id === surveyId
  })
  const data = {
    live: surveyInfo ? surveyInfo.live : 'false',
    is_multiple: $('.isMultipleCheckbox')[0].checked,
    deletedQuestion,
    questions
  }
  // return false;
  // if (!$('.isMultipleCheckbox')[0].checked){
  //   if ( data.question === '' ||
  //   data.question.length > 65)  $('#error1').show()
  // }
  // else if (
  //   data.question === '' ||
  //   data.question.length > 65 ||
  //   data.option1 === '' ||
  //   data.option1.length > 20 ||
  //   data.option2 === '' ||
  //   data.option2.length > 20 ||
  //   data.option3 === '' ||
  //   data.option3.length > 20 ||
  //   data.option4 === '' ||
  //   data.option4.length > 20 ||
  //   data.option5 === '' ||
  //   data.option5.length > 20 ||
  //   data.response === ''
  // ) {
  //   $('#error1').show()
  //   $('#error2').show()
  //   $('#error3').show()
  //   $('#error4').show()
  //   $('#error5').show()
  //   $('#error6').show()
  //   $('#error7').show()
  //   return
  // }
  // if the ID is 0 we are creating a new entry
  $.ajax({
    url: '/survey' + (surveyId === '0' ? '' : '/' + surveyId),
    type: surveyId === '0' ? 'POST' : 'PUT',
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
$('.liveCheckbox, .ageRestrictionCheckbox').on('click', () => {
  var button = $(event.currentTarget) // Button that triggered the modal
  var surveyId = button.data('value') // Extract info from data-* attributes
  // var surveys = JSON.parse($('#surveysJSON').text())
  // var surveyInfo = surveys.find(item => {
  //   return item.id === surveyId
  // })
  const data = {
    [button.data('name')]: button.prop('checked'),
  }
  // if the ID is 0 we are creating a new entry
  $.ajax({
    url: '/survey/' + surveyId,
    type: 'PUT',
    data: data,
    success: result => {
      // location.reload()
    },
    error: error => {
      console.log(error)
    },
  })
})

// ==================== Delete =============================

$('.delete').on('click', event => {
  var button = $(event.currentTarget) // currentTarget is the outer
  var surveyId = button.data('value') // Extract info from data-* attributes
  var result = confirm('Are you sure? This will permanently delete the item')
  if (result) {
    $.ajax({
      url: '/survey/' + surveyId,
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

// ==================== Graph =============================
function answerTableDataInit (data) {
  $('#surveyAnswerContainer .new-row-added').remove();
  data.map((que) => {    
    var row = $('#surveyAnswerContainer tr').clone();
    let questions = JSON.parse(que);
    questions.map((question) => {
      $(row).children()[0].textContent = question.question;
      $(row).children()[1].textContent = question.answer;
      $(row).children()[2].textContent = question.answerID;
      $(row).children()[3].textContent = question.response;
    })
    $(row).addClass('new-row-added').removeClass('d-none');
    $('#surveyAnswerContainer').append(row);    
  });
}
$('#graphModal').on('show.bs.modal', event => {
  var surveys = JSON.parse($('#surveysJSON').text());
  var button = $(event.relatedTarget) // Button that triggered the modal
  var answeredSurveys = JSON.parse($('#answeredSurveysJSON').text())
  var surveyID = button.data('value') // Extract info from data-* attributes
  currentSurveyId = surveyID;
  const relevantSurvey = surveys.find(sur => sur.id === currentSurveyId);
  $('#downloadSigleCsvData').removeClass('d-none')
  var surveyAnswered = answeredSurveys.find(item => {
    return item.id === surveyID
  })
  const data = {
      'Option 1': 0,
      'Option 2': 0,
      'Option 3': 0,
      'Option 4': 0,
      'Option 5': 0,
  }
  if (surveyAnswered && surveyAnswered.string_agg){
    surveyAnswered.string_agg.split(' ,').map(que => {
      let questions = JSON.parse(que);
      questions.map(question => {
        if (question.answerID) data[`Option ${question.answerID}`] +=1;
      })    
    });
    answerTableDataInit(surveyAnswered.string_agg.split(' ,'));
  }  
  if (!surveyAnswered) {
    renderPieChart({ 'No Data': 1 }, 'chartDiv')
    return
  }
  renderPieChart(
    data,
    'chartDiv',
  )
})

$('#graphModal').on('hide.bs.modal', event => {
  $('#downloadSigleCsvData').addClass('d-none')
  !!chart ? chart.dispose() : null
})
const AGE_GROUP_DATA= {'under_10': 'Under 10',
'between_10_11': 'Between 10 To 11',
'between_12_13': 'Between 12 To 13',
'between_14_15': 'Between 14 To 15',
'between_16_17': 'Between 16 To 17',
'between_18_19': 'Between 18 To 19',
'between_20_21': 'Between 20 To 21',
'greater_than_22': 'Greater Than 22'};

$(document).on('click', '#downloadSurveySigleCsvData', function (e) {
  var answeredSurveys = filteredSurveyData.length ? filteredSurveyData : JSON.parse($('#answeredSurveysJSON').text())
  var surveyID =  e.currentTarget.dataset.value;
  var surveyAnsweredList = answeredSurveys.filter(item => {
    return item.id === surveyID
  })
  var surveys = JSON.parse($('#surveysJSON').text());
  const relevantSurvey = surveys.find(sur => sur.id === currentSurveyId);
  var rows = []
  rows.push(['ID', 'Gender', 'Location', 'Country', 'Age Group', 'Question','Response'])
  surveyAnsweredList.map(surveyAnswered => {
    let age_group = Object.keys(AGE_GROUP_DATA).find(e => surveyAnswered[e] == '1');
    let userID = surveyAnswered.user_id ? surveyAnswered.user_id.split('-').reverse()[0] : 'N/A'
  if (surveyAnswered && surveyAnswered.questions && surveyAnswered.string_agg) {
    const questions = JSON.parse(surveyAnswered.questions)
    questions.sort((a,b)=> a.sort_number - b.sort_number).map(question =>{        
      rows.push([userID,surveyAnswered.gender, surveyAnswered.location, surveyAnswered.country, AGE_GROUP_DATA[age_group] || 'N/A', question.question, question.answer])
    })
  }
})
  exportToCsv('Survey Analytics', rows)
})

$('#downloadCsv').on('click', () => {
  var answeredSurveys = filteredSurveyData.length ? filteredSurveyData : JSON.parse($('#answeredSurveysJSON').text());
  // var surveys = JSON.parse($('#surveysJSON').text())
  // var relevantSurvey = ''
  var rows = [];
  rows.push(['ID', 'SurveyId', 'Gender', 'Location', 'Country', 'Age Group', 'Question','Response'])
  answeredSurveys.map(surveyAnswered => {
    let age_group = Object.keys(AGE_GROUP_DATA).find(e => surveyAnswered[e] == '1');
    let userID = surveyAnswered.user_id ? surveyAnswered.user_id.split('-').reverse()[0] : 'N/A'
    if (surveyAnswered && surveyAnswered.questions && surveyAnswered.string_agg) {
      const questions = JSON.parse(surveyAnswered.questions)
      questions.sort((a,b)=> a.sort_number - b.sort_number).map(question =>{        
        rows.push([userID,surveyAnswered.id, surveyAnswered.gender, surveyAnswered.location, surveyAnswered.country, AGE_GROUP_DATA[age_group] || 'N/A', question.question, question.answer])
      })
    }
  })
  exportToCsv('Survey Analytics', rows)
})

exportToCsv = (filename, rows) => {
  var processRow = function (row) {
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

renderPieChart = (data, location) => {
  // Set theme
  am4core.useTheme(am4themes_animated)
  chart = am4core.create(location, am4charts.PieChart3D)
  chart.innerRadius = am4core.percent(30)
  chart.legend = new am4charts.Legend()
  chart.legend.position = 'left'
  chart.legend.valign = 'middle'
  // chart.legend.labels.template.text = '[bold {color}]{name}:[/] '
  // chart.legend.labels.template.value = '[{value.value} {valueY.close}'

  chart.data = Object.keys(data).map((key, index) => {
    return {
      answer: key,
      amount: parseInt(data[key]),
    }
  })

  var pieSeries = chart.series.push(new am4charts.PieSeries3D())
  pieSeries.dataFields.value = 'amount'
  pieSeries.dataFields.category = 'answer'
  pieSeries.slices.template.stroke = am4core.color('#fff')
  pieSeries.slices.template.strokeWidth = 2
  pieSeries.slices.template.strokeOpacity = 1
  pieSeries.labels.template.disabled = true
  pieSeries.ticks.template.disabled = true
  chart.numberFormatter.numberFormat = '#.'
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

$('#countdown1').show()
$('#countdown2').show()
$('#countdown3').show()
$('#countdown4').show()
$('#countdown5').show()
$('#countdown6').show()

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

$(document).ready(function () {
  $.ajax({
    url: '/answered-surveys',
    type: 'get',
    success: result => {
      $('#answeredSurveysJSON').text(JSON.stringify(result.answeredSurveys));
      $('.isAnsweredDataLoaded').attr('disabled', false)
    },
    error: error => {
      alert(error)
    },
  })
  var el = document.getElementById('surveyTbody');
  Sortable.create(el, {
    onSort: function (/**Event*/evt) {
      console.log(evt.oldIndex, 'old index');  // element index within parent
      $('.next_question_field').attr('disabled', false);
      $($('.question_parent')[$('.question_parent').length-1]).find('.next_question_field').attr('disabled', true).val('');
      $('.question_parent').map((i,tr) => {
        $(tr).find('td')[0].textContent = i;
      })
   
    }
  });
})
//================= Sorting =======================================

var filterList = $('#surveyContainer')
var items = filterList.children()
var sortDateStatus = false
var filteredItems = false
var sortAlphabetStatus = false

var sortDate = function ({ column }) {
  filteredItems = filteredItems ? filteredItems : items

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
  filterList.append(filteredItems)
}

var sortAlphabetically = function ({ column }) {
  filteredItems = filteredItems ? filteredItems : items
  if (!sortAlphabetStatus) {
    var sortList = Array.prototype.sort.bind(filteredItems)

    sortList(function (a, b) {
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
    sortList(function (a, b) {
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

$('#dateSort').click(() => sortDate({ column: 11 }))
$('#surveyQuestion').click(() => sortAlphabetically({ column: 0 }))

//==================== Countdown logic =============================

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
  tableElement: $('#col5TableModal'),
  maxLength: 20,
})

makeUpdateCountdown({
  countdownElement: $('#countdown6'),
  tableElement: $('#col6TableModal'),
  maxLength: 20,
})
//====================is multiple options ==========================//
$(document).on('click', '.isMultipleCheckbox', function (event) {
  const checked = event.target.checked;
  $($($(this).parents()[3]).find('.input_field')).map((_, input) => {
    if(checked){
      if (input.name.includes('Option')) $(input).attr('disabled', false);
    } 
    else {      
      if (input.name.includes('Option')) {
        $(input).val('').attr('disabled', true);
        if ((input.parentElement.parentElement.rowIndex -1) < $('.new_question').length) $(input.parentElement).find('.next_question_field').val(input.parentElement.parentElement.rowIndex)
        else $(input.parentElement).find('.next_question_field').val('')
      }
    }
  })
  // $($($(this).parents()[3]).find('.next_question_field')).map((_, input) => {
  //   if(checked && $('.question_parent').length-1 > $(this).parents()[3].rowIndex -1){
  //     $(input).attr('disabled', false);
  //   } 
  //   else if ($('.question_parent').length-1 > $(this).parents()[3].rowIndex -1) {      
  //     $(input).val($(this).parents()[3].rowIndex -1).attr('disabled', true)
  //   }
  // });
})
$('.add__question').on('click', function () {
  if ($('.new_question').length >= 10) {
    alert('You can only add max 10 questions.')
    return
  }
  const que = $($('.question_parent')[0]).clone();
  que.addClass('new_question').removeClass('d-none');
  que.find('.input_field').val('');
  $($('.question_parent')[$('.question_parent').length-1]).find('.next_question_field').attr('disabled', false).val($('.question_parent').length);
  que.find('.next_question_field').attr('disabled', true).val('')
  que.find('.remove__question').removeClass('d-none');
  que.find('td')[0].textContent = $('.question_parent').length
  $('.survey_tbody').append(que);
  var el = document.getElementById('surveyTbody');
  Sortable.create(el, {
    handle: ".handle-sort",
    onSort: function (/**Event*/evt) {
      console.log(evt.oldIndex, 'old index');  // element index within parent
      $('.next_question_field').attr('disabled', false);
      $($('.question_parent')[$('.question_parent').length-1]).find('.next_question_field').attr('disabled', true).val('');
      $('.question_parent').map((i,tr) => {
        $(tr).find('td')[0].textContent = i;
      })
    }
  });
})
$(document).on('click', '.remove__question', function (e) {
  const que = e.currentTarget.parentElement.parentElement;
  if ($(que).find('.id_input').val()) deletedQuestion = [...deletedQuestion, $(que).find('.id_input').val()];
  $(que).remove();
  $($('.question_parent')[$('.question_parent').length-1]).find('.next_question_field').attr('disabled', true).val('');
  $('.question_parent').map((i,tr) => {
    $(tr).find('td')[0].textContent = i;
    $(tr).find('.next_question_field').map((i, next_question) => {
      if (next_question.value > $('.new_question').length) {
        next_question.value = $('.new_question').length;
      }
    })
  })
})
$('.show__questions').on('click', function (e) {
  $(e.currentTarget.dataset.id).toggleClass('show');
  //data-toggle="collapse" data-target="#survey<%=item.id %>" aria-expanded="false" aria-controls="survey<%=item.id %>"
})
$(document).on('keydown', '.question_parent .validate__input', function (e){
  const totalCount = e.target.name == 'Question' ? 65 : 20;
  if (e.target.value.length >= totalCount && e.originalEvent.key.length === 1 && !e.originalEvent.ctrlKey && !e.originalEvent.shiftKey) return false;
})
$(document).on('keyup', '.question_parent .validate__input', function (e){
  const totalCount = e.target.name == 'Question' ? 65 : 20;
  if($(e.target).hasClass('input_field') && e.target.value.length <= totalCount) {    
    e.target.nextElementSibling.nextElementSibling.textContent= `${totalCount - e.target.value.length} characters remaining`
  }
  else if (e.target.value.length > totalCount) {
    this.value = this.value.slice(0, totalCount)
    e.target.nextElementSibling.nextElementSibling.textContent= `0 characters remaining`;
  }
})
//global filter for survey page

$('.filter__form_select').on('change', e => {
  filteredSurveyData = [];
  $('.surveyDataRow').addClass('d-none');
  let location_val = $('#currentLoc').val();
  let age = $('#currentAge').val();  
  let gender = $("#currentGender").val();
  if (!age && !location_val && !gender){
    $('.surveyDataRow').removeClass('d-none');
    return
  }
  const answeredSurveys = JSON.parse($('#answeredSurveysJSON').text());
  filteredSurveyData = answeredSurveys.filter(e => (!gender || e.gender == gender) && (!age || parseInt(e[age])) && (!location_val || e.location == location_val))
  filteredSurveyData.map(surveyAnswer => {
    $(`#surveyData__${surveyAnswer.id}`).removeClass('d-none');
  })
})
$(document).on('change','.next_question_field', function () {
  const minVal = $(this).parents()[1].rowIndex;
  if (parseInt(this.value) > $('.new_question').length){
    alert(`Max question are ${$('.new_question').length} Only`);
    this.value = $('.new_question').length-1;
  } 
  else if (parseInt(this.value) < minVal){
    $(this).addClass('invalid__field');
    $('.next_error__message').css('visibility', 'visible');
    setTimeout(() => $('.next_error__message').css('visibility', 'hidden'), 5000);
    return false
  }
  $(this).removeClass('invalid__field');
})
$(document).on('keyup', '.option__input', function() {
  $(this).parent().parent().removeClass('highlightRow')
  // if (this.value) $(this).parent().find('.next_question_field').attr('required', true);
  // else $(this).parent().find('.next_question_field').attr('required', false);
})