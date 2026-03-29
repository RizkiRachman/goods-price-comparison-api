# Decision Log

Record of architectural and technical decisions.

## How to Use This Document

This log tracks **why** certain decisions were made. For future reference and onboarding.

**Format:**
- Date: When decision was made
- Context: What was the situation
- Decision: What was decided
- Rationale: Why this decision
- Status: Active, Deprecated, or Superseded

---

## 2026-03-29: Multi-Platform Container Support

**Context:**
Container images only supported AMD64 (x86_64) architecture. Users on Apple Silicon Macs (M1/M2/M3 with ARM64) could not pull and run the images.

**Decision:**
Update CI workflow to build multi-platform images supporting both:
- `linux/amd64` - Intel/AMD processors
- `linux/arm64` - Apple Silicon and ARM servers

**Rationale:**
- Enables development on Apple Silicon Macs
- Supports future ARM-based deployments
- Industry standard practice
- No additional cost (GitHub Actions free for public repos)

**Implementation:**
Added `platforms: linux/amd64,linux/arm64` to docker/build-push-action

**Status:** ✅ Active

---

## 2026-03-29: Removed Qodana, Added CodeQL

**Context:**
Qodana workflow was failing with Docker image availability issues (jetbrains/qodana-jvm-community:2026.1 not found).

**Decision:**
1. Remove Qodana workflow temporarily
2. Add GitHub CodeQL for security scanning

**Rationale:**
- Qodana requires specific Docker images that may not be available
- CodeQL is built-in to GitHub (no external dependencies)
- CodeQL covers security vulnerabilities well
- Free and requires no token setup
- Can re-evaluate Qodana when stable version available

**Status:** ✅ Active

---

## 2026-03-29: Removed SonarCloud

**Context:**
SonarCloud integration required SONAR_TOKEN setup which wasn't configured.

**Decision:**
Remove SonarCloud and rely on existing quality tools:
- Checkstyle for code style
- SpotBugs for bug detection
- CodeQL for security
- JaCoCo for coverage

**Rationale:**
- Avoid external dependencies
- Simpler setup (no tokens required)
- Existing tools provide sufficient coverage
- Can add back if needed in future

**Status:** ✅ Active

---

## 2026-03-29: Maven Deployment Configuration

**Context:**
Maven deployment to GitHub Packages was failing with error: "repository element was not specified in the POM"

**Decision:**
Add `distributionManagement` section to pom.xml with GitHub Packages URL.

**Implementation:**
```xml
<distributionManagement>
    <repository>
        <id>github</id>
        <name>GitHub Packages</name>
        <url>https://maven.pkg.github.com/RizkiRachman/goods-price-comparison-api</url>
    </repository>
</distributionManagement>
```

**Rationale:**
- Required for Maven deploy to work
- Enables artifact publishing on merge to main
- Uses GITHUB_TOKEN for authentication (no extra secrets)

**Status:** ✅ Active

---

## 2026-03-29: AI Guidelines Restructure

**Context:**
Original `.ai/` folder had all documentation in root level, becoming difficult to navigate.

**Decision:**
Restructure into logical categories:
- `rules/` - Standards and guidelines
- `skills/` - Technical capabilities
- `context/` - Project-specific info

**Rationale:**
- Better organization
- Easier to find information
- Scalable structure
- Clear separation of concerns

**Status:** ✅ Active

---

## 2026-03-29: OpenAPI Split-by-Resource

**Context:**
Single large openapi.yaml file (1200+ lines) was difficult to maintain and navigate.

**Decision:**
Split OpenAPI specification into multiple files:
- `main.yaml` - Entry point with refs
- `paths/*.yaml` - Endpoint definitions by resource
- `schemas/*.yaml` - Data models

**Rationale:**
- Better maintainability
- Parallel development possible
- Clear organization
- Industry best practice
- Easier code reviews

**Status:** ✅ Active

---

## 2026-03-28: GitHub Actions CI/CD

**Context:**
Need automated testing, building, and publishing.

**Decision:**
Implement GitHub Actions workflow with:
1. OpenAPI linting (Spectral)
2. Maven build and test
3. Code quality (Checkstyle, SpotBugs)
4. Security scan (CodeQL)
5. Artifact publishing (GitHub Packages)
6. Container building (GHCR)

**Rationale:**
- Free for public repositories
- Integrated with GitHub
- No external CI/CD service needed
- Automatic triggers on PR/push
- Comprehensive quality gates

**Status:** ✅ Active

---

## 2026-03-28: API-First Design

**Context:**
Starting new price comparison project.

**Decision:**
Use API-first/Contract-first approach:
1. Design OpenAPI specification first
2. Review and validate API design
3. Generate code from specification
4. Implement service using generated DTOs

**Rationale:**
- Clear contracts between teams
- Parallel development possible
- Type safety through generated code
- Living documentation
- Client SDK generation possible
- Industry best practice for APIs

**Alternatives Considered:**
- Code-first: Generate OpenAPI from code (rejected - less control over API design)

**Status:** ✅ Active

---

## 2026-03-28: Path-Level API Versioning

**Context:**
Need to version API for future breaking changes.

**Decision:**
Use path-level versioning: `/v1/resource`, `/v2/resource`

**Rationale:**
- Clear and explicit
- Easy to understand
- Multiple versions can coexist
- Industry standard (GitHub, Stripe, etc.)
- No header complexity

**Alternatives Considered:**
- Header versioning: `X-API-Version: v1` (rejected - less visible)
- Query param versioning: `?version=v1` (rejected - can be forgotten)

**Status:** ✅ Active

---

## 2026-03-28: Technology Stack

**Context:**
Selecting technologies for API specification project.

**Decision:**
| Component | Choice |
|-----------|--------|
| API Spec | OpenAPI 3.0.3 |
| Language | Java 17 |
| Build | Maven |
| Framework | Spring Boot 3.2 |
| Validation | Jakarta Bean Validation |
| Linting | Spectral |

**Rationale:**
- OpenAPI 3.0: Industry standard, great tooling
- Java 17: LTS, modern features (records, pattern matching)
- Maven: Mature, great IDE support
- Spring Boot: Ecosystem, familiar to Java developers
- Jakarta Validation: Standard, works with OpenAPI generator

**Status:** ✅ Active

---

## Template

**Date:** YYYY-MM-DD

**Context:**
What was the situation or problem?

**Decision:**
What was decided?

**Rationale:**
Why was this decision made?

**Alternatives Considered:**
What other options were evaluated?

**Status:** Active / Deprecated / Superseded by [link]

---

*Last Updated: 2026-03-29*
