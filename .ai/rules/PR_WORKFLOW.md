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

### Pre-PR Verification Checklist (CRITICAL)

**AI Agent MUST complete BEFORE creating PR:**

```bash
# Run ALL checks - must pass 100%
make build      # Build and generate
make test       # Run tests
make ci-check   # Full verification
make lint       # Lint OpenAPI
```

**If ANY check fails:**
1. Fix issues
2. Re-run ALL checks
3. Repeat until ALL pass
4. Only THEN create PR

**Why:** Don't waste CI resources on known-broken code.

### Step 4: Push & Create PR

```bash
# Verify branch is up to date
git pull origin main

# Push branch
git push -u origin feature/description

# Create PR
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

**⚠️ NO CARRY-OVER PERMISSION:**
- ❌ NEVER assume permission from previous conversations
- ❌ NEVER assume permission from previous sessions
- ❌ NEVER use "last time you said" or "you previously approved"
- ✅ **ALWAYS ask for fresh permission in the current conversation**
- ✅ Permission must be explicitly given in THIS session

**Example:**
```
User (yesterday): "Merge PR #5"
[Next day, new session]
AI: "I see PR #6 is ready. Do you want me to merge it?"  ✓ CORRECT
AI: "Merging PR #6 now since you said to merge yesterday"  ✗ WRONG
```

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
- ✅ **All CI checks passing** - Check with: `gh pr checks <number>`
- ✅ Code review approved (by user or system)
- ✅ No conflicts with main
- ✅ Branch up to date
- ✅ **User has explicitly given permission**

### ⚠️ CRITICAL: Wait for CI Before Merging

**Even if user says "merge this PR", AI agent MUST:**

1. **Check CI status FIRST:**
   ```bash
   gh pr checks <number>
   ```

2. **If checks are RUNNING:**
   - Wait for completion
   - Check status again
   - Only proceed if ALL pass

3. **If checks FAIL:**
   - Report failure to user
   - DO NOT merge
   - Wait for user to fix and re-approve

4. **Only merge when:**
   - User explicitly approved
   - **AND** all CI checks pass
   - **AND** no breaking changes detected

**Example:**
```
User: "Merge this PR"
AI: "Checking CI status..."
[Checks running]
AI: [Waits 2-3 minutes]
AI: "All checks passed! Merging now..."
[Merge executed]
```

### Post-Approval Steps (Before Merge)

**Once user approves PR, AI agent MUST:**

1. **Update CHANGELOG.md:**
   - Add entry under `[Unreleased]` section
   - Describe the change briefly
   - Include PR number

2. **Update Documentation if needed:**
   - README.md (if behavior changes)
   - API docs (if endpoints change)
   - Architecture docs (if design changes)

3. **Commit documentation updates:**
   ```bash
   git add CHANGELOG.md [other docs]
   git commit -m "docs: Update changelog for PR #<number>"
   git push origin <branch>
   ```

4. **Wait for CI to pass on doc updates**

5. **Ask about release tag:**
   ```
   "Do you want to create a release tag for this PR?"
   ```
   - If YES: Create annotated tag with release notes after merge
   - If NO: Still create automatic version tag (e.g., `v1.0.1`, `v1.0.2`)
   - Tag format: `v{major}.{minor}.{patch}` incremented automatically

6. **Only then merge**

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
