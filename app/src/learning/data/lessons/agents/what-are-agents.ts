import type { LessonContent } from '../types';

export const whatAreAgents: LessonContent = {
  slug: "what-are-agents",
  problemContent: `# What Are AI Agents?

AI Agents are LLMs that can take actions, not just generate text!

## From Chatbot to Agent

| Chatbot | Agent |
|---------|-------|
| Answers questions | Takes actions |
| Single response | Multi-step reasoning |
| No memory | Remembers context |
| No tools | Uses tools |

## The Agent Loop

\`\`\`
User Request
    ↓
Agent thinks: "What should I do?"
    ↓
Agent acts: Uses a tool
    ↓
Agent observes: Gets result
    ↓
Agent thinks: "Is task complete?"
    ↓
Repeat or respond to user
\`\`\`

## Real Examples

- "Book me a flight to NYC" → Searches, compares, books
- "Summarize my emails" → Reads inbox, extracts key info
- "Debug this code" → Runs tests, finds error, suggests fix

## Your Task

Understand the agent reasoning loop.`,
  solutionContent: `# Solution: The ReAct Pattern

\`\`\`python
from openai import OpenAI

client = OpenAI()

def simple_agent(user_request: str):
    """A simple agent that reasons and acts."""

    messages = [
        {
            "role": "system",
            "content": """You are an AI agent. For each request:
1. THINK: Analyze what needs to be done
2. ACT: Decide on an action (or respond if done)
3. OBSERVE: Process any results

Format your response as:
THOUGHT: [your reasoning]
ACTION: [action to take or RESPOND]
RESULT: [your response if ACTION is RESPOND]"""
        },
        {"role": "user", "content": user_request}
    ]

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages
    )

    return response.choices[0].message.content

# Test the agent
result = simple_agent("What's 25 * 4 and is the result greater than 100?")
print(result)

# Output:
# THOUGHT: I need to calculate 25 * 4 and compare to 100
# ACTION: Calculate 25 * 4 = 100
# THOUGHT: Now I compare 100 to 100. It's equal, not greater.
# ACTION: RESPOND
# RESULT: 25 * 4 = 100, which is equal to 100, not greater than 100.
\`\`\``,
  explanationContent: `# The ReAct Framework

## ReAct = Reasoning + Acting

The most popular agent pattern:

\`\`\`
Thought → Action → Observation → Thought → ...
\`\`\`

## Why ReAct Works

1. **Explicit reasoning**: LLM explains its thinking
2. **Grounded actions**: Actions based on observations
3. **Traceable**: Easy to debug and understand
4. **Flexible**: Works with any tools

## The Components

\`\`\`python
# THOUGHT: Internal reasoning
"I need to find the weather in Tokyo"

# ACTION: External action
"search_weather(location='Tokyo')"

# OBSERVATION: Result from action
"Tokyo: 22°C, Sunny"

# THOUGHT: Process observation
"The weather is nice. I should tell the user."

# ACTION: Final response
"respond('It's 22°C and sunny in Tokyo!')"
\`\`\`

## Agent vs Chain

| Chain | Agent |
|-------|-------|
| Fixed steps | Dynamic steps |
| Predetermined | Decides at runtime |
| Fast | Flexible |`,
  realworldContent: `# Real-World: Customer Service Agent

## Scenario: Automated Support

\`\`\`python
class SupportAgent:
    def handle_request(self, message):
        # Agent decides what to do
        if "order status" in message:
            order_id = self.extract_order_id(message)
            status = self.check_order_status(order_id)
            return f"Your order {order_id} is {status}"

        elif "refund" in message:
            # Multi-step: verify purchase, check policy, process
            return self.handle_refund_flow(message)

        elif "speak to human" in message:
            return self.escalate_to_human()

        else:
            return self.general_response(message)
\`\`\`

## Industry Applications

| Industry | Agent Use Case |
|----------|---------------|
| E-commerce | Order tracking, returns |
| Finance | Transaction queries, fraud alerts |
| Healthcare | Appointment scheduling |
| IT | Ticket routing, basic troubleshooting |`,
  mistakesContent: `# Common Mistakes

## 1. No Exit Condition

\`\`\`python
# WRONG - Agent loops forever
while True:
    action = agent.think()
    agent.act(action)

# RIGHT - Clear termination
max_steps = 10
for step in range(max_steps):
    action = agent.think()
    if action == "DONE":
        break
    agent.act(action)
\`\`\`

## 2. No Error Handling

\`\`\`python
# WRONG - Crashes on tool failure
result = tool.execute(action)

# RIGHT - Handle failures gracefully
try:
    result = tool.execute(action)
except ToolError as e:
    result = f"Tool failed: {e}. Let me try another approach."
\`\`\`

## 3. Forgetting Context

\`\`\`python
# WRONG - Each step is isolated
response = llm.chat(current_message)

# RIGHT - Maintain conversation history
messages.append({"role": "assistant", "content": response})
messages.append({"role": "user", "content": observation})
\`\`\``,
  interviewContent: `# Interview Questions

## Q1: What's the difference between an agent and a chain?

**Answer**:
- Chain: Fixed sequence of steps, predetermined flow
- Agent: Dynamic decision-making, chooses actions at runtime based on observations

## Q2: What is the ReAct pattern?

**Answer**: ReAct (Reasoning + Acting) is a prompting pattern where the agent explicitly states its reasoning (Thought), takes an action (Act), and processes results (Observe) in a loop until the task is complete.

## Q3: How do you prevent infinite loops in agents?

**Answer**:
1. Set maximum step limit
2. Implement clear termination conditions
3. Track visited states to detect cycles
4. Add timeout mechanisms
5. Cost/token budgets`,
  starterCode: `from openai import OpenAI

client = OpenAI()

# TODO: Create a simple agent that follows the ReAct pattern
# The agent should:
# 1. Think about what to do
# 2. Decide on an action
# 3. Respond when done

def simple_agent(task: str) -> str:
    """
    A simple ReAct agent.
    """
    system_prompt = """
    # TODO: Write a system prompt that instructs the agent to:
    # - THINK about the task
    # - Decide on ACTION
    # - RESPOND when complete
    """

    # TODO: Make API call and return response
    pass

# Test
result = simple_agent("What is the capital of France and what language do they speak there?")
print(result)`,
  solutionCode: `from openai import OpenAI

client = OpenAI()

def simple_agent(task: str) -> str:
    """A simple ReAct agent."""
    system_prompt = """You are a helpful AI agent that solves tasks step by step.

For each task:
1. THOUGHT: Explain your reasoning
2. ACTION: State what you'll do (or FINAL_ANSWER if done)
3. OBSERVATION: Note what you learned (if applicable)

Keep going until you have the complete answer.
End with ACTION: FINAL_ANSWER followed by your response."""

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": task}
    ]

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages
    )

    return response.choices[0].message.content

# Test
result = simple_agent("What is the capital of France and what language do they speak there?")
print(result)`,
  hints: [
    "The system prompt should define THOUGHT, ACTION, and OBSERVATION steps",
    "Include a FINAL_ANSWER action type for when the agent is done",
    "Use clear formatting so the agent's reasoning is visible"
  ]
};
