# Containers (Docker/Podman)

Containerization skills and best practices.

## Container Basics

### What is a Container?

A container is like a **shipping box** for software:
- 📦 Packages application + dependencies
- 🚢 Runs consistently anywhere
- 🏭 Same environment on all machines

**Analogy:** Like a standardized shipping container that can be loaded on any ship, train, or truck.

### Docker vs Podman

| Feature | Docker | Podman |
|---------|--------|--------|
| Daemon | Required (dockerd) | Not required |
| Root | Runs as root | Rootless by default |
| CLI | `docker` | `podman` |
| Compatibility | Original | Docker-compatible |

**Both use the same commands and Dockerfile format!**

## Dockerfile

### Multi-Stage Build

```dockerfile
# Stage 1: Build
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /build
COPY pom.xml .
RUN mvn dependency:go-offline

COPY src/ src/
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app
COPY --from=builder /build/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
```

**Why multi-stage?**
- Smaller final image
- No build tools in production
- Better security

### Dockerfile Best Practices

**DO:**
- ✅ Use specific versions (`17-jdk-alpine` not `latest`)
- ✅ Use multi-stage builds
- ✅ Run as non-root user
- ✅ Combine RUN commands
- ✅ Use .dockerignore

**DON'T:**
- ❌ Use `latest` tag
- ❌ Include secrets in Dockerfile
- ❌ Run as root
- ❌ Install unnecessary tools

**Example:**
```dockerfile
# ✅ Good
FROM eclipse-temurin:17-jre-alpine:3.19
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# ❌ Bad
FROM eclipse-temurin:latest
USER root
```

## Common Commands

### Building Images

```bash
# Build with Docker
docker build -t myapp:latest .

# Build with Podman
podman build -t myapp:latest .

# Build with specific tag
docker build -t myapp:v1.0.0 .

# Build with no cache
docker build --no-cache -t myapp:latest .
```

### Running Containers

```bash
# Run container
docker run myapp:latest

# Run with name
docker run --name myapp-container myapp:latest

# Run in background (detached)
docker run -d myapp:latest

# Run with port mapping
docker run -p 8080:8080 myapp:latest

# Run with environment variables
docker run -e DATABASE_URL=postgres://db myapp:latest

# Run with volume
docker run -v $(pwd)/data:/app/data myapp:latest

# Run and remove after exit
docker run --rm myapp:latest
```

### Managing Containers

```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# Stop container
docker stop container-id

# Start container
docker start container-id

# Remove container
docker rm container-id

# Force remove (stop + remove)
docker rm -f container-id

# View logs
docker logs container-id

# Follow logs
docker logs -f container-id
```

### Managing Images

```bash
# List images
docker images

# Remove image
docker rmi image-id

# Remove unused images
docker image prune

# Pull from registry
docker pull ghcr.io/user/repo:latest

# Push to registry
docker push ghcr.io/user/repo:latest

# Tag image
docker tag myapp:latest myapp:v1.0.0
```

## Docker Compose

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    image: myapp:latest
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=postgres://db:5432/mydb
    depends_on:
      - db
    volumes:
      - ./logs:/app/logs
    
  db:
    image: postgres:14
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

### Docker Compose Commands

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Rebuild images
docker-compose up --build

# View logs
docker-compose logs

# View logs for specific service
docker-compose logs app

# Scale service
docker-compose up --scale app=3

# Execute command in container
docker-compose exec app bash
```

## Container Registries

### GitHub Container Registry (GHCR)

**URL:** `ghcr.io/username/repository:tag`

**Login:**
```bash
# Docker
docker login ghcr.io -u USERNAME -p TOKEN

# Podman
podman login ghcr.io -u USERNAME -p TOKEN
```

**Pull:**
```bash
docker pull ghcr.io/rizkirachman/goods-price-comparison-api:latest
```

**Push:**
```bash
# Tag
docker tag myapp:latest ghcr.io/rizkirachman/myapp:latest

# Push
docker push ghcr.io/rizkirachman/myapp:latest
```

### Multi-Platform Images

Build for multiple architectures:

```bash
# Create builder
docker buildx create --use

# Build for multiple platforms
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t ghcr.io/user/repo:latest \
  --push .
```

**Supported platforms:**
- `linux/amd64` - Intel/AMD (servers, Intel Macs)
- `linux/arm64` - ARM64 (Apple Silicon M1/M2/M3)
- `linux/arm/v7` - ARM v7 (older ARM devices)

## Container Security

### Running as Non-Root

```dockerfile
FROM eclipse-temurin:17-jre-alpine

# Create user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set ownership
COPY --chown=appuser:appgroup app.jar /app/app.jar

# Switch to non-root user
USER appuser

WORKDIR /app

ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Scanning Images

```bash
# Scan with Trivy
trivy image myapp:latest

# Scan with Docker Scout
docker scout cves myapp:latest

# Scan with Snyk
snyk container test myapp:latest
```

### Read-Only Filesystems

```bash
# Run with read-only root filesystem
docker run --read-only -v /tmp:/tmp myapp:latest
```

## Debugging Containers

### Exec into Container

```bash
# Get shell access
docker exec -it container-id /bin/sh

# For Alpine (uses sh)
docker exec -it container-id sh

# For Ubuntu/Debian (uses bash)
docker exec -it container-id bash

# Run specific command
docker exec container-id ls -la
```

### Inspect Container

```bash
# View container details
docker inspect container-id

# View container stats
docker stats

# View resource usage
docker system df
```

### Copy Files

```bash
# Copy from container to host
docker cp container-id:/app/logs/app.log ./local.log

# Copy from host to container
docker cp ./local-file.txt container-id:/app/
```

## Performance Optimization

### Image Size

**Techniques:**
```dockerfile
# Use smaller base images
FROM eclipse-temurin:17-jre-alpine  # 180MB
# vs
FROM eclipse-temurin:17-jdk         # 400MB

# Multi-stage builds
FROM eclipse-temurin:17-jdk AS builder
# ... build ...

FROM eclipse-temurin:17-jre-alpine
COPY --from=builder /app/app.jar .

# Combine RUN commands
RUN apk add --no-cache curl && \
    rm -rf /var/cache/apk/*
```

### Layer Caching

Order Dockerfile commands by change frequency:

```dockerfile
# 1. Dependencies (rarely changes)
COPY pom.xml .
RUN mvn dependency:go-offline

# 2. Source code (changes often)
COPY src/ src/
RUN mvn package
```

### Resource Limits

```bash
# Limit memory
docker run -m 512m myapp:latest

# Limit CPU
docker run --cpus=2 myapp:latest

# Limit both
docker run -m 512m --cpus=2 myapp:latest
```

## Troubleshooting

### Common Issues

**"port is already allocated"**
```bash
# Find process using port
lsof -i :8080

# Kill process or use different port
docker run -p 8081:8080 myapp:latest
```

**"no space left on device"**
```bash
# Clean up
docker system prune -a
docker volume prune
```

**"permission denied"**
```bash
# Fix volume permissions
docker run -v $(pwd):/app -u $(id -u):$(id -g) myapp:latest
```

### Logs and Debugging

```bash
# View container logs
docker logs container-id

# Follow logs
docker logs -f --tail 100 container-id

# View with timestamps
docker logs -t container-id
```

## Podman Specific

### Rootless Containers

```bash
# Podman runs rootless by default
podman run myapp:latest

# Check if rootless
podman info | grep rootless
```

### Podman Compose

```bash
# Install podman-compose
pip install podman-compose

# Usage (same as docker-compose)
podman-compose up
podman-compose down
```

### Generating Kubernetes YAML

```bash
# Generate K8s deployment
podman generate kube myapp-container > deployment.yaml

# Deploy to Kubernetes
kubectl apply -f deployment.yaml
```

## Best Practices Summary

| Practice | Why |
|----------|-----|
| Use specific tags | Reproducibility |
| Multi-stage builds | Smaller images |
| Non-root user | Security |
| Health checks | Reliability |
| Read-only filesystem | Security |
| Scan images | Security |
| .dockerignore | Smaller context |
| Combine RUN commands | Fewer layers |

## Quick Reference

```bash
# Build and run
docker build -t myapp:latest . && docker run -p 8080:8080 myapp:latest

# Full cleanup
docker system prune -a --volumes

# Debug
docker logs -f container-id
docker exec -it container-id sh
```
