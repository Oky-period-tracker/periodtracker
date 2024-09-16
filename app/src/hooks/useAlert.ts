import { Alert, Platform } from 'react-native';
import {useTranslate}  from "./useTranslate.ts" 

const useAlert = () => {

  const translate = useTranslate();

  const showAlert = (message) => {
    if (Platform.OS === 'web') {
      window.alert(translate(message));
    } else {
      Alert.alert(translate(message));
    }
  };

  return showAlert;
};

export default useAlert;

