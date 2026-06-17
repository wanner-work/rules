import { withRules } from './dist/index.mjs'

export default withRules({
  options: {
    typeAware: true,
    typeCheck: true
  },
  ignorePatterns: ['tests/*'],
  plugins: ['import', 'eslint', 'typescript', 'react', 'unicorn', 'oxc'],
  rules: {
    'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
    'typescript/consistent-type-definitions': 'error',
    'typescript/no-var-requires': 'off',
    'typescript/no-floating-promises': 'error',
    'typescript/no-unsafe-assignment': 'off',
    'no-unused-vars': [
      'error',
      {
        fix: {
          imports: 'safe-fix',
          variables: 'off'
        }
      }
    ]
  }
})
