import { StyleSheet } from 'react-native'
import { UIConfig } from '../../config/UIConfig'
import { globalStyles } from '../../config/theme'

export const createThemeScreenStyles = (
  themeConfig: UIConfig['themeSelection'],
  themeWidth: number,
  isInitialSelection: boolean,
  hasGoBack: boolean
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
    },
    scrollContent: {
      paddingHorizontal: themeConfig.screenPaddingHorizontal,
      paddingTop: themeConfig.paddingTop,
      paddingBottom: themeConfig.buttonPaddingTop + 60, // Extra space to ensure button is visible
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      marginBottom: 20,
      paddingHorizontal: themeConfig.titlePaddingHorizontal,
    },
    logo: {
      width: 50,
      height: 50,
      marginRight: 12,
      marginBottom: 4,
    },
    titleBox: {
      ...globalStyles.selectionTitleBox,
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
      marginBottom: 20,
      paddingHorizontal: themeConfig.itemsContainerPaddingHorizontal,
      width: '100%',
    },
    theme: {
      height: themeConfig.themeSize.height,
      marginLeft: 0,
      marginRight: 0,
      marginVertical: themeConfig.themeMarginVertical,
    },
    themeBody: {
      width: '100%',
      height: '100%',
      position: 'relative',
    },
    check: {
      position: 'absolute',
      zIndex: 100,
      backgroundColor: '#A4D233',
      borderRadius: (themeConfig.iconSize * 2) / 2,
      width: themeConfig.iconSize * 2,
      height: themeConfig.iconSize * 2,
      justifyContent: 'center',
      alignItems: 'center',
      pointerEvents: 'none',
      // Position icon pushed more inside for theme images
      right: themeConfig.iconSize * 1.0,
      top: themeConfig.iconSize * 1.0,
    },
    editIconContainer: {
      position: 'absolute',
      zIndex: 100,
      backgroundColor: '#A4D233',
      borderRadius: (themeConfig.iconSize * 2) / 2,
      width: themeConfig.iconSize * 2,
      height: themeConfig.iconSize * 2,
      justifyContent: 'center',
      alignItems: 'center',
      pointerEvents: 'none',
      // Position icon pushed more inside for theme images
      right: themeConfig.iconSize * 1.0,
      top: themeConfig.iconSize * 1.0,
    },
    themeImage: {
      width: '100%',
      height: '100%',
      alignSelf: 'center',
      borderRadius: themeConfig.themeBorderRadius,
    },
    // Outer container for green border (when selected/active)
    themeOuterContainer: {
      width: '100%',
      height: themeConfig.themeSize.height,
      position: 'relative',
      borderRadius: themeConfig.themeBorderRadius,
      padding: 2, // Space for green border
    },
    // Inner container for white border
    themeInnerContainer: {
      width: '100%',
      height: '100%',
      borderRadius: themeConfig.themeBorderRadius,
      borderWidth: 2,
      borderColor: '#FFFFFF',
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
    },
    // Green border wrapper (only when selected/active)
    themeGreenBorder: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: themeConfig.themeBorderRadius,
      borderWidth: 2,
      borderColor: '#A4D233',
      pointerEvents: 'none',
    },
    themeSvgContainer: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
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
      justifyContent: (isInitialSelection && hasGoBack) ? 'space-between' : 'center',
      gap: 12,
    },
  })

