import type { LessonContent } from '../types';

export const streamingResponses: LessonContent = {
  slug: "streaming-responses",
  problemContent: `# Streaming LLM Responses

Streaming provides real-time feedback to users instead of waiting for the complete response.

## Why Stream?

| Blocking | Streaming |
|----------|-----------|
| Wait 5-30 seconds | See text immediately |
| Poor UX | Great UX |
| Timeout risk | Continuous feedback |

## Streaming Flow

\`\`\`
User Request
     │
     ▼
┌─────────────┐
│   LLM API   │
└──────┬──────┘
       │ chunks
       ▼
┌─────────────┐
│   Client    │ ◄── Real-time display
└─────────────┘
\`\`\`

## Your Task

Implement streaming for both API calls and Server-Sent Events.`,

  solutionContent: `# Solution: Streaming Implementation

## OpenAI Streaming

\`\`\`python
from openai import OpenAI

client = OpenAI()

def stream_completion(prompt: str):
    """Stream response from OpenAI."""
    stream = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        stream=True
    )

    full_response = ""
    for chunk in stream:
        if chunk.choices[0].delta.content:
            content = chunk.choices[0].delta.content
            full_response += content
            print(content, end="", flush=True)

    print()  # New line at end
    return full_response

# Usage
response = stream_completion("Write a haiku about coding")
\`\`\`

## FastAPI Server-Sent Events

\`\`\`python
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import asyncio

app = FastAPI()

async def generate_stream(prompt: str):
    """Async generator for SSE."""
    stream = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        stream=True
    )

    for chunk in stream:
        if chunk.choices[0].delta.content:
            content = chunk.choices[0].delta.content
            yield f"data: {content}\\n\\n"
            await asyncio.sleep(0)  # Allow other tasks

    yield "data: [DONE]\\n\\n"

@app.get("/stream")
async def stream_endpoint(prompt: str):
    return StreamingResponse(
        generate_stream(prompt),
        media_type="text/event-stream"
    )
\`\`\``,

  explanationContent: `# Understanding Streaming

## How Streaming Works

1. Client opens connection
2. Server sends chunks as they're generated
3. Client processes each chunk
4. Connection closes when complete

## Token-by-Token Generation

LLMs generate text one token at a time:

\`\`\`
Token 1: "The"
Token 2: " capital"
Token 3: " of"
Token 4: " France"
Token 5: " is"
Token 6: " Paris"
\`\`\`

Streaming exposes this natural generation process.

## SSE vs WebSockets

| SSE | WebSockets |
|-----|------------|
| One-way | Bidirectional |
| Simpler | More complex |
| Auto-reconnect | Manual handling |
| Text only | Binary support |

For LLM streaming, SSE is usually preferred.`,

  realworldContent: `# Production Streaming

## Frontend Integration (JavaScript)

\`\`\`javascript
async function streamChat(prompt) {
    const response = await fetch('/api/stream', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
        headers: { 'Content-Type': 'application/json' }
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        // Update UI with chunk
        updateChatUI(chunk);
    }
}
\`\`\`

## Error Handling

\`\`\`python
async def robust_stream(prompt: str):
    try:
        async for chunk in generate_stream(prompt):
            yield chunk
    except Exception as e:
        yield f"data: {json.dumps({'error': str(e)})}\\n\\n"
    finally:
        yield "data: [DONE]\\n\\n"
\`\`\``,

  mistakesContent: `# Common Streaming Mistakes

## 1. Not Flushing Output
**Wrong**: Buffer chunks before sending
**Right**: Flush immediately for real-time feel

## 2. Blocking the Event Loop
**Wrong**: Synchronous processing in async handler
**Right**: Use async/await properly

## 3. No Error Handling
**Wrong**: Let errors crash the stream
**Right**: Catch and send error events

## 4. Ignoring Connection Drops
**Wrong**: Continue processing after disconnect
**Right**: Check connection status, cleanup resources`,

  interviewContent: `# Interview Questions

## Q1: How does streaming improve UX?

**Answer**:
- Users see immediate feedback
- Reduces perceived latency
- Allows reading while generating
- Enables early cancellation

## Q2: How do you handle streaming errors?

**Answer**:
- Wrap stream in try/catch
- Send error event to client
- Always send completion signal
- Implement reconnection logic

## Q3: When should you NOT use streaming?

**Answer**:
- Short responses (< 100 tokens)
- Batch processing
- When full response needed for validation
- Simple yes/no answers`,

  starterCode: `from openai import OpenAI

client = OpenAI()

def stream_completion(prompt: str) -> str:
    """Stream response and return full text."""
    # TODO: Implement streaming
    # 1. Call API with stream=True
    # 2. Iterate over chunks
    # 3. Print each chunk immediately
    # 4. Collect and return full response
    pass

# Test
response = stream_completion("Count from 1 to 5")
print(f"\\nFull response: {response}")`,

  solutionCode: `from openai import OpenAI

client = OpenAI()

def stream_completion(prompt: str) -> str:
    """Stream response and return full text."""
    stream = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        stream=True
    )

    full_response = ""
    for chunk in stream:
        content = chunk.choices[0].delta.content
        if content:
            full_response += content
            print(content, end="", flush=True)

    print()  # New line at end
    return full_response

# Test
response = stream_completion("Count from 1 to 5")
print(f"\\nFull response: {response}")`,

  hints: [
    "Set stream=True in the API call",
    "Access content via chunk.choices[0].delta.content",
    "Use flush=True with print for immediate output",
    "Check if content is not None before printing",
    "Collect chunks into full_response string"
  ]
};
