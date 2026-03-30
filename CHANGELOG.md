# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Fixed
- **Release workflow:** Fixed version extraction to use Maven instead of grep
  - Was reading Spring Boot parent version (3.2.0) instead of project version
  - Now uses `mvn help:evaluate` to get correct project version
  - Ensures automatic releases use correct version tag

## [1.2.0] - 2026-03-30

### Changed
- **Version bump:** Updated version from 1.1.0 to 1.2.0
  - Enables automatic release workflow to create v1.2.0 tag
  - Previous v1.1.0 tag already existed, blocking automatic releases
  - No functional changes - version bump only

## [1.1.0] - 2026-03-30

### Added
- **Controller Interfaces:** Generate API controller interfaces from OpenAPI spec
  - Interfaces in `com.example.goodsprice.api.controller` package
  - Implement in service project for type-safe contracts
  - Spring annotations included (@RestController, @GetMapping, etc.)
- **AI Agent Rules:** Updated PR workflow documentation with strict quality gates
  - Pre-PR verification checklist (all checks must pass)
  - Wait for CI completion before merging
  - Post-approval documentation updates (CHANGELOG, README)
  - Clear merge permission requirements
- **Automatic OpenAPI bundling:** Maven build now creates consolidated spec
  - Generates `openapi-bundled.yaml` during every build
  - Single file with all references resolved for Swagger Online compatibility
  - No manual bundling required - fully automated

### CI/CD Improvements
- **Split workflows:** Separated CI into `ci-build.yml`, `ci-publish.yml`, `ci-release.yml`
- **Automated releases:** GitHub releases created automatically on merge to main
- **Container optimization:** Reduced image size from ~293MB to ~17MB
  - Ultra-minimal Alpine-based Dockerfile (just copies JAR)
  - Removed Java runtime (not needed for library project)
  - Parallel matrix builds for AMD64/ARM64 platforms
- **Build performance:** Optimized container build with caching (9min → ~3min)

## [1.0.0-SNAPSHOT] - 2026-03-29

### Added

#### OpenAPI Specification
- Split-by-resource structure for maintainability (`paths/` and `schemas/` directories)
- 9 API endpoints:
  - `/v1/version` - API version information
  - `/v1/receipts/upload` - Receipt OCR upload
  - `/v1/receipts/{id}/status` - OCR processing status
  - `/v1/receipts/{id}/results` - OCR results retrieval
  - `/v1/prices/search` - Basic price search (v1)
  - `/v2/prices/search` - Enhanced price search with pagination, predictions, history (v2)
  - `/v1/shopping/optimize` - Shopping route optimization
  - `/v1/products/trend/{productId}` - Price trend analysis
  - `/v1/alerts/subscribe` - Price drop alerts
- Path-level versioning (`/v1/`, `/v2/`)
- 35+ generated DTOs with Jakarta Bean Validation
- Comprehensive request/response schemas
- Error handling with standardized error responses

#### Quality Assurance
- Spectral linting for OpenAPI standards enforcement
- Maven build with OpenAPI Generator plugin
- Checkstyle integration (Google Java Style)
- SpotBugs static analysis with exclusions for generated code
- 90%+ test coverage requirement (100% for new code)

#### CI/CD Pipeline
- GitHub Actions workflow with 5 stages:
  1. OpenAPI linting
  2. Build & test
  3. Code quality checks
  4. Publish to GitHub Packages
  5. Build OCI container image
- Dockerfile with multi-stage optimized build
- docker-compose.yml for local development
- Makefile with 15+ convenient commands
- GitHub CodeQL for security analysis (replaces Qodana)

#### Documentation
- Comprehensive README with badges and table of contents
- CONTRIBUTING.md with detailed guidelines
- AI agent guidelines (`.ai/` directory)
- This CHANGELOG.md
- Architecture diagrams and workflow documentation

#### Container Support
- Podman Desktop compatibility
- Docker/Podman CLI support
- Multi-stage Dockerfile for optimized builds
- docker-compose services for development

### Technical Details

**Tech Stack:**
- OpenAPI 3.0.3
- Java 17+
- Maven 3.9+
- Spring Boot 3.2.0
- Spectral CLI 6.11.0

**Generated Artifacts:**
- Java DTOs in `com.example.goodsprice.api.model` package
- API interfaces in `com.example.goodsprice.api` package
- Invoker classes in `com.example.goodsprice.invoker` package

### Contributors
- **Rizki Rachman** - Project Owner & Lead Developer ([@RizkiRachman](https://github.com/RizkiRachman))

---

## Version History

- **1.0.0-SNAPSHOT** - Initial project setup (Current)

## Notes

This is an API-first/Contract-first project where the OpenAPI specification serves as the single source of truth for API contracts. The generated DTOs are used as a Maven dependency by the `goods-price-comparison-service` project.
