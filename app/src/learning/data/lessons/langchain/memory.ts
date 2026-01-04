import type { LessonContent } from '../types';

export const memory: LessonContent = {
  slug: "memory",
  problemContent: `# Memory in LangChain

Add conversation memory to your chatbots!

## The Problem

LLMs don't remember previous messages:

\`\`\`python
llm.invoke("My name is Alice")  # "Nice to meet you, Alice!"
llm.invoke("What's my name?")   # "I don't know your name"
\`\`\`

## The Solution: Chat History

Store and pass previous messages:

\`\`\`python
from langchain_core.messages import HumanMessage, AIMessage

history = []

# Add messages to history
history.append(HumanMessage(content="My name is Alice"))
history.append(AIMessage(content="Nice to meet you, Alice!"))

# Pass history with new message
history.append(HumanMessage(content="What's my name?"))
response = llm.invoke(history)
# "Your name is Alice!"
\`\`\`

## Message Types

| Type | Purpose |
|------|---------|
| \`HumanMessage\` | User messages |
| \`AIMessage\` | Assistant responses |
| \`SystemMessage\` | System instructions |

## Your Task

1. Create a simple chatbot with memory
2. Store conversation history
3. Test that it remembers context`,

  solutionContent: `# Solution: Memory

\`\`\`python
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini")

# Initialize history with system message
history = [
    SystemMessage(content="You are a helpful assistant. Be concise.")
]

def chat(user_message):
    # Add user message to history
    history.append(HumanMessage(content=user_message))

    # Get response
    response = llm.invoke(history)

    # Add AI response to history
    history.append(AIMessage(content=response.content))

    return response.content

# Test conversation
print("User: My name is Bob")
print("AI:", chat("My name is Bob"))

print("\\nUser: What's my name?")
print("AI:", chat("What's my name?"))

print("\\nUser: What was the first thing I said?")
print("AI:", chat("What was the first thing I said?"))
\`\`\`

## Output
\`\`\`
User: My name is Bob
AI: Nice to meet you, Bob!

User: What's my name?
AI: Your name is Bob.

User: What was the first thing I said?
AI: You said "My name is Bob"
\`\`\``,

  explanationContent: `# Deep Dive: Memory Strategies

## Windowed Memory

Only keep last N messages:

\`\`\`python
def get_recent_history(history, n=10):
    # Keep system message + last n messages
    return history[:1] + history[-n:]
\`\`\`

## Summary Memory

Summarize old conversations:

\`\`\`python
# When history gets long, summarize it
if len(history) > 20:
    summary = summarize_chain.invoke(history)
    history = [
        SystemMessage(content=f"Previous summary: {summary}"),
        *history[-5:]  # Keep recent messages
    ]
\`\`\`

## Token-Based Memory

Limit by token count:

\`\`\`python
# Keep messages until token limit
def trim_to_tokens(history, max_tokens=4000):
    # Count tokens and trim from start
    pass
\`\`\``,

  realworldContent: `# Real-World Memory

## Production Chatbot

\`\`\`python
class Chatbot:
    def __init__(self, user_id):
        self.user_id = user_id
        self.history = self.load_history()

    def chat(self, message):
        response = self.get_response(message)
        self.save_history()
        return response

    def load_history(self):
        # Load from database
        return db.get_history(self.user_id)

    def save_history(self):
        # Save to database
        db.save_history(self.user_id, self.history)
\`\`\``,

  mistakesContent: `# Common Mistakes

## 1. Not Adding AI Response

\`\`\`python
# Wrong - only add human message
history.append(HumanMessage(content=user_msg))
response = llm.invoke(history)
# AI response not saved!

# Right - add both
history.append(HumanMessage(content=user_msg))
response = llm.invoke(history)
history.append(AIMessage(content=response.content))
\`\`\`

## 2. Unlimited History

\`\`\`python
# Wrong - history grows forever
# Eventually hits context limit!

# Right - trim history
if len(history) > 50:
    history = history[:1] + history[-20:]
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: How does memory work in LangChain?

**Answer:** Store messages in a list. Pass full history to LLM with each call. LLM sees context and responds appropriately.

## Q2: How to handle long conversations?

**Answer:** Trim old messages (windowed), summarize old context, or use token-based limits.`,

  starterCode: `from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini")

# Initialize history
history = [
    SystemMessage(content="You are a helpful assistant. Be concise.")
]

def chat(user_message):
    # 1. Add user message to history
    history.append(HumanMessage(content=user_message))

    # 2. Get response from LLM
    response = llm.invoke(history)

    # 3. Add AI response to history
    history.append(AIMessage(content=response.content))

    return response.content

# Test it!
print(chat("My name is Alice"))
print(chat("What's my name?"))`,

  solutionCode: `from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini")

# Initialize history
history = [
    SystemMessage(content="You are a helpful assistant. Be concise.")
]

def chat(user_message):
    # 1. Add user message to history
    history.append(HumanMessage(content=user_message))

    # 2. Get response from LLM
    response = llm.invoke(history)

    # 3. Add AI response to history
    history.append(AIMessage(content=response.content))

    return response.content

# Test it!
print(chat("My name is Alice"))
print(chat("What's my name?"))`,

  hints: [
    "History is a list of Message objects",
    "Add HumanMessage before calling LLM",
    "Add AIMessage after getting response",
    "response.content gives the text"
  ]
};
