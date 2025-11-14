import React from 'react'
import { StyleSheet, View, Image } from 'react-native'
import { getAsset } from '../services/asset'
import { useResponsive } from '../contexts/ResponsiveContext'

interface AvatarLockProps {
  cyclesNumber: number
  style?: any
  showSingleLock?: boolean // New prop to show only 1 lock instead of 3
}

export const AvatarLock = ({ cyclesNumber, style, showSingleLock = false }: AvatarLockProps) => {
  const locks = showSingleLock ? [1] : [1, 2, 3] // Show 1 lock for avatar selection, 3 for calendar
  const { UIConfig } = useResponsive()

  return (
    <View style={[styles.container, style]}>
      {locks.map((lockNumber) => {
        // For single lock (avatar selection), check if user has 3+ cycles
        // For 3 locks (calendar), check if user has reached that specific lock number
        const isUnlocked = showSingleLock 
          ? cyclesNumber >= 3 
          : cyclesNumber >= lockNumber
        
        const iconSource = isUnlocked 
          ? getAsset('icons.unlocked') 
          : getAsset('icons.locked')

        return (
          <Image
            key={lockNumber}
            source={iconSource}
            style={[styles.lockIcon, { 
              width: UIConfig.progressSection.iconSize + 4, 
              height: UIConfig.progressSection.iconSize + 4 
            }]}
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
  lockIcon: {
    // Size is now set dynamically based on UIConfig.progressSection.iconSize
  },
})
