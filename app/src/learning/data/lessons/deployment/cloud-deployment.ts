import type { LessonContent } from '../types';

export const cloudDeployment: LessonContent = {
  slug: "cloud-deployment",
  problemContent: `# Cloud Deployment for AI Applications

Deploy your AI apps to the cloud with auto-scaling and reliability!

## Cloud Deployment Options

| Service | Provider | Best For |
|---------|----------|----------|
| Cloud Run | Google | Auto-scaling containers |
| ECS | AWS | Container orchestration |
| Lambda | AWS | Event-driven functions |
| AKS/GKE | Azure/Google | Complex Kubernetes |

## Basic Cloud Run Deployment

\`\`\`bash
# Build and push to Google Container Registry
gcloud builds submit --tag gcr.io/PROJECT_ID/ai-app

# Deploy to Cloud Run
gcloud run deploy ai-app \\
  --image gcr.io/PROJECT_ID/ai-app \\
  --platform managed \\
  --allow-unauthenticated
\`\`\`

## Your Task

1. Choose appropriate cloud services for your AI app
2. Configure auto-scaling policies
3. Set up monitoring and alerts
4. Implement CI/CD pipeline`,
  solutionContent: `# Solution: Cloud Deployment Strategy

This solution covers key cloud deployment patterns:

## Deployment Options

1. **Container Services**: AWS ECS, Google Cloud Run, Azure Container Apps
2. **Kubernetes**: EKS, GKE, AKS for complex workloads
3. **Serverless**: Lambda, Cloud Functions for event-driven

## Key Decisions

- Cloud Run for simplicity and auto-scaling
- GitHub Actions for CI/CD
- Structured logging for observability
- Request-based scaling for cost efficiency`,
  explanationContent: `# Cloud Deployment Strategies

## Deployment Options Comparison

### Container Services (Recommended for AI APIs)

**AWS ECS / Google Cloud Run / Azure Container Apps**
\`\`\`yaml
# Cloud Run service.yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: ai-api
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/minScale: "1"
        autoscaling.knative.dev/maxScale: "10"
    spec:
      containers:
        - image: gcr.io/project/ai-api:latest
          resources:
            limits:
              memory: 2Gi
              cpu: "1"
          env:
            - name: OPENAI_API_KEY
              valueFrom:
                secretKeyRef:
                  name: api-secrets
                  key: openai-key
\`\`\`

### Serverless Functions

**AWS Lambda / Cloud Functions**
\`\`\`python
# For lightweight, event-driven AI tasks
import json

def handler(event, context):
    prompt = event.get('prompt')
    result = generate_response(prompt)
    return {
        'statusCode': 200,
        'body': json.dumps({'result': result})
    }
\`\`\`

Considerations:
- Cold start latency (1-5 seconds)
- 15-minute timeout limit
- Good for async processing, webhooks

### Kubernetes

**For complex, multi-service deployments**
\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ai-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ai-api
  template:
    spec:
      containers:
        - name: api
          image: ai-api:latest
          resources:
            requests:
              memory: "1Gi"
              cpu: "500m"
            limits:
              memory: "2Gi"
              cpu: "1"
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ai-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ai-api
  minReplicas: 2
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
\`\`\`

## Auto-Scaling Strategies

### Request-Based Scaling
\`\`\`yaml
# Cloud Run
annotations:
  autoscaling.knative.dev/target: "100"  # requests per instance
\`\`\`

### CPU-Based Scaling
\`\`\`yaml
# Kubernetes HPA
metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
\`\`\`

### Custom Metrics
\`\`\`yaml
# Scale based on queue depth
metrics:
  - type: External
    external:
      metric:
        name: queue_messages_ready
      target:
        type: AverageValue
        averageValue: 30
\`\`\`

## Zero-Downtime Deployments

### Rolling Updates
\`\`\`yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
\`\`\`

### Blue-Green Deployment
\`\`\`bash
# Deploy new version to "green"
kubectl apply -f deployment-green.yaml

# Test green environment
curl https://green.example.com/health

# Switch traffic
kubectl patch service ai-api -p '{"spec":{"selector":{"version":"green"}}}'
\`\`\`
  `,
  realworldContent: `# Production Cloud Deployment

## Google Cloud Run Deployment

### cloudbuild.yaml
\`\`\`yaml
steps:
  # Build the container
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/ai-api:$COMMIT_SHA', '.']

  # Push to Container Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/ai-api:$COMMIT_SHA']

  # Deploy to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'ai-api'
      - '--image=gcr.io/$PROJECT_ID/ai-api:$COMMIT_SHA'
      - '--region=us-central1'
      - '--platform=managed'
      - '--memory=2Gi'
      - '--cpu=1'
      - '--min-instances=1'
      - '--max-instances=10'
      - '--concurrency=100'
      - '--set-secrets=OPENAI_API_KEY=openai-key:latest'

options:
  logging: CLOUD_LOGGING_ONLY
\`\`\`

## GitHub Actions CI/CD

### .github/workflows/deploy.yml
\`\`\`yaml
name: Deploy to Cloud Run

on:
  push:
    branches: [main]

env:
  PROJECT_ID: my-project
  SERVICE_NAME: ai-api
  REGION: us-central1

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: pip install -r requirements.txt -r requirements-dev.txt

      - name: Run tests
        run: pytest tests/ -v

  deploy:
    needs: test
    runs-on: ubuntu-latest

    permissions:
      contents: read
      id-token: write

    steps:
      - uses: actions/checkout@v4

      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: \${{ secrets.WIF_PROVIDER }}
          service_account: \${{ secrets.WIF_SERVICE_ACCOUNT }}

      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v2

      - name: Configure Docker
        run: gcloud auth configure-docker

      - name: Build and Push
        run: |
          docker build -t gcr.io/\${{ env.PROJECT_ID }}/\${{ env.SERVICE_NAME }}:\${{ github.sha }} .
          docker push gcr.io/\${{ env.PROJECT_ID }}/\${{ env.SERVICE_NAME }}:\${{ github.sha }}

      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy \${{ env.SERVICE_NAME }} \\
            --image gcr.io/\${{ env.PROJECT_ID }}/\${{ env.SERVICE_NAME }}:\${{ github.sha }} \\
            --region \${{ env.REGION }} \\
            --platform managed \\
            --memory 2Gi \\
            --cpu 1 \\
            --min-instances 1 \\
            --max-instances 10 \\
            --set-secrets OPENAI_API_KEY=openai-key:latest

      - name: Output URL
        run: |
          echo "Deployed to: $(gcloud run services describe \${{ env.SERVICE_NAME }} --region \${{ env.REGION }} --format 'value(status.url)')"
\`\`\`

## Monitoring Setup

### Application Logging
\`\`\`python
import structlog
import logging

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.JSONRenderer()
    ],
    wrapper_class=structlog.make_filtering_bound_logger(logging.INFO),
)

logger = structlog.get_logger()

@app.post("/generate")
async def generate(request: GenerationRequest):
    logger.info(
        "generation_started",
        prompt_length=len(request.prompt),
        model=request.model
    )

    start_time = time.time()
    result = await process_request(request)
    duration = time.time() - start_time

    logger.info(
        "generation_completed",
        duration_ms=duration * 1000,
        tokens=result.usage.total_tokens
    )

    return result
\`\`\`

### Alert Configuration
\`\`\`yaml
# alerting.yaml (Google Cloud Monitoring)
displayName: High Error Rate
conditions:
  - displayName: Error rate > 5%
    conditionThreshold:
      filter: |
        resource.type = "cloud_run_revision"
        AND metric.type = "run.googleapis.com/request_count"
        AND metric.labels.response_code_class = "5xx"
      comparison: COMPARISON_GT
      thresholdValue: 0.05
      duration: 300s
      aggregations:
        - alignmentPeriod: 60s
          perSeriesAligner: ALIGN_RATE
notificationChannels:
  - projects/my-project/notificationChannels/slack-channel
\`\`\`
  `,
  mistakesContent: `# Common Cloud Deployment Mistakes

## Mistake 1: No Minimum Instances

### Wrong
\`\`\`yaml
# All instances scale to zero
annotations:
  autoscaling.knative.dev/minScale: "0"
\`\`\`

**Problem**: Cold starts cause 2-10 second latency spikes.

### Correct
\`\`\`yaml
# Keep at least one warm instance
annotations:
  autoscaling.knative.dev/minScale: "1"
  autoscaling.knative.dev/maxScale: "10"
\`\`\`

## Mistake 2: Hardcoded Secrets

### Wrong
\`\`\`yaml
env:
  - name: OPENAI_API_KEY
    value: "sk-xxxxxxxxxxxxx"  # Exposed in deployment config!
\`\`\`

### Correct
\`\`\`yaml
env:
  - name: OPENAI_API_KEY
    valueFrom:
      secretKeyRef:
        name: api-secrets
        key: openai-key
\`\`\`

## Mistake 3: No Health Checks

### Wrong
\`\`\`yaml
# No health check - bad instances stay in rotation
containers:
  - image: ai-api:latest
\`\`\`

### Correct
\`\`\`yaml
containers:
  - image: ai-api:latest
    livenessProbe:
      httpGet:
        path: /health
        port: 8000
      initialDelaySeconds: 10
      periodSeconds: 30
    readinessProbe:
      httpGet:
        path: /health
        port: 8000
      initialDelaySeconds: 5
      periodSeconds: 10
\`\`\`

## Mistake 4: No Resource Limits

### Wrong
\`\`\`yaml
# No limits - can consume all node resources
containers:
  - image: ai-api:latest
\`\`\`

### Correct
\`\`\`yaml
containers:
  - image: ai-api:latest
    resources:
      requests:
        memory: "1Gi"
        cpu: "500m"
      limits:
        memory: "2Gi"
        cpu: "1"
\`\`\`

## Mistake 5: No Graceful Shutdown

### Wrong
\`\`\`python
# Requests in progress are killed immediately
if __name__ == "__main__":
    uvicorn.run(app)
\`\`\`

### Correct
\`\`\`python
import signal
import asyncio

async def shutdown(signal, loop):
    print(f"Received {signal.name}, shutting down gracefully...")
    # Complete in-progress requests
    await asyncio.sleep(10)
    loop.stop()

if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    for s in (signal.SIGTERM, signal.SIGINT):
        loop.add_signal_handler(s, lambda s=s: asyncio.create_task(shutdown(s, loop)))

    uvicorn.run(app, host="0.0.0.0", port=8000)
\`\`\`
  `,
  interviewContent: `# Cloud Deployment Interview Questions

## Q1: How do you handle cold starts in serverless AI applications?

**Answer:**
Strategies to minimize cold start impact:

1. **Provisioned Concurrency** (Lambda):
\`\`\`yaml
ProvisionedConcurrencyConfig:
  ProvisionedConcurrentExecutions: 5
\`\`\`

2. **Minimum Instances** (Cloud Run):
\`\`\`yaml
autoscaling.knative.dev/minScale: "1"
\`\`\`

3. **Warm-up Requests**: Periodic pings to keep instances warm

4. **Optimize Initialization**: Load models lazily, defer heavy imports

5. **Use Containers**: More predictable startup than serverless functions

## Q2: How do you implement blue-green deployments?

**Answer:**
Two approaches:

**DNS/Load Balancer Switch:**
\`\`\`bash
# Deploy green version
kubectl apply -f deployment-green.yaml

# Verify health
curl https://green-api.example.com/health

# Switch traffic at load balancer
aws elbv2 modify-listener --listener-arn $ARN --default-actions TargetGroupArn=$GREEN_TG

# Rollback if needed
aws elbv2 modify-listener --listener-arn $ARN --default-actions TargetGroupArn=$BLUE_TG
\`\`\`

**Service Mesh (Istio):**
\`\`\`yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
spec:
  http:
    - route:
        - destination:
            host: ai-api
            subset: green
          weight: 100
\`\`\`

## Q3: How do you optimize cloud costs for AI workloads?

**Answer:**
Key strategies:

1. **Right-sizing**: Match instance size to actual usage
\`\`\`bash
# Analyze actual resource usage
kubectl top pods
\`\`\`

2. **Spot/Preemptible Instances**: 60-90% savings for fault-tolerant workloads

3. **Auto-scaling**: Scale down during low traffic

4. **Caching**: Reduce API calls with response caching

5. **Model Optimization**: Use smaller models when possible

6. **Request Batching**: Process multiple requests together

## Q4: How do you ensure high availability?

**Answer:**
Multi-layer approach:

1. **Multi-AZ Deployment**: Instances across availability zones

2. **Health Checks**: Remove unhealthy instances

3. **Circuit Breakers**: Prevent cascade failures

4. **Failover**: Automatic routing to healthy regions

5. **Graceful Degradation**: Return cached/fallback responses

\`\`\`yaml
# Multi-region setup
regions:
  - us-east-1 (primary)
  - us-west-2 (secondary)
  - eu-west-1 (tertiary)
\`\`\`
  `,
  starterCode: `# Cloud Run deployment configuration
# TODO: Complete the deployment setup

# service.yaml equivalent (as Python dict for reference)
service_config = {
    "name": "ai-api",
    "image": "gcr.io/project/ai-api:latest",
    # TODO: Add resource limits
    # TODO: Add scaling configuration
    # TODO: Add environment variables with secrets
    # TODO: Add health check
}

# GitHub Actions workflow (as comments)
# TODO: Define CI/CD pipeline steps
# 1. Test
# 2. Build
# 3. Push
# 4. Deploy

# Monitoring (as comments)
# TODO: Define key metrics to track
# TODO: Define alerting rules
`,
  solutionCode: `# Cloud Run deployment configuration

# Service configuration
service_config = {
    "name": "ai-api",
    "image": "gcr.io/project/ai-api:latest",

    # Resource limits
    "resources": {
        "limits": {
            "memory": "2Gi",
            "cpu": "1"
        }
    },

    # Scaling configuration
    "scaling": {
        "minInstances": 1,  # Avoid cold starts
        "maxInstances": 10,  # Cost control
        "concurrency": 100  # Requests per instance
    },

    # Environment with secrets
    "env": [
        {"name": "LOG_LEVEL", "value": "info"},
        {"name": "OPENAI_API_KEY", "valueFrom": "secret:openai-key:latest"}
    ],

    # Health check
    "healthCheck": {
        "path": "/health",
        "initialDelaySeconds": 5,
        "periodSeconds": 30,
        "failureThreshold": 3
    }
}

# GitHub Actions workflow
github_workflow = """
name: Deploy AI API

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: pip install -r requirements.txt -r requirements-dev.txt
      - run: pytest tests/ -v

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: \${{ secrets.WIF_PROVIDER }}
          service_account: \${{ secrets.WIF_SERVICE_ACCOUNT }}
      - run: |
          gcloud builds submit --tag gcr.io/$PROJECT_ID/ai-api:$GITHUB_SHA
          gcloud run deploy ai-api \\
            --image gcr.io/$PROJECT_ID/ai-api:$GITHUB_SHA \\
            --region us-central1 \\
            --memory 2Gi --cpu 1 \\
            --min-instances 1 --max-instances 10 \\
            --set-secrets OPENAI_API_KEY=openai-key:latest
"""

# Key metrics to track
monitoring_config = {
    "metrics": [
        {"name": "request_latency_p99", "threshold": "2000ms"},
        {"name": "error_rate", "threshold": "1%"},
        {"name": "cpu_utilization", "threshold": "80%"},
        {"name": "memory_utilization", "threshold": "85%"},
        {"name": "request_count", "type": "counter"},
        {"name": "active_instances", "type": "gauge"}
    ],

    "alerts": [
        {
            "name": "HighErrorRate",
            "condition": "error_rate > 5% for 5 minutes",
            "severity": "critical",
            "notification": "slack:#alerts"
        },
        {
            "name": "HighLatency",
            "condition": "p99_latency > 5s for 10 minutes",
            "severity": "warning",
            "notification": "slack:#alerts"
        },
        {
            "name": "ScalingLimit",
            "condition": "instances == max_instances for 15 minutes",
            "severity": "warning",
            "notification": "slack:#alerts"
        }
    ]
}

print("Deployment configuration complete!")
print(f"Service: {service_config['name']}")
print(f"Scaling: {service_config['scaling']['minInstances']}-{service_config['scaling']['maxInstances']} instances")
print(f"Metrics tracked: {len(monitoring_config['metrics'])}")
print(f"Alerts configured: {len(monitoring_config['alerts'])}")
`,
  hints: [
    "Set minInstances to 1 or more to avoid cold start latency",
    "Use secret references instead of hardcoding API keys in configuration",
    "Configure health checks so the platform can detect and replace unhealthy instances",
    "Set resource limits to prevent runaway costs and ensure fair sharing",
    "Track error rate, latency (p99), and scaling metrics for alerting"
  ]
};
