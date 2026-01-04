import type { LessonContent } from '../types';

export const apiParameters: LessonContent = {
  slug: "api-parameters",
  problemContent: `# API Parameters

Master the parameters that control LLM behavior!

## Temperature (0-2)

Controls randomness:
- **0** = Deterministic, same answer every time
- **0.7** = Balanced (default)
- **1.5+** = Creative, unpredictable

\`\`\`python
response = client.chat.completions.create(
    model="gpt-4",
    messages=messages,
    temperature=0.7
)
\`\`\`

## Max Tokens

Limits response length:
\`\`\`python
response = client.chat.completions.create(
    model="gpt-4",
    messages=messages,
    max_tokens=500  # Stop after 500 tokens
)
\`\`\`

## Top P (Nucleus Sampling)

Alternative to temperature:
\`\`\`python
response = client.chat.completions.create(
    model="gpt-4",
    messages=messages,
    top_p=0.9  # Consider top 90% probability tokens
)
\`\`\`

## Stop Sequences

Stop generation at specific strings:
\`\`\`python
response = client.chat.completions.create(
    model="gpt-4",
    messages=messages,
    stop=["END", "\\n\\n"]  # Stop at these
)
\`\`\`

## Your Task

1. Create a \`generate_creative()\` function with high temperature (1.0+)
2. Create a \`generate_factual()\` function with low temperature (0.2)
3. Test both with the same prompt
4. Compare how the outputs differ`,

  solutionContent: `# Solution: API Parameters

\`\`\`python
from openai import OpenAI

client = OpenAI()

def generate_creative(prompt):
    """High creativity for brainstorming"""
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=1.2,
        max_tokens=300,
        top_p=0.95
    )
    return response.choices[0].message.content

def generate_factual(prompt):
    """Low randomness for accurate answers"""
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.1,
        max_tokens=500,
        top_p=1.0
    )
    return response.choices[0].message.content

def generate_code(prompt):
    """Code generation settings"""
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0,  # Deterministic
        max_tokens=1000,
        stop=["\`\`\`\\n\\n"]  # Stop after code block
    )
    return response.choices[0].message.content

# Usage
idea = generate_creative("Give me a unique sci-fi story premise")
print("Creative:", idea)

fact = generate_factual("What year was Python created?")
print("Factual:", fact)
\`\`\``,

  explanationContent: `# Deep Dive: Parameter Tuning

## Temperature vs Top P

Don't use both! Pick one:
- **Temperature** = Adjust probability distribution flatness
- **Top P** = Cut off low probability tokens

\`\`\`python
# Use temperature for general control
temperature=0.7, top_p=1.0

# Or use top_p for more precise control
temperature=1.0, top_p=0.9
\`\`\`

## Presence & Frequency Penalties

Reduce repetition:
\`\`\`python
response = client.chat.completions.create(
    model="gpt-4",
    messages=messages,
    presence_penalty=0.6,   # Encourage new topics
    frequency_penalty=0.3   # Reduce word repetition
)
\`\`\`

## Parameter Combinations

| Use Case | Temp | Max Tokens | Other |
|----------|------|------------|-------|
| Code | 0 | 2000 | - |
| Chat | 0.7 | 500 | - |
| Creative | 1.2 | 1000 | presence_penalty=0.5 |
| Analysis | 0.3 | 1500 | - |
| Summary | 0.5 | 300 | stop=["\\n\\n"] |`,

  realworldContent: `# Real-World Applications

## 1. A/B Testing Parameters
\`\`\`python
import random

def get_response(prompt, variant):
    configs = {
        "A": {"temperature": 0.5, "max_tokens": 300},
        "B": {"temperature": 0.8, "max_tokens": 300}
    }
    config = configs[variant]
    return generate_with_config(prompt, **config)
\`\`\`

## 2. Dynamic Temperature
\`\`\`python
def smart_generate(prompt, task_type):
    temp_map = {
        "creative": 1.0,
        "factual": 0.2,
        "code": 0,
        "chat": 0.7
    }
    return generate(prompt, temperature=temp_map[task_type])
\`\`\``,

  mistakesContent: `# Common Mistakes

## 1. Using Both Temperature and Top P
\`\`\`python
# Confusing - effects compound
temperature=0.8, top_p=0.9

# Pick one, set other to default
temperature=0.8, top_p=1.0
\`\`\`

## 2. Too High Temperature
\`\`\`python
# Outputs become nonsensical
temperature=2.0  # Often gibberish

# Stay reasonable
temperature=1.2  # Max for most cases
\`\`\`

## 3. Wrong Max Tokens
\`\`\`python
# Too low - cuts off responses
max_tokens=50

# Too high - wastes money on long rambles
max_tokens=4000
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: When to use temperature=0?
**Answer:** For deterministic outputs like code, math, factual extraction, or when you need reproducible results.

## Q2: Temperature vs top_p?
**Answer:** Temperature adjusts the probability curve (flatter = more random). Top_p cuts off unlikely tokens. Use one, not both.

## Q3: How to reduce repetition?
**Answer:** Use presence_penalty (0-2) to encourage new topics and frequency_penalty (0-2) to penalize token repetition.`,

  starterCode: `from openai import OpenAI

client = OpenAI()

def generate_creative(prompt):
    """Generate creative content with high temperature"""
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        # TODO: Add high temperature and other params
    )
    return response.choices[0].message.content

def generate_factual(prompt):
    """Generate factual content with low temperature"""
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        # TODO: Add low temperature and other params
    )
    return response.choices[0].message.content

# Test both
print("Creative:", generate_creative("Invent a new holiday"))
print("Factual:", generate_factual("What is 2+2?"))`,

  solutionCode: `from openai import OpenAI

client = OpenAI()

def generate_creative(prompt):
    """Generate creative content with high temperature"""
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=1.2,
        max_tokens=300,
        presence_penalty=0.5
    )
    return response.choices[0].message.content

def generate_factual(prompt):
    """Generate factual content with low temperature"""
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.1,
        max_tokens=200
    )
    return response.choices[0].message.content

# Test both
print("Creative:", generate_creative("Invent a new holiday"))
print("Factual:", generate_factual("What is 2+2?"))`,

  hints: [
    "High creativity: temperature=1.0-1.2",
    "Low randomness: temperature=0-0.2",
    "Add presence_penalty for more variety",
    "max_tokens controls response length"
  ]
};
