import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { HelpCenter } from '../entity/HelpCenter'
import { excelHelpCenterColumns, getExcelData, getFormContents } from '../helpers/HelpCenterService'
import { bulkUpdateRowReorder } from '../helpers/common'
import ExcelJS from 'exceljs'
import fs from 'fs'
import path from 'path'
import { helpCenterData } from '../optional'

export class HelpCenterController {
  private helpCenterRepository = getRepository(HelpCenter)

  async all(request: Request, response: Response, next: NextFunction) {
    return this.helpCenterRepository.find({
      where: { lang: request.user.lang },
      order: {
        sortingKey: 'ASC',
      },
    })
  }

  async mobileHelpCenterByLanguage(request: Request, response: Response, next: NextFunction) {
    const helpCenters: HelpCenter[] | any = await this.helpCenterRepository.find({
      where: {
        lang: request.params.lang,
        isActive: true,
      },
      order: {
        sortingKey: 'ASC',
      },
    })

    helpCenters.forEach((helpCenter, hIndex) => {
      helpCenterData.locations?.forEach((location) => {
        if (location.name === helpCenter.location) {
          helpCenters[hIndex].location = location
        }
      })

      helpCenterData.attributes.forEach((attrib) => {
        if (attrib.id === helpCenter.primaryAttributeId) {
          helpCenters[hIndex].attributeName = attrib.attributeName
        }
      })
    })

    return helpCenters
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.helpCenterRepository.findOne(request.params.id)
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const toSave = getFormContents(request)
    await this.helpCenterRepository.save(toSave)
    return toSave
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const helpCenterToUpdate = await this.helpCenterRepository.findOne(request.params.id)
    const updatedPayload = getFormContents(request, helpCenterToUpdate)
    await this.helpCenterRepository.save(updatedPayload)
    return helpCenterToUpdate
  }

  async bulkUpdate(request: Request, response: Response, next: NextFunction) {
    if (request.body.rowReorderResult && request.body.rowReorderResult.length) {
      return await bulkUpdateRowReorder(this.helpCenterRepository, request.body.rowReorderResult)
    }

    return await this.helpCenterRepository.find({
      where: {
        lang: request.params.lang,
      },
      order: {
        sortingKey: 'ASC',
      },
    })
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const helpCenterToRemove = await this.helpCenterRepository.findOne(request.params.id)
    await this.helpCenterRepository.remove(helpCenterToRemove)
    return helpCenterToRemove
  }

  async getTemplate(request: Request, res: Response) {
    const helpCenters = await this.helpCenterRepository.find()
    if (helpCenters.length) {
      const filePath = path.join(__dirname, '../public/templates/help_center_template.xlsx')
      const workbook = new ExcelJS.Workbook()
      // Load the existing Excel file
      await workbook.xlsx.readFile(filePath)

      // Access the worksheet you want to edit
      const worksheet = workbook.getWorksheet('Help Centers')

      // Make changes to the worksheet

      helpCenters.forEach((helpCenter, index) => {
        excelHelpCenterColumns.forEach((column) => {
          const { name, value } = column
          const cell = worksheet.getCell(`${value}${index + 2}`)

          switch (name) {
            case 'id':
              cell.value = helpCenter.id
              break
            case 'Caption':
              cell.value = helpCenter.caption
              break
            case 'Contact 1':
              cell.value = helpCenter.contactOne
              break
            case 'Contact 2':
              cell.value = helpCenter.contactTwo
              break
            case 'Address':
              cell.value = helpCenter.address
              break
            case 'Title':
              cell.value = helpCenter.title
              break
            case 'Website':
              cell.value = helpCenter.website
              break
            case 'Available Nationwide?':
              cell.value = helpCenter.isAvailableNationwide ? 'Yes' : ''
              break
            case 'Primary Attribute':
              helpCenterData.attributes.forEach((attrib) => {
                if (attrib.id === helpCenter.primaryAttributeId) {
                  cell.value = attrib.attributeName
                }
              })
              break
            case 'Other Attributes':
              let otherAttributes = ''
              if (helpCenter.otherAttributes) {
                const others = helpCenter.otherAttributes.split(',')
                helpCenterData.attributes.forEach((attrib) => {
                  others.forEach((other) => {
                    if (attrib.id === Number(other)) {
                      otherAttributes += attrib.attributeName + ','
                    }
                  })
                })
              }
              cell.value = otherAttributes
              break
            case 'Language':
              cell.value = helpCenter.lang
              break
            case 'Place':
              cell.value = helpCenter.place
              break
            case 'Location':
              cell.value = helpCenter.location
              break
          }
        })
      })

      const filename = `help_centers_${new Date().toISOString().slice(0, 10)}.xlsx`

      // Save the workbook to a temporary file
      const tempFilePath = path.join(__dirname, '../temp', filename)
      await workbook.xlsx.writeFile(tempFilePath)

      // Set the response headers for file download
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      )
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)

      // Send the file as a response
      fs.createReadStream(tempFilePath).pipe(res)

      // Delete the temporary file after half a second to have enough time to send in stream
      setTimeout(() => {
        fs.unlinkSync(tempFilePath)
      }, 500)

      return { isFile: true }
    }

    fs.createReadStream(
      path.join(__dirname, '../public/templates', 'help_center_template_empty.xlsx'),
    ).pipe(res)

    return { isFile: true }
  }

  async bulkUpdateViaFile(req: Request, res: Response) {
    // @ts-ignore TODO:PH fixme
    const file = req.files.file as any
    const workbook = new ExcelJS.Workbook()
    const tempFilePath = path.join(__dirname, '../temp', file.name)
    await file.mv(tempFilePath)
    await workbook.xlsx.readFile(tempFilePath)

    if (!workbook.worksheets[0].name) {
      throw new Error('Excel worksheet does not match the template')
    }

    const excelJSON = getExcelData(workbook, helpCenterData.attributes)
    const inserted: HelpCenter[] = []
    const updated = []

    excelJSON.forEach((json) => {
      if (json.id) {
        updated.push(json)
        return
      }
      delete json.id
      inserted.push(json)
    })

    let updatedStringParams = ''
    let finalPlaceholder = ''

    let counter = 1
    updated.forEach((updatedData) => {
      let temp = ''
      for (const items of Object.entries(updatedData)) {
        temp += `$${counter},`
        counter++
      }
      const newTemp = temp.slice(0, -1)
      updatedStringParams += `(${newTemp}),`
    })

    finalPlaceholder += updatedStringParams.slice(0, -1)

    const allValuesArray = []
    updated.forEach((obj) => {
      Object.values(obj).forEach((value) => {
        allValuesArray.push(value)
      })
    })

    let returnInserted = []
    let returnUpdated = []

    await this.helpCenterRepository.manager.transaction(async (entityManager) => {
      if (inserted.length) {
        returnInserted = await entityManager.save(HelpCenter, inserted)
      }

      if (updated.length) {
        const query = `
            INSERT INTO oky_en.help_center (id, "title", caption, "contactOne", "contactTwo", address, website, place, location, lang, "isAvailableNationwide", "primaryAttributeId", "otherAttributes")
            VALUES ${finalPlaceholder}
            ON CONFLICT (id) DO UPDATE
            SET "title" = EXCLUDED."title",
                caption = EXCLUDED.caption,
                "contactOne" = EXCLUDED."contactOne",
                "contactTwo" = EXCLUDED."contactTwo",
                address = EXCLUDED.address,
                website = EXCLUDED.website,
                place = EXCLUDED.place,
                location = EXCLUDED.location,
                lang = EXCLUDED.lang,
                "isAvailableNationwide" = EXCLUDED."isAvailableNationwide",
                "primaryAttributeId" = EXCLUDED."primaryAttributeId",
                "otherAttributes" = EXCLUDED."otherAttributes";
        `
        returnUpdated = await entityManager.query(query.replace(/\n/g, ''), allValuesArray)
      }
    })

    // const data = await upsert(HelpCenter, excelJSON, 'id')
    fs.unlinkSync(tempFilePath)

    return { inserted: returnInserted, updated: returnUpdated }
  }
}
