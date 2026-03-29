# syntax=docker/dockerfile:1

# Multi-stage build for minimal image size
# Optimized for Podman compatibility

# ==========================================
# Stage 1: Build Environment
# ==========================================
FROM eclipse-temurin:17-jdk-alpine AS builder

# Install required tools including Maven
RUN apk add --no-cache \
    curl \
    bash \
    nodejs \
    npm \
    maven \
    git \
    && rm -rf /var/cache/apk/*

# Install Spectral CLI globally
RUN npm install -g @stoplight/spectral-cli@6.11.0 \
    && npm cache clean --force

# Set working directory
WORKDIR /build

# Copy Maven wrapper and pom.xml first (for layer caching)
COPY pom.xml .
COPY .spectral.yaml .

# Copy OpenAPI specification
COPY src/main/resources/openapi/ src/main/resources/openapi/

# Run Spectral linting (fail build if errors)
RUN spectral lint src/main/resources/openapi/main.yaml --ruleset .spectral.yaml

# Remove Spectral and Node.js (not needed for Maven build)
RUN npm uninstall -g @stoplight/spectral-cli \
    && npm cache clean --force \
    && apk del nodejs npm

# Copy source code
COPY src/ src/

# Build the project
# - Skip tests during build (run separately if needed)
# - Clean local repository to reduce size
RUN mvn clean package -DskipTests -q \
    && rm -rf ~/.m2/repository/com/example \
    && rm -rf target/generated-sources \
    && rm -rf target/test-classes \
    && rm -rf target/surefire-reports \
    && rm -rf target/site \
    && rm -rf target/*.jar.original

# ==========================================
# Stage 2: Runtime / Artifact Export
# ==========================================
FROM alpine:3.19 AS exporter

WORKDIR /output

# Copy only the built artifact
COPY --from=builder /build/target/*.jar ./

# Create a minimal info file
RUN ls -lh *.jar > artifacts.txt

# ==========================================
# Stage 3: CI/CD Validation (Optional)
# ==========================================
FROM eclipse-temurin:17-jre-alpine AS validator

WORKDIR /app

# Copy built artifact
COPY --from=builder /build/target/*.jar ./

# Verify JAR is valid
RUN jar tf *.jar > /dev/null \
    && echo "✅ JAR validation passed"

# Default: show artifact info
CMD ["sh", "-c", "ls -lh *.jar"]
