import type { LessonContent } from '../types';

export const rateLimiting: LessonContent = {
  slug: "rate-limiting",
  problemContent: `# Rate Limiting for AI Applications

Protect your AI application from abuse and manage costs with rate limiting.

## Why Rate Limit?

1. **Cost Control**: Prevent runaway API costs
2. **Fair Usage**: Share resources among users
3. **Protection**: Prevent abuse and attacks
4. **Stability**: Avoid overwhelming backends

## Rate Limiting Strategies

| Strategy | Description |
|----------|-------------|
| Token Bucket | Steady rate with bursts |
| Sliding Window | Rolling time window |
| Fixed Window | Reset at intervals |
| Leaky Bucket | Constant output rate |

## Your Task

Implement rate limiting for an AI API.`,

  solutionContent: `# Solution: Token Bucket Rate Limiter

\`\`\`python
import time
from dataclasses import dataclass
from typing import Dict

@dataclass
class TokenBucket:
    capacity: int
    tokens: float
    refill_rate: float  # tokens per second
    last_refill: float

class RateLimiter:
    """Token bucket rate limiter."""

    def __init__(
        self,
        requests_per_minute: int = 60,
        burst_capacity: int = 10
    ):
        self.refill_rate = requests_per_minute / 60  # per second
        self.capacity = burst_capacity
        self.buckets: Dict[str, TokenBucket] = {}

    def _get_bucket(self, key: str) -> TokenBucket:
        if key not in self.buckets:
            self.buckets[key] = TokenBucket(
                capacity=self.capacity,
                tokens=self.capacity,
                refill_rate=self.refill_rate,
                last_refill=time.time()
            )
        return self.buckets[key]

    def _refill(self, bucket: TokenBucket):
        now = time.time()
        elapsed = now - bucket.last_refill
        tokens_to_add = elapsed * bucket.refill_rate
        bucket.tokens = min(bucket.capacity, bucket.tokens + tokens_to_add)
        bucket.last_refill = now

    def is_allowed(self, key: str) -> bool:
        """Check if request is allowed."""
        bucket = self._get_bucket(key)
        self._refill(bucket)

        if bucket.tokens >= 1:
            bucket.tokens -= 1
            return True
        return False

    def wait_time(self, key: str) -> float:
        """Get seconds until next request allowed."""
        bucket = self._get_bucket(key)
        self._refill(bucket)

        if bucket.tokens >= 1:
            return 0

        tokens_needed = 1 - bucket.tokens
        return tokens_needed / bucket.refill_rate

# Usage
limiter = RateLimiter(requests_per_minute=30)

for i in range(35):
    user_id = "user_123"

    if limiter.is_allowed(user_id):
        print(f"Request {i+1}: Allowed")
    else:
        wait = limiter.wait_time(user_id)
        print(f"Request {i+1}: Rate limited. Wait {wait:.1f}s")
\`\`\``,

  explanationContent: `# Understanding Rate Limiting

## Token Bucket Algorithm

\`\`\`
┌─────────────────────┐
│  Bucket (capacity)  │
│  ┌───┐ ┌───┐ ┌───┐  │
│  │ T │ │ T │ │ T │  │ ◄── Tokens
│  └───┘ └───┘ └───┘  │
└──────────┬──────────┘
           │
           ▼
    Request consumes 1 token
           │
           ▼
    Bucket refills at constant rate
\`\`\`

## Sliding Window

Counts requests in rolling time window:

\`\`\`python
class SlidingWindow:
    def __init__(self, limit: int, window_seconds: int):
        self.limit = limit
        self.window = window_seconds
        self.requests: Dict[str, list] = {}

    def is_allowed(self, key: str) -> bool:
        now = time.time()
        cutoff = now - self.window

        if key not in self.requests:
            self.requests[key] = []

        # Remove old requests
        self.requests[key] = [
            t for t in self.requests[key]
            if t > cutoff
        ]

        if len(self.requests[key]) < self.limit:
            self.requests[key].append(now)
            return True

        return False
\`\`\``,

  realworldContent: `# Production Rate Limiting

## Redis-Based Limiter

\`\`\`python
import redis
import time

class RedisRateLimiter:
    def __init__(self, redis_url: str, limit: int, window: int):
        self.redis = redis.from_url(redis_url)
        self.limit = limit
        self.window = window

    def is_allowed(self, key: str) -> bool:
        now = int(time.time())
        window_key = f"ratelimit:{key}:{now // self.window}"

        pipe = self.redis.pipeline()
        pipe.incr(window_key)
        pipe.expire(window_key, self.window)
        count, _ = pipe.execute()

        return count <= self.limit
\`\`\`

## FastAPI Integration

\`\`\`python
from fastapi import FastAPI, HTTPException, Request

app = FastAPI()
limiter = RateLimiter(requests_per_minute=30)

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    client_ip = request.client.host

    if not limiter.is_allowed(client_ip):
        raise HTTPException(
            status_code=429,
            detail="Too many requests"
        )

    return await call_next(request)
\`\`\``,

  mistakesContent: `# Common Rate Limiting Mistakes

## 1. Client-Side Only
**Wrong**: Rate limit only on client
**Right**: Enforce on server side

## 2. Single Global Limit
**Wrong**: One limit for all users
**Right**: Per-user or per-API-key limits

## 3. No Feedback
**Wrong**: Silent rejection
**Right**: Return retry-after header

## 4. Not Counting Failures
**Wrong**: Only count successful requests
**Right**: Count all requests (prevents abuse)`,

  interviewContent: `# Interview Questions

## Q1: Token Bucket vs Sliding Window?

**Answer**:
- Token Bucket: Allows bursts, steady average rate
- Sliding Window: Strict limit, no bursts
- Token Bucket better for API usage
- Sliding Window better for strict quotas

## Q2: How do you handle distributed rate limiting?

**Answer**:
- Use centralized store (Redis)
- Consider eventual consistency
- Use sliding window for accuracy
- Handle Redis failures gracefully

## Q3: What headers should you return?

**Answer**:
- X-RateLimit-Limit: Max requests
- X-RateLimit-Remaining: Requests left
- X-RateLimit-Reset: When limit resets
- Retry-After: Seconds to wait (on 429)`,

  starterCode: `import time
from dataclasses import dataclass
from typing import Dict

@dataclass
class TokenBucket:
    capacity: int
    tokens: float
    refill_rate: float
    last_refill: float

class RateLimiter:
    def __init__(self, requests_per_minute: int = 60):
        self.refill_rate = requests_per_minute / 60
        self.capacity = 10
        self.buckets: Dict[str, TokenBucket] = {}

    def _get_bucket(self, key: str) -> TokenBucket:
        # TODO: Get or create bucket for key
        pass

    def _refill(self, bucket: TokenBucket):
        # TODO: Add tokens based on time elapsed
        pass

    def is_allowed(self, key: str) -> bool:
        # TODO: Check if request allowed
        pass

# Test
limiter = RateLimiter(requests_per_minute=30)
for i in range(5):
    print(f"Request {i+1}: {limiter.is_allowed('user1')}")`,

  solutionCode: `import time
from dataclasses import dataclass
from typing import Dict

@dataclass
class TokenBucket:
    capacity: int
    tokens: float
    refill_rate: float
    last_refill: float

class RateLimiter:
    def __init__(self, requests_per_minute: int = 60):
        self.refill_rate = requests_per_minute / 60
        self.capacity = 10
        self.buckets: Dict[str, TokenBucket] = {}

    def _get_bucket(self, key: str) -> TokenBucket:
        if key not in self.buckets:
            self.buckets[key] = TokenBucket(
                capacity=self.capacity,
                tokens=self.capacity,
                refill_rate=self.refill_rate,
                last_refill=time.time()
            )
        return self.buckets[key]

    def _refill(self, bucket: TokenBucket):
        now = time.time()
        elapsed = now - bucket.last_refill
        tokens_to_add = elapsed * bucket.refill_rate
        bucket.tokens = min(bucket.capacity, bucket.tokens + tokens_to_add)
        bucket.last_refill = now

    def is_allowed(self, key: str) -> bool:
        bucket = self._get_bucket(key)
        self._refill(bucket)

        if bucket.tokens >= 1:
            bucket.tokens -= 1
            return True
        return False

# Test
limiter = RateLimiter(requests_per_minute=30)
for i in range(5):
    result = limiter.is_allowed("user1")
    print(f"Request {i+1}: {'Allowed' if result else 'Denied'}")`,

  hints: [
    "Store buckets in a dictionary keyed by user/API key",
    "Calculate tokens to add based on elapsed time",
    "Cap tokens at bucket capacity",
    "Subtract 1 token per allowed request",
    "Return False when tokens < 1"
  ]
};
