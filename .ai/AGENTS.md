# AI Agent Guidelines

Quick reference for AI agents working on this project.

## 🚨 Critical Rules

### 1. NEVER Push to Main
**ABSOLUTELY FORBIDDEN:**
- ❌ Direct commits to `main`
- ❌ Direct pushes to `main`  
- ❌ Using `--force` or `--admin` on main

**ALWAYS:**
- ✅ Create feature branch: `git checkout -b feature/description`
- ✅ Push to feature branch: `git push origin feature/description`
- ✅ Create Pull Request
- ✅ Wait for CI + Review
- ✅ Merge via PR

### 2. Pre-PR Checklist (MUST PASS)

```bash
# Run these checks - ALL MUST PASS
make build      # mvn clean compile -q
make test       # mvn test (100% pass)
make ci-check   # Full quality check
make lint       # spectral lint
```

**Requirements:**
- ✅ Build: 0 errors
- ✅ Tests: 100% pass
- ✅ Coverage: ≥90% (100% new code)
- ✅ Checkstyle: 0 violations
- ✅ SpotBugs: 0 high priority

## 📁 Documentation Structure (NEW)

| Folder | Purpose | Files |
|--------|---------|-------|
| [rules/](./rules/) | **Standards** (MUST follow) | CODING_STANDARDS, PR_WORKFLOW, GIT_WORKFLOW, OPENAPI_STANDARDS |
| [skills/](./skills/) | **How-to guides** | JAVA, TESTING, CONTAINERS |
| [context/](./context/) | **Project info** | PROJECT_OVERVIEW, DECISION_LOG |

### Quick Links

**Start Here:**
1. [rules/PR_WORKFLOW.md](./rules/PR_WORKFLOW.md) - How to create PRs
2. [rules/CODING_STANDARDS.md](./rules/CODING_STANDARDS.md) - Code style
3. [context/PROJECT_OVERVIEW.md](./context/PROJECT_OVERVIEW.md) - What this project is

**Reference:**
- [skills/JAVA.md](./skills/JAVA.md) - Java 17+ features
- [skills/TESTING.md](./skills/TESTING.md) - Testing guide
- [skills/CONTAINERS.md](./skills/CONTAINERS.md) - Docker/Podman

**Project Decisions:**
- [context/DECISION_LOG.md](./context/DECISION_LOG.md) - Why choices were made

## 🛠️ Common Commands

```bash
# Development
make build       # Build project
make test        # Run tests  
make lint        # Lint OpenAPI
make ci-check    # Full verification

# Git workflow
git checkout -b feature/name
git add .
git commit -m "type: description"
git push -u origin feature/name
gh pr create
```

## 📝 Commit Format

```
type(scope): description

types: feat, fix, docs, style, refactor, test, chore, ci

examples:
- feat(prices): Add pagination
- fix(receipts): Handle null
- docs(readme): Update examples
```

## 🎯 Key Points

**Project Type:** API Specification (not service)
- Defines OpenAPI contracts
- Generates Java DTOs
- Used by service project

**Architecture:**
- OpenAPI 3.0 spec → Generated DTOs → Maven dependency
- Multi-platform containers (AMD64 + ARM64)
- GitHub Actions CI/CD

## 🆘 Help

**Check documentation first:**
1. `rules/` - Standards to follow
2. `skills/` - How to do things  
3. `context/` - Project information

**Ask human for:**
- Architectural decisions
- Breaking changes
- Security concerns

## 👤 Maintainer

**Rizki Rachman**  
📧 rizkifaizalr@gmail.com  
🔗 [@RizkiRachman](https://github.com/RizkiRachman)

---

**Remember: Quality > Speed. A perfect PR is better than a fast PR.**

*Last updated: 2026-03-29*
