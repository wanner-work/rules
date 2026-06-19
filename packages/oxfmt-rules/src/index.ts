import defu from 'defu'
import { defineConfig, type OxfmtConfig } from 'oxfmt'

export function defineConfigWithRules(config?: OxfmtConfig) {
  return defineConfig(
    defu(
      config,
      defineConfig({
        printWidth: 80,
        semi: false,
        trailingComma: 'none',
        singleQuote: true,
        sortImports: {
          newlinesBetween: false,
          groups: [
            'builtin',
            'external',
            ['internal', 'subpath'],
            ['parent', 'sibling', 'index'],
            'unknown',
            {
              newlinesBetween: true
            },
            'style'
          ]
        },
        sortPackageJson: true
      })
    )
  )
}
