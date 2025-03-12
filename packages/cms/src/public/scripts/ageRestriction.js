document.addEventListener("DOMContentLoaded", () => {
  const radioButtons = Array.from(document.querySelectorAll("input.age-restriction-level-radio"))
  
  for(let radioButton of radioButtons){
    radioButton.addEventListener("click", (e) => {
      const el = e.target
      const source = el.getAttribute("data-source")
      const id = el.getAttribute("data-id")
      const level = el.getAttribute("data-level")
      axios.post("/api/age-restriction", {
        source, level, id,
      })
      .then(({data}) => {
        if(data.error === true){
          throw new Error(data.message)
        }
        console.log(data)
      })
      .catch(() => {
        alert("Something went wrong. Could not update age restriction.")
        // location.reload()
      })
      .then(() => {
        
      })
    })
  }
})
