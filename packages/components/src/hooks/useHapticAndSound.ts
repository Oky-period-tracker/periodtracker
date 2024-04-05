import Sound from 'react-native-sound'
import HapticFeedback from 'react-native-haptic-feedback'
import _ from 'lodash'
import { useSelector } from './useSelector'
import * as selectors from '../redux/selectors'
import { HAPTIC_AND_SOUND_ENABLED } from '../config'

type ToneName = 'bubble' | 'general' | 'warning' | 'close' | 'key'

export const useHapticAndSound = () => {
  const hasHaptic = useSelector(selectors.isHapticActiveSelector)
  const hasSound = useSelector(selectors.isSoundActiveSelector)

  const hapticAndSoundFeedback = (toneName: ToneName) => {
    if (!HAPTIC_AND_SOUND_ENABLED) {
      return
    }

    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: true,
    }

    const soundToPlay = toneName === 'key' ? 'keytone.mp3' : `${toneName}_tone.wav`
    if (hasSound) {
      const sound = new Sound(soundToPlay, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          return
        }
        sound.setVolume(toneName === 'warning' ? 0.5 : 1)
        sound.play()
      })
    }
    if (hasHaptic) {
      HapticFeedback.trigger('notificationSuccess', options)
    }
  }

  return _.throttle(hapticAndSoundFeedback, 100)
}
