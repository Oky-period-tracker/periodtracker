module.exports = {
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['**/__tests__/**/*.test.(ts|js)'],
  testEnvironment: 'node',
  preset: 'ts-jest',
}
