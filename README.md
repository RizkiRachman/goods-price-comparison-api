<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/RizkiRachman/goods-price-comparison-api">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Goods Price Comparison API</h3>

  <p align="center">
    OpenAPI specification and generated DTOs for the Goods Price Comparison Service.
    <br />
    <a href="https://github.com/RizkiRachman/goods-price-comparison-api"><strong>Explore the docs</strong></a>
    <br />
    <br />
    <a href="https://github.com/RizkiRachman/goods-price-comparison-api/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/RizkiRachman/goods-price-comparison-api/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#api-specification">API Specification</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

This is an **API-first/contract-first** project. The single source of truth is `src/main/resources/openapi/main.yaml`. Java DTOs and Spring controller interfaces are auto-generated from the OpenAPI specification using the OpenAPI Generator Maven plugin.

The generated JAR is consumed as a Maven dependency by `goods-price-comparison-service` (separate repo). This repo does not contain service implementation code -- only the contract and generated artifacts.

**Key Features:**
* **Path-based versioning** - Multiple API versions coexist (`/v1/`, `/v2/`)
* **Automated code generation** - OpenAPI spec generates Java DTOs and Spring controller interfaces
* **Strict quality gates** - Spectral linting, Checkstyle, SpotBugs, and JaCoCo coverage
* **CI/CD ready** - GitHub Actions workflows for build, test, publish, and release
* **Container support** - Docker/Podman for consistent builds

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

This section lists the major frameworks and tools used to build this project.

* [![Java][Java-shield]][Java-url]
* [![Spring Boot][SpringBoot-shield]][SpringBoot-url]
* [![OpenAPI][OpenAPI-shield]][OpenAPI-url]
* [![Maven][Maven-shield]][Maven-url]
* [![Spectral][Spectral-shield]][Spectral-url]
* [![Podman][Podman-shield]][Podman-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This section provides instructions on setting up the project locally.

### Prerequisites

Choose your setup:

**Option A: CLI Tools (Recommended for CI/CD)**
* **Java** 17+ - [Download](https://adoptium.net/)
* **Maven** 3.9+ - `brew install maven`
* **Spectral** CLI - `brew install spectral-cli`

**Option B: Container (Podman/Desktop)**
* **Podman Desktop** - [Download](https://podman-desktop.io/downloads)
  * Includes Podman CLI automatically
  * Visual container/image management
* Or **Podman CLI** only - `brew install podman`

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/RizkiRachman/goods-price-comparison-api.git
   ```
2. Navigate to the project directory
   ```sh
   cd goods-price-comparison-api
   ```
3. Verify the environment
   ```sh
   make dev-setup
   ```
4. Build and install
   ```sh
   make build
   make install
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

This project is a contract-first API specification. The generated JAR provides Java DTOs and controller interfaces for the service implementation.

### Using as Maven Dependency

Add GitHub Packages repository to your `pom.xml`:

```xml
<repositories>
    <repository>
        <id>github</id>
        <name>GitHub Packages</name>
        <url>https://maven.pkg.github.com/RizkiRachman/goods-price-comparison-api</url>
    </repository>
</repositories>

<dependencies>
    <dependency>
        <groupId>com.example</groupId>
        <artifactId>goods-price-comparison-api</artifactId>
        <version>1.7.0</version>
    </dependency>
</dependencies>
```

**Authentication required** - Add to `~/.m2/settings.xml`:
```xml
<servers>
    <server>
        <id>github</id>
        <username>YOUR_GITHUB_USERNAME</username>
        <password>YOUR_GITHUB_TOKEN</password>
    </server>
</servers>
```

### Using Container Image

```sh
# Pull from GitHub Container Registry
docker pull ghcr.io/rizkirachman/goods-price-comparison-api:latest

# Or with Podman
podman pull ghcr.io/rizkirachman/goods-price-comparison-api:latest
```

### Using Generated DTOs

```java
import com.example.goodsprice.api.model.PriceSearchRequest;
import com.example.goodsprice.api.model.PriceSearchResponse;

// Use in your controllers/service
PriceSearchRequest request = new PriceSearchRequest();
request.setProductName("Ultra Milk");
```

### Available Make Commands

```sh
make help          # Show all available commands
make lint          # Run Spectral linting
make build         # Build project (includes linting)
make test          # Run all tests
make install       # Install to local Maven repo
make clean         # Clean build artifacts
make ci-check      # Run all CI checks locally
make coverage      # Generate JaCoCo coverage report
make info          # Show project information
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- API SPECIFICATION -->
## API Specification

### Versioning

**Path-based versioning** - Multiple versions coexist:

```
/v1/prices/search    # Stable - Basic search
/v2/prices/search    # Beta - Pagination, predictions, history
```

| Version | Status | Key Features |
|---------|--------|--------------|
| **v1** | Stable | Product, store & price CRUD, price search, receipt OCR, shopping optimization, price alerts |
| **v2** | Beta | Enhanced price search with pagination, predictions, filters |

**Breaking changes?** Only in new major versions. Deprecated versions supported for 30 days.

### Quality Standards

Every PR must pass:

| Stage | Command | Requirement |
|-------|---------|-------------|
| **Lint** | `make lint` | 0 errors |
| **Build** | `make build` | 0 errors |
| **Test** | `make test` | 100% pass |
| **Coverage** | `make coverage` | >=90% |
| **Checkstyle** | `mvn checkstyle:check` | 0 violations |
| **SpotBugs** | `mvn spotbugs:check` | 0 high priority |

### Where to Edit

| What | Where |
|------|-------|
| Add/modify endpoints | `src/main/resources/openapi/paths/*.yaml` |
| Add/modify DTOs | `src/main/resources/openapi/schemas/*.yaml` |
| API conventions | `.spectral.yaml` |

**Don't edit generated code!** It is regenerated on every build.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [x] OpenAPI specification with 28 endpoints
- [x] Products CRUD - full catalog management
- [x] Stores CRUD - retail store management with geolocation
- [x] Price Records CRUD - nested under products with direct access
- [x] Unified `EntityStatus` lifecycle across all entities
- [x] Pagination support on all list endpoints
- [x] Split-by-resource structure for maintainability
- [x] CI/CD pipeline with GitHub Actions
- [x] Container support (Docker/Podman)
- [x] Automatic Postman collection generation
- [x] Health and metrics endpoints
- [ ] Enhanced v2 endpoints with advanced filtering
- [ ] Async receipt OCR processing
- [ ] Multi-language support for store/product names

See the [open issues](https://github.com/RizkiRachman/goods-price-comparison-api/issues) for a full list of proposed features and known issues.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

### Pre-PR Checklist

- [ ] Spectral linting passes (`make lint`)
- [ ] `make build` passes
- [ ] `make test` passes (100%)
- [ ] Coverage >=90% (100% for new code)
- [ ] Checkstyle passes
- [ ] SpotBugs passes (0 high priority)

### Branch Naming

Always create a feature branch from `main`:
```sh
git checkout -b feat/add-new-endpoint
```

Commit format: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat(scope): add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Rizki Rachman - rizkifaizalr@gmail.com

Project Link: [https://github.com/RizkiRachman/goods-price-comparison-api](https://github.com/RizkiRachman/goods-price-comparison-api)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

Use this space to list resources you find helpful and would like to give credit to.

* [OpenAPI Specification](https://spec.openapis.org/oas/v3.0.3)
* [OpenAPI Generator](https://openapi-generator.tech/)
* [Spring Boot](https://spring.io/projects/spring-boot)
* [Spectral](https://docs.stoplight.io/spectral)
* [Stoplight](https://stoplight.io/)
* [Choose an Open Source License](https://choosealicense.com)
* [Img Shields](https://shields.io)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/RizkiRachman/goods-price-comparison-api.svg?style=for-the-badge
[contributors-url]: https://github.com/RizkiRachman/goods-price-comparison-api/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/RizkiRachman/goods-price-comparison-api.svg?style=for-the-badge
[forks-url]: https://github.com/RizkiRachman/goods-price-comparison-api/network/members
[stars-shield]: https://img.shields.io/github/stars/RizkiRachman/goods-price-comparison-api.svg?style=for-the-badge
[stars-url]: https://github.com/RizkiRachman/goods-price-comparison-api/stargazers
[issues-shield]: https://img.shields.io/github/issues/RizkiRachman/goods-price-comparison-api.svg?style=for-the-badge
[issues-url]: https://github.com/RizkiRachman/goods-price-comparison-api/issues
[license-shield]: https://img.shields.io/github/license/RizkiRachman/goods-price-comparison-api.svg?style=for-the-badge
[license-url]: https://github.com/RizkiRachman/goods-price-comparison-api/blob/main/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/rizkirachman

[Java-shield]: https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white
[Java-url]: https://adoptium.net/
[SpringBoot-shield]: https://img.shields.io/badge/Spring_Boot-3.2-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white
[SpringBoot-url]: https://spring.io/projects/spring-boot
[OpenAPI-shield]: https://img.shields.io/badge/OpenAPI-3.0.3-85EA2D?style=for-the-badge&logo=swagger&logoColor=black
[OpenAPI-url]: https://spec.openapis.org/oas/v3.0.3
[Maven-shield]: https://img.shields.io/badge/Maven-3.9+-C71A36?style=for-the-badge&logo=apache-maven&logoColor=white
[Maven-url]: https://maven.apache.org/
[Spectral-shield]: https://img.shields.io/badge/Spectral-Linting-6B4C9A?style=for-the-badge&logo=stoplight&logoColor=white
[Spectral-url]: https://docs.stoplight.io/spectral
[Podman-shield]: https://img.shields.io/badge/Podman-Desktop-892CA0?style=for-the-badge&logo=podman&logoColor=white
[Podman-url]: https://podman-desktop.io/
