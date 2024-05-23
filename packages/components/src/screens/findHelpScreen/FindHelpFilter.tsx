import React, { FunctionComponent, useRef, useState } from 'react'
import { View } from 'react-native'
import MultiSelect from 'react-native-multiple-select'
import { useFilters } from './hooks/useFilters'
import { TouchableOpacity } from 'react-native-gesture-handler'
import styled from 'styled-components/native'
import { Text, TextWithoutTranslation } from '../../components/common/Text'
import { useHapticAndSound } from '../../hooks/useHapticAndSound'

interface IFindHelpFilter {
  onFilterByAttribute: (s: string[] | number[]) => void
  onFilterByLocation: (s: string[]) => void
  setFilterActive: (b: boolean) => void
  onFilterHelpCenter: (attributeIds: number[], locationCode: string[]) => void
}

export const FindHelpFilter: FunctionComponent<IFindHelpFilter> = ({
  onFilterByAttribute,
  onFilterByLocation,
  setFilterActive,
  onFilterHelpCenter,
}) => {
  const hapticAndSoundFeedback = useHapticAndSound()
  const [selectedItemsAttribute, setSelectedItemsAttribute] = useState<any>([])
  const [selectedItemsLocation, setSelectedItemsLocation] = useState<any>([])

  const { helpCenterAttributes, locations } = useFilters()
  const ref = useRef(null)
  const ref2 = useRef(null)

  React.useEffect(() => {
    return onFilterHelpCenter(selectedItemsAttribute, selectedItemsLocation)
  }, [selectedItemsLocation, selectedItemsAttribute])

  const onSelectedAttributeChange = (newItems) => {
    hapticAndSoundFeedback('general')
    setSelectedItemsAttribute(newItems)
  }

  const onSelectedLocationChange = (newItems) => {
    hapticAndSoundFeedback('general')
    setSelectedItemsLocation(newItems)
  }

  const clearFilters = () => {
    ref.current._removeAllItems()
    ref2.current._removeAllItems()
  }

  const getAttributeNames = (selected) => {
    let toRender = ''
    helpCenterAttributes.forEach((attrib) => {
      selected.forEach((select) => {
        if (select === attrib.id) {
          toRender += attrib.attributeName
        }
      })
    })

    return toRender
  }

  const sortedData = locations.sort((a, b) => {
    const nameA = a.name.toUpperCase()
    const nameB = b.name.toUpperCase()
    return nameA.localeCompare(nameB)
  })

  return (
    <>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 8 }}>
          <Text style={{ marginLeft: 10, color: '#000' }}>filter_to_search</Text>
        </View>
        <View style={{ flex: 2 }}>
          <TouchableOpacity
            onPress={() => {
              hapticAndSoundFeedback('close')
              clearFilters()
            }}
          >
            <TextWithoutTranslation color="#DB307A">Reset</TextWithoutTranslation>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 2 }}>
          <TouchableOpacity
            onPress={() => {
              hapticAndSoundFeedback('close')
              clearFilters()
              setFilterActive(false)
            }}
          >
            <TextWithoutTranslation color="#F09408">Back</TextWithoutTranslation>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ margin: 10 }}>
        <MultiSelect
          hideDropdown
          hideSubmitButton
          hideTags
          items={helpCenterAttributes || []}
          uniqueKey="id"
          ref={ref}
          styleIndicator={{
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: -5,
          }}
          onSelectedItemsChange={onSelectedAttributeChange}
          selectedItems={selectedItemsAttribute}
          selectText={`   ${getAttributeNames(selectedItemsAttribute)} `}
          selectedText=""
          onChangeInput={(text) => {
            hapticAndSoundFeedback('key')
          }}
          tagRemoveIconColor="#CCC"
          tagBorderColor="#CCC"
          tagTextColor="#CCC"
          selectedItemTextColor="#CCC"
          selectedItemIconColor="#CCC"
          itemTextColor="#000"
          displayKey="attributeName"
          styleItemsContainer={{ marginLeft: 10 }}
          styleMainWrapper={{ borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}
          styleDropdownMenuSubsection={{ borderRadius: 16 }}
          styleInputGroup={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
          searchInputStyle={{ color: '#CCC' }}
          submitButtonColor="#CCC"
          submitButtonText="Confirm"
        />
        <Row>
          <View>
            <Text style={{ margin: 10, color: '#000' }}>filter_to_search2</Text>
          </View>
          <View style={{ flexGrow: 5, justifyContent: 'center' }}>
            <MultiSelect
              hideTags
              hideDropdown
              hideSubmitButton
              items={sortedData || []}
              uniqueKey="id"
              ref={ref2}
              styleIndicator={{
                alignContent: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: -5,
              }}
              onSelectedItemsChange={onSelectedLocationChange}
              selectedItems={selectedItemsLocation}
              selectText={`   ${selectedItemsLocation.toString()} `}
              selectedText=""
              onChangeInput={(text) => {
                hapticAndSoundFeedback('key')
              }}
              tagRemoveIconColor="#CCC"
              tagBorderColor="#CCC"
              tagTextColor="#CCC"
              selectedItemTextColor="#CCC"
              selectedItemIconColor="#CCC"
              itemTextColor="#000"
              displayKey="name"
              fixedHeight
              styleDropdownMenuSubsection={{ borderRadius: 16 }}
              styleInputGroup={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
              searchInputStyle={{ color: '#CCC' }}
              submitButtonColor="#CCC"
              submitButtonText="Confirm"
            />
          </View>
        </Row>
      </View>
    </>
  )
}
const Row = styled.TouchableOpacity`
  width: 100%;
  flex-direction: column;
`
