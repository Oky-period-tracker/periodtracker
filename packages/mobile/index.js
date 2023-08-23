import '@oky/components/src/bootstrap'
import { AppRegistry } from 'react-native'
import { name as appName } from './app.json'
import App from '@oky/components/src/components/App'

AppRegistry.registerComponent(appName, () => App)
