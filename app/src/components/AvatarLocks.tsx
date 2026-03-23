import React from 'react'
import { StyleSheet, View, Image } from 'react-native'
import { getAsset } from '../services/asset'
import { useResponsive } from '../contexts/ResponsiveContext'
import { useSelector } from '../redux/useSelector'
import { currentUserSelector, cyclesNumberSelector } from '../redux/selectors'

export const AvatarLocks = () => {
  const locks = [1, 2, 3] // Show 1 lock for avatar selection, 3 for calendar
  const { UIConfig } = useResponsive()
  const cyclesNumber = useSelector(cyclesNumberSelector)
  const currentUser = useSelector(currentUserSelector)

  return (
    <View style={[styles.container]}>
      {locks.map((lockNumber) => {
        // Unlock if user cycles number is greater than current lock number
        const isUnlocked = cyclesNumber >= lockNumber || currentUser?.avatar?.customAvatarUnlocked === true
        
        const iconSource = isUnlocked 
          ? getAsset('icons.unlocked') 
          : getAsset('icons.locked')

        return (
          <Image
            key={lockNumber}
            source={iconSource}
            style={{
              width: UIConfig.progressSection.iconSize + 4, 
              height: UIConfig.progressSection.iconSize + 4 
            }}
            resizeMode="contain"
          />
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
})
