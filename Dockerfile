# syntax=docker/dockerfile:1

# Ultra-minimal container for OpenAPI API artifacts
# Just packages the pre-built JAR
# Target size: ~5-10MB

FROM alpine:3.19

WORKDIR /app

# Copy pre-built JAR (built by CI)
COPY target/*.jar ./

# Create non-root user
RUN adduser -D -s /bin/sh appuser && \
    chown -R appuser:appuser /app

USER appuser

# Default: show artifacts
CMD ["ls", "-lh"]
