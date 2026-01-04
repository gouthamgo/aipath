import type { LessonContent } from '../types';

export const projectProductionApp: LessonContent = {
  slug: "project-production-app",
  problemContent: `# Project: Production AI Application

Build a production-ready AI application combining all advanced patterns.

## Requirements

1. **Caching**: Cache responses to reduce costs
2. **Streaming**: Real-time response display
3. **Resilience**: Retries and fallbacks
4. **Rate Limiting**: Protect against abuse
5. **Monitoring**: Track metrics and errors

## Architecture

\`\`\`
┌─────────────────────────────────────────────────────────┐
│                    FastAPI Application                   │
├─────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │   Rate   │  │  Cache   │  │ Resilient │  │ Monitor │ │
│  │ Limiter  │  │  Layer   │  │   LLM     │  │  Layer  │ │
│  └────┬─────┘  └────┬─────┘  └─────┬─────┘  └────┬────┘ │
│       │             │              │              │      │
│       └─────────────┴──────────────┴──────────────┘      │
│                          │                                │
│                    ┌─────▼─────┐                         │
│                    │ OpenAI API │                        │
│                    └───────────┘                         │
└─────────────────────────────────────────────────────────┘
\`\`\`

## Your Task

Combine all patterns into one production application.`,

  solutionContent: `# Solution: Production AI Application

This solution integrates all patterns into a cohesive application.

## Key Components

1. **RateLimiter**: Token bucket per user
2. **LLMCache**: TTL-based response caching
3. **ResilientLLM**: Retries with exponential backoff
4. **MetricsCollector**: Request/response tracking
5. **FastAPI App**: REST API with streaming support`,

  explanationContent: `# Architecture Deep Dive

## Request Flow

1. Request arrives at FastAPI
2. Rate limiter checks user quota
3. Cache lookup for existing response
4. If miss, call resilient LLM
5. Stream response to client
6. Store in cache
7. Record metrics

## Component Interaction

\`\`\`python
async def handle_request(user_id: str, prompt: str):
    # 1. Rate limiting
    if not rate_limiter.is_allowed(user_id):
        raise HTTPException(429, "Rate limited")

    # 2. Check cache
    cached = cache.get(prompt)
    if cached:
        metrics.record_cache_hit()
        return cached

    # 3. Call LLM with resilience
    try:
        response = await llm.complete(prompt)
    except Exception as e:
        metrics.record_error(str(e))
        raise

    # 4. Cache and return
    cache.set(prompt, response)
    metrics.record_success()
    return response
\`\`\``,

  realworldContent: `# Production Deployment

## Environment Configuration

\`\`\`python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    openai_api_key: str
    redis_url: str = "redis://localhost:6379"
    rate_limit_per_minute: int = 60
    cache_ttl_seconds: int = 3600

    class Config:
        env_file = ".env"

settings = Settings()
\`\`\`

## Health Checks

\`\`\`python
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "cache_size": cache.size(),
        "requests_today": metrics.get_daily_count(),
        "error_rate": metrics.get_error_rate()
    }
\`\`\`

## Docker Deployment

\`\`\`dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
\`\`\``,

  mistakesContent: `# Project Mistakes to Avoid

## 1. Monolithic Design
**Wrong**: Everything in one file
**Right**: Separate concerns into modules

## 2. No Configuration
**Wrong**: Hardcoded values
**Right**: Environment-based config

## 3. Missing Error Handling
**Wrong**: Let errors propagate
**Right**: Catch, log, return appropriate response

## 4. No Graceful Shutdown
**Wrong**: Kill process immediately
**Right**: Drain connections, cleanup resources`,

  interviewContent: `# Interview Discussion

## Q1: Walk through your architecture

**Answer**:
- FastAPI for async HTTP handling
- Rate limiter as first middleware layer
- Cache layer before LLM calls
- Resilient LLM with retries and fallbacks
- Metrics collection throughout
- Structured error responses

## Q2: How do you handle high load?

**Answer**:
- Horizontal scaling with load balancer
- Redis for distributed rate limiting and caching
- Queue long-running requests
- Circuit breaker for failing backends
- Auto-scaling based on metrics

## Q3: How do you debug production issues?

**Answer**:
- Structured logging with request IDs
- Distributed tracing
- Error alerting
- Metrics dashboards
- Log aggregation (ELK, Datadog)`,

  starterCode: `import time
import hashlib
from typing import Optional, Dict
from dataclasses import dataclass, field

# ============================================
# Rate Limiter
# ============================================

@dataclass
class TokenBucket:
    capacity: int
    tokens: float
    refill_rate: float
    last_refill: float

class RateLimiter:
    def __init__(self, rpm: int = 60):
        self.buckets: Dict[str, TokenBucket] = {}
        self.rpm = rpm

    def is_allowed(self, key: str) -> bool:
        # TODO: Implement token bucket
        pass

# ============================================
# Cache
# ============================================

@dataclass
class CacheEntry:
    response: str
    created_at: float

class LLMCache:
    def __init__(self, ttl: int = 3600):
        self.cache: Dict[str, CacheEntry] = {}
        self.ttl = ttl

    def get(self, prompt: str) -> Optional[str]:
        # TODO: Implement cache get
        pass

    def set(self, prompt: str, response: str):
        # TODO: Implement cache set
        pass

# ============================================
# Resilient LLM
# ============================================

class ResilientLLM:
    def __init__(self, max_retries: int = 3):
        self.max_retries = max_retries

    def complete(self, prompt: str) -> str:
        # TODO: Implement with retries
        pass

# ============================================
# Production App
# ============================================

class ProductionApp:
    def __init__(self):
        self.rate_limiter = RateLimiter()
        self.cache = LLMCache()
        self.llm = ResilientLLM()
        self.stats = {"requests": 0, "cache_hits": 0}

    def handle_request(self, user_id: str, prompt: str) -> str:
        # TODO: Combine all components
        pass

# Test
app = ProductionApp()
print(app.handle_request("user1", "Hello!"))`,

  solutionCode: `import time
import hashlib
import random
from typing import Optional, Dict
from dataclasses import dataclass, field

# ============================================
# Rate Limiter
# ============================================

@dataclass
class TokenBucket:
    capacity: int
    tokens: float
    refill_rate: float
    last_refill: float

class RateLimiter:
    def __init__(self, rpm: int = 60):
        self.buckets: Dict[str, TokenBucket] = {}
        self.refill_rate = rpm / 60
        self.capacity = 10

    def is_allowed(self, key: str) -> bool:
        if key not in self.buckets:
            self.buckets[key] = TokenBucket(
                capacity=self.capacity,
                tokens=self.capacity,
                refill_rate=self.refill_rate,
                last_refill=time.time()
            )

        bucket = self.buckets[key]
        now = time.time()
        elapsed = now - bucket.last_refill
        bucket.tokens = min(
            bucket.capacity,
            bucket.tokens + elapsed * bucket.refill_rate
        )
        bucket.last_refill = now

        if bucket.tokens >= 1:
            bucket.tokens -= 1
            return True
        return False

# ============================================
# Cache
# ============================================

@dataclass
class CacheEntry:
    response: str
    created_at: float

class LLMCache:
    def __init__(self, ttl: int = 3600):
        self.cache: Dict[str, CacheEntry] = {}
        self.ttl = ttl

    def _hash(self, prompt: str) -> str:
        return hashlib.sha256(prompt.encode()).hexdigest()

    def get(self, prompt: str) -> Optional[str]:
        key = self._hash(prompt)
        entry = self.cache.get(key)

        if entry is None:
            return None

        if time.time() - entry.created_at > self.ttl:
            del self.cache[key]
            return None

        return entry.response

    def set(self, prompt: str, response: str):
        key = self._hash(prompt)
        self.cache[key] = CacheEntry(
            response=response,
            created_at=time.time()
        )

# ============================================
# Resilient LLM
# ============================================

class ResilientLLM:
    def __init__(self, max_retries: int = 3):
        self.max_retries = max_retries

    def _call_api(self, prompt: str) -> str:
        # Simulate API with 20% failure rate
        if random.random() < 0.2:
            raise Exception("API Error")
        return f"Response to: {prompt[:50]}..."

    def complete(self, prompt: str) -> str:
        for attempt in range(self.max_retries):
            try:
                return self._call_api(prompt)
            except Exception as e:
                if attempt < self.max_retries - 1:
                    delay = (2 ** attempt) + random.uniform(0, 0.5)
                    print(f"Retry {attempt + 1} after {delay:.1f}s")
                    time.sleep(delay)
                else:
                    raise Exception(f"All {self.max_retries} retries failed")
        raise Exception("Unexpected error")

# ============================================
# Metrics
# ============================================

class Metrics:
    def __init__(self):
        self.data = {
            "requests": 0,
            "cache_hits": 0,
            "errors": 0,
            "latencies": []
        }

    def record_request(self, cached: bool, latency: float):
        self.data["requests"] += 1
        if cached:
            self.data["cache_hits"] += 1
        self.data["latencies"].append(latency)

    def record_error(self):
        self.data["errors"] += 1

    def get_stats(self) -> Dict:
        total = self.data["requests"]
        return {
            "total_requests": total,
            "cache_hit_rate": self.data["cache_hits"] / total if total else 0,
            "error_rate": self.data["errors"] / total if total else 0,
            "avg_latency": sum(self.data["latencies"]) / len(self.data["latencies"]) if self.data["latencies"] else 0
        }

# ============================================
# Production App
# ============================================

class ProductionApp:
    def __init__(self):
        self.rate_limiter = RateLimiter(rpm=30)
        self.cache = LLMCache(ttl=3600)
        self.llm = ResilientLLM(max_retries=3)
        self.metrics = Metrics()

    def handle_request(self, user_id: str, prompt: str) -> Dict:
        start = time.time()

        # Rate limiting
        if not self.rate_limiter.is_allowed(user_id):
            return {"error": "Rate limited", "retry_after": 2}

        # Check cache
        cached_response = self.cache.get(prompt)
        if cached_response:
            latency = time.time() - start
            self.metrics.record_request(cached=True, latency=latency)
            return {
                "response": cached_response,
                "cached": True,
                "latency_ms": latency * 1000
            }

        # Call LLM
        try:
            response = self.llm.complete(prompt)
            self.cache.set(prompt, response)
            latency = time.time() - start
            self.metrics.record_request(cached=False, latency=latency)
            return {
                "response": response,
                "cached": False,
                "latency_ms": latency * 1000
            }
        except Exception as e:
            self.metrics.record_error()
            return {"error": str(e)}

    def get_metrics(self) -> Dict:
        return self.metrics.get_stats()

# ============================================
# Test
# ============================================

def test_app():
    print("=== Production App Demo ===\\n")

    app = ProductionApp()

    # Test requests
    prompts = [
        "What is machine learning?",
        "Explain neural networks",
        "What is machine learning?",  # Should hit cache
    ]

    for i, prompt in enumerate(prompts):
        print(f"Request {i+1}: {prompt[:30]}...")
        result = app.handle_request("user1", prompt)

        if "error" in result:
            print(f"  Error: {result['error']}")
        else:
            print(f"  Cached: {result['cached']}")
            print(f"  Latency: {result['latency_ms']:.0f}ms")
        print()

    # Rate limit test
    print("Rate limit test (rapid requests):")
    for i in range(15):
        result = app.handle_request("user2", f"Quick request {i}")
        status = "OK" if "response" in result else "RATE LIMITED"
        print(f"  Request {i+1}: {status}")

    print(f"\\nMetrics: {app.get_metrics()}")

if __name__ == "__main__":
    test_app()`,

  hints: [
    "Build each component (cache, rate limiter, LLM) separately first",
    "Combine them in handle_request in the right order",
    "Check rate limit first, then cache, then LLM",
    "Track metrics for all request outcomes",
    "Return structured response with metadata"
  ]
};
