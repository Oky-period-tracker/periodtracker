import React from 'react'
import { useSelector } from 'react-redux'
import { allAvatarText, currentUserSelector, cyclesNumberSelector } from '../redux/selectors'
import { useScreenFocus } from '../hooks/useScreenFocus'
import _ from 'lodash'
import { useTranslate } from '../hooks/useTranslate'
import { useAvatarCustomization } from '../hooks/useAvatarCustomization'

/**
 * Context that manages what the avatar "says" via a speech bubble.
 *
 * Message lifecycle:
 *   1. A message is set (either a lock message, a random message, or an
 *      externally-triggered message via setAvatarMessage).
 *   2. It stays visible for MESSAGE_DURATION (5 s), then auto-clears.
 *   3. After RANDOM_MESSAGE_INTERVAL (10 s) of silence, the next message
 *      is shown automatically.
 *
 * Message priority:
 *   - When the avatar customization is locked, a single lock message is
 *     shown first (based on cycle count: 0 → enter period days,
 *     1-2 → keep entering).
 *   - After the lock message (or if already unlocked), random messages
 *     from the CMS/content pool rotate indefinitely.
 *   - Any part of the app can also push a one-off message via
 *     setAvatarMessage().
 */

export type AvatarMessageContext = {
  message: null | string
  setAvatarMessage: (text: string, shouldTranslate?: boolean) => void
}

const defaultValue: AvatarMessageContext = {
  message: null,
  setAvatarMessage: () => {},
}

const AvatarMessageContext = React.createContext<AvatarMessageContext>(defaultValue)

const MESSAGE_DURATION = 5000 // How long each message stays visible (ms)
const RANDOM_MESSAGE_INTERVAL = 10000 // Delay before showing the next message after the previous one clears (ms)

export const AvatarMessageProvider = ({ children }: React.PropsWithChildren) => {
  const allMessages = useSelector(allAvatarText) // All regular avatar messages from the content store
  const currentUser = useSelector(currentUserSelector)
  const isScreenFocussed = useScreenFocus() // Only cycle messages while the screen is in the foreground
  const [message, setMessage] = React.useState('')
  const translate = useTranslate()
  const isAvatarCustomizationEnabled = useAvatarCustomization()
  const cyclesNumber = useSelector(cyclesNumberSelector) // Number of menstrual cycles the user has logged

  // --- Lock state ---
  // Avatar customization is locked until the user has logged >= 3 cycles,
  // unless they already earned a permanent unlock (customAvatarUnlocked).
  // If the feature flag is off, locks are never shown.
  const isLocked =
    isAvatarCustomizationEnabled &&
    currentUser?.avatar?.customAvatarUnlocked !== true &&
    (cyclesNumber || 0) < 3

  // The single lock message to show, based on how many cycles the user has logged
  const lockMessage = React.useMemo(() => {
    if (!isLocked) {
      return null
    }
    return (cyclesNumber || 0) < 1
      ? translate('avatar_message_enter_period_days')
      : translate('avatar_message_keep_entering_period_days')
  }, [isLocked, cyclesNumber, translate])

  const hasShownLockMessageRef = React.useRef(false)

  // Regular (non-lock) messages available for random rotation
  const availableMessages = React.useMemo(() => {
    return [...(allMessages || [])]
  }, [allMessages])

  // Public setter — allows other components to push a custom message into the bubble
  const setAvatarMessage = (text: string, shouldTranslate = false) => {
    setMessage(shouldTranslate ? translate(text) : text)
  }

  // Picks a random message from the regular pool and displays it
  const setRandomAvatarMessage = React.useCallback(() => {
    setMessage(_.sample(availableMessages)?.content ?? '')
  }, [availableMessages])

  // Shows the lock message, then marks it as shown
  const showLockMessage = React.useCallback(() => {
    if (lockMessage && !hasShownLockMessageRef.current) {
      setMessage(lockMessage)
      hasShownLockMessageRef.current = true
      return true
    }
    return false
  }, [lockMessage])

  // Reset when cycle count changes so the lock message re-appears (e.g. 0→1, 1→2)
  React.useEffect(() => {
    hasShownLockMessageRef.current = false
  }, [cyclesNumber])

  // ===== Effect 1: Show first message when screen opens ===== //
  React.useEffect(() => {
    if (!isScreenFocussed) {
      return
    }

    if (isLocked && lockMessage && !hasShownLockMessageRef.current) {
      const timeout = setTimeout(() => {
        showLockMessage()
      }, 100)
      return () => clearTimeout(timeout)
    }

    if (!isLocked && !message && availableMessages.length > 0) {
      const timeout = setTimeout(() => {
        setRandomAvatarMessage()
      }, 500)
      return () => clearTimeout(timeout)
    }
  }, [
    isScreenFocussed,
    isLocked,
    lockMessage,
    message,
    availableMessages,
    showLockMessage,
    setRandomAvatarMessage,
  ])

  // ===== Effect 2: Queue the next message after the current one is cleared ===== //
  React.useEffect(() => {
    if (!isScreenFocussed || message) {
      return
    }

    if (availableMessages.length > 0) {
      const timeout = setTimeout(() => {
        setRandomAvatarMessage()
      }, RANDOM_MESSAGE_INTERVAL)
      return () => clearTimeout(timeout)
    }
  }, [
    message,
    isScreenFocussed,
    availableMessages,
    setRandomAvatarMessage,
  ])

  // ===== Effect 3: Auto-clear the current message after MESSAGE_DURATION ===== //
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

// Hook for consuming components to read the current message and push custom ones
export const useAvatarMessage = () => {
  return React.useContext(AvatarMessageContext)
}
