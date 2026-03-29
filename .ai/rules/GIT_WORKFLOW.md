# Git Workflow

Version control best practices and branch management.

## Branch Strategy

```
main (production-ready)
  ↑
  │  ← Pull Request + Review
  │
feature/*  ← Short-lived branches
fix/*      ← Bug fix branches
docs/*     ← Documentation updates
refactor/* ← Code refactoring
```

## Branch Types

### Main Branch

**Purpose:** Production-ready code

**Rules:**
- ✅ Always deployable
- ✅ Protected branch
- ❌ No direct pushes
- ❌ Only merge via PR

### Feature Branches

**Naming:** `feature/description`

**Examples:**
- `feature/price-search-pagination`
- `feature/add-receipt-upload`

**Lifecycle:**
1. Create from main
2. Develop feature
3. Test thoroughly
4. Create PR
5. Merge to main
6. Delete branch

### Fix Branches

**Naming:** `fix/description`

**Examples:**
- `fix/null-pointer-price-calc`
- `fix/ocr-timeout-issue`

**For production bugs:**
- Create from main
- Fix quickly
- Test thoroughly
- Expedited review

### Documentation Branches

**Naming:** `docs/description`

**Examples:**
- `docs/update-readme`
- `docs/add-api-examples`

### Refactor Branches

**Naming:** `refactor/description`

**Examples:**
- `refactor/extract-price-service`
- `refactor/simplify-validation`

## Workflow Commands

### Starting New Work

```bash
# 1. Update main
git checkout main
git pull origin main

# 2. Create branch
git checkout -b feature/my-feature

# 3. Start working
```

### Regular Development

```bash
# See what changed
git status

# Stage changes
git add filename          # Specific file
git add .                 # All changes

# Commit with message
git commit -m "feat: Add feature description"

# Push to remote
git push -u origin feature/my-feature
```

### Staying Updated

```bash
# Update main
git checkout main
git pull origin main

# Rebase feature branch
git checkout feature/my-feature
git rebase main

# Or merge main into feature
git merge main
```

**Rebase vs Merge:**
- **Rebase** - Cleaner history, linear commits
- **Merge** - Preserves exact history

### Finishing Work

```bash
# Final commit
git add .
git commit -m "feat: Complete feature"

# Push
git push origin feature/my-feature

# Create PR (via GitHub CLI)
gh pr create

# After PR is merged
git checkout main
git pull origin main
git branch -D feature/my-feature
```

## Commit Best Practices

### Commit Message Format

```
type(scope): subject

body (optional) - Explain what and why

footer (optional) - References, breaking changes
```

**Examples:**

```bash
# Simple feature
git commit -m "feat(prices): Add pagination support"

# Feature with explanation
git commit -m "feat(prices): Add pagination support

Implements cursor-based pagination for price search endpoint.
Supports page size configuration and sorting options.

Fixes: #123"

# Bug fix
git commit -m "fix(receipts): Handle null product names

Prevents NullPointerException when product name is missing
from OCR results. Returns empty string instead.

Closes: #456"

# Breaking change
git commit -m "feat(api)!: Change price response format

BREAKING CHANGE: Price field is now BigDecimal instead of Double
for better precision. Update clients accordingly."
```

### Commit Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat: Add price alert endpoint` |
| `fix` | Bug fix | `fix: Correct price calculation` |
| `docs` | Documentation | `docs: Update API examples` |
| `style` | Code style | `style: Fix indentation` |
| `refactor` | Refactoring | `refactor: Extract service` |
| `test` | Tests | `test: Add unit tests` |
| `chore` | Maintenance | `chore: Update dependencies` |
| `ci` | CI/CD changes | `ci: Add build step` |
| `perf` | Performance | `perf: Optimize query` |

### Commit Frequency

**DO:**
- Commit logical units of work
- Commit when tests pass
- Commit before switching tasks

**DON'T:**
- Commit broken code
- Commit huge changes ("everything")
- Commit without testing

## Handling Conflicts

### When Rebasing

```bash
git rebase main

# If conflicts:
# 1. Fix conflicts in files
# 2. Stage resolved files
git add .

# 3. Continue rebase
git rebase --continue

# Or abort
git rebase --abort
```

### When Merging

```bash
git merge main

# If conflicts:
# 1. Fix conflicts in files
# 2. Stage resolved files
git add .

# 3. Complete merge
git commit -m "merge: Resolve conflicts with main"
```

## Branch Management

### List Branches

```bash
# Local branches
git branch

# Remote branches
git branch -r

# All branches
git branch -a

# Show latest commit on each
git branch -v
```

### Clean Up Branches

```bash
# Delete local branch (after merge)
git branch -d feature/old-branch

# Force delete (not merged)
git branch -D feature/abandoned

# Delete remote branch
git push origin --delete feature/old-branch

# Prune deleted remotes
git remote prune origin
```

### Stash Changes

```bash
# Save uncommitted changes
git stash

# List stashes
git stash list

# Apply most recent stash
git stash pop

# Apply specific stash
git stash apply stash@{1}

# Drop stash
git stash drop
```

## Tagging & Releases

### Create Tag

```bash
# Create annotated tag
git tag -a v1.0.0 -m "Release version 1.0.0"

# Push tag to remote
git push origin v1.0.0

# Push all tags
git push origin --tags
```

### Delete Tag

```bash
# Delete local tag
git tag -d v1.0.0

# Delete remote tag
git push origin --delete v1.0.0
```

## History Management

### View History

```bash
# Simple log
git log

# One line per commit
git log --oneline

# With graph
git log --oneline --graph

# Last 10 commits
git log --oneline -10

# Specific file history
git log --follow filename
```

### Undo Changes

```bash
# Unstage file
git reset HEAD filename

# Discard local changes
git checkout -- filename

# Amend last commit
git commit --amend

# Revert commit (creates new commit)
git revert commit-hash

# Reset to specific commit (DANGEROUS)
git reset --hard commit-hash
```

## Team Collaboration

### Fetch vs Pull

```bash
# Fetch only (safe)
git fetch origin

# Fetch + merge (pull)
git pull origin main

# Fetch + rebase
git pull --rebase origin main
```

### Code Review Workflow

```bash
# Checkout PR branch locally
gh pr checkout 123

# Review code
# Make comments on GitHub

# Approve or request changes
```

### Syncing Fork (if applicable)

```bash
# Add upstream remote
git remote add upstream https://github.com/original/repo.git

# Fetch upstream
git fetch upstream

# Merge upstream changes
git checkout main
git merge upstream/main
```

## Git Configuration

### Recommended Settings

```bash
# Set username and email
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Default branch name
git config --global init.defaultBranch main

# Pull with rebase
git config --global pull.rebase true

# Set default editor
git config --global core.editor "code --wait"

# Aliases
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
```

## Common Scenarios

### "I committed to wrong branch"

```bash
# Move commit to correct branch
git checkout wrong-branch
git reset HEAD~1 --soft  # Undo commit, keep changes
git stash
git checkout correct-branch
git stash pop
git add .
git commit -m "message"
```

### "I need to split a commit"

```bash
git reset HEAD~1  # Undo last commit, keep changes
git add -p        # Interactively stage hunks
git commit -m "First part"
git add .
git commit -m "Second part"
```

### "I pushed sensitive data"

```bash
# DON'T just delete file and commit
# Use git-filter-repo or BFG

# Then force push (coordinate with team!)
git push --force-with-lease
```

## Rules Summary

| Rule | Status |
|------|--------|
| Never push to main | ❌ FORBIDDEN |
| Always use feature branches | ✅ REQUIRED |
| Meaningful commit messages | ✅ REQUIRED |
| Pull before pushing | ✅ REQUIRED |
| Delete merged branches | ✅ REQUIRED |
| Tag releases | ✅ REQUIRED |

## Quick Reference

```bash
# Daily workflow
git checkout main
git pull origin main
git checkout -b feature/name
# ... work ...
git add .
git commit -m "type: message"
git push -u origin feature/name
# Create PR

# Update feature branch
git fetch origin
git rebase origin/main

# Clean up
git checkout main
git pull origin main
git branch -d feature/name
```
