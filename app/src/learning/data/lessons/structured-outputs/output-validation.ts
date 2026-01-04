import type { LessonContent } from '../types';

export const outputValidation: LessonContent = {
  slug: "output-validation",
  problemContent: `# Output Validation and Error Handling

What happens when structured output fails? You need robust validation!

## Validation Layers

| Layer | What it Checks | Error Type |
|-------|----------------|------------|
| JSON Parsing | Valid JSON syntax | JSONDecodeError |
| Pydantic | Types, required fields | ValidationError |
| Business Logic | Domain rules | Custom exceptions |

## Common Issues

Even with structured outputs, things can go wrong:
- LLM returns unexpected values
- Required fields missing
- Wrong data types
- Values out of expected range

## The Validation Flow

\`\`\`
LLM Response → JSON Parsing → Pydantic Validation → Business Logic → Valid Data
\`\`\`

## Your Task

1. Create an Event model with validated fields (title, attendees, email)
2. Add a custom email validator using @field_validator
3. Implement safe_parse() with try/except for both JSON and Pydantic errors
4. Test with both valid and invalid data`,
  solutionContent: `# Solution: Robust Validation

\`\`\`python
from pydantic import BaseModel, Field, field_validator
from typing import Optional
import json

class UserProfile(BaseModel):
    name: str = Field(min_length=1)
    age: int = Field(ge=0, le=150)
    email: str

    @field_validator('email')
    def validate_email(cls, v):
        if '@' not in v:
            raise ValueError('Invalid email format')
        return v.lower()

def safe_extract(response_content: str) -> Optional[UserProfile]:
    """Safely extract and validate user profile."""

    # Layer 1: JSON parsing
    try:
        data = json.loads(response_content)
    except json.JSONDecodeError as e:
        print(f"JSON parse error: {e}")
        return None

    # Layer 2: Pydantic validation
    try:
        profile = UserProfile(**data)
    except ValidationError as e:
        print(f"Validation error: {e}")
        return None

    # Layer 3: Business logic
    if profile.age < 13:
        print("User must be 13 or older")
        return None

    return profile

# Use it
result = safe_extract(response.choices[0].message.content)
if result:
    print(f"Valid profile: {result.name}")
\`\`\``,
  explanationContent: `# Deep Dive: Validation Strategies

## Pydantic Validators

\`\`\`python
from pydantic import BaseModel, field_validator, model_validator

class Order(BaseModel):
    quantity: int
    price: float

    @field_validator('quantity')
    def check_quantity(cls, v):
        if v <= 0:
            raise ValueError('Must be positive')
        return v

    @model_validator(mode='after')
    def check_total(self):
        if self.quantity * self.price > 10000:
            raise ValueError('Order too large')
        return self
\`\`\`

## Field Constraints

\`\`\`python
from pydantic import Field

class Product(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    price: float = Field(gt=0, lt=1000000)
    quantity: int = Field(ge=0, le=9999)
    sku: str = Field(pattern=r'^[A-Z]{2}\\d{4}$')
\`\`\`

## Retry Logic

\`\`\`python
def extract_with_retry(text, max_retries=3):
    for attempt in range(max_retries):
        try:
            result = structured_llm.invoke(text)
            return result
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            print(f"Retry {attempt + 1}: {e}")
\`\`\``,
  realworldContent: `# Real-World: Production Validation

## Scenario: Financial Data Extraction

Extracting transaction data where accuracy is critical:

\`\`\`python
class Transaction(BaseModel):
    amount: float = Field(gt=0)
    currency: str = Field(pattern=r'^[A-Z]{3}$')
    date: str

    @field_validator('date')
    def validate_date(cls, v):
        from datetime import datetime
        try:
            datetime.strptime(v, '%Y-%m-%d')
        except ValueError:
            raise ValueError('Date must be YYYY-MM-DD')
        return v

# In production: log failures for review
if not validate_transaction(data):
    send_to_human_review(data)
\`\`\`

## Monitoring

Track validation failures to improve prompts over time.`,
  mistakesContent: `# Common Mistakes

## 1. Silent Failures

\`\`\`python
# WRONG - Errors hidden
try:
    result = process(data)
except:
    pass

# RIGHT - Log and handle
try:
    result = process(data)
except ValidationError as e:
    logger.error(f"Validation failed: {e}")
    return default_value
\`\`\`

## 2. Too Strict Validation

\`\`\`python
# WRONG - Will fail often
class Response(BaseModel):
    exact_format: str = Field(pattern=r'^\\d{3}-\\d{2}-\\d{4}$')

# RIGHT - More flexible
class Response(BaseModel):
    value: str

    @field_validator('value')
    def normalize(cls, v):
        # Clean and standardize
        return v.strip().replace(' ', '-')
\`\`\`

## 3. No Fallback Strategy

\`\`\`python
# WRONG
result = extract(text)  # Might fail!

# RIGHT
result = extract(text)
if result is None:
    result = use_fallback_extraction(text)
\`\`\``,
  interviewContent: `# Interview Questions

## Q1: How do you handle repeated validation failures?

**Answer**:
1. Improve the prompt with examples
2. Add retry logic with exponential backoff
3. Fall back to simpler extraction
4. Route to human review

## Q2: What's the difference between field and model validators?

**Answer**:
- Field validators: Run on individual fields
- Model validators: Run after all fields, can check relationships

## Q3: How do you validate nested objects?

**Answer**: Pydantic validates nested models automatically:
\`\`\`python
class Address(BaseModel):
    city: str = Field(min_length=1)

class Person(BaseModel):
    address: Address  # Auto-validated!
\`\`\``,
  starterCode: `from pydantic import BaseModel, Field, field_validator, ValidationError
from typing import Optional
import json

# TODO: Create a validated Event model with:
# - title: str (min 1 char)
# - attendees: int (must be positive)
# - email: str (must contain @)

class Event(BaseModel):
    pass  # Add your fields and validators

def safe_parse(json_str: str) -> Optional[Event]:
    """Safely parse JSON to Event with error handling."""
    # TODO: Implement JSON parsing with error handling
    # TODO: Implement Pydantic validation with error handling
    pass

# Test with valid and invalid data
valid = '{"title": "Meeting", "attendees": 5, "email": "test@example.com"}'
invalid = '{"title": "", "attendees": -1, "email": "invalid"}'

print("Valid:", safe_parse(valid))
print("Invalid:", safe_parse(invalid))`,
  solutionCode: `from pydantic import BaseModel, Field, field_validator, ValidationError
from typing import Optional
import json

class Event(BaseModel):
    title: str = Field(min_length=1)
    attendees: int = Field(gt=0)
    email: str

    @field_validator('email')
    def validate_email(cls, v):
        if '@' not in v:
            raise ValueError('Email must contain @')
        return v.lower()

def safe_parse(json_str: str) -> Optional[Event]:
    """Safely parse JSON to Event with error handling."""
    # Layer 1: JSON parsing
    try:
        data = json.loads(json_str)
    except json.JSONDecodeError as e:
        print(f"JSON error: {e}")
        return None

    # Layer 2: Pydantic validation
    try:
        return Event(**data)
    except ValidationError as e:
        print(f"Validation error: {e.errors()}")
        return None

# Test with valid and invalid data
valid = '{"title": "Meeting", "attendees": 5, "email": "test@example.com"}'
invalid = '{"title": "", "attendees": -1, "email": "invalid"}'

print("Valid:", safe_parse(valid))
print("Invalid:", safe_parse(invalid))`,
  hints: [
    "Use Field(min_length=1) for non-empty strings, Field(gt=0) for positive numbers",
    "Use @field_validator to add custom validation logic",
    "Wrap json.loads() and Pydantic creation in try/except blocks"
  ]
};
