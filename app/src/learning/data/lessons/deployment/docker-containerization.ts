import type { LessonContent } from '../types';

export const dockerContainerization: LessonContent = {
  slug: "docker-containerization",
  problemContent: `# Docker for AI Applications

Package your AI apps in containers for consistent deployment!

## Docker Best Practices

| Practice | Benefit | Example |
|----------|---------|---------|
| Multi-stage build | Smaller images | Separate build/runtime |
| Non-root user | Security | \`USER appuser\` |
| .dockerignore | Faster builds | Exclude \`__pycache__\` |
| Health checks | Reliability | \`HEALTHCHECK CMD curl\` |

## Basic Dockerfile

\`\`\`dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0"]
\`\`\`

## Your Task

1. Write an optimized Dockerfile with multi-stage builds
2. Create docker-compose.yml for local development
3. Handle environment variables securely
4. Implement health checks`,
  solutionContent: `# Solution: Production Docker Setup

This solution demonstrates Docker best practices:

## Key Optimizations

1. **Multi-Stage Build**: Separate build and runtime stages
2. **Layer Caching**: Order commands for optimal caching
3. **Security**: Non-root user, no secrets in image
4. **Health Checks**: Container health monitoring
5. **Resource Limits**: Memory and CPU constraints`,
  explanationContent: `# Docker for AI Applications

## Why Docker for AI?

Docker provides:
- **Consistency**: Same environment everywhere
- **Isolation**: Dependencies don't conflict
- **Reproducibility**: Exact same setup every time
- **Scalability**: Easy horizontal scaling

## Dockerfile Best Practices

### Multi-Stage Builds
\`\`\`dockerfile
# Stage 1: Build dependencies
FROM python:3.11-slim as builder

WORKDIR /app
COPY requirements.txt .

# Install build dependencies
RUN pip install --user --no-cache-dir -r requirements.txt

# Stage 2: Runtime
FROM python:3.11-slim

WORKDIR /app

# Copy only what we need from builder
COPY --from=builder /root/.local /root/.local
COPY . .

ENV PATH=/root/.local/bin:$PATH

CMD ["python", "main.py"]
\`\`\`

### Layer Optimization
\`\`\`dockerfile
# Bad: Changes to code invalidate pip cache
COPY . .
RUN pip install -r requirements.txt

# Good: Dependencies cached separately
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
\`\`\`

### Security Practices
\`\`\`dockerfile
# Create non-root user
RUN useradd --create-home --shell /bin/bash appuser

# Set ownership
COPY --chown=appuser:appuser . .

# Switch to non-root user
USER appuser
\`\`\`

## docker-compose for Development

\`\`\`yaml
version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=\${OPENAI_API_KEY}
      - LOG_LEVEL=debug
    volumes:
      # Mount source for hot reload
      - ./src:/app/src
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '1.0'

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  redis_data:
\`\`\`

## Environment Variables

### Development (.env file)
\`\`\`bash
# .env - NEVER commit this file
OPENAI_API_KEY=sk-your-dev-key
DATABASE_URL=postgresql://user:pass@db:5432/app
LOG_LEVEL=debug
\`\`\`

### Production (external secrets)
\`\`\`yaml
# docker-compose.prod.yml
services:
  api:
    environment:
      - OPENAI_API_KEY  # Set externally, not in file
    secrets:
      - db_password

secrets:
  db_password:
    external: true  # Managed by Docker Swarm or k8s
\`\`\`

## Health Checks

### In Application
\`\`\`python
from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "checks": {
            "openai": await check_openai(),
            "database": await check_database()
        }
    }

async def check_openai():
    try:
        # Lightweight API call
        await openai_client.models.list()
        return "ok"
    except:
        return "error"
\`\`\`

### In Dockerfile
\`\`\`dockerfile
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \\
  CMD curl -f http://localhost:8000/health || exit 1
\`\`\`
  `,
  realworldContent: `# Production Docker Configuration

## Complete Dockerfile

\`\`\`dockerfile
# Dockerfile
# Multi-stage build for AI API

# ============ Build Stage ============
FROM python:3.11-slim as builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \\
    build-essential \\
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# ============ Runtime Stage ============
FROM python:3.11-slim

WORKDIR /app

# Install runtime dependencies only
RUN apt-get update && apt-get install -y --no-install-recommends \\
    curl \\
    && rm -rf /var/lib/apt/lists/* \\
    && useradd --create-home --shell /bin/bash appuser

# Copy Python packages from builder
COPY --from=builder /root/.local /home/appuser/.local

# Copy application code
COPY --chown=appuser:appuser . .

# Set environment
ENV PATH=/home/appuser/.local/bin:$PATH
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \\
    CMD curl -f http://localhost:8000/health || exit 1

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
\`\`\`

## docker-compose.yml

\`\`\`yaml
version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: ai-api
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=\${OPENAI_API_KEY}
      - REDIS_URL=redis://redis:6379
      - LOG_LEVEL=\${LOG_LEVEL:-info}
    depends_on:
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '1.0'
        reservations:
          memory: 512M
          cpus: '0.25'
    restart: unless-stopped
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"

  redis:
    image: redis:7-alpine
    container_name: ai-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 3
    command: redis-server --appendonly yes

volumes:
  redis_data:
    driver: local

networks:
  default:
    name: ai-network
\`\`\`

## .dockerignore

\`\`\`
# .dockerignore
__pycache__
*.pyc
*.pyo
.pytest_cache
.git
.gitignore
.env
.env.*
*.md
Dockerfile*
docker-compose*
.dockerignore
venv
.venv
*.log
.coverage
htmlcov
.mypy_cache
.ruff_cache
tests
\`\`\`

## Production Deployment Script

\`\`\`bash
#!/bin/bash
# deploy.sh

set -e

echo "Building production image..."
docker build -t ai-api:latest .

echo "Running tests in container..."
docker run --rm ai-api:latest pytest

echo "Pushing to registry..."
docker tag ai-api:latest registry.example.com/ai-api:latest
docker push registry.example.com/ai-api:latest

echo "Deploying..."
docker-compose -f docker-compose.prod.yml up -d

echo "Deployment complete!"
\`\`\`

## requirements.txt

\`\`\`
fastapi==0.109.0
uvicorn[standard]==0.27.0
openai==1.10.0
redis==5.0.1
pydantic==2.5.0
python-dotenv==1.0.0
httpx==0.26.0
\`\`\`
  `,
  mistakesContent: `# Common Docker Mistakes

## Mistake 1: Secrets in Image

### Wrong
\`\`\`dockerfile
# API key is baked into the image!
ENV OPENAI_API_KEY=sk-live-xxxxx

# Or copying .env file
COPY .env .
\`\`\`

### Correct
\`\`\`dockerfile
# Don't set secrets in Dockerfile
# Pass at runtime instead

# docker run -e OPENAI_API_KEY=\$OPENAI_API_KEY ...
# Or use docker-compose with env_file
\`\`\`

## Mistake 2: Running as Root

### Wrong
\`\`\`dockerfile
# Runs as root - security risk!
FROM python:3.11
COPY . .
CMD ["python", "main.py"]
\`\`\`

### Correct
\`\`\`dockerfile
FROM python:3.11

RUN useradd --create-home appuser
USER appuser
WORKDIR /home/appuser

COPY --chown=appuser:appuser . .
CMD ["python", "main.py"]
\`\`\`

## Mistake 3: Large Images

### Wrong
\`\`\`dockerfile
# Full Python image with build tools left behind
FROM python:3.11
RUN apt-get update && apt-get install -y build-essential gcc
RUN pip install -r requirements.txt
COPY . .
# Image size: ~1.5GB
\`\`\`

### Correct
\`\`\`dockerfile
# Multi-stage build
FROM python:3.11 as builder
RUN apt-get update && apt-get install -y build-essential
RUN pip install --user -r requirements.txt

FROM python:3.11-slim
COPY --from=builder /root/.local /root/.local
COPY . .
# Image size: ~200MB
\`\`\`

## Mistake 4: No Layer Caching

### Wrong
\`\`\`dockerfile
# Every code change rebuilds all dependencies
COPY . .
RUN pip install -r requirements.txt
\`\`\`

### Correct
\`\`\`dockerfile
# Dependencies cached unless requirements.txt changes
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
\`\`\`

## Mistake 5: No Health Checks

### Wrong
\`\`\`yaml
# No way to know if container is healthy
services:
  api:
    image: my-api
    ports:
      - "8000:8000"
\`\`\`

### Correct
\`\`\`yaml
services:
  api:
    image: my-api
    ports:
      - "8000:8000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
\`\`\`
  `,
  interviewContent: `# Docker Interview Questions

## Q1: How do you optimize Docker image size for AI applications?

**Answer:**
Key strategies:

1. **Multi-stage builds**: Separate build and runtime
\`\`\`dockerfile
FROM python:3.11 as builder
RUN pip install --user -r requirements.txt

FROM python:3.11-slim
COPY --from=builder /root/.local /root/.local
\`\`\`

2. **Slim base images**: Use \`-slim\` or \`-alpine\` variants

3. **Combine RUN commands**: Reduce layers
\`\`\`dockerfile
RUN apt-get update && apt-get install -y pkg1 pkg2 && rm -rf /var/lib/apt/lists/*
\`\`\`

4. **Use .dockerignore**: Exclude unnecessary files

5. **Don't install dev dependencies**: Use \`--no-dev\` flags

## Q2: How do you handle secrets in Docker?

**Answer:**
Never store secrets in images. Options:

1. **Runtime environment variables**:
\`\`\`bash
docker run -e OPENAI_API_KEY=\$KEY myapp
\`\`\`

2. **Docker secrets** (Swarm):
\`\`\`yaml
secrets:
  api_key:
    external: true
\`\`\`

3. **External secret managers**: HashiCorp Vault, AWS Secrets Manager

4. **Mounted secret files**:
\`\`\`yaml
volumes:
  - /run/secrets/api_key:/app/secrets/api_key:ro
\`\`\`

## Q3: How do you handle GPU access in Docker?

**Answer:**
For AI workloads requiring GPU:

\`\`\`yaml
# docker-compose.yml
services:
  ml-api:
    image: ml-api:latest
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
\`\`\`

Or with docker run:
\`\`\`bash
docker run --gpus all ml-api:latest
\`\`\`

Requires nvidia-container-toolkit installed on host.

## Q4: What's your container debugging workflow?

**Answer:**
Progressive debugging approach:

1. **Check logs**:
\`\`\`bash
docker logs -f container_name
\`\`\`

2. **Exec into container**:
\`\`\`bash
docker exec -it container_name /bin/bash
\`\`\`

3. **Inspect container**:
\`\`\`bash
docker inspect container_name
\`\`\`

4. **Health check status**:
\`\`\`bash
docker inspect --format='{{.State.Health}}' container_name
\`\`\`

5. **Resource usage**:
\`\`\`bash
docker stats container_name
\`\`\`
  `,
  starterCode: `# Dockerfile
# TODO: Create a production-ready Dockerfile for an AI API

# Stage 1: Builder


# Stage 2: Runtime


# docker-compose.yml content (as comment):
# version: '3.8'
# services:
#   api:
#     build: .
#     ports:
#       - "8000:8000"
#     # TODO: Add environment, healthcheck, resources
`,
  solutionCode: `# Dockerfile - Production-ready AI API

# ============ Build Stage ============
FROM python:3.11-slim as builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \\
    build-essential \\
    && rm -rf /var/lib/apt/lists/*

# Copy and install dependencies
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# ============ Runtime Stage ============
FROM python:3.11-slim

WORKDIR /app

# Install runtime dependencies and create user
RUN apt-get update && apt-get install -y --no-install-recommends \\
    curl \\
    && rm -rf /var/lib/apt/lists/* \\
    && useradd --create-home --shell /bin/bash appuser

# Copy Python packages from builder
COPY --from=builder /root/.local /home/appuser/.local

# Copy application
COPY --chown=appuser:appuser . .

# Environment setup
ENV PATH=/home/appuser/.local/bin:$PATH
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Security: run as non-root
USER appuser

EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \\
    CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]


# ============ docker-compose.yml ============
# version: '3.8'
#
# services:
#   api:
#     build:
#       context: .
#       dockerfile: Dockerfile
#     container_name: ai-api
#     ports:
#       - "8000:8000"
#     environment:
#       - OPENAI_API_KEY=\${OPENAI_API_KEY}
#       - LOG_LEVEL=\${LOG_LEVEL:-info}
#     healthcheck:
#       test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
#       interval: 30s
#       timeout: 10s
#       retries: 3
#       start_period: 10s
#     deploy:
#       resources:
#         limits:
#           memory: 2G
#           cpus: '1.0'
#     restart: unless-stopped
#     logging:
#       driver: json-file
#       options:
#         max-size: "10m"
#         max-file: "3"
#
# networks:
#   default:
#     name: ai-network
`,
  hints: [
    "Use multi-stage builds: 'FROM python:3.11-slim as builder' then 'FROM python:3.11-slim'",
    "Copy dependencies first, then code - this optimizes layer caching",
    "Create a non-root user with 'useradd' and switch with 'USER'",
    "Add HEALTHCHECK instruction to enable container health monitoring",
    "Use --no-cache-dir with pip to reduce image size"
  ]
};
