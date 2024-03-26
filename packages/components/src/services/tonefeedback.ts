import Sound from 'react-native-sound'
import HapticFeedback from 'react-native-haptic-feedback'
import _ from 'lodash'

export const hapticAndSoundFeedback = _.throttle(
  (toneName: 'bubble' | 'general' | 'warning' | 'close' | 'key') => {
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: true,
    }

    const soundToPlay = toneName === 'key' ? 'keytone.mp3' : `${toneName}_tone.wav`

    const sound = new Sound(soundToPlay, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        return
      }
      sound.setVolume(toneName === 'warning' ? 0.5 : 1)
      sound.play()
    })
    HapticFeedback.trigger('notificationSuccess', options)
  },
  100,
)
