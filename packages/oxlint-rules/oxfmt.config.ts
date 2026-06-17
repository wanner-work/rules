import { defineConfig } from 'oxfmt'

export default defineConfig({
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
