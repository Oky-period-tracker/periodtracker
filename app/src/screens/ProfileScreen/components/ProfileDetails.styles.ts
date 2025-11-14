import { StyleSheet } from 'react-native'
import { UIConfig } from '../../../config/UIConfig'
import { globalStyles } from '../../../config/theme'

export const createProfileDetailsStyles = (
  avatarConfig: UIConfig['avatarSelection'],
  screenWidth: number
) =>
  StyleSheet.create({
    wrapper: {
      width: '100%',
      paddingHorizontal: screenWidth >= 840 ? 16 : 12,
      paddingTop: avatarConfig.paddingTop,
    },
    header: {
      marginBottom: screenWidth >= 840 ? 20 : 16,
    },
    title: {
      fontFamily: 'Roboto',
      fontWeight: '700',
      fontStyle: 'normal',
      fontSize: avatarConfig.titleFontSize,
      lineHeight: avatarConfig.titleLineHeight,
      letterSpacing: 0,
      marginBottom: screenWidth >= 840 ? 10 : 8,
    },
    subtitle: {
      fontFamily: 'Roboto',
      fontWeight: '400',
      fontStyle: 'normal',
      fontSize: avatarConfig.subtitleFontSize,
      lineHeight: avatarConfig.subtitleLineHeight,
      letterSpacing: 0,
    },
    container: {
      borderRadius: 20,
      width: '100%',
      marginVertical: screenWidth >= 840 ? 6 : 4,
      maxWidth: screenWidth >= 840 ? 700 : 600,
      alignSelf: 'center',
    },
    row: {
      flexDirection: 'row',
      width: '100%',
      minHeight: screenWidth >= 840 ? 100 : 80,
      paddingVertical: screenWidth >= 840 ? 12 : 8,
      paddingHorizontal: screenWidth >= 840 ? 16 : 12,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    column: {
      flex: 1,
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    iconColumn: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    infoLabel: {
      marginTop: screenWidth >= 840 ? 16 : 12,
    },
    icon: {
      width: screenWidth >= 840 ? 60 : 52,
      height: screenWidth >= 840 ? 60 : 52,
    },
    text: {
      marginBottom: screenWidth >= 840 ? 6 : 4,
      fontSize: screenWidth >= 840 ? 14 : 13,
      color: '#333333',
    },
    bold: {
      fontWeight: 'bold',
    },
    infoTextRow: {
      flexDirection: 'row',
      width: '100%',
      paddingHorizontal: screenWidth >= 840 ? 16 : 12,
      paddingTop: 0,
      paddingBottom: screenWidth >= 840 ? 16 : 12,
      alignItems: 'flex-start',
    },
    infoTextColumn: {
      flex: 2,
      marginLeft: 0,
    },
    infoText: {
      marginTop: screenWidth >= 840 ? -18 : -14,
    },
    editIconContainer: {
      position: 'absolute',
      right: screenWidth >= 840 ? 16 : 12,
      top: '50%',
      transform: [{ translateY: screenWidth >= 840 ? -15 : -13 }],
    },
    editIcon: {
      width: screenWidth >= 840 ? 28 : 26,
      height: screenWidth >= 840 ? 28 : 26,
      backgroundColor: '#4CAF50',
      borderRadius: screenWidth >= 840 ? 14 : 13,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarSvgContainer: {
      width: screenWidth >= 840 ? 110 : 100,
      height: screenWidth >= 840 ? 110 : 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageWrapper: {
      width: screenWidth >= 840 ? 110 : 100,
      height: screenWidth >= 840 ? 110 : 100,
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
    },
    friendAvatarImage: {
      width: '100%',
      height: '100%',
      alignSelf: 'center',
      marginTop: 0,
      borderRadius: avatarConfig.avatarBorderRadius,
    },
    friendAvatarContainer: {
      width: '100%',
      height: '100%',
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
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
      paddingBottom: 0,
    },
    avatarPreview: {
      position: 'absolute',
      bottom: -(avatarConfig.avatarSize.height * 0.5),
      alignSelf: 'center',
    },
    avatarImage: {
      width: screenWidth >= 840 ? 110 : 100,
      height: screenWidth >= 840 ? 110 : 100,
      alignSelf: 'center',
      aspectRatio: 1,
      resizeMode: 'contain',
    },
    themeWrapper: {
      width: screenWidth >= 840 ? 110 : 100,
      height: screenWidth >= 840 ? 110 : 100,
      borderRadius: 20,
      overflow: 'hidden',
    },
    themeSvgContainer: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    themeImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
  })

