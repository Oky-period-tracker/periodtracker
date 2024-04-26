// TODO:PH make this generic / move to submodule
const contentFilterOptions = [
  [0, 'All'],
  [1, 'Generic'],
  [2, 'Islamic Perspective'],
]

const initializeContentFilter = () => {
  const dropdowns = Array.from(document.querySelectorAll('select.content-filter-dropdown'))
  for (let dropdown of dropdowns) {
    const source = dropdown.getAttribute('data-source')
    const id = dropdown.getAttribute('data-id')
    const level = Number(dropdown.getAttribute('data-level'))

    for (let [value, text] of contentFilterOptions) {
      const optionEl = document.createElement('option')
      optionEl.setAttribute('value', value)
      if (level == value) {
        optionEl.selected = true
      }
      optionEl.innerText = text
      dropdown.appendChild(optionEl)
    }

    dropdown.addEventListener('change', (e) => {
      axios
        .post('/api/content-filter', {
          source,
          id,
          level: e.target.value,
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
