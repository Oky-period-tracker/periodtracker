$('.languageChange').on('click', (event) => {
  var button = $(event.currentTarget) // Button that triggered the modal
  var lang = button.data('value') // Extract info from data-* attributes
  // if the article ID is 0 we are creating a new entry
  $.ajax({
    url: '/user/change-location',
    type: 'PUT',
    data: { lang: lang },
    success: (result) => {
      location.reload()
    },
    error: (error) => {
      console.log(error)
    },
  })
})

// Back arrows go to the previous page. The link's own href is the fallback
// when the page was opened directly (javascript: URLs are blocked by the CSP).
$(document).on('click', '.history-back', (event) => {
  if (window.history.length > 1) {
    event.preventDefault()
    window.history.back()
  }
})
