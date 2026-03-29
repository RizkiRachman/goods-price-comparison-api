# AI Documentation

Welcome! This folder contains documentation for AI agents working on this project.

## 📂 Folder Structure

```
.ai/
├── AGENTS.md              ← Quick reference (START HERE)
├── README.md              ← This file - navigation guide
├── rules/                 ← Standards and guidelines (MUST follow)
│   ├── CODING_STANDARDS.md
│   ├── PR_WORKFLOW.md
│   ├── GIT_WORKFLOW.md
│   └── OPENAPI_STANDARDS.md
├── skills/                ← Technical how-to guides
│   ├── JAVA.md
│   ├── TESTING.md
│   └── CONTAINERS.md
└── context/               ← Project-specific information
    ├── PROJECT_OVERVIEW.md
    └── DECISION_LOG.md
```

## 🚀 Getting Started

**New to this project?**
1. Read [AGENTS.md](./AGENTS.md) - Quick reference with critical rules
2. Read [context/PROJECT_OVERVIEW.md](./context/PROJECT_OVERVIEW.md) - Understand the project
3. Check [rules/PR_WORKFLOW.md](./rules/PR_WORKFLOW.md) - Learn the PR process

## 📋 Rules (MUST Follow)

These are **mandatory** standards:

| Rule | File | Purpose |
|------|------|---------|
| **PR Workflow** | [rules/PR_WORKFLOW.md](./rules/PR_WORKFLOW.md) | How to submit changes |
| **Coding Standards** | [rules/CODING_STANDARDS.md](./rules/CODING_STANDARDS.md) | Code style and quality |
| **Git Workflow** | [rules/GIT_WORKFLOW.md](./rules/GIT_WORKFLOW.md) | Branch strategy |
| **OpenAPI Standards** | [rules/OPENAPI_STANDARDS.md](./rules/OPENAPI_STANDARDS.md) | API specification rules |

## 🛠️ Skills (Reference)

Technical guides for common tasks:

| Skill | File | Topics |
|-------|------|--------|
| **Java** | [skills/JAVA.md](./skills/JAVA.md) | Java 17+, Streams, Optional, Records |
| **Testing** | [skills/TESTING.md](./skills/TESTING.md) | JUnit 5, Mockito, Integration tests |
| **Containers** | [skills/CONTAINERS.md](./skills/CONTAINERS.md) | Docker, Podman, Multi-platform builds |

## 📖 Context (Understand)

Project-specific information:

| Document | File | Content |
|----------|------|---------|
| **Project Overview** | [context/PROJECT_OVERVIEW.md](./context/PROJECT_OVERVIEW.md) | What this project does, goals |
| **Decision Log** | [context/DECISION_LOG.md](./context/DECISION_LOG.md) | Why certain decisions were made |

## ⚡ Quick Reference

### Critical Rules
- **NEVER push to main** - Always use PR workflow
- **NEVER auto-merge** - Wait for explicit user permission
- **All checks must pass** before PR
- **100% coverage** on new code

**User must explicitly say "merge this PR" - vague approval is not enough.**

### Pre-PR Checklist
```bash
make build      # Must pass
make test       # Must pass  
make ci-check   # Must pass
make lint       # Must pass
```

### Common Commands
```bash
# Git workflow
git checkout -b feature/name
git add .
git commit -m "feat: description"
git push -u origin feature/name
gh pr create
```

## 🎯 Project Type

This is an **API Specification Project**:
- Defines OpenAPI contracts (not the actual service)
- Generates Java DTOs automatically
- Used as Maven dependency by service project

## 🆘 Need Help?

1. **Check the docs first** - Look in appropriate folder
2. **Check AGENTS.md** - Quick reference
3. **Ask human** for: architectural decisions, breaking changes, security

## 👤 Maintainer

**Rizki Rachman**
- Email: rizkifaizalr@gmail.com
- GitHub: [@RizkiRachman](https://github.com/RizkiRachman)

---

**For Humans:** This folder is for AI agent documentation. Humans should check the main [README.md](../README.md) and [docs/](../docs/) folder.
