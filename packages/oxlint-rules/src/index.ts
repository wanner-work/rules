import defu from 'defu'
import { defineConfig, type OxlintConfig } from 'oxlint'
import COMPONENT_RULES from './rules/componentRules'
import CONSTANT_RULES from './rules/constantRules'
import HOOK_RULES from './rules/hookRules'
import INTERFACE_RULES from './rules/interfaceRules'
import METHOD_RULES from './rules/methodRules'
import type Plugin from './types/Plugin'

const plugin: Plugin = {
  meta: {
    name: 'rules'
  },
  rules: {
    'component-naming-convention':
      COMPONENT_RULES.componentNamingConventionRule,
    'component-one-per-file': COMPONENT_RULES.componentOnePerFileRule,
    'component-require-default-export':
      COMPONENT_RULES.componentRequireDefaultExportRule,
    'component-default-export-function-declaration':
      COMPONENT_RULES.componentDefaultExportFunctionDeclarationRule,
    'component-props-interface': COMPONENT_RULES.componentPropsInterfaceRule,
    'component-file-extension': COMPONENT_RULES.componentFileExtensionRule,
    'interface-name-pascal-case': INTERFACE_RULES.interfaceNamePascalCaseRule,
    'interface-filename-matches-name':
      INTERFACE_RULES.interfaceFileNameMatchesNameRule,
    'interface-one-per-file': INTERFACE_RULES.interfaceOnePerFileRule,
    'interface-require-default-export':
      INTERFACE_RULES.interfaceRequireDefaultExportRule,
    'interface-no-i-prefix': INTERFACE_RULES.interfaceNoIPrefixRule,
    'method-name-camel-case': METHOD_RULES.methodNameCamelCaseRule,
    'method-one-per-file': METHOD_RULES.methodOnePerFileRule,
    'method-require-default-export':
      METHOD_RULES.methodRequireDefaultExportRule,
    'method-options-interface': METHOD_RULES.methodOptionsInterfaceRule,
    'method-outside-components-function-declaration':
      METHOD_RULES.methodOutsideComponentsFunctionDeclarationRule,
    'method-inside-components-arrow-function':
      METHOD_RULES.methodInsideComponentsArrowFunctionRule,
    'constant-naming-convention': CONSTANT_RULES.constantNamingConventionRule,
    'constant-filename-matches-name':
      CONSTANT_RULES.constantFileNameMatchesNameRule,
    'constant-single-object': CONSTANT_RULES.constantSingleObjectRule,
    'constant-require-default-export':
      CONSTANT_RULES.constantRequireDefaultExportRule,
    'hook-naming-convention': HOOK_RULES.hookNamingConventionRule,
    'hook-filename-matches-name': HOOK_RULES.hookFileNameMatchesNameRule,
    'hook-one-per-file': HOOK_RULES.hookOnePerFileRule,
    'hook-require-default-export': HOOK_RULES.hookRequireDefaultExportRule,
    'hook-default-export-function-declaration':
      HOOK_RULES.hookDefaultExportFunctionDeclarationRule,
    'hook-options-interface': HOOK_RULES.hookOptionsInterfaceRule
  }
}

export default plugin

export const recommended = Object.fromEntries(
  Object.keys(plugin.rules).map((ruleName) => [`rules/${ruleName}`, 'error'])
) as Record<string, 'error'>

export function defineConfigWithRules(config?: OxlintConfig) {
  return defineConfig(
    defu(
      config,
      defineConfig({
        options: {
          typeAware: true,
          typeCheck: true
        },
        jsPlugins: ['@wanner.work/oxlint-rules'],
        plugins: ['import', 'eslint', 'typescript', 'react', 'unicorn', 'oxc'],
        rules: {
          ...recommended,
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
    ) as OxlintConfig
  )
}
