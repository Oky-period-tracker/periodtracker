import { Alert } from 'react-native'
import { translate } from '../../i18n'

export const ConfirmAlert = (title, text, onPress) => {
  Alert.alert(
    title,
    text,
    [
      {
        text: translate('cancel'),
        onPress: () => null,
        style: 'cancel',
      },
      { text: translate('yes'), onPress },
    ],
    { cancelable: false },
  )
}
