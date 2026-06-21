# AGENTS.md

Reference for AI coding agents working in projects that use the
`@wanner.work/*` rule packs (`@wanner.work/oxlint-rules` and/or
`@wanner.work/oxfmt-rules`). Follow these conventions when writing or editing
code so the output passes lint and format checks.

## Folder convention

Every project using any `@wanner.work/*` pack follows one folder convention: a
single `src/` directory at the project root, with one well-named folder per
kind of file. The lint rules are **folder-scoped** — they only fire on the
folders that exist.

```text
/
└── src/
    ├── styles/                   # global stylesheets (CSS, SCSS, ...) — required location
    ├── methods/                  # standalone, reusable method files
    ├── components/               # React component files (.jsx / .tsx)
    │   └── ui/                   # optional — generated UI primitives (shadcn/ui)
    ├── hooks/                    # React hook files
    ├── interfaces/               # standalone TypeScript interface files
    ├── types/                    # shared type aliases, generic types, Options interfaces
    ├── constants/                # readonly constant groups
    ├── enums/                    # TypeScript enums
    ├── classes/                  # plain TypeScript classes
    ├── lib/                      # third-party / vendored code — linting ignored
    ├── app/                      # optional — Next.js App Router
    └── routes/                   # optional — React Router / TanStack Router
```

Rules:

- All `.ts` / `.js` code lives under `src/`. Root-level folders are not linted.
- All folder names **must be lowercase** (lowercase letters, digits, hyphens
  only — no uppercase, underscores, or spaces).
- All stylesheets (`.css`, `.scss`, `.sass`, `.less`, ...) **must live inside
  `src/styles/`**. Co-located styles next to components are not allowed.

## Component rules — `src/components/` (`.jsx` / `.tsx`)

### `component-naming-convention`

Require the default export name to start with an uppercase letter and match the
file name (excluding extension).

```tsx
// src/components/ProfileCard.tsx — Do
export default function ProfileCard() {
  return <section>Profile</section>
}

// src/components/profileCard.tsx — Don't (lowercase + name mismatch)
export default function profileCard() {
  return <section>Profile</section>
}
```

### `component-one-per-file`

Require component files to contain only one component. Each additional
uppercase-named function declaration or uppercase-named arrow/function-expression
variable after the first is reported. Move extra components to their own files.

### `component-require-default-export`

Require component files to have an `export default`. Named-only exports are
rejected.

### `component-default-export-function-declaration`

Require the default export to be a **function declaration**. Arrow functions and
function expressions (including inline `export default () => {}`) are rejected.

```tsx
// Do
function OrderSummary() {
  return <div>Summary</div>
}
export default OrderSummary

// Don't
const ArrowDefault = () => {
  return <div>Arrow</div>
}
export default ArrowDefault
```

### `component-props-interface`

Require a **local, non-exported `interface Props`** declared before the
component's default export. Enforces all of:

- Must be declared with `interface`, not a `type` alias.
- Must be named exactly `Props` — no other interface declarations allowed in
  component files.
- Must not be exported.
- Must be declared before the default export.

Exception: if the component's props type is imported (e.g. from `/types/`), the
local `Props` interface is not required.

```tsx
// Do
interface Props {
  name: string
}
export default function GreetingCard({ name }: Props) {
  return <h1>{name}</h1>
}

// Don't — exported Props
export interface Props {
  label: string
}
export default function ExportedPropsExample({ label }: Props) {
  return <p>{label}</p>
}

// Don't — type alias instead of interface
type Props = { value: number }
```

### `component-file-extension`

Require files in `/components/` to use `.tsx` (or `.jsx`). Other extensions in
the components folder are reported.

## Method rules — `src/methods/` (`.ts` / `.tsx`)

### `method-name-camel-case`

Require top-level method names to be camelCase (lowercase first letter,
alphanumeric only — no underscores, no leading capital).

### `method-one-per-file`

Require method files to contain only one top-level method. Move extras to their
own files.

### `method-require-default-export`

Require method files to default export their top-level method. Named-only
exports are rejected.

### `method-options-interface`

Allow `Options` interfaces in method files only when declared locally or
imported from a `/types/` folder. Enforces all of:

- An `Options` interface must not be exported from a method file.
- An `Options` type imported from anywhere other than a `/types/` path is
  rejected (the `/types/` folder may be nested, e.g. `../types/sub/SubOptions`).
- A method that uses an `Options` parameter must either declare a local
  `Options` interface or import it from `/types/`.

```ts
// Do — local
interface Options {
  includeMetadata: boolean
}
export default function buildRequest(id: string, options: Options): string {
  return options.includeMetadata ? `${id}:meta` : id
}

// Do — imported from /types
import type SendNotificationOptions from '../types/SendNotificationOptions'
export default function sendNotification(
  userId: string,
  options: SendNotificationOptions
): string {
  return options.notifyByEmail ? `${userId}:email` : `${userId}:in-app`
}

// Don't — exported Options
export interface Options {
  skipValidation: boolean
}
```

### `method-outside-components-function-declaration`

Require methods declared **outside** components (i.e. in `/methods/`) to be
function declarations. Arrow functions and function expressions are rejected,
including inline `export default () => {}`.

```ts
// Do
export default function buildQuery() {
  return 'SELECT 1'
}

// Don't
const buildQuery = () => {
  return 'SELECT 1'
}
export default buildQuery
```

### `method-inside-components-arrow-function`

Require methods declared **inside** component files (nested functions within the
component function body) to be arrow functions. Function declarations and named
function expressions inside a component are rejected.

```tsx
// Do
export default function UserActions() {
  const handleClick = () => {
    return 'clicked'
  }
  return <button>{handleClick()}</button>
}

// Don't
export default function UserActions() {
  function handleClick() {
    return 'clicked'
  }
  return <button>{handleClick()}</button>
}
```

## Hook rules — `src/hooks/` (`.ts` / `.tsx`)

### `hook-naming-convention`

Require top-level hook names to start with `use`.

### `hook-filename-matches-name`

Require the hook file name (excluding extension) to match the hook name.

### `hook-one-per-file`

Require hook files to contain only one top-level hook.

### `hook-require-default-export`

Require hook files to default export their top-level hook.

### `hook-default-export-function-declaration`

Require the default export to be a **named function declaration**. Arrow
functions and function expressions (including inline
`export default () => {}`) are rejected.

```ts
// Do
function useViewport(): { width: number } {
  return { width: 1024 }
}
export default useViewport

// Don't
const useViewport = (): { width: number } => {
  return { width: 1024 }
}
export default useViewport
```

### `hook-options-interface`

Same contract as `method-options-interface`, scoped to `/hooks/` files: an
`Options` interface must stay local or be imported from `/types/`; it must not
be exported; and a hook using an `Options` parameter must define or import one.

## Interface rules — `src/interfaces/` (`.ts` / `.tsx`)

### `interface-name-pascal-case`

Require interface names to be PascalCase (uppercase first letter, alphanumeric
only — no underscores or dashes).

### `interface-filename-matches-name`

Require the interface file name (excluding extension) to match the interface
name.

### `interface-one-per-file`

Require exactly one interface declaration per interface file.

### `interface-require-default-export`

Require the interface to be the default export (`export default interface X` or
`export { X as default }`).

### `interface-no-i-prefix`

Disallow interface names starting with an `I` prefix followed by an uppercase
letter (e.g. `IUser`, `IUserProfile`). Names like `index` or `item` are not
affected.

```ts
// Do
export default interface UserProfile {
  name: string
}

// Don't
export default interface IUserProfile {
  name: string
}
```

## Constant rules — `src/constants/` (`.ts` / `.tsx`)

### `constant-naming-convention`

Require readonly constant names to use `UPPERCASE_SNAKE_CASE`. Checks top-level
`const` declarations, focusing on the default-exported constant (or the only
one if there is no default export yet).

### `constant-single-object`

Require constant files to group values into a single top-level object constant.
Primitive constants or multiple top-level objects are rejected.

```ts
// Do
const API = {
  path: '/api/v1/',
  port: '4000'
}
export default API

// Don't
const API_PATH = '/api/v1/'
export default API_PATH
```

### `constant-filename-matches-name`

Require the constant file name (excluding extension) to match the constant
name.

### `constant-require-default-export`

Require constant files to default export their constants object
(`export default API` or `export { API as default }`).

## Additional oxlint rules from `defineConfigWithRules`

Beyond the custom rules above, `defineConfigWithRules` enables:

- `func-style`: `['error', 'declaration', { allowArrowFunctions: true }]`
- `typescript/consistent-type-definitions`: `error` — use `interface`, not
  `type`, for object shapes.
- `typescript/no-floating-promises`: `error`
- `typescript/no-var-requires`: `off`
- `typescript/no-unsafe-assignment`: `off`
- `no-unused-vars`: `error` with `fix.imports: 'safe-fix'`,
  `fix.variables: 'off'`
- Plugins: `import`, `eslint`, `typescript`, `react`, `unicorn`, `oxc`
- `options.typeAware: true`, `options.typeCheck: true`

## Formatting defaults (`@wanner.work/oxfmt-rules`)

The wrapper deep-merges your config on top of these defaults via `defu`, so you
only specify values you want to change.

### Layout

| Option          | Default  |
| --------------- | -------- |
| `printWidth`    | `80`     |
| `semi`          | `false`  |
| `trailingComma` | `'none'` |
| `singleQuote`   | `true`   |

### Sorting

| Option            | Default                                             |
| ----------------- | --------------------------------------------------- |
| `sortPackageJson` | `true`                                              |
| `sortImports`     | `newlinesBetween: false` with custom group ordering |

### `sortImports` groups (in order)

1. `builtin`
2. `external`
3. `internal`, `subpath`
4. `parent`, `sibling`, `index`
5. `unknown`
6. _(blank line between)_
7. `style`

## Code style summary (for generated code)

When writing code in a project that uses these rule packs, follow these
conventions so output passes lint and format:

- No semicolons; single quotes; print width 80; no trailing commas.
- Components: `export default function PascalName()` with a local
  `interface Props` declared above it. File name matches the component name.
  Use `.tsx` for components.
- Methods in `/methods/`: `export default function camelName()` (function
  declarations only, default export, one per file, file name matches).
- Methods nested inside components: arrow functions only.
- Hooks: `function useFoo()` default-exported, file name matches, one per file.
- Interfaces: `export default interface PascalName`, one per file, file name
  matches, no `I` prefix.
- Constants: single `const UPPER_SNAKE = { ... }` default-exported, file name
  matches.
- `Options` interfaces: local or imported from `/types/`; never exported from a
  method/hook file.
- Stylesheets: only in `src/styles/`.
- Folder names: lowercase only.
- Use `interface`, not `type`, for object shapes (per
  `typescript/consistent-type-definitions`).
