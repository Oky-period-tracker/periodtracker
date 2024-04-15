$('.languageChange').on('click', event => {
  var button = $(event.currentTarget) // Button that triggered the modal
  var lang = button.data('value') // Extract info from data-* attributes
  // if the article ID is 0 we are creating a new entry
  $.ajax({
    url: '/user/change-location',
    type: 'PUT',
    data: { lang: lang },
    success: result => {
      location.reload()
    },
    error: error => {
      console.log(error)
    },
  })
})

$.fn.applyFormValidation = targetForm => {
   // Loop over them and prevent submission
   Array.prototype.filter.call(targetForm, function(form) {
    form.addEventListener('submit', function(event) {
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
}

const saveFilter = (colIdx, value, tableName) => {
  const filterStorage = JSON.parse(localStorage.getItem('dataTableFilter'));
  const index = filterStorage.findIndex(i => i.tableName === tableName );
  const filteredIndex = filterStorage[index].filters.findIndex(i => i.key === colIdx)
  if (filteredIndex !== -1) {
    filterStorage[index].filters[filteredIndex] = { key: colIdx, value };
  } else {
    filterStorage[index].filters.push({ key: colIdx, value });
  }

  
  localStorage.setItem('dataTableFilter', JSON.stringify(filterStorage));
}


const loadFilters = tableName => {
  const filterStorage = JSON.parse(localStorage.getItem('dataTableFilter'));
  const index = filterStorage.findIndex(i => i.tableName === tableName );
  const filters = filterStorage[index].filters;
  filters.forEach((filter) => {
    $(`#${tableName}_filter_${filter.key}`).val(filter.value).trigger('change');
  })
}