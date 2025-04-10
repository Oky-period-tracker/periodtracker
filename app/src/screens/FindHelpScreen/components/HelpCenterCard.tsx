import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Text } from '../../../components/Text'
import { A } from '../../../components/A'
import { useToggle } from '../../../hooks/useToggle'
import { Button } from '../../../components/Button'
import { HelpCenter } from '../../../core/types'
import { globalStyles } from '../../../config/theme'
import { useSelector } from '../../../redux/useSelector'
import { currentUserSelector, helpCenterAttributesSelector } from '../../../redux/selectors'
import { analytics } from '../../../services/firebase'
import { useAuth } from '../../../contexts/AuthContext'
import { useColor } from '../../../hooks/useColor'

export const HelpCenterCard = ({
  helpCenter,
  isSaved,
  onSavePress,
}: {
  helpCenter: HelpCenter
  isSaved: boolean
  onSavePress: () => void
}) => {
  const [expanded, toggleExpanded] = useToggle()
  const helpCenterAttributes = useSelector(helpCenterAttributesSelector)

  const user = useSelector(currentUserSelector)
  const { isLoggedIn } = useAuth()
  const hasAccess = user && isLoggedIn
  const { backgroundColor } = useColor()

  const onPress = () => {
    toggleExpanded()

    if (expanded) {
      return
    }

    if (hasAccess) {
      analytics?.().logEvent('helpCenterPressedLoggedIn', {
        userId: user.id,
        helpCenterId: helpCenter.id,
        helpCenterTitle: helpCenter.title,
      })
    } else {
      analytics?.().logEvent('helpCenterPressedLoggedOut', {
        helpCenterId: helpCenter.id,
        helpCenterTitle: helpCenter.title,
      })
    }
  }

  const websites = helpCenter.website?.split(',')

  const emoji = React.useMemo(() => {
    return (
      helpCenterAttributes.find((item) => item.id === helpCenter.primaryAttributeId)?.emoji ??
      defaultEmoji
    )
  }, [helpCenter])

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.helpCenterCard, globalStyles.shadow, { backgroundColor }]}
    >
      <View style={styles.topRow}>
        <View style={styles.topRowText}>
          <Text style={styles.title} enableTranslate={false}>
            {helpCenter.title}
          </Text>
          <Text style={styles.caption} enableTranslate={false}>
            {helpCenter.caption}
          </Text>
        </View>
        <Text style={styles.emoji} enableTranslate={false}>
          {emoji}
        </Text>
        <Button
          style={styles.saveButton}
          status={isSaved ? 'danger' : 'basic'}
          onPress={onSavePress}
        >
          <Ionicons size={18} name={isSaved ? `heart` : `heart-outline`} color={'#fff'} />
        </Button>
      </View>

      {expanded && (
        <>
          <Text style={styles.subtitle}>card_phone_number</Text>
          <Text style={styles.text} enableTranslate={false}>
            {helpCenter.contactOne}
          </Text>
          {helpCenter.contactTwo && (
            <Text style={styles.text} enableTranslate={false}>
              {helpCenter.contactTwo}
            </Text>
          )}

          <Text style={styles.subtitle}>card_address</Text>
          <Text style={styles.text} enableTranslate={false}>
            {helpCenter.address}
          </Text>
          {/* TODO: Region and Subregion */}

          <Text style={styles.subtitle} enableTranslate={false}>
            website
          </Text>
          {websites.map((website) => (
            <A key={website} href={website} style={styles.website}>
              {website}
            </A>
          ))}

          {/* TODO: Display all attributes */}
        </>
      )}
    </TouchableOpacity>
  )
}

const defaultEmoji = '😊'

const styles = StyleSheet.create({
  helpCenterCard: {
    borderRadius: 20,
    width: '100%',
    marginVertical: 4,
    padding: 24,
  },
  saveButton: {
    width: 40,
    height: 40,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topRowText: {
    flexDirection: 'column',
    flex: 1,
  },
  text: {
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontWeight: 'bold',
  },
  caption: {
    marginBottom: 8,
  },
  emoji: {
    marginHorizontal: 8,
    width: 24,
    textAlign: 'center',
  },
  website: {
    marginBottom: 8,
  },
})
