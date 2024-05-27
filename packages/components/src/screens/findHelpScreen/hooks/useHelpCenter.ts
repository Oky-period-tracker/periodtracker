import { useState } from 'react'
import { Linking } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { savedHelpCentersSelector } from '../../../redux/selectors/helpCenterSelectors'
import { useHapticAndSound } from '../../../hooks/useHapticAndSound'
import { HelpCenterItem } from '../../../types'
import { saveHelpCenter, unsaveHelpCenter } from '../../../redux/actions'

export const useHelpCenter = () => {
  const [isConfirmationOpen, setConfirmationOpen] = useState<boolean>(false)
  const [activeLink, setActiveLink] = useState<string>('')
  const [triggerer, setTriggerer] = useState<string>('')
  const dispatch = useDispatch()
  const savedHelpCenters = useSelector(savedHelpCentersSelector)
  const hapticAndSoundFeedback = useHapticAndSound()

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
