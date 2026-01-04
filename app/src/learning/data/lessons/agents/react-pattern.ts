import type { LessonContent } from '../types';

export const reactPattern: LessonContent = {
  slug: "react-pattern",
  problemContent: `# The ReAct Pattern: Reasoning + Acting

ReAct is the most important pattern for building AI agents!

## What is ReAct?

**Re**asoning + **Act**ing = ReAct

The agent alternates between:
1. **Thought**: Reasoning about what to do
2. **Action**: Taking an action (using a tool)
3. **Observation**: Seeing the result

\`\`\`
Thought: I need to find the weather in Tokyo
Action: search_weather("Tokyo")
Observation: Tokyo: 22°C, Sunny
Thought: Now I can answer the user
Action: respond("It's 22°C and sunny in Tokyo!")
\`\`\`

## Why ReAct Works

- **Explicit reasoning**: We see the agent's thinking
- **Grounded actions**: Actions based on observations
- **Traceable**: Easy to debug
- **Self-correcting**: Can adjust based on results

## Your Task

Implement the ReAct pattern from scratch.`,

  solutionContent: `# Solution: ReAct Agent

\`\`\`python
from openai import OpenAI
import json

client = OpenAI()

REACT_PROMPT = """You are an AI agent using the ReAct pattern.

For each step, output in this EXACT format:
Thought: [your reasoning about what to do next]
Action: [tool_name(arguments)] OR respond(final answer)
Observation: [will be filled by the system]

Available tools:
- search(query): Search for information
- calculate(expression): Do math
- respond(message): Give final answer to user

IMPORTANT: After each Observation, think again before acting.
Continue until you can respond() with a complete answer.
"""

def search(query: str) -> str:
    """Simulated search."""
    data = {
        "weather tokyo": "Tokyo: 22°C, Sunny",
        "capital france": "Paris is the capital of France",
        "population usa": "USA population: ~330 million"
    }
    for key, value in data.items():
        if key in query.lower():
            return value
    return f"No results for: {query}"

def calculate(expression: str) -> str:
    """Safe calculator."""
    try:
        # Only allow safe math operations
        allowed = set('0123456789+-*/.() ')
        if all(c in allowed for c in expression):
            return str(eval(expression))
        return "Invalid expression"
    except:
        return "Calculation error"

def parse_action(text: str):
    """Extract action from agent output."""
    lines = text.strip().split('\\n')
    for line in lines:
        if line.startswith('Action:'):
            action = line.replace('Action:', '').strip()
            # Parse function call
            if '(' in action and ')' in action:
                func_name = action[:action.index('(')]
                args_str = action[action.index('(')+1:action.rindex(')')]
                return func_name.strip(), args_str.strip().strip('"').strip("'")
    return None, None

def react_agent(task: str, max_steps: int = 5) -> str:
    """Run ReAct agent loop."""

    messages = [
        {"role": "system", "content": REACT_PROMPT},
        {"role": "user", "content": f"Task: {task}"}
    ]

    full_trace = []

    for step in range(max_steps):
        # Get agent's thought and action
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            temperature=0
        )

        output = response.choices[0].message.content
        print(f"\\n--- Step {step + 1} ---")
        print(output)

        # Parse the action
        func_name, args = parse_action(output)

        if func_name == "respond":
            # Final answer
            return args

        # Execute the action
        if func_name == "search":
            observation = search(args)
        elif func_name == "calculate":
            observation = calculate(args)
        else:
            observation = f"Unknown action: {func_name}"

        print(f"Observation: {observation}")

        # Add to conversation
        messages.append({"role": "assistant", "content": output})
        messages.append({"role": "user", "content": f"Observation: {observation}"})

        full_trace.append({
            "thought_action": output,
            "observation": observation
        })

    return "Max steps reached"

# Test
result = react_agent("What is 25 * 4 and is it more than 90?")
print(f"\\nFinal Answer: {result}")
\`\`\``,

  explanationContent: `# ReAct Deep Dive

## The ReAct Loop

\`\`\`
┌─────────────────────────────────────┐
│            User Task                │
└─────────────────┬───────────────────┘
                  ↓
    ┌─────────────────────────────┐
    │         THOUGHT             │
    │   "What do I need to do?"   │
    └─────────────┬───────────────┘
                  ↓
    ┌─────────────────────────────┐
    │          ACTION             │
    │   Execute tool or respond   │
    └─────────────┬───────────────┘
                  ↓
    ┌─────────────────────────────┐
    │        OBSERVATION          │
    │   See result of action      │
    └─────────────┬───────────────┘
                  │
         ┌────────┴────────┐
         ↓                 ↓
    [Need more?]     [Have answer]
         ↓                 ↓
    Loop back         Respond
    to THOUGHT        to user
\`\`\`

## Key Components

### 1. Thought (Reasoning)
\`\`\`
Thought: I need to find the population of Tokyo.
         The user wants a specific number.
         I should use the search tool.
\`\`\`

### 2. Action (Tool Use)
\`\`\`
Action: search("population of Tokyo")
\`\`\`

### 3. Observation (Result)
\`\`\`
Observation: Tokyo population: 13.96 million
\`\`\`

## ReAct vs Other Patterns

| Pattern | Description | Use Case |
|---------|-------------|----------|
| ReAct | Thought→Action→Observe | General agents |
| CoT | Just reasoning | Complex math |
| Act-only | No explicit thought | Simple tasks |

## Benefits of Explicit Thoughts

1. **Debugging**: See where agent went wrong
2. **Trust**: User understands the reasoning
3. **Improvement**: Fine-tune on traces
4. **Safety**: Catch bad reasoning early`,

  realworldContent: `# Real-World ReAct Applications

## 1. Customer Support Agent

\`\`\`
User: "I want to return my order #12345"

Thought: User wants a return. I need to:
         1. Look up the order
         2. Check return eligibility
         3. Process if eligible

Action: lookup_order("12345")
Observation: Order #12345: Nike Shoes, $120, delivered 3 days ago

Thought: Order found. Check return policy (14 days).
         3 days < 14 days, so eligible.

Action: check_return_eligible("12345")
Observation: Eligible for return. Return shipping: free

Thought: Order is eligible. I can now help the user.

Action: respond("Your order #12345 is eligible for return...")
\`\`\`

## 2. Research Assistant

\`\`\`
Thought: User asks about climate change impacts.
         I should search for recent data.

Action: search("climate change impacts 2024")
Observation: [Search results with data]

Thought: I have general info but need specifics.
         Let me search for economic impacts.

Action: search("climate change economic cost 2024")
Observation: [More specific data]

Thought: Now I have enough to give a comprehensive answer.

Action: respond("Based on recent research...")
\`\`\`

## 3. Code Debugging Agent

\`\`\`
Thought: User reports error in file.py line 42.
         I need to read that file first.

Action: read_file("file.py")
Observation: [File contents]

Thought: I see the issue - undefined variable 'data'.
         Let me check where it should be defined.

Action: search_codebase("data =")
Observation: [Found definition in other file]

Thought: The import is missing. I can fix this.

Action: respond("Add 'from utils import data' at line 1")
\`\`\``,

  mistakesContent: `# Common ReAct Mistakes

## 1. Thinking Without Acting

\`\`\`python
# WRONG - Agent just thinks
Thought: I need to search for weather
Thought: I should use the search tool
Thought: Let me think about this more...
# Never actually acts!

# RIGHT - Think then act
Thought: I need to search for weather in Tokyo
Action: search("weather Tokyo")
\`\`\`

## 2. Acting Without Thinking

\`\`\`python
# WRONG - No reasoning
Action: search("stuff")
Action: calculate("1+1")
Action: respond("idk")

# RIGHT - Explain reasoning
Thought: The user wants to know X. I'll search for it.
Action: search("X details")
\`\`\`

## 3. Ignoring Observations

\`\`\`python
# WRONG - Doesn't use observation
Observation: Tokyo weather: 22°C, Sunny
Thought: Let me search for Tokyo weather
Action: search("Tokyo weather")  # Already have it!

# RIGHT - Use what you learned
Observation: Tokyo weather: 22°C, Sunny
Thought: I now have the weather info. I can respond.
Action: respond("It's 22°C and sunny in Tokyo")
\`\`\`

## 4. Not Knowing When to Stop

\`\`\`python
# WRONG - Keeps going after having answer
Observation: Paris is the capital of France
Thought: Let me double-check this
Action: search("France capital")
Observation: Paris is the capital
Thought: Let me verify once more...

# RIGHT - Stop when you have the answer
Observation: Paris is the capital of France
Thought: I have the answer. No need for more searches.
Action: respond("The capital of France is Paris")
\`\`\``,

  interviewContent: `# ReAct Interview Questions

## Q1: Explain the ReAct pattern and why it's effective.

**Answer**: ReAct combines **Re**asoning and **Act**ing in an interleaved manner. The agent:
1. Thinks about what to do (Thought)
2. Takes an action (Action)
3. Observes the result (Observation)
4. Repeats until task is complete

It's effective because:
- Explicit reasoning helps catch errors
- Grounded in real observations
- Traceable and debuggable
- Can self-correct based on results

## Q2: How would you implement ReAct with function calling?

**Answer**:
\`\`\`python
# Define tools as OpenAI functions
tools = [{"type": "function", "function": {...}}]

# System prompt instructs ReAct format
# But we use structured tool calls instead of parsing text

response = client.chat.completions.create(
    messages=messages,
    tools=tools
)

# Tool calls are structured, not parsed from text
if response.choices[0].message.tool_calls:
    # Execute and continue loop
\`\`\`

## Q3: What are the limitations of ReAct?

**Answer**:
1. **Token cost**: Explicit thoughts use tokens
2. **Latency**: Multiple round trips
3. **Parsing errors**: If using text format
4. **Hallucination**: Can still make up observations
5. **Loop risk**: May get stuck in thought loops

Mitigations:
- Max step limits
- Structured outputs for actions
- Observation validation
- Summarize long traces`,

  starterCode: `from openai import OpenAI

client = OpenAI()

# TODO: Define the ReAct system prompt
REACT_PROMPT = """
# Your prompt here - should explain:
# 1. The Thought -> Action -> Observation format
# 2. Available tools: search, calculate, respond
# 3. When to stop (after respond)
"""

# TODO: Implement tool functions
def search(query: str) -> str:
    """Search for information."""
    pass

def calculate(expression: str) -> str:
    """Calculate a math expression."""
    pass

# TODO: Parse action from agent output
def parse_action(text: str):
    """Extract function name and args from 'Action: func(args)'"""
    pass

# TODO: Implement the ReAct loop
def react_agent(task: str, max_steps: int = 5) -> str:
    """
    1. Send task to LLM with ReAct prompt
    2. Parse the action
    3. If respond(), return the answer
    4. Otherwise execute tool, add observation
    5. Loop until done or max_steps
    """
    pass

# Test
result = react_agent("What is 15 * 8?")
print(f"Answer: {result}")`,

  solutionCode: `from openai import OpenAI

client = OpenAI()

REACT_PROMPT = """You are a ReAct agent. For each step, use this format:

Thought: [reason about what to do]
Action: [tool(args)] or respond(answer)

Tools:
- search(query) - Search for information
- calculate(expr) - Do math
- respond(msg) - Give final answer

After each Observation, think again. Stop after respond().
"""

def search(query: str) -> str:
    """Search for information."""
    data = {
        "weather": "Sunny, 22°C",
        "capital france": "Paris",
        "python": "A programming language"
    }
    query_lower = query.lower()
    for key, value in data.items():
        if key in query_lower:
            return value
    return f"No results for: {query}"

def calculate(expression: str) -> str:
    """Calculate a math expression."""
    try:
        allowed = set('0123456789+-*/.() ')
        if all(c in allowed for c in expression):
            return str(eval(expression))
        return "Invalid"
    except:
        return "Error"

def parse_action(text: str):
    """Extract function name and args."""
    for line in text.split('\\n'):
        if line.strip().startswith('Action:'):
            action = line.split('Action:')[1].strip()
            if '(' in action and ')' in action:
                name = action[:action.index('(')]
                args = action[action.index('(')+1:action.rindex(')')]
                return name.strip(), args.strip().strip('"').strip("'")
    return None, None

def react_agent(task: str, max_steps: int = 5) -> str:
    messages = [
        {"role": "system", "content": REACT_PROMPT},
        {"role": "user", "content": task}
    ]

    for step in range(max_steps):
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages
        )

        output = response.choices[0].message.content
        print(f"\\nStep {step + 1}:\\n{output}")

        func_name, args = parse_action(output)

        if func_name == "respond":
            return args

        if func_name == "search":
            obs = search(args)
        elif func_name == "calculate":
            obs = calculate(args)
        else:
            obs = "Unknown action"

        print(f"Observation: {obs}")

        messages.append({"role": "assistant", "content": output})
        messages.append({"role": "user", "content": f"Observation: {obs}"})

    return "Max steps reached"

result = react_agent("What is 15 * 8?")
print(f"\\nFinal Answer: {result}")`,

  hints: [
    "The system prompt must clearly define the Thought/Action/Observation format",
    "Parse 'Action: function(args)' by finding ( and ) positions",
    "Add observations as user messages to continue the conversation",
    "Check if action is 'respond' to know when to stop"
  ]
};
