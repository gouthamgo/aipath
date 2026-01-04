import type { LessonContent } from '../types';

export const buildingTools: LessonContent = {
  slug: "building-tools",
  problemContent: `# Giving Agents Tools

Tools let agents interact with the real world!

## What Are Tools?

Tools are functions the agent can call:

\`\`\`python
tools = [
    search_web,      # Find information
    send_email,      # Take action
    run_code,        # Execute code
    query_database   # Access data
]
\`\`\`

## Tool Definition

Each tool needs:
1. **Name**: Unique identifier
2. **Description**: What it does (for the LLM)
3. **Parameters**: Input schema
4. **Function**: The actual code

## Your Task

Create tools for an agent to use.`,
  solutionContent: `# Solution: Building Agent Tools

\`\`\`python
from openai import OpenAI
import json

client = OpenAI()

# Define tools
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get current weather for a location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "City name, e.g., 'Tokyo'"
                    }
                },
                "required": ["location"]
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
                    "expression": {
                        "type": "string",
                        "description": "Math expression, e.g., '25 * 4'"
                    }
                },
                "required": ["expression"]
            }
        }
    }
]

# Tool implementations
def get_weather(location: str) -> str:
    # In reality, call a weather API
    weather_data = {
        "Tokyo": "22°C, Sunny",
        "London": "15°C, Rainy",
        "New York": "18°C, Cloudy"
    }
    return weather_data.get(location, "Weather data not available")

def calculate(expression: str) -> str:
    try:
        result = eval(expression)  # Be careful with eval in production!
        return str(result)
    except:
        return "Error: Invalid expression"

# Execute tool calls
def execute_tool(name: str, args: dict) -> str:
    if name == "get_weather":
        return get_weather(args["location"])
    elif name == "calculate":
        return calculate(args["expression"])
    return "Unknown tool"

# Agent with tools
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "What's the weather in Tokyo?"}],
    tools=tools
)

if response.choices[0].message.tool_calls:
    tool_call = response.choices[0].message.tool_calls[0]
    args = json.loads(tool_call.function.arguments)
    result = execute_tool(tool_call.function.name, args)
    print(f"Tool: {tool_call.function.name}")
    print(f"Result: {result}")
\`\`\``,
  explanationContent: `# Deep Dive: Tool Architecture

## The Tool Execution Flow

\`\`\`
User: "What's 25 * 4?"
    ↓
LLM sees available tools
    ↓
LLM decides: "I should use calculate"
    ↓
LLM outputs: {"name": "calculate", "args": {"expression": "25 * 4"}}
    ↓
Your code executes the tool
    ↓
Result "100" sent back to LLM
    ↓
LLM: "25 * 4 equals 100"
\`\`\`

## Tool Design Best Practices

\`\`\`python
# 1. Clear descriptions
"Get weather for a city"  # Good
"weather"                  # Bad - unclear

# 2. Specific parameters
"location": "City and country, e.g., 'Paris, France'"  # Good
"loc": "location"  # Bad - ambiguous

# 3. Typed parameters
"type": "string", "enum": ["celsius", "fahrenheit"]  # Good
"type": "string"  # Less good - no constraints
\`\`\`

## Parallel Tool Calls

LLMs can call multiple tools at once:

\`\`\`python
# User: "Weather in Tokyo and London?"
# LLM returns TWO tool calls:
[
    {"name": "get_weather", "args": {"location": "Tokyo"}},
    {"name": "get_weather", "args": {"location": "London"}}
]
\`\`\``,
  realworldContent: `# Real-World: Research Agent

## Scenario: Automated Research Assistant

\`\`\`python
research_tools = [
    {
        "name": "search_papers",
        "description": "Search academic papers by topic",
        "parameters": {"query": "string", "limit": "integer"}
    },
    {
        "name": "summarize_paper",
        "description": "Get summary of a specific paper",
        "parameters": {"paper_id": "string"}
    },
    {
        "name": "save_to_library",
        "description": "Save paper to user's library",
        "parameters": {"paper_id": "string", "notes": "string"}
    }
]

# Agent flow:
# 1. User: "Find papers on transformer architecture"
# 2. Agent calls: search_papers("transformer architecture")
# 3. Agent reviews results, calls: summarize_paper(top_result)
# 4. Agent: "Here's what I found... Should I save it?"
\`\`\`

## Common Tool Categories

| Category | Examples |
|----------|----------|
| Information | Search, lookup, query |
| Action | Send, create, update, delete |
| Computation | Calculate, analyze, process |
| Integration | API calls, database, files |`,
  mistakesContent: `# Common Mistakes

## 1. Poor Tool Descriptions

\`\`\`python
# WRONG - LLM won't know when to use it
{
    "name": "func1",
    "description": "does stuff"
}

# RIGHT - Clear and specific
{
    "name": "search_products",
    "description": "Search for products by name, category, or price range. Returns matching products with prices and availability."
}
\`\`\`

## 2. Not Handling Tool Errors

\`\`\`python
# WRONG - Crashes on error
result = execute_tool(tool_call)
messages.append({"role": "tool", "content": result})

# RIGHT - Handle gracefully
try:
    result = execute_tool(tool_call)
except Exception as e:
    result = f"Error executing tool: {str(e)}"
messages.append({"role": "tool", "content": result})
\`\`\`

## 3. Missing Tool Result in Conversation

\`\`\`python
# WRONG - LLM doesn't see tool result
tool_result = execute_tool(...)
response = client.chat.completions.create(messages=original_messages)

# RIGHT - Include tool result
messages.append({"role": "assistant", "content": None, "tool_calls": [tool_call]})
messages.append({"role": "tool", "tool_call_id": tool_call.id, "content": result})
response = client.chat.completions.create(messages=messages)
\`\`\``,
  interviewContent: `# Interview Questions

## Q1: How do you decide what tools to give an agent?

**Answer**:
1. Identify what actions the agent needs to take
2. Keep tools focused and single-purpose
3. Provide clear descriptions for the LLM
4. Consider security implications
5. Start minimal, add tools as needed

## Q2: How do you handle tool failures?

**Answer**:
1. Wrap tool execution in try/catch
2. Return error messages the LLM can understand
3. Allow the agent to retry or use alternative approaches
4. Log failures for debugging
5. Set sensible timeouts

## Q3: What's the difference between function calling and tool use?

**Answer**: They're the same concept with different naming:
- OpenAI: "Function calling" (legacy) → "Tools" (current)
- Anthropic: "Tool use"
- Both allow LLMs to request external function execution`,
  starterCode: `from openai import OpenAI
import json

client = OpenAI()

# TODO: Define a tool for looking up product prices
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_product_price",
            # TODO: Add description and parameters
        }
    }
]

# TODO: Implement the tool function
def get_product_price(product_name: str) -> str:
    prices = {
        "laptop": "$999",
        "phone": "$699",
        "headphones": "$199"
    }
    # Return price or "not found"
    pass

# TODO: Create agent that uses the tool
def price_agent(query: str) -> str:
    pass

# Test
print(price_agent("How much does a laptop cost?"))`,
  solutionCode: `from openai import OpenAI
import json

client = OpenAI()

tools = [
    {
        "type": "function",
        "function": {
            "name": "get_product_price",
            "description": "Get the price of a product by name",
            "parameters": {
                "type": "object",
                "properties": {
                    "product_name": {
                        "type": "string",
                        "description": "Name of the product, e.g., 'laptop'"
                    }
                },
                "required": ["product_name"]
            }
        }
    }
]

def get_product_price(product_name: str) -> str:
    prices = {
        "laptop": "$999",
        "phone": "$699",
        "headphones": "$199"
    }
    return prices.get(product_name.lower(), "Product not found")

def price_agent(query: str) -> str:
    messages = [{"role": "user", "content": query}]

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        tools=tools
    )

    if response.choices[0].message.tool_calls:
        tool_call = response.choices[0].message.tool_calls[0]
        args = json.loads(tool_call.function.arguments)
        result = get_product_price(args["product_name"])

        # Add tool result to conversation
        messages.append(response.choices[0].message)
        messages.append({
            "role": "tool",
            "tool_call_id": tool_call.id,
            "content": result
        })

        # Get final response
        final = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages
        )
        return final.choices[0].message.content

    return response.choices[0].message.content

print(price_agent("How much does a laptop cost?"))`,
  hints: [
    "Tool description should clearly explain what it does and when to use it",
    "After getting tool_calls, execute the function and add result back to messages",
    "Use 'role': 'tool' with 'tool_call_id' to send tool results back"
  ]
};
