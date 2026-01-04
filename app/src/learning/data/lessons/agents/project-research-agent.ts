import type { LessonContent } from '../types';

export const projectResearchAgent: LessonContent = {
  slug: "project-research-agent",
  problemContent: `# Project: Build a Complete Agent System

Build a production-ready agent from scratch!

## Project Requirements

Create an agent that can:
1. Answer questions using search
2. Perform calculations
3. Remember conversation history
4. Handle errors gracefully
5. Know when to give up

## Features to Implement

- Multiple tools (search, calculate, memory)
- Conversation memory
- Error handling with retries
- Max step limit
- Verbose logging

## Your Task

Build the complete system.`,
  solutionContent: `# Solution: Complete Agent System

\`\`\`python
from openai import OpenAI
import json
from collections import deque
from typing import Optional
import time

client = OpenAI()

class AgentSystem:
    def __init__(self, max_history: int = 20):
        self.memory = deque(maxlen=max_history)
        self.tools = self._define_tools()

    def _define_tools(self):
        return [
            {
                "type": "function",
                "function": {
                    "name": "search",
                    "description": "Search for information on any topic",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "query": {"type": "string", "description": "Search query"}
                        },
                        "required": ["query"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "calculate",
                    "description": "Perform mathematical calculations",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "expression": {"type": "string", "description": "Math expression"}
                        },
                        "required": ["expression"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "remember",
                    "description": "Store important information for later",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "info": {"type": "string", "description": "Information to remember"}
                        },
                        "required": ["info"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "recall",
                    "description": "Recall stored information",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "topic": {"type": "string", "description": "Topic to recall"}
                        },
                        "required": ["topic"]
                    }
                }
            }
        ]

    def _execute_tool(self, name: str, args: dict) -> str:
        try:
            if name == "search":
                return f"Results for '{args['query']}': [Simulated search results]"

            elif name == "calculate":
                result = eval(args["expression"])
                return f"Result: {result}"

            elif name == "remember":
                self.memory.append({"type": "memory", "content": args["info"]})
                return f"Stored: {args['info']}"

            elif name == "recall":
                memories = [m["content"] for m in self.memory if m["type"] == "memory"]
                relevant = [m for m in memories if args["topic"].lower() in m.lower()]
                return f"Recalled: {relevant}" if relevant else "No relevant memories found"

            return "Unknown tool"

        except Exception as e:
            return f"Error: {str(e)}"

    def _retry_api_call(self, messages, max_retries=3):
        for attempt in range(max_retries):
            try:
                return client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=messages,
                    tools=self.tools
                )
            except Exception as e:
                if attempt == max_retries - 1:
                    raise
                time.sleep(2 ** attempt)

    def chat(self, user_input: str, max_steps: int = 10, verbose: bool = True) -> str:
        # Add user message to memory
        self.memory.append({"type": "user", "content": user_input})

        # Build messages
        messages = [
            {
                "role": "system",
                "content": """You are a helpful AI assistant with access to tools.
Use tools when needed to answer questions accurately.
When you have enough information, provide a clear, direct answer."""
            }
        ]

        # Add conversation history
        for item in self.memory:
            if item["type"] == "user":
                messages.append({"role": "user", "content": item["content"]})
            elif item["type"] == "assistant":
                messages.append({"role": "assistant", "content": item["content"]})

        # Agent loop
        for step in range(max_steps):
            if verbose:
                print(f"\\n--- Step {step + 1} ---")

            try:
                response = self._retry_api_call(messages)
            except Exception as e:
                return f"API Error: {e}"

            message = response.choices[0].message

            # Check if done
            if not message.tool_calls:
                result = message.content
                self.memory.append({"type": "assistant", "content": result})
                if verbose:
                    print(f"Final Answer: {result}")
                return result

            # Execute tools
            messages.append(message)

            for tool_call in message.tool_calls:
                name = tool_call.function.name
                args = json.loads(tool_call.function.arguments)

                if verbose:
                    print(f"Tool: {name}({args})")

                result = self._execute_tool(name, args)

                if verbose:
                    print(f"Result: {result}")

                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": result
                })

        return "Max steps reached without finding answer"

# Usage
agent = AgentSystem()

# Test conversation with memory
print(agent.chat("My name is Alice and I love Python"))
print(agent.chat("What is 25 * 4?"))
print(agent.chat("What's my name?"))  # Uses memory
\`\`\``,
  explanationContent: `# System Architecture

## Components

\`\`\`
AgentSystem
├── Memory (deque)
│   ├── User messages
│   ├── Assistant responses
│   └── Stored information
├── Tools
│   ├── search
│   ├── calculate
│   ├── remember
│   └── recall
├── API Client (with retry)
└── Chat Loop
    ├── Build context
    ├── Execute tools
    └── Return response
\`\`\`

## Key Design Decisions

1. **Deque for memory**: Automatic size limit
2. **Retry logic**: Handles API failures
3. **Tool abstraction**: Easy to add new tools
4. **Verbose mode**: Debugging support
5. **Max steps**: Prevents infinite loops

## Extending the System

\`\`\`python
# Add new tool
def _execute_tool(self, name, args):
    # ...existing tools...

    elif name == "send_email":
        return send_email(args["to"], args["subject"], args["body"])

    elif name == "query_database":
        return database.query(args["sql"])
\`\`\``,
  realworldContent: `# Real-World Deployment

## Scenario: Production Assistant

\`\`\`python
class ProductionAgent(AgentSystem):
    def __init__(self):
        super().__init__()
        self.rate_limiter = RateLimiter(100, 60)  # 100/min
        self.logger = setup_logging()
        self.metrics = MetricsCollector()

    def chat(self, user_input: str) -> str:
        # Check rate limit
        if not self.rate_limiter.allow():
            return "Rate limit exceeded. Please wait."

        # Track metrics
        start_time = time.time()

        try:
            result = super().chat(user_input)
            self.metrics.record_success(time.time() - start_time)
            return result

        except Exception as e:
            self.logger.error(f"Agent error: {e}")
            self.metrics.record_failure()
            return "I encountered an error. Please try again."
\`\`\`

## Monitoring Dashboard

Track:
- Response times
- Tool usage frequency
- Error rates
- Memory usage
- User satisfaction`,
  mistakesContent: `# Common Mistakes

## 1. Not Testing Tools Individually

\`\`\`python
# WRONG - Only test full agent
result = agent.chat("complex query")

# RIGHT - Test tools separately first
assert calculate("2+2") == "Result: 4"
assert "results" in search("test").lower()
\`\`\`

## 2. No Memory Cleanup

\`\`\`python
# WRONG - Memory grows forever
self.memory.append(item)

# RIGHT - Use bounded collection
self.memory = deque(maxlen=100)
\`\`\`

## 3. Hardcoded API Keys

\`\`\`python
# WRONG
client = OpenAI(api_key="sk-...")

# RIGHT
client = OpenAI()  # Uses OPENAI_API_KEY env var
\`\`\``,
  interviewContent: `# Interview Questions

## Q1: How would you add authentication to this agent?

**Answer**:
\`\`\`python
def chat(self, user_input: str, user_id: str, token: str):
    if not self.auth.verify(user_id, token):
        raise AuthError("Invalid credentials")

    # Use user-specific memory
    self.memory = self.get_user_memory(user_id)
    ...
\`\`\`

## Q2: How do you handle concurrent requests?

**Answer**:
1. Separate memory per session
2. Thread-safe tool implementations
3. Connection pooling for API calls
4. Rate limiting per user

## Q3: How would you add streaming responses?

**Answer**:
\`\`\`python
def chat_stream(self, user_input: str):
    for chunk in client.chat.completions.create(
        ...,
        stream=True
    ):
        yield chunk.choices[0].delta.content
\`\`\``,
  starterCode: `from openai import OpenAI
import json
from collections import deque

client = OpenAI()

class SimpleAgent:
    def __init__(self):
        self.memory = deque(maxlen=10)
        # TODO: Define tools
        self.tools = []

    def _execute_tool(self, name: str, args: dict) -> str:
        # TODO: Implement tool execution
        pass

    def chat(self, user_input: str) -> str:
        # TODO: Implement agent loop
        # 1. Add user input to memory
        # 2. Build messages from memory
        # 3. Loop: call API, execute tools, check if done
        # 4. Return final response
        pass

# Test
agent = SimpleAgent()
print(agent.chat("What is 10 + 20?"))
print(agent.chat("What did I just ask?"))`,
  solutionCode: `from openai import OpenAI
import json
from collections import deque

client = OpenAI()

class SimpleAgent:
    def __init__(self):
        self.memory = deque(maxlen=10)
        self.tools = [{
            "type": "function",
            "function": {
                "name": "calculate",
                "description": "Do math",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "expr": {"type": "string"}
                    },
                    "required": ["expr"]
                }
            }
        }]

    def _execute_tool(self, name: str, args: dict) -> str:
        if name == "calculate":
            try:
                return str(eval(args["expr"]))
            except:
                return "Error"
        return "Unknown"

    def chat(self, user_input: str) -> str:
        self.memory.append({"role": "user", "content": user_input})

        messages = [{"role": "system", "content": "You help with questions. Use tools when needed."}]
        messages.extend(list(self.memory))

        for _ in range(5):
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                tools=self.tools
            )

            msg = response.choices[0].message

            if not msg.tool_calls:
                self.memory.append({"role": "assistant", "content": msg.content})
                return msg.content

            messages.append(msg)
            for tc in msg.tool_calls:
                args = json.loads(tc.function.arguments)
                result = self._execute_tool(tc.function.name, args)
                messages.append({"role": "tool", "tool_call_id": tc.id, "content": result})

        return "Max steps"

agent = SimpleAgent()
print(agent.chat("What is 10 + 20?"))
print(agent.chat("What did I just ask?"))`,
  hints: [
    "Store messages in memory with role and content keys",
    "Convert deque to list when building messages",
    "Remember to append both user messages and assistant responses to memory"
  ]
};
