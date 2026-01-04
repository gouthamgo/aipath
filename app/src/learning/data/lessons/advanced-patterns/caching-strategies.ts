import type { LessonContent } from '../types';

export const cachingStrategies: LessonContent = {
  slug: "caching-strategies",
  problemContent: `# Caching Strategies for LLM Applications

LLM API calls are expensive and slow. Smart caching can dramatically reduce costs and latency.

## Why Cache LLM Responses?

| Metric | Without Cache | With Cache |
|--------|---------------|------------|
| Latency | 500-2000ms | 1-10ms |
| Cost | $0.01-0.10/call | $0 (cached) |
| Rate Limits | Easy to hit | Avoided |

## Caching Strategies

1. **Exact Match**: Cache identical prompts
2. **Semantic Cache**: Cache similar meanings
3. **Prefix Cache**: Cache common prompt prefixes
4. **TTL-Based**: Expire after time period

## Your Task

Implement a caching layer for LLM responses with:
1. Exact match caching
2. TTL expiration
3. Cache statistics tracking`,

  solutionContent: `# Solution: LLM Response Caching

\`\`\`python
import hashlib
import time
from typing import Optional, Dict, Any
from dataclasses import dataclass, field

@dataclass
class CacheEntry:
    response: str
    created_at: float
    hits: int = 0

class LLMCache:
    """Simple TTL-based cache for LLM responses."""

    def __init__(self, ttl_seconds: int = 3600):
        self.cache: Dict[str, CacheEntry] = {}
        self.ttl = ttl_seconds
        self.stats = {"hits": 0, "misses": 0}

    def _hash_prompt(self, prompt: str, model: str = "default") -> str:
        content = f"{model}:{prompt}"
        return hashlib.sha256(content.encode()).hexdigest()

    def get(self, prompt: str, model: str = "default") -> Optional[str]:
        key = self._hash_prompt(prompt, model)
        entry = self.cache.get(key)

        if entry is None:
            self.stats["misses"] += 1
            return None

        # Check TTL
        if time.time() - entry.created_at > self.ttl:
            del self.cache[key]
            self.stats["misses"] += 1
            return None

        entry.hits += 1
        self.stats["hits"] += 1
        return entry.response

    def set(self, prompt: str, response: str, model: str = "default"):
        key = self._hash_prompt(prompt, model)
        self.cache[key] = CacheEntry(
            response=response,
            created_at=time.time()
        )

    def get_stats(self) -> Dict:
        total = self.stats["hits"] + self.stats["misses"]
        hit_rate = self.stats["hits"] / total if total > 0 else 0
        return {
            **self.stats,
            "hit_rate": hit_rate,
            "cache_size": len(self.cache)
        }

# Usage with OpenAI
from openai import OpenAI

client = OpenAI()
cache = LLMCache(ttl_seconds=3600)

def cached_completion(prompt: str, model: str = "gpt-4") -> str:
    # Check cache first
    cached = cache.get(prompt, model)
    if cached:
        print("Cache HIT")
        return cached

    print("Cache MISS - calling API")
    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}]
    )
    result = response.choices[0].message.content

    # Store in cache
    cache.set(prompt, result, model)
    return result

# Test
result1 = cached_completion("What is 2+2?")  # MISS
result2 = cached_completion("What is 2+2?")  # HIT
print(cache.get_stats())
\`\`\``,

  explanationContent: `# Understanding LLM Caching

## Cache Key Design

The cache key must uniquely identify a request:

\`\`\`python
def create_cache_key(
    prompt: str,
    model: str,
    temperature: float,
    system_prompt: str = ""
) -> str:
    # Include all parameters that affect output
    content = f"{model}:{temperature}:{system_prompt}:{prompt}"
    return hashlib.sha256(content.encode()).hexdigest()
\`\`\`

## Semantic Caching

For similar (not identical) prompts, use embeddings:

\`\`\`python
def semantic_cache_lookup(prompt: str, threshold: float = 0.95):
    prompt_embedding = get_embedding(prompt)

    for cached_prompt, cached_response in cache.items():
        similarity = cosine_similarity(
            prompt_embedding,
            cached_prompt.embedding
        )
        if similarity > threshold:
            return cached_response

    return None
\`\`\`

## Cache Invalidation

- **TTL**: Simple time-based expiration
- **LRU**: Remove least recently used
- **Size-based**: Limit total cache size
- **Manual**: Invalidate on content updates`,

  realworldContent: `# Production Caching with Redis

\`\`\`python
import redis
import json
from typing import Optional

class RedisLLMCache:
    """Production-ready Redis cache for LLM responses."""

    def __init__(self, redis_url: str, ttl: int = 3600):
        self.redis = redis.from_url(redis_url)
        self.ttl = ttl
        self.prefix = "llm_cache:"

    def get(self, prompt: str, model: str) -> Optional[dict]:
        key = self._make_key(prompt, model)
        data = self.redis.get(key)

        if data:
            return json.loads(data)
        return None

    def set(self, prompt: str, model: str, response: dict):
        key = self._make_key(prompt, model)
        self.redis.setex(key, self.ttl, json.dumps(response))

    def _make_key(self, prompt: str, model: str) -> str:
        hash_val = hashlib.sha256(
            f"{model}:{prompt}".encode()
        ).hexdigest()[:16]
        return f"{self.prefix}{hash_val}"
\`\`\``,

  mistakesContent: `# Common Caching Mistakes

## 1. Caching Non-Deterministic Outputs
**Wrong**: Cache responses with temperature > 0
**Right**: Only cache deterministic (temperature=0) responses

## 2. Ignoring Context
**Wrong**: Cache only based on user prompt
**Right**: Include system prompt, model, parameters in key

## 3. No Invalidation Strategy
**Wrong**: Cache forever
**Right**: Set appropriate TTL, implement cleanup

## 4. Caching Errors
**Wrong**: Cache error responses
**Right**: Only cache successful responses`,

  interviewContent: `# Interview Questions

## Q1: When should you NOT cache LLM responses?

**Answer**:
- Creative tasks needing variety
- Time-sensitive information
- Personalized responses
- High temperature outputs
- Streaming responses

## Q2: How do you handle cache stampedes?

**Answer**:
- Use locking/mutex for cache writes
- Implement request coalescing
- Add jitter to TTL
- Use probabilistic early expiration

## Q3: What's the difference between exact and semantic caching?

**Answer**:
- Exact: Hash match on full prompt
- Semantic: Embedding similarity match
- Exact is faster but less flexible
- Semantic catches paraphrases`,

  starterCode: `import hashlib
import time
from typing import Optional, Dict
from dataclasses import dataclass

@dataclass
class CacheEntry:
    response: str
    created_at: float
    hits: int = 0

class LLMCache:
    def __init__(self, ttl_seconds: int = 3600):
        self.cache: Dict[str, CacheEntry] = {}
        self.ttl = ttl_seconds
        self.stats = {"hits": 0, "misses": 0}

    def _hash_prompt(self, prompt: str, model: str) -> str:
        # TODO: Create unique hash key
        pass

    def get(self, prompt: str, model: str = "default") -> Optional[str]:
        # TODO: Return cached response or None
        pass

    def set(self, prompt: str, response: str, model: str = "default"):
        # TODO: Store response in cache
        pass

    def get_stats(self) -> Dict:
        # TODO: Return cache statistics
        pass

# Test
cache = LLMCache(ttl_seconds=60)
cache.set("Hello", "Hi there!", "gpt-4")
print(cache.get("Hello", "gpt-4"))
print(cache.get_stats())`,

  solutionCode: `import hashlib
import time
from typing import Optional, Dict
from dataclasses import dataclass

@dataclass
class CacheEntry:
    response: str
    created_at: float
    hits: int = 0

class LLMCache:
    """TTL-based cache for LLM responses."""

    def __init__(self, ttl_seconds: int = 3600):
        self.cache: Dict[str, CacheEntry] = {}
        self.ttl = ttl_seconds
        self.stats = {"hits": 0, "misses": 0}

    def _hash_prompt(self, prompt: str, model: str) -> str:
        """Create unique hash key from prompt and model."""
        content = f"{model}:{prompt}"
        return hashlib.sha256(content.encode()).hexdigest()

    def get(self, prompt: str, model: str = "default") -> Optional[str]:
        """Return cached response or None if not found/expired."""
        key = self._hash_prompt(prompt, model)
        entry = self.cache.get(key)

        if entry is None:
            self.stats["misses"] += 1
            return None

        # Check if expired
        if time.time() - entry.created_at > self.ttl:
            del self.cache[key]
            self.stats["misses"] += 1
            return None

        # Cache hit
        entry.hits += 1
        self.stats["hits"] += 1
        return entry.response

    def set(self, prompt: str, response: str, model: str = "default"):
        """Store response in cache."""
        key = self._hash_prompt(prompt, model)
        self.cache[key] = CacheEntry(
            response=response,
            created_at=time.time()
        )

    def get_stats(self) -> Dict:
        """Return cache statistics."""
        total = self.stats["hits"] + self.stats["misses"]
        hit_rate = self.stats["hits"] / total if total > 0 else 0
        return {
            "hits": self.stats["hits"],
            "misses": self.stats["misses"],
            "hit_rate": round(hit_rate, 2),
            "cache_size": len(self.cache)
        }

    def clear_expired(self):
        """Remove expired entries."""
        now = time.time()
        expired = [
            k for k, v in self.cache.items()
            if now - v.created_at > self.ttl
        ]
        for key in expired:
            del self.cache[key]

# Test
cache = LLMCache(ttl_seconds=60)
cache.set("Hello", "Hi there!", "gpt-4")
cache.set("What is AI?", "Artificial Intelligence...", "gpt-4")

print(cache.get("Hello", "gpt-4"))  # Hit
print(cache.get("Hello", "gpt-4"))  # Hit
print(cache.get("Unknown", "gpt-4"))  # Miss
print(cache.get_stats())`,

  hints: [
    "Use hashlib.sha256 to create deterministic cache keys",
    "Include model name in the cache key",
    "Check TTL expiration in the get method",
    "Track hits and misses for monitoring",
    "Consider using dataclasses for cache entries"
  ]
};
