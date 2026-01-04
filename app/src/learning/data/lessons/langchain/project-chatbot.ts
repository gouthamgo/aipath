import type { LessonContent } from '../types';

export const projectChatbot: LessonContent = {
  slug: "project-chatbot",
  problemContent: `# Project: Build an AI Chatbot

Put it all together! Build a complete chatbot with memory.

## Chatbot Features

| Feature | Method | Purpose |
|---------|--------|---------|
| Chat | \`chat(message)\` | Send message, get response |
| History | \`get_history()\` | View conversation |
| Reset | \`clear_history()\` | Start fresh |
| Personality | \`__init__(personality)\` | Set behavior |

## What You'll Build

A chatbot class that:
1. Maintains conversation history
2. Uses a system prompt
3. Supports different personalities
4. Can clear history

## Requirements

\`\`\`python
class Chatbot:
    def __init__(self, personality="helpful"):
        # Set up LLM and history
        pass

    def chat(self, message):
        # Send message, get response, update history
        pass

    def clear_history(self):
        # Reset conversation
        pass

    def get_history(self):
        # Return conversation history
        pass
\`\`\`

## Personalities

- "helpful" - Standard helpful assistant
- "pirate" - Talks like a pirate
- "teacher" - Explains everything in detail

## Your Task

1. Implement the Chatbot class
2. Test with different personalities
3. Verify memory works across messages`,

  solutionContent: `# Solution: AI Chatbot

\`\`\`python
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_openai import ChatOpenAI

class Chatbot:
    PERSONALITIES = {
        "helpful": "You are a helpful assistant. Be concise and friendly.",
        "pirate": "You are a pirate! Speak like a pirate in all responses. Arr!",
        "teacher": "You are a patient teacher. Explain things step by step with examples."
    }

    def __init__(self, personality="helpful"):
        self.llm = ChatOpenAI(model="gpt-4o-mini")
        self.personality = personality
        self.history = []
        self._init_history()

    def _init_history(self):
        system_prompt = self.PERSONALITIES.get(
            self.personality,
            self.PERSONALITIES["helpful"]
        )
        self.history = [SystemMessage(content=system_prompt)]

    def chat(self, message):
        # Add user message
        self.history.append(HumanMessage(content=message))

        # Get response
        response = self.llm.invoke(self.history)

        # Add AI response
        self.history.append(AIMessage(content=response.content))

        return response.content

    def clear_history(self):
        self._init_history()
        return "History cleared!"

    def get_history(self):
        return [
            {"role": "human" if isinstance(m, HumanMessage) else "ai",
             "content": m.content}
            for m in self.history[1:]  # Skip system message
        ]

# Test it!
bot = Chatbot(personality="pirate")
print(bot.chat("Hello!"))
print(bot.chat("What's your name?"))
print("\\nHistory:", bot.get_history())
\`\`\``,

  explanationContent: `# How It Works

## Class Structure

\`\`\`
Chatbot
├── PERSONALITIES (class variable)
├── __init__(personality)
│   ├── Create LLM
│   └── Initialize history
├── chat(message)
│   ├── Add to history
│   ├── Call LLM
│   └── Save response
├── clear_history()
└── get_history()
\`\`\`

## Memory Flow

1. User sends message
2. Add HumanMessage to history
3. Send full history to LLM
4. Add AIMessage to history
5. Return response

## Why This Design?

- Encapsulates LLM logic
- Easy to switch personalities
- History management built-in
- Clean interface for users`,

  realworldContent: `# Extending the Chatbot

## Add Streaming

\`\`\`python
def stream_chat(self, message):
    self.history.append(HumanMessage(content=message))

    full_response = ""
    for chunk in self.llm.stream(self.history):
        full_response += chunk.content
        yield chunk.content

    self.history.append(AIMessage(content=full_response))
\`\`\`

## Add Token Limits

\`\`\`python
def _trim_history(self, max_messages=20):
    if len(self.history) > max_messages:
        # Keep system message + recent messages
        self.history = self.history[:1] + self.history[-max_messages:]
\`\`\``,

  mistakesContent: `# Common Mistakes

## 1. Losing System Message

\`\`\`python
# Wrong
def clear_history(self):
    self.history = []  # Lost system message!

# Right
def clear_history(self):
    self._init_history()  # Keeps system message
\`\`\`

## 2. Not Saving AI Response

\`\`\`python
# Wrong
def chat(self, message):
    self.history.append(HumanMessage(content=message))
    response = self.llm.invoke(self.history)
    return response.content  # Forgot to save!

# Right - save the response
self.history.append(AIMessage(content=response.content))
return response.content
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: How would you make this production-ready?

**Answer:** Add error handling, token limits, database persistence, rate limiting, and logging.

## Q2: How to support multiple users?

**Answer:** Store history per user_id, load on chat start, save after each message.`,

  starterCode: `from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_openai import ChatOpenAI

class Chatbot:
    PERSONALITIES = {
        "helpful": "You are a helpful assistant. Be concise.",
        "pirate": "You are a pirate! Say arr! and talk like a pirate.",
        "teacher": "You are a patient teacher. Explain step by step."
    }

    def __init__(self, personality="helpful"):
        self.llm = ChatOpenAI(model="gpt-4o-mini")
        self.personality = personality
        self.history = []
        # TODO: Initialize history with system message

    def chat(self, message):
        # TODO: Add message to history, get response, save it
        pass

    def clear_history(self):
        # TODO: Reset to just system message
        pass

# Test
bot = Chatbot(personality="pirate")
print(bot.chat("Hello!"))
print(bot.chat("What's your favorite treasure?"))`,

  solutionCode: `from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_openai import ChatOpenAI

class Chatbot:
    PERSONALITIES = {
        "helpful": "You are a helpful assistant. Be concise.",
        "pirate": "You are a pirate! Say arr! and talk like a pirate.",
        "teacher": "You are a patient teacher. Explain step by step."
    }

    def __init__(self, personality="helpful"):
        self.llm = ChatOpenAI(model="gpt-4o-mini")
        self.personality = personality
        self.history = []
        # Initialize history with system message
        system_prompt = self.PERSONALITIES.get(personality, self.PERSONALITIES["helpful"])
        self.history = [SystemMessage(content=system_prompt)]

    def chat(self, message):
        # Add message to history
        self.history.append(HumanMessage(content=message))

        # Get response
        response = self.llm.invoke(self.history)

        # Save response to history
        self.history.append(AIMessage(content=response.content))

        return response.content

    def clear_history(self):
        # Reset to just system message
        system_prompt = self.PERSONALITIES.get(self.personality, self.PERSONALITIES["helpful"])
        self.history = [SystemMessage(content=system_prompt)]
        return "History cleared!"

# Test
bot = Chatbot(personality="pirate")
print(bot.chat("Hello!"))
print(bot.chat("What's your favorite treasure?"))`,

  hints: [
    "Initialize history with SystemMessage in __init__",
    "In chat(): append HumanMessage, call LLM, append AIMessage",
    "Use self.PERSONALITIES[personality] for system prompt",
    "clear_history() should reset to initial system message"
  ]
};
