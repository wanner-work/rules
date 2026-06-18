# wanner.work / rules

A monorepo for opinionated linting rules and the documentation that describes them.

The published package is [`@wanner.work/oxlint-rules`](./packages/oxlint-rules) — an [oxlint](https://oxc.rs/docs/guide/usage/linter.html) config wrapper that bundles a set of rules for writing consistent code. The full rule reference lives in the [docs site](./docs).

## Repository structure

```
.
├── packages/
│   └── oxlint-rules/   # @wanner.work/oxlint-rules — the published package
└── docs/               # Fumadocs-based documentation site
```

## Packages

- [`@wanner.work/oxlint-rules`](./packages/oxlint-rules/README.md) — oxlint config wrapper with rules for components, interfaces, methods, constants, hooks, and more. See its [README](./packages/oxlint-rules/README.md) for the full rule list and usage.

## Documentation

The [`docs/`](./docs) workspace is a [Fumadocs](https://fumadocs.dev) site built with Next.js. It hosts the human-readable rule reference and any guides.

```bash
pnpm --filter rules-docs dev          # start the docs dev server
pnpm --filter rules-docs build        # build the docs site
pnpm --filter rules-docs types:check  # type-check MDX and sources
```

## Development

This is a pnpm workspace.

```bash
pnpm install                          # install all workspace dependencies
pnpm --filter @wanner.work/oxlint-rules build
pnpm --filter @wanner.work/oxlint-rules lint
pnpm --filter @wanner.work/oxlint-rules check
pnpm --filter @wanner.work/oxlint-rules format
```

### Publishing

The package is published to npm via GitHub Actions on every version tag (`v*`). See [`.github/workflows/publish.yaml`](./.github/workflows/publish.yaml).

```bash
pnpm --filter @wanner.work/oxlint-rules release
```

## License

MIT © wanner.work
