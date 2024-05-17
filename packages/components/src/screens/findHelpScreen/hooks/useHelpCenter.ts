import { useState } from 'react'
import { Linking } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { savedHelpCentersSelector } from '../../../redux/selectors/helpCenterSelectors'
import { useHapticAndSound } from '../../../hooks/useHapticAndSound'
import { HelpCenterItem } from '../../../types'
import { saveHelpCenter, unsaveHelpCenter } from '../../../redux/actions'

export const useHelpCenter = (tab) => {
  const [expandedHelpCenters, setExpandedHelpCenters] = useState([])
  const [isConfirmationOpen, setConfirmationOpen] = useState<boolean>(false)
  const [activeLink, setActiveLink] = useState<string>('')
  const [triggerer, setTriggerer] = useState<string>('')
  const dispatch = useDispatch()
  const savedHelpCenters = useSelector(savedHelpCentersSelector)
  const hapticAndSoundFeedback = useHapticAndSound()

  const modifyActiveHelpCenters = (id) => {
    if (expandedHelpCenters.includes(id)) {
      const filtered = expandedHelpCenters.filter((exp) => {
        return exp !== id
      })
      return setExpandedHelpCenters([...filtered])
    }

    setExpandedHelpCenters([...expandedHelpCenters, id])
  }

  const removeEmojis = (str?: string): string => {
    if (!str) {
      return ''
    }
    // Regular expression pattern to match emojis
    const emojiPattern = /[\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E6}-\u{1F1FF}\u{1F191}-\u{1F251}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F1E6}-\u{1F1FF}]/gu

    // Replace emojis with an empty string
    const removedEmojis = str.replace(emojiPattern, '')

    return removedEmojis
  }

  const handleOpenLink = () => {
    hapticAndSoundFeedback('general')
    setConfirmationOpen(false)
    setActiveLink('')
    if (activeLink) {
      const webs = activeLink.split(',')
      webs.forEach((web) => {
        Linking.openURL(triggerer === 'phone' ? `tel:${web}` : web)
      })
    }
  }

  const onPressLink = (link: string, type: 'phone' | 'web') => {
    hapticAndSoundFeedback('general')
    setConfirmationOpen(true)
    setActiveLink(link)
    setTriggerer(type)
  }

  const onCancel = () => {
    hapticAndSoundFeedback('close')
    setConfirmationOpen(false)
    setActiveLink('')
  }

  const onSaveHelpCenter = (helpCenter: HelpCenterItem) => {
    dispatch(saveHelpCenter(helpCenter))
  }

  const onUnsaveHelpCenter = (helpCenter: HelpCenterItem) => {
    const filteredHelpCenters = savedHelpCenters.filter((center) => {
      return center.id !== helpCenter.id
    })
    dispatch(unsaveHelpCenter(filteredHelpCenters))
  }

  return {
    expandedHelpCenters,
    modifyActiveHelpCenters,
    removeEmojis,
    handleOpenLink,
    isConfirmationOpen,
    setConfirmationOpen,
    activeLink,
    setActiveLink,
    onPressLink,
    onCancel,
    onSaveHelpCenter,
    onUnsaveHelpCenter,
    savedHelpCenters,
    triggerer,
  }
}
