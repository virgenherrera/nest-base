# Echo System

## Echo Principle

Every atomic script defined in `package.json` is reused with the **identical name** across all execution contexts: local development, lint-staged, pre-commit hook, CI, and bumpDependencies. There are no per-context aliases, renamed wrappers, or inline tool invocations. When a tool call must happen, a named script is the single source of truth — context consumers call the script, not the tool directly.

This eliminates drift: if a script's command changes, every context inherits that change automatically without touching `.lintstagedrc.json`, `.husky/pre-commit`, CI workflow files, or `.ncurc.json`.

**Corollary — lint-staged rule**: `.lintstagedrc.json` MUST NOT call bare tool binaries (`prettier`, `eslint`, etc.). It MUST call `pnpm run <script-name> --` so that lint-staged forwards staged filenames as positional args to the named script.

---

## Script Taxonomy

Scripts fall into two types:

- **atomic** — single-tool, single-purpose. Safe to call from any context without side effects.
- **composite** — ordered composition of atomic scripts connected by `&&`. Encodes a pipeline stage.

| Script | Type | Category | local-dev | lint-staged | pre-commit | CI | bumpDeps |
|---|---|---|:---:|:---:|:---:|:---:|:---:|
| `start:dev` | atomic | serve | yes | no | no | no | no |
| `start:prod` | atomic | serve | yes | no | no | no | no |
| `test` | composite | pipeline | yes | no | no | no | no |
| `build:app` | atomic | build | yes | no | yes | yes | yes (via test:doctor) |
| `build:api-docs` | atomic | build | yes | no | no | yes | no |
| `test:doctor` | composite | pipeline | yes | no | no | no | yes (NCU gate) |
| `test:static` | composite | check | yes | no | no | no | no |
| `test:dynamic` | atomic | test | yes | no | yes | yes | yes (via test:doctor) |
| `securityCheck` | atomic | check | yes | no | no | yes | yes (via test:doctor) |
| `eslintCheck` | atomic | check | yes | no | no | yes | yes (via test:doctor) |
| `eslintFix` | atomic | fix | yes | yes | no | no | no |
| `prettierCheck` | atomic | check | yes | no | no | yes | yes (via test:doctor) |
| `prettierFix` | atomic | fix | yes | yes | no | no | no |
| `prepare` | atomic | lifecycle | yes | no | no | no | no |
| `lintStaged` | atomic | orchestration | yes | no | yes | no | no |
| `cleanup` | atomic | housekeeping | yes | no | no | no | yes (via test:doctor) |
| `securityFix` | atomic | fix | yes | no | no | no | yes (direct) |
| `updatePnpm` | atomic | maintenance | yes | no | no | no | no |
| `bumpDependencies` | composite | maintenance | yes | no | no | no | — (is the context) |

> **Composites**: `test`, `test:static`, `test:doctor`, `bumpDependencies`. All other scripts are atomic.

---

## Pipeline Order Contract

Scripts are organized into five stages. **No script in stage N may depend on a script from stage N+1 or later.** This is the no-forward-dependency rule.

| Stage | Name | Scripts in Order |
|---|---|---|
| 0 | clone/checkout | — |
| 1 | projectSetup | node install → pnpm install |
| 1.5 | cleanup | `cleanup` (composites that need a clean slate run this first) |
| 2 | test:static | `securityCheck` → `eslintCheck` → `prettierCheck` |
| 3 | test:dynamic | `test:dynamic` (jest — unit + e2e) |
| 4 | build | `build:api-docs` → `build:app` (independent; order matches CI and `test` composite) |

`securityFix` is not assigned a stage — it is a maintenance action invoked only by `bumpDependencies` (pre/post upgrade), not part of the standard pipeline.

A violation occurs when a stage-2 script is invoked before stage-1 completes, or when a stage-4 script is called as a precondition for a stage-3 script. The `&&` chains in composite scripts encode this order.

---

## Execution Context Comparison

Each column shows which scripts run in that context. Cross-check this matrix against `.lintstagedrc.json`, `.husky/pre-commit`, `.github/workflows/ci.yml`, and `.ncurc.json` to verify consistency.

| Script | local-dev | lint-staged | pre-commit | CI | bumpDeps |
|---|:---:|:---:|:---:|:---:|:---:|
| `securityFix` | optional | no | no | no | yes (pre+post) |
| `lintStaged` | optional | no | yes (first) | no | no |
| `prettierFix` | optional | yes | no (via lintStaged) | no | no |
| `eslintFix` | optional | yes | no (via lintStaged) | no | no |
| `cleanup` | optional | no | no | no | yes (via test:doctor) |
| `securityCheck` | optional | no | no | yes | yes (via test:doctor) |
| `eslintCheck` | optional | no | no | yes | yes (via test:doctor) |
| `prettierCheck` | optional | no | no | yes | yes (via test:doctor) |
| `test:dynamic` | optional | no | yes | yes | yes (via test:doctor) |
| `build:api-docs` | optional | no | no | yes | no |
| `build:app` | optional | no | yes (last) | yes | yes (via test:doctor) |

**Pre-commit pipeline**: `lintStaged` (applies fixes to staged files via `prettierFix`/`eslintFix`) → `test:dynamic` → `build:app`.

**CI pipeline**: `securityCheck` → `eslintCheck` → `prettierCheck` → `test:dynamic` → `build:api-docs` → `build:app`.

**bumpDependencies pipeline**: `securityFix` → NCU `--doctor` (calls `test:doctor` per dependency: `cleanup` → `securityCheck` → `eslintCheck` → `prettierCheck` → `test:dynamic` → `build:app`) → `securityFix`.

Note: CI runs check scripts (read-only), not fix scripts. Fix scripts are pre-commit only. bumpDependencies uses `test:doctor` as its validation gate — NCU rolls back any dependency whose upgrade causes `test:doctor` to fail.

---

## Pipeline Diagrams

### Pre-commit

```mermaid
flowchart TD
    A([git commit]) --> B[.husky/pre-commit]

    B --> C[pnpm run lintStaged]

    C --> D[.lintstagedrc.json]
    D --> E[pnpm run prettierFix -- staged-files]
    E --> F[pnpm run eslintFix -- staged-files]
    F --> G{lintStaged done}

    G --> H[pnpm run test:dynamic]
    H --> I[pnpm run build:app]

    I --> J{All passed?}
    J -- yes --> K([Commit proceeds])
    J -- no --> L([Exit 1 — commit aborted])
```

### bumpDependencies

```mermaid
flowchart TD
    A([pnpm run bumpDependencies]) --> B[pnpm run securityFix]
    B --> C["pnpm dlx npm-check-updates@17 (doctor mode via .ncurc.json)"]

    C --> D{For each dependency}
    D --> E[Upgrade dependency in package.json]
    E --> F[pnpm run test:doctor]

    F --> G[pnpm run cleanup]
    G --> H[pnpm run securityCheck]
    H --> I[pnpm run eslintCheck]
    I --> J[pnpm run prettierCheck]
    J --> K[pnpm run test:dynamic]
    K --> L[pnpm run build:app]

    L --> M{test:doctor passed?}
    M -- yes --> N[Keep upgrade]
    M -- no --> O[Rollback dependency]
    N --> D
    O --> D

    D -- all done --> P[pnpm run securityFix]
    P --> Q([Done])
```

---

## lint-staged Forwarding Note

`prettierFix` and `eslintFix` are defined **without a glob** (`prettier --write`, `eslint --fix`) because lint-staged passes the list of staged filenames as trailing arguments. Using `pnpm run prettierFix --` causes pnpm to forward everything after `--` directly to the underlying tool, so each staged file is processed individually.

If a glob were embedded in the script (e.g., `prettier --write '{src}/**/*.ts'`), pnpm would append the staged filenames AFTER the glob, causing the glob matches to be formatted as well. Option A (no glob in the script) is intentional and verified.

When invoking these scripts standalone during local development, pass the glob explicitly:

```bash
pnpm run prettierFix -- '{apps,libs,scripts,src,test}/**/*.ts'
pnpm run eslintFix -- '{apps,libs,scripts,src,test}/**/*.ts'
```

---

## Scope Difference: lint-staged vs Check Scripts

`.lintstagedrc.json` targets `*.{js,json,mjs,ts,tsx}` — five file extensions. The check scripts (`eslintCheck`, `prettierCheck`) only target `*.ts` files within specific directories.

This means lint-staged applies fixes to `.js`, `.json`, `.mjs`, and `.tsx` files during pre-commit, but CI's check scripts only verify `.ts` files. A formatting regression in a non-`.ts` file would be caught by pre-commit but NOT by CI.

This is intentional: lint-staged fixes everything it touches before committing, while CI validates the primary source files. The broader lint-staged glob acts as a first-pass safety net.
