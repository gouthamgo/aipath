import type { LessonContent } from '../types';

export const agentLoop: LessonContent = {
  slug: "agent-loop",
  problemContent: `# The Agent Execution Loop

Agents work in a loop: Think → Act → Observe → Repeat!

## The Basic Loop

\`\`\`python
while not done:
    # 1. Agent decides what to do
    action = agent.think(context)

    # 2. Execute the action
    result = execute(action)

    # 3. Add result to context
    context.add(result)

    # 4. Check if we're done
    done = agent.is_complete(result)
\`\`\`

## Loop Components

| Component | Purpose |
|-----------|---------|
| Think | LLM decides next action |
| Act | Execute tool or respond |
| Observe | Process results |
| Terminate | Decide if done |

## Your Task

Build a complete agent loop.`,
  solutionContent: `# Solution: Complete Agent Loop

\`\`\`python
from openai import OpenAI
import json

client = OpenAI()

tools = [
    {
        "type": "function",
        "function": {
            "name": "search",
            "description": "Search for information on a topic",
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
            "description": "Perform math calculation",
            "parameters": {
                "type": "object",
                "properties": {
                    "expression": {"type": "string", "description": "Math expression"}
                },
                "required": ["expression"]
            }
        }
    }
]

def execute_tool(name: str, args: dict) -> str:
    if name == "search":
        return f"Search results for '{args['query']}': [Simulated results]"
    elif name == "calculate":
        try:
            return str(eval(args["expression"]))
        except:
            return "Calculation error"
    return "Unknown tool"

def run_agent(task: str, max_steps: int = 5) -> str:
    """Run agent loop until completion or max steps."""

    messages = [
        {
            "role": "system",
            "content": "You are a helpful assistant. Use tools when needed. When you have the final answer, respond directly without using tools."
        },
        {"role": "user", "content": task}
    ]

    for step in range(max_steps):
        print(f"\\n--- Step {step + 1} ---")

        # 1. THINK: Get agent's response
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            tools=tools
        )

        message = response.choices[0].message

        # 2. CHECK: Is agent done? (no tool calls = final answer)
        if not message.tool_calls:
            print("Agent complete!")
            return message.content

        # 3. ACT: Execute tool calls
        messages.append(message)

        for tool_call in message.tool_calls:
            name = tool_call.function.name
            args = json.loads(tool_call.function.arguments)

            print(f"Tool: {name}({args})")
            result = execute_tool(name, args)
            print(f"Result: {result}")

            # 4. OBSERVE: Add result to context
            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": result
            })

    return "Max steps reached without completion"

# Test
result = run_agent("What is 25 * 4 + 10?")
print(f"\\nFinal Answer: {result}")
\`\`\``,
  explanationContent: `# Agent Loop Deep Dive

## Loop Visualization

\`\`\`
┌─────────────────────────────────────┐
│           User Request              │
└─────────────────┬───────────────────┘
                  ↓
    ┌─────────────────────────────┐
    │     THINK: LLM Decision     │←──┐
    └─────────────┬───────────────┘   │
                  ↓                    │
         ┌────────┴────────┐          │
         ↓                 ↓          │
    [Tool Call]      [Final Answer]   │
         ↓                 ↓          │
    ┌────┴─────┐    ┌─────┴─────┐    │
    │   ACT    │    │   DONE    │    │
    └────┬─────┘    └───────────┘    │
         ↓                            │
    ┌────┴─────┐                     │
    │ OBSERVE  │                     │
    └────┬─────┘                     │
         └────────────────────────────┘
\`\`\`

## Termination Strategies

\`\`\`python
# 1. No tool calls = done
if not message.tool_calls:
    return message.content

# 2. Explicit "done" tool
if tool_name == "finish":
    return tool_args["answer"]

# 3. Max steps
if step >= max_steps:
    return "Task incomplete"

# 4. Cost/token budget
if total_tokens > budget:
    return summarize_progress()
\`\`\`

## Message History Structure

\`\`\`python
messages = [
    {"role": "system", "content": "..."},
    {"role": "user", "content": "original task"},
    {"role": "assistant", "tool_calls": [...]},
    {"role": "tool", "tool_call_id": "...", "content": "result1"},
    {"role": "assistant", "tool_calls": [...]},
    {"role": "tool", "tool_call_id": "...", "content": "result2"},
    {"role": "assistant", "content": "Final answer"}
]
\`\`\``,
  realworldContent: `# Real-World: Code Debugging Agent

## Scenario: Automated Bug Fixer

\`\`\`python
debug_tools = [
    "read_file",      # Read source code
    "run_tests",      # Execute test suite
    "search_docs",    # Look up documentation
    "edit_file",      # Make changes
    "run_code"        # Execute code
]

def debug_agent(bug_report: str):
    """Agent that debugs code automatically."""

    # Agent loop:
    # 1. Read the failing test
    # 2. Read the relevant source file
    # 3. Analyze the error
    # 4. Propose a fix
    # 5. Edit the file
    # 6. Run tests again
    # 7. Repeat until tests pass

    for step in range(10):
        action = agent.decide(bug_report, history)

        if action.type == "read_file":
            result = read_file(action.path)
        elif action.type == "edit_file":
            result = edit_file(action.path, action.changes)
        elif action.type == "run_tests":
            result = run_tests()
            if result.all_passed:
                return "Bug fixed!"

        history.append((action, result))

    return "Could not fix bug"
\`\`\``,
  mistakesContent: `# Common Mistakes

## 1. No Max Step Limit

\`\`\`python
# WRONG - Can loop forever
while True:
    action = agent.think()
    execute(action)

# RIGHT - Always have a limit
for step in range(max_steps):
    action = agent.think()
    if is_done(action):
        break
    execute(action)
\`\`\`

## 2. Losing Conversation Context

\`\`\`python
# WRONG - Only sends latest message
response = client.chat.completions.create(
    messages=[{"role": "user", "content": task}]
)

# RIGHT - Maintain full history
messages.append(message)
messages.append({"role": "tool", "content": result})
response = client.chat.completions.create(messages=messages)
\`\`\`

## 3. Not Handling Empty Tool Calls

\`\`\`python
# WRONG - Assumes tool_calls exists
for tool in message.tool_calls:
    ...

# RIGHT - Check first
if message.tool_calls:
    for tool in message.tool_calls:
        ...
else:
    # Agent is done, use message.content
    return message.content
\`\`\``,
  interviewContent: `# Interview Questions

## Q1: How do you handle an agent that gets stuck in a loop?

**Answer**:
1. Set maximum step limit
2. Track repeated actions/states
3. Implement backtracking
4. Force termination and summarize progress
5. Add "step back and reconsider" prompts

## Q2: How do you optimize agent execution cost?

**Answer**:
1. Use cheaper models for simple decisions
2. Cache tool results
3. Batch similar tool calls
4. Limit context window growth
5. Summarize history periodically

## Q3: How do you debug agent behavior?

**Answer**:
1. Log all thoughts, actions, observations
2. Implement step-by-step mode
3. Visualize decision tree
4. Test individual tools separately
5. Use deterministic test cases`,
  starterCode: `from openai import OpenAI
import json

client = OpenAI()

# Simple calculator tool
tools = [{
    "type": "function",
    "function": {
        "name": "add",
        "description": "Add two numbers",
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

def add(a: float, b: float) -> str:
    return str(a + b)

# TODO: Implement the agent loop
def math_agent(problem: str, max_steps: int = 5) -> str:
    """
    Agent that solves math problems step by step.
    Returns the final answer.
    """
    messages = [
        {"role": "system", "content": "Solve math problems using the add tool. When done, give the final answer."},
        {"role": "user", "content": problem}
    ]

    # TODO: Implement the loop
    # 1. Get LLM response
    # 2. Check if tool_calls exist
    # 3. Execute tools and add results
    # 4. Repeat or return final answer

    pass

# Test
print(math_agent("What is 5 + 3 + 2?"))`,
  solutionCode: `from openai import OpenAI
import json

client = OpenAI()

tools = [{
    "type": "function",
    "function": {
        "name": "add",
        "description": "Add two numbers",
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

def add(a: float, b: float) -> str:
    return str(a + b)

def math_agent(problem: str, max_steps: int = 5) -> str:
    messages = [
        {"role": "system", "content": "Solve math problems using the add tool. When done, give the final answer directly."},
        {"role": "user", "content": problem}
    ]

    for step in range(max_steps):
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            tools=tools
        )

        message = response.choices[0].message

        # Check if done (no tool calls)
        if not message.tool_calls:
            return message.content

        # Execute tools
        messages.append(message)

        for tool_call in message.tool_calls:
            args = json.loads(tool_call.function.arguments)
            result = add(args["a"], args["b"])

            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": result
            })

    return "Max steps reached"

print(math_agent("What is 5 + 3 + 2?"))`,
  hints: [
    "Use a for loop with max_steps to prevent infinite loops",
    "Check if message.tool_calls is truthy to know if agent wants to use tools",
    "When tool_calls is empty/None, the agent's message.content is the final answer"
  ]
};
