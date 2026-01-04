import type { LessonContent } from '../types';

export const fastapiBasics: LessonContent = {
  slug: "fastapi-basics",
  problemContent: `# FastAPI for AI Applications

FastAPI is the fastest way to build production AI APIs in Python!

## FastAPI Features

| Feature | Use Case | Example |
|---------|----------|---------|
| APIRouter | Modular routes | Group related endpoints |
| Depends() | Dependency injection | Shared OpenAI client |
| BackgroundTasks | Async operations | Logging, analytics |
| StreamingResponse | Real-time output | SSE for AI streaming |

## Basic FastAPI App

\`\`\`python
from fastapi import FastAPI, Depends
from openai import OpenAI

app = FastAPI()

def get_client():
    return OpenAI()

@app.post("/chat")
async def chat(prompt: str, client: OpenAI = Depends(get_client)):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )
    return {"response": response.choices[0].message.content}
\`\`\`

## Your Task

1. Create modular routes using APIRouter
2. Add dependency injection for shared resources
3. Implement background tasks for logging
4. Add streaming responses for real-time AI output`,
  solutionContent: `# Solution: FastAPI AI Application

This solution demonstrates FastAPI best practices:

## Key Features

1. **APIRouter**: Modular route organization
2. **Dependency Injection**: Shared resources without global state
3. **Background Tasks**: Non-blocking async operations
4. **StreamingResponse**: Real-time AI output via SSE
5. **Lifespan Events**: Proper startup/shutdown handling`,
  explanationContent: `# FastAPI Deep Dive

## Why FastAPI for AI?

FastAPI is ideal for AI applications because:
- **Async Support**: Handle concurrent AI requests efficiently
- **Type Safety**: Pydantic validation prevents errors
- **Auto Docs**: OpenAPI documentation generated automatically
- **Performance**: One of the fastest Python frameworks

## Application Structure

### Modular Routes with APIRouter
\`\`\`python
from fastapi import APIRouter, FastAPI

# routes/generation.py
generation_router = APIRouter(prefix="/generations", tags=["Generation"])

@generation_router.post("/")
async def create_generation(request: GenerationRequest):
    ...

@generation_router.get("/{id}")
async def get_generation(id: str):
    ...

# routes/models.py
models_router = APIRouter(prefix="/models", tags=["Models"])

@models_router.get("/")
async def list_models():
    ...

# main.py
app = FastAPI()
app.include_router(generation_router)
app.include_router(models_router)
\`\`\`

## Dependency Injection

### Shared Resources
\`\`\`python
from functools import lru_cache
from openai import OpenAI

class Settings:
    openai_api_key: str
    model_name: str = "gpt-4"

@lru_cache
def get_settings():
    return Settings()

def get_openai_client(settings: Settings = Depends(get_settings)):
    return OpenAI(api_key=settings.openai_api_key)

@app.post("/generate")
async def generate(
    request: GenerationRequest,
    client: OpenAI = Depends(get_openai_client)
):
    response = client.chat.completions.create(...)
    return response
\`\`\`

### Request-Scoped Dependencies
\`\`\`python
import uuid
from contextvars import ContextVar

request_id_var: ContextVar[str] = ContextVar("request_id")

async def get_request_id():
    request_id = str(uuid.uuid4())
    request_id_var.set(request_id)
    return request_id

@app.post("/generate")
async def generate(
    request: GenerationRequest,
    request_id: str = Depends(get_request_id)
):
    logger.info(f"[{request_id}] Processing request")
    ...
\`\`\`

## Streaming Responses

### Server-Sent Events (SSE)
\`\`\`python
from fastapi.responses import StreamingResponse
import json

async def generate_stream(prompt: str, client: OpenAI):
    stream = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        stream=True
    )

    for chunk in stream:
        if chunk.choices[0].delta.content:
            data = {"content": chunk.choices[0].delta.content}
            yield f"data: {json.dumps(data)}\\n\\n"

    yield "data: [DONE]\\n\\n"

@app.post("/generate/stream")
async def stream_generation(request: GenerationRequest):
    return StreamingResponse(
        generate_stream(request.prompt, openai_client),
        media_type="text/event-stream"
    )
\`\`\`

## Background Tasks

### Non-Blocking Operations
\`\`\`python
from fastapi import BackgroundTasks

async def log_usage(request_id: str, tokens: int, model: str):
    # Log to database or analytics service
    await analytics.track({
        "event": "generation_completed",
        "request_id": request_id,
        "tokens": tokens,
        "model": model
    })

@app.post("/generate")
async def generate(
    request: GenerationRequest,
    background_tasks: BackgroundTasks
):
    response = await generate_content(request)

    # Schedule background task - doesn't block response
    background_tasks.add_task(
        log_usage,
        request_id=response.id,
        tokens=response.usage.total_tokens,
        model=request.model
    )

    return response
\`\`\`

## Lifespan Events

### Startup and Shutdown
\`\`\`python
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Starting up...")
    app.state.openai_client = OpenAI()
    app.state.db = await database.connect()

    yield  # Application runs here

    # Shutdown
    print("Shutting down...")
    await app.state.db.disconnect()

app = FastAPI(lifespan=lifespan)
\`\`\`
  `,
  realworldContent: `# Production FastAPI Application

## Complete Application Structure

\`\`\`python
# main.py
from fastapi import FastAPI, Depends, BackgroundTasks, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from openai import OpenAI
from pydantic import BaseModel, Field
from typing import Optional, AsyncGenerator
import json
import time
import uuid

# Lifespan for startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    app.state.openai_client = OpenAI()
    app.state.request_count = 0
    print("Application started")
    yield
    # Shutdown
    print("Application shutting down")

app = FastAPI(
    title="AI Writing Assistant API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Models
class GenerationRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=10000)
    model: str = "gpt-4"
    max_tokens: int = Field(default=1000, ge=1, le=4000)
    temperature: float = Field(default=0.7, ge=0, le=2)
    stream: bool = False

class GenerationResponse(BaseModel):
    id: str
    content: str
    model: str
    tokens_used: int
    processing_time_ms: float

# Dependencies
def get_openai_client():
    return app.state.openai_client

def get_request_id():
    return str(uuid.uuid4())

# Background tasks
async def log_request(request_id: str, model: str, tokens: int, duration_ms: float):
    # In production: send to analytics/logging service
    print(f"[{request_id}] model={model} tokens={tokens} duration={duration_ms:.0f}ms")
    app.state.request_count += 1

# Streaming generator
async def stream_response(
    prompt: str,
    model: str,
    max_tokens: int,
    temperature: float,
    client: OpenAI,
    request_id: str
) -> AsyncGenerator[str, None]:
    start_time = time.time()
    total_tokens = 0

    try:
        stream = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=max_tokens,
            temperature=temperature,
            stream=True
        )

        for chunk in stream:
            if chunk.choices[0].delta.content:
                content = chunk.choices[0].delta.content
                total_tokens += 1  # Approximate
                yield f"data: {json.dumps({'content': content, 'request_id': request_id})}\\n\\n"

        # Send completion message
        duration_ms = (time.time() - start_time) * 1000
        yield f"data: {json.dumps({'done': True, 'tokens': total_tokens, 'duration_ms': duration_ms})}\\n\\n"

    except Exception as e:
        yield f"data: {json.dumps({'error': str(e)})}\\n\\n"

# Endpoints
@app.post("/api/v1/generate", response_model=GenerationResponse)
async def generate(
    request: GenerationRequest,
    background_tasks: BackgroundTasks,
    client: OpenAI = Depends(get_openai_client),
    request_id: str = Depends(get_request_id)
):
    start_time = time.time()

    # Handle streaming requests
    if request.stream:
        return StreamingResponse(
            stream_response(
                request.prompt,
                request.model,
                request.max_tokens,
                request.temperature,
                client,
                request_id
            ),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "X-Request-ID": request_id
            }
        )

    # Non-streaming request
    try:
        response = client.chat.completions.create(
            model=request.model,
            messages=[{"role": "user", "content": request.prompt}],
            max_tokens=request.max_tokens,
            temperature=request.temperature
        )

        duration_ms = (time.time() - start_time) * 1000
        tokens_used = response.usage.total_tokens

        # Log in background
        background_tasks.add_task(
            log_request,
            request_id,
            request.model,
            tokens_used,
            duration_ms
        )

        return GenerationResponse(
            id=request_id,
            content=response.choices[0].message.content,
            model=request.model,
            tokens_used=tokens_used,
            processing_time_ms=duration_ms
        )

    except Exception as e:
        raise HTTPException(status_code=503, detail=f"AI service error: {str(e)}")

@app.get("/api/v1/health")
async def health():
    return {
        "status": "healthy",
        "requests_processed": app.state.request_count
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
\`\`\`

## Client-Side Streaming

\`\`\`javascript
// JavaScript client for SSE
const response = await fetch('/api/v1/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: 'Write a story', stream: true })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const text = decoder.decode(value);
    const lines = text.split('\\n');

    for (const line of lines) {
        if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            if (data.content) {
                process.stdout.write(data.content);
            }
        }
    }
}
\`\`\`
  `,
  mistakesContent: `# Common FastAPI Mistakes

## Mistake 1: Blocking the Event Loop

### Wrong
\`\`\`python
import time

@app.post("/generate")
async def generate(request: GenerationRequest):
    # BLOCKING! This blocks the entire event loop
    time.sleep(5)
    response = openai.chat.completions.create(...)  # Sync call in async function
    return response
\`\`\`

### Correct
\`\`\`python
import asyncio

@app.post("/generate")
async def generate(request: GenerationRequest):
    # Use async sleep
    await asyncio.sleep(5)

    # Use async client or run in thread pool
    response = await asyncio.to_thread(
        openai.chat.completions.create,
        model="gpt-4",
        messages=[{"role": "user", "content": request.prompt}]
    )
    return response
\`\`\`

## Mistake 2: Creating Clients Per Request

### Wrong
\`\`\`python
@app.post("/generate")
async def generate(request: GenerationRequest):
    # Creates new client for EVERY request - expensive!
    client = OpenAI()
    return client.chat.completions.create(...)
\`\`\`

### Correct
\`\`\`python
# Use dependency injection with cached client
@lru_cache
def get_openai_client():
    return OpenAI()

@app.post("/generate")
async def generate(
    request: GenerationRequest,
    client: OpenAI = Depends(get_openai_client)
):
    return client.chat.completions.create(...)
\`\`\`

## Mistake 3: Not Handling Streaming Errors

### Wrong
\`\`\`python
async def stream_response(prompt: str):
    stream = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        stream=True
    )
    # If error occurs mid-stream, client gets incomplete response
    for chunk in stream:
        yield f"data: {chunk.choices[0].delta.content}\\n\\n"
\`\`\`

### Correct
\`\`\`python
async def stream_response(prompt: str):
    try:
        stream = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            stream=True
        )
        for chunk in stream:
            if chunk.choices[0].delta.content:
                yield f"data: {json.dumps({'content': chunk.choices[0].delta.content})}\\n\\n"
        yield f"data: {json.dumps({'done': True})}\\n\\n"
    except Exception as e:
        yield f"data: {json.dumps({'error': str(e)})}\\n\\n"
\`\`\`

## Mistake 4: Global State Without Lifespan

### Wrong
\`\`\`python
# Global state - problematic for testing and cleanup
client = OpenAI()
db = Database()

@app.post("/generate")
async def generate(request: GenerationRequest):
    return client.chat.completions.create(...)
\`\`\`

### Correct
\`\`\`python
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize on startup
    app.state.client = OpenAI()
    app.state.db = await Database.connect()
    yield
    # Cleanup on shutdown
    await app.state.db.disconnect()

app = FastAPI(lifespan=lifespan)

def get_client():
    return app.state.client

@app.post("/generate")
async def generate(
    request: GenerationRequest,
    client: OpenAI = Depends(get_client)
):
    return client.chat.completions.create(...)
\`\`\`
  `,
  interviewContent: `# FastAPI Interview Questions

## Q1: How do you handle long-running AI requests in FastAPI?

**Answer:**
Three approaches depending on requirements:

1. **Streaming** for real-time output:
\`\`\`python
@app.post("/generate/stream")
async def stream(request: GenerationRequest):
    return StreamingResponse(
        generate_stream(request),
        media_type="text/event-stream"
    )
\`\`\`

2. **Background Tasks** for fire-and-forget:
\`\`\`python
@app.post("/generate")
async def generate(request: GenerationRequest, background_tasks: BackgroundTasks):
    job_id = str(uuid.uuid4())
    background_tasks.add_task(process_generation, job_id, request)
    return {"job_id": job_id}
\`\`\`

3. **Task Queue** (Celery/Redis) for heavy workloads:
\`\`\`python
@app.post("/generate")
async def generate(request: GenerationRequest):
    task = celery_app.send_task("generate", args=[request.dict()])
    return {"task_id": task.id}
\`\`\`

## Q2: How does FastAPI's dependency injection work?

**Answer:**
FastAPI uses a dependency graph resolved at request time:

\`\`\`python
# Dependencies can depend on other dependencies
def get_settings():
    return Settings()

def get_db(settings: Settings = Depends(get_settings)):
    return Database(settings.db_url)

def get_repository(db: Database = Depends(get_db)):
    return Repository(db)

@app.get("/items")
async def get_items(repo: Repository = Depends(get_repository)):
    return repo.get_all()
\`\`\`

Benefits:
- Testable (easily mock dependencies)
- Reusable (shared across endpoints)
- Declarative (clear dependency graph)

## Q3: How do you scale FastAPI for production?

**Answer:**
Key strategies:

1. **Multiple Workers**: Use Gunicorn with Uvicorn workers
\`\`\`bash
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
\`\`\`

2. **Async Everything**: Use async libraries (httpx, asyncpg)

3. **Connection Pooling**: Reuse database/API connections

4. **Caching**: Redis for response caching

5. **Load Balancing**: Nginx/HAProxy in front

## Q4: What's the difference between sync and async endpoints?

**Answer:**
\`\`\`python
# Sync - runs in thread pool, can block other sync handlers
@app.get("/sync")
def sync_endpoint():
    time.sleep(1)  # Blocks thread
    return {"message": "done"}

# Async - runs in event loop, non-blocking
@app.get("/async")
async def async_endpoint():
    await asyncio.sleep(1)  # Yields to event loop
    return {"message": "done"}
\`\`\`

Use async when doing I/O (API calls, DB queries).
Use sync for CPU-bound work that would block the event loop.
  `,
  starterCode: `from fastapi import FastAPI, Depends, BackgroundTasks
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from openai import OpenAI

app = FastAPI()

# TODO: Add lifespan for startup/shutdown

# TODO: Create dependency for OpenAI client

# TODO: Create background task for logging

# TODO: Create streaming generator

# TODO: Create generation endpoint with optional streaming
class GenerationRequest(BaseModel):
    prompt: str
    stream: bool = False

@app.post("/generate")
async def generate(request: GenerationRequest):
    pass
`,
  solutionCode: `from fastapi import FastAPI, Depends, BackgroundTasks, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from contextlib import asynccontextmanager
from openai import OpenAI
from typing import AsyncGenerator
import json
import time
import uuid

# Lifespan for startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    app.state.openai_client = OpenAI()
    app.state.total_requests = 0
    print("Application started")
    yield
    # Shutdown
    print(f"Shutting down. Total requests: {app.state.total_requests}")

app = FastAPI(title="AI Generation API", lifespan=lifespan)

# Request model
class GenerationRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=5000)
    model: str = "gpt-4"
    max_tokens: int = Field(default=1000, ge=1, le=4000)
    temperature: float = Field(default=0.7, ge=0, le=2)
    stream: bool = False

class GenerationResponse(BaseModel):
    id: str
    content: str
    model: str
    tokens_used: int
    processing_time_ms: float

# Dependency for OpenAI client
def get_openai_client() -> OpenAI:
    return app.state.openai_client

# Dependency for request ID
def get_request_id() -> str:
    return str(uuid.uuid4())

# Background task for logging
async def log_generation(request_id: str, model: str, tokens: int, duration_ms: float):
    print(f"[{request_id}] Generated {tokens} tokens with {model} in {duration_ms:.0f}ms")
    app.state.total_requests += 1

# Streaming generator
async def stream_generation(
    prompt: str,
    model: str,
    max_tokens: int,
    temperature: float,
    client: OpenAI,
    request_id: str
) -> AsyncGenerator[str, None]:
    start_time = time.time()

    try:
        stream = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=max_tokens,
            temperature=temperature,
            stream=True
        )

        for chunk in stream:
            if chunk.choices[0].delta.content:
                content = chunk.choices[0].delta.content
                yield f"data: {json.dumps({'content': content})}\\n\\n"

        duration_ms = (time.time() - start_time) * 1000
        yield f"data: {json.dumps({'done': True, 'request_id': request_id, 'duration_ms': duration_ms})}\\n\\n"

    except Exception as e:
        yield f"data: {json.dumps({'error': str(e)})}\\n\\n"

# Main generation endpoint
@app.post("/generate", response_model=GenerationResponse)
async def generate(
    request: GenerationRequest,
    background_tasks: BackgroundTasks,
    client: OpenAI = Depends(get_openai_client),
    request_id: str = Depends(get_request_id)
):
    start_time = time.time()

    # Handle streaming
    if request.stream:
        return StreamingResponse(
            stream_generation(
                request.prompt,
                request.model,
                request.max_tokens,
                request.temperature,
                client,
                request_id
            ),
            media_type="text/event-stream",
            headers={"X-Request-ID": request_id}
        )

    # Non-streaming
    try:
        response = client.chat.completions.create(
            model=request.model,
            messages=[{"role": "user", "content": request.prompt}],
            max_tokens=request.max_tokens,
            temperature=request.temperature
        )

        duration_ms = (time.time() - start_time) * 1000
        tokens_used = response.usage.total_tokens

        # Log in background
        background_tasks.add_task(log_generation, request_id, request.model, tokens_used, duration_ms)

        return GenerationResponse(
            id=request_id,
            content=response.choices[0].message.content,
            model=request.model,
            tokens_used=tokens_used,
            processing_time_ms=duration_ms
        )

    except Exception as e:
        raise HTTPException(status_code=503, detail=f"AI service error: {str(e)}")

@app.get("/health")
async def health():
    return {"status": "healthy", "total_requests": app.state.total_requests}

print("FastAPI app ready. Run with: uvicorn main:app --reload")
`,
  hints: [
    "Use @asynccontextmanager with lifespan to handle startup/shutdown",
    "Store shared resources like OpenAI client in app.state",
    "Use Depends() to inject the client into endpoints",
    "BackgroundTasks.add_task() schedules work after the response is sent",
    "StreamingResponse with media_type='text/event-stream' enables SSE"
  ]
};
