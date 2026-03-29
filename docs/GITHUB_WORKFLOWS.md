# GitHub Actions Workflows

This document describes all GitHub Actions workflows used in this project.

## Overview

| Workflow | File | Purpose | Trigger |
|----------|------|---------|---------|
| **CI/CD Pipeline** | `ci.yml` | Main build, test, and publish | Push/PR to main/develop |
| **CodeQL** | `codeql.yml` | Security vulnerability scanning | Push/PR + Weekly |

---

## CI/CD Pipeline (`ci.yml`)

The main continuous integration and deployment workflow.

### Stages

#### 1. Lint OpenAPI
**Job:** `lint`
- Installs Spectral CLI
- Validates OpenAPI specification
- Fails if any linting errors found

#### 2. Build & Test
**Job:** `build`
- Builds Docker image with multi-stage build
- Runs all Maven tests
- Generates test reports
- Uploads JAR artifact

#### 3. Code Quality
**Job:** `quality`
- Runs Checkstyle (code style validation)
- Runs SpotBugs (bug detection)
- Must pass before publishing

#### 4. Publish Artifact
**Job:** `publish`
- Publishes JAR to GitHub Packages
- Only runs on push to main
- Uses `GITHUB_TOKEN` (automatic)

#### 5. Build Container
**Job:** `container`
- Builds OCI image
- Pushes to GitHub Container Registry (ghcr.io)
- Tags: branch name, commit SHA, latest

### Environment Variables

```yaml
REGISTRY: ghcr.io
IMAGE_NAME: ${{ github.repository }}
```

### Required Secrets

- `GITHUB_TOKEN` - Automatically provided by GitHub

### Artifact Locations

After successful run, find artifacts at:

- **Maven Package:** https://github.com/RizkiRachman/goods-price-comparison-api/packages
- **Container Image:** `ghcr.io/rizkirachman/goods-price-comparison-api:latest`

---

## CodeQL Analysis (`codeql.yml`)

Automated security vulnerability scanning.

### Features

- **Security Scanning:** Detects security vulnerabilities in Java code
- **Code Quality:** Identifies code quality issues
- **Zero Setup:** Uses built-in GitHub CodeQL (no tokens required)
- **Weekly Scans:** Runs every Monday at 9 AM

### What It Checks

- SQL injection vulnerabilities
- Cross-site scripting (XSS)
- Path traversal
- Insecure deserialization
- Hardcoded credentials
- And more...

### Viewing Results

1. Go to repository **Security** tab
2. Click **Code scanning alerts**
3. View detailed findings with:
   - Severity level (Critical, High, Medium, Low)
   - Description of issue
   - Affected file and line number
   - Recommended fix

### Configuration

```yaml
queries: security-extended,security-and-quality
languages: [ 'java' ]
```

---

## Manual Workflow Runs

### Trigger CI Manually

```bash
# Push to trigger
git push origin feature/my-feature

# Or create PR
git push origin feature/my-feature
gh pr create
```

### View Workflow Status

1. Go to **Actions** tab in repository
2. Select workflow name
3. View logs for each job

### Download Artifacts

1. Go to completed workflow run
2. Scroll to **Artifacts** section
3. Click to download

---

## Troubleshooting

### Build Failures

**Problem:** Maven build fails
**Solution:**
```bash
# Test locally first
mvn clean compile -q
mvn test
```

**Problem:** Spectral linting fails
**Solution:**
```bash
# Check locally
spectral lint src/main/resources/openapi/main.yaml --ruleset .spectral.yaml
```

**Problem:** SpotBugs reports issues
**Solution:**
```bash
# View report locally
mvn spotbugs:spotbugs
open target/spotbugsXml.xml
```

### Performance Issues

**Slow builds:**
- Workflow uses caching for Maven dependencies
- Docker layer caching enabled
- Check cache hit rate in logs

**Memory issues:**
- Default GitHub runners: 2-core CPU, 7GB RAM
- Increase heap size if needed:
  ```yaml
  env:
    MAVEN_OPTS: "-Xmx4g"
  ```

---

## Workflow Badges

Add to README.md to show status:

```markdown
[![CI/CD](https://github.com/RizkiRachman/goods-price-comparison-api/actions/workflows/ci.yml/badge.svg)](https://github.com/RizkiRachman/goods-price-comparison-api/actions/workflows/ci.yml)
[![CodeQL](https://github.com/RizkiRachman/goods-price-comparison-api/actions/workflows/codeql.yml/badge.svg)](https://github.com/RizkiRachman/goods-price-comparison-api/actions/workflows/codeql.yml)
```

---

## Updating & Improving Workflows

### How to Modify Workflows

1. **Edit workflow files** in `.github/workflows/`
2. **Test on feature branch** before merging to main
3. **Commit and push** - changes take effect immediately

```bash
# Edit workflow
git checkout -b feature/update-ci
# Edit .github/workflows/ci.yml
git add .github/workflows/ci.yml
git commit -m "ci: Update workflow"
git push origin feature/update-ci
# Create PR to test changes
```

### Common Improvements

#### 1. Add More Tests

```yaml
# Add to ci.yml jobs section
integration-test:
  name: Integration Tests
  runs-on: ubuntu-latest
  needs: build
  steps:
    - uses: actions/checkout@v4
    - name: Run integration tests
      run: mvn verify -P integration-tests
```

#### 2. Add Code Coverage Reporting

```yaml
# Add after test job
coverage:
  name: Coverage Report
  runs-on: ubuntu-latest
  needs: build
  steps:
    - uses: actions/checkout@v4
    - name: Generate coverage
      run: mvn jacoco:report
    - name: Upload to Codecov
      uses: codecov/codecov-action@v3
```

#### 3. Multi-Platform Builds

```yaml
# Build for multiple architectures
strategy:
  matrix:
    platform: [ubuntu-latest, macos-latest, windows-latest]
runs-on: ${{ matrix.platform }}
```

#### 4. Conditional Steps

```yaml
# Only run on specific branches
- name: Deploy to production
  if: github.ref == 'refs/heads/main'
  run: echo "Deploying..."

# Skip on draft PRs
if: github.event.pull_request.draft == false
```

#### 5. Matrix Builds

```yaml
# Test with multiple Java versions
strategy:
  matrix:
    java-version: ['17', '21']
steps:
  - uses: actions/setup-java@v4
    with:
      java-version: ${{ matrix.java-version }}
```

### Best Practices

#### ✅ Do

- **Use specific action versions** (e.g., `@v4` not `@master`)
- **Cache dependencies** to speed up builds
- **Use secrets for sensitive data**
- **Add timeouts** to prevent hanging jobs:
  ```yaml
  timeout-minutes: 30
  ```
- **Use `fail-fast: false`** for matrix builds

#### ❌ Don't

- **Don't hardcode credentials** - use secrets
- **Don't use `latest` tags** for stability
- **Don't store large files** in artifacts
- **Don't run heavy jobs** on every commit

### Performance Optimization

#### Enable Caching

```yaml
- name: Cache Maven dependencies
  uses: actions/cache@v4
  with:
    path: ~/.m2
    key: ${{ runner.os }}-m2-${{ hashFiles('**/pom.xml') }}
    restore-keys: ${{ runner.os }}-m2
```

#### Parallel Jobs

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps: [...]
  
  test:
    runs-on: ubuntu-latest
    steps: [...]
  
  # These run in parallel!
```

#### Conditional Execution

```yaml
# Skip unnecessary runs
if: github.event_name == 'pull_request' && github.event.action != 'closed'
```

### Adding New Workflows

1. Create file in `.github/workflows/`
2. Use descriptive filename (e.g., `deploy-production.yml`)
3. Add workflow badge to README
4. Document in this file

### Testing Workflow Changes

#### Local Testing

```bash
# Use act tool to run locally
act -j lint        # Run specific job
act push           # Simulate push event
act pull_request   # Simulate PR event
```

#### Branch Testing

```bash
# Push to feature branch
git push origin feature/test-workflow
# Check Actions tab for results
```

#### Dry Run

```yaml
# Add to workflow for testing
- name: Dry run
  run: |
    echo "This is a dry run"
    echo "Would deploy to: ${{ env.ENVIRONMENT }}"
```

### Security Improvements

#### Use Minimal Permissions

```yaml
permissions:
  contents: read
  packages: write
  # Don't grant unnecessary permissions
```

#### Pin Action Versions

```yaml
# Good - specific version
uses: actions/checkout@v4.1.1

# Better - with SHA
uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11
```

#### Validate Secrets

```yaml
- name: Check secrets
  run: |
    if [ -z "${{ secrets.MY_SECRET }}" ]; then
      echo "Error: MY_SECRET is not set"
      exit 1
    fi
```

### Monitoring & Alerts

#### Add Notifications

```yaml
- name: Notify on failure
  if: failure()
  uses: slack/notify@v2
  with:
    status: ${{ job.status }}
```

#### Artifact Retention

```yaml
- name: Upload artifacts
  uses: actions/upload-artifact@v4
  with:
    name: test-results
    path: target/surefire-reports/
    retention-days: 7  # Auto-delete after 7 days
```

---

## Cost

All workflows are **FREE** for public repositories:
- Unlimited GitHub Actions minutes
- Unlimited artifact storage (public)
- Unlimited container image storage (public)

---

## See Also

- [CONTRIBUTING.md](../CONTRIBUTING.md) - How to contribute
- [CI/CD Documentation](https://docs.github.com/en/actions) - GitHub Actions docs
- [CodeQL Documentation](https://docs.github.com/en/code-security/code-scanning) - Code scanning
