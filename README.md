# Goods Price Comparison API

OpenAPI specification and generated DTOs for the Goods Price Comparison Service.

**API-First Design** | **Path Versioning** | **Automated Code Generation**

[![CI/CD](https://github.com/RizkiRachman/goods-price-comparison-api/actions/workflows/ci.yml/badge.svg)](https://github.com/RizkiRachman/goods-price-comparison-api/actions/workflows/ci.yml)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0.3-green)](https://spec.openapis.org/oas/v3.0.3)
[![Java](https://img.shields.io/badge/Java-17-blue)](https://adoptium.net/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Table of Contents

- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [API Versioning](#api-versioning)
- [Development Workflow](#development-workflow)
- [Quality Standards](#quality-standards)
- [Local Development with Podman Desktop](#local-development-with-podman-desktop)
- [Using as Dependency](#using-as-dependency)
- [Contributing](#contributing)
- [Makefile Commands](#makefile-commands)

---

## Quick Start

### Prerequisites

Choose your setup:

**Option A: CLI Tools (Recommended for CI/CD)**
- **Java** 17+ ([Download](https://adoptium.net/))
- **Maven** 3.9+ (`brew install maven`)
- **Spectral** CLI (`brew install spectral-cli`)

**Option B: Container (Podman/Desktop)**
- **Podman Desktop** ([Download](https://podman-desktop.io/downloads)) - GUI with dashboard
  - Includes Podman CLI automatically
  - Visual container/image management
  - One-click build and run
- Or **Podman CLI** only: `brew install podman`

### One-Command Setup

```bash
# Clone, lint, build, and install
git clone <repository-url> && cd goods-price-comparison-api
spectral lint src/main/resources/openapi/main.yaml
mvn clean install
```

Done! The API JAR is now in your local Maven repository.

---

## Project Structure

```
openapi/                          # API Specification (Split by Resource)
├── main.yaml                     # Entry point
├── paths/                        # Endpoints by domain
│   ├── receipts.yaml             # OCR upload & processing
│   ├── prices.yaml               # Price search (v1/v2)
│   ├── shopping.yaml             # Route optimization
│   ├── products.yaml             # Price trends
│   ├── alerts.yaml               # Price alerts
│   └── system.yaml               # API version info
└── schemas/                      # Data models
    ├── common.yaml               # Errors, dates
    ├── requests.yaml             # Request DTOs
    ├── responses.yaml            # Response DTOs
    ├── models.yaml               # Domain models
    └── v2/prices.yaml            # V2 enhancements
```

**Why split by resource?** Maintainability. No more 1200+ line files.

---

## API Versioning

**Path-based versioning** - Multiple versions coexist:

```
/v1/prices/search    # Stable - Basic search
/v2/prices/search    # Beta - Pagination, predictions, history
```

| Version | Status | Key Features |
|---------|--------|--------------|
| **v1** | Stable | Basic price search, receipt OCR, shopping optimization |
| **v2** | Beta | Enhanced price search with pagination, predictions, filters |

**Breaking changes?** Only in new major versions. Deprecated versions supported for 30 days.

---

## Development Workflow

### Modifying the API

```bash
# 1. Edit OpenAPI files (paths/*.yaml or schemas/*.yaml)

# 2. Lint (MUST PASS - blocks build if errors)
spectral lint src/main/resources/openapi/main.yaml --ruleset .spectral.yaml

# 3. Generate code
mvn clean compile

# 4. Verify
mvn test

# 5. Install locally
mvn clean install
```

### Available Commands

```bash
mvn clean compile    # Generate DTOs from OpenAPI
mvn test             # Run all tests
mvn verify           # Full quality check (tests + coverage + linting)
mvn clean install    # Build and install to local repo
```

### Spectral Linting (Required)

Enforces API standards. Rules include:
- ✅ All operations must have `operationId` (camelCase)
- ✅ All operations must have descriptions
- ✅ All operations must have tags
- ✅ Path parameters must have descriptions
- ✅ No empty descriptions

Run before every commit:
```bash
spectral lint src/main/resources/openapi/main.yaml
```

---

## Quality Standards

Every PR must pass:

| Check | Command | Requirement |
|-------|---------|-------------|
| **OpenAPI Linting** | `spectral lint ...` | 0 errors |
| **Build** | `mvn clean compile -q` | 0 errors/warnings |
| **Tests** | `mvn test` | 100% pass |
| **Coverage** | `mvn jacoco:report` | ≥90% (100% new code) |
| **Checkstyle** | `mvn checkstyle:check` | 0 violations |
| **SpotBugs** | `mvn spotbugs:check` | 0 high priority |

---

## Local Development with Podman Desktop

Prefer a GUI? Use **Podman Desktop** for visual container management.

### Setup

1. **Install Podman Desktop**
   ```bash
   brew install podman-desktop
   # Or download from: https://podman-desktop.io/downloads
   ```

2. **Initialize Podman machine** (macOS/Windows only)
   ```bash
   podman machine init
   podman machine start
   ```

### Building with Podman Desktop

**Option 1: GUI (Point & Click)**
1. Open Podman Desktop
2. Go to "Images" → "Build"
3. Select `Dockerfile` in your project root
4. Click "Build" - watch the dashboard show progress
5. Find your image under "Images" tab

**Option 2: CLI (Terminal)**
```bash
# Build container image
podman build -t goods-price-comparison-api:latest .

# Run linting in container
podman run --rm goods-price-comparison-api:latest spectral lint src/main/resources/openapi/main.yaml

# Build and extract JAR
podman run --rm -v $(pwd)/output:/output goods-price-comparison-api:latest cp /output/*.jar /output/
```

### Podman Desktop Benefits

- **Visual Dashboard** - See all containers, images, and pods
- **Logs Viewer** - Click to view build logs in real-time
- **Port Forwarding** - GUI for exposing ports
- **Image Layers** - Inspect layer sizes and contents
- **Kubernetes** - Deploy to local k8s with one click

---

## Using as Dependency

Add to your `pom.xml`:

```xml
<dependency>
    <groupId>com.example</groupId>
    <artifactId>goods-price-comparison-api</artifactId>
    <version>1.0.0-SNAPSHOT</version>
</dependency>
```

Then use generated DTOs:

```java
import com.example.goodsprice.api.model.PriceSearchRequest;
import com.example.goodsprice.api.model.PriceSearchResponse;

// Use in your controllers/service
PriceSearchRequest request = new PriceSearchRequest();
request.setProductName("Ultra Milk");
```

---

## Contributing

### Pre-PR Checklist

- [ ] Spectral linting passes (`spectral lint src/main/resources/openapi/main.yaml`)
- [ ] `mvn clean compile -q` passes
- [ ] `mvn test` passes (100%)
- [ ] Coverage ≥90% (100% for new code)
- [ ] Checkstyle passes
- [ ] SpotBugs passes (0 high priority)

### Where to Edit

| What | Where |
|------|-------|
| Add/modify endpoints | `src/main/resources/openapi/paths/*.yaml` |
| Add/modify DTOs | `src/main/resources/openapi/schemas/*.yaml` |
| API conventions | `.spectral.yaml` |

**Don't edit generated code!** It's regenerated on every build.

---

## Documentation

- **OpenAPI Spec**: View in `src/main/resources/openapi/main.yaml`
- **AI Guidelines**: See [.ai/AGENTS.md](.ai/AGENTS.md)
- **Full API Docs**: See [goods-price-comparison-service/docs/API.md](../goods-price-comparison-service/docs/API.md)

---

## Architecture

```
┌─────────────────────────────────────────────┐
│  GOODS-PRICE-COMPARISON-API (This Project)  │
│                                             │
│  OpenAPI Spec ──► OpenAPI Generator ──►     │
│  (Split Files)     (Maven Plugin)      DTOs │
└─────────────────────┬───────────────────────┘
                      │ Maven Dependency
                      ▼
┌─────────────────────────────────────────────┐
│  GOODS-PRICE-COMPARISON-SERVICE             │
│                                             │
│  Uses DTOs for type-safe API contracts      │
└─────────────────────────────────────────────┘
```

---

## Makefile Commands

Use the `Makefile` for convenient command shortcuts:

```bash
make help          # Show all available commands
make lint          # Run Spectral linting
make build         # Build project (includes linting)
make test          # Run all tests
make install       # Install to local Maven repo
make clean         # Clean build artifacts
make ci-check      # Run all CI checks locally
```

### Podman Commands

```bash
make podman-build    # Build container image
make podman-lint     # Run linting in container
make podman-test     # Run tests in container
make podman-extract  # Extract JAR from container
make podman-clean    # Remove Podman images
```

### Docker Compose

```bash
# Build and run with docker-compose
docker-compose up api-builder    # Build and extract JAR
docker-compose up spectral-lint  # Run linting
docker-compose up api-test       # Run tests

# Or with Podman
docker-compose up api-builder    # Podman supports docker-compose too!
```

---

## Contributors

| Name | Email | Role |
|------|-------|------|
| **Rizki Rachman** | rizkifaizalr@gmail.com | Project Owner & Lead Developer |

Want to contribute? See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

**Tech Stack:** OpenAPI 3.0 | Java 17 | Maven | Spring Boot | Spectral

**Version:** 1.0.0-SNAPSHOT (API v1)

**License:** MIT

*Built with API-First Design Principles*
