# Project Tour

A beginner-friendly guide to the Goods Price Comparison API project.

---

## What Is This Project?

This project creates the **API rulebook** that lets apps and supermarkets talk about grocery prices.

```mermaid
sequenceDiagram
    participant App as Mobile App
    participant API as API Rulebook
    participant Store as Supermarket
    
    App->>API: "What's the price of milk?"
    API->>Store: Standardized request
    Store->>API: "$3.50"
    API->>App: Formatted response
```

**Result:** A shared language that makes price comparison apps possible.

---

## Project Structure

```mermaid
flowchart TD
    subgraph Config["📄 Configuration"]
        pom["pom.xml - Build recipe"]
        df["Dockerfile - Container"]
        dc["docker-compose.yml - Dev setup"]
        sp[".spectral.yaml - API linter"]
    end
    
    subgraph Auto["🔧 Automation"]
        wf[".github/workflows - CI/CD"]
    end
    
    subgraph Spec["📝 API Specification"]
        openapi["openapi/"]
        openapi --> main["main.yaml"]
        openapi --> paths["paths/ - Endpoints"]
        openapi --> schemas["schemas/ - Models"]
    end
    
    subgraph Doc["📚 Documentation"]
        readme["README.md"]
        contrib["CONTRIBUTING.md"]
        changelog["CHANGELOG.md"]
        docs["docs/ - Guides"]
    end
    
    subgraph AI["🤖 AI Tools"]
        agents[".ai/ - Guidelines"]
    end
```

---

## File Overview

| File                 | Purpose                   |
|----------------------|---------------------------|
| `pom.xml`            | Maven build configuration |
| `Dockerfile`         | Container packaging       |
| `.spectral.yaml`     | API linting rules         |
| `openapi/main.yaml`  | Main API specification    |
| `openapi/paths/`     | API endpoint definitions  |
| `openapi/schemas/`   | Data model definitions    |
| `.github/workflows/` | CI/CD automation          |
| `Makefile`           | Command shortcuts         |

---

## Workflow

### How Changes Flow

```mermaid
flowchart LR
    A[Edit OpenAPI] --> B[Lint with Spectral]
    B --> C[Maven Build]
    C --> D[Generate DTOs]
    D --> E[Test]
    E --> F[Merge to Main]
    F --> G[Auto-Publish]
    
    style A fill:#ffeb3b
    style B fill:#4caf50
    style C fill:#2196f3
    style G fill:#9c27b0
```

### Where to Edit

| What             | Where                    |
|------------------|--------------------------|
| Add endpoints    | `openapi/paths/*.yaml`   |
| Add data models  | `openapi/schemas/*.yaml` |
| Change API rules | `.spectral.yaml`         |

**Never edit generated code** - It's auto-regenerated on every build.

---

## Tools Explained

| Tool               | Purpose          | Analogy                 |
|--------------------|------------------|-------------------------|
| **Maven**          | Build & package  | General contractor      |
| **Spectral**       | Check API format | Grammar checker         |
| **GitHub Actions** | Auto-check code  | Quality inspector robot |
| **Docker/Podman**  | Run anywhere     | Shipping container      |
| **Git**            | Track changes    | Time machine            |

---

## Quick Reference

| Task            | Command             |
|-----------------|---------------------|
| Build           | `make build`        |
| Test            | `make test`         |
| Lint            | `make lint`         |
| Full check      | `make ci-check`     |
| Container build | `make podman-build` |

---

## Glossary

| Term          | Meaning                                  |
|---------------|------------------------------------------|
| **API**       | Rules for programs to talk to each other |
| **Endpoint**  | URL where requests are sent              |
| **DTO**       | Data package sent between programs       |
| **OpenAPI**   | Standard format for API specs            |
| **CI/CD**     | Automatic build, test, deploy            |
| **Container** | Package that runs anywhere               |
| **Linting**   | Checking code for format errors          |

---

**Need Help?** Contact: rizkifaizalr@gmail.com

*Last Updated: April 2026*
