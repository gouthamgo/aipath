import type { LessonContent } from '../types';

export const errorHandlingApi: LessonContent = {
  slug: "error-handling-api",
  problemContent: `# Error Handling for APIs

APIs fail. Handle it gracefully!

## Common OpenAI Errors

\`\`\`python
from openai import (
    APIError,
    RateLimitError,
    APIConnectionError,
    AuthenticationError
)

try:
    response = client.chat.completions.create(...)
except RateLimitError:
    print("Rate limited! Wait and retry.")
except AuthenticationError:
    print("Invalid API key!")
except APIConnectionError:
    print("Network issue, try again.")
except APIError as e:
    print(f"API error: {e}")
\`\`\`

## Retry with Exponential Backoff

\`\`\`python
import time

def retry_with_backoff(func, max_retries=3):
    for attempt in range(max_retries):
        try:
            return func()
        except RateLimitError:
            wait = 2 ** attempt  # 1, 2, 4 seconds
            time.sleep(wait)
    raise Exception("Max retries exceeded")
\`\`\`

## Your Task

Create a robust API wrapper that:
1. Catches and handles different error types
2. Implements retry logic with backoff
3. Logs errors for debugging`,

  solutionContent: `# Solution: Error Handling

\`\`\`python
import time
import logging
from openai import OpenAI, RateLimitError, APIError, APIConnectionError

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RobustOpenAI:
    def __init__(self, max_retries=3, base_delay=1):
        self.client = OpenAI()
        self.max_retries = max_retries
        self.base_delay = base_delay

    def chat(self, messages, **kwargs):
        last_error = None

        for attempt in range(self.max_retries):
            try:
                response = self.client.chat.completions.create(
                    model=kwargs.get("model", "gpt-3.5-turbo"),
                    messages=messages,
                    **kwargs
                )
                return response.choices[0].message.content

            except RateLimitError as e:
                delay = self.base_delay * (2 ** attempt)
                logger.warning(f"Rate limited. Waiting {delay}s...")
                time.sleep(delay)
                last_error = e

            except APIConnectionError as e:
                delay = self.base_delay * (2 ** attempt)
                logger.warning(f"Connection error. Retry in {delay}s...")
                time.sleep(delay)
                last_error = e

            except APIError as e:
                logger.error(f"API error: {e}")
                if e.status_code >= 500:  # Server error, retry
                    time.sleep(self.base_delay)
                    last_error = e
                else:
                    raise  # Client error, don't retry

        raise last_error or Exception("Max retries exceeded")

# Usage
client = RobustOpenAI()
response = client.chat([{"role": "user", "content": "Hello!"}])
print(response)
\`\`\``,

  explanationContent: `# Deep Dive: Error Handling Patterns

## Error Categories

### Retryable Errors
- RateLimitError (429)
- APIConnectionError (network)
- Server errors (5xx)

### Non-Retryable Errors
- AuthenticationError (401)
- BadRequestError (400)
- NotFoundError (404)

## Circuit Breaker Pattern

\`\`\`python
class CircuitBreaker:
    def __init__(self, failure_threshold=5, reset_timeout=60):
        self.failures = 0
        self.threshold = failure_threshold
        self.reset_timeout = reset_timeout
        self.last_failure = None
        self.state = "closed"  # closed, open, half-open

    def call(self, func):
        if self.state == "open":
            if time.time() - self.last_failure > self.reset_timeout:
                self.state = "half-open"
            else:
                raise Exception("Circuit open")

        try:
            result = func()
            self.failures = 0
            self.state = "closed"
            return result
        except Exception as e:
            self.failures += 1
            self.last_failure = time.time()
            if self.failures >= self.threshold:
                self.state = "open"
            raise
\`\`\``,

  realworldContent: `# Real-World Applications

## 1. Production API Wrapper
\`\`\`python
class ProductionLLM:
    def __init__(self):
        self.primary = OpenAI()
        self.fallback = OpenAI(base_url="backup-api")

    def generate(self, prompt):
        try:
            return self.primary.chat(...)
        except APIError:
            logger.warning("Primary failed, using fallback")
            return self.fallback.chat(...)
\`\`\`

## 2. Error Monitoring
\`\`\`python
from sentry_sdk import capture_exception

try:
    response = client.chat(...)
except Exception as e:
    capture_exception(e)
    raise
\`\`\``,

  mistakesContent: `# Common Mistakes

## 1. Catching Too Broadly
\`\`\`python
# Bad - hides real issues
try:
    response = client.chat(...)
except Exception:
    pass

# Good - handle specific errors
except RateLimitError:
    time.sleep(60)
\`\`\`

## 2. No Retry Limit
\`\`\`python
# Bad - infinite loop
while True:
    try:
        return client.chat(...)
    except RateLimitError:
        time.sleep(1)

# Good - limit retries
for attempt in range(3):
    ...
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: How do you handle rate limits?
**Answer:** Implement exponential backoff: wait 1s, 2s, 4s between retries. Respect Retry-After headers. Consider request queuing.

## Q2: What's a circuit breaker?
**Answer:** Pattern that stops calling a failing service temporarily. After threshold failures, "opens" the circuit. Tries again after timeout.

## Q3: Which errors should you retry?
**Answer:** Rate limits (429), server errors (5xx), network issues. Don't retry auth errors (401), bad requests (400), or not found (404).`,

  starterCode: `import time
from openai import OpenAI, RateLimitError, APIError

class RobustClient:
    def __init__(self):
        self.client = OpenAI()
        self.max_retries = 3

    def chat(self, messages):
        # TODO: Implement retry logic with error handling
        # 1. Try the API call
        # 2. Catch RateLimitError - wait and retry
        # 3. Catch APIError - log and maybe retry
        # 4. Return response or raise after max retries
        pass

# Test
client = RobustClient()
response = client.chat([{"role": "user", "content": "Hello!"}])
print(response)`,

  solutionCode: `import time
from openai import OpenAI, RateLimitError, APIError

class RobustClient:
    def __init__(self):
        self.client = OpenAI()
        self.max_retries = 3

    def chat(self, messages):
        last_error = None

        for attempt in range(self.max_retries):
            try:
                response = self.client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=messages
                )
                return response.choices[0].message.content

            except RateLimitError as e:
                delay = 2 ** attempt
                print(f"Rate limited, waiting {delay}s...")
                time.sleep(delay)
                last_error = e

            except APIError as e:
                print(f"API Error: {e}")
                last_error = e
                if e.status_code >= 500:
                    time.sleep(1)
                else:
                    raise

        raise last_error or Exception("Max retries exceeded")

# Test
client = RobustClient()
response = client.chat([{"role": "user", "content": "Hello!"}])
print(response)`,

  hints: [
    "Use a for loop for retry attempts",
    "Exponential backoff: delay = 2 ** attempt",
    "Check status_code for server vs client errors",
    "Keep track of the last error to re-raise"
  ]
};
