import type { LessonContent } from '../types';

export const projectMonitoring: LessonContent = {
  slug: "project-monitoring",
  problemContent: `# Project: Build a Monitoring Dashboard

Create a complete monitoring system for LLM applications!

## Requirements

Build a system that:
1. Logs all LLM requests
2. Tracks key metrics
3. Detects anomalies
4. Generates reports

## Dashboard Metrics

\`\`\`
┌────────────────────────────────────────┐
│          LLM Monitoring Dashboard       │
├────────────────────────────────────────┤
│ Requests: 1,234    │ Errors: 12 (1%)   │
│ Avg Latency: 450ms │ P95: 1.2s         │
│ Total Cost: $45.67 │ Trend: ↑ 5%       │
├────────────────────────────────────────┤
│ Recent Alerts:                          │
│ ⚠ High latency detected (15:30)         │
│ ✓ Recovered (15:35)                     │
└────────────────────────────────────────┘
\`\`\`

## Your Task

Build the complete monitoring system.`,

  solutionContent: `# Solution: Monitoring Dashboard

\`\`\`python
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from typing import Optional
import statistics

@dataclass
class Request:
    id: str
    timestamp: datetime
    prompt: str
    response: str
    model: str
    latency_ms: float
    tokens: int
    cost: float
    success: bool
    error: Optional[str] = None

class LLMMonitor:
    def __init__(self):
        self.requests: list[Request] = []
        self.alerts: list[dict] = []
        self.thresholds = {
            "latency_p95_ms": 2000,
            "error_rate": 0.05,
            "cost_per_hour": 10.0
        }

    def log_request(self, request: Request):
        self.requests.append(request)
        self._check_alerts(request)

    def _check_alerts(self, request: Request):
        # Check latency
        if request.latency_ms > self.thresholds["latency_p95_ms"]:
            self._add_alert("HIGH_LATENCY", f"Latency {request.latency_ms}ms > threshold")

        # Check error rate
        recent = self._get_recent_requests(minutes=5)
        if recent:
            error_rate = sum(1 for r in recent if not r.success) / len(recent)
            if error_rate > self.thresholds["error_rate"]:
                self._add_alert("HIGH_ERROR_RATE", f"Error rate {error_rate:.1%}")

    def _add_alert(self, type: str, message: str):
        self.alerts.append({
            "type": type,
            "message": message,
            "timestamp": datetime.now().isoformat()
        })

    def _get_recent_requests(self, minutes: int = 60) -> list[Request]:
        cutoff = datetime.now() - timedelta(minutes=minutes)
        return [r for r in self.requests if r.timestamp > cutoff]

    def get_metrics(self, minutes: int = 60) -> dict:
        recent = self._get_recent_requests(minutes)
        if not recent:
            return {"error": "No data"}

        latencies = [r.latency_ms for r in recent]
        costs = [r.cost for r in recent]

        return {
            "period_minutes": minutes,
            "total_requests": len(recent),
            "successful": sum(1 for r in recent if r.success),
            "failed": sum(1 for r in recent if not r.success),
            "error_rate": f"{sum(1 for r in recent if not r.success) / len(recent):.1%}",
            "latency": {
                "avg_ms": round(statistics.mean(latencies), 1),
                "p50_ms": round(statistics.median(latencies), 1),
                "p95_ms": round(sorted(latencies)[int(len(latencies) * 0.95)], 1),
                "max_ms": round(max(latencies), 1)
            },
            "cost": {
                "total": round(sum(costs), 4),
                "avg": round(statistics.mean(costs), 6)
            },
            "models": self._model_breakdown(recent)
        }

    def _model_breakdown(self, requests: list[Request]) -> dict:
        breakdown = {}
        for r in requests:
            if r.model not in breakdown:
                breakdown[r.model] = {"count": 0, "cost": 0}
            breakdown[r.model]["count"] += 1
            breakdown[r.model]["cost"] += r.cost
        return breakdown

    def generate_report(self) -> str:
        metrics = self.get_metrics()

        report = f"""
╔══════════════════════════════════════════════╗
║          LLM MONITORING REPORT                ║
╠══════════════════════════════════════════════╣
║ Period: Last {metrics['period_minutes']} minutes
║
║ REQUESTS
║   Total: {metrics['total_requests']}
║   Success: {metrics['successful']} | Failed: {metrics['failed']}
║   Error Rate: {metrics['error_rate']}
║
║ LATENCY
║   Average: {metrics['latency']['avg_ms']}ms
║   P50: {metrics['latency']['p50_ms']}ms
║   P95: {metrics['latency']['p95_ms']}ms
║
║ COST
║   Total: \${metrics['cost']['total']}
║   Per Request: \${metrics['cost']['avg']:.6f}
║
║ ALERTS ({len(self.alerts)})
"""
        for alert in self.alerts[-5:]:
            report += f"║   ⚠ {alert['type']}: {alert['message']}\\n"

        report += "╚══════════════════════════════════════════════╝"
        return report

# Usage Demo
import random
import uuid

monitor = LLMMonitor()

# Simulate requests
for i in range(50):
    request = Request(
        id=str(uuid.uuid4())[:8],
        timestamp=datetime.now(),
        prompt=f"Test prompt {i}",
        response=f"Response {i}",
        model=random.choice(["gpt-4", "gpt-4o-mini"]),
        latency_ms=random.uniform(100, 3000),
        tokens=random.randint(50, 500),
        cost=random.uniform(0.001, 0.05),
        success=random.random() > 0.05
    )
    monitor.log_request(request)

print(monitor.generate_report())
\`\`\``,

  explanationContent: `# Monitoring System Architecture

## Components

\`\`\`
┌─────────────────────────────────────────┐
│              Application                 │
│    ┌─────────────────────────────┐      │
│    │     Instrumented LLM        │      │
│    │  (logs every request)       │      │
│    └──────────────┬──────────────┘      │
└───────────────────┼─────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│           Metrics Collector              │
│  • Latency  • Tokens  • Errors  • Cost  │
└───────────────────┬─────────────────────┘
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
   ┌─────────┐ ┌─────────┐ ┌─────────┐
   │ Storage │ │  Alerts │ │Dashboard│
   └─────────┘ └─────────┘ └─────────┘
\`\`\`

## Key Metrics

| Metric | Description | Alert When |
|--------|-------------|------------|
| Latency P95 | 95th percentile | > 2s |
| Error Rate | % failed | > 5% |
| Cost/Hour | Spend rate | > budget |
| Token Usage | Total tokens | > quota |`,

  realworldContent: `# Production Monitoring

## Tool Integration

\`\`\`python
# Langfuse
from langfuse import Langfuse
langfuse = Langfuse()

@langfuse.trace()
def my_llm_call(prompt):
    return llm.generate(prompt)

# Prometheus
from prometheus_client import Counter, Histogram

llm_requests = Counter('llm_requests_total', 'Total requests')
llm_latency = Histogram('llm_latency_seconds', 'Latency')

@llm_latency.time()
def my_llm_call(prompt):
    llm_requests.inc()
    return llm.generate(prompt)
\`\`\`

## Alerting Rules

\`\`\`yaml
alerts:
  - name: high_latency
    condition: p95_latency > 2000ms
    severity: warning

  - name: high_error_rate
    condition: error_rate > 5%
    severity: critical

  - name: cost_spike
    condition: hourly_cost > $50
    severity: warning
\`\`\``,

  mistakesContent: `# Common Monitoring Mistakes

## 1. Not Logging Enough

\`\`\`python
# Wrong - minimal logging
log.info("LLM called")

# Right - rich context
log.info("LLM called", {
    "model": model,
    "tokens": tokens,
    "latency_ms": latency,
    "cost": cost
})
\`\`\`

## 2. No Alerting

\`\`\`python
# Wrong - just collect metrics
metrics.record(latency)

# Right - alert on issues
if latency > threshold:
    alert.send("High latency detected")
\`\`\`

## 3. Too Many Alerts

\`\`\`python
# Wrong - alert on every issue
if latency > 100ms:
    alert()  # Constant noise!

# Right - meaningful thresholds
if p95_latency > 2000ms:  # Significant issue
    alert()
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: What metrics would you monitor for an LLM app?

**Answer:**
- **Latency**: avg, p50, p95, p99
- **Error rate**: % failed requests
- **Throughput**: requests/second
- **Cost**: $/request, $/day
- **Quality**: user feedback, evaluation scores

## Q2: How do you detect LLM quality degradation?

**Answer:**
1. Track evaluation scores over time
2. Monitor user feedback/ratings
3. A/B test against baseline
4. Automated quality checks on outputs
5. Alert on score drops

## Q3: What's in your monitoring dashboard?

**Answer:**
- Real-time request volume
- Latency percentiles
- Error rate trend
- Cost tracking
- Model usage breakdown
- Recent alerts
- Quality metrics`,

  starterCode: `from datetime import datetime
from dataclasses import dataclass
import statistics
import random

@dataclass
class Request:
    timestamp: datetime
    latency_ms: float
    tokens: int
    cost: float
    success: bool

class Monitor:
    def __init__(self):
        self.requests = []
        self.alerts = []

    def log(self, request: Request):
        # TODO: Add request and check for alerts
        pass

    def metrics(self) -> dict:
        # TODO: Calculate and return metrics
        pass

    def check_alerts(self, request: Request):
        # TODO: Check thresholds and add alerts
        pass

# Simulate
monitor = Monitor()
for i in range(20):
    req = Request(
        timestamp=datetime.now(),
        latency_ms=random.uniform(100, 2500),
        tokens=random.randint(50, 300),
        cost=random.uniform(0.001, 0.02),
        success=random.random() > 0.1
    )
    monitor.log(req)

print(monitor.metrics())`,

  solutionCode: `from datetime import datetime
from dataclasses import dataclass
import statistics
import random

@dataclass
class Request:
    timestamp: datetime
    latency_ms: float
    tokens: int
    cost: float
    success: bool

class Monitor:
    def __init__(self):
        self.requests = []
        self.alerts = []
        self.latency_threshold = 2000

    def log(self, request: Request):
        self.requests.append(request)
        self.check_alerts(request)

    def metrics(self) -> dict:
        if not self.requests:
            return {"error": "No data"}

        latencies = [r.latency_ms for r in self.requests]
        costs = [r.cost for r in self.requests]
        successes = [r.success for r in self.requests]

        sorted_lat = sorted(latencies)
        p95_idx = int(len(sorted_lat) * 0.95)

        return {
            "total_requests": len(self.requests),
            "success_rate": f"{sum(successes)/len(successes)*100:.1f}%",
            "latency": {
                "avg": round(statistics.mean(latencies), 1),
                "p50": round(statistics.median(latencies), 1),
                "p95": round(sorted_lat[p95_idx], 1),
            },
            "cost": {
                "total": round(sum(costs), 4),
                "avg": round(statistics.mean(costs), 6)
            },
            "alerts": len(self.alerts)
        }

    def check_alerts(self, request: Request):
        if request.latency_ms > self.latency_threshold:
            self.alerts.append({
                "type": "HIGH_LATENCY",
                "value": request.latency_ms,
                "time": request.timestamp.isoformat()
            })

        error_rate = sum(1 for r in self.requests[-10:] if not r.success) / min(10, len(self.requests))
        if error_rate > 0.2:
            self.alerts.append({
                "type": "HIGH_ERROR_RATE",
                "value": f"{error_rate:.1%}",
                "time": request.timestamp.isoformat()
            })

# Simulate
monitor = Monitor()
for i in range(20):
    req = Request(
        timestamp=datetime.now(),
        latency_ms=random.uniform(100, 2500),
        tokens=random.randint(50, 300),
        cost=random.uniform(0.001, 0.02),
        success=random.random() > 0.1
    )
    monitor.log(req)

print("=== Monitoring Report ===")
for key, value in monitor.metrics().items():
    print(f"{key}: {value}")

print(f"\\nRecent Alerts: {monitor.alerts[-3:]}")`,

  hints: [
    "Store requests in a list for aggregation",
    "Calculate p95 by sorting and taking 95th percentile index",
    "Check alerts after each request is logged",
    "Track alerts separately for reporting",
  ],
};
