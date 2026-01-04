import type { LessonContent } from '../types';

export const functionCalling: LessonContent = {
  slug: "function-calling",
  problemContent: `# Function Calling

OpenAI's most reliable way to get structured outputs: function calling!

## Function Calling Benefits

| Feature | Benefit |
|---------|---------|
| Schema enforcement | LLM follows your exact schema |
| Required fields | Guaranteed to be present |
| Enums | Constrained values |
| Descriptions | Help LLM understand |

## What is Function Calling?

You define functions the LLM can "call" - it returns structured arguments:

\`\`\`python
tools = [{
    "type": "function",
    "function": {
        "name": "get_weather",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {"type": "string"},
                "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
            },
            "required": ["location"]
        }
    }
}]
\`\`\`

## Your Task

1. Define a function schema for product extraction (name, price, category)
2. Use \`tools\` parameter to pass the schema
3. Force the function call with \`tool_choice\`
4. Parse and display the extracted product info`,
  solutionContent: `# Solution: Function Calling

\`\`\`python
from openai import OpenAI
import json

client = OpenAI()

tools = [{
    "type": "function",
    "function": {
        "name": "extract_contact",
        "description": "Extract contact information from text",
        "parameters": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                    "description": "Person's full name"
                },
                "email": {
                    "type": "string",
                    "description": "Email address"
                },
                "phone": {
                    "type": "string",
                    "description": "Phone number"
                }
            },
            "required": ["name", "email"]
        }
    }
}]

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "user", "content": "Contact John at john@example.com or 555-1234"}
    ],
    tools=tools,
    tool_choice={"type": "function", "function": {"name": "extract_contact"}}
)

# Get the function arguments
args = json.loads(response.choices[0].message.tool_calls[0].function.arguments)
print(f"Name: {args['name']}")
print(f"Email: {args['email']}")
print(f"Phone: {args.get('phone', 'N/A')}")
\`\`\``,
  explanationContent: `# Deep Dive: Function Calling

## The Schema Structure

\`\`\`python
{
    "type": "function",
    "function": {
        "name": "function_name",        # Unique identifier
        "description": "What it does",   # Helps LLM understand
        "parameters": {                  # JSON Schema
            "type": "object",
            "properties": {...},
            "required": [...]
        }
    }
}
\`\`\`

## Tool Choice Options

\`\`\`python
# Let LLM decide whether to call
tool_choice="auto"

# Force a specific function
tool_choice={"type": "function", "function": {"name": "my_func"}}

# Don't call any function
tool_choice="none"
\`\`\`

## Accessing Results

\`\`\`python
message = response.choices[0].message

if message.tool_calls:
    for tool_call in message.tool_calls:
        name = tool_call.function.name
        args = json.loads(tool_call.function.arguments)
\`\`\``,
  realworldContent: `# Real-World: AI Assistant Actions

## Scenario: Personal Assistant Bot

Your assistant can take actions based on user requests:

\`\`\`python
tools = [
    create_calendar_event,   # Schedule meetings
    send_email,              # Send emails
    set_reminder,            # Create reminders
    search_contacts          # Look up people
]

# User: "Schedule a meeting with John tomorrow at 2pm"
# LLM calls: create_calendar_event(
#     title="Meeting with John",
#     date="2024-01-15",
#     time="14:00"
# )
\`\`\`

## The Tool Use Pattern

1. User makes request
2. LLM decides which tool to call
3. Your code executes the tool
4. Return result to LLM
5. LLM forms final response`,
  mistakesContent: `# Common Mistakes

## 1. Not Forcing Function Call

\`\`\`python
# WRONG - LLM might respond with text
response = client.chat.completions.create(
    messages=[...],
    tools=tools
)

# RIGHT - Force the function call
response = client.chat.completions.create(
    messages=[...],
    tools=tools,
    tool_choice={"type": "function", "function": {"name": "my_func"}}
)
\`\`\`

## 2. Missing Required Fields in Schema

\`\`\`python
# WRONG - No required array
"parameters": {
    "properties": {"name": {"type": "string"}}
}

# RIGHT
"parameters": {
    "properties": {"name": {"type": "string"}},
    "required": ["name"]
}
\`\`\`

## 3. Not Checking for tool_calls

\`\`\`python
# WRONG - Assumes tool was called
args = response.choices[0].message.tool_calls[0].function.arguments

# RIGHT
if response.choices[0].message.tool_calls:
    args = response.choices[0].message.tool_calls[0].function.arguments
\`\`\``,
  interviewContent: `# Interview Questions

## Q1: When would you use function calling vs JSON mode?

**Answer**:
- Function calling: Need strict schema, multiple possible actions
- JSON mode: Simple extraction, single format

## Q2: How do you handle multiple tool calls?

**Answer**:
\`\`\`python
for tool_call in message.tool_calls:
    if tool_call.function.name == "func_a":
        handle_a(tool_call.function.arguments)
    elif tool_call.function.name == "func_b":
        handle_b(tool_call.function.arguments)
\`\`\`

## Q3: What is "tool use" vs "function calling"?

**Answer**: Same concept, different naming:
- OpenAI: "Function calling" (legacy) → "Tools" (current)
- Anthropic: "Tool use"
- Both allow structured LLM outputs and actions`,
  starterCode: `from openai import OpenAI
import json

client = OpenAI()

# TODO: Define a tool for extracting product information
# Fields: name (required), price (required), category (optional)

tools = [{
    "type": "function",
    "function": {
        "name": "extract_product",
        "description": "Extract product information",
        "parameters": {
            # Add your schema here
        }
    }
}]

# TODO: Make API call with the tool
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "user", "content": "The iPhone 15 Pro costs $999 and is in the Electronics category"}
    ],
    # Add tools and tool_choice
)

# TODO: Extract and print the product info`,
  solutionCode: `from openai import OpenAI
import json

client = OpenAI()

tools = [{
    "type": "function",
    "function": {
        "name": "extract_product",
        "description": "Extract product information from text",
        "parameters": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                    "description": "Product name"
                },
                "price": {
                    "type": "number",
                    "description": "Price in dollars"
                },
                "category": {
                    "type": "string",
                    "description": "Product category"
                }
            },
            "required": ["name", "price"]
        }
    }
}]

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "user", "content": "The iPhone 15 Pro costs $999 and is in the Electronics category"}
    ],
    tools=tools,
    tool_choice={"type": "function", "function": {"name": "extract_product"}}
)

args = json.loads(response.choices[0].message.tool_calls[0].function.arguments)
print(f"Product: {args['name']}")
print(f"Price: \${args['price']}")
print(f"Category: {args.get('category', 'N/A')}")`,
  hints: [
    "Define properties with type and description for each field",
    "Use 'required' array to specify mandatory fields",
    "Force the function call with tool_choice parameter"
  ]
};
