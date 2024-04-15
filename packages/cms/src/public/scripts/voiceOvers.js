const initializeVoiceOver = () => {
  const columns = Array.from(document.querySelectorAll("td.voice-over-column"))
  const columnItems = columns.map(el => {
    const id = el.getAttribute("data-id")
    const source = el.getAttribute("data-source")
    const data = JSON.parse(el.getAttribute("data-json"))
    return { 
      id, 
      source, 
      data,
      url: data.voiceOverUrl,
      el, 
      loading: false,
      uploading: false,
    }
  })
  
  function renderVoiceOverItem(item){
    item.el.innerHTML = ""

    if(item.uploading){
      renderInfo(item, "Uploading voice over...")
      return
    }

    if(item.loading){
      renderInfo(item, "Loading...")
      return
    }

    if(item.data.voiceOverUrl){
      renderHasVoiceOver(item)
    } else{
      renderNoVoiceOver(item)
    }
  }

  function renderInfo(item, text){
    item.el.innerHTML = text
  }

  function renderNoVoiceOver(item){
    const uploadButton = document.createElement("input")
    uploadButton.setAttribute("type", "file")
    item.el.appendChild(uploadButton)
    uploadButton.addEventListener("change", (e) => {
      item.uploading = true
      renderVoiceOverItem(item)
      
      const file = e.target.files[0]
      const formData = new FormData()
      formData.append("id", item.id)
      formData.append("source", item.source)
      formData.append("file", file)

      axios.post("/api/voice-over/article/upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(({data}) => {
        item.data = data
      })
      .catch((error) => {
        console.warn(error)
        alert("Something went wrong with uploading the file!")
      })
      .then(() => {
        item.uploading = false
        renderVoiceOverItem(item)
      })
    })
  }

  function renderHasVoiceOver(item){
    const voiceOverUrl = window.VOICE_OVER_BASE_URL + item.data.voiceOverUrl

    const audioElement = document.createElement("audio")
    audioElement.setAttribute("controls", "")
    audioElement.setAttribute("src", voiceOverUrl)

    const removeButton = document.createElement("button")
    removeButton.innerText = "Remove"

    removeButton.addEventListener("click", () => {
      if(confirm("Are you sure you want to remove the voice over for this entry?")){
        item.loading = true
        axios.post("/api/voice-over/article/remove", {
          id: item.data.id,
        })
        .then(({data}) => {
          item.data = data
        })
        .catch((error) => {
          console.warn(error)
          alert("Something went wrong with deleting the file!")
        })
        .then(() => {
          item.loading = false
          renderVoiceOverItem(item)
        })
      }
    })

    item.el.appendChild(audioElement)
    item.el.appendChild(removeButton)
  }

  columnItems.forEach(item => renderVoiceOverItem(item))
} 