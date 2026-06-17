import { defineConfig } from 'oxlint'

export default defineConfig({
  options: {
    typeAware: false,
    typeCheck: false
  },
  jsPlugins: ['../dist/index.mjs'],
  rules: {
    'guidelines/component-naming-convention': 'error',
    'guidelines/component-one-per-file': 'error',
    'guidelines/component-require-default-export': 'error',
    'guidelines/component-default-export-function-declaration': 'error',
    'guidelines/component-props-interface': 'error',
    'guidelines/interface-name-pascal-case': 'error',
    'guidelines/interface-filename-matches-name': 'error',
    'guidelines/interface-one-per-file': 'error',
    'guidelines/interface-require-default-export': 'error',
    'guidelines/interface-no-i-prefix': 'error',
    'guidelines/method-name-camel-case': 'error',
    'guidelines/method-one-per-file': 'error',
    'guidelines/method-require-default-export': 'error',
    'guidelines/method-options-interface': 'error',
    'guidelines/method-outside-components-function-declaration': 'error',
    'guidelines/method-inside-components-arrow-function': 'error',
    'guidelines/constant-naming-convention': 'error',
    'guidelines/constant-filename-matches-name': 'error',
    'guidelines/constant-single-object': 'error',
    'guidelines/constant-require-default-export': 'error',
    'guidelines/hook-naming-convention': 'error',
    'guidelines/hook-filename-matches-name': 'error',
    'guidelines/hook-one-per-file': 'error',
    'guidelines/hook-require-default-export': 'error',
    'guidelines/hook-default-export-function-declaration': 'error',
    'guidelines/hook-options-interface': 'error'
  }
})
