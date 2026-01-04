import type { LessonContent } from '../types';

export const modelSelection: LessonContent = {
  slug: "model-selection",
  problemContent: `# Model Selection

Choosing the right model is crucial for cost, speed, and quality. Let's learn when to use which!

## Available Models

| Model | Best For | Cost | Speed |
|-------|----------|------|-------|
| **gpt-4** | Complex reasoning | $$$ | Slow |
| **gpt-4-turbo** | Long context + speed | $$ | Medium |
| **gpt-3.5-turbo** | General tasks | $ | Fast |

## Key Differences

**GPT-4:**
- Best reasoning and accuracy
- Follows complex instructions
- Better at coding and math
- 8K or 128K context

**GPT-3.5-turbo:**
- 10x cheaper than GPT-4
- Much faster responses
- Good for simple tasks
- 16K context

## Your Task

Build a function that:
1. Picks the right model based on task complexity
2. Falls back to cheaper models when possible
3. Tracks which model was used`,

  solutionContent: `# Solution: Model Selection

Here's a smart model selector:

\`\`\`python
from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def smart_chat(message, complexity="auto"):
    """Choose model based on complexity."""

    # Model selection logic
    if complexity == "high" or complexity == "auto" and len(message) > 500:
        model = "gpt-4"
    elif complexity == "medium":
        model = "gpt-4-turbo"
    else:
        model = "gpt-3.5-turbo"

    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": message}]
    )

    return {
        "content": response.choices[0].message.content,
        "model": model,
        "tokens": response.usage.total_tokens
    }

# Usage
result = smart_chat("What is 2+2?")  # Uses gpt-3.5-turbo
print(f"Model: {result['model']}, Tokens: {result['tokens']}")

result = smart_chat("Explain quantum computing in detail", complexity="high")
print(f"Model: {result['model']}")
\`\`\`

## With Cost Tracking

\`\`\`python
COSTS = {
    "gpt-4": {"input": 0.03, "output": 0.06},  # per 1K tokens
    "gpt-4-turbo": {"input": 0.01, "output": 0.03},
    "gpt-3.5-turbo": {"input": 0.0005, "output": 0.0015},
}

def estimate_cost(model, input_tokens, output_tokens):
    rates = COSTS.get(model, COSTS["gpt-3.5-turbo"])
    return (input_tokens / 1000 * rates["input"] +
            output_tokens / 1000 * rates["output"])
\`\`\``,

  explanationContent: `# Deep Dive: Model Selection

## Model Comparison Table

\`\`\`
Model               Context   Input Cost   Output Cost   Speed
─────────────────────────────────────────────────────────────
gpt-4               8K        $0.03/1K     $0.06/1K      Slow
gpt-4-32k           32K       $0.06/1K     $0.12/1K      Slow
gpt-4-turbo         128K      $0.01/1K     $0.03/1K      Medium
gpt-3.5-turbo       16K       $0.0005/1K   $0.0015/1K    Fast
gpt-3.5-turbo-16k   16K       $0.003/1K    $0.004/1K     Fast
\`\`\`

## When to Use Each Model

### GPT-3.5-turbo (Default Choice)
\`\`\`python
# Great for:
# - Simple Q&A
# - Text formatting
# - Basic summarization
# - Chatbots
# - High-volume applications

client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[{"role": "user", "content": "Summarize this text..."}]
)
\`\`\`

### GPT-4 (Premium Tasks)
\`\`\`python
# Great for:
# - Complex reasoning
# - Code generation/review
# - Math problems
# - Following nuanced instructions
# - Creative writing

client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Debug this complex code..."}]
)
\`\`\`

### GPT-4-turbo (Best Balance)
\`\`\`python
# Great for:
# - Long documents (up to 128K tokens)
# - When you need GPT-4 quality but faster
# - Cost-sensitive GPT-4 use cases

client.chat.completions.create(
    model="gpt-4-turbo",
    messages=[{"role": "user", "content": long_document}]
)
\`\`\``,

  realworldContent: `# Real-World Applications

## 1. Tiered Model Strategy

\`\`\`python
class SmartAssistant:
    def __init__(self):
        self.client = OpenAI()

    def classify_complexity(self, message):
        """Determine message complexity."""
        # Simple heuristics
        if any(word in message.lower() for word in
               ["code", "debug", "explain why", "analyze"]):
            return "high"
        if len(message) > 200:
            return "medium"
        return "low"

    def get_model(self, complexity):
        return {
            "high": "gpt-4",
            "medium": "gpt-4-turbo",
            "low": "gpt-3.5-turbo"
        }[complexity]

    def chat(self, message):
        complexity = self.classify_complexity(message)
        model = self.get_model(complexity)

        response = self.client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": message}]
        )

        return response.choices[0].message.content
\`\`\`

## 2. Fallback Strategy

\`\`\`python
def chat_with_fallback(message):
    """Try GPT-4, fall back to 3.5 if rate limited."""
    models = ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo"]

    for model in models:
        try:
            response = client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": message}]
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"{model} failed: {e}")
            continue

    raise Exception("All models failed")
\`\`\`

## 3. Cost-Optimized Pipeline

\`\`\`python
def optimized_pipeline(task, content):
    """Use cheap model for simple tasks, expensive for complex."""

    if task == "summarize":
        model = "gpt-3.5-turbo"  # Good enough
    elif task == "translate":
        model = "gpt-3.5-turbo"  # Fast and cheap
    elif task == "code_review":
        model = "gpt-4"  # Need best quality
    elif task == "analyze_long_doc":
        model = "gpt-4-turbo"  # Long context needed
    else:
        model = "gpt-3.5-turbo"  # Default to cheap

    return client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": content}]
    )
\`\`\``,

  mistakesContent: `# Common Mistakes to Avoid

## 1. Always Using GPT-4

\`\`\`python
# ❌ Wasteful - GPT-4 for simple tasks
response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "What is 2+2?"}]
)
# Cost: ~$0.002

# ✅ Use GPT-3.5 for simple tasks
response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[{"role": "user", "content": "What is 2+2?"}]
)
# Cost: ~$0.00002 (100x cheaper!)
\`\`\`

## 2. Using Wrong Context Length Model

\`\`\`python
# ❌ Will fail with long documents
response = client.chat.completions.create(
    model="gpt-4",  # Only 8K context
    messages=[{"role": "user", "content": very_long_doc}]
)

# ✅ Use turbo for long context
response = client.chat.completions.create(
    model="gpt-4-turbo",  # 128K context
    messages=[{"role": "user", "content": very_long_doc}]
)
\`\`\`

## 3. Not Checking Token Counts

\`\`\`python
# ❌ No idea how much you're spending
response = client.chat.completions.create(...)

# ✅ Track token usage
response = client.chat.completions.create(...)
print(f"Tokens used: {response.usage.total_tokens}")
print(f"Est. cost: {estimate_cost(response)}")
\`\`\`

## 4. Hardcoding Model Names

\`\`\`python
# ❌ Scattered model names
client.chat.completions.create(model="gpt-4", ...)
client.chat.completions.create(model="gpt-4", ...)

# ✅ Centralize configuration
class Config:
    DEFAULT_MODEL = "gpt-3.5-turbo"
    SMART_MODEL = "gpt-4"
    FAST_MODEL = "gpt-3.5-turbo"

client.chat.completions.create(model=Config.SMART_MODEL, ...)
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: How do you decide which GPT model to use?

**Answer:**
Consider these factors:
- **Complexity**: GPT-4 for reasoning, 3.5 for simple tasks
- **Speed**: 3.5-turbo is fastest
- **Cost**: 3.5 is 20x cheaper than GPT-4
- **Context length**: GPT-4-turbo for long docs (128K)
- Start with 3.5, upgrade if quality insufficient

## Q2: How do you optimize API costs?

**Answer:**
- Use GPT-3.5 for most tasks
- Cache common responses
- Batch similar requests
- Use shorter prompts
- Set max_tokens appropriately
- Monitor and track token usage
- Implement tiered model selection

## Q3: What's the context window and why does it matter?

**Answer:**
- Context window = max tokens (input + output)
- GPT-4: 8K, GPT-4-turbo: 128K, GPT-3.5: 16K
- Longer context = process larger documents
- But: more tokens = higher cost
- Need to manage conversation history to stay within limits

## Q4: Compare GPT-4 vs GPT-4-turbo

**Answer:**
- **GPT-4-turbo** is newer, faster, cheaper
- 128K context vs 8K for standard GPT-4
- 3x cheaper than GPT-4
- Same quality for most tasks
- Recommended over standard GPT-4 for most use cases`,

  starterCode: `# Model Selection Exercise
import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Model costs per 1K tokens
MODEL_COSTS = {
    "gpt-4": {"input": 0.03, "output": 0.06},
    "gpt-4-turbo": {"input": 0.01, "output": 0.03},
    "gpt-3.5-turbo": {"input": 0.0005, "output": 0.0015},
}

# TODO: Implement model selection based on task type
def select_model(task_type):
    # Return appropriate model for:
    # - "simple": basic questions -> gpt-3.5-turbo
    # - "complex": reasoning/code -> gpt-4
    # - "long": long documents -> gpt-4-turbo
    pass


# TODO: Implement cost estimation
def estimate_cost(model, input_tokens, output_tokens):
    # Calculate cost based on MODEL_COSTS
    pass


# TODO: Smart chat with model selection and cost tracking
def smart_chat(message, task_type="simple"):
    # 1. Select model based on task
    # 2. Make API call
    # 3. Calculate cost
    # 4. Return response, model used, and cost
    pass


# Test
if __name__ == "__main__":
    result = smart_chat("What is 2+2?", "simple")
    print(result)

    result = smart_chat("Write a binary search in Python", "complex")
    print(result)`,

  solutionCode: `# Model Selection Exercise
import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Model costs per 1K tokens
MODEL_COSTS = {
    "gpt-4": {"input": 0.03, "output": 0.06},
    "gpt-4-turbo": {"input": 0.01, "output": 0.03},
    "gpt-3.5-turbo": {"input": 0.0005, "output": 0.0015},
}


def select_model(task_type):
    """Select model based on task complexity."""
    models = {
        "simple": "gpt-3.5-turbo",
        "complex": "gpt-4",
        "long": "gpt-4-turbo"
    }
    return models.get(task_type, "gpt-3.5-turbo")


def estimate_cost(model, input_tokens, output_tokens):
    """Estimate cost in dollars."""
    rates = MODEL_COSTS.get(model, MODEL_COSTS["gpt-3.5-turbo"])
    input_cost = (input_tokens / 1000) * rates["input"]
    output_cost = (output_tokens / 1000) * rates["output"]
    return round(input_cost + output_cost, 6)


def smart_chat(message, task_type="simple"):
    """Chat with automatic model selection and cost tracking."""
    model = select_model(task_type)

    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": message}]
    )

    cost = estimate_cost(
        model,
        response.usage.prompt_tokens,
        response.usage.completion_tokens
    )

    return {
        "content": response.choices[0].message.content,
        "model": model,
        "tokens": response.usage.total_tokens,
        "cost": cost
    }


# Test
if __name__ == "__main__":
    result = smart_chat("What is 2+2?", "simple")
    print(f"Simple: {result['model']} - Cost: {result['cost']}")

    result = smart_chat("Write a binary search in Python", "complex")
    print(f"Complex: {result['model']} - Cost: {result['cost']}")`,

  hints: [
    "Use a dictionary to map task types to model names",
    "Cost = (tokens / 1000) * rate_per_1k",
    "Access token counts via response.usage",
    "Return a dict with content, model, tokens, and cost",
  ],
};
