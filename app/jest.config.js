/*eslint-disable*/
const esModules = [
  'expo-localization',
  'react-redux',
  'react-native',
  'expo',
  '@expo',
  'expo-font',
  '@unimodules',
  'expo-modules-core',
  '@react-native',
  'uuid',
  '@expo/vector-icons',
  'expo-asset',
  'expo-linking',
  'react-native-reanimated',
  'react-native-worklets',
  'react-native-gesture-handler',
  'react-native-size-matters',
  'react-native-calendars',
  'expo-constants',
  'expo-device',
  'expo-application',
].join('|')

module.exports = {
  preset: 'jest-expo',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [`node_modules/(?!(${esModules})/)`],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '@expo/vector-icons': '<rootDir>/__mocks__/vector-icons.js',
    '@react-native-async-storage/async-storage':
      '@react-native-async-storage/async-storage/jest/async-storage-mock',
  },
}
