# Agents

Instructions for AI agents working in this repository.

## Commit Convention

Every commit message follows [Conventional Commits](https://www.conventionalcommits.org/).

### Format

```text
<type>: Title

Brief description.

- Action item 1.
- Action item n.
```

### Types

| Type    | When to use                       |
| ------- | --------------------------------- |
| `feat`  | New features or capabilities      |
| `fix`   | Bug fixes                         |
| `chore` | Tooling, config, dependencies, CI |
| `task`  | Changes to existing functionality |
| `spike` | Research or exploration           |

### Rules

- Subject line: imperative mood, lowercase, no period, max 72 characters
- Body: brief description followed by bullet points listing each concrete change
- No `Co-Authored-By` or AI attribution lines

## Tooling Contract

The `engines` field in `package.json` is the **only** source of truth for allowed runtimes and package managers. Any tool not declared there is forbidden. This applies to every agent, sub-agent, and orchestrator. No exceptions.
