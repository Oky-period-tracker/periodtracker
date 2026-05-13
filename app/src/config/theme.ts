import { StyleSheet } from 'react-native'

export const globalStyles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  // Sometimes Android shadow has to be applied to a different component compared to iOS
  elevation: {
    elevation: 4,
  },
  // Shared title box style for avatar and theme selection screens
  selectionTitleBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 0,
    padding: 8,
    paddingLeft: 10,
    paddingRight: 12,
    minWidth: 0,
  },
  // Unified message box style for top and bottom messages
  messageBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 8,
    paddingLeft: 10,
    paddingRight: 12,
  },
})
