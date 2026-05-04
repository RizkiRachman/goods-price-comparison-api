# Goods Price Comparison API — Agent Guide

This is an **API-first/contract-first** project. The single source of truth is `src/main/resources/openapi/main.yaml`. Java DTOs and Spring controller interfaces are auto-generated from it — never edit generated code.

## Build & Verify

```bash
make lint       # spectral lint main.yaml (runs first in build)
make build      # lint + mvn clean compile (generates DTOs, bundled spec, Postman)
make test       # build + mvn test
make ci-check   # lint + build + test + checkstyle + spotbugs
```

`make build` auto-generates these tracked files — commit them if they change:
- `openapi-bundled.yaml` — resolved single-file spec (via `@redocly/cli bundle`)
- `target/postman-collection.json` — Postman collection (via `openapi-to-postmanv2`)

Versions in `pom.xml` and `main.yaml` (`info.version`) must always match.

## Spec Conventions

- **File layout:** `main.yaml` → `paths/*.yaml` (endpoints) + `schemas/*.yaml` (models). One path file per resource group. New endpoints go in the appropriate `paths/{resource}.yaml`.
- **`$ref` in main.yaml** uses JSON Pointer encoding: `#/paths/~1v1~1products~1{productId}`.
- **Path format:** `/v{N}/{resource}[/{resourceId}][/{action}]` — no `/api/` prefix, no trailing slashes.
- **Every operation must have:** `operationId` (camelCase), `description`, `tags`, path param `description` — enforced by `.spectral.yaml` lint rules.
- **Schemas:** request → `schemas/requests.yaml`, response → `schemas/responses.yaml`, models → `schemas/models.yaml`, version-specific → `schemas/v{N}/`.
- **Versioning:** URL path (`/v1/`, `/v2/`). Breaking changes only in new major versions. Old versions deprecated with 30-day notice.

## Git & PR Workflow

- **Never push/commit to `main`.** Always create a feature branch: `git checkout -b {type}/{description}`.
- **Pre-PR checklist (must pass before creating PR):** `make ci-check`
- **Commit format:** `type(scope): description` — types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`.
- **Never auto-merge.** Wait for explicit user instruction. Before merging: check CI with `gh pr checks <number>`, update CHANGELOG, ask about release tag.

## Architecture

```
OpenAPI 3.0.3 YAML → OpenAPI Generator (Maven plugin) → Java DTOs + Controller interfaces
                                                       → openapi-bundled.yaml (Redocly)
                                                       → Postman collection
```

The generated JAR is consumed as a Maven dependency by `goods-price-comparison-service` (separate repo). This repo does not contain service implementation code — only the contract and generated artifacts.

## Reference Files

Existing instruction sources with detail worth preserving:
- `.ai/rules/OPENAPI_STANDARDS.md` — full spec conventions (path naming, operationId format, schema structure, examples)
- `.ai/rules/CODING_STANDARDS.md` — Java style (Google Java, 4-space indent, 100-char line limit)
- `.ai/rules/GIT_WORKFLOW.md` — branch strategy and PR lifecycle
- `.opencode/skills/openapi-system-design/SKILL.md` — OpenCode skill for API design work
- `.opencode/skills/release-plan/SKILL.md` — Release management: version bumps, CI gates, PR creation, changelog updates
- `.opencode/skills/token-optimize/SKILL.md` — Token efficiency: optimize file reading, batch operations, context management
