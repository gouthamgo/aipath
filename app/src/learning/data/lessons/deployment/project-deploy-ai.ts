import type { LessonContent } from '../types';

export const projectDeployAI: LessonContent = {
  slug: "project-deploy-ai",
  problemContent: `# Project: Deploy an AI Application

Put it all together - deploy a complete AI app to production!

## Deployment Components

| Component | Tool | Purpose |
|-----------|------|---------|
| Container | Docker | Consistent environment |
| Registry | GCR/ECR | Store images |
| Hosting | Cloud Run | Auto-scaling |
| CI/CD | GitHub Actions | Automated deploy |

## Project Structure

\`\`\`
ai-app/
├── app/
│   ├── main.py          # FastAPI app
│   ├── routes/          # API routes
│   └── requirements.txt
├── Dockerfile
├── docker-compose.yml
├── .github/workflows/
│   └── deploy.yml
└── cloudbuild.yaml
\`\`\`

## Your Task

1. Create production-ready Dockerfile
2. Set up docker-compose for local development
3. Configure Cloud Run deployment
4. Build CI/CD pipeline with GitHub Actions
5. Add monitoring and health checks`,
  solutionContent: `# Solution: Complete AI Deployment

This project demonstrates a full production deployment:

## Components

1. **Dockerfile**: Multi-stage, secure, optimized
2. **docker-compose**: Local development environment
3. **Cloud Run**: Production deployment with auto-scaling
4. **GitHub Actions**: Automated CI/CD pipeline
5. **Monitoring**: Structured logging and health checks

## Architecture

\`\`\`
GitHub → CI/CD → Container Registry → Cloud Run
                                          ↓
                                    Load Balancer
                                          ↓
                                   AI API Instances
                                          ↓
                                    Redis Cache
\`\`\``,
  explanationContent: `# Complete Deployment Architecture

## Overview

A production AI deployment requires multiple components working together:

### 1. Application Layer
\`\`\`
┌─────────────────────────────────────────┐
│              Load Balancer              │
│         (Cloud Run / Kubernetes)        │
└────────────────┬────────────────────────┘
                 │
    ┌────────────┼────────────┐
    ▼            ▼            ▼
┌───────┐   ┌───────┐   ┌───────┐
│ API 1 │   │ API 2 │   │ API 3 │
└───┬───┘   └───┬───┘   └───┬───┘
    │           │           │
    └─────┬─────┴─────┬─────┘
          ▼           ▼
      ┌───────┐   ┌───────┐
      │ Redis │   │ OpenAI│
      │ Cache │   │  API  │
      └───────┘   └───────┘
\`\`\`

### 2. CI/CD Pipeline
\`\`\`
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│   Push   │───▶│  Tests   │───▶│  Build   │───▶│  Deploy  │
│  to Git  │    │  & Lint  │    │  Image   │    │   Prod   │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
\`\`\`

### 3. Monitoring Stack
\`\`\`
Application → Structured Logs → Cloud Logging
                                     │
                                     ▼
                              Log-based Metrics
                                     │
                                     ▼
                              Alerting Policies
                                     │
                                     ▼
                              Notifications
                              (Slack, PagerDuty)
\`\`\`

## Key Deployment Decisions

### Why Cloud Run?
- **Automatic Scaling**: Handles 0 to thousands of requests
- **Pay Per Use**: Only pay for actual request handling
- **Managed TLS**: HTTPS automatically configured
- **Simple Deployment**: Just push a container

### Why Redis for Caching?
- **Response Caching**: Avoid redundant AI calls
- **Rate Limiting**: Token bucket implementation
- **Session Storage**: User context persistence

### Why GitHub Actions?
- **Integrated**: Works with GitHub repos natively
- **Flexible**: Custom workflows for any deployment
- **Secrets Management**: Secure credential handling
  `,
  realworldContent: `# Complete Production Deployment

## Project Structure

\`\`\`
ai-writing-assistant/
├── src/
│   ├── main.py           # FastAPI application
│   ├── config.py         # Configuration management
│   ├── routes/
│   │   ├── generate.py   # Generation endpoints
│   │   └── health.py     # Health checks
│   └── services/
│       ├── ai.py         # OpenAI integration
│       └── cache.py      # Redis caching
├── tests/
│   ├── test_api.py
│   └── test_services.py
├── Dockerfile
├── docker-compose.yml
├── docker-compose.prod.yml
├── requirements.txt
├── requirements-dev.txt
├── .github/
│   └── workflows/
│       └── deploy.yml
└── .env.example
\`\`\`

## Application Code

### main.py
\`\`\`python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import structlog
import redis.asyncio as redis
from openai import OpenAI

from config import settings
from routes import generate, health

# Structured logging
structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.JSONRenderer()
    ]
)
logger = structlog.get_logger()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("starting_application", environment=settings.ENVIRONMENT)
    app.state.openai_client = OpenAI(api_key=settings.OPENAI_API_KEY)
    app.state.redis = await redis.from_url(settings.REDIS_URL)
    yield
    # Shutdown
    await app.state.redis.close()
    logger.info("application_shutdown")

app = FastAPI(
    title="AI Writing Assistant",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(generate.router, prefix="/api/v1")
app.include_router(health.router)
\`\`\`

### config.py
\`\`\`python
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    OPENAI_API_KEY: str
    REDIS_URL: str = "redis://localhost:6379"
    CORS_ORIGINS: list[str] = ["*"]
    LOG_LEVEL: str = "info"

    class Config:
        env_file = ".env"

@lru_cache
def get_settings():
    return Settings()

settings = get_settings()
\`\`\`

## Dockerfile
\`\`\`dockerfile
# Build stage
FROM python:3.11-slim as builder
WORKDIR /app
RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Runtime stage
FROM python:3.11-slim
WORKDIR /app
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/* \\
    && useradd --create-home appuser

COPY --from=builder /root/.local /home/appuser/.local
COPY --chown=appuser:appuser src/ ./src/

ENV PATH=/home/appuser/.local/bin:$PATH
ENV PYTHONUNBUFFERED=1

USER appuser
EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \\
    CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
\`\`\`

## docker-compose.yml
\`\`\`yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=\${OPENAI_API_KEY}
      - REDIS_URL=redis://redis:6379
      - ENVIRONMENT=development
    depends_on:
      redis:
        condition: service_healthy
    volumes:
      - ./src:/app/src
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  redis:
    image: redis:7-alpine
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 3
\`\`\`

## GitHub Actions Workflow
\`\`\`yaml
name: Deploy

on:
  push:
    branches: [main]

env:
  PROJECT_ID: my-project
  SERVICE_NAME: ai-writing-assistant
  REGION: us-central1

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: |
          pip install -r requirements.txt -r requirements-dev.txt
          pytest tests/ -v --cov=src

  deploy:
    needs: test
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write

    steps:
      - uses: actions/checkout@v4

      - uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: \${{ secrets.WIF_PROVIDER }}
          service_account: \${{ secrets.WIF_SERVICE_ACCOUNT }}

      - uses: google-github-actions/setup-gcloud@v2

      - run: gcloud auth configure-docker

      - name: Build and Push
        run: |
          docker build -t gcr.io/\${{ env.PROJECT_ID }}/\${{ env.SERVICE_NAME }}:\${{ github.sha }} .
          docker push gcr.io/\${{ env.PROJECT_ID }}/\${{ env.SERVICE_NAME }}:\${{ github.sha }}

      - name: Deploy
        run: |
          gcloud run deploy \${{ env.SERVICE_NAME }} \\
            --image gcr.io/\${{ env.PROJECT_ID }}/\${{ env.SERVICE_NAME }}:\${{ github.sha }} \\
            --region \${{ env.REGION }} \\
            --memory 2Gi --cpu 1 \\
            --min-instances 1 --max-instances 10 \\
            --set-secrets OPENAI_API_KEY=openai-key:latest \\
            --set-env-vars REDIS_URL=\${{ secrets.REDIS_URL }},ENVIRONMENT=production
\`\`\`

## Health Check Endpoint
\`\`\`python
# routes/health.py
from fastapi import APIRouter, Request
import time

router = APIRouter()

@router.get("/health")
async def health(request: Request):
    checks = {}

    # Check Redis
    try:
        await request.app.state.redis.ping()
        checks["redis"] = "healthy"
    except:
        checks["redis"] = "unhealthy"

    # Check OpenAI
    try:
        request.app.state.openai_client.models.list()
        checks["openai"] = "healthy"
    except:
        checks["openai"] = "unhealthy"

    all_healthy = all(v == "healthy" for v in checks.values())

    return {
        "status": "healthy" if all_healthy else "degraded",
        "checks": checks,
        "timestamp": time.time()
    }
\`\`\`
  `,
  mistakesContent: `# Deployment Project Mistakes

## Mistake 1: Missing Environment Separation

### Wrong
\`\`\`python
# Hardcoded production values
OPENAI_API_KEY = "sk-live-xxxxx"
REDIS_URL = "redis://prod-redis:6379"
\`\`\`

### Correct
\`\`\`python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    OPENAI_API_KEY: str  # Required, no default
    REDIS_URL: str = "redis://localhost:6379"

    class Config:
        env_file = ".env"

settings = Settings()
\`\`\`

## Mistake 2: No Graceful Degradation

### Wrong
\`\`\`python
@app.get("/health")
async def health():
    # Fails completely if any service is down
    await redis.ping()
    await check_openai()
    return {"status": "healthy"}
\`\`\`

### Correct
\`\`\`python
@app.get("/health")
async def health():
    checks = {}

    try:
        await redis.ping()
        checks["redis"] = "healthy"
    except Exception as e:
        checks["redis"] = f"unhealthy: {str(e)}"

    try:
        await check_openai()
        checks["openai"] = "healthy"
    except Exception as e:
        checks["openai"] = f"unhealthy: {str(e)}"

    # Return degraded instead of failing completely
    status = "healthy" if all("healthy" in v for v in checks.values()) else "degraded"
    return {"status": status, "checks": checks}
\`\`\`

## Mistake 3: No CI/CD Testing

### Wrong
\`\`\`yaml
# Deploy without testing
deploy:
  steps:
    - run: docker build && docker push
    - run: gcloud run deploy
\`\`\`

### Correct
\`\`\`yaml
jobs:
  test:
    steps:
      - run: pytest tests/ -v --cov=src
      - run: mypy src/
      - run: ruff check src/

  deploy:
    needs: test  # Only deploy if tests pass
    steps:
      - run: docker build && docker push
      - run: gcloud run deploy
\`\`\`

## Mistake 4: No Rollback Strategy

### Wrong
\`\`\`yaml
# Deploy and hope for the best
- run: gcloud run deploy ai-api --image latest
\`\`\`

### Correct
\`\`\`yaml
# Tag with commit SHA for easy rollback
- run: |
    gcloud run deploy ai-api --image gcr.io/project/ai-api:\${{ github.sha }}

    # Verify deployment
    HEALTH=$(curl -s https://ai-api-xxx.run.app/health | jq -r '.status')
    if [ "$HEALTH" != "healthy" ]; then
      echo "Deployment unhealthy, rolling back..."
      gcloud run services update-traffic ai-api --to-revisions=PREVIOUS=100
      exit 1
    fi
\`\`\`
  `,
  interviewContent: `# Deployment Project Interview Questions

## Q1: Walk me through your deployment pipeline.

**Answer:**
Our pipeline follows a progressive deployment strategy:

1. **Code Push**: Developer pushes to main branch

2. **CI Phase**:
   - Run unit tests with pytest
   - Type checking with mypy
   - Linting with ruff
   - Build Docker image

3. **CD Phase**:
   - Push image to container registry
   - Deploy to Cloud Run with traffic split (10% initially)
   - Run smoke tests against new version
   - Gradual traffic increase (10% → 50% → 100%)

4. **Monitoring**:
   - Watch error rates and latency
   - Automatic rollback if thresholds exceeded

## Q2: How do you handle database migrations?

**Answer:**
For AI applications, we typically use:

1. **Alembic** for SQL databases:
\`\`\`bash
# Migration runs as init container before app starts
alembic upgrade head
\`\`\`

2. **Forward-compatible changes**:
   - Add nullable columns first
   - Deploy code that handles both schemas
   - Backfill data
   - Make column non-nullable

3. **Feature flags** for major changes:
\`\`\`python
if settings.USE_NEW_SCHEMA:
    query = new_query
else:
    query = legacy_query
\`\`\`

## Q3: How do you handle secrets rotation?

**Answer:**
Secrets management strategy:

1. **External Secret Manager** (Google Secret Manager, AWS Secrets Manager)

2. **Automatic Rotation**:
\`\`\`yaml
# New secret version triggers redeployment
gcloud run deploy --set-secrets OPENAI_API_KEY=openai-key:latest
\`\`\`

3. **Grace Period**: Support multiple valid keys during rotation

4. **No Secrets in Code**: All secrets from environment or secret manager

## Q4: How do you monitor deployment success?

**Answer:**
Multi-layer monitoring:

1. **Deployment Metrics**:
   - Deployment frequency
   - Lead time for changes
   - Change failure rate
   - Time to recovery

2. **Application Metrics**:
   - Request latency (p50, p95, p99)
   - Error rate
   - Throughput

3. **Business Metrics**:
   - Successful generations
   - Token usage
   - User satisfaction

4. **Alerting**:
\`\`\`yaml
alerts:
  - name: DeploymentFailed
    condition: deployment_status != "success"
    action: rollback + notify

  - name: ErrorSpike
    condition: error_rate > 5% for 5 minutes
    action: notify + investigate
\`\`\`
  `,
  starterCode: `# Project: Complete AI Deployment
# Build the full deployment infrastructure

# 1. Dockerfile (write as string)
dockerfile = """
# TODO: Multi-stage build for AI API
"""

# 2. docker-compose.yml (as dict)
docker_compose = {
    "version": "3.8",
    "services": {
        # TODO: Define api and redis services
    }
}

# 3. GitHub Actions workflow (as string)
github_workflow = """
# TODO: CI/CD pipeline with test and deploy jobs
"""

# 4. Health check endpoint (as function)
def health_check():
    # TODO: Check Redis and OpenAI connectivity
    pass

# 5. Main application configuration
app_config = {
    # TODO: Define environment-based configuration
}
`,
  solutionCode: `# Project: Complete AI Deployment

# 1. Dockerfile
dockerfile = """
# Build stage
FROM python:3.11-slim as builder
WORKDIR /app
RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Runtime stage
FROM python:3.11-slim
WORKDIR /app
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/* \\\\
    && useradd --create-home appuser

COPY --from=builder /root/.local /home/appuser/.local
COPY --chown=appuser:appuser src/ ./src/

ENV PATH=/home/appuser/.local/bin:$PATH
ENV PYTHONUNBUFFERED=1

USER appuser
EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \\\\
    CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
"""

# 2. docker-compose.yml
docker_compose = {
    "version": "3.8",
    "services": {
        "api": {
            "build": ".",
            "ports": ["8000:8000"],
            "environment": [
                "OPENAI_API_KEY=\${OPENAI_API_KEY}",
                "REDIS_URL=redis://redis:6379",
                "ENVIRONMENT=development"
            ],
            "depends_on": {
                "redis": {"condition": "service_healthy"}
            },
            "healthcheck": {
                "test": ["CMD", "curl", "-f", "http://localhost:8000/health"],
                "interval": "30s",
                "timeout": "10s",
                "retries": 3
            },
            "deploy": {
                "resources": {
                    "limits": {"memory": "2G", "cpus": "1.0"}
                }
            }
        },
        "redis": {
            "image": "redis:7-alpine",
            "healthcheck": {
                "test": ["CMD", "redis-cli", "ping"],
                "interval": "10s",
                "timeout": "5s",
                "retries": 3
            }
        }
    }
}

# 3. GitHub Actions workflow
github_workflow = """
name: Deploy AI Writing Assistant

on:
  push:
    branches: [main]

env:
  PROJECT_ID: my-project
  SERVICE_NAME: ai-writing-assistant
  REGION: us-central1

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: pip install -r requirements.txt -r requirements-dev.txt
      - run: pytest tests/ -v --cov=src
      - run: mypy src/

  deploy:
    needs: test
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: \${{ secrets.WIF_PROVIDER }}
          service_account: \${{ secrets.WIF_SERVICE_ACCOUNT }}
      - run: |
          gcloud auth configure-docker
          docker build -t gcr.io/\$PROJECT_ID/\$SERVICE_NAME:\${{ github.sha }} .
          docker push gcr.io/\$PROJECT_ID/\$SERVICE_NAME:\${{ github.sha }}
          gcloud run deploy \$SERVICE_NAME \\
            --image gcr.io/\$PROJECT_ID/\$SERVICE_NAME:\${{ github.sha }} \\
            --region \$REGION \\
            --memory 2Gi --cpu 1 \\
            --min-instances 1 --max-instances 10 \\
            --set-secrets OPENAI_API_KEY=openai-key:latest
"""

# 4. Health check endpoint
async def health_check(request):
    import time
    checks = {}

    # Check Redis
    try:
        await request.app.state.redis.ping()
        checks["redis"] = "healthy"
    except Exception as e:
        checks["redis"] = f"unhealthy: {str(e)}"

    # Check OpenAI
    try:
        request.app.state.openai_client.models.list()
        checks["openai"] = "healthy"
    except Exception as e:
        checks["openai"] = f"unhealthy: {str(e)}"

    all_healthy = all("healthy" == v for v in checks.values())

    return {
        "status": "healthy" if all_healthy else "degraded",
        "checks": checks,
        "timestamp": time.time(),
        "version": "1.0.0"
    }

# 5. Application configuration
app_config = {
    "development": {
        "debug": True,
        "log_level": "debug",
        "redis_url": "redis://localhost:6379",
        "cors_origins": ["*"],
        "min_instances": 0
    },
    "staging": {
        "debug": False,
        "log_level": "info",
        "redis_url": "redis://staging-redis:6379",
        "cors_origins": ["https://staging.example.com"],
        "min_instances": 1
    },
    "production": {
        "debug": False,
        "log_level": "warning",
        "redis_url": "redis://prod-redis:6379",
        "cors_origins": ["https://example.com"],
        "min_instances": 2
    }
}

print("Deployment infrastructure complete!")
print(f"Dockerfile: {len(dockerfile)} characters")
print(f"Services: {list(docker_compose['services'].keys())}")
print(f"Environments: {list(app_config.keys())}")
`,
  hints: [
    "Use multi-stage Docker builds to keep image size small",
    "Add health checks that verify both Redis and OpenAI connectivity",
    "Configure depends_on with condition: service_healthy for proper startup order",
    "Include both test and deploy jobs in CI/CD with needs dependency",
    "Define environment-specific configurations for dev, staging, and production"
  ]
};
