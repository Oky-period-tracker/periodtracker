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
 *   - When the avatar customization is locked, a fixed sequence of "lock
 *     messages" is shown first (explaining how to unlock).
 *   - Once all lock messages have been displayed (or if already unlocked),
 *     random messages from the CMS/content pool rotate indefinitely.
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

  // --- Lock-message sequencing refs (mutable, survives re-renders) ---
  const lockMessagesRef = React.useRef<{ content: string; id: string }[]>([])
  const currentLockMessageIndexRef = React.useRef(-1) // -1 = all lock messages shown (or not locked)
  const hasShownLockMessagesRef = React.useRef(false) // Becomes true once every lock message has been displayed

  // The fixed set of lock messages shown sequentially when locked
  const lockMessages = React.useMemo(() => {
    if (!isLocked) {
      return []
    }
    return [
      { content: translate('avatar_message_enter_period_days'), id: 'lock_message_1' },
      { content: translate('avatar_message_keep_entering_period_days'), id: 'lock_message_2' },
    ]
  }, [isLocked, translate])

  // Regular (non-lock) messages available for random rotation
  const availableMessages = React.useMemo(() => {
    return [...(allMessages || [])]
  }, [allMessages])

  // Keep the ref in sync with the memoized lock messages
  React.useEffect(() => {
    if (isLocked) {
      lockMessagesRef.current = lockMessages
    }
  }, [isLocked, lockMessages])

  // When transitioning from unlocked → locked (or on first render while locked),
  // reset the index so lock messages play from the beginning
  const prevIsLockedRef = React.useRef<boolean | undefined>(undefined)
  React.useEffect(() => {
    const wasLocked = prevIsLockedRef.current
    prevIsLockedRef.current = isLocked

    if (isLocked) {
      if (wasLocked === undefined || !wasLocked) {
        currentLockMessageIndexRef.current = 0
        hasShownLockMessagesRef.current = false
      }
    } else {
      currentLockMessageIndexRef.current = -1
      hasShownLockMessagesRef.current = false
    }
  }, [isLocked])

  // Public setter — allows other components to push a custom message into the bubble
  const setAvatarMessage = (text: string, shouldTranslate = false) => {
    setMessage(shouldTranslate ? translate(text) : text)
  }

  // Advances the lock-message sequence by one step.
  // Returns true if a message was shown, false if there are none left.
  const setNextLockMessage = React.useCallback(() => {
    if (lockMessagesRef.current.length === 0 || currentLockMessageIndexRef.current < 0) {
      return false
    }

    const lockMessage = lockMessagesRef.current[currentLockMessageIndexRef.current]
    if (lockMessage) {
      setMessage(lockMessage.content)
      currentLockMessageIndexRef.current++

      if (currentLockMessageIndexRef.current >= lockMessagesRef.current.length) {
        currentLockMessageIndexRef.current = -1
        hasShownLockMessagesRef.current = true
      }
      return true
    }
    return false
  }, [])

  // Picks a random message from the regular pool and displays it
  const setRandomAvatarMessage = React.useCallback(() => {
    setMessage(_.sample(availableMessages)?.content ?? '')
  }, [availableMessages])

  // ===== Effect 1: Show first message when screen opens ===== //
  // Fires once when the screen gains focus. If locked, immediately starts
  // the lock-message sequence; otherwise picks a random message.
  React.useEffect(() => {
    if (!isScreenFocussed) {
      return
    }

    if (isLocked && currentLockMessageIndexRef.current === 0 && !hasShownLockMessagesRef.current) {
      const timeout = setTimeout(() => {
        setNextLockMessage()
      }, 100) // Small delay to let the screen settle
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
    message,
    availableMessages,
    setNextLockMessage,
    setRandomAvatarMessage,
  ])

  // ===== Effect 2: Queue the next message after the current one is cleared ===== //
  // Waits RANDOM_MESSAGE_INTERVAL after the message disappears, then shows
  // either the next lock message or a random one.
  React.useEffect(() => {
    if (!isScreenFocussed) {
      return
    }

    // Wait until the current message has been cleared before scheduling the next
    if (message) {
      return
    }

    // Still have lock messages to go through
    if (isLocked && currentLockMessageIndexRef.current >= 0 && !hasShownLockMessagesRef.current) {
      const timeout = setTimeout(() => {
        setNextLockMessage()
      }, RANDOM_MESSAGE_INTERVAL)
      return () => clearTimeout(timeout)
    }

    // Lock messages done (or never locked) — rotate random messages
    if ((hasShownLockMessagesRef.current || !isLocked) && availableMessages.length > 0) {
      const timeout = setTimeout(() => {
        setRandomAvatarMessage()
      }, RANDOM_MESSAGE_INTERVAL)
      return () => clearTimeout(timeout)
    }
  }, [
    message,
    isScreenFocussed,
    isLocked,
    availableMessages,
    setNextLockMessage,
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
