import type { LessonContent } from '../types';

export const llmModels: LessonContent = {
  slug: "llm-models",
  problemContent: `# LLM Models in LangChain

LangChain supports many AI providers. Let's learn how to use them!

## Available Providers

| Provider | Package | Models |
|----------|---------|--------|
| OpenAI | \`langchain-openai\` | GPT-4, GPT-4o-mini |
| Anthropic | \`langchain-anthropic\` | Claude 3.5 Sonnet |
| Google | \`langchain-google-genai\` | Gemini |
| Local | \`langchain-ollama\` | Llama, Mistral |

## Using OpenAI

\`\`\`python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini")
response = llm.invoke("Hello!")
print(response.content)
\`\`\`

## Using Anthropic

\`\`\`python
from langchain_anthropic import ChatAnthropic

llm = ChatAnthropic(model="claude-3-haiku-20240307")
response = llm.invoke("Hello!")
print(response.content)
\`\`\`

## Chat vs Completion Models

- **Chat models** (recommended): Back-and-forth conversation
- **Completion models** (older): Just complete text

## Your Task

1. Create an OpenAI model
2. Create an Anthropic model (if you have a key)
3. Compare their responses to the same question`,

  solutionContent: `# Solution: LLM Models

\`\`\`python
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic

# Create both models
openai_llm = ChatOpenAI(model="gpt-4o-mini")
claude_llm = ChatAnthropic(model="claude-3-haiku-20240307")

# Same question to both
question = "What's the capital of France? Answer in one word."

print("OpenAI:", openai_llm.invoke(question).content)
print("Claude:", claude_llm.invoke(question).content)
\`\`\`

## Output
\`\`\`
OpenAI: Paris
Claude: Paris
\`\`\`

Both give the same answer, but may have different styles!`,

  explanationContent: `# Deep Dive: Model Selection

## OpenAI Models

| Model | Best For | Cost |
|-------|----------|------|
| gpt-4o | Complex tasks | $$$ |
| gpt-4o-mini | Most tasks | $ |
| gpt-4-turbo | Long context | $$ |

## Anthropic Models

| Model | Best For | Cost |
|-------|----------|------|
| claude-3-5-sonnet | Best quality | $$$ |
| claude-3-haiku | Fast & cheap | $ |

## Model Parameters

\`\`\`python
llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0,      # 0 = deterministic
    max_tokens=500,     # Limit response
    timeout=30,         # Seconds to wait
)
\`\`\``,

  realworldContent: `# Real-World: Model Selection

## Choose Based on Task

\`\`\`python
# For simple tasks - use cheap model
simple_llm = ChatOpenAI(model="gpt-4o-mini")

# For complex reasoning - use powerful model
complex_llm = ChatOpenAI(model="gpt-4o")

# Route based on task
def get_llm(task_complexity):
    if task_complexity == "simple":
        return simple_llm
    return complex_llm
\`\`\`

## Fallback Pattern

\`\`\`python
def call_with_fallback(message):
    try:
        return primary_llm.invoke(message)
    except:
        return fallback_llm.invoke(message)
\`\`\``,

  mistakesContent: `# Common Mistakes

## 1. Wrong Model Name

\`\`\`python
# Wrong
ChatOpenAI(model="gpt4")  # Missing dash!

# Right
ChatOpenAI(model="gpt-4o-mini")
\`\`\`

## 2. Missing Provider Package

\`\`\`python
# Error: No module named 'langchain_anthropic'
# Fix: pip install langchain-anthropic
\`\`\`

## 3. Using Wrong API Key

Each provider needs its own key:
\`\`\`
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: How to choose between models?

**Answer:** Consider: 1) Task complexity, 2) Speed requirements, 3) Cost budget. Use cheaper models for simple tasks, powerful ones for reasoning.

## Q2: What's temperature?

**Answer:** Controls randomness. 0 = always same answer, 1 = more creative/varied.`,

  starterCode: `from langchain_openai import ChatOpenAI

# Create an OpenAI model
llm = ChatOpenAI(model="gpt-4o-mini")

# Ask a question
question = "What's the largest planet in our solar system?"
response = llm.invoke(question)

print("Question:", question)
print("Answer:", response.content)`,

  solutionCode: `from langchain_openai import ChatOpenAI

# Create an OpenAI model
llm = ChatOpenAI(model="gpt-4o-mini")

# Ask a question
question = "What's the largest planet in our solar system?"
response = llm.invoke(question)

print("Question:", question)
print("Answer:", response.content)`,

  hints: [
    "Make sure langchain-openai is installed",
    "Model names are case-sensitive",
    "Response content is in .content attribute",
    "Check you have OPENAI_API_KEY set"
  ]
};
