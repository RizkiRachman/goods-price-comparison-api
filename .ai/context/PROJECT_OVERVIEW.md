# Project Overview

High-level project information and goals.

## What is This Project?

**Goods Price Comparison API** is an **API specification project** that defines contracts for a price comparison service.

### Purpose

Instead of building the actual application, this project:
- 📋 **Defines API contracts** (OpenAPI specification)
- 📦 **Generates DTOs** (Data Transfer Objects) automatically
- ✅ **Validates API design** through linting and reviews
- 📚 **Serves as documentation** for API consumers

### Analogy

Think of this project as **blueprints for a building**:
- Architects create detailed blueprints (OpenAPI spec)
- Builders use blueprints to construct (Service project uses generated DTOs)
- Both follow the same plan (API contract)

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Goods Price Comparison API (This Repository)              │
│                                                              │
│  OpenAPI Specification (.yaml files)                        │
│       ↓                                                      │
│  OpenAPI Generator (Maven Plugin)                           │
│       ↓                                                      │
│  Generated Java DTOs/Models                                 │
└───────────────────────┬─────────────────────────────────────┘
                        │
        Maven Dependency│Published to GitHub Packages
                        │
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  Goods Price Comparison Service                             │
│  (Separate Repository)                                     │
│                                                              │
│  Uses generated DTOs for:                                  │
│  - Request/Response objects                                 │
│  - Type safety                                              │
│  - API consistency                                          │
└─────────────────────────────────────────────────────────────┘
```

## Key Features

### 1. Receipt OCR Processing
- Upload receipt images
- Extract product and price data
- Track processing status

### 2. Price Search
- Search prices across stores
- Filter by location, date
- Compare prices (v1: basic, v2: advanced)

### 3. Shopping Optimization
- Optimize shopping routes
- Find best stores for shopping list
- Calculate savings

### 4. Price Trends
- Historical price analysis
- Track price changes over time
- Identify trends

### 5. Price Alerts
- Subscribe to price drops
- Get notifications
- Set target prices

## API Versions

| Version | Status | Features |
|---------|--------|----------|
| v1 | Stable | Basic functionality |
| v2 | Beta | Enhanced search with pagination, predictions |

## Tech Stack

| Component | Technology |
|-----------|------------|
| API Specification | OpenAPI 3.0.3 |
| Code Generation | OpenAPI Generator 7.1.0 |
| Language | Java 17+ |
| Build Tool | Maven 3.9+ |
| Validation | Jakarta Bean Validation |
| Documentation | Swagger/OpenAPI |

## Project Goals

### Primary Goals
1. **API-First Design** - Define contracts before implementation
2. **Code Generation** - Automate DTO creation
3. **Consistency** - Ensure type safety across services
4. **Documentation** - Living API documentation

### Success Metrics
- ✅ 100% OpenAPI spec coverage
- ✅ All endpoints documented
- ✅ Generated code compiles
- ✅ Zero linting errors
- ✅ Multi-platform container support

## Target Users

### Primary Users
- **Service Developers** - Use generated DTOs in their code
- **API Consumers** - Reference API documentation
- **Mobile App Teams** - Understand API contracts

### Secondary Users
- **Product Managers** - Review API capabilities
- **QA Teams** - Understand API behavior
- **DevOps** - Deploy and maintain

## Integration Points

### Upstream (Depends on)
- None (this is the specification layer)

### Downstream (Used by)
- `goods-price-comparison-service` - Main service implementation
- Future: Mobile apps, web frontend
- Future: Third-party integrations

## Development Philosophy

### API-First
1. Design API contract
2. Review and validate
3. Generate code
4. Implement service

### Benefits
- Clear contracts between teams
- Parallel development possible
- Changes visible immediately
- Client SDKs can be generated

## Project Status

### Current State
- ✅ Core API specification complete
- ✅ CI/CD pipeline operational
- ✅ Multi-platform containers
- ✅ Documentation comprehensive

### Roadmap
See [CHANGELOG.md](../CHANGELOG.md) for version history.

## Contact

**Maintainer:** Rizki Rachman  
**Email:** rizkifaizalr@gmail.com  
**GitHub:** [@RizkiRachman](https://github.com/RizkiRachman)

## Resources

- **Repository:** https://github.com/RizkiRachman/goods-price-comparison-api
- **Issues:** https://github.com/RizkiRachman/goods-price-comparison-api/issues
- **Releases:** https://github.com/RizkiRachman/goods-price-comparison-api/releases
- **Packages:** https://github.com/RizkiRachman/goods-price-comparison-api/packages

## License

MIT License - See [LICENSE](../LICENSE) for details.
