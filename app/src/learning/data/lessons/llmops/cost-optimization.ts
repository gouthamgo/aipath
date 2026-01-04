import type { LessonContent } from '../types';

export const costOptimization: LessonContent = {
  slug: "cost-optimization",
  problemContent: `# Cost Optimization: Reduce LLM Spend

LLM costs can explode quickly. Learn to optimize!

## The Cost Problem

\`\`\`
Day 1: "This is great!" - $50
Day 7: "Hmm, growing..." - $500
Day 30: "We need to talk..." - $5,000
\`\`\`

## Cost Factors

| Factor | Impact |
|--------|--------|
| Model choice | GPT-4 vs 3.5 = 30x |
| Prompt length | More tokens = $ |
| Output length | More tokens = $ |
| Request volume | Scale matters |

## Optimization Strategies

1. **Model routing**: Use cheaper models when possible
2. **Caching**: Don't repeat identical calls
3. **Prompt optimization**: Shorter prompts
4. **Batching**: Combine requests

## Your Task

Implement cost optimization techniques.`,

  solutionContent: `# Solution: Cost Optimization

\`\`\`python
from openai import OpenAI
import hashlib
import json

client = OpenAI()

# Pricing (per 1K tokens, approximate)
PRICING = {
    "gpt-4": {"input": 0.03, "output": 0.06},
    "gpt-4o-mini": {"input": 0.00015, "output": 0.0006},
    "gpt-3.5-turbo": {"input": 0.0005, "output": 0.0015}
}

class CostOptimizedLLM:
    def __init__(self):
        self.cache = {}
        self.stats = {"calls": 0, "cache_hits": 0, "total_cost": 0}

    def _cache_key(self, prompt: str, model: str) -> str:
        content = f"{model}:{prompt}"
        return hashlib.md5(content.encode()).hexdigest()

    def _calculate_cost(self, model: str, input_tokens: int, output_tokens: int) -> float:
        prices = PRICING.get(model, PRICING["gpt-4o-mini"])
        return (input_tokens * prices["input"] + output_tokens * prices["output"]) / 1000

    def _select_model(self, prompt: str, require_quality: bool = False) -> str:
        """Route to appropriate model based on task."""
        if require_quality:
            return "gpt-4"

        # Simple tasks → cheap model
        simple_keywords = ["translate", "format", "extract", "list"]
        if any(kw in prompt.lower() for kw in simple_keywords):
            return "gpt-4o-mini"

        # Default
        return "gpt-4o-mini"

    def generate(self, prompt: str, use_cache: bool = True,
                 require_quality: bool = False) -> dict:
        model = self._select_model(prompt, require_quality)
        self.stats["calls"] += 1

        # Check cache
        if use_cache:
            cache_key = self._cache_key(prompt, model)
            if cache_key in self.cache:
                self.stats["cache_hits"] += 1
                return {**self.cache[cache_key], "cached": True}

        # Make API call
        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}]
        )

        result = {
            "content": response.choices[0].message.content,
            "model": model,
            "input_tokens": response.usage.prompt_tokens,
            "output_tokens": response.usage.completion_tokens,
            "cached": False
        }

        result["cost"] = self._calculate_cost(
            model, result["input_tokens"], result["output_tokens"]
        )
        self.stats["total_cost"] += result["cost"]

        # Cache result
        if use_cache:
            self.cache[cache_key] = result

        return result

    def get_stats(self):
        return {
            **self.stats,
            "cache_hit_rate": self.stats["cache_hits"] / max(self.stats["calls"], 1)
        }

# Usage
llm = CostOptimizedLLM()

# First call - not cached
result1 = llm.generate("Translate 'hello' to Spanish")
print(f"Call 1: {result1['content']} (cost: \${result1['cost']:.6f})")

# Second call - cached!
result2 = llm.generate("Translate 'hello' to Spanish")
print(f"Call 2: {result2['content']} (cached: {result2['cached']})")

# Complex task - might use better model
result3 = llm.generate("Write a poem about AI", require_quality=True)
print(f"Call 3: Model used: {result3['model']}")

print(f"\\nStats: {llm.get_stats()}")
\`\`\``,

  explanationContent: `# Cost Optimization Deep Dive

## Model Selection Strategy

\`\`\`python
def select_model(task):
    if task.complexity == "simple":
        return "gpt-4o-mini"   # $0.15/1M tokens
    elif task.complexity == "medium":
        return "gpt-4o-mini"   # $0.15/1M tokens
    else:
        return "gpt-4"         # $30/1M tokens

# 200x cost difference!
\`\`\`

## Caching Strategies

### 1. Exact Match Cache
\`\`\`python
cache[hash(prompt)] = response
\`\`\`

### 2. Semantic Cache
\`\`\`python
similar = find_similar(prompt, threshold=0.95)
if similar:
    return cache[similar]
\`\`\`

### 3. TTL Cache
\`\`\`python
cache.set(key, response, ttl=3600)  # 1 hour
\`\`\`

## Prompt Optimization

\`\`\`python
# Before: 500 tokens
prompt = "Please help me with... [long explanation]..."

# After: 100 tokens
prompt = "Summarize: [key points only]"

# 5x cost reduction!
\`\`\`

## Batching

\`\`\`python
# Before: 100 API calls
for item in items:
    result = llm.process(item)

# After: 1 API call
combined = "\\n".join(items)
results = llm.process(combined)
\`\`\``,

  realworldContent: `# Real-World Cost Optimization

## Cost Dashboard

\`\`\`
Daily Report:
├── Total Cost: $127.50
├── By Model:
│   ├── gpt-4: $95.00 (75%)
│   ├── gpt-4o-mini: $30.00 (24%)
│   └── embeddings: $2.50 (1%)
├── By Feature:
│   ├── Chat: $80.00
│   ├── RAG: $35.00
│   └── Analysis: $12.50
└── Savings:
    ├── Cache hits: $45 saved
    └── Model routing: $30 saved
\`\`\`

## Optimization Results

| Strategy | Savings |
|----------|---------|
| Caching | 30-50% |
| Model routing | 50-80% |
| Prompt compression | 20-40% |
| Batching | 10-20% |

## Budget Controls

\`\`\`python
if daily_spend > budget:
    switch_to_cheaper_model()
    enable_aggressive_caching()
    alert_team()
\`\`\``,

  mistakesContent: `# Common Cost Mistakes

## 1. Always Using GPT-4

\`\`\`python
# Wrong - expensive for simple tasks
response = gpt4.generate("What is 2+2?")  # $0.01

# Right - use appropriate model
response = gpt_mini.generate("What is 2+2?")  # $0.0001
\`\`\`

## 2. No Caching

\`\`\`python
# Wrong - repeated identical calls
for user in users:
    greeting = llm.generate("Say hello")  # Same every time!

# Right - cache common responses
greeting = cache.get_or_generate("greeting", "Say hello")
\`\`\`

## 3. Verbose Prompts

\`\`\`python
# Wrong - unnecessary tokens
prompt = "I would really appreciate it if you could please..."

# Right - concise
prompt = "Summarize:"
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: How do you reduce LLM costs?

**Answer:**
1. **Model routing**: Cheaper models for simple tasks
2. **Caching**: Avoid duplicate calls
3. **Prompt optimization**: Shorter prompts
4. **Batching**: Combine multiple requests
5. **Budget controls**: Set limits and alerts

## Q2: When would you use GPT-4 vs GPT-4o-mini?

**Answer:**
- **GPT-4o-mini**: Simple tasks, classification, extraction, formatting
- **GPT-4**: Complex reasoning, creative writing, important decisions

GPT-4 is 200x more expensive, so only use when quality matters.

## Q3: How do you implement LLM caching?

**Answer:**
\`\`\`python
cache_key = hash(prompt + model)
if cache_key in cache:
    return cache[cache_key]
response = llm.generate(prompt)
cache[cache_key] = response
return response
\`\`\``,

  starterCode: `# Cost Optimization Exercise
import hashlib

PRICES = {
    "gpt-4": 0.03,
    "gpt-4o-mini": 0.0002
}

class OptimizedLLM:
    def __init__(self):
        self.cache = {}
        self.total_cost = 0
        self.cache_hits = 0

    def _hash(self, prompt):
        return hashlib.md5(prompt.encode()).hexdigest()

    def _select_model(self, prompt, high_quality=False):
        # TODO: Return gpt-4 for high_quality, else gpt-4o-mini
        pass

    def generate(self, prompt, high_quality=False):
        # TODO: Implement with caching and model selection
        # 1. Check cache first
        # 2. Select model
        # 3. Simulate generation
        # 4. Calculate cost
        # 5. Cache result
        pass

    def stats(self):
        pass

# Test
llm = OptimizedLLM()
llm.generate("Hello")
llm.generate("Hello")  # Should be cached
llm.generate("Write a poem", high_quality=True)

print(llm.stats())`,

  solutionCode: `import hashlib

PRICES = {
    "gpt-4": 0.03,
    "gpt-4o-mini": 0.0002
}

class OptimizedLLM:
    def __init__(self):
        self.cache = {}
        self.total_cost = 0
        self.cache_hits = 0
        self.total_calls = 0

    def _hash(self, prompt, model):
        content = f"{model}:{prompt}"
        return hashlib.md5(content.encode()).hexdigest()

    def _select_model(self, prompt, high_quality=False):
        if high_quality:
            return "gpt-4"
        return "gpt-4o-mini"

    def generate(self, prompt, high_quality=False):
        self.total_calls += 1
        model = self._select_model(prompt, high_quality)
        cache_key = self._hash(prompt, model)

        # Check cache
        if cache_key in self.cache:
            self.cache_hits += 1
            return {"content": self.cache[cache_key], "cached": True, "cost": 0}

        # Simulate generation
        response = f"Response to: {prompt[:20]}..."
        tokens = len(prompt.split()) * 2  # Rough estimate
        cost = (tokens / 1000) * PRICES[model]

        self.total_cost += cost
        self.cache[cache_key] = response

        return {"content": response, "cached": False, "cost": cost, "model": model}

    def stats(self):
        return {
            "total_calls": self.total_calls,
            "cache_hits": self.cache_hits,
            "cache_rate": f"{(self.cache_hits/max(1,self.total_calls))*100:.1f}%",
            "total_cost": f"\${self.total_cost:.6f}"
        }

# Test
llm = OptimizedLLM()

print("Call 1:", llm.generate("Hello"))
print("Call 2:", llm.generate("Hello"))  # Cached!
print("Call 3:", llm.generate("Write a poem", high_quality=True))

print("\\nStats:", llm.stats())`,

  hints: [
    "Cache key should include both prompt and model",
    "Return cached result with cost=0",
    "Track cache_hits when returning from cache",
    "Calculate cost as tokens/1000 * price",
  ],
};
