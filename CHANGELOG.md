# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Fixed

## [1.4.2] - 2026-05-04

### Added
- **Extended ProductDetail price aggregation** — added min/max price fields alongside existing average
  - `ProductDetail.price.min` — minimum price found across all stores
  - `ProductDetail.price.max` — maximum price found across all stores
  - Maintains backward compatibility with existing `avg` field
  - Consistent naming convention: `avg`, `min`, `max`

## [1.4.1] - 2026-05-04

### Security
- **Removed Vercel deployment components** — eliminated all Vercel-related files and configurations due to security considerations
  - Deleted `vercel/` directory with mock server files
  - Removed `scripts/generate-vercel-routes.js` auto-generator
  - Removed `.github/workflows/deploy-vercel.yml` deployment workflow
  - Updated build pipeline to exclude Vercel artifacts

### Added
- **`includePrice` query param** on `GET /v1/products` — include aggregated price details per product when set to `true`
- **`ProductDetail` schema** with `price.avg` (average price across all stores) and `price.updatedAt`
- **`detail` field** on `Product` model — optional aggregated product detail containing price summary

## [1.3.0] - 2026-05-03

### Added
- **Products CRUD:** Full management endpoints for product catalog
  - `GET /v1/products` — Paginated list with search, category, brand, status filters
  - `POST /v1/products` — Create product
  - `GET /v1/products/{productId}` — Get product by ID
  - `PUT /v1/products/{productId}` — Update product
  - `DELETE /v1/products/{productId}` — Soft-delete product
- **Stores CRUD:** Full management endpoints for retail stores
  - `GET /v1/stores` — Paginated list with search, location, chain, status filters
  - `POST /v1/stores` — Create store with geolocation
  - `GET /v1/stores/{storeId}` — Get store by ID
  - `PUT /v1/stores/{storeId}` — Update store
  - `DELETE /v1/stores/{storeId}` — Soft-delete store
- **Price Records CRUD:** Direct and sub-resource price management
  - `GET /v1/products/{productId}/prices` — List prices with store, date, promo, status filters
  - `POST /v1/products/{productId}/prices` — Record a price with inline promotion details
  - `GET /v1/prices/{priceId}` — Get price record by ID
  - `PUT /v1/prices/{priceId}` — Update price record
  - `DELETE /v1/prices/{priceId}` — Soft-delete price record
- **EntityStatus Schema:** Unified lifecycle status across all entities
  - States: `pending`, `pending_review`, `pending_approval`, `approved`, `rejected`, `ingestion`, `ingestion_failed`, `completed`
  - Applied to Product, Store, and PriceRecord models
  - Filterable via `status` query param on all list endpoints
- **New domain models:** `Product`, `Store`, `PriceRecord`, `Promotion`, `Pagination`, `SortDirection`
- **GitHub Actions workflow** for validating OpenAPI examples (`validate-examples.yml`)

### Changed
- **OpenAPI spec** expanded from 11 to 28 endpoints (+17 new)
  - All existing endpoints remain unchanged and backward compatible
- **Project structure:** New `paths/stores.yaml` for store management endpoints
- **API version** bumped from 1.2.6 to 1.3.0
- **README updated** with new endpoint counts and project structure

## [1.2.7] - 2026-04-22

### Added
- **Common Status Schema:** Add another `Status` enum for async operations
  - Values: `PENDING_REVIEW`, `INGESTING`, `INGESTION_FAILED`
  - Located in `common.yaml#/components/schemas/Status`
  - Used across receipt, alert, and other async workflows

## [1.2.6] - 2026-04-22

### Added
- **Common Status Schema:** New reusable `Status` enum for async operations
  - Values: `PENDING`, `APPROVED`, `REJECTED`, `FAILED`, `COMPLETED`
  - Located in `common.yaml#/components/schemas/Status`
  - Used across receipt, alert, and other async workflows

### Changed
- **Receipt API - Simplified Status Model:**
  - Consolidated 8 receipt-specific statuses into 5 common statuses
  - Previous: `PROCESSING`, `PENDING_REVIEW`, `APPROVED`, `INGESTING`, `COMPLETED`, `REJECTED`, `FAILED`, `INGESTION_FAILED`
  - Current: `PENDING`, `APPROVED`, `REJECTED`, `FAILED`, `COMPLETED`
  - All receipt responses now use common `Status` schema
- **Receipt API - Renamed `jobId` to `receiptId`:**
  - `ReceiptUploadResponse`, `ReceiptStatusResponse`, `ReceiptApproveResponse`, `ReceiptRejectResponse`, `ReceiptResultResponse`
  - More intuitive naming - identifies the receipt entity directly
- **Receipt API - Removed message fields:**
  - Simplified response structure (status-only responses)
  - Clients can handle messaging based on status code
- **Updated API version:** Bumped from 1.2.5 to 1.2.6 in OpenAPI spec

### Fixed
- **Receipt endpoints documentation:**
  - `GET /v1/receipts/{id}/results` - Changed status requirement from `PENDING_REVIEW` to `PENDING`
  - `POST /v1/receipts/{id}/approve` - Updated 409 error description to "Receipt not in PENDING status"
  - `POST /v1/receipts/{id}/reject` - Updated 409 error description to "Receipt not in PENDING status"

## [1.2.4] - 2026-04-20

### Added
- **Receipt Verification & Approval Flow:** Extended `/receipts` API with user review lifecycle
  - `POST /v1/receipts/{id}/approve` - Approve OCR result and trigger data ingestion
    - Accepts optional corrections (storeName, storeLocation, date, totalAmount, items)
    - Returns `202 INGESTING` when ingestion starts
  - `POST /v1/receipts/{id}/reject` - Reject extraction result with optional reason
  - New status states: `PENDING_REVIEW`, `APPROVED`, `INGESTING`, `REJECTED`, `INGESTION_FAILED`
  - New request schemas: `ReceiptApproveRequest`, `ReceiptRejectRequest`
  - New response schemas: `ReceiptApproveResponse`, `ReceiptRejectResponse`

### Changed
- **Receipt status enum expanded** from 3 to 8 states to cover full review lifecycle
  - Previous: `PROCESSING`, `COMPLETED`, `FAILED`
  - Current: `PROCESSING`, `PENDING_REVIEW`, `APPROVED`, `INGESTING`, `COMPLETED`, `REJECTED`, `FAILED`, `INGESTION_FAILED`
- **`GET /v1/receipts/{id}/results`** now available from `PENDING_REVIEW` status onwards (was `COMPLETED` only)
- **Mock server** updated with handlers for approve/reject endpoints and `PENDING_REVIEW` status response

## [1.2.3] - 2026-04-01

### Added
- **Vercel Mock Server Auto-Generator:** Automatic Express route generation from OpenAPI spec
  - `scripts/generate-vercel-routes.js` parses OpenAPI spec during Maven build
  - Generates `vercel/index.js` with mock responses for all 11 endpoints
  - Zero manual work when adding new API endpoints
  - Mock responses generated from schema examples

### Changed
- **Improved Mock Responses:** All schemas now include top-level examples
  - Better mock data generation for Vercel deployment
  - Consistent example values across all DTOs
  - Support for 202 response codes

### Fixed
- **CI Workflows:** Multiple fixes for proper npm dependency installation
  - Added `npm install` to `ci-build.yml`, `ci-publish.yml`, `codeql.yml`, `test-code-generation.yml`
  - Added write permissions to `generate-mock-server.yml` for commit comments

## [1.2.2] - 2026-03-31

### Added
- **Health and Metrics Endpoints:** New system monitoring endpoints
  - `GET /v1/health` - Health check for load balancers and monitoring
    - Returns: status (UP/DOWN), component health, timestamp, version
    - HTTP 200 for healthy, 503 for unhealthy
  - `GET /v1/metrics` - Operational metrics for observability
    - Returns: uptime, request counts, response times (p50/p95/p99), error rates
    - Supports JSON and Prometheus text format
- **Breaking Change Detection:** Automated detection in CI pipeline
  - Uses Optic to compare OpenAPI specs in PRs
  - Fails build if breaking changes detected
  - Posts warning comment on PR with breaking changes
- **API Documentation Deployment:** Auto-deploy to GitHub Pages
  - New workflow: `.github/workflows/docs.yml`
  - Generates HTML docs using Redoc
  - Deploys to GitHub Pages on every OpenAPI change
  - URL: `https://rizkirachman.github.io/goods-price-comparison-api/`

### Changed
- Updated OpenAPI version from 1.0.0 to 1.2.2 in spec
- Updated README with new features and correct version

### Fixed
- **Documentation Workflow:** Fixed trigger paths and dynamic version
  - Updated trigger to monitor main.yaml and all OpenAPI path/schema files
  - Made version dynamic by extracting from OpenAPI spec (was hardcoded 1.0.0)

## [1.2.1] - 2026-03-31

### Added
- **Postman Collection Generation:** Automatic generation during Maven build
  - Generates `postman-collection.json` in `target/` directory
  - Runs automatically with `mvn clean compile`
  - Based on bundled OpenAPI spec (with all $refs resolved)
  - Can be imported directly into Postman for API testing
  - Located at: `target/postman-collection.json`
  - **Auto-injected post-response scripts:**
    - `scripts/inject-postman-tests.js` adds test scripts automatically
    - Receipt upload (POST): Auto-extracts `receipt_id` from response to environment variable
    - Receipt status (GET): Uses `receipt_id` environment variable
    - Receipt results (GET): Uses `receipt_id` environment variable
    - No manual ID copying needed - seamless API workflow

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

- **1.4.0** - Product detail price aggregation and includePrice param
- **1.3.0** - Products, stores & price records CRUD, unified EntityStatus
- **1.2.6** - Simplified status model and common Status schema
- **1.2.4** - Receipt verification & approval flow
- **1.2.3** - Vercel mock server auto-generator
- **1.2.2** - Health and metrics endpoints
- **1.2.1** - Postman collection generation
- **1.2.0** - Version bump
- **1.1.0** - Controller interfaces generation
- **1.0.0-SNAPSHOT** - Initial project setup

## Notes

This is an API-first/Contract-first project where the OpenAPI specification serves as the single source of truth for API contracts. The generated DTOs are used as a Maven dependency by the `goods-price-comparison-service` project.
