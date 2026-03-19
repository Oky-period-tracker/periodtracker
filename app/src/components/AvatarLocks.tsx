import React from 'react'
import { View, Image } from 'react-native'
import { getAsset } from '../services/asset'
import { useResponsive } from '../contexts/ResponsiveContext'
import { StyleSheet } from 'react-native'

interface AvatarLocksProps {
  cyclesNumber: number
  customAvatarUnlocked?: boolean // If true, all locks are permanently unlocked regardless of cyclesNumber
}

export const AvatarLocks = ({ cyclesNumber, customAvatarUnlocked = false }: AvatarLocksProps) => {
  const locks = [1, 2, 3]
  const { UIConfig } = useResponsive()

  return (
    <View style={[styles.container]}>
      {locks.map((lockNumber) => {
        let isUnlocked = false;
        if (customAvatarUnlocked) {
          isUnlocked = true;
        } else {
          if (cyclesNumber >= 3) {
            isUnlocked = true;
          } else {
            isUnlocked = cyclesNumber >= lockNumber
          }
        }
        
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
  lockIcon: {},
})
