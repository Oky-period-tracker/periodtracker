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
