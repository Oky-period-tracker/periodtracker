import * as React from 'react'
import { FlatList, StyleSheet } from 'react-native'
import { Screen } from '../../components/Screen'
import { ScreenComponent } from '../../navigation/RootNavigator'
import { CycleCard } from './components/CycleCard'
import { ProfileDetails } from './components/ProfileDetails'
import { useHistoryPrediction } from '../../contexts/PredictionProvider'

const ProfileScreen: ScreenComponent<'Profile'> = (props) => {
  const History = useHistoryPrediction()

  return (
    <Screen>
      <FlatList
        style={styles.flatList}
        ListHeaderComponent={<ProfileDetails {...props} />}
        showsVerticalScrollIndicator={false}
        data={History}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <CycleCard item={item} cycleNumber={History.length - index} />
        )}
      />
    </Screen>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  flatList: {
    paddingHorizontal: 12,
    width: '100%',
  },
})
