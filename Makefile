.PHONY: help lint build test clean install podman-build podman-lint podman-run ci-check

# Colors for output
BLUE:=\033[36m
GREEN:=\033[32m
YELLOW:=\033[33m
RED:=\033[31m
NC:=\033[0m # No Color

help: ## Show this help message
	@echo "$(BLUE)Goods Price Comparison API - Available Commands$(NC)"
	@echo "================================================"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}'

# ==========================================
# Local Development (Maven)
# ==========================================

lint: ## Run Spectral linting on OpenAPI spec
	@echo "$(BLUE)Running Spectral linting...$(NC)"
	spectral lint src/main/resources/openapi/main.yaml --ruleset .spectral.yaml
	@echo "$(GREEN)✅ Linting passed!$(NC)"

build: lint ## Build project (includes linting)
	@echo "$(BLUE)Building project...$(NC)"
	mvn clean compile -q
	@echo "$(GREEN)✅ Build successful!$(NC)"

test: build ## Run all tests
	@echo "$(BLUE)Running tests...$(NC)"
	mvn test
	@echo "$(GREEN)✅ Tests passed!$(NC)"

verify: ## Run full verification (tests + coverage + quality)
	@echo "$(BLUE)Running full verification...$(NC)"
	mvn verify
	@echo "$(GREEN)✅ Verification passed!$(NC)"

install: build ## Install to local Maven repository
	@echo "$(BLUE)Installing to local Maven repo...$(NC)"
	mvn install -DskipTests -q
	@echo "$(GREEN)✅ Installed successfully!$(NC)"

clean: ## Clean build artifacts
	@echo "$(BLUE)Cleaning build artifacts...$(NC)"
	mvn clean
	rm -rf target/
	rm -rf node_modules/
	@echo "$(GREEN)✅ Clean complete!$(NC)"

# ==========================================
# Podman/Docker Development
# ==========================================

podman-build: ## Build container image with Podman
	@echo "$(BLUE)Building container image with Podman...$(NC)"
	podman build -t goods-price-comparison-api:latest .
	@echo "$(GREEN)✅ Container image built!$(NC)"

podman-lint: ## Run Spectral linting in container
	@echo "$(BLUE)Running linting in container...$(NC)"
	podman run --rm goods-price-comparison-api:latest spectral lint src/main/resources/openapi/main.yaml --ruleset .spectral.yaml
	@echo "$(GREEN)✅ Container linting passed!$(NC)"

podman-test: podman-build ## Run tests in container
	@echo "$(BLUE)Running tests in container...$(NC)"
	podman run --rm goods-price-comparison-api:latest mvn test
	@echo "$(GREEN)✅ Container tests passed!$(NC)"

podman-extract: podman-build ## Extract JAR from container
	@echo "$(BLUE)Extracting JAR from container...$(NC)"
	@mkdir -p output
	@podman create --name extract-container goods-price-comparison-api:latest
	@podman cp extract-container:/output/. output/
	@podman rm extract-container
	@echo "$(GREEN)✅ JAR extracted to output/ directory!$(NC)"

podman-clean: ## Remove Podman images
	@echo "$(BLUE)Cleaning Podman images...$(NC)"
	podman rmi goods-price-comparison-api:latest 2>/dev/null || true
	@echo "$(GREEN)✅ Podman cleanup complete!$(NC)"

# ==========================================
# CI/CD & Quality Checks
# ==========================================

ci-check: lint ## Run all CI checks locally
	@echo "$(BLUE)Running CI checks...$(NC)"
	@echo "$(YELLOW)1. OpenAPI Linting...$(NC)"
	@make lint
	@echo "$(YELLOW)2. Maven Build...$(NC)"
	@mvn clean compile -q
	@echo "$(YELLOW)3. Running Tests...$(NC)"
	@mvn test -q
	@echo "$(YELLOW)4. Checkstyle...$(NC)"
	@mvn checkstyle:check -q
	@echo "$(YELLOW)5. SpotBugs...$(NC)"
	@mvn spotbugs:check -q
	@echo "$(GREEN)✅ All CI checks passed!$(NC)"

format: ## Format code with Maven formatter
	@echo "$(BLUE)Formatting code...$(NC)"
	mvn spotless:apply 2>/dev/null || echo "$(YELLOW)⚠️  Spotless not configured, skipping$(NC)"

# ==========================================
# Development Helpers
# ==========================================

dev-setup: ## Setup development environment
	@echo "$(BLUE)Setting up development environment...$(NC)"
	@echo "$(YELLOW)Checking prerequisites...$(NC)"
	@java -version
	@mvn -version
	@spectral --version
	@echo "$(GREEN)✅ Development environment ready!$(NC)"

validate-openapi: ## Validate OpenAPI specification
	@echo "$(BLUE)Validating OpenAPI specification...$(NC)"
	spectral lint src/main/resources/openapi/main.yaml --ruleset .spectral.yaml --verbose

coverage: ## Generate and view coverage report
	@echo "$(BLUE)Generating coverage report...$(NC)"
	mvn clean test jacoco:report
	@echo "$(GREEN)✅ Coverage report generated!$(NC)"
	@echo "$(YELLOW)View at: target/site/jacoco/index.html$(NC)"

# ==========================================
# Release & Publishing
# ==========================================

version: ## Show current version
	@mvn help:evaluate -Dexpression=project.version -q -DforceStdout

snapshot: ci-check ## Create snapshot release
	@echo "$(BLUE)Creating snapshot release...$(NC)"
	mvn clean install
	@echo "$(GREEN)✅ Snapshot released!$(NC)"

# ==========================================
# Information
# ==========================================

info: ## Show project information
	@echo "$(BLUE)Project Information$(NC)"
	@echo "==================="
	@echo "Name:    Goods Price Comparison API"
	@echo "Version: $$(make version)"
	@echo "Java:    $$(java -version 2>&1 | head -1)"
	@echo "Maven:   $$(mvn -version | head -1)"
	@echo ""
	@echo "$(YELLOW)Available Endpoints:$(NC)"
	@grep -E "^\s+/v[0-9]+" src/main/resources/openapi/main.yaml | head -10 || echo "See openapi/paths/*.yaml"
