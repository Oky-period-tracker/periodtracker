import { StyleSheet } from 'react-native'
import { UIConfig } from '../../config/UIConfig'
import { globalStyles } from '../../config/theme'
import { getResponsiveMargin } from '../../utils/layoutCalculations'
import { scaleHorizontal } from '../../utils/responsive'

export const createThemeScreenStyles = (
  themeConfig: UIConfig['themeSelection'],
  themeWidth: number,
  isInitialSelection: boolean,
  hasGoBack: boolean,
  hasHeader: boolean = false,
  screenWidth?: number
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
      flex: 1,
      width: '100%',
      maxWidth: 1200, // Cap at 1200px for large tablets
      alignSelf: 'center',
    },
    scrollContent: {
      paddingHorizontal: themeConfig.screenPaddingHorizontal,
      // Reduce top padding when header is shown (header already provides spacing)
      paddingTop: hasHeader ? 16 : themeConfig.paddingTop,
      // Reduce bottom padding when header is shown (remove extra 80px)
      paddingBottom: hasHeader 
        ? themeConfig.buttonPaddingTop + themeConfig.buttonPaddingBottom 
        : themeConfig.buttonPaddingTop + themeConfig.buttonPaddingBottom + 80,
      width: '100%',
    },
    // Title container wrapper - matches avatar screen structure
    // Use same percentage as avatar screen for consistency
    titleContainerWrapper: {
      width: '92%', // Matches avatar screen contentContainerWidthPercent for small/medium screens
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
      width: '80%', // Matches avatar screen
      ...globalStyles.shadow,
      ...globalStyles.elevation,
    },
    title: {
      fontFamily: 'Roboto',
      fontWeight: '700',
      fontStyle: 'normal',
      fontSize: themeConfig.titleFontSize,
      lineHeight: themeConfig.titleLineHeight,
      letterSpacing: 0,
      marginBottom: 8,
    },
    subtitle: {
      fontFamily: 'Roboto',
      fontWeight: '400',
      fontStyle: 'normal',
      fontSize: themeConfig.subtitleFontSize,
      lineHeight: themeConfig.subtitleLineHeight,
      letterSpacing: 0,
      maxWidth: '100%',
    },
    themes: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      marginTop: 20,
      marginBottom: 20,
      paddingHorizontal: (screenWidth && screenWidth <= 480)
        ? 0
        : themeConfig.itemsContainerPaddingHorizontal,
      width: (screenWidth && screenWidth <= 360) ? '98%' : (screenWidth && screenWidth <= 480) ? '92%' : '100%',
      maxWidth: 1200,
      alignSelf: 'center',
    },
    theme: {
      height: themeConfig.themeSize.height,
      marginLeft: screenWidth && screenWidth <= 360
        ? 2
        : screenWidth && screenWidth <= 480
        ? getResponsiveMargin(screenWidth, { xs: 6, sm: 6, md: 8 })
        : themeConfig.themeMarginHorizontal / 2,
      marginRight: screenWidth && screenWidth <= 360
        ? 2
        : screenWidth && screenWidth <= 480
        ? getResponsiveMargin(screenWidth, { xs: 6, sm: 6, md: 8 })
        : themeConfig.themeMarginHorizontal / 2,
      marginVertical: themeConfig.themeMarginVertical,
    },
    themeBody: {
      width: '100%',
      height: '100%',
      position: 'relative',
    },
    imageWrapper: {
      width: '100%',
      height: '100%',
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      flexGrow: 0,
    },
    check: {
      position: 'absolute',
      zIndex: 10,
      backgroundColor: '#A4D233',
      borderRadius: (themeConfig.iconSize * 2) / 2,
      width: themeConfig.iconSize * 2,
      height: themeConfig.iconSize * 2,
      justifyContent: 'center',
      alignItems: 'center',
      pointerEvents: 'none',
    },
    editIconContainer: {
      position: 'absolute',
      zIndex: 10,
      backgroundColor: '#A4D233',
      borderRadius: (themeConfig.iconSize * 2) / 2,
      width: themeConfig.iconSize * 2,
      height: themeConfig.iconSize * 2,
      justifyContent: 'center',
      alignItems: 'center',
      pointerEvents: 'none',
    },
    pendingIconContainer: {
      position: 'absolute',
      zIndex: 10,
      backgroundColor: '#FF8C00',
      borderRadius: (themeConfig.iconSize * 2) / 2,
      width: themeConfig.iconSize * 2,
      height: themeConfig.iconSize * 2,
      justifyContent: 'center',
      alignItems: 'center',
      pointerEvents: 'none',
    },
    grayIconContainer: {
      position: 'absolute',
      zIndex: 10,
      backgroundColor: '#D1D0D2',
      borderRadius: (themeConfig.iconSize * 2) / 2,
      width: themeConfig.iconSize * 2,
      height: themeConfig.iconSize * 2,
      justifyContent: 'center',
      alignItems: 'center',
      pointerEvents: 'none',
    },
    themeImage: {
      width: '100%',
      height: '100%',
      alignSelf: 'center',
      borderRadius: themeConfig.themeBorderRadius,
    },
    // Touchable area for theme
    themeTouchable: {
      width: '100%',
    },
    themeSvgContainer: {
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    name: {
      position: 'absolute',
      top: 6,
      left: 0,
      width: '100%',
      fontFamily: 'Roboto',
      fontWeight: '700',
      fontStyle: 'normal',
      textAlign: 'center',
      fontSize: 16,
      lineHeight: 22,
      letterSpacing: 0,
    },
    buttonContainer: {
      flexDirection: 'row',
      paddingHorizontal: themeConfig.buttonPaddingHorizontal,
      paddingTop: themeConfig.buttonPaddingTop,
      paddingBottom: themeConfig.buttonPaddingBottom,
      width: '100%',
      maxWidth: 1200, // Cap at 1200px for large tablets
      alignSelf: 'center',
      justifyContent: (isInitialSelection && hasGoBack) ? 'space-between' : 'center',
      gap: 12,
    },
  })

export const getThemeStyle = (themeWidth: number, containerHeight: number, screenWidth: number) => ({
  width: themeWidth,
  height: containerHeight,
  maxWidth: screenWidth <= 360 ? 165 : (screenWidth > 360 && screenWidth <= 392) ? 135 : (screenWidth > 392 && screenWidth <= 411) ? 138 : (screenWidth > 411 && screenWidth <= 480) ? scaleHorizontal(140) : undefined,
})

export const getThemeImageWrapperStyle = () => ({
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
})

export const getThemeContainerStyle = (containerWidth: number, containerHeight: number, borderRadius: number, backgroundColor: string) => ({
  width: containerWidth,
  height: containerHeight,
  borderRadius,
  backgroundColor,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
})

