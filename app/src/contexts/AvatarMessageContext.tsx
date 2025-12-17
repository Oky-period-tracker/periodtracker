import React from 'react'
import { useSelector } from 'react-redux'
import { allAvatarText, currentUserSelector } from '../redux/selectors'
import { useScreenFocus } from '../hooks/useScreenFocus'
import _ from 'lodash'
import { useTranslate } from '../hooks/useTranslate'

export type AvatarMessageContext = {
  message: null | string
  setAvatarMessage: (text: string, shouldTranslate?: boolean) => void
}

const defaultValue: AvatarMessageContext = {
  message: null,
  setAvatarMessage: () => {},
}

const AvatarMessageContext = React.createContext<AvatarMessageContext>(defaultValue)

const MESSAGE_DURATION = 5000
const RANDOM_MESSAGE_INTERVAL = 10000

export const AvatarMessageProvider = ({ children }: React.PropsWithChildren) => {
  const allMessages = useSelector(allAvatarText)
  const currentUser = useSelector(currentUserSelector)
  const isScreenFocussed = useScreenFocus()
  const [message, setMessage] = React.useState('')
  const translate = useTranslate()

  // Check if locks are locked
  // If customAvatarUnlocked is true, locks are permanently unlocked regardless of cyclesNumber
  // Otherwise, check if cyclesNumber < 3
  const isLocked = currentUser?.avatar?.customAvatarUnlocked !== true && (currentUser?.cyclesNumber || 0) < 3

  // Track lock messages - show them first when locked
  const lockMessagesRef = React.useRef<{ content: string; id: string }[]>([])
  const currentLockMessageIndexRef = React.useRef(-1) // -1 means we've shown all lock messages or not locked
  const hasShownLockMessagesRef = React.useRef(false)

  // Get lock messages
  const lockMessages = React.useMemo(() => {
    if (!isLocked) {
      return []
    }
    return [
      { content: translate('avatar_message_enter_period_days'), id: 'lock_message_1' },
      { content: translate('avatar_message_keep_entering_period_days'), id: 'lock_message_2' }
    ]
  }, [isLocked, translate])

  // Get available messages (regular messages only, lock messages handled separately)
  const availableMessages = React.useMemo(() => {
    return [...(allMessages || [])]
  }, [allMessages])

  // Update lockMessagesRef when lockMessages changes
  React.useEffect(() => {
    if (isLocked) {
      lockMessagesRef.current = lockMessages
    }
  }, [isLocked, lockMessages])

  // Reset lock message tracking only when lock status changes from unlocked to locked
  const prevIsLockedRef = React.useRef<boolean | undefined>(undefined)
  React.useEffect(() => {
    const wasLocked = prevIsLockedRef.current
    prevIsLockedRef.current = isLocked

    if (isLocked) {
      // Only reset if transitioning from unlocked to locked (or first render)
      if (wasLocked === undefined || !wasLocked) {
        currentLockMessageIndexRef.current = 0 // Start with first lock message
        hasShownLockMessagesRef.current = false
      }
    } else {
      // When unlocking, reset everything
      currentLockMessageIndexRef.current = -1
      hasShownLockMessagesRef.current = false
    }
  }, [isLocked])

  const setAvatarMessage = (text: string, shouldTranslate = false) => {
    setMessage(shouldTranslate ? translate(text) : text)
  }

  const setNextLockMessage = React.useCallback(() => {
    if (lockMessagesRef.current.length === 0 || currentLockMessageIndexRef.current < 0) {
      return false
    }

    const lockMessage = lockMessagesRef.current[currentLockMessageIndexRef.current]
    if (lockMessage) {
      setMessage(lockMessage.content)
      currentLockMessageIndexRef.current++
      
      // If we've shown all lock messages, mark as done
      if (currentLockMessageIndexRef.current >= lockMessagesRef.current.length) {
        currentLockMessageIndexRef.current = -1
        hasShownLockMessagesRef.current = true
      }
      return true
    }
    return false
  }, [])

  const setRandomAvatarMessage = React.useCallback(() => {
    setMessage(_.sample(availableMessages)?.content ?? '')
  }, [availableMessages])

  // ===== Show first message when screen opens ===== //
  React.useEffect(() => {
    if (!isScreenFocussed) {
      return
    }

    // If locked, show first lock message immediately
    if (isLocked && currentLockMessageIndexRef.current === 0 && !hasShownLockMessagesRef.current) {
      const timeout = setTimeout(() => {
        setNextLockMessage()
      }, 100)
      return () => clearTimeout(timeout)
    }

    // If not locked and no message, show random message after a delay
    if (!isLocked && !message && availableMessages.length > 0) {
      const timeout = setTimeout(() => {
        setRandomAvatarMessage()
      }, 500)
      return () => clearTimeout(timeout)
    }
  }, [isScreenFocussed, isLocked, message, availableMessages, setNextLockMessage, setRandomAvatarMessage])

  // ===== Show next message after current message is cleared ===== //
  React.useEffect(() => {
    if (!isScreenFocussed) {
      return
    }

    // If there's a message showing, wait for it to clear
    if (message) {
      return
    }

    // If locked and still have lock messages to show, show next one
    if (isLocked && currentLockMessageIndexRef.current >= 0 && !hasShownLockMessagesRef.current) {
      const timeout = setTimeout(() => {
        setNextLockMessage()
      }, RANDOM_MESSAGE_INTERVAL)
      return () => clearTimeout(timeout)
    }

    // After lock messages are shown (hasShownLockMessagesRef is true), show random messages
    // Also show random messages if not locked
    if ((hasShownLockMessagesRef.current || !isLocked) && availableMessages.length > 0) {
      const timeout = setTimeout(() => {
        setRandomAvatarMessage()
      }, RANDOM_MESSAGE_INTERVAL)
      return () => clearTimeout(timeout)
    }
  }, [message, isScreenFocussed, isLocked, availableMessages, setNextLockMessage, setRandomAvatarMessage])

  // ===== Clear message ===== //
  React.useEffect(() => {
    if (!message) {
      return
    }

    const timeout = setTimeout(() => {
      setMessage('')
    }, MESSAGE_DURATION)

    return () => {
      clearTimeout(timeout)
    }
  }, [message])

  return (
    <AvatarMessageContext.Provider
      value={{
        message,
        setAvatarMessage,
      }}
    >
      {children}
    </AvatarMessageContext.Provider>
  )
}

export const useAvatarMessage = () => {
  return React.useContext(AvatarMessageContext)
}
