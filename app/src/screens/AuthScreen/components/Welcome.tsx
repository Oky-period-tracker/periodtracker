import React from 'react'
import { StyleSheet } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { Swiper } from '../../../components/Swiper'
import { useAuthMode } from '../AuthModeContext'
import { UserIcon } from '../../../components/icons/UserIcon'
import { WelcomeCard } from './WelcomeCard'
import { NotificationCard } from './NotificationCard'
import { useDispatch } from 'react-redux'
import { setHasOpened } from '../../../redux/actions'
import { FullScreen } from '../../../components/Screen'

export const Welcome = () => {
  const [index, setIndex] = React.useState(0)
  const dispatch = useDispatch()
  const { setAuthMode } = useAuthMode()

  const completeWelcomeFlow = React.useCallback(() => {
    dispatch(setHasOpened(true))
    setAuthMode('start')
  }, [dispatch, setAuthMode])

  const pages = [
    <WelcomeCard
      icon={<FontAwesome name={'calendar-check-o'} size={ICON_SIZE} color="white" />}
      subtitle={'calendar'}
      description={'calendar_onboard'}
    />,
    <WelcomeCard
      icon={<FontAwesome name={'file-text'} size={ICON_SIZE} color="white" />}
      subtitle={'the_facts'}
      description={'the_facts_onboard'}
    />,
    <WelcomeCard
      icon={<UserIcon size={ICON_SIZE} />}
      subtitle={'friend'}
      description={'friends_onboard'}
    />,
    <NotificationCard onYes={completeWelcomeFlow} onNo={completeWelcomeFlow} />,
  ]

  return (
    <FullScreen>
      <Swiper index={index} setIndex={setIndex} pages={pages} />
    </FullScreen>
  )
}

const ICON_SIZE = 40

const styles = StyleSheet.create({})
