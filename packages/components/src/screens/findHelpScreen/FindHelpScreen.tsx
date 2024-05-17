import React from 'react'
import { FindHelpLayout } from './FindHelpLayout'
import { Header } from '../../components/common/Header'
import { SearchBar } from './SearchBar'
import { HelpCenterContainer } from './HelpCenterContainer'
import { useFilters } from './hooks/useFilters'

export function FindHelpScreen({ navigation }) {
  const {
    isFilterActive,
    setFilterActive,
    onGlobalFilter,
    filteredHelpCenters,
    onFilterHelpCenter,
    onFilterByAttribute,
    onFilterByLocation,
    setActiveSwipeIndex,
    hideFilters,
    activeTab,
  } = useFilters()

  return (
    <FindHelpLayout
      SearchBar={
        hideFilters ? null : (
          <SearchBar
            onFilterHelpCenter={onFilterHelpCenter}
            isFilterActive={isFilterActive}
            setFilterActive={setFilterActive}
            onGlobalFilter={onGlobalFilter}
            onFilterByAttribute={onFilterByAttribute}
            onFilterByLocation={onFilterByLocation}
          />
        )
      }
      Header={<Header screenTitle="find help" />}
      HelpCenters={
        <HelpCenterContainer
          setActiveSwipeIndex={setActiveSwipeIndex}
          isFilterActive={isFilterActive}
          filteredHelpCenters={filteredHelpCenters}
          activeTab={activeTab}
        />
      }
    />
  )
}
