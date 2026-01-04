import type { LessonContent } from '../types';

export const streamingBasics: LessonContent = {
  slug: "streaming-basics",
  problemContent: `# Streaming Responses

Stream tokens as they're generated for a better UX!

## Why Streaming?

- **Without streaming:** Wait 5-10 seconds, then see everything
- **With streaming:** See words appear in real-time

## Basic Streaming

\`\`\`python
from openai import OpenAI

client = OpenAI()

stream = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Tell me a story"}],
    stream=True
)

for chunk in stream:
    content = chunk.choices[0].delta.content
    if content:
        print(content, end="", flush=True)
\`\`\`

## Understanding Chunks

Each chunk contains:
\`\`\`python
{
    "choices": [{
        "delta": {
            "content": "word"  # Partial content
        }
    }]
}
\`\`\`

## Your Task

Create a function that:
1. Streams a response
2. Collects all chunks into full text
3. Prints character by character with delay`,

  solutionContent: `# Solution: Streaming

\`\`\`python
from openai import OpenAI
import sys
import time

client = OpenAI()

def stream_response(prompt, typing_delay=0.02):
    """Stream response with typing effect"""
    stream = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        stream=True
    )

    full_response = []

    for chunk in stream:
        content = chunk.choices[0].delta.content
        if content:
            full_response.append(content)
            # Print with typing effect
            for char in content:
                print(char, end="", flush=True)
                time.sleep(typing_delay)

    print()  # Newline at end
    return "".join(full_response)

def stream_to_list(prompt):
    """Stream and collect chunks"""
    stream = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        stream=True
    )

    chunks = []
    for chunk in stream:
        content = chunk.choices[0].delta.content
        if content:
            chunks.append(content)
            print(content, end="", flush=True)

    print()
    return {
        "chunks": chunks,
        "full_text": "".join(chunks),
        "chunk_count": len(chunks)
    }

# Usage
result = stream_to_list("Explain AI in 3 sentences")
print(f"\\nReceived {result['chunk_count']} chunks")
\`\`\``,

  explanationContent: `# Deep Dive: Streaming

## Server-Sent Events (SSE)

OpenAI uses SSE format:
\`\`\`
data: {"id":"...","choices":[{"delta":{"content":"Hello"}}]}
data: {"id":"...","choices":[{"delta":{"content":" world"}}]}
data: [DONE]
\`\`\`

## Async Streaming

\`\`\`python
import asyncio
from openai import AsyncOpenAI

client = AsyncOpenAI()

async def stream_async(prompt):
    stream = await client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        stream=True
    )

    async for chunk in stream:
        content = chunk.choices[0].delta.content
        if content:
            print(content, end="", flush=True)

asyncio.run(stream_async("Hello!"))
\`\`\`

## With LangChain

\`\`\`python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(streaming=True)

for chunk in llm.stream("Tell me a joke"):
    print(chunk.content, end="", flush=True)
\`\`\``,

  realworldContent: `# Real-World Applications

## 1. Chat Interface
\`\`\`python
async def chat_handler(websocket, message):
    stream = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": message}],
        stream=True
    )

    for chunk in stream:
        content = chunk.choices[0].delta.content
        if content:
            await websocket.send(content)
\`\`\`

## 2. Progress Indicator
\`\`\`python
def stream_with_progress(prompt):
    start = time.time()
    token_count = 0

    for chunk in stream:
        token_count += 1
        elapsed = time.time() - start
        tokens_per_sec = token_count / elapsed
        print(f"\\rTokens: {token_count} ({tokens_per_sec:.1f}/s)", end="")
\`\`\``,

  mistakesContent: `# Common Mistakes

## 1. Forgetting flush=True
\`\`\`python
# Bad - output buffers
print(content, end="")

# Good - immediate output
print(content, end="", flush=True)
\`\`\`

## 2. Not Handling None Content
\`\`\`python
# Bad - crashes on None
print(chunk.choices[0].delta.content)

# Good - check first
content = chunk.choices[0].delta.content
if content:
    print(content, end="", flush=True)
\`\`\`

## 3. Not Collecting Full Response
\`\`\`python
# Need to collect if you need the full text later
chunks = []
for chunk in stream:
    content = chunk.choices[0].delta.content
    if content:
        chunks.append(content)
full_text = "".join(chunks)
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: Why use streaming?
**Answer:** Better UX - users see responses immediately instead of waiting. Also enables real-time features like typing indicators.

## Q2: How does streaming work?
**Answer:** Server sends Server-Sent Events (SSE). Each event contains a partial response. Client processes chunks as they arrive.

## Q3: Streaming trade-offs?
**Answer:** Pros: Better UX, time-to-first-token. Cons: More complex code, can't easily post-process full response, harder error handling.`,

  starterCode: `from openai import OpenAI

client = OpenAI()

def stream_response(prompt):
    """Stream a response and collect it"""
    stream = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        stream=True
    )

    full_response = []

    for chunk in stream:
        # TODO: Extract content from chunk
        # TODO: Print it immediately (with flush)
        # TODO: Collect in full_response
        pass

    return "".join(full_response)

# Test
result = stream_response("Count from 1 to 5")
print(f"\\nFull response: {result}")`,

  solutionCode: `from openai import OpenAI

client = OpenAI()

def stream_response(prompt):
    """Stream a response and collect it"""
    stream = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        stream=True
    )

    full_response = []

    for chunk in stream:
        content = chunk.choices[0].delta.content
        if content:
            print(content, end="", flush=True)
            full_response.append(content)

    print()  # Newline at end
    return "".join(full_response)

# Test
result = stream_response("Count from 1 to 5")
print(f"Full response: {result}")`,

  hints: [
    "Access content via chunk.choices[0].delta.content",
    "Check if content is not None before using",
    "Use end=\"\" and flush=True for real-time output",
    "Append to list and join at end for full text"
  ]
};
