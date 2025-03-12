var contentFilterOptions = JSON.parse($('#contentFilterJSON').text())

const initializeContentFilter = () => {
  const dropdowns = Array.from(document.querySelectorAll('select.content-filter-dropdown'))
  for (let dropdown of dropdowns) {
    const source = dropdown.getAttribute('data-source')
    const id = dropdown.getAttribute('data-id')
    const level = Number(dropdown.getAttribute('data-level'))

    for (let { value, description } of Object.values(contentFilterOptions)) {
      const optionEl = document.createElement('option')
      optionEl.setAttribute('value', value)
      if (level == value) {
        optionEl.selected = true
      }
      optionEl.innerText = description
      dropdown.appendChild(optionEl)
    }

    dropdown.addEventListener('change', (e) => {
      axios
        .post('/api/content-filter', {
          source,
          id,
          level: parseInt(e.target.value),
        })
        .then(({ data }) => {
          if (data.error === true) {
            throw new Error(data.message)
          }
          console.log(data)
        })
        .catch(() => {
          alert('Something went wrong. Could not update age restriction.')
          // location.reload()
        })
        .then(() => {})
    })
  }
}

document.addEventListener('DOMContentLoaded', initializeContentFilter)
