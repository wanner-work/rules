# wanner.work / rules

A monorepo of opinionated configs and rule packs for building consistent
React + TypeScript projects. Each package is published under the
`@wanner.work/*` scope and can be installed independently.

The two packages in the repo today are:

- [`@wanner.work/oxlint-rules`](./packages/oxlint-rules) — an
  [oxlint](https://oxc.rs/docs/guide/usage/linter.html) config wrapper that
  bundles a set of rules for writing consistent code. It enforces a small
  [folder convention](https://rules.wanner.work/docs/folder) and a set of
  declaration-style rules (component shape, method exports, hook naming, etc.)
  so that every file in your project follows the same pattern.
- [`@wanner.work/oxfmt-rules`](./packages/oxfmt-rules) — an
  [oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) config wrapper that
  bundles a set of formatting defaults. The wrapper is intentionally light:
  it ships opinionated values for the common layout and sorting options, and
  stays out of your way for everything else.

## Repository structure

```
.
├── packages/
│   ├── oxlint-rules/   # @wanner.work/oxlint-rules — published to npm
│   └── oxfmt-rules/    # @wanner.work/oxfmt-rules  — published to npm
└── docs/               # Fumadocs-based documentation site (rules-docs)
```

## Packages

- [`@wanner.work/oxlint-rules`](./packages/oxlint-rules/README.md) — folder-scoped linting rules for components, interfaces, methods, constants, hooks, and more. See its [README](./packages/oxlint-rules/README.md) for the full rule list and usage.
- [`@wanner.work/oxfmt-rules`](./packages/oxfmt-rules/README.md) — formatting defaults with built-in import and `package.json` sorting. See its [README](./packages/oxfmt-rules/README.md) for the option reference and usage.

## Documentation

The [`docs/`](./docs) workspace is a [Fumadocs](https://fumadocs.dev) site built with Next.js. It hosts the human-readable rule reference, the folder convention, and the per-package changelogs. The site is published at [rules.wanner.work](https://rules.wanner.work).

```bash
pnpm --filter rules-docs dev          # start the docs dev server
pnpm --filter rules-docs build        # build the docs site
pnpm --filter rules-docs types:check  # type-check MDX and sources
```

## Development

This is a pnpm workspace.

```bash
pnpm install                                            # install all workspace dependencies
pnpm --filter @wanner.work/oxlint-rules build
pnpm --filter @wanner.work/oxlint-rules lint
pnpm --filter @wanner.work/oxlint-rules check
pnpm --filter @wanner.work/oxlint-rules format

pnpm --filter @wanner.work/oxfmt-rules build
pnpm --filter @wanner.work/oxfmt-rules lint
pnpm --filter @wanner.work/oxfmt-rules format
```

### Publishing

All `@wanner.work/*` packages are published to npm via GitHub Actions on every
version tag (`@wanner.work/<package>-v*`). See [`.github/workflows/publish.yaml`](./.github/workflows/publish.yaml).

```bash
pnpm --filter @wanner.work/oxlint-rules release
pnpm --filter @wanner.work/oxfmt-rules release
```

## License

MIT © wanner.work
