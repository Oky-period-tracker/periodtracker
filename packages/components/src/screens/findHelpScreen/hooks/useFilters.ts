import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import * as selectors from '../../../redux/selectors'
import { HelpCenters } from '../../../types'
import { helpCenterAttributes, helpCenterLocations } from '@oky/core'
import { useHapticAndSound } from '../../../hooks/useHapticAndSound'

export const useFilters = () => {
  const hapticAndSoundFeedback = useHapticAndSound()
  const helpCenters: any = useSelector(selectors.allHelpCentersForCurrentLocale)
  const [isFilterActive, setFilterActive] = useState<boolean>(false)
  const [locations, setLocations] = useState([])
  const [filteredHelpCenters, setFilteredHelpCenters] = useState<HelpCenters>()
  const [isDualFiltered, setDualFiltered] = useState<boolean>(false)

  useEffect(() => {
    setFilteredHelpCenters(helpCenters)
    setLocations(
      helpCenterLocations?.map((location) => {
        return {
          id: location.name,
          name: location.name,
        }
      }),
    )
  }, [])

  const onGlobalFilter = (searched: string) => {
    hapticAndSoundFeedback('key')

    if (searched === '') {
      return setFilteredHelpCenters(helpCenters)
    }

    const filtered = helpCenters.filter((helpCenter) => {
      const title = helpCenter?.title || ''
      const place = helpCenter?.place || ''
      const address = helpCenter?.address || ''
      const location = helpCenter?.location?.name || ''
      const attributeName = helpCenter?.attributeName || ''

      if (
        title.toLowerCase().includes(searched.toLowerCase()) ||
        place.toLowerCase().includes(searched.toLowerCase()) ||
        address.toLowerCase().includes(searched.toLowerCase()) ||
        location.toLowerCase().includes(searched.toLowerCase()) ||
        attributeName.toLowerCase().includes(searched.toLowerCase())
      ) {
        return true
      }

      return false
    })

    setFilteredHelpCenters(filtered)
  }

  const onFilterHelpCenter = (attributeIds: number[], locationCode: string[]) => {
    let toFilter: any[] = helpCenters
    const checkAttribute = (helpCenter: any, ids: number[]) => {
      const others = helpCenter.otherAttributes ?? ''
      const attributesToCheck = [
        helpCenter.primaryAttributeId,
        ...others.split(',').map((attr) => parseInt(attr, 10)),
      ]
      return ids.some((item) => attributesToCheck.includes(item))
    }

    const checkLocation = (helpCenter: any, code: string[]) => {
      return code.some(
        (item) => helpCenter.location.name === item || helpCenter.isAvailableNationwide,
      )
    }

    if (attributeIds.length || locationCode.length) {
      const filtered = toFilter.filter((helpCenter) => {
        const existAttribute = checkAttribute(helpCenter, attributeIds)
        const existLocation = checkLocation(helpCenter, locationCode)

        if (attributeIds.length && locationCode.length) {
          return existAttribute && existLocation
        }
        return attributeIds.length ? existAttribute : existLocation
      })
      toFilter = filtered
    }

    setFilteredHelpCenters(toFilter)
  }

  const onFilterByAttribute = (attributeIds: number[]) => {
    const toFilter = helpCenters

    if (!attributeIds.length) {
      setDualFiltered(false)
      return setFilteredHelpCenters(toFilter)
    }

    const filtered = toFilter.filter((helpCenter) => {
      for (const item of attributeIds) {
        const otherAttributes = helpCenter.otherAttributes.split(',')

        if (
          helpCenter.primaryAttributeId === item ||
          otherAttributes.some((attr) => parseInt(attr, 10) === item)
        ) {
          return true
        }
      }
      return false
    })

    setDualFiltered(true)
    setFilteredHelpCenters(filtered)
  }

  const onFilterByLocation = (locationCode: string[]) => {
    let toFilter = helpCenters

    if (!locationCode.length) {
      setDualFiltered(false)
      return setFilteredHelpCenters(toFilter)
    }

    if (isDualFiltered) {
      toFilter = filteredHelpCenters
    }

    const filtered = toFilter.filter((helpCenter) => {
      for (const item of locationCode) {
        if (helpCenter.location.name === item || helpCenter.isAvailableNationwide) {
          return true
        }
      }
      return false
    })

    setFilteredHelpCenters(filtered)
  }

  return {
    isFilterActive,
    setFilterActive,
    helpCenterAttributes,
    filteredHelpCenters,
    setFilteredHelpCenters,
    onGlobalFilter,
    locations,
    onFilterHelpCenter,
    onFilterByAttribute,
    onFilterByLocation,
  }
}
