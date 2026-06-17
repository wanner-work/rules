# @wanner.work/oxlint-rules

A oxlint config wrapper with rules to write consistent code.

## Usage

Install the plugin in your project:

```bash
pnpm add -D @wanner.work/oxlint-rules oxlint
```

Then use the config wrapper.

```ts
import { defineConfig } from 'oxlint'
import { withRules } from '@clavisit/oxlint-guidelines-plugin'

export default withRules(defineConfig({
  ...
}))
```

`recommended` is generated from the plugin rules and always sets each guideline rule to `'error'`.

## Included rules

| Rule                                                        | Description                                                                             |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `guidelines/component-naming-convention`                    | Require component default export names to start with uppercase and match the file name. |
| `guidelines/component-one-per-file`                         | Require component files to contain only one component.                                  |
| `guidelines/component-require-default-export`               | Require component files to have a default export.                                       |
| `guidelines/component-default-export-function-declaration`  | Require component default exports to be function declarations.                          |
| `guidelines/component-props-interface`                      | Require a local, non-exported `interface Props` in component files.                     |
| `guidelines/interface-name-pascal-case`                     | Require interface names to use PascalCase.                                              |
| `guidelines/interface-filename-matches-name`                | Require interface file names to match interface names.                                  |
| `guidelines/interface-one-per-file`                         | Require exactly one interface declaration per interface file.                           |
| `guidelines/interface-require-default-export`               | Require interface declarations in interface files to be default exported.               |
| `guidelines/interface-no-i-prefix`                          | Disallow interface names that start with an `I` prefix.                                 |
| `guidelines/method-name-camel-case`                         | Require method names to use camelCase.                                                  |
| `guidelines/method-one-per-file`                            | Require method files to contain only one top-level method.                              |
| `guidelines/method-require-default-export`                  | Require method files to default export their top-level method.                          |
| `guidelines/method-options-interface`                       | Allow `Options` interfaces only when local or imported from `/types` in method files.   |
| `guidelines/method-outside-components-function-declaration` | Require methods outside components to use function declarations.                        |
| `guidelines/method-inside-components-arrow-function`        | Require methods declared inside components to use arrow functions.                      |
| `guidelines/constant-naming-convention`                     | Require readonly constant names to use UPPERCASE_SNAKE_CASE.                            |
| `guidelines/constant-filename-matches-name`                 | Require constant file names to match constant names.                                    |
| `guidelines/constant-single-object`                         | Require constants files to group values in a single top-level object.                   |
| `guidelines/constant-require-default-export`                | Require constants files to default export their constants object.                       |
| `guidelines/hook-naming-convention`                         | Require hook names to start with `use`.                                                 |
| `guidelines/hook-filename-matches-name`                     | Require hook file names to match hook names.                                            |
| `guidelines/hook-one-per-file`                              | Require hook files to contain only one top-level hook.                                  |
| `guidelines/hook-require-default-export`                    | Require hook files to default export their top-level hook.                              |
| `guidelines/hook-default-export-function-declaration`       | Require default exported hooks to be named function declarations.                       |
| `guidelines/hook-options-interface`                         | Allow `Options` interfaces only when local or imported from `/types` in hook files.     |
