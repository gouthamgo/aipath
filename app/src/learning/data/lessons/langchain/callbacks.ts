import type { LessonContent } from '../types';

export const callbacks: LessonContent = {
  slug: "callbacks",
  problemContent: `# Callbacks & Tracing

Monitor what's happening in your chains!

## Callback Options

| Tool | Use Case | Setup |
|------|----------|-------|
| StdOutCallbackHandler | Quick debugging | \`callbacks=[StdOutCallbackHandler()]\` |
| LangSmith | Production tracing | Set \`LANGCHAIN_TRACING_V2=true\` |
| Custom Handler | Custom logging | Extend \`BaseCallbackHandler\` |
| Streaming | Real-time output | Use \`stream()\` method |

## Why Callbacks?

- See what's happening step by step
- Debug issues
- Log for monitoring
- Track costs

## Simple Callback

\`\`\`python
from langchain_core.callbacks import StdOutCallbackHandler

# Print everything to console
llm = ChatOpenAI(callbacks=[StdOutCallbackHandler()])
\`\`\`

## LangSmith (Recommended)

The best way to trace LangChain apps:

\`\`\`python
# Set in .env:
# LANGCHAIN_TRACING_V2=true
# LANGCHAIN_API_KEY=ls_...

# That's it! All calls are automatically traced
\`\`\`

## Custom Callbacks

\`\`\`python
from langchain_core.callbacks import BaseCallbackHandler

class MyCallback(BaseCallbackHandler):
    def on_llm_start(self, *args, **kwargs):
        print("LLM is starting...")

    def on_llm_end(self, response, **kwargs):
        print(f"LLM finished: {response}")
\`\`\`

## Your Task

1. Create a simple callback that logs LLM start/end
2. Attach it to your LLM
3. Run a query and see the logs`,

  solutionContent: `# Solution: Callbacks

\`\`\`python
from langchain_core.callbacks import BaseCallbackHandler
from langchain_openai import ChatOpenAI

class LoggingCallback(BaseCallbackHandler):
    def on_llm_start(self, serialized, prompts, **kwargs):
        print(">>> LLM Starting")
        print(f"    Input: {prompts[0][:50]}...")

    def on_llm_end(self, response, **kwargs):
        text = response.generations[0][0].text
        print(f"<<< LLM Finished")
        print(f"    Output: {text[:50]}...")

# Create LLM with callback
llm = ChatOpenAI(
    model="gpt-4o-mini",
    callbacks=[LoggingCallback()]
)

# Run a query
response = llm.invoke("What is Python?")
print("\\nFinal response:", response.content)
\`\`\`

## Output
\`\`\`
>>> LLM Starting
    Input: What is Python?...
<<< LLM Finished
    Output: Python is a high-level programming...

Final response: Python is a high-level programming language...
\`\`\``,

  explanationContent: `# Deep Dive: Callbacks

## Available Hooks

| Method | When it's called |
|--------|-----------------|
| \`on_llm_start\` | LLM call begins |
| \`on_llm_end\` | LLM call finishes |
| \`on_chain_start\` | Chain begins |
| \`on_chain_end\` | Chain finishes |
| \`on_llm_error\` | LLM call fails |

## Cost Tracking

\`\`\`python
class CostCallback(BaseCallbackHandler):
    def __init__(self):
        self.total_tokens = 0

    def on_llm_end(self, response, **kwargs):
        usage = response.llm_output.get("token_usage", {})
        self.total_tokens += usage.get("total_tokens", 0)
        cost = self.total_tokens * 0.00001  # Approximate
        print(f"Total cost so far: \${cost:.4f}")
\`\`\`

## LangSmith Setup

\`\`\`bash
# In .env
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=ls_your_key
LANGCHAIN_PROJECT=my-project
\`\`\``,

  realworldContent: `# Real-World Callbacks

## Production Logging

\`\`\`python
import logging

class ProductionCallback(BaseCallbackHandler):
    def __init__(self):
        self.logger = logging.getLogger("langchain")

    def on_llm_start(self, *args, **kwargs):
        self.logger.info("LLM call started")

    def on_llm_error(self, error, **kwargs):
        self.logger.error(f"LLM error: {error}")
\`\`\`

## Metrics Collection

\`\`\`python
class MetricsCallback(BaseCallbackHandler):
    def on_llm_end(self, response, **kwargs):
        # Send to metrics service
        metrics.track("llm_call", {
            "tokens": response.llm_output["token_usage"],
            "model": response.llm_output.get("model_name")
        })
\`\`\``,

  mistakesContent: `# Common Mistakes

## 1. Forgetting to Pass Callbacks

\`\`\`python
# Wrong - callback not attached
callback = LoggingCallback()
llm = ChatOpenAI()  # No callbacks!

# Right
llm = ChatOpenAI(callbacks=[callback])
\`\`\`

## 2. Accessing Wrong Data

\`\`\`python
def on_llm_end(self, response, **kwargs):
    # Wrong - this structure varies
    text = response.content

    # Right - use this pattern
    text = response.generations[0][0].text
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: What are callbacks used for?

**Answer:** Monitoring, debugging, logging, and cost tracking. They hook into chain/LLM lifecycle events.

## Q2: What is LangSmith?

**Answer:** Anthropic's tracing platform for LangChain. Automatically logs all LLM calls, chains, and errors. Great for debugging.`,

  starterCode: `from langchain_core.callbacks import BaseCallbackHandler
from langchain_openai import ChatOpenAI

# Create a simple logging callback
class LoggingCallback(BaseCallbackHandler):
    def on_llm_start(self, serialized, prompts, **kwargs):
        print(">>> Starting LLM call")

    def on_llm_end(self, response, **kwargs):
        print("<<< LLM call finished")

# Create LLM with callback
llm = ChatOpenAI(
    model="gpt-4o-mini",
    callbacks=[LoggingCallback()]
)

# Test it
response = llm.invoke("Tell me a one-line joke")
print("\\nResponse:", response.content)`,

  solutionCode: `from langchain_core.callbacks import BaseCallbackHandler
from langchain_openai import ChatOpenAI

# Create a simple logging callback
class LoggingCallback(BaseCallbackHandler):
    def on_llm_start(self, serialized, prompts, **kwargs):
        print(">>> Starting LLM call")

    def on_llm_end(self, response, **kwargs):
        print("<<< LLM call finished")

# Create LLM with callback
llm = ChatOpenAI(
    model="gpt-4o-mini",
    callbacks=[LoggingCallback()]
)

# Test it
response = llm.invoke("Tell me a one-line joke")
print("\\nResponse:", response.content)`,

  hints: [
    "Extend BaseCallbackHandler class",
    "Override on_llm_start and on_llm_end methods",
    "Pass callbacks list to LLM constructor",
    "You'll see logs before and after the response"
  ]
};
