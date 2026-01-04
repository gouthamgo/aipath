import type { LessonContent } from '../types';

export const chatCompletions: LessonContent = {
  slug: "chat-completions",
  problemContent: `# Chat Completions: Having Conversations with AI

Now that you can connect to OpenAI, let's learn how to have real conversations!

## How Messages Work

Think of messages like **text messages** between you and the AI:

\`\`\`python
messages = [
    {"role": "system", "content": "You are a helpful tutor."},
    {"role": "user", "content": "Explain variables simply."},
]
\`\`\`

## The Three Message Roles

| Role | Who | Purpose | Example |
|------|-----|---------|---------|
| **system** | You set this | Tell AI how to behave | "You are a friendly teacher" |
| **user** | The human | What you're asking | "Explain loops to me" |
| **assistant** | The AI | Previous AI responses | "A loop repeats code..." |

## Your Task

Build a simple chat function that:
1. Takes a user's question
2. Sends it to the API
3. Returns the AI's answer

Extra challenge: Add a system prompt to make the AI talk like a pirate!`,

  solutionContent: `# Solution: Chat Completions

Here's a simple chat function:

\`\`\`python
from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def chat(user_message, system_prompt="You are a helpful assistant."):
    """Send a message, get AI's response!"""
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ]
    )
    return response.choices[0].message.content

# Try it out!
print(chat("What is Python?"))
print(chat("Explain loops", system_prompt="You are a friendly teacher."))
\`\`\`

## Bonus: Pirate AI!

\`\`\`python
pirate_response = chat(
    "Tell me about variables",
    system_prompt="You are a pirate. Always talk like a pirate!"
)
print(pirate_response)
# Output: "Ahoy matey! Variables be like treasure chests..."
\`\`\`

Great job! You've mastered the basics of chat completions!`,

  explanationContent: `# Deep Dive: Chat Completions

## Full API Parameters

\`\`\`python
response = client.chat.completions.create(
    model="gpt-4",                    # Model to use
    messages=[...],                   # Conversation messages
    temperature=0.7,                  # Randomness (0-2)
    max_tokens=1000,                  # Max response length
    top_p=1.0,                        # Nucleus sampling
    frequency_penalty=0.0,            # Reduce repetition
    presence_penalty=0.0,             # Encourage new topics
    stop=["END"],                     # Stop sequences
    n=1,                              # Number of responses
)
\`\`\`

## Understanding Temperature

\`\`\`python
# temperature=0: Deterministic, same output each time
# Best for: factual answers, code, math

# temperature=0.7: Balanced creativity
# Best for: general conversation, writing

# temperature=1.5+: Very creative/random
# Best for: brainstorming, creative writing
\`\`\`

## Response Object Deep Dive

\`\`\`python
response.id                    # "chatcmpl-abc123"
response.object                # "chat.completion"
response.created               # Unix timestamp
response.model                 # "gpt-4-0613"
response.choices[0].index      # 0
response.choices[0].message    # The message object
response.choices[0].finish_reason  # "stop", "length", etc.
response.usage.prompt_tokens   # Input tokens
response.usage.completion_tokens  # Output tokens
response.usage.total_tokens    # Total tokens
\`\`\`

## System Prompts That Work

\`\`\`python
# Be specific about behavior
system = """You are a Python tutor.
- Give concise explanations
- Always include code examples
- Point out common mistakes
- Use encouraging language"""
\`\`\``,

  realworldContent: `# Real-World Applications

## 1. Customer Support Bot

\`\`\`python
def support_chat(user_question):
    system = """You are a customer support agent for TechCorp.
    - Be helpful and professional
    - If you don't know, say so
    - Offer to escalate complex issues"""

    return chat(user_question, system_prompt=system)
\`\`\`

## 2. Code Reviewer

\`\`\`python
def review_code(code):
    system = """You are a senior code reviewer.
    Review for: bugs, security issues, best practices.
    Be constructive and specific."""

    return chat(f"Review this code:\\n\\n{code}", system_prompt=system)
\`\`\`

## 3. Multi-turn Conversation

\`\`\`python
class Chatbot:
    def __init__(self, system_prompt):
        self.messages = [
            {"role": "system", "content": system_prompt}
        ]

    def send(self, user_message):
        self.messages.append({"role": "user", "content": user_message})

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=self.messages
        )

        reply = response.choices[0].message.content
        self.messages.append({"role": "assistant", "content": reply})
        return reply

# Usage
bot = Chatbot("You are a friendly assistant.")
print(bot.send("Hi, I'm learning Python"))
print(bot.send("What should I learn first?"))  # Remembers context!
\`\`\``,

  mistakesContent: `# Common Mistakes to Avoid

## 1. Forgetting the Messages List

\`\`\`python
# ❌ Wrong - messages must be a list
response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages={"role": "user", "content": "Hi"}  # Dict, not list!
)

# ✅ Correct - list of message dicts
messages=[{"role": "user", "content": "Hi"}]
\`\`\`

## 2. Wrong Role Names

\`\`\`python
# ❌ Wrong role names
{"role": "human", "content": "..."}     # Should be "user"
{"role": "ai", "content": "..."}        # Should be "assistant"
{"role": "instruction", "content": "..."} # Should be "system"

# ✅ Correct roles: system, user, assistant
\`\`\`

## 3. Not Managing Context Length

\`\`\`python
# ❌ Sending entire chat history forever
messages.append(new_message)  # Eventually hits token limit!

# ✅ Trim old messages or summarize
def trim_messages(messages, max_messages=20):
    if len(messages) > max_messages:
        # Keep system prompt + recent messages
        return [messages[0]] + messages[-max_messages:]
    return messages
\`\`\`

## 4. Ignoring Finish Reason

\`\`\`python
# ❌ Assuming response is complete
text = response.choices[0].message.content

# ✅ Check if response was cut off
if response.choices[0].finish_reason == "length":
    print("Warning: Response was truncated!")
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: Explain the message roles in Chat Completions.

**Answer:**
- **system**: Sets behavior, personality, constraints. Processed first.
- **user**: Human input, questions, commands.
- **assistant**: AI's previous responses. Used for context in multi-turn.
- Order matters: system first, then alternating user/assistant.

## Q2: How do you maintain conversation context?

**Answer:**
- Store messages array with full history
- Append user message, get response, append assistant response
- Trim old messages when approaching token limit
- Consider summarizing older context to save tokens

## Q3: What's the difference between temperature and top_p?

**Answer:**
- **temperature**: Controls randomness. 0=deterministic, 2=very random
- **top_p**: Nucleus sampling. Considers tokens up to cumulative probability p
- Generally use one or the other, not both
- Low temp for factual tasks, higher for creative

## Q4: How do you handle long conversations?

**Answer:**
\`\`\`python
# Strategies:
# 1. Sliding window - keep last N messages
# 2. Summarization - summarize old context
# 3. Token counting - trim when near limit

import tiktoken
encoder = tiktoken.encoding_for_model("gpt-3.5-turbo")

def count_tokens(messages):
    return sum(len(encoder.encode(m["content"])) for m in messages)
\`\`\``,

  starterCode: `# Chat Completions Exercise
import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# TODO: Create a simple chat function
def chat(message):
    # 1. Create messages list with system prompt
    # 2. Add user message
    # 3. Call API and return response content
    pass


# TODO: Create a chatbot class with memory
class Chatbot:
    def __init__(self, system_prompt):
        # Initialize messages with system prompt
        pass

    def send(self, message):
        # Add user message, get response, add to history
        pass


# Test your implementations
if __name__ == "__main__":
    # Test simple chat
    print(chat("What is 2+2?"))

    # Test chatbot with memory
    bot = Chatbot("You are a helpful math tutor.")
    print(bot.send("What is 2+2?"))
    print(bot.send("Now multiply that by 10"))`,

  solutionCode: `# Chat Completions Exercise
import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def chat(message, system_prompt="You are a helpful assistant."):
    """Simple one-shot chat."""
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message}
        ]
    )
    return response.choices[0].message.content


class Chatbot:
    """Chatbot with conversation memory."""

    def __init__(self, system_prompt):
        self.messages = [
            {"role": "system", "content": system_prompt}
        ]

    def send(self, message):
        # Add user message
        self.messages.append({"role": "user", "content": message})

        # Get response
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=self.messages
        )

        # Extract and store assistant response
        reply = response.choices[0].message.content
        self.messages.append({"role": "assistant", "content": reply})

        return reply


# Test your implementations
if __name__ == "__main__":
    # Test simple chat
    print("Simple chat:")
    print(chat("What is 2+2?"))

    # Test chatbot with memory
    print("\\nChatbot with memory:")
    bot = Chatbot("You are a helpful math tutor.")
    print(bot.send("What is 2+2?"))
    print(bot.send("Now multiply that by 10"))`,

  hints: [
    "Messages must be a list of dicts with 'role' and 'content' keys",
    "Roles are: 'system', 'user', 'assistant'",
    "Store messages in a list attribute for memory",
    "Append both user message and assistant response to maintain history",
  ],
};
