import React from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { JourneyStep, useJourney } from '../JourneyContext'
import { JourneyCollect } from './JourneyCollect'
import { journeyConfig } from '../journeyConfig'
import { Vr } from '../../../../../components/Vr'
import { Text } from '../../../../../components/Text'
import { useSelector } from '../../../../../redux/useSelector'
import { currentAvatarSelector } from '../../../../../redux/selectors'
import { getAsset } from '../../../../../services/asset'
import { useColor } from '../../../../../hooks/useColor'

type Status = 'unknown' | 'no' | 'yes'

export const JourneyCard = ({ step }: { step: JourneyStep }) => {
  const { backgroundColor, borderColor, palette } = useColor()

  const { state, dispatch } = useJourney()
  const [status, setStatus] = React.useState<Status>('unknown')

  const selectedAvatar = useSelector(currentAvatarSelector)

  const { questionText, noText, yesText } = journeyConfig[step]

  const onNo = () => {
    setStatus('no')
  }

  const onYes = () => {
    if (step === 'first_period') {
      dispatch({ type: 'isActive', value: true })
    }

    setStatus('yes')
  }

  const onConfirm = () => {
    if (step === 'first_period' && !state.isActive) {
      dispatch({ type: 'skip' })
      return
    }

    dispatch({ type: 'continue' })
  }

  React.useEffect(() => {
    // Reset after animation
    const timeout = setTimeout(() => {
      setStatus('unknown')
    }, 300) // Slide animation duration

    return () => {
      clearTimeout(timeout)
    }
  }, [state.stepIndex])

  const no = state.stepIndex === 0 ? 'No' : 'dont_remember'
  const yes = state.stepIndex === 0 ? 'Yes' : 'remember'

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.body}>
        {status === 'unknown' && (
          <>
            <View style={styles.imageWrapper}>
              <Image
                resizeMode="contain"
                source={getAsset(`avatars.${selectedAvatar}.bubbles`)}
                style={styles.image}
              />
            </View>
            <Text style={[styles.question, { color: palette.secondary.text }]}>{questionText}</Text>
            <Text style={styles.disclaimer}>survey_description</Text>
          </>
        )}
        {status === 'yes' && (
          <>
            <Text style={[styles.yesTitle, { color: palette.secondary.text }]}>{yesText}</Text>
            <JourneyCollect step={step} />
          </>
        )}
        {status === 'no' && (
          <View style={styles.no}>
            <Image
              resizeMode="contain"
              source={getAsset(`avatars.${selectedAvatar}.stationary_colour`)}
              style={styles.image}
            />
            <Text style={styles.response}>{noText}</Text>
          </View>
        )}
      </View>

      <View style={[styles.buttons, { borderColor }]}>
        {status === 'unknown' ? (
          <>
            <TouchableOpacity onPress={onNo} style={styles.button}>
              <Text style={styles.buttonText}>{no}</Text>
            </TouchableOpacity>
            <Vr />
            <TouchableOpacity onPress={onYes} style={styles.button}>
              <Text style={styles.buttonText}>{yes}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity onPress={onConfirm} style={styles.button}>
            <Text style={styles.buttonText}>confirm</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    maxWidth: 800,
    borderRadius: 20,
  },
  body: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 24,
  },
  no: {
    alignItems: 'center',
  },
  imageWrapper: {
    alignItems: 'center',
  },
  image: {
    marginBottom: 48,
  },
  disclaimer: {
    textAlign: 'center',
  },
  question: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 48,
  },
  yesTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 24,
  },
  response: {
    textAlign: 'center',
  },
  buttons: {
    alignSelf: 'flex-end',
    width: '100%',
    flexDirection: 'row',
    borderTopWidth: 1,
  },
  button: {
    flex: 1,
    padding: 24,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
})
