import type { LessonContent } from '../types';

export const structuredOutputsBasics: LessonContent = {
  slug: "structured-outputs-basics",
  problemContent: `# Structured Outputs Basics

When LLMs respond, they give free-form text. But what if you need JSON, lists, or specific formats?

## Methods to Get Structured Outputs

| Method | Description | Reliability |
|--------|-------------|-------------|
| Prompting | Ask for JSON in prompt | Low |
| JSON Mode | OpenAI's json_object mode | Medium |
| Function Calling | Define function schemas | High |
| Pydantic + LangChain | Type-safe validation | Highest |

## The Problem with Free Text

\`\`\`python
response = "The user's name is John and he is 25 years old"
# How do you extract name and age reliably?
\`\`\`

## Structured Outputs to the Rescue

Force the LLM to respond in a specific format:

\`\`\`python
{
  "name": "John",
  "age": 25
}
\`\`\`

## Your Task

1. Enable JSON mode with \`response_format\`
2. Extract name and age from a text description
3. Parse the JSON response safely
4. Print the extracted values`,
  solutionContent: `# Solution: JSON Mode

\`\`\`python
from openai import OpenAI

client = OpenAI()

response = client.chat.completions.create(
    model="gpt-4o-mini",
    response_format={"type": "json_object"},
    messages=[
        {
            "role": "system",
            "content": "You are a helpful assistant. Always respond in JSON format with 'name' and 'age' keys."
        },
        {
            "role": "user",
            "content": "Extract info: John is a 25 year old developer."
        }
    ]
)

import json
data = json.loads(response.choices[0].message.content)
print(f"Name: {data['name']}, Age: {data['age']}")
\`\`\``,
  explanationContent: `# How Structured Outputs Work

## 1. JSON Mode

OpenAI's JSON mode guarantees valid JSON:

\`\`\`python
response_format={"type": "json_object"}
\`\`\`

**Important**: You MUST mention JSON in your prompt when using JSON mode!

## 2. Why This Matters

- **Reliable parsing**: No more regex or string splitting
- **Type safety**: Know exactly what fields you'll get
- **Error handling**: Invalid responses are caught early

## 3. The Flow

\`\`\`
Prompt with JSON instruction
    ↓
LLM generates structured response
    ↓
Parse JSON safely
    ↓
Use data in your application
\`\`\``,
  realworldContent: `# Real-World: Form Extraction

## Scenario: Invoice Processing

Companies receive thousands of invoices. Manually entering data is slow and error-prone.

## Solution with Structured Outputs

\`\`\`python
schema = {
    "vendor": "string",
    "amount": "number",
    "date": "string",
    "items": ["string"]
}

# LLM extracts structured data from invoice text
\`\`\`

## Industry Applications

| Industry | Use Case |
|----------|----------|
| Finance | Extract transaction data |
| Healthcare | Parse medical records |
| Legal | Extract contract terms |
| E-commerce | Product info extraction |`,
  mistakesContent: `# Common Mistakes

## 1. Forgetting JSON Mention in Prompt

\`\`\`python
# WRONG - Won't reliably return JSON
messages=[{"role": "user", "content": "Tell me about John"}]

# RIGHT - Explicitly request JSON
messages=[
    {"role": "system", "content": "Respond in JSON format."},
    {"role": "user", "content": "Tell me about John"}
]
\`\`\`

## 2. Not Handling Parse Errors

\`\`\`python
# WRONG
data = json.loads(response.content)

# RIGHT
try:
    data = json.loads(response.content)
except json.JSONDecodeError:
    # Handle error
    pass
\`\`\`

## 3. Trusting Field Existence

\`\`\`python
# WRONG
name = data["name"]

# RIGHT
name = data.get("name", "Unknown")
\`\`\``,
  interviewContent: `# Interview Questions

## Q1: Why use structured outputs over regex?

**Answer**: Structured outputs are more reliable because:
- LLM understands context and semantics
- Handles variations in input format
- No brittle pattern matching

## Q2: What are the tradeoffs of JSON mode vs function calling?

**Answer**:
- JSON mode: Simpler but less control over schema
- Function calling: More reliable, explicit schema enforcement

## Q3: How do you handle optional fields?

**Answer**: Use default values with \`.get()\` or Pydantic's Optional type:
\`\`\`python
from typing import Optional
class User(BaseModel):
    name: str
    age: Optional[int] = None
\`\`\``,
  starterCode: `from openai import OpenAI

client = OpenAI()

# TODO: Create a chat completion with JSON mode
# Extract name and age from: "Sarah is 30 years old and works as an engineer"

response = client.chat.completions.create(
    model="gpt-4o-mini",
    # Add response_format for JSON mode
    messages=[
        # Add system message mentioning JSON
        # Add user message with the text to extract from
    ]
)

# TODO: Parse the JSON response
# Print the extracted name and age`,
  solutionCode: `from openai import OpenAI
import json

client = OpenAI()

response = client.chat.completions.create(
    model="gpt-4o-mini",
    response_format={"type": "json_object"},
    messages=[
        {
            "role": "system",
            "content": "Extract information and respond in JSON format with 'name' and 'age' keys."
        },
        {
            "role": "user",
            "content": "Sarah is 30 years old and works as an engineer"
        }
    ]
)

data = json.loads(response.choices[0].message.content)
print(f"Name: {data['name']}")
print(f"Age: {data['age']}")`,
  hints: [
    "Use response_format={'type': 'json_object'} in the API call",
    "Always mention JSON format in your system message",
    "Use json.loads() to parse the response content"
  ]
};
