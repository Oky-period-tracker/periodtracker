import React from 'react'
import { View, Image } from 'react-native'
import { getAsset } from '../../services/asset'
import { useResponsive } from '../../contexts/ResponsiveContext'
import { styles } from './AvatarLocks.styles'
import { useSelector } from '../../redux/useSelector'
import { currentUserSelector, cyclesNumberSelector } from '../../redux/selectors'
import { useAvatarCustomization } from '../../hooks/useAvatarCustomization'

/**
 * Displays a row of lock/unlock icons representing the user's progress toward unlocking the custom avatar.
 * Locks open based on the number of completed menstrual cycles or if the avatar has been manually unlocked.
 */
export const AvatarLocks = () => {
  const locks = [1, 2, 3]
  const { UIConfig } = useResponsive()
  const user = useSelector(currentUserSelector)
  const cyclesNumber = useSelector(cyclesNumberSelector)
  const isAvatarCustomizationEnabled = useAvatarCustomization()

  if (!isAvatarCustomizationEnabled) return null

  return (
    <View style={[styles.container]}>
      {locks.map((lockNumber) => {
        // If customAvatarUnlocked is true, all locks are permanently unlocked
        // Otherwise, check cyclesNumber: for single lock (avatar selection), check if user has 3+ cycles
        // For 3 locks (calendar), check if user has reached that specific lock number
        const isUnlocked =
          user?.avatar?.customAvatarUnlocked || cyclesNumber >= 3
            ? true
            : cyclesNumber >= lockNumber

        const iconSource = isUnlocked ? getAsset('icons.unlocked') : getAsset('icons.locked')

        return (
          <Image
            key={lockNumber}
            source={iconSource}
            style={[
              styles.lockIcon,
              {
                width: UIConfig.progressSection.iconSize + 4,
                height: UIConfig.progressSection.iconSize + 4,
              },
            ]}
            resizeMode="contain"
          />
        )
      })}
    </View>
  )
}
