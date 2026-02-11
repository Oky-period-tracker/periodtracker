import { IS_IOS } from '../services/device'

const ANDROID_KEY = 'Oky_english_encrypt'
const IOS_KEY = 'Example_Encryption_Key'

export const config = {
  REDUX_ENCRYPT_KEY: IS_IOS ? IOS_KEY : ANDROID_KEY,
}
