import type { LessonContent } from '../types';

export const projectAiAssistant: LessonContent = {
  slug: "project-ai-assistant",
  problemContent: `# Project: AI Assistant

Build a complete AI assistant with conversation history!

## Requirements

1. Maintain conversation context
2. Support system prompt customization
3. Stream responses
4. Handle errors gracefully
5. Track token usage

## Features to Build

\`\`\`python
assistant = AIAssistant(
    system_prompt="You are a helpful coding tutor",
    model="gpt-4"
)

# Chat with context
response = assistant.chat("What is Python?")
response = assistant.chat("Give me an example")  # Remembers context

# Clear history
assistant.reset()

# Get usage stats
print(assistant.get_stats())
\`\`\`

## Starter Structure

\`\`\`python
class AIAssistant:
    def __init__(self, system_prompt, model):
        self.client = OpenAI()
        self.messages = []
        self.system_prompt = system_prompt
        self.model = model

    def chat(self, user_message):
        # Add to history, call API, return response
        pass

    def chat_stream(self, user_message):
        # Streaming version
        pass

    def reset(self):
        # Clear conversation
        pass

    def get_stats(self):
        # Return token usage
        pass
\`\`\`

## Your Task

1. Implement the \`chat()\` method with conversation history
2. Implement \`reset()\` to clear the conversation
3. Test with multiple messages to verify context is maintained`,

  solutionContent: `# Solution: AI Assistant

\`\`\`python
from openai import OpenAI
import tiktoken

class AIAssistant:
    def __init__(self, system_prompt="You are a helpful assistant", model="gpt-3.5-turbo"):
        self.client = OpenAI()
        self.model = model
        self.system_prompt = system_prompt
        self.messages = [{"role": "system", "content": system_prompt}]
        self.encoding = tiktoken.encoding_for_model(model)
        self.total_tokens_used = 0

    def _count_tokens(self, text):
        return len(self.encoding.encode(text))

    def chat(self, user_message):
        """Send message and get response"""
        self.messages.append({"role": "user", "content": user_message})

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=self.messages,
                max_tokens=1000
            )

            assistant_message = response.choices[0].message.content
            self.messages.append({"role": "assistant", "content": assistant_message})

            # Track usage
            self.total_tokens_used += response.usage.total_tokens

            return assistant_message

        except Exception as e:
            # Remove failed user message
            self.messages.pop()
            raise e

    def chat_stream(self, user_message):
        """Stream response in real-time"""
        self.messages.append({"role": "user", "content": user_message})

        try:
            stream = self.client.chat.completions.create(
                model=self.model,
                messages=self.messages,
                stream=True
            )

            full_response = []
            for chunk in stream:
                content = chunk.choices[0].delta.content
                if content:
                    print(content, end="", flush=True)
                    full_response.append(content)

            print()
            assistant_message = "".join(full_response)
            self.messages.append({"role": "assistant", "content": assistant_message})

            # Estimate tokens
            self.total_tokens_used += self._count_tokens(user_message)
            self.total_tokens_used += self._count_tokens(assistant_message)

            return assistant_message

        except Exception as e:
            self.messages.pop()
            raise e

    def reset(self):
        """Clear conversation history"""
        self.messages = [{"role": "system", "content": self.system_prompt}]
        print("Conversation reset.")

    def get_stats(self):
        """Return usage statistics"""
        return {
            "model": self.model,
            "message_count": len(self.messages),
            "total_tokens": self.total_tokens_used,
            "estimated_cost": self.total_tokens_used * 0.00003  # Rough estimate
        }

    def get_history(self):
        """Return conversation history"""
        return self.messages[1:]  # Exclude system prompt

# Usage
assistant = AIAssistant(
    system_prompt="You are a Python expert. Give concise answers.",
    model="gpt-3.5-turbo"
)

print("Chat with the assistant (type 'quit' to exit, 'reset' to clear)")
print("-" * 50)

while True:
    user_input = input("\\nYou: ").strip()

    if user_input.lower() == 'quit':
        break
    elif user_input.lower() == 'reset':
        assistant.reset()
        continue
    elif user_input.lower() == 'stats':
        print(assistant.get_stats())
        continue

    print("\\nAssistant: ", end="")
    assistant.chat_stream(user_input)

print("\\nFinal stats:", assistant.get_stats())
\`\`\``,

  explanationContent: `# Deep Dive: Assistant Architecture

## State Management

\`\`\`python
# Messages list maintains context
messages = [
    {"role": "system", "content": "..."},
    {"role": "user", "content": "..."},
    {"role": "assistant", "content": "..."},
    # ... continues
]
\`\`\`

## Context Window Management

\`\`\`python
def _trim_history(self, max_tokens=4000):
    """Keep history within token limit"""
    while self._count_all_tokens() > max_tokens:
        if len(self.messages) > 2:  # Keep system + last exchange
            self.messages.pop(1)  # Remove oldest user message
            if len(self.messages) > 1:
                self.messages.pop(1)  # Remove its response
        else:
            break
\`\`\`

## Adding Personality

\`\`\`python
PERSONAS = {
    "tutor": "You are a patient teacher who explains concepts step by step.",
    "coder": "You are a senior developer. Give practical code examples.",
    "friend": "You're a friendly chat companion. Be warm and casual."
}

assistant = AIAssistant(system_prompt=PERSONAS["tutor"])
\`\`\``,

  realworldContent: `# Real-World Applications

## 1. Customer Support Bot
\`\`\`python
support_bot = AIAssistant(
    system_prompt=\"\"\"You are a support agent for TechCorp.
    - Be polite and professional
    - If unsure, offer to escalate
    - Never make up product features\"\"\"
)
\`\`\`

## 2. Coding Assistant
\`\`\`python
code_assistant = AIAssistant(
    system_prompt=\"\"\"You are a coding assistant.
    - Always provide working code examples
    - Explain your reasoning
    - Suggest best practices\"\"\"
)
\`\`\`

## 3. With Memory Persistence
\`\`\`python
import json

def save_conversation(assistant, filepath):
    with open(filepath, 'w') as f:
        json.dump(assistant.messages, f)

def load_conversation(assistant, filepath):
    with open(filepath) as f:
        assistant.messages = json.load(f)
\`\`\``,

  mistakesContent: `# Common Mistakes

## 1. Unbounded History
\`\`\`python
# Bad - history grows forever, hits token limit
self.messages.append(msg)

# Good - trim when needed
self.messages.append(msg)
self._trim_history()
\`\`\`

## 2. Not Tracking Errors
\`\`\`python
# Bad - user message added even if API fails
self.messages.append(user_msg)
response = self.client.chat(...)  # Might fail!

# Good - rollback on error
try:
    self.messages.append(user_msg)
    response = self.client.chat(...)
except:
    self.messages.pop()  # Remove failed message
    raise
\`\`\`

## 3. No Rate Limiting
\`\`\`python
# Add cooldown between messages
import time

def chat(self, message):
    if time.time() - self.last_request < 1:
        time.sleep(1)
    self.last_request = time.time()
    ...
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: How do you manage context length?
**Answer:** Track token count, implement sliding window or summarization when approaching limit. Keep system prompt and recent messages, summarize older ones.

## Q2: How would you add memory?
**Answer:** Persist messages to database, load on session start. For long-term memory, use vector DB to store and retrieve relevant past conversations.

## Q3: How to handle concurrent users?
**Answer:** Each user needs separate message history. Use session IDs to track, store in Redis or database. Consider async/await for multiple simultaneous requests.`,

  starterCode: `from openai import OpenAI

class AIAssistant:
    def __init__(self, system_prompt="You are a helpful assistant"):
        self.client = OpenAI()
        self.messages = [{"role": "system", "content": system_prompt}]

    def chat(self, user_message):
        """Send message and get response with context"""
        # TODO:
        # 1. Add user message to history
        # 2. Call the API with full message history
        # 3. Add assistant response to history
        # 4. Return the response
        pass

    def reset(self):
        """Clear conversation except system prompt"""
        # TODO: Reset messages list
        pass

# Test
assistant = AIAssistant("You are a friendly Python tutor")
print(assistant.chat("What is a list?"))
print(assistant.chat("How do I add to it?"))  # Should remember context`,

  solutionCode: `from openai import OpenAI

class AIAssistant:
    def __init__(self, system_prompt="You are a helpful assistant"):
        self.client = OpenAI()
        self.system_prompt = system_prompt
        self.messages = [{"role": "system", "content": system_prompt}]

    def chat(self, user_message):
        """Send message and get response with context"""
        # Add user message to history
        self.messages.append({"role": "user", "content": user_message})

        # Call API with full history
        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=self.messages
        )

        # Extract and store assistant response
        assistant_message = response.choices[0].message.content
        self.messages.append({"role": "assistant", "content": assistant_message})

        return assistant_message

    def reset(self):
        """Clear conversation except system prompt"""
        self.messages = [{"role": "system", "content": self.system_prompt}]
        print("Conversation cleared!")

# Test
assistant = AIAssistant("You are a friendly Python tutor")
print("Q1:", assistant.chat("What is a list?"))
print("\\nQ2:", assistant.chat("How do I add to it?"))`,

  hints: [
    "Messages list maintains full conversation",
    "Each message needs 'role' and 'content'",
    "Append user msg, call API, append assistant msg",
    "Reset keeps only the system prompt"
  ]
};
