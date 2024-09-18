import { Alert, Platform } from 'react-native';
import { useTranslate } from './useTranslate.ts'

const useAlert = () => {
  const translate = useTranslate(); 

  const showAlert = (titleKey, messageKey, buttons, options = { cancelable: true }) => {
  const translatedTitle = translate(titleKey);
  const translatedMessage = translate(messageKey);

    if (Platform.OS === 'web') {
      const confirmationMessage = `${translatedTitle}\n\n${translatedMessage}`;

      if (buttons.length === 1) {
        window.alert(confirmationMessage);
        buttons[0]?.onPress?.();  // Handle single button alert
      } else {
        window.alert(confirmationMessage);
      }
    } else {
      Alert.alert(translatedTitle, translatedMessage, buttons, options);
    }
  };

  const successAlert = (titleKey = 'success', messageKey, onSuccessPress = () => {}) => {
    showAlert(
      titleKey,
      messageKey,
      [
        {
          text: translate('continue'),
          onPress: onSuccessPress, 
        },
      ],
      { cancelable: false }
    );
  };

  const failAlert = (titleKey = 'password_change_fail', messageKey = 'password_change_fail_description', onFailPress = () => {}) => {
    showAlert(
      titleKey,
      messageKey,
      [
        {
          text: translate('continue'),
          onPress: onFailPress,         },
      ],
      { cancelable: false }
    );
  };

  const twoBtAlert = (
    titleKey: string,
    messageKey: string,
    onCancel: () => void,
    onConfirm: () => void
  ) => {
    const title = translate(titleKey);
    const message = translate(messageKey);

    showAlert(
      title,
      message,
      [
        {
          text: translate('cancel'),
          onPress: onCancel,
          style: 'cancel',
        },
        {
          text: translate('yes'),
          onPress: onConfirm,
        },
      ],
      { cancelable: true }
    );
  };

  return { showAlert, successAlert, failAlert, twoBtAlert };
};

export default useAlert;
