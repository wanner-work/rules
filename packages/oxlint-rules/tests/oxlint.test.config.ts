import { defineConfig } from 'oxlint'

export default defineConfig({
  options: {
    typeAware: false,
    typeCheck: false
  },
  jsPlugins: ['../dist/index.mjs'],
  rules: {
    'rules/component-naming-convention': 'error',
    'rules/component-one-per-file': 'error',
    'rules/component-require-default-export': 'error',
    'rules/component-default-export-function-declaration': 'error',
    'rules/component-props-interface': 'error',
    'rules/interface-name-pascal-case': 'error',
    'rules/interface-filename-matches-name': 'error',
    'rules/interface-one-per-file': 'error',
    'rules/interface-require-default-export': 'error',
    'rules/interface-no-i-prefix': 'error',
    'rules/method-name-camel-case': 'error',
    'rules/method-one-per-file': 'error',
    'rules/method-require-default-export': 'error',
    'rules/method-options-interface': 'error',
    'rules/method-outside-components-function-declaration': 'error',
    'rules/method-inside-components-arrow-function': 'error',
    'rules/constant-naming-convention': 'error',
    'rules/constant-filename-matches-name': 'error',
    'rules/constant-single-object': 'error',
    'rules/constant-require-default-export': 'error',
    'rules/hook-naming-convention': 'error',
    'rules/hook-filename-matches-name': 'error',
    'rules/hook-one-per-file': 'error',
    'rules/hook-require-default-export': 'error',
    'rules/hook-default-export-function-declaration': 'error',
    'rules/hook-options-interface': 'error'
  }
})
