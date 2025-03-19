import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js'
import { fixupConfigRules } from '@eslint/compat'

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
    },
  },
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.jsx'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  ...fixupConfigRules(pluginReactConfig),
  {
    files: ['**/*.jsx', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      'react/prop-types': 'off',
      'react/jsx-key': 'off',
      'react/no-unescaped-entities': 'off',
      'no-console': 'error',
      /* 
        TODO: 
        no semi colons
        no export default
        no unused styles
        functions must have { }, no single line funcs without brackets
        no inline functions as props eg prop={() => func()} must be prop={func}
        useEffect etc deps must be complete
        imports must be sorted in correct order
        no excessive white space (set prettier rules or something?)
      */
    },
  },
  {
    settings: {
      react: {
        version: 'detect', // Automatically detect the React version
      },
    },
  },
  {
    ignores: [
      '.expo',
      'android',
      'ios',
      'src/prediction/*', // TODO:
      'src/core/*', // TODO:
    ],
  },
]
