import React from 'react'
import { SearchBar } from './findHelpScreen/SearchBar'
import { useFilters } from './findHelpScreen/hooks/useFilters'
import { Header } from '../components/common/Header'
import { StyleSheet, View } from 'react-native'
import { BackgroundTheme } from '../components/layout/BackgroundTheme'
import { PageContainer } from '../components/layout/PageContainer'
import { Text } from '../components/common/Text'
import { HelpCenterSection } from './findHelpScreen/components/HelpCenter'
import { HelpCenterUI } from '../types'

export function FindHelpScreen({ navigation }) {
  const {
    isFilterActive,
    setFilterActive,
    onGlobalFilter,
    filteredHelpCenters,
    onFilterHelpCenter,
    onFilterByAttribute,
    onFilterByLocation,
  } = useFilters()

  return (
    <BackgroundTheme>
      <PageContainer>
        <Header screenTitle="find help" />

        <View style={styles.swipeWrapper}>
          <View style={[styles.card, { backgroundColor: '#DB307A', flex: 0 }]}>
            <Text style={styles.title}>saved_help_center</Text>
            <HelpCenterSection helpCenters={filteredHelpCenters} type={HelpCenterUI.SAVED_HC} />
          </View>

          <View>
            <SearchBar
              onFilterHelpCenter={onFilterHelpCenter}
              isFilterActive={isFilterActive}
              setFilterActive={setFilterActive}
              onGlobalFilter={onGlobalFilter}
              onFilterByAttribute={onFilterByAttribute}
              onFilterByLocation={onFilterByLocation}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>find_help_center</Text>
            <HelpCenterSection helpCenters={filteredHelpCenters} type={HelpCenterUI.HC} />
          </View>
        </View>
      </PageContainer>
    </BackgroundTheme>
  )
}

const styles = StyleSheet.create({
  swipeWrapper: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  card: {
    marginVertical: 24,
    padding: 12,
    flex: 1,
    backgroundColor: '#f09408',
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
  },
})
