import type { LessonContent } from '../types';

export const errorRecovery: LessonContent = {
  slug: "error-recovery",
  problemContent: `# Error Handling in Agents

Agents must handle failures gracefully!

## What Can Go Wrong?

| Error Type | Example |
|------------|---------|
| Tool failure | API timeout |
| Invalid output | Malformed JSON |
| Rate limits | Too many requests |
| Logic errors | Wrong tool choice |
| Infinite loops | Agent gets stuck |

## Error Handling Strategies

\`\`\`python
# 1. Retry with backoff
# 2. Fallback to alternative
# 3. Ask for clarification
# 4. Graceful degradation
# 5. Human escalation
\`\`\`

## Your Task

Implement robust error handling.`,
  solutionContent: `# Solution: Robust Agent Error Handling

\`\`\`python
from openai import OpenAI
import time
import json
from typing import Optional

client = OpenAI()

class AgentError(Exception):
    """Base exception for agent errors."""
    pass

class ToolError(AgentError):
    """Tool execution failed."""
    pass

class MaxRetriesError(AgentError):
    """Max retries exceeded."""
    pass

def retry_with_backoff(func, max_retries=3, base_delay=1):
    """Retry a function with exponential backoff."""
    for attempt in range(max_retries):
        try:
            return func()
        except Exception as e:
            if attempt == max_retries - 1:
                raise MaxRetriesError(f"Failed after {max_retries} attempts: {e}")

            delay = base_delay * (2 ** attempt)
            print(f"Attempt {attempt + 1} failed, retrying in {delay}s...")
            time.sleep(delay)

def safe_tool_execute(tool_name: str, args: dict) -> str:
    """Execute tool with error handling."""
    try:
        if tool_name == "divide":
            if args.get("b", 0) == 0:
                return "Error: Cannot divide by zero"
            return str(args["a"] / args["b"])

        elif tool_name == "fetch_data":
            # Simulate unreliable API
            import random
            if random.random() < 0.3:
                raise ConnectionError("API temporarily unavailable")
            return "Data fetched successfully"

        else:
            return f"Unknown tool: {tool_name}"

    except Exception as e:
        return f"Tool error: {str(e)}"

def robust_agent(task: str, max_steps: int = 5) -> str:
    """Agent with comprehensive error handling."""

    tools = [{
        "type": "function",
        "function": {
            "name": "divide",
            "description": "Divide two numbers",
            "parameters": {
                "type": "object",
                "properties": {
                    "a": {"type": "number"},
                    "b": {"type": "number"}
                },
                "required": ["a", "b"]
            }
        }
    }]

    messages = [
        {"role": "system", "content": "You are a helpful assistant. If a tool fails, try to handle the error gracefully."},
        {"role": "user", "content": task}
    ]

    for step in range(max_steps):
        try:
            # Retry LLM call with backoff
            def make_request():
                return client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=messages,
                    tools=tools
                )

            response = retry_with_backoff(make_request)
            message = response.choices[0].message

            if not message.tool_calls:
                return message.content

            messages.append(message)

            for tool_call in message.tool_calls:
                try:
                    args = json.loads(tool_call.function.arguments)
                except json.JSONDecodeError:
                    result = "Error: Invalid tool arguments"
                else:
                    result = safe_tool_execute(tool_call.function.name, args)

                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": result
                })

        except MaxRetriesError as e:
            return f"Agent failed: {e}"
        except Exception as e:
            return f"Unexpected error: {e}"

    return "Max steps reached"

# Test with potential error
print(robust_agent("What is 10 divided by 0?"))
print(robust_agent("What is 10 divided by 2?"))
\`\`\``,
  explanationContent: `# Error Handling Deep Dive

## The Error Handling Pyramid

\`\`\`
         ┌─────────────┐
         │   Escalate  │  ← Human intervention
         ├─────────────┤
         │   Fallback  │  ← Alternative approach
         ├─────────────┤
         │    Retry    │  ← Try again
         ├─────────────┤
         │   Recover   │  ← Handle gracefully
         └─────────────┘
              Base: Detect & Log
\`\`\`

## Retry Strategies

\`\`\`python
# 1. Simple retry
for _ in range(3):
    try:
        return func()
    except:
        continue

# 2. Exponential backoff
delay = 1
for attempt in range(5):
    try:
        return func()
    except:
        time.sleep(delay)
        delay *= 2  # 1, 2, 4, 8, 16 seconds

# 3. Retry with jitter
import random
delay = 1 + random.random()  # Prevent thundering herd
\`\`\`

## Fallback Patterns

\`\`\`python
def get_answer(question):
    try:
        # Primary: Use GPT-4
        return call_gpt4(question)
    except RateLimitError:
        # Fallback 1: Use GPT-3.5
        return call_gpt35(question)
    except:
        # Fallback 2: Use cached response
        return get_cached_response(question)
\`\`\``,
  realworldContent: `# Real-World: Production Agent

## Scenario: Customer Service Bot

\`\`\`python
class ProductionAgent:
    def __init__(self):
        self.circuit_breaker = CircuitBreaker()
        self.fallback_responses = load_fallbacks()

    def handle_request(self, message: str) -> str:
        try:
            # Check circuit breaker
            if self.circuit_breaker.is_open:
                return self.fallback_response(message)

            # Try primary flow
            response = self.process_with_llm(message)
            self.circuit_breaker.record_success()
            return response

        except RateLimitError:
            # Queue for later
            self.queue_request(message)
            return "High volume - I'll get back to you shortly"

        except ToolError as e:
            # Log and continue without tool
            self.log_error(e)
            return self.respond_without_tool(message)

        except Exception as e:
            # Escalate to human
            self.circuit_breaker.record_failure()
            self.escalate_to_human(message, e)
            return "Let me connect you with a human agent"
\`\`\`

## Circuit Breaker Pattern

Prevents cascading failures:
- CLOSED: Normal operation
- OPEN: Failing, use fallback
- HALF-OPEN: Testing recovery`,
  mistakesContent: `# Common Mistakes

## 1. Swallowing Errors

\`\`\`python
# WRONG - Error hidden
try:
    result = tool()
except:
    pass  # Silent failure!

# RIGHT - Log and handle
try:
    result = tool()
except Exception as e:
    logger.error(f"Tool failed: {e}")
    result = fallback()
\`\`\`

## 2. Infinite Retry

\`\`\`python
# WRONG - Never gives up
while True:
    try:
        return call_api()
    except:
        time.sleep(1)

# RIGHT - Limited retries
for attempt in range(MAX_RETRIES):
    try:
        return call_api()
    except:
        if attempt == MAX_RETRIES - 1:
            raise
\`\`\`

## 3. Generic Exception Handling

\`\`\`python
# WRONG - Catches everything
except Exception:
    retry()

# RIGHT - Specific exceptions
except RateLimitError:
    wait_and_retry()
except InvalidResponseError:
    try_different_prompt()
except AuthError:
    raise  # Don't retry auth errors
\`\`\``,
  interviewContent: `# Interview Questions

## Q1: How do you implement a circuit breaker for LLM calls?

**Answer**:
\`\`\`python
class CircuitBreaker:
    def __init__(self, threshold=5, timeout=60):
        self.failures = 0
        self.threshold = threshold
        self.timeout = timeout
        self.last_failure = None

    @property
    def is_open(self):
        if self.failures >= self.threshold:
            if time.time() - self.last_failure > self.timeout:
                self.failures = 0  # Reset for retry
                return False
            return True
        return False
\`\`\`

## Q2: How do you handle rate limiting?

**Answer**:
1. Implement token bucket/leaky bucket
2. Use exponential backoff
3. Queue requests during limits
4. Have fallback responses ready

## Q3: When should you escalate to humans?

**Answer**:
- Repeated failures on same task
- Sensitive operations (payments, deletions)
- User explicitly requests
- Confidence below threshold
- Safety concerns detected`,
  starterCode: `from openai import OpenAI
import time
import json

client = OpenAI()

# TODO: Implement retry with backoff
def retry_with_backoff(func, max_retries=3):
    """Retry function with exponential backoff."""
    pass

# TODO: Implement safe tool execution
def safe_execute(tool_name: str, args: dict) -> str:
    """Execute tool and handle errors."""
    pass

# TODO: Implement robust agent
def robust_agent(task: str) -> str:
    """Agent with error handling."""
    pass

# Test
print(robust_agent("Calculate 100 / 0"))`,
  solutionCode: `from openai import OpenAI
import time
import json

client = OpenAI()

def retry_with_backoff(func, max_retries=3):
    """Retry function with exponential backoff."""
    for attempt in range(max_retries):
        try:
            return func()
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            delay = 2 ** attempt
            print(f"Retry in {delay}s: {e}")
            time.sleep(delay)

def safe_execute(tool_name: str, args: dict) -> str:
    """Execute tool and handle errors."""
    try:
        if tool_name == "calculate":
            expr = args.get("expression", "")
            if "/0" in expr or "/ 0" in expr:
                return "Error: Division by zero"
            return str(eval(expr))
        return "Unknown tool"
    except Exception as e:
        return f"Error: {e}"

def robust_agent(task: str) -> str:
    """Agent with error handling."""
    tools = [{
        "type": "function",
        "function": {
            "name": "calculate",
            "description": "Evaluate math expression",
            "parameters": {
                "type": "object",
                "properties": {
                    "expression": {"type": "string"}
                },
                "required": ["expression"]
            }
        }
    }]

    messages = [
        {"role": "system", "content": "You are a calculator. Handle errors gracefully."},
        {"role": "user", "content": task}
    ]

    try:
        response = retry_with_backoff(
            lambda: client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                tools=tools
            )
        )

        message = response.choices[0].message

        if message.tool_calls:
            for tc in message.tool_calls:
                args = json.loads(tc.function.arguments)
                result = safe_execute(tc.function.name, args)
                messages.append(message)
                messages.append({"role": "tool", "tool_call_id": tc.id, "content": result})

            final = client.chat.completions.create(model="gpt-4o-mini", messages=messages)
            return final.choices[0].message.content

        return message.content

    except Exception as e:
        return f"Agent error: {e}"

print(robust_agent("Calculate 100 / 0"))`,
  hints: [
    "Use exponential backoff: delay = 2 ** attempt",
    "Check for division by zero before executing calculation",
    "Wrap the main logic in try/except to catch any unexpected errors"
  ]
};
