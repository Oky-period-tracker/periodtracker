import { StyleSheet, View } from 'react-native'
import { Button } from './Button'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import React from 'react'
import { useSelector } from '../redux/useSelector'
import { useDispatch } from 'react-redux'
import { isFuturePredictionActiveSelector } from '../redux/selectors'
import { userUpdateFuturePrediction } from '../redux/actions'
import { useTodayPrediction } from '../contexts/PredictionProvider'
import { currentUserSelector } from '../redux/selectors'
import { analytics } from '../services/firebase'

export const Switch = () => {
  const isSwitchedOn = useSelector(isFuturePredictionActiveSelector)
  const dispatch = useDispatch()

  const currentCycleInfo = useTodayPrediction()
  const currentStartDate = currentCycleInfo
  const user = useSelector(currentUserSelector)

  const onYesPress = () => {
    if (!user || isSwitchedOn) {
      return
    }

    dispatch(userUpdateFuturePrediction(true, currentStartDate))
    analytics?.().logEvent('futurePredictionSwitchedOn', {
      user: user.id,
    })
  }

  const onNoPress = () => {
    if (!user || !isSwitchedOn) {
      return
    }

    dispatch(userUpdateFuturePrediction(false, currentStartDate))
    analytics?.().logEvent('futurePredictionSwitchedOff', {
      user: user.id,
    })
  }

  return (
    <View style={styles.container}>
      <Button
        status={isSwitchedOn ? 'primary' : 'basic'}
        style={styles.iconContainer}
        onPress={onYesPress}
      >
        <FontAwesome size={20} name={'check'} color={'#fff'} />
      </Button>
      <Button
        status={!isSwitchedOn ? 'danger' : 'basic'}
        style={styles.iconContainer}
        onPress={onNoPress}
      >
        <FontAwesome size={20} name={'close'} color={'#fff'} />
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  iconContainer: {
    width: 40,
    height: 40,
    margin: 4,
  },
})
