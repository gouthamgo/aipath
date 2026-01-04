import type { LessonContent } from '../types';

export const apiDesign: LessonContent = {
  slug: "api-design",
  problemContent: `# API Design for AI Applications

Build professional APIs for your AI services!

## API Design Patterns

| Pattern | Purpose | Example |
|---------|---------|---------|
| RESTful | Resource-oriented | \`POST /api/v1/generations\` |
| Versioning | Future compatibility | \`/api/v1/\` prefix |
| Pydantic | Request validation | Type-safe models |
| Error Handling | Consistent errors | Custom exceptions |

## Basic API Structure

\`\`\`python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI()

class GenerationRequest(BaseModel):
    prompt: str = Field(..., min_length=1)
    max_tokens: int = Field(default=1000, ge=1, le=4000)

@app.post("/api/v1/generations")
async def generate(request: GenerationRequest):
    # Call AI and return response
    return {"content": "Generated text..."}
\`\`\`

## Your Task

1. Create RESTful endpoints for content generation
2. Design request/response schemas with proper validation
3. Implement error handling with meaningful status codes
4. Add API versioning for future compatibility`,
  solutionContent: `# Solution: AI Content Generation API

This solution demonstrates professional API design patterns:

## Key Design Decisions

1. **Request Validation**: Pydantic models ensure type safety and validation
2. **Versioned Endpoints**: /api/v1/ prefix allows future API evolution
3. **Consistent Responses**: All responses follow the same structure
4. **Error Handling**: Custom exceptions with proper HTTP status codes
5. **Configuration Options**: Flexible parameters for different use cases
  `,
  explanationContent: `# Understanding API Design for AI

## Why API Design Matters

Good API design is crucial for AI applications because:
- **Predictability**: Clients know what to expect
- **Maintainability**: Easy to evolve without breaking clients
- **Usability**: Developers can integrate quickly
- **Scalability**: Handles growth gracefully

## REST Principles for AI APIs

### Resource-Oriented Design
\`\`\`python
# Good: Resource-focused
POST /api/v1/generations
GET /api/v1/generations/{id}

# Avoid: Action-focused
POST /api/v1/generate-content
\`\`\`

### Request Schema Design
\`\`\`python
from pydantic import BaseModel, Field
from typing import Optional, Literal

class GenerationRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=10000)
    model: str = Field(default="gpt-4")
    max_tokens: int = Field(default=1000, ge=1, le=4000)
    temperature: float = Field(default=0.7, ge=0, le=2)
    content_type: Literal["text", "code", "markdown"] = "text"

    class Config:
        json_schema_extra = {
            "example": {
                "prompt": "Write a product description",
                "model": "gpt-4",
                "max_tokens": 500
            }
        }
\`\`\`

### Response Schema Design
\`\`\`python
from datetime import datetime
from typing import Optional

class GenerationResponse(BaseModel):
    id: str
    content: str
    model: str
    tokens_used: int
    created_at: datetime
    processing_time_ms: float

class ErrorResponse(BaseModel):
    error: str
    error_code: str
    details: Optional[dict] = None
    request_id: str
\`\`\`

## Error Handling Strategy

### HTTP Status Codes
\`\`\`python
# 400 - Bad Request: Invalid input
# 401 - Unauthorized: Missing/invalid API key
# 403 - Forbidden: Rate limited or quota exceeded
# 404 - Not Found: Resource doesn't exist
# 422 - Unprocessable: Valid JSON but invalid content
# 429 - Too Many Requests: Rate limit exceeded
# 500 - Server Error: Unexpected failures
# 503 - Service Unavailable: AI provider down
\`\`\`

### Custom Exception Classes
\`\`\`python
class APIException(Exception):
    def __init__(self, message: str, error_code: str, status_code: int):
        self.message = message
        self.error_code = error_code
        self.status_code = status_code

class ValidationError(APIException):
    def __init__(self, message: str, details: dict = None):
        super().__init__(message, "VALIDATION_ERROR", 422)
        self.details = details

class RateLimitError(APIException):
    def __init__(self, retry_after: int):
        super().__init__(
            f"Rate limit exceeded. Retry after {retry_after}s",
            "RATE_LIMIT_EXCEEDED",
            429
        )
        self.retry_after = retry_after
\`\`\`

## API Versioning

### URL Versioning (Recommended)
\`\`\`python
# Clear and explicit
app = FastAPI()
v1_router = APIRouter(prefix="/api/v1")
v2_router = APIRouter(prefix="/api/v2")

@v1_router.post("/generations")
async def create_generation_v1(request: GenerationRequestV1):
    ...

@v2_router.post("/generations")
async def create_generation_v2(request: GenerationRequestV2):
    ...
\`\`\`

### Header Versioning (Alternative)
\`\`\`python
@app.post("/api/generations")
async def create_generation(
    request: GenerationRequest,
    api_version: str = Header(default="2024-01-01")
):
    if api_version < "2024-06-01":
        return legacy_handler(request)
    return modern_handler(request)
\`\`\`
  `,
  realworldContent: `# Real-World API Design

## Production API Example

\`\`\`python
from fastapi import FastAPI, HTTPException, Depends, Header
from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime
import uuid
import time

app = FastAPI(
    title="AI Content Generation API",
    version="1.0.0",
    docs_url="/api/docs"
)

# Request/Response Models
class GenerationRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=10000)
    model: Literal["gpt-4", "gpt-3.5-turbo", "claude-3"] = "gpt-4"
    max_tokens: int = Field(default=1000, ge=1, le=4000)
    temperature: float = Field(default=0.7, ge=0, le=2)
    system_prompt: Optional[str] = None
    stream: bool = False

class GenerationResponse(BaseModel):
    id: str
    content: str
    model: str
    usage: dict
    created_at: datetime
    processing_time_ms: float

class ErrorDetail(BaseModel):
    error: str
    error_code: str
    request_id: str
    details: Optional[dict] = None

# API Key Validation
async def verify_api_key(x_api_key: str = Header(...)):
    if not x_api_key.startswith("sk-"):
        raise HTTPException(
            status_code=401,
            detail={"error": "Invalid API key format", "error_code": "INVALID_KEY"}
        )
    # In production: validate against database
    return x_api_key

# Endpoints
@app.post(
    "/api/v1/generations",
    response_model=GenerationResponse,
    responses={
        400: {"model": ErrorDetail},
        401: {"model": ErrorDetail},
        429: {"model": ErrorDetail},
    }
)
async def create_generation(
    request: GenerationRequest,
    api_key: str = Depends(verify_api_key)
):
    request_id = str(uuid.uuid4())
    start_time = time.time()

    try:
        # Call AI provider
        response = await generate_content(
            prompt=request.prompt,
            model=request.model,
            max_tokens=request.max_tokens,
            temperature=request.temperature
        )

        return GenerationResponse(
            id=request_id,
            content=response.content,
            model=request.model,
            usage={
                "prompt_tokens": response.prompt_tokens,
                "completion_tokens": response.completion_tokens,
                "total_tokens": response.total_tokens
            },
            created_at=datetime.utcnow(),
            processing_time_ms=(time.time() - start_time) * 1000
        )

    except RateLimitError as e:
        raise HTTPException(
            status_code=429,
            detail={
                "error": str(e),
                "error_code": "RATE_LIMIT",
                "request_id": request_id
            },
            headers={"Retry-After": "60"}
        )

@app.get("/api/v1/generations/{generation_id}")
async def get_generation(
    generation_id: str,
    api_key: str = Depends(verify_api_key)
):
    # Retrieve from database
    generation = await db.get_generation(generation_id)
    if not generation:
        raise HTTPException(status_code=404, detail="Generation not found")
    return generation

@app.get("/api/v1/models")
async def list_models():
    return {
        "models": [
            {"id": "gpt-4", "max_tokens": 4096, "cost_per_1k": 0.03},
            {"id": "gpt-3.5-turbo", "max_tokens": 4096, "cost_per_1k": 0.002},
            {"id": "claude-3", "max_tokens": 4096, "cost_per_1k": 0.015}
        ]
    }
\`\`\`

## OpenAPI Documentation

FastAPI automatically generates OpenAPI docs at /api/docs with:
- Interactive testing interface
- Request/response examples
- Authentication requirements
- Error response schemas
  `,
  mistakesContent: `# Common API Design Mistakes

## Mistake 1: Inconsistent Response Formats

### Wrong
\`\`\`python
@app.post("/generate")
async def generate(request: Request):
    try:
        result = await ai.generate(request.prompt)
        return {"text": result}  # Success format
    except Exception as e:
        return {"error": str(e)}  # Different format, same status!
\`\`\`

### Correct
\`\`\`python
@app.post("/generate", response_model=GenerationResponse)
async def generate(request: GenerationRequest):
    try:
        result = await ai.generate(request.prompt)
        return GenerationResponse(content=result, ...)
    except ValidationError as e:
        raise HTTPException(status_code=422, detail=e.to_dict())
    except AIProviderError as e:
        raise HTTPException(status_code=503, detail=e.to_dict())
\`\`\`

## Mistake 2: Missing Input Validation

### Wrong
\`\`\`python
@app.post("/generate")
async def generate(prompt: str, max_tokens: int):
    # No validation - accepts any values!
    return await ai.generate(prompt, max_tokens=max_tokens)
\`\`\`

### Correct
\`\`\`python
class GenerationRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=10000)
    max_tokens: int = Field(default=1000, ge=1, le=4000)

    @validator('prompt')
    def validate_prompt(cls, v):
        if not v.strip():
            raise ValueError('Prompt cannot be empty or whitespace')
        return v.strip()

@app.post("/generate")
async def generate(request: GenerationRequest):
    return await ai.generate(request.prompt, max_tokens=request.max_tokens)
\`\`\`

## Mistake 3: Exposing Internal Errors

### Wrong
\`\`\`python
@app.post("/generate")
async def generate(request: GenerationRequest):
    try:
        return await ai.generate(request.prompt)
    except Exception as e:
        # Exposes stack trace and internal details!
        raise HTTPException(status_code=500, detail=str(e))
\`\`\`

### Correct
\`\`\`python
@app.post("/generate")
async def generate(request: GenerationRequest):
    try:
        return await ai.generate(request.prompt)
    except openai.RateLimitError:
        raise HTTPException(
            status_code=429,
            detail={"error": "Rate limit exceeded", "error_code": "RATE_LIMIT"}
        )
    except openai.APIError as e:
        logger.error(f"OpenAI API error: {e}")  # Log internally
        raise HTTPException(
            status_code=503,
            detail={"error": "AI service temporarily unavailable"}
        )
    except Exception as e:
        logger.exception("Unexpected error")  # Log full details
        raise HTTPException(
            status_code=500,
            detail={"error": "An unexpected error occurred"}
        )
\`\`\`

## Mistake 4: No API Versioning

### Wrong
\`\`\`python
# Breaking changes affect all clients immediately
@app.post("/generate")
async def generate(request: NewRequestFormat):  # Changed format!
    ...
\`\`\`

### Correct
\`\`\`python
# Maintain backwards compatibility
@app.post("/api/v1/generate")
async def generate_v1(request: V1Request):
    # Original implementation
    ...

@app.post("/api/v2/generate")
async def generate_v2(request: V2Request):
    # New implementation with breaking changes
    ...
\`\`\`
  `,
  interviewContent: `# API Design Interview Questions

## Q1: How would you design an API for a high-traffic AI service?

**Answer:**
Key considerations for high-traffic AI APIs:

1. **Rate Limiting**: Protect against abuse
\`\`\`python
from slowapi import Limiter
limiter = Limiter(key_func=get_api_key)

@app.post("/generate")
@limiter.limit("100/minute")
async def generate(request: Request):
    ...
\`\`\`

2. **Async Processing**: Don't block on long operations
\`\`\`python
@app.post("/generate")
async def generate(request: GenerationRequest):
    job_id = await queue.enqueue(request)
    return {"job_id": job_id, "status_url": f"/jobs/{job_id}"}
\`\`\`

3. **Caching**: Cache repeated requests
4. **Load Balancing**: Distribute across instances
5. **Circuit Breakers**: Graceful degradation

## Q2: REST vs GraphQL for AI APIs?

**Answer:**
REST is typically better for AI APIs because:
- **Caching**: HTTP caching works naturally with REST
- **Streaming**: SSE/WebSocket integration is simpler
- **Simplicity**: AI operations are usually straightforward CRUD
- **Tooling**: Better observability and monitoring tools

GraphQL advantages (when applicable):
- Flexible queries for complex data relationships
- Reduced over-fetching for metadata-heavy responses

## Q3: How do you handle long-running AI requests?

**Answer:**
Two main patterns:

**Polling Pattern:**
\`\`\`python
# 1. Submit job
POST /generations → {"job_id": "abc123", "status": "pending"}

# 2. Poll for status
GET /generations/abc123 → {"status": "completed", "result": "..."}
\`\`\`

**Webhook Pattern:**
\`\`\`python
# 1. Submit with callback
POST /generations
{
    "prompt": "...",
    "webhook_url": "https://client.com/callback"
}

# 2. Server calls webhook when done
POST https://client.com/callback
{"job_id": "abc123", "result": "..."}
\`\`\`

## Q4: How do you version AI APIs?

**Answer:**
URL versioning is clearest:
\`\`\`
/api/v1/generations  # Original
/api/v2/generations  # Breaking changes
\`\`\`

Version retirement strategy:
1. Announce deprecation 6+ months ahead
2. Add deprecation headers to old versions
3. Provide migration guides
4. Sunset old versions gracefully
  `,
  starterCode: `from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime

# TODO: Design request model with validation
class GenerationRequest(BaseModel):
    prompt: str
    # Add more fields with proper validation

# TODO: Design response model
class GenerationResponse(BaseModel):
    pass

# TODO: Design error response model
class ErrorResponse(BaseModel):
    pass

# TODO: Create API endpoint
# POST /api/v1/generations
`,
  solutionCode: `from fastapi import FastAPI, HTTPException, Depends, Header
from pydantic import BaseModel, Field, validator
from typing import Optional, Literal
from datetime import datetime
import uuid
import time
from openai import OpenAI

app = FastAPI(
    title="AI Content Generation API",
    version="1.0.0"
)

# Request model with validation
class GenerationRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=10000, description="The prompt for content generation")
    model: Literal["gpt-4", "gpt-3.5-turbo"] = Field(default="gpt-4", description="AI model to use")
    max_tokens: int = Field(default=1000, ge=1, le=4000, description="Maximum tokens to generate")
    temperature: float = Field(default=0.7, ge=0, le=2, description="Sampling temperature")
    system_prompt: Optional[str] = Field(default=None, max_length=2000)

    @validator('prompt')
    def validate_prompt(cls, v):
        if not v.strip():
            raise ValueError('Prompt cannot be empty or whitespace')
        return v.strip()

    class Config:
        json_schema_extra = {
            "example": {
                "prompt": "Write a product description for a smart watch",
                "model": "gpt-4",
                "max_tokens": 500,
                "temperature": 0.7
            }
        }

# Response models
class UsageInfo(BaseModel):
    prompt_tokens: int
    completion_tokens: int
    total_tokens: int

class GenerationResponse(BaseModel):
    id: str
    content: str
    model: str
    usage: UsageInfo
    created_at: datetime
    processing_time_ms: float

class ErrorResponse(BaseModel):
    error: str
    error_code: str
    request_id: str
    details: Optional[dict] = None

# API Key dependency
async def verify_api_key(x_api_key: str = Header(..., description="API key for authentication")):
    if not x_api_key or not x_api_key.startswith("sk-"):
        raise HTTPException(
            status_code=401,
            detail={"error": "Invalid API key", "error_code": "INVALID_API_KEY"}
        )
    return x_api_key

# Main endpoint
@app.post(
    "/api/v1/generations",
    response_model=GenerationResponse,
    responses={
        400: {"model": ErrorResponse, "description": "Bad Request"},
        401: {"model": ErrorResponse, "description": "Unauthorized"},
        422: {"model": ErrorResponse, "description": "Validation Error"},
        429: {"model": ErrorResponse, "description": "Rate Limited"},
        503: {"model": ErrorResponse, "description": "Service Unavailable"}
    },
    summary="Generate AI content",
    description="Generate content using the specified AI model"
)
async def create_generation(
    request: GenerationRequest,
    api_key: str = Depends(verify_api_key)
):
    request_id = str(uuid.uuid4())
    start_time = time.time()

    try:
        client = OpenAI()

        messages = []
        if request.system_prompt:
            messages.append({"role": "system", "content": request.system_prompt})
        messages.append({"role": "user", "content": request.prompt})

        response = client.chat.completions.create(
            model=request.model,
            messages=messages,
            max_tokens=request.max_tokens,
            temperature=request.temperature
        )

        return GenerationResponse(
            id=request_id,
            content=response.choices[0].message.content,
            model=request.model,
            usage=UsageInfo(
                prompt_tokens=response.usage.prompt_tokens,
                completion_tokens=response.usage.completion_tokens,
                total_tokens=response.usage.total_tokens
            ),
            created_at=datetime.utcnow(),
            processing_time_ms=(time.time() - start_time) * 1000
        )

    except Exception as e:
        if "rate_limit" in str(e).lower():
            raise HTTPException(
                status_code=429,
                detail={"error": "Rate limit exceeded", "error_code": "RATE_LIMIT", "request_id": request_id}
            )
        raise HTTPException(
            status_code=503,
            detail={"error": "AI service unavailable", "error_code": "SERVICE_ERROR", "request_id": request_id}
        )

@app.get("/api/v1/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

print("API server ready at http://localhost:8000")
print("Docs available at http://localhost:8000/docs")
`,
  hints: [
    "Use Pydantic's Field() for validation constraints like min_length, max_length, ge (>=), le (<=)",
    "Create separate response models for success and error cases",
    "Use FastAPI's Depends() for reusable dependencies like API key validation",
    "Add response_model and responses dict to document all possible responses",
    "Include request_id in error responses for debugging and support"
  ]
};
