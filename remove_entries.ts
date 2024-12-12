// Import filesystem module
import * as fs from 'fs'

// Define the input and output file paths
const inputFilePath =
  '/Users/luciaalbelda/Documents/Github/periodtracker/app/src/resources/translations/provinces.ts'
const outputFilePath = './countries_provinces.ts'

// Read the content of the input file
fs.readFile(inputFilePath, 'utf8', (err: NodeJS.ErrnoException | null, data: string | null) => {
  if (err) {
    console.error('Error reading the file:', err)
    return
  }

  if (data === null) {
    console.error('File content is null.')
    return
  }

  // Split the file content into lines
  const lines = data.split('\n')

  // Filter out lines starting with 'en:', 'id:', or 'mn:'
  const filteredLines = lines.filter((line: string) => {
    const trimmedLine = line.trim()
    return !(
      trimmedLine.startsWith('en:') ||
      trimmedLine.startsWith('id:') ||
      trimmedLine.startsWith('mn:')
    )
  })

  // Join the filtered lines back into a single string
  const cleanedData = filteredLines.join('\n')

  // Write the cleaned data to the output file
  fs.writeFile(outputFilePath, cleanedData, 'utf8', (writeErr: NodeJS.ErrnoException | null) => {
    if (writeErr) {
      console.error('Error writing to the file:', writeErr)
      return
    }
    console.log('File cleaned and saved to', outputFilePath)
  })
})
