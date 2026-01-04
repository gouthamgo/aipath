import type { LessonContent } from '../types';

export const pydanticModels: LessonContent = {
  slug: "pydantic-models",
  problemContent: `# Pydantic Models for Type-Safe Outputs

JSON mode is good, but Pydantic is better! It adds type validation and structure.

## JSON Mode vs Pydantic

| Feature | JSON Mode | Pydantic |
|---------|-----------|----------|
| Valid JSON | Yes | Yes |
| Type checking | No | Yes |
| Default values | No | Yes |
| Nested objects | Manual | Automatic |
| Validation | No | Yes |

## What is Pydantic?

Pydantic is Python's most popular data validation library:

\`\`\`python
from pydantic import BaseModel

class User(BaseModel):
    name: str
    age: int
    email: str
\`\`\`

## Your Task

1. Create a Pydantic Movie model with title, year, genre, rating
2. Get movie info from the LLM using JSON mode
3. Validate the response with your Pydantic model
4. Print the validated movie details`,
  solutionContent: `# Solution: Pydantic Validation

\`\`\`python
from pydantic import BaseModel
from openai import OpenAI
import json

class Person(BaseModel):
    name: str
    age: int
    occupation: str

client = OpenAI()

response = client.chat.completions.create(
    model="gpt-4o-mini",
    response_format={"type": "json_object"},
    messages=[
        {
            "role": "system",
            "content": "Extract person info as JSON with name, age, occupation."
        },
        {
            "role": "user",
            "content": "John Smith is a 35-year-old software engineer."
        }
    ]
)

# Validate with Pydantic
data = json.loads(response.choices[0].message.content)
person = Person(**data)  # Validates and creates typed object

print(f"{person.name} is {person.age} and works as {person.occupation}")
\`\`\``,
  explanationContent: `# Deep Dive: Pydantic Validation

## How Pydantic Works

\`\`\`python
class Person(BaseModel):
    name: str      # Must be string
    age: int       # Must be integer
    active: bool = True  # Optional with default
\`\`\`

## Validation in Action

\`\`\`python
# Valid - works fine
Person(name="John", age=25)

# Invalid - raises ValidationError
Person(name="John", age="not a number")
\`\`\`

## Nested Models

\`\`\`python
class Address(BaseModel):
    street: str
    city: str

class Person(BaseModel):
    name: str
    address: Address  # Nested model!
\`\`\`

## Field Validators

\`\`\`python
from pydantic import field_validator

class Person(BaseModel):
    age: int

    @field_validator('age')
    def validate_age(cls, v):
        if v < 0 or v > 150:
            raise ValueError('Invalid age')
        return v
\`\`\``,
  realworldContent: `# Real-World: API Response Validation

## Scenario: Building a Customer Service Bot

Your bot extracts customer intent and entities from messages.

\`\`\`python
class CustomerIntent(BaseModel):
    intent: str  # "refund", "question", "complaint"
    product: str
    urgency: str  # "low", "medium", "high"
    sentiment: str  # "positive", "neutral", "negative"

# Every response is validated before processing
\`\`\`

## Benefits in Production

- **Consistent data shape**: No surprises
- **Auto-documentation**: Schema is the docs
- **Easy serialization**: \`.model_dump_json()\`
- **IDE support**: Autocomplete works!`,
  mistakesContent: `# Common Mistakes

## 1. Not Using Optional for Missing Fields

\`\`\`python
# WRONG - Fails if LLM omits middle_name
class Person(BaseModel):
    first_name: str
    middle_name: str  # Might not exist!
    last_name: str

# RIGHT
from typing import Optional

class Person(BaseModel):
    first_name: str
    middle_name: Optional[str] = None
    last_name: str
\`\`\`

## 2. Wrong Type Coercion Expectations

\`\`\`python
# Pydantic v2 is strict by default!
class Data(BaseModel):
    count: int

# This fails in v2 (worked in v1)
Data(count="5")  # Error: str, not int

# Use strict=False or model_validate
Data.model_validate({"count": "5"})  # Works
\`\`\`

## 3. Ignoring Validation Errors

\`\`\`python
# WRONG
person = Person(**data)

# RIGHT
try:
    person = Person(**data)
except ValidationError as e:
    print(f"Invalid data: {e}")
\`\`\``,
  interviewContent: `# Interview Questions

## Q1: How does Pydantic differ from dataclasses?

**Answer**:
- Pydantic validates at runtime
- Dataclasses are just data containers
- Pydantic has built-in JSON serialization
- Pydantic supports complex validators

## Q2: What's new in Pydantic v2?

**Answer**:
- Written in Rust (much faster)
- Strict mode by default
- \`model_validate\` replaces \`parse_obj\`
- Better error messages

## Q3: How would you handle LLM outputs that don't match your schema?

**Answer**:
1. Use Optional fields with defaults
2. Catch ValidationError and retry with better prompt
3. Use \`model_validate\` with \`strict=False\`
4. Implement fallback logic`,
  starterCode: `from pydantic import BaseModel
from openai import OpenAI
import json

# TODO: Create a Pydantic model for a Movie with:
# - title (str)
# - year (int)
# - genre (str)
# - rating (float)

class Movie(BaseModel):
    pass  # Replace with your fields

client = OpenAI()

# TODO: Get movie info from LLM
response = client.chat.completions.create(
    model="gpt-4o-mini",
    response_format={"type": "json_object"},
    messages=[
        # Add messages to extract movie info
    ]
)

# TODO: Parse and validate with Pydantic
# Print the movie details`,
  solutionCode: `from pydantic import BaseModel
from openai import OpenAI
import json

class Movie(BaseModel):
    title: str
    year: int
    genre: str
    rating: float

client = OpenAI()

response = client.chat.completions.create(
    model="gpt-4o-mini",
    response_format={"type": "json_object"},
    messages=[
        {
            "role": "system",
            "content": "Extract movie info as JSON with title, year, genre, rating."
        },
        {
            "role": "user",
            "content": "The Dark Knight came out in 2008. It's a superhero action movie rated 9.0."
        }
    ]
)

data = json.loads(response.choices[0].message.content)
movie = Movie(**data)

print(f"Title: {movie.title}")
print(f"Year: {movie.year}")
print(f"Genre: {movie.genre}")
print(f"Rating: {movie.rating}")`,
  hints: [
    "Define each field with its type annotation in the BaseModel class",
    "Use json.loads() to parse the response before passing to Pydantic",
    "Access validated fields with dot notation: movie.title"
  ]
};
