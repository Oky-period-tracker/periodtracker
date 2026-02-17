import NetInfo from '@react-native-community/netinfo'

export async function fetchNetworkConnectionStatus() {
  try {
    const netInfoState = await NetInfo.fetch()
    console.log('🔹 [Network] NetInfo state:', netInfoState.isConnected ? 'ONLINE' : 'OFFLINE')
    return netInfoState.isConnected ?? false
  } catch (error) {
    console.warn('⚠️ [Network] Error checking network status:', error)
    // If we can't determine, assume offline to allow local operation
    return false
  }
}
