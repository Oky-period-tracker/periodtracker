import 'react-native-gesture-handler'
import { hijackEffects } from 'stop-runaway-react-effects'
import { configureI18n } from './i18n'

if (process.env.NODE_ENV !== 'production') {
  hijackEffects()
}

configureI18n()
