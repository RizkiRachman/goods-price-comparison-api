# Pull Request Workflow

The complete process for submitting code changes.

## Overview

All changes MUST go through Pull Request (PR). No direct pushes to main.

```
┌─────────────────────────────────────────────────────────┐
│  1. Create Feature Branch                               │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  2. Make Changes & Test Locally                         │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  3. Push Branch & Create PR                             │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  4. CI/CD Checks Run Automatically                      │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  5. Code Review                                         │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  6. Merge to Main                                       │
└─────────────────────────────────────────────────────────┘
```

## Step-by-Step Process

### Step 1: Create Feature Branch

```bash
# From main branch
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/description

# Naming conventions:
# - feature/description  (new features)
# - fix/description      (bug fixes)
# - docs/description     (documentation)
# - refactor/description (code refactoring)
```

### Step 2: Make Changes

**While developing:**

```bash
# Regular commits
git add .
git commit -m "type(scope): description"

# Example:
git commit -m "feat(prices): Add pagination to price search"
```

**Commit Message Format:**
```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process changes

### Step 3: Test Locally (CRITICAL)

**MUST PASS before creating PR:**

```bash
# 1. Build
make build
# or: mvn clean compile -q

# 2. Run tests
make test
# or: mvn test

# 3. Check style
mvn checkstyle:check

# 4. Check bugs
mvn spotbugs:check

# 5. Check coverage
mvn jacoco:report
```

**If ANY check fails:**
1. Fix the issues
2. Re-run checks
3. Only proceed when all pass

### Step 4: Push & Create PR

```bash
# Push branch
git push -u origin feature/description

# Create PR via GitHub CLI
gh pr create --title "type: Description" --body "Detailed description"
```

**PR Title Format:**
```
type: Brief description

Examples:
- feat: Add v3 price search endpoint
- fix: Correct pagination in price results  
- docs: Update API versioning documentation
```

**PR Body Template:**
```markdown
## Summary
Brief description of changes

## Changes
- Change 1
- Change 2

## Testing
- [ ] Tests added/updated
- [ ] Coverage >= 90%
- [ ] Manual testing done

## Checklist
- [ ] Code follows style guide
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Step 5: Automated Checks

Once PR is created, GitHub Actions automatically runs:

| Check | Tool | Must Pass |
|-------|------|-----------|
| OpenAPI Linting | Spectral | ✅ |
| Build | Maven | ✅ |
| Unit Tests | JUnit | ✅ |
| Coverage | JaCoCo | ✅ (90%+) |
| Code Style | Checkstyle | ✅ |
| Bug Detection | SpotBugs | ✅ |
| Security Scan | CodeQL | ✅ |

**If checks fail:**
1. Check logs in GitHub Actions tab
2. Fix issues locally
3. Push fixes to same branch
4. Checks re-run automatically

### Step 6: Code Review

**Automated checks must pass first**, then human review.

**Reviewers check:**
- Code quality and style
- Test coverage
- Documentation
- Architecture fit
- Security concerns

**Addressing feedback:**
```bash
# Make requested changes
git add .
git commit -m "refactor: Address review feedback"
git push

# PR updates automatically
```

### Step 7: Merge

**⚠️ CRITICAL: AI Agents CANNOT Auto-Merge**

**AI agents are FORBIDDEN from merging PRs automatically.**

**Only the user can give merge permission.**

### Getting Merge Permission

**User must explicitly say:**
- ✅ "Merge this PR"
- ✅ "Approved, please merge"
- ✅ "Go ahead and merge"
- ✅ Similar explicit permission

**Vague statements are NOT permission:**
- ❌ "Looks good" 
- ❌ "OK"
- ❌ "👍"
- ❌ Silence / no response

### Requirements for merge:
- ✅ All CI checks passing
- ✅ Code review approved (by user or system)
- ✅ No conflicts with main
- ✅ Branch up to date
- ✅ **User has explicitly given permission**

### Merge methods:
- **Squash & Merge** - Preferred (clean history)
- **Rebase & Merge** - Linear history
- **Merge Commit** - Preserves all commits

**After merge command from user:**
```bash
gh pr merge <number> --squash --delete-branch
```

```bash
# After merge, clean up
git checkout main
git pull origin main
git branch -D feature/description
```

## Pre-PR Checklist

Before creating PR, verify:

### Code Quality
- [ ] Build passes: `mvn clean compile -q`
- [ ] Tests pass: `mvn test` (100% success)
- [ ] Coverage >= 90% (100% for new code)
- [ ] Checkstyle passes: `mvn checkstyle:check`
- [ ] SpotBugs passes: `mvn spotbugs:check`

### Documentation
- [ ] README.md updated (if needed)
- [ ] JavaDoc for public APIs
- [ ] API docs updated (if OpenAPI changes)
- [ ] CHANGELOG.md updated

### Git
- [ ] Branch named correctly
- [ ] Meaningful commit messages
- [ ] No merge conflicts
- [ ] Rebased on latest main

### Testing
- [ ] Unit tests for new code
- [ ] Edge cases covered
- [ ] Integration tests (if DB changes)
- [ ] Manual testing done

## PR Blocking Rules

**PR will be REJECTED if:**

❌ Build fails
❌ Tests fail
❌ Coverage < 90%
❌ Checkstyle violations
❌ SpotBugs high priority bugs
❌ No tests for new code
❌ Breaking changes without approval

**When in doubt:**
- Ask before making architectural changes
- Discuss breaking changes first
- Get approval for new dependencies

## Emergency Procedures

### Direct Push to Main (FORBIDDEN)

**If you accidentally push to main:**

1. **STOP** - Don't panic
2. **Inform team immediately**
3. **Assess impact**
4. **Create revert PR if needed**
5. **Document what happened**

**DO NOT:**
- Push more to main to "fix it"
- Force push to main
- Hide the mistake

### Hotfix Process

For urgent production fixes:

```bash
# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-fix

# 2. Make minimal fix
# 3. Test thoroughly
# 4. Create PR with HIGH PRIORITY label
# 5. Request expedited review
# 6. Merge and deploy
```

## Best Practices

### Small PRs
- Keep PRs focused (one feature/fix)
- Ideal size: < 500 lines changed
- Easier to review, faster to merge

### Descriptive PRs
- Clear title and description
- What changed and why
- Testing instructions
- Screenshots (if UI)

### Review Culture
- Respond to feedback promptly
- Be constructive in reviews
- Learn from feedback
- Help others improve

### Communication
- Comment on your own PR for complex logic
- @mention relevant people
- Update PR description as changes are made

## Tools

### GitHub CLI (gh)

```bash
# View PR status
gh pr status

# View PR checks
gh pr checks

# View PR diff
gh pr diff

# Merge PR
gh pr merge

# View workflow runs
gh run list
gh run view
```

### Local Testing

```bash
# Quick check
make ci-check

# Full verification
mvn clean verify
```

## See Also

- [Coding Standards](./CODING_STANDARDS.md)
- [Git Workflow](./GIT_WORKFLOW.md)
- [Testing Guide](../skills/TESTING.md)
