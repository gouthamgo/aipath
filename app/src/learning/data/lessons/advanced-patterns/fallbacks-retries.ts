import type { LessonContent } from '../types';

export const fallbacksRetries: LessonContent = {
  slug: "fallbacks-retries",
  problemContent: `# Fallbacks & Retries for AI Applications

Production AI systems must handle failures gracefully. Learn to build resilient applications.

## Common Failure Modes

| Failure | Cause | Solution |
|---------|-------|----------|
| Rate Limit | Too many requests | Exponential backoff |
| Timeout | Slow response | Retry with longer timeout |
| API Error | Service issue | Fallback to backup |
| Bad Response | Model failure | Retry or fallback |

## Resilience Strategies

1. **Retry with backoff**: Try again after waiting
2. **Fallback models**: Use backup LLM
3. **Circuit breaker**: Stop calling failing service
4. **Graceful degradation**: Provide limited functionality

## Your Task

Implement a robust LLM client with retries and fallbacks.`,

  solutionContent: `# Solution: Resilient LLM Client

\`\`\`python
import time
import random
from typing import Optional, List
from openai import OpenAI, RateLimitError, APIError

class ResilientLLM:
    """LLM client with retries and fallbacks."""

    def __init__(
        self,
        primary_model: str = "gpt-4",
        fallback_models: List[str] = None,
        max_retries: int = 3,
        base_delay: float = 1.0
    ):
        self.client = OpenAI()
        self.primary_model = primary_model
        self.fallback_models = fallback_models or ["gpt-3.5-turbo"]
        self.max_retries = max_retries
        self.base_delay = base_delay

    def _exponential_backoff(self, attempt: int) -> float:
        """Calculate delay with jitter."""
        delay = self.base_delay * (2 ** attempt)
        jitter = random.uniform(0, delay * 0.1)
        return delay + jitter

    def _call_with_retry(self, model: str, messages: list) -> Optional[str]:
        """Try calling a model with retries."""
        for attempt in range(self.max_retries):
            try:
                response = self.client.chat.completions.create(
                    model=model,
                    messages=messages
                )
                return response.choices[0].message.content

            except RateLimitError:
                if attempt < self.max_retries - 1:
                    delay = self._exponential_backoff(attempt)
                    print(f"Rate limited. Waiting {delay:.1f}s...")
                    time.sleep(delay)
                else:
                    raise

            except APIError as e:
                if attempt < self.max_retries - 1:
                    print(f"API error: {e}. Retrying...")
                    time.sleep(self.base_delay)
                else:
                    raise

        return None

    def complete(self, prompt: str, system: str = None) -> str:
        """Get completion with automatic fallback."""
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": prompt})

        # Try primary model
        try:
            result = self._call_with_retry(self.primary_model, messages)
            if result:
                return result
        except Exception as e:
            print(f"Primary model failed: {e}")

        # Try fallback models
        for fallback in self.fallback_models:
            try:
                print(f"Trying fallback: {fallback}")
                result = self._call_with_retry(fallback, messages)
                if result:
                    return result
            except Exception as e:
                print(f"Fallback {fallback} failed: {e}")

        raise Exception("All models failed")

# Usage
llm = ResilientLLM(
    primary_model="gpt-4",
    fallback_models=["gpt-3.5-turbo", "gpt-3.5-turbo-16k"]
)

response = llm.complete("What is the capital of France?")
print(response)
\`\`\``,

  explanationContent: `# Understanding Resilience Patterns

## Exponential Backoff

Each retry waits longer:
- Attempt 1: 1 second
- Attempt 2: 2 seconds
- Attempt 3: 4 seconds
- Attempt 4: 8 seconds

\`\`\`python
delay = base_delay * (2 ** attempt)
\`\`\`

Add jitter to prevent thundering herd:
\`\`\`python
jitter = random.uniform(0, delay * 0.1)
\`\`\`

## Circuit Breaker Pattern

Stop calling a failing service:

\`\`\`python
class CircuitBreaker:
    def __init__(self, failure_threshold=5, reset_timeout=60):
        self.failures = 0
        self.threshold = failure_threshold
        self.reset_timeout = reset_timeout
        self.last_failure = 0
        self.state = "closed"

    def can_proceed(self) -> bool:
        if self.state == "open":
            if time.time() - self.last_failure > self.reset_timeout:
                self.state = "half-open"
                return True
            return False
        return True

    def record_success(self):
        self.failures = 0
        self.state = "closed"

    def record_failure(self):
        self.failures += 1
        self.last_failure = time.time()
        if self.failures >= self.threshold:
            self.state = "open"
\`\`\``,

  realworldContent: `# Production Patterns

## Using tenacity Library

\`\`\`python
from tenacity import (
    retry,
    stop_after_attempt,
    wait_exponential,
    retry_if_exception_type
)
from openai import RateLimitError, APIError

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=1, max=60),
    retry=retry_if_exception_type((RateLimitError, APIError))
)
def call_llm(prompt: str) -> str:
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content
\`\`\`

## Multi-Provider Fallback

\`\`\`python
providers = [
    {"name": "openai", "client": OpenAI()},
    {"name": "anthropic", "client": Anthropic()},
]

def call_with_fallback(prompt: str):
    for provider in providers:
        try:
            return call_provider(provider, prompt)
        except Exception as e:
            print(f"{provider['name']} failed: {e}")

    raise Exception("All providers failed")
\`\`\``,

  mistakesContent: `# Common Resilience Mistakes

## 1. Retry Without Backoff
**Wrong**: Immediate retries
**Right**: Exponential backoff with jitter

## 2. Infinite Retries
**Wrong**: Retry forever
**Right**: Set max attempts, then fail

## 3. Retrying All Errors
**Wrong**: Retry 404, 401, etc.
**Right**: Only retry transient errors (429, 500, 503)

## 4. No Timeout
**Wrong**: Wait indefinitely
**Right**: Set request timeouts`,

  interviewContent: `# Interview Questions

## Q1: How do you handle rate limits?

**Answer**:
- Implement exponential backoff
- Add jitter to prevent thundering herd
- Track rate limit headers
- Consider request queuing
- Fall back to slower tier

## Q2: What's a circuit breaker?

**Answer**:
- Pattern to fail fast when service is down
- Three states: closed, open, half-open
- Prevents cascade failures
- Allows recovery time

## Q3: How do you choose fallback models?

**Answer**:
- Balance quality vs availability
- Consider latency differences
- Test fallback quality for your use case
- Monitor fallback usage rate`,

  starterCode: `import time
import random
from typing import Optional, List

class ResilientLLM:
    def __init__(
        self,
        primary_model: str = "gpt-4",
        fallback_models: List[str] = None,
        max_retries: int = 3
    ):
        self.primary_model = primary_model
        self.fallback_models = fallback_models or ["gpt-3.5-turbo"]
        self.max_retries = max_retries

    def _exponential_backoff(self, attempt: int) -> float:
        # TODO: Calculate delay with jitter
        pass

    def _call_with_retry(self, model: str, prompt: str) -> Optional[str]:
        # TODO: Implement retry logic
        pass

    def complete(self, prompt: str) -> str:
        # TODO: Try primary, then fallbacks
        pass

# Test
llm = ResilientLLM()
response = llm.complete("Hello!")
print(response)`,

  solutionCode: `import time
import random
from typing import Optional, List

class ResilientLLM:
    def __init__(
        self,
        primary_model: str = "gpt-4",
        fallback_models: List[str] = None,
        max_retries: int = 3,
        base_delay: float = 1.0
    ):
        self.primary_model = primary_model
        self.fallback_models = fallback_models or ["gpt-3.5-turbo"]
        self.max_retries = max_retries
        self.base_delay = base_delay

    def _exponential_backoff(self, attempt: int) -> float:
        """Calculate delay with jitter."""
        delay = self.base_delay * (2 ** attempt)
        jitter = random.uniform(0, delay * 0.1)
        return delay + jitter

    def _call_with_retry(self, model: str, prompt: str) -> Optional[str]:
        """Try calling model with retries."""
        for attempt in range(self.max_retries):
            try:
                # Simulated API call
                if random.random() < 0.3:  # 30% failure rate
                    raise Exception("Simulated API error")
                return f"Response from {model}: {prompt[:20]}..."
            except Exception as e:
                if attempt < self.max_retries - 1:
                    delay = self._exponential_backoff(attempt)
                    print(f"Attempt {attempt + 1} failed. Waiting {delay:.1f}s...")
                    time.sleep(delay)
                else:
                    return None
        return None

    def complete(self, prompt: str) -> str:
        """Get completion with automatic fallback."""
        # Try primary model
        result = self._call_with_retry(self.primary_model, prompt)
        if result:
            return result

        # Try fallback models
        for fallback in self.fallback_models:
            print(f"Trying fallback: {fallback}")
            result = self._call_with_retry(fallback, prompt)
            if result:
                return result

        raise Exception("All models failed")

# Test
llm = ResilientLLM()
try:
    response = llm.complete("What is machine learning?")
    print(f"Success: {response}")
except Exception as e:
    print(f"Failed: {e}")`,

  hints: [
    "Use 2^attempt for exponential backoff",
    "Add random jitter to prevent synchronized retries",
    "Return None from _call_with_retry on failure",
    "Loop through fallback models until one succeeds",
    "Raise exception only when all models fail"
  ]
};
