import * as React from 'react'
import { StyleSheet, ScrollView, View } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { ScreenComponent } from '../../navigation/RootNavigator'
import { HelpCenterCard } from './components/HelpCenterCard'
import { useSearch } from '../../hooks/useSearch'
import { Button } from '../../components/Button'
import { useToggle } from '../../hooks/useToggle'
import { HelpFilters, HelpFiltersModal } from './components/HelpFiltersModal'
import { HelpCenter } from '../../core/types'
import { useSelector } from '../../redux/useSelector'
import { allHelpCentersForCurrentLocale, savedHelpCenterIdsSelector } from '../../redux/selectors'
import { useDispatch } from 'react-redux'
import { setSavedHelpCenters } from '../../redux/actions'
import { SearchBar } from '../../components/SearchBar'
import { globalStyles } from '../../config/theme'
import { Screen } from '../../components/Screen'

const FindHelpScreen: ScreenComponent<'Help'> = () => {
  const helpCenters = useSelector(allHelpCentersForCurrentLocale)
  const savedHelpCenters = useSelector(savedHelpCenterIdsSelector)
  const dispatch = useDispatch()

  const [filterModalVisible, toggleFilterModal] = useToggle()
  const [filters, setFilters] = React.useState<HelpFilters>({
    region: undefined,
    subRegion: undefined,
    attributes: [],
  })

  const filteredResults = React.useMemo(() => {
    return helpCenters.filter((item) => {
      if (filters.region && filters.region !== item.region) {
        return false
      }

      if (
        filters.region &&
        filters.subRegion &&
        item.subRegion &&
        !item.subRegion?.split(',').includes(filters.subRegion)
      ) {
        return false
      }

      const hasAttributeFilter = filters.attributes.length > 0
      const primaryAttributeNotIncluded =
        item.primaryAttributeId === null ||
        !filters.attributes.includes(item?.primaryAttributeId ?? -1)

      if (hasAttributeFilter && primaryAttributeNotIncluded) {
        return false
      }

      return true
    })
  }, [helpCenters, filters])

  const { query, setQuery, results } = useSearch<HelpCenter>({
    options: filteredResults,
    keys: searchKeys,
  })

  const sortedResults = React.useMemo(() => {
    return results.sort((a, b) => {
      const isASaved = savedHelpCenters.includes(a.id)
      const isBSaved = savedHelpCenters.includes(b.id)

      // Primary sorting by saved status
      if (isASaved && !isBSaved) {
        return -1
      }
      if (!isASaved && isBSaved) {
        return 1
      }

      // Secondary sorting by sortingKey
      const aSortingKey = a.sortingKey
      const bSortingKey = b.sortingKey

      if (aSortingKey === undefined || bSortingKey === undefined) {
        return 0
      }

      return aSortingKey - bSortingKey
    })
  }, [results, savedHelpCenters])

  const hasFilters = filters.region || filters.subRegion || filters.attributes.length

  return (
    <Screen>
      <View style={styles.searchRow}>
        <View style={styles.filterButton}>{/* Spacer */}</View>
        <SearchBar query={query} setQuery={setQuery} style={[styles.search, globalStyles.shadow]} />
        <Button
          style={styles.filterButton}
          status={hasFilters ? 'secondary' : 'basic'}
          onPress={toggleFilterModal}
        >
          <FontAwesome size={18} name={'filter'} color={'#fff'} />
        </Button>
      </View>

      <ScrollView style={styles.scrollView}>
        {sortedResults.map((item) => {
          const isSaved = savedHelpCenters.includes(item.id)
          const onSavePress = () => {
            if (savedHelpCenters.includes(item.id)) {
              // Unsave
              const result = savedHelpCenters.filter((h) => h !== item.id)
              dispatch(setSavedHelpCenters(result))
              return
            }

            // Save
            const result = [...savedHelpCenters, item.id]
            dispatch(setSavedHelpCenters(result))
          }

          return (
            <HelpCenterCard
              key={`help-center-${item.id}`}
              helpCenter={item}
              isSaved={isSaved}
              onSavePress={onSavePress}
            />
          )
        })}

        <View style={styles.spacer} />
      </ScrollView>

      <HelpFiltersModal
        visible={filterModalVisible}
        toggleVisible={toggleFilterModal}
        onConfirm={setFilters}
        filters={filters}
      />
    </Screen>
  )
}

const searchKeys = [
  'title' as const,
  'caption' as const,
  'address' as const,
  'website' as const,
  // TODO: Add string of combined attribute names to HelpCenter type for use here in search
]

export default FindHelpScreen

const styles = StyleSheet.create({
  scrollView: {
    width: '100%',
    padding: 12,
  },
  searchRow: {
    flexDirection: 'row',
    padding: 12,
  },
  search: {
    flex: 1,
    marginHorizontal: 8,
  },
  filterButton: {
    width: 40,
    height: 40,
  },
  spacer: {
    height: 200,
  },
})
