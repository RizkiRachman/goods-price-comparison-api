# Contributing to Goods Price Comparison API

Thank you for considering contributing to this project! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Submitting Changes](#submitting-changes)
- [Code Style](#code-style)
- [Commit Messages](#commit-messages)
- [Questions?](#questions)

---

## Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Java 17+**
- **Maven 3.9+**
- **Spectral CLI** (`brew install spectral-cli`)
- **Podman Desktop** (optional but recommended)

### Fork and Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/goods-price-comparison-api.git
cd goods-price-comparison-api

# Add upstream remote
git remote add upstream https://github.com/RizkiRachman/goods-price-comparison-api.git
```

---

## Development Setup

### Option 1: Local Development

```bash
# Verify installations
java -version
mvn -version
spectral --version

# Build and test
make build    # Or: mvn clean compile
make test     # Or: mvn test
```

### Option 2: Container Development (Podman)

```bash
# Using Makefile
make podman-build
make podman-test

# Or using docker-compose
docker-compose up api-builder
```

---

## Making Changes

### API Changes

When modifying the OpenAPI specification:

1. **Edit the appropriate file:**
   - `src/main/resources/openapi/paths/*.yaml` - for endpoints
   - `src/main/resources/openapi/schemas/*.yaml` - for data models

2. **Run linting (REQUIRED):**
   ```bash
   make lint
   # Or: spectral lint src/main/resources/openapi/main.yaml --ruleset .spectral.yaml
   ```

3. **Build and verify:**
   ```bash
   make build
   make test
   ```

4. **Check code quality:**
   ```bash
   make ci-check
   ```

### Adding New Endpoints

Example workflow:

```bash
# 1. Create new path file
touch src/main/resources/openapi/paths/new-feature.yaml

# 2. Define your endpoints in the new file

# 3. Reference it in main.yaml
# Edit src/main/resources/openapi/main.yaml

# 4. Run linting
make lint

# 5. Build and test
make build && make test

# 6. Verify with CI checks
make ci-check
```

### What NOT to Edit

❌ **Never edit generated code!**
- Files in `target/generated-sources/`
- Files in `src/main/java/` (generated DTOs)

These are regenerated on every build from the OpenAPI specification.

---

## Submitting Changes

### Before Creating a PR

Run the complete checklist:

```bash
make ci-check
```

Or manually:

- [ ] `make lint` passes (0 Spectral errors)
- [ ] `make build` passes (Maven compile)
- [ ] `make test` passes (100% tests)
- [ ] Coverage ≥90% (100% for new code)
- [ ] Checkstyle passes
- [ ] SpotBugs passes (0 high priority)

### Creating a Pull Request

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and commit

3. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create PR on GitHub:**
   - Use descriptive title
   - Reference any related issues
   - Describe what changed and why

### PR Title Format

```
type: Brief description

Examples:
- feat: Add v3 price search endpoint
- fix: Correct pagination in price results
- docs: Update API versioning documentation
- refactor: Split receipts.yaml into smaller files
```

---

## Code Style

### OpenAPI Specification

- Use **kebab-case** for paths (e.g., `/price-search`, not `/priceSearch`)
- Use **camelCase** for operationIds (e.g., `searchPrices`, not `search-prices`)
- All operations must have:
  - Description
  - Tags
  - OperationId
  - Response definitions

### Example:

```yaml
/v1/prices/search:
  post:
    summary: Search product prices
    description: Search for product prices across stores
    operationId: searchPrices
    tags:
      - Prices
    # ... rest of definition
```

### Java Code

Follow Google Java Style Guide:
- 4 spaces indentation
- 100 character line limit
- Javadoc for public APIs
- Final variables by default

---

## Commit Messages

Use conventional commits format:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, semicolons, etc)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

**Examples:**

```
feat(prices): Add pagination support to v2 price search

Add page and pageSize parameters to PriceSearchRequestV2.
Update response to include pagination metadata.

fix(receipts): Correct OCR status response schema

Change status field from string to enum type.
Add missing description fields.

docs(readme): Add Podman Desktop setup instructions

Include installation steps and GUI workflow.
```

---

## Testing

### Writing Tests

Since this is an API specification project, tests focus on:

1. **Schema validation** - Ensure generated DTOs are valid
2. **Serialization** - JSON mapping works correctly
3. **Integration** - DTOs work in the service project

### Running Tests

```bash
# Local
make test

# In container
make podman-test
```

---

## Questions?

- **Technical questions:** Open an issue with `question` label
- **Bug reports:** Open an issue with `bug` label
- **Feature requests:** Open an issue with `enhancement` label

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## Project Team

### Core Contributors

| Name | Email | Role | GitHub |
|------|-------|------|--------|
| **Rizki Rachman** | rizkifaizalr@gmail.com | Project Owner & Lead Developer | [@RizkiRachman](https://github.com/RizkiRachman) |

---

**Thank you for contributing!** 🚀
