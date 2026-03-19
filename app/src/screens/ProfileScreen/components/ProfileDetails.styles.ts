import { StyleSheet } from 'react-native'
import { UIConfig } from '../../../config/UIConfig'
import { globalStyles } from '../../../config/theme'
import { scaleHorizontal, scaleVertical, scaleDimension, scaleFont } from '../../../utils/responsive'
export const createProfileDetailsStyles = (
  avatarConfig: UIConfig['avatarSelection'],
  screenWidth: number
) =>
  StyleSheet.create({
    wrapper: {
      width: '100%',
      paddingHorizontal: scaleHorizontal(14), // Scaled padding
      paddingTop: avatarConfig.paddingTop,
    },
    header: {
      marginBottom: scaleVertical(18), // Scaled margin
    },
    title: {
      fontFamily: 'Roboto',
      fontWeight: '700',
      fontStyle: 'normal',
      fontSize: avatarConfig.titleFontSize,
      lineHeight: avatarConfig.titleLineHeight,
      letterSpacing: 0,
      marginBottom: scaleVertical(9), // Scaled margin
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
      marginVertical: scaleVertical(3), // Reduced margin for less spacing
      maxWidth: scaleHorizontal(650), // Scaled max width
      alignSelf: 'center',
    },
    row: {
      flexDirection: 'row',
      width: '100%',
      minHeight: scaleVertical(90), // Scaled min height
      paddingVertical: scaleVertical(6), // Reduced padding for less spacing
      paddingHorizontal: scaleHorizontal(14), // Scaled padding
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    column: {
      flex: 1,
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    avatarTextColumn: {
      paddingRight: scaleHorizontal(47.5), // Scaled padding
    },
    iconColumn: {
      width: scaleHorizontal(105), // Scaled width
      marginRight: scaleHorizontal(14), // Scaled margin
      alignItems: 'center',
      justifyContent: 'center',
    },
    infoLabel: {
      marginTop: scaleVertical(14), // Scaled margin
    },
    icon: {
      width: scaleDimension(56), // Scaled icon size
      height: scaleDimension(56), // Scaled icon size
    },
    text: {
      marginBottom: scaleVertical(5), // Scaled margin
      fontSize: scaleFont(13.5), // Scaled font size
      color: '#333333',
    },
    bold: {
      fontWeight: 'bold',
    },
    infoTextRow: {
      flexDirection: 'row',
      width: '100%',
      paddingHorizontal: scaleHorizontal(14), // Scaled padding
      paddingTop: 0,
      paddingBottom: scaleVertical(14), // Scaled padding
      alignItems: 'flex-start',
    },
    infoTextColumn: {
      flex: 2,
      marginLeft: 0,
    },
    infoText: {
      marginTop: scaleVertical(-16), // Scaled negative margin
    },
    editIconContainer: {
      position: 'absolute',
      right: scaleHorizontal(14), // Scaled right position
      top: '50%',
      transform: [{ translateY: scaleVertical(-14) }], // Scaled transform
    },
    editIcon: {
      width: scaleDimension(27), // Scaled icon size
      height: scaleDimension(27), // Scaled icon size
      backgroundColor: '#4CAF50',
      borderRadius: scaleDimension(13.5), // Scaled border radius
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarSvgContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageWrapper: {
      width: scaleHorizontal(105), // Scaled width
      height: scaleHorizontal(105), // Scaled height
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
    },
    friendAvatarContainer: {
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'visible',
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
      // bottom position is set inline to scale with friendImageHeight
      alignSelf: 'center',
      left: scaleHorizontal(-12), // Slightly to the left for better centering
    },
    avatarImage: {
      width: scaleHorizontal(105), // Scaled width
      height: scaleHorizontal(105), // Scaled height
      alignSelf: 'center',
    },
    standardAvatarSvgContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    themeWrapper: {
      width: scaleHorizontal(105), // Scaled width
      height: scaleHorizontal(105), // Scaled height
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
    nameChangeRow: {
      marginTop: scaleVertical(-7), // Scaled negative margin
      paddingTop: scaleVertical(3), // Scaled padding
    },
    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scaleHorizontal(11), // Scaled gap
    },
    updateButton: {
      width: scaleDimension(27), // Scaled button size
      height: scaleDimension(27), // Scaled button size
      backgroundColor: '#4CAF50',
      borderRadius: scaleDimension(13.5), // Scaled border radius
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarName: {
      fontSize: scaleFont(13.5), // Scaled font size
    },
  })

