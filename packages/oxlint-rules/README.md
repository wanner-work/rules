# @wanner.work/oxlint-rules

A oxlint config wrapper with rules to write consistent code.

## Usage

Install the plugin in your project:

```bash
pnpm add -D @wanner.work/oxlint-rules oxlint oxlint-tsgolint
```

Then use the config wrapper.

```ts
import { defineConfigWithRules } from '@wanner.work/oxlint-rules'

export default defineConfigWithRules({
  ...
})
```

## Included rules

| Rule                                                   | Description                                                                             |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| `rules/component-naming-convention`                    | Require component default export names to start with uppercase and match the file name. |
| `rules/component-one-per-file`                         | Require component files to contain only one component.                                  |
| `rules/component-require-default-export`               | Require component files to have a default export.                                       |
| `rules/component-default-export-function-declaration`  | Require component default exports to be function declarations.                          |
| `rules/component-props-interface`                      | Require a local, non-exported `interface Props` in component files.                     |
| `rules/interface-name-pascal-case`                     | Require interface names to use PascalCase.                                              |
| `rules/interface-filename-matches-name`                | Require interface file names to match interface names.                                  |
| `rules/interface-one-per-file`                         | Require exactly one interface declaration per interface file.                           |
| `rules/interface-require-default-export`               | Require interface declarations in interface files to be default exported.               |
| `rules/interface-no-i-prefix`                          | Disallow interface names that start with an `I` prefix.                                 |
| `rules/method-name-camel-case`                         | Require method names to use camelCase.                                                  |
| `rules/method-one-per-file`                            | Require method files to contain only one top-level method.                              |
| `rules/method-require-default-export`                  | Require method files to default export their top-level method.                          |
| `rules/method-options-interface`                       | Allow `Options` interfaces only when local or imported from `/types` in method files.   |
| `rules/method-outside-components-function-declaration` | Require methods outside components to use function declarations.                        |
| `rules/method-inside-components-arrow-function`        | Require methods declared inside components to use arrow functions.                      |
| `rules/constant-naming-convention`                     | Require readonly constant names to use UPPERCASE_SNAKE_CASE.                            |
| `rules/constant-filename-matches-name`                 | Require constant file names to match constant names.                                    |
| `rules/constant-single-object`                         | Require constants files to group values in a single top-level object.                   |
| `rules/constant-require-default-export`                | Require constants files to default export their constants object.                       |
| `rules/hook-naming-convention`                         | Require hook names to start with `use`.                                                 |
| `rules/hook-filename-matches-name`                     | Require hook file names to match hook names.                                            |
| `rules/hook-one-per-file`                              | Require hook files to contain only one top-level hook.                                  |
| `rules/hook-require-default-export`                    | Require hook files to default export their top-level hook.                              |
| `rules/hook-default-export-function-declaration`       | Require default exported hooks to be named function declarations.                       |
| `rules/hook-options-interface`                         | Allow `Options` interfaces only when local or imported from `/types` in hook files.     |
