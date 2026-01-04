import type { LessonContent } from '../types';

export const llmopsIntro: LessonContent = {
  slug: "llmops-intro",
  problemContent: `# LLMOps: Production AI Operations

LLMOps is **DevOps for LLM applications** - monitoring, evaluating, and optimizing AI in production.

## Why LLMOps?

| Development | Production |
|-------------|------------|
| "It works!" | "Is it reliable?" |
| Single user | Thousands of users |
| No cost concern | Budget matters |
| Manual testing | Automated monitoring |

## The LLMOps Stack

\`\`\`
┌─────────────────────────────────────┐
│           Observability             │
│  Logging │ Tracing │ Metrics        │
├─────────────────────────────────────┤
│           Evaluation                │
│  Quality │ Accuracy │ Safety        │
├─────────────────────────────────────┤
│           Optimization              │
│  Cost │ Latency │ Caching           │
├─────────────────────────────────────┤
│           Deployment                │
│  CI/CD │ A/B Testing │ Rollback     │
└─────────────────────────────────────┘
\`\`\`

## Key Metrics

| Metric | What it Measures |
|--------|-----------------|
| Latency | Response time |
| Throughput | Requests/second |
| Error Rate | Failed requests |
| Cost | $/request |
| Quality | Output accuracy |

## Your Task

Understand the LLMOps landscape.`,

  solutionContent: `# Solution: Basic LLMOps Setup

\`\`\`python
import time
import json
from datetime import datetime
from openai import OpenAI

client = OpenAI()

class LLMOpsLogger:
    """Simple LLMOps logging system."""

    def __init__(self):
        self.logs = []

    def log_request(self, request_id: str, prompt: str, response: str,
                    latency: float, tokens: int, cost: float):
        entry = {
            "timestamp": datetime.now().isoformat(),
            "request_id": request_id,
            "prompt_length": len(prompt),
            "response_length": len(response),
            "latency_ms": latency * 1000,
            "tokens": tokens,
            "cost": cost
        }
        self.logs.append(entry)
        return entry

    def get_metrics(self):
        if not self.logs:
            return {}

        latencies = [l["latency_ms"] for l in self.logs]
        costs = [l["cost"] for l in self.logs]

        return {
            "total_requests": len(self.logs),
            "avg_latency_ms": sum(latencies) / len(latencies),
            "p95_latency_ms": sorted(latencies)[int(len(latencies) * 0.95)],
            "total_cost": sum(costs),
            "avg_cost": sum(costs) / len(costs)
        }

# Usage
logger = LLMOpsLogger()

def monitored_completion(prompt: str, request_id: str = None):
    """Make LLM call with monitoring."""
    request_id = request_id or f"req_{int(time.time())}"

    start = time.time()
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )
    latency = time.time() - start

    # Extract metrics
    content = response.choices[0].message.content
    tokens = response.usage.total_tokens
    cost = tokens * 0.00001  # Approximate

    # Log
    logger.log_request(request_id, prompt, content, latency, tokens, cost)

    return content

# Run some requests
for i in range(5):
    monitored_completion(f"Say hello in a creative way #{i}")

# Get metrics
print(json.dumps(logger.get_metrics(), indent=2))
\`\`\``,

  explanationContent: `# LLMOps Fundamentals

## The Three Pillars

### 1. Observability
See what's happening:
- **Logs**: Raw request/response data
- **Metrics**: Aggregated statistics
- **Traces**: Request flow through system

### 2. Evaluation
Measure quality:
- **Accuracy**: Is output correct?
- **Relevance**: Is it useful?
- **Safety**: Is it appropriate?

### 3. Optimization
Improve performance:
- **Cost**: Reduce spend
- **Latency**: Faster responses
- **Quality**: Better outputs

## Key Tools

| Category | Tools |
|----------|-------|
| Observability | Langfuse, LangSmith, Helicone |
| Evaluation | RAGAS, DeepEval, Promptfoo |
| Optimization | Semantic caching, model routing |

## Production Checklist

- [ ] Logging all requests
- [ ] Tracking latency and errors
- [ ] Monitoring costs
- [ ] Evaluating quality
- [ ] Alerting on issues`,

  realworldContent: `# Real-World LLMOps

## Production Architecture

\`\`\`
User Request
     │
     ▼
┌─────────────────┐
│   Load Balancer │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌───────┐ ┌───────┐
│ API 1 │ │ API 2 │  ← Multiple instances
└───┬───┘ └───┬───┘
    │         │
    └────┬────┘
         │
    ┌────┴────┐
    │  Cache  │  ← Reduce LLM calls
    └────┬────┘
         │
    ┌────┴────┐
    │   LLM   │  ← OpenAI/Anthropic
    └────┬────┘
         │
    ┌────┴────┐
    │ Logger  │  ← Observability
    └─────────┘
\`\`\`

## Cost Breakdown (Example)

| Component | Cost/month |
|-----------|-----------|
| GPT-4 calls | $2,000 |
| Embeddings | $200 |
| Vector DB | $100 |
| Compute | $500 |
| **Total** | **$2,800** |`,

  mistakesContent: `# Common LLMOps Mistakes

## 1. No Logging

\`\`\`python
# Wrong - no visibility
response = client.chat.completions.create(...)
return response

# Right - log everything
response = client.chat.completions.create(...)
logger.log(prompt, response, latency, cost)
return response
\`\`\`

## 2. Ignoring Costs

\`\`\`python
# Wrong - no cost tracking
for item in large_dataset:
    gpt4_process(item)  # $$$$

# Right - track and limit
if daily_cost > budget:
    use_cheaper_model()
\`\`\`

## 3. No Fallbacks

\`\`\`python
# Wrong - single point of failure
response = openai.create(...)

# Right - fallback chain
try:
    response = openai.create(...)
except RateLimitError:
    response = anthropic.create(...)
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: What is LLMOps?

**Answer:** LLMOps is the practice of deploying, monitoring, and maintaining LLM applications in production. It covers:
- Observability (logging, tracing, metrics)
- Evaluation (quality, accuracy, safety)
- Optimization (cost, latency, caching)
- Deployment (CI/CD, A/B testing)

## Q2: How do you monitor LLM costs?

**Answer:**
1. Track tokens per request
2. Calculate cost per request
3. Aggregate by user/feature
4. Set budgets and alerts
5. Implement cost controls

## Q3: What metrics matter most?

**Answer:**
- **Latency**: User experience
- **Error rate**: Reliability
- **Cost**: Business viability
- **Quality**: User satisfaction`,

  starterCode: `import time
from datetime import datetime

# TODO: Create a simple metrics tracker
class MetricsTracker:
    def __init__(self):
        self.requests = []

    def record(self, latency, tokens, success):
        # TODO: Store the metrics
        pass

    def summary(self):
        # TODO: Return summary stats
        pass

# TODO: Wrap an LLM call with metrics
def tracked_call(prompt):
    # Record start time
    # Make the call (simulated)
    # Record metrics
    pass

# Test
tracker = MetricsTracker()
for i in range(10):
    tracked_call(f"Test prompt {i}")

print(tracker.summary())`,

  solutionCode: `import time
import random
from datetime import datetime

class MetricsTracker:
    def __init__(self):
        self.requests = []

    def record(self, latency, tokens, success):
        self.requests.append({
            "timestamp": datetime.now().isoformat(),
            "latency_ms": latency * 1000,
            "tokens": tokens,
            "success": success,
            "cost": tokens * 0.00001
        })

    def summary(self):
        if not self.requests:
            return "No requests recorded"

        latencies = [r["latency_ms"] for r in self.requests]
        costs = [r["cost"] for r in self.requests]
        successes = [r["success"] for r in self.requests]

        return {
            "total_requests": len(self.requests),
            "success_rate": sum(successes) / len(successes),
            "avg_latency_ms": round(sum(latencies) / len(latencies), 2),
            "min_latency_ms": round(min(latencies), 2),
            "max_latency_ms": round(max(latencies), 2),
            "total_cost": round(sum(costs), 4),
        }

tracker = MetricsTracker()

def tracked_call(prompt):
    start = time.time()

    # Simulated LLM call
    time.sleep(random.uniform(0.1, 0.5))
    tokens = random.randint(50, 200)
    success = random.random() > 0.1  # 90% success rate

    latency = time.time() - start
    tracker.record(latency, tokens, success)

    return f"Response to: {prompt}" if success else None

# Test
print("Making 10 tracked calls...\\n")
for i in range(10):
    tracked_call(f"Test prompt {i}")

print("Metrics Summary:")
for key, value in tracker.summary().items():
    print(f"  {key}: {value}")`,

  hints: [
    "Store each request as a dict with timestamp, latency, tokens, success",
    "Calculate summary stats from the list of requests",
    "Track time with time.time() before and after the call",
    "Cost is typically calculated from token count",
  ],
};
