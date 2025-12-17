import { StyleSheet } from 'react-native'
import { UIConfig } from '../../config/UIConfig'
import { globalStyles } from '../../config/theme'
import { scaleHorizontal, scaleVertical } from '../../utils/responsive'
import { getResponsiveMargin } from '../../utils/layoutCalculations'

export const createAvatarScreenStyles = (
  avatarConfig: UIConfig['avatarSelection'],
  avatarWidth: number,
  hasGoBack: boolean,
  isInitialSelection: boolean,
  reminderMaxWidth: number,
  screenWidth: number,
  hasHeader: boolean = false
) =>
  StyleSheet.create({
    screen: {
      flex: 1,
    },
    backgroundImage: {
      flex: 1,
      width: '100%',
    },
    backgroundImageStyle: {
      opacity: 1,
    },
    scrollView: {
    },
    scrollContent: {
      // Reduce top padding when header is shown (header already provides spacing)
      paddingTop: hasHeader ? 16 : avatarConfig.paddingTop,
      paddingBottom: avatarConfig.buttonPaddingTop + avatarConfig.buttonPaddingBottom,
    },
    // Three separate containers, each with same width percentage
    // Max width constraint for large tablets (prevents content from becoming too wide)
    topMessageContainer: {
      width: `${avatarConfig.contentContainerWidthPercent}%`,
      maxWidth: 1200, // Cap at 1200px for large tablets
      alignSelf: 'center',
      marginBottom: 20,
    },
    avatarsContainer: {
      width: `${avatarConfig.avatarsContainerWidthPercent}%`,
      maxWidth: 1200, // Cap at 1200px for large tablets
      alignSelf: 'center',
      marginBottom: 20,
    },
    reminderContainer: {
      width: `${avatarConfig.contentContainerWidthPercent}%`,
      maxWidth: 1200, // Cap at 1200px for large tablets
      alignSelf: 'center',
      marginBottom: 20,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      width: '100%',
    },
    titleSpacer: {
      width: '20%',
      justifyContent: 'flex-end',
      alignItems: 'flex-start',
    },
    logo: {
      width: 50,
      height: 50,
      marginRight: 12,
      marginBottom: 4,
    },
    titleBox: {
      ...globalStyles.selectionTitleBox,
      width: '80%',
      ...globalStyles.shadow,
      ...globalStyles.elevation,
    },
    title: {
      fontFamily: 'Roboto',
      fontWeight: '700',
      fontStyle: 'normal',
      fontSize: avatarConfig.titleFontSize,
      lineHeight: avatarConfig.titleLineHeight,
      letterSpacing: 0,
      marginBottom: 8,
    },
    subtitle: {
      fontFamily: 'Roboto',
      fontWeight: '400',
      fontStyle: 'normal',
      fontSize: avatarConfig.subtitleFontSize,
      lineHeight: avatarConfig.subtitleLineHeight,
      letterSpacing: 0,
    },
    avatars: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
      width: '100%',
    },
    avatar: {
      height: avatarConfig.avatarSize.height,
      marginHorizontal: getResponsiveMargin(screenWidth, {
        xs: 3,
        sm: 3,
        md: 3,
        lg: avatarConfig.avatarMarginHorizontal || 4,
        xl: 2,
      }),
      marginVertical: (() => {
        if (screenWidth <= 360) {
          return scaleVertical(10)
        } else if (screenWidth > 360 && screenWidth <= 392) {
          return scaleVertical(10)
        } else if (screenWidth > 392 && screenWidth <= 411) {
          return scaleVertical(10)
        } else if (screenWidth > 411 && screenWidth <= 480) {
          return scaleVertical(10)
        } else if (screenWidth > 480 && screenWidth <= 600) {
          return Math.max(24, avatarConfig.avatarMarginVertical * 1.5)
        } else if (screenWidth > 600 && screenWidth <= 720) {
          return Math.max(30, avatarConfig.avatarMarginVertical * 1.6)
        } else if (screenWidth > 720 && screenWidth <= 840) {
          return Math.max(32, avatarConfig.avatarMarginVertical * 1.8)
        } else if (screenWidth > 840 && screenWidth <= 1200) {
          return Math.max(26, avatarConfig.avatarMarginVertical * 2.0)
        } else {
          return Math.max(30, avatarConfig.avatarMarginVertical * 2.2)
        }
      })(),
    },
    avatarBody: {
      borderWidth: 0,
      overflow: 'visible',
      width: '100%',
      height: '100%',
      borderRadius: avatarConfig.avatarBorderRadius,
      position: 'relative',
    },
    imageWrapper: {
      width: '100%',
      height: '100%',
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarSelectedBorderOverlay: {
      position: 'absolute',
      borderColor: '#4CAF50',
      borderWidth: avatarConfig.borderWidth,
      borderRadius: avatarConfig.avatarBorderRadius,
      pointerEvents: 'none',
      zIndex: 1,
    },
    check: {
      position: 'absolute',
      zIndex: 10,
      backgroundColor: '#A4D233',
      borderRadius: (avatarConfig.iconSize * 2) / 2,
      width: avatarConfig.iconSize * 2,
      height: avatarConfig.iconSize * 2,
      justifyContent: 'center',
      alignItems: 'center',
      // Push icon further out for this layout
      right: -avatarConfig.iconSize * 0.2,
      top: -avatarConfig.iconSize * 0.2,
    },
    editIconContainer: {
      position: 'absolute',
      backgroundColor: '#A4D233',
      borderRadius: (avatarConfig.iconSize * 2) / 2,
      width: avatarConfig.iconSize * 2,
      height: avatarConfig.iconSize * 2,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
      // Push icon further out for this layout
      right: -avatarConfig.iconSize * 0.2,
      top: -avatarConfig.iconSize * 0.2,
    },
    pendingIconContainer: {
      position: 'absolute',
      backgroundColor: '#FF8C00',
      borderRadius: (avatarConfig.iconSize * 2) / 2,
      width: avatarConfig.iconSize * 2,
      height: avatarConfig.iconSize * 2,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
      // Push icon further out for this layout
      right: -avatarConfig.iconSize * 0.2,
      top: -avatarConfig.iconSize * 0.2,
    },
    grayIconContainer: {
      position: 'absolute',
      backgroundColor: '#D1D0D2',
      borderRadius: (avatarConfig.iconSize * 2) / 2,
      width: avatarConfig.iconSize * 2,
      height: avatarConfig.iconSize * 2,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
      // Push icon further out for this layout
      right: -avatarConfig.iconSize * 0.2,
      top: -avatarConfig.iconSize * 0.2,
    },
    avatarImage: {
      width: '100%',
      height: '100%',
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: avatarConfig.avatarBorderRadius,
      overflow: 'visible',
      position: 'relative',
    },
    friendAvatarImage: {
      width: '100%',
      height: '100%',
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: avatarConfig.avatarBorderRadius,
      overflow: 'visible',
      position: 'relative',
    },
    avatarPreviewContainer: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginTop: screenWidth > 720 ? 6 : screenWidth > 600 && screenWidth <= 720 ? 5 : 0,
    },
    avatarPreview: {
      position: 'absolute',
      alignSelf: 'center',
      transform: [{ translateX: -3 }],
    },
    // White container (sized to be border around image)
    avatarWhiteContainer: {
      backgroundColor: '#FFFFFF',
      borderRadius: avatarConfig.avatarBorderRadius,
      // Green border when selected/active
      borderWidth: 2,
      borderColor: '#A4D233',
    },
    // White container without green border (default state)
    avatarWhiteContainerDefault: {
      backgroundColor: '#FFFFFF',
      borderRadius: avatarConfig.avatarBorderRadius,
      borderWidth: 1,
      borderColor: '#EFEFEF', // Light gray border
    },
    standardAvatarSvgContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    friendAvatarContainer: {
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'visible',
    },
    name: {
      position: 'absolute',
      top: screenWidth <= 360
        ? -5
        : screenWidth > 360 && screenWidth <= 392
        ? 8  // Pushed to bottom more for 392dp
        : screenWidth > 392 && screenWidth <= 411
        ? 2
        : screenWidth > 411 && screenWidth <= 480
        ? -7
        : screenWidth > 480 && screenWidth <= 600
        ? -7
        : screenWidth > 600 && screenWidth <= 720
        ? -8
        : -9,
      left: 0,
      width: '100%',
      fontFamily: 'Roboto',
      fontWeight: '700',
      fontStyle: 'normal',
      textAlign: 'center',
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0,
      zIndex: 20,
    },
    lockedAvatar: {
      opacity: 0.6,
    },
    lockOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      borderRadius: avatarConfig.avatarBorderRadius,
    },
    reminderInnerContainer: {
      flexDirection: 'row',
      width: '100%',
    },
    reminderSpacer: {
      width: '20%',
    },
    reminderBox: {
      flexDirection: 'row',
      ...globalStyles.messageBox,
      borderTopLeftRadius: 0,
      alignItems: 'flex-start',
      width: '80%',
      ...globalStyles.shadow,
      ...globalStyles.elevation,
    },
    reminderIconContainer: {
      marginRight: 10,
      marginTop: 2,
    },
    reminderIcon: {
      width: avatarConfig.reminderIconSize,
      height: avatarConfig.reminderIconSize,
    },
    reminderText: {
      flex: 1,
      fontFamily: 'Roboto',
      fontWeight: '400',
      fontStyle: 'normal',
      fontSize: avatarConfig.reminderFontSize,
      lineHeight: avatarConfig.reminderLineHeight,
      letterSpacing: 0,
    },
    buttonContainer: {
      flexDirection: 'row',
      paddingHorizontal: avatarConfig.buttonPaddingHorizontal,
      paddingTop: avatarConfig.buttonPaddingTop,
      paddingBottom: avatarConfig.buttonPaddingBottom,
      width: '100%',
      justifyContent: 'center',
      gap: 12,
    },
  })

export const getAvatarStyle = (avatarWidth: number, screenWidth: number) => ({
  width: avatarWidth,
  maxWidth: screenWidth <= 360 ? undefined : (screenWidth <= 480 ? scaleHorizontal(115) : scaleHorizontal(120)),
})

export const getAvatarBodyStyle = () => ({
  backgroundColor: 'transparent',
})

export const getFriendWhiteContainerStyle = (width: number, height: number) => ({
  width,
  height,
  position: 'absolute' as const,
  alignSelf: 'center' as const,
})

export const getFriendAvatarContainerStyle = () => ({
  zIndex: 1,
})

export const getAvatarPreviewStyle = (imageHeight: number) => ({
  bottom: -(imageHeight * 0.7),
})

export const getCheckIconStyle = (borderWidth: number, iconSize: number, iconOffset: number) => ({
  right: (borderWidth / 2) - iconSize + iconOffset,
  top: (borderWidth / 2) - iconSize + iconOffset,
})

