import NetInfo from '@react-native-community/netinfo'

export async function fetchNetworkConnectionStatus() {
  const { isConnected } = await NetInfo.fetch()
  return isConnected
}
