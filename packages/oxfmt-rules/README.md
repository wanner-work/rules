# @wanner.work/oxfmt-rules

A oxfmt config wrapper with rules to write consistently formatted code.

## Usage

Install the package in your project:

```bash
pnpm add -D @wanner.work/oxfmt-rules oxfmt
```

Then use the config wrapper.

```ts
import { defineConfigWithRules } from '@wanner.work/oxfmt-rules'

export default defineConfigWithRules({
  // your overrides
})
```

The wrapper deep-merges your config on top of the defaults, so you only need to specify the values you want to change.

## Defaults

| Option            | Value                                               |
| ----------------- | --------------------------------------------------- |
| `printWidth`      | `80`                                                |
| `semi`            | `false`                                             |
| `trailingComma`   | `'none'`                                            |
| `singleQuote`     | `true`                                              |
| `sortPackageJson` | `true`                                              |
| `sortImports`     | `newlinesBetween: false` with custom group ordering |

### `sortImports` groups

Imports are sorted in the following order, with a blank line between `unknown` and `style` groups:

1. `builtin`
2. `external`
3. `internal`, `subpath`
4. `parent`, `sibling`, `index`
5. `unknown`
6. `style`
