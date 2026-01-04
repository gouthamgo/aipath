import type { LessonContent } from '../types';

export const agentMemory: LessonContent = {
  slug: "agent-memory",
  problemContent: `# Agent Memory Systems

Agents need memory to be truly useful!

## Types of Memory

| Type | Duration | Example |
|------|----------|---------|
| Working | Current task | Conversation history |
| Short-term | Session | Recent interactions |
| Long-term | Persistent | User preferences |

## Why Memory Matters

Without memory:
- Agent forgets previous steps
- Can't learn from past interactions
- Repeats mistakes
- No personalization

## Memory Strategies

\`\`\`python
# 1. Conversation buffer
memory = []  # Keep all messages

# 2. Summary memory
summary = summarize(old_messages)

# 3. Vector memory
similar = vector_db.search(current_context)
\`\`\`

## Your Task

Implement different memory strategies.`,
  solutionContent: `# Solution: Memory Implementations

\`\`\`python
from openai import OpenAI
from collections import deque

client = OpenAI()

# 1. BUFFER MEMORY - Keep last N messages
class BufferMemory:
    def __init__(self, max_messages: int = 10):
        self.messages = deque(maxlen=max_messages)

    def add(self, role: str, content: str):
        self.messages.append({"role": role, "content": content})

    def get_messages(self) -> list:
        return list(self.messages)

# 2. SUMMARY MEMORY - Summarize old messages
class SummaryMemory:
    def __init__(self, max_messages: int = 5):
        self.max_messages = max_messages
        self.messages = []
        self.summary = ""

    def add(self, role: str, content: str):
        self.messages.append({"role": role, "content": content})

        if len(self.messages) > self.max_messages:
            self._summarize_old()

    def _summarize_old(self):
        old = self.messages[:-self.max_messages]

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{
                "role": "user",
                "content": f"Summarize this conversation briefly:\\n{old}"
            }]
        )

        self.summary = response.choices[0].message.content
        self.messages = self.messages[-self.max_messages:]

    def get_messages(self) -> list:
        msgs = []
        if self.summary:
            msgs.append({
                "role": "system",
                "content": f"Previous conversation summary: {self.summary}"
            })
        msgs.extend(self.messages)
        return msgs

# 3. Using memory in agent
def agent_with_memory(user_input: str, memory: BufferMemory) -> str:
    memory.add("user", user_input)

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            *memory.get_messages()
        ]
    )

    reply = response.choices[0].message.content
    memory.add("assistant", reply)

    return reply

# Test
memory = BufferMemory(max_messages=6)
print(agent_with_memory("My name is Alice", memory))
print(agent_with_memory("What's my name?", memory))  # Should remember!
\`\`\``,
  explanationContent: `# Memory Systems Deep Dive

## Buffer Memory

\`\`\`
[msg1, msg2, msg3, msg4, msg5]
                    ↑
              max_messages=5

New message → msg6
[msg2, msg3, msg4, msg5, msg6]
  ↑
msg1 dropped
\`\`\`

## Summary Memory

\`\`\`
Before summarization:
[msg1, msg2, msg3, msg4, msg5, msg6, msg7]

After summarization:
[summary of msg1-4] + [msg5, msg6, msg7]

Pros: Unlimited history, fixed token cost
Cons: Loses detail, summarization cost
\`\`\`

## Vector Memory

\`\`\`python
# Store memories as vectors
memory_db.add(
    text="User prefers dark mode",
    embedding=embed("User prefers dark mode"),
    metadata={"type": "preference", "date": "2024-01"}
)

# Retrieve relevant memories
relevant = memory_db.search(
    query=embed("What theme should I use?"),
    top_k=3
)
\`\`\`

## Choosing Memory Type

| Use Case | Recommended |
|----------|-------------|
| Short conversations | Buffer |
| Long conversations | Summary |
| User preferences | Vector |
| Knowledge base | Vector |`,
  realworldContent: `# Real-World: Personal Assistant

## Scenario: Long-term User Memory

\`\`\`python
class PersonalAssistant:
    def __init__(self, user_id: str):
        self.user_id = user_id
        self.session_memory = BufferMemory()
        self.user_profile = self.load_profile(user_id)
        self.vector_memory = VectorMemory(user_id)

    def chat(self, message: str) -> str:
        # Get relevant past interactions
        relevant_memories = self.vector_memory.search(message)

        # Build context
        context = f"""
User Profile: {self.user_profile}
Relevant History: {relevant_memories}
"""

        response = self.generate_response(
            context=context,
            history=self.session_memory.get_messages(),
            message=message
        )

        # Store for future
        self.session_memory.add("user", message)
        self.session_memory.add("assistant", response)
        self.vector_memory.add(f"User: {message}\\nAssistant: {response}")

        return response
\`\`\`

## Memory Categories

| Category | Examples |
|----------|----------|
| Facts | Name, location, job |
| Preferences | Dark mode, formal tone |
| History | Past requests, outcomes |
| Relationships | Team members, contacts |`,
  mistakesContent: `# Common Mistakes

## 1. Unbounded Memory

\`\`\`python
# WRONG - Memory grows forever
self.messages.append(new_message)

# RIGHT - Limit size
self.messages = deque(maxlen=100)
# or use summary/vector memory
\`\`\`

## 2. No Memory Isolation

\`\`\`python
# WRONG - All users share memory
memory = BufferMemory()

# RIGHT - Per-user memory
user_memories = {}
def get_memory(user_id):
    if user_id not in user_memories:
        user_memories[user_id] = BufferMemory()
    return user_memories[user_id]
\`\`\`

## 3. Storing Sensitive Data

\`\`\`python
# WRONG - Storing raw sensitive data
memory.add(f"User's SSN is {ssn}")

# RIGHT - Don't store sensitive info, or encrypt
memory.add("User verified their identity")
\`\`\`

## 4. Not Clearing Memory

\`\`\`python
# WRONG - Old context pollutes new sessions
# User logs out but memory persists

# RIGHT - Clear session memory
def logout(user_id):
    session_memories[user_id].clear()
\`\`\``,
  interviewContent: `# Interview Questions

## Q1: How do you handle memory across long conversations?

**Answer**:
1. Use summary memory to compress old messages
2. Store key facts in structured format
3. Use vector memory for semantic retrieval
4. Periodically prune irrelevant memories

## Q2: How do you implement persistent memory across sessions?

**Answer**:
1. Store in database (SQL for structured, vector for semantic)
2. Load relevant memories at session start
3. Update memories during conversation
4. Handle memory conflicts/updates

## Q3: What are the privacy considerations for agent memory?

**Answer**:
1. Get user consent for data storage
2. Encrypt sensitive memories
3. Implement data retention policies
4. Allow users to view/delete their data
5. Anonymize for analytics`,
  starterCode: `from openai import OpenAI
from collections import deque

client = OpenAI()

# TODO: Implement BufferMemory class
class BufferMemory:
    def __init__(self, max_messages: int = 10):
        # TODO: Initialize with deque
        pass

    def add(self, role: str, content: str):
        # TODO: Add message to memory
        pass

    def get_messages(self) -> list:
        # TODO: Return messages as list
        pass

# TODO: Create agent that uses memory
def chat_with_memory(user_input: str, memory: BufferMemory) -> str:
    # TODO: Add user message to memory
    # TODO: Call LLM with memory context
    # TODO: Add response to memory
    # TODO: Return response
    pass

# Test memory
memory = BufferMemory(max_messages=10)
print(chat_with_memory("My favorite color is blue", memory))
print(chat_with_memory("What's my favorite color?", memory))`,
  solutionCode: `from openai import OpenAI
from collections import deque

client = OpenAI()

class BufferMemory:
    def __init__(self, max_messages: int = 10):
        self.messages = deque(maxlen=max_messages)

    def add(self, role: str, content: str):
        self.messages.append({"role": role, "content": content})

    def get_messages(self) -> list:
        return list(self.messages)

def chat_with_memory(user_input: str, memory: BufferMemory) -> str:
    memory.add("user", user_input)

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant with memory of our conversation."},
            *memory.get_messages()
        ]
    )

    reply = response.choices[0].message.content
    memory.add("assistant", reply)

    return reply

# Test memory
memory = BufferMemory(max_messages=10)
print(chat_with_memory("My favorite color is blue", memory))
print(chat_with_memory("What's my favorite color?", memory))`,
  hints: [
    "Use deque(maxlen=N) to automatically limit memory size",
    "Store messages as dictionaries with 'role' and 'content' keys",
    "Spread memory messages into the API call with *memory.get_messages()"
  ]
};
