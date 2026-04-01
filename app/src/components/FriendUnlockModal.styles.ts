import { StyleSheet } from 'react-native'
import { moderateScale } from 'react-native-size-matters'

export const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#fff',
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: moderateScale(24, 0.3),
    paddingTop: moderateScale(50, 0.3),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    fontSize: moderateScale(18, 0.3),
    fontWeight: 'bold',
    color: '#E91E63',
    textAlign: 'center',
    marginBottom: moderateScale(24, 0.3),
    width: '100%',
  },
  gifContainer: {
    flex: 1,
    width: moderateScale(280, 0.3),
    maxHeight: moderateScale(280, 0.3),
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: moderateScale(24, 0.3),
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  createButton: {
    width: 'auto',
    height: 'auto',
    minHeight: moderateScale(50, 0.3),
    borderRadius: moderateScale(8, 0.3),
    paddingVertical: moderateScale(14, 0.3),
    paddingHorizontal: moderateScale(28, 0.3),
    minWidth: moderateScale(180, 0.3),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: moderateScale(24, 0.3),
  },
  buttonText: {
    color: '#fff',
    fontSize: moderateScale(16, 0.3),
    fontWeight: 'bold',
  },
})
