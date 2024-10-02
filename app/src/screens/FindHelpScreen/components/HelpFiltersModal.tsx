import * as React from 'react'
import { StyleSheet, ScrollView, TouchableOpacity, View } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Modal } from '../../../components/Modal'
import { Hr } from '../../../components/Hr'
import { Text } from '../../../components/Text'
import {
  WheelPicker,
  WheelPickerOption,
  useInitialWheelOption,
} from '../../../components/WheelPicker'
import { Checkbox } from '../../../components/Checkbox'
import { Vr } from '../../../components/Vr'
import { useProvinceOptions } from '../../../hooks/useProvinceOptions'
import { useCountryOptions } from '../../../hooks/useCountryOptions'
import { helpCenterAttributesSelector } from '../../../redux/selectors'
import { useSelector } from '../../../redux/useSelector'
import { useSearch } from '../../../hooks/useSearch'
import { SearchBar } from '../../../components/SearchBar'
import { useColor } from '../../../hooks/useColor'

interface HelpFiltersModalProps {
  visible: boolean
  toggleVisible: () => void
  onConfirm: (value: HelpFilters) => void
  filters: HelpFilters
}

export interface HelpFilters {
  region: string | undefined
  subRegion: string | undefined
  attributes: number[]
}

export const HelpFiltersModal = ({
  visible,
  toggleVisible,
  onConfirm,
  filters,
}: HelpFiltersModalProps) => {
  const { palette, backgroundColor, borderColor, color } = useColor()

  const [section, setSection] = React.useState<FilterSection>('region')

  const countryOptions = useCountryOptions()

  const initialCountry = useInitialWheelOption(filters.region, countryOptions)

  const [countryWheelOption, setCountryWheelOption] = React.useState<WheelPickerOption | undefined>(
    initialCountry,
  )

  const provinceOptions = useProvinceOptions(countryWheelOption?.value)

  const initialProvince = useInitialWheelOption(filters.subRegion, provinceOptions)

  const [provinceWheelOption, setProvinceWheelOption] = React.useState<
    WheelPickerOption | undefined
  >(initialProvince)

  const helpCenterAttributes = useSelector(helpCenterAttributesSelector)

  const [selectedAttributes, setSelectedAttributes] = React.useState<number[]>([])

  const clearFilters = () => {
    onConfirm({
      region: undefined,
      subRegion: undefined,
      attributes: [],
    })

    setCountryWheelOption(countryOptions[0])
    setProvinceWheelOption(provinceOptions[0])
    setSelectedAttributes([])
    toggleVisible()
  }

  const confirm = () => {
    onConfirm({
      region: countryWheelOption?.value,
      subRegion: provinceWheelOption?.value,
      attributes: selectedAttributes,
    })
    toggleVisible()
  }

  React.useEffect(() => {
    // Reset province when country changes
    setProvinceWheelOption(undefined)
  }, [countryWheelOption])

  const countrySearch = useSearch<WheelPickerOption>({
    options: countryOptions,
    keys: countrySearchKeys,
    type: 'startsWith',
  })

  const provinceSearch = useSearch<WheelPickerOption>({
    options: provinceOptions,
    keys: provinceSearchKeys,
    type: 'startsWith',
  })

  const title = tabs.find((tab) => tab.section === section)?.title || ''

  return (
    <Modal
      visible={visible}
      toggleVisible={toggleVisible}
      style={[styles.modal, { backgroundColor }]}
    >
      <View style={styles.tabs}>
        {tabs.map((tab, i) => {
          const isSelected = tab.section === section
          const isLast = i === tabs.length - 1
          const onPress = () => {
            setSection(tab.section)
          }

          return (
            <React.Fragment key={tab.section}>
              <TouchableOpacity
                onPress={onPress}
                style={[styles.tab, isSelected && { backgroundColor: borderColor }]}
              >
                <FontAwesome
                  size={24}
                  // @ts-expect-error TODO: create type for FA icon name
                  name={tab.icon}
                  color={isSelected ? color : palette.basic.shadow}
                />
              </TouchableOpacity>
              {!isLast && <Vr />}
            </React.Fragment>
          )
        })}
      </View>

      <Text style={styles.title}>{title}</Text>

      {section === 'region' && (
        <View style={styles.modalBody}>
          <SearchBar query={countrySearch.query} setQuery={countrySearch.setQuery} />
          <WheelPicker
            initialOption={countryWheelOption}
            options={countrySearch.results}
            onChange={setCountryWheelOption}
            resetDeps={[visible]}
          />
        </View>
      )}

      {section === 'subregion' && (
        <View style={styles.modalBody}>
          <SearchBar query={provinceSearch.query} setQuery={provinceSearch.setQuery} />
          <WheelPicker
            initialOption={provinceWheelOption}
            options={countryWheelOption ? provinceSearch.results : []}
            onChange={setProvinceWheelOption}
            resetDeps={[visible]}
          />
        </View>
      )}

      {section === 'attributes' && (
        <ScrollView contentContainerStyle={styles.modalBody}>
          {helpCenterAttributes.map((attribute) => {
            const checked = selectedAttributes.includes(attribute.id)
            const onPress = () => {
              setSelectedAttributes((current) => {
                if (checked) {
                  return current.filter((item) => item !== attribute.id)
                }
                return [...current, attribute.id]
              })
            }

            return (
              <Checkbox
                key={`attribute-${attribute.id}`}
                label={`${attribute.emoji} ${attribute.name}`}
                onPress={onPress}
                checked={checked}
                size={'small'}
                enableTranslate={false}
              />
            )
          })}
        </ScrollView>
      )}

      <Hr />
      <View style={styles.buttons}>
        <TouchableOpacity onPress={clearFilters} style={styles.confirm}>
          <Text style={styles.confirmText}>clear_filters</Text>
        </TouchableOpacity>
        <Vr />
        <TouchableOpacity onPress={confirm} style={styles.confirm}>
          <Text style={styles.confirmText}>confirm</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}

const countrySearchKeys = ['label' as const]

const provinceSearchKeys = ['label' as const]

type FilterSection = 'region' | 'subregion' | 'attributes'

interface FilterTab {
  section: FilterSection
  title: string
  icon: string
}

const tabs: FilterTab[] = [
  {
    section: 'region',
    title: 'country',
    icon: 'map',
  },
  {
    section: 'subregion',
    title: 'province',
    icon: 'map-marker',
  },
  {
    section: 'attributes',
    title: 'attributes',
    icon: 'tags',
  },
]

const styles = StyleSheet.create({
  modal: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalBody: {
    paddingVertical: 24,
    paddingHorizontal: 48,
  },
  tabs: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tab: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginVertical: 18,
    fontWeight: 'bold',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirm: {
    padding: 24,
    flex: 1,
  },
  confirmText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
})
