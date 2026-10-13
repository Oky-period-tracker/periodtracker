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

// Builds the message shown to editors when a request fails, so errors such as
// a 403 are not only logged to the console. Called from the page scripts.
function requestErrorMessage(action, xhr) {
  if (xhr.status === 0) {
    return (
      'Could not ' + action + ': the CMS could not be reached. Check your connection and try again.'
    )
  }
  var reason
  if (xhr.status === 401 || xhr.status === 403) {
    reason =
      'the request was refused. Log out and log back in, and if it still fails ask an admin to check your access.'
  } else if (xhr.responseJSON && xhr.responseJSON.error) {
    reason = xhr.responseJSON.error + '.'
  } else {
    reason = 'the server returned an error.'
  }
  return 'Could not ' + action + ': ' + reason + ' (HTTP ' + xhr.status + ')'
}
