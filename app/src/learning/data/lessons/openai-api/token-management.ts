import type { LessonContent } from '../types';

export const tokenManagement: LessonContent = {
  slug: "token-management",
  problemContent: `# Token Management

Tokens are how LLMs read and bill you. Master them to control costs!

## What Are Tokens?

Tokens are pieces of words. Roughly:
- 1 token ≈ 4 characters
- 1 token ≈ 0.75 words
- 100 tokens ≈ 75 words

\`\`\`python
"Hello world" = 2 tokens
"ChatGPT is amazing!" = 5 tokens
\`\`\`

## Counting Tokens

\`\`\`python
import tiktoken

def count_tokens(text, model="gpt-4"):
    encoding = tiktoken.encoding_for_model(model)
    return len(encoding.encode(text))

text = "Hello, how are you today?"
print(count_tokens(text))  # 7 tokens
\`\`\`

## Token Limits by Model

| Model | Context Window | Output Limit |
|-------|----------------|--------------|
| gpt-4 | 8,192 | 4,096 |
| gpt-4-turbo | 128,000 | 4,096 |
| gpt-3.5-turbo | 16,385 | 4,096 |

## Your Task

Write a function that:
1. Counts tokens in a message
2. Warns if approaching the limit
3. Estimates cost based on token count`,

  solutionContent: `# Solution: Token Management

\`\`\`python
import tiktoken

class TokenManager:
    def __init__(self, model="gpt-4"):
        self.model = model
        self.encoding = tiktoken.encoding_for_model(model)

        # Pricing per 1M tokens (as of 2024)
        self.pricing = {
            "gpt-4": {"input": 30.0, "output": 60.0},
            "gpt-4-turbo": {"input": 10.0, "output": 30.0},
            "gpt-3.5-turbo": {"input": 0.50, "output": 1.50}
        }

        self.limits = {
            "gpt-4": 8192,
            "gpt-4-turbo": 128000,
            "gpt-3.5-turbo": 16385
        }

    def count_tokens(self, text):
        return len(self.encoding.encode(text))

    def count_messages(self, messages):
        total = 0
        for msg in messages:
            total += self.count_tokens(msg['content'])
            total += 4  # Overhead per message
        return total + 2  # Conversation overhead

    def check_limit(self, messages, buffer=500):
        tokens = self.count_messages(messages)
        limit = self.limits[self.model]

        if tokens > limit - buffer:
            return False, f"Too many tokens: {tokens}/{limit}"
        return True, tokens

    def estimate_cost(self, input_tokens, output_tokens):
        price = self.pricing[self.model]
        input_cost = (input_tokens / 1_000_000) * price["input"]
        output_cost = (output_tokens / 1_000_000) * price["output"]
        return round(input_cost + output_cost, 6)

# Usage
manager = TokenManager("gpt-4-turbo")

messages = [
    {"role": "user", "content": "Explain quantum computing in detail"}
]

ok, result = manager.check_limit(messages)
print(f"Within limit: {ok}, tokens: {result}")

cost = manager.estimate_cost(100, 500)
print("Estimated cost:", cost)
\`\`\``,

  explanationContent: `# Deep Dive: Token Economics

## Why Tokens Matter

1. **Cost Control** - You pay per token
2. **Context Limits** - Can't exceed model's window
3. **Response Quality** - More context = better answers

## Tokenization Details

\`\`\`python
import tiktoken

enc = tiktoken.encoding_for_model("gpt-4")

# See actual tokens
text = "Hello, world!"
tokens = enc.encode(text)
print(tokens)  # [9906, 11, 1917, 0]

# Decode back
for token in tokens:
    print(f"{token} -> '{enc.decode([token])}'")
\`\`\`

## Context Window Management

\`\`\`python
def truncate_to_fit(messages, max_tokens):
    """Keep most recent messages within limit"""
    while count_messages(messages) > max_tokens:
        if len(messages) <= 1:
            break
        messages.pop(0)  # Remove oldest
    return messages
\`\`\`

## Optimizing Token Usage

1. **Summarize history** instead of keeping all messages
2. **Use system prompts** efficiently
3. **Compress context** before including
4. **Choose right model** for the task`,

  realworldContent: `# Real-World Applications

## 1. Cost Monitoring Dashboard
\`\`\`python
class UsageTracker:
    def __init__(self):
        self.daily_tokens = 0
        self.daily_cost = 0

    def log_request(self, input_tokens, output_tokens, model):
        cost = self.calculate_cost(input_tokens, output_tokens, model)
        self.daily_tokens += input_tokens + output_tokens
        self.daily_cost += cost

        if self.daily_cost > BUDGET_LIMIT:
            alert_admin("Budget exceeded!")
\`\`\`

## 2. Smart Context Compression
\`\`\`python
def compress_conversation(messages):
    if count_tokens(messages) < 4000:
        return messages

    # Summarize older messages
    old_msgs = messages[:-5]
    recent_msgs = messages[-5:]

    summary = llm.summarize(old_msgs)
    return [{"role": "system", "content": summary}] + recent_msgs
\`\`\``,

  mistakesContent: `# Common Mistakes

## 1. Not Counting Before Sending
\`\`\`python
# Bad - might exceed limit
response = client.chat.completions.create(
    messages=huge_conversation
)

# Good - check first
if count_tokens(messages) > limit:
    messages = truncate_messages(messages)
\`\`\`

## 2. Ignoring Output Tokens
\`\`\`python
# Input fits, but output might not!
# Leave room for response
max_input = model_limit - expected_output - buffer
\`\`\`

## 3. Wrong Model Encoding
\`\`\`python
# Each model has different tokenization
enc_gpt4 = tiktoken.encoding_for_model("gpt-4")
enc_gpt35 = tiktoken.encoding_for_model("gpt-3.5-turbo")
# Results may differ!
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: What's a token?
**Answer:** A token is a piece of text the model processes. It's roughly 4 characters or 0.75 words. The model reads and generates text token by token.

## Q2: How do you handle long conversations?
**Answer:** Strategies include:
- Truncating oldest messages
- Summarizing history
- Using sliding window
- Choosing models with larger context

## Q3: How do you optimize costs?
**Answer:** Count tokens before requests, use cheaper models when possible, cache responses, compress context, batch similar requests.`,

  starterCode: `import tiktoken

class TokenManager:
    def __init__(self, model="gpt-4"):
        self.model = model
        self.encoding = tiktoken.encoding_for_model(model)
        self.limit = 8192  # gpt-4 default

    def count_tokens(self, text):
        # TODO: Return number of tokens in text
        pass

    def check_limit(self, text):
        # TODO: Return (ok, message) tuple
        # ok=True if under limit, False if over
        pass

    def estimate_cost(self, input_tokens, output_tokens):
        # TODO: Calculate cost (gpt-4: $30/1M input, $60/1M output)
        pass

# Test
manager = TokenManager()
text = "Explain machine learning in simple terms"
tokens = manager.count_tokens(text)
print(f"Tokens: {tokens}")`,

  solutionCode: `import tiktoken

class TokenManager:
    def __init__(self, model="gpt-4"):
        self.model = model
        self.encoding = tiktoken.encoding_for_model(model)
        self.limit = 8192  # gpt-4 default

    def count_tokens(self, text):
        return len(self.encoding.encode(text))

    def check_limit(self, text):
        tokens = self.count_tokens(text)
        if tokens > self.limit:
            return False, f"Exceeds limit: {tokens}/{self.limit}"
        return True, f"OK: {tokens}/{self.limit}"

    def estimate_cost(self, input_tokens, output_tokens):
        # gpt-4 pricing per 1M tokens
        input_cost = (input_tokens / 1_000_000) * 30.0
        output_cost = (output_tokens / 1_000_000) * 60.0
        return round(input_cost + output_cost, 6)

# Test
manager = TokenManager()
text = "Explain machine learning in simple terms"
tokens = manager.count_tokens(text)
print(f"Tokens: {tokens}")

ok, msg = manager.check_limit(text)
print(f"Check: {msg}")

cost = manager.estimate_cost(100, 500)
print("Cost estimate:", cost)`,

  hints: [
    "encoding.encode(text) returns a list of token IDs",
    "len() of that list gives token count",
    "Compare count to limit for check_limit",
    "Divide by 1,000,000 and multiply by rate for cost"
  ]
};
