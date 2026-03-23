import { StyleSheet } from 'react-native'
import { responsiveConfig } from '../../../config/UIConfig'

export const createAvatarTutorialModalStyles = (
  config: typeof responsiveConfig.s.avatarCustomization,
  screenWidth: number
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
    },
    modal: {
      backgroundColor: '#FFFFFF',
      borderRadius: screenWidth >= 840 ? 24 : 20,
      width: screenWidth >= 840 ? Math.min(screenWidth * 0.9, 600) : screenWidth * 0.95,
      maxHeight: screenWidth >= 840 ? '85%' : '90%',
      paddingTop: screenWidth >= 840 ? 20 : 16,
      paddingBottom: screenWidth >= 840 ? 24 : 20,
      paddingHorizontal: 0,
      overflow: 'hidden',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: screenWidth >= 840 ? 20 : 16,
      paddingHorizontal: screenWidth >= 840 ? 24 : 20,
    },
    backButton: {
      width: 24,
      height: 24,
    },
    headerTitleContainer: {
      flex: 1,
      alignItems: 'flex-end',
    },
    headerTitle: {
      fontSize: screenWidth >= 840 ? 20 : 18,
      fontWeight: '700',
      color: '#000000',
    },
    instructionsContainer: {
      marginTop: screenWidth >= 840 ? 20 : 16,
      marginBottom: screenWidth >= 840 ? 20 : 16,
      alignItems: 'center',
      paddingHorizontal: screenWidth >= 840 ? 24 : 20,
    },
    instructionsTitle: {
      fontSize: screenWidth >= 840 ? 22 : 20,
      fontWeight: '700',
      color: '#000000',
      marginBottom: screenWidth >= 840 ? 12 : 10,
      textAlign: 'center',
    },
    instructionsText: {
      fontSize: screenWidth >= 840 ? 15 : 14,
      fontWeight: '400',
      color: '#333333',
      lineHeight: screenWidth >= 840 ? 22 : 20,
      marginBottom: screenWidth >= 840 ? 8 : 6,
    },
    progressContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: screenWidth >= 840 ? 20 : 16,
      gap: screenWidth >= 840 ? 10 : 8,
      paddingHorizontal: screenWidth >= 840 ? 24 : 20,
    },
    progressDot: {
      width: screenWidth >= 840 ? 14 : 12,
      height: screenWidth >= 840 ? 14 : 12,
      borderRadius: screenWidth >= 840 ? 7 : 6,
      backgroundColor: '#E0E0E0',
    },
    progressDotActive: {
      backgroundColor: '#FF6B6B',
    },
    navigationContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: screenWidth >= 840 ? 12 : 10,
      gap: screenWidth >= 840 ? 16 : 12,
      paddingHorizontal: screenWidth >= 840 ? 24 : 20,
    },
    navButton: {
      minHeight: screenWidth >= 840 ? 48 : 44,
      borderRadius: screenWidth >= 840 ? 12 : 10,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: screenWidth >= 840 ? 24 : 20,
    },
    navButtonBack: {
      backgroundColor: '#FF9800',
      alignSelf: 'flex-start',
    },
    navButtonNext: {
      backgroundColor: '#FF9800',
      alignSelf: 'flex-end',
    },
    navButtonTextBack: {
      fontSize: screenWidth >= 840 ? 16 : 15,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    navButtonTextNext: {
      fontSize: screenWidth >= 840 ? 16 : 15,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    skipContainer: {
      alignItems: 'center',
      paddingTop: screenWidth >= 840 ? 8 : 6,
      paddingHorizontal: screenWidth >= 840 ? 24 : 20,
    },
    skipText: {
      fontSize: screenWidth >= 840 ? 15 : 14,
      fontWeight: '400',
      color: '#000000',
      textDecorationLine: 'underline',
    },
  })
