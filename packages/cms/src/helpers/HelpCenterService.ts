import { HelpCenter } from 'entity/HelpCenter'
import { Request } from 'express'
// import ExcelJS from 'exceljs'
// import * as fuzz from 'fuzzball'
// import { HelpCenterAttribute } from '@oky/core'

export const getFormContents = (req: Request, helpCenterPayload?: HelpCenter) => {
  const {
    title,
    caption,
    contactOne,
    contactTwo,
    address,
    website,
    isAvailableNationwide,
    primaryAttribute,
    otherAttributes,
    isActive,
    region,
    subRegion,
  } = req.body

  if (helpCenterPayload) {
    if (Number(req.body.toggleOnly) > 0) {
      helpCenterPayload.isActive = isActive === 'true' ? true : false

      return helpCenterPayload
    }

    helpCenterPayload.lang = req.user.lang
    helpCenterPayload.title = title
    helpCenterPayload.caption = caption
    helpCenterPayload.contactOne = contactOne
    helpCenterPayload.contactTwo = contactTwo
    helpCenterPayload.address = address
    helpCenterPayload.region = region
    helpCenterPayload.subRegion = subRegion
    helpCenterPayload.isAvailableNationwide = isAvailableNationwide ? true : false
    helpCenterPayload.primaryAttributeId = primaryAttribute
    helpCenterPayload.otherAttributes = otherAttributes
    helpCenterPayload.isActive = isActive === 'true' ? true : false
    helpCenterPayload.website = website

    return helpCenterPayload
  }

  return {
    title,
    caption,
    contactOne,
    contactTwo,
    address,
    website,
    isAvailableNationwide: isAvailableNationwide ? true : false,
    primaryAttributeId: Number(primaryAttribute),
    otherAttributes,
    isActive: isActive ? true : false,
    lang: req.user.lang,
    region,
    subRegion,
  }
}

// export const getExcelData = (
//   workbook: ExcelJS.Workbook,
//   helpCenterAttributes: HelpCenterAttribute[],
// ) => {
//   const excelData = []
//   workbook.worksheets[0].eachRow({ includeEmpty: true }, (row) => {
//     const cells = []
//     row.eachCell({ includeEmpty: true }, (cell) => {
//       cells.push(cell.value)
//     })
//     const [
//       id,
//       title,
//       caption,
//       contactOne,
//       contactTwo,
//       address,
//       website,
//       isAvailableNationwide,
//       primaryAttributeId,
//       otherAttributes,
//       lang,
//       place,
//       location,
//     ] = cells

//     const obj = {
//       id,
//       title,
//       caption,
//       contactOne,
//       contactTwo,
//       address,
//       website,
//       place,
//       location,
//       lang,
//       isAvailableNationwide: Boolean(isAvailableNationwide),
//       primaryAttributeId,
//       otherAttributes,
//     }

//     if (obj.title) {
//       excelData.push(obj)
//     }
//   })

//   excelData.forEach((data, i) => {
//     helpCenterAttributes.forEach((attributes) => {
//       const otherAttributes = []
//       // fuzz is the best way to handle user typos, we don't need to fail the request
//       if (fuzz.partial_ratio(attributes.attributeName, data.primaryAttributeId) >= 90) {
//         excelData[i].primaryAttributeId = attributes.id
//       }
//       if (data.otherAttributes) {
//         data.otherAttributes.split(',').forEach((other) => {
//           if (fuzz.partial_ratio(attributes.attributeName, other) >= 90) {
//             otherAttributes.push(attributes.id)
//           }
//         })
//         excelData[i].otherAttributes = otherAttributes.toString()
//       }
//     })
//   })

//   excelData.shift()
//   return excelData // remove first row
// }

// export const excelHelpCenterColumns = [
//   { name: 'id', value: 'A' },
//   { name: 'Title', value: 'B' },
//   { name: 'Caption', value: 'C' },
//   { name: 'Contact 1', value: 'D' },
//   { name: 'Contact 2', value: 'E' },
//   { name: 'Address', value: 'F' },
//   { name: 'Website', value: 'G' },
//   { name: 'Available Nationwide?', value: 'H' },
//   { name: 'Primary Attribute', value: 'I' },
//   { name: 'Other Attributes', value: 'J' },
//   { name: 'Language', value: 'K' },
//   { name: 'City', value: 'L' },
//   { name: 'Province', value: 'M' },
// ]
