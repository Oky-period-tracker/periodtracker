import React, { FunctionComponent } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useHelpCenter } from '../hooks/useHelpCenter'
import { ModalAlert } from './ModalAlert'
import { Text, TextWithoutTranslation as TextWT } from '../../../components/common/Text'
import { HelpCenterUI } from '../../../types'
import { HelpCenters } from '@oky/core'
import { useHapticAndSound } from '../../../hooks/useHapticAndSound'
import { PrimaryButton } from '../../../components/common/buttons/PrimaryButton'
import Icon from 'react-native-vector-icons/Feather'

interface IHelpCenter {
  helpCenters?: HelpCenters
  type: string
}

export const HelpCenterSection: FunctionComponent<IHelpCenter> = ({ helpCenters, type }) => {
  const hapticAndSoundFeedback = useHapticAndSound()

  const {
    isConfirmationOpen,
    setConfirmationOpen,
    onPressLink,
    onCancel,
    onSaveHelpCenter,
    onUnsaveHelpCenter,
    savedHelpCenters,
    handleOpenLink,
    triggerer,
  } = useHelpCenter()

  const data = type === HelpCenterUI.HC ? helpCenters : savedHelpCenters

  if (!data?.length) {
    if (type === HelpCenterUI.HC) {
      return (
        <View style={styles.card}>
          <Text>empty_hc</Text>
          <Text>empty_hc_2</Text>
        </View>
      )
    }
    return (
      <View style={styles.card}>
        <Text>empty_saved</Text>
      </View>
    )
  }

  return (
    <>
      <ScrollView>
        {data?.map((helpCenter, i) => {
          const isSaved = savedHelpCenters.find((item) => item.id === helpCenter.id)
          const onButtonPress = () => {
            hapticAndSoundFeedback('general')
            if (HelpCenterUI.HC === type && !isSaved) {
              onSaveHelpCenter(helpCenter)
              return
            }

            if (HelpCenterUI.SAVED_HC === type) {
              onUnsaveHelpCenter(helpCenter)
            }
          }

          const buttonText =
            HelpCenterUI.HC === type && isSaved ? 'saved' : isSaved ? 'unsave' : 'save'

          return (
            <HelpCenterItemCard
              key={`help-center-${helpCenter.id}`}
              helpCenter={helpCenter}
              isSaved={isSaved}
              onButtonPress={onButtonPress}
              buttonText={buttonText}
              onPressLink={onPressLink}
            />
          )
        })}
      </ScrollView>
      <ModalAlert
        isOpen={isConfirmationOpen}
        setOpen={setConfirmationOpen}
        onConfirm={() => handleOpenLink()}
        onCancel={onCancel}
        translations={{
          title: 'cm_wait',
          message1: triggerer === 'web' ? 'cm_wait_message1' : 'cm_wait_message1_2',
          message2: 'cm_wait_message2',
          buttonCancel: 'cm_button_cancel',
          buttonProceed: 'cm_button_proceed',
        }}
      />
    </>
  )
}

const HelpCenterItemCard = ({ helpCenter, isSaved, onButtonPress, buttonText, onPressLink }) => {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const toggleExpanded = () => setIsExpanded((current) => !current)
  const hapticAndSoundFeedback = useHapticAndSound()

  const buttonStyle = isSaved ? styles.unSaveButton : styles.saveButton

  const locationString = [
    helpCenter.address ?? '',
    helpCenter.place ?? '',
    helpCenter?.location ?? '',
  ]
    .filter((item) => item.length)
    .join(', ')

  return (
    <TouchableOpacity
      key={`hc-${helpCenter.id}`}
      style={styles.card}
      onPress={() => {
        hapticAndSoundFeedback('general')
        toggleExpanded()
      }}
    >
      <View style={styles.cardLeft}>
        <TextWT style={styles.emoji}>{helpCenter.emoji}</TextWT>
      </View>
      <View style={styles.cardRight}>
        <TextWT style={styles.title}>{helpCenter.title}</TextWT>
        {isExpanded && <TextWT>{helpCenter.attributeName}</TextWT>}

        {locationString ? <TextWT style={styles.location}>{locationString}</TextWT> : null}
        {isExpanded ? (
          <>
            <TextWT>{helpCenter.caption}</TextWT>

            <TouchableOpacity
              style={styles.link}
              onPress={() =>
                onPressLink(`${helpCenter.contactOne},${helpCenter.contactTwo}`, 'phone')
              }
            >
              <TextWT style={styles.linkText}>
                <Icon name="phone" size={15} />
                {` ${helpCenter.contactOne} ${helpCenter.contactTwo}`}
              </TextWT>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.link}
              onPress={() => onPressLink(helpCenter.website, 'web')}
            >
              <TextWT style={styles.linkText}>
                <Icon name="link-2" size={15} />
                {` ${helpCenter.website}`}
              </TextWT>
            </TouchableOpacity>

            <PrimaryButton
              style={[styles.button, buttonStyle]}
              textStyle={buttonStyle}
              onPress={onButtonPress}
            >
              {buttonText}
            </PrimaryButton>
          </>
        ) : null}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    width: '100%',
    marginVertical: 4,
    borderRadius: 10,
    padding: 16,
    flexDirection: 'row',
  },
  cardLeft: {
    minWidth: 32,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardRight: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    marginBottom: 2,
    color: '#ff9e00',
  },
  location: {
    color: '#db307a',
  },
  link: {
    marginBottom: 8,
  },
  linkText: {
    color: '#0000EE',
    textDecorationLine: 'underline',
  },
  button: {
    width: 80,
    height: 32,
  },
  saveButton: {
    backgroundColor: '#db307a',
    color: '#fff',
  },
  unSaveButton: {
    backgroundColor: '#ed85b2',
    color: '#fff',
  },
  emoji: {
    fontSize: 25,
  },
})
