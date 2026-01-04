import type { LessonContent } from '../types';

export const projectDataExtractor: LessonContent = {
  slug: "project-data-extractor",
  problemContent: `# Project: Build a Data Extractor

Build a complete structured data extraction system!

## Entity Types to Extract

| Entity | Fields | Example |
|--------|--------|---------|
| Person | name, role | John Smith, CEO |
| Company | name, industry | TechCorp, Technology |
| Event | name, date, location | AI Summit, 2024-03-15, SF |

## Project Overview

Create a system that:
1. Takes unstructured text input
2. Extracts structured data using LLM
3. Validates the output
4. Handles errors gracefully

## Requirements

- Extract multiple entity types (Person, Company, Event)
- Use Pydantic for validation
- Implement retry logic
- Return clean, validated data

## Example

\`\`\`
Input: "John Smith (CEO of TechCorp) will speak at
       AI Summit 2024 on March 15th in San Francisco"

Output:
{
  "person": {"name": "John Smith", "role": "CEO"},
  "company": {"name": "TechCorp"},
  "event": {"name": "AI Summit 2024", "date": "2024-03-15", "location": "San Francisco"}
}
\`\`\`

## Your Task

1. Define Person, Company, and Event Pydantic models
2. Create an ExtractionResult model with lists of each entity
3. Build an extractor using LangChain's with_structured_output()
4. Handle errors gracefully and test with sample text`,
  solutionContent: `# Solution: Complete Data Extractor

\`\`\`python
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field
from typing import Optional, List
import json

# Define data models
class Person(BaseModel):
    name: str = Field(description="Full name")
    role: Optional[str] = Field(None, description="Job title or role")

class Company(BaseModel):
    name: str = Field(description="Company name")
    industry: Optional[str] = Field(None, description="Industry sector")

class Event(BaseModel):
    name: str = Field(description="Event name")
    date: Optional[str] = Field(None, description="Date in YYYY-MM-DD format")
    location: Optional[str] = Field(None, description="Event location")

class ExtractionResult(BaseModel):
    persons: List[Person] = Field(default_factory=list)
    companies: List[Company] = Field(default_factory=list)
    events: List[Event] = Field(default_factory=list)

# Create the extractor
llm = ChatOpenAI(model="gpt-4o-mini")
extractor = llm.with_structured_output(ExtractionResult)

def extract_entities(text: str, max_retries: int = 3) -> Optional[ExtractionResult]:
    """Extract entities with retry logic."""
    for attempt in range(max_retries):
        try:
            result = extractor.invoke(
                f"Extract all persons, companies, and events from: {text}"
            )
            return result
        except Exception as e:
            print(f"Attempt {attempt + 1} failed: {e}")
            if attempt == max_retries - 1:
                return None
    return None

# Test it
text = """John Smith (CEO of TechCorp) will speak at
AI Summit 2024 on March 15th in San Francisco."""

result = extract_entities(text)
if result:
    print("Persons:", [p.model_dump() for p in result.persons])
    print("Companies:", [c.model_dump() for c in result.companies])
    print("Events:", [e.model_dump() for e in result.events])
\`\`\``,
  explanationContent: `# System Architecture

## Design Decisions

1. **Pydantic Models**: Type safety and validation
2. **Optional Fields**: Handle missing data gracefully
3. **List Fields**: Extract multiple entities of same type
4. **Retry Logic**: Handle transient failures

## The Extraction Flow

\`\`\`
Raw Text
    ↓
LangChain + Pydantic Schema
    ↓
LLM Extraction (with retry)
    ↓
Validated ExtractionResult
    ↓
Processed Data
\`\`\`

## Extending the System

Add new entity types easily:

\`\`\`python
class Product(BaseModel):
    name: str
    price: Optional[float]

class ExtractionResult(BaseModel):
    persons: List[Person] = []
    companies: List[Company] = []
    events: List[Event] = []
    products: List[Product] = []  # New!
\`\`\``,
  realworldContent: `# Real-World Applications

## 1. News Article Processing

\`\`\`python
# Extract from news articles
articles = load_news_feed()
for article in articles:
    entities = extract_entities(article.text)
    store_in_knowledge_graph(entities)
\`\`\`

## 2. Resume Parsing

\`\`\`python
class ResumeData(BaseModel):
    name: str
    email: str
    skills: List[str]
    experience: List[Experience]
    education: List[Education]

# Process thousands of resumes
\`\`\`

## 3. Contract Analysis

\`\`\`python
class ContractTerms(BaseModel):
    parties: List[str]
    effective_date: str
    termination_clause: str
    payment_terms: str
\`\`\``,
  mistakesContent: `# Common Mistakes

## 1. Not Using Lists for Multiple Entities

\`\`\`python
# WRONG - Loses data if multiple people
class Result(BaseModel):
    person: Person

# RIGHT
class Result(BaseModel):
    persons: List[Person] = []
\`\`\`

## 2. No Default for Optional Lists

\`\`\`python
# WRONG - Can return None
persons: Optional[List[Person]]

# RIGHT - Empty list is cleaner
persons: List[Person] = Field(default_factory=list)
\`\`\`

## 3. Missing Error Context

\`\`\`python
# WRONG
except Exception:
    return None

# RIGHT
except Exception as e:
    logger.error(f"Extraction failed for: {text[:100]}... Error: {e}")
    return None
\`\`\``,
  interviewContent: `# Interview Questions

## Q1: How would you scale this to millions of documents?

**Answer**:
1. Batch processing with async calls
2. Use queue system (Redis, RabbitMQ)
3. Cache common extractions
4. Parallelize with workers

## Q2: How do you handle extraction quality?

**Answer**:
1. Add confidence scores to models
2. Sample and manually review outputs
3. A/B test different prompts
4. Track extraction metrics over time

## Q3: What about sensitive data (PII)?

**Answer**:
1. Don't send PII to external LLMs if avoidable
2. Use on-premise models for sensitive data
3. Mask/anonymize before extraction
4. Delete data after processing`,
  starterCode: `from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field
from typing import Optional, List

# TODO: Define Person, Company, Event models
# Each should have appropriate fields with descriptions

class Person(BaseModel):
    pass

class Company(BaseModel):
    pass

class Event(BaseModel):
    pass

class ExtractionResult(BaseModel):
    # TODO: Add lists of each entity type
    pass

# TODO: Create LLM with structured output
llm = ChatOpenAI(model="gpt-4o-mini")

def extract_entities(text: str) -> Optional[ExtractionResult]:
    """Extract entities from text."""
    # TODO: Implement with error handling
    pass

# Test
text = """Apple Inc. announced that Tim Cook will present
the new iPhone at WWDC 2024 in Cupertino on June 10th."""

result = extract_entities(text)
# Print the results`,
  solutionCode: `from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field
from typing import Optional, List

class Person(BaseModel):
    name: str = Field(description="Person's full name")
    role: Optional[str] = Field(None, description="Job title or role")

class Company(BaseModel):
    name: str = Field(description="Company name")
    industry: Optional[str] = Field(None, description="Industry sector")

class Event(BaseModel):
    name: str = Field(description="Event name")
    date: Optional[str] = Field(None, description="Event date")
    location: Optional[str] = Field(None, description="Event location")

class ExtractionResult(BaseModel):
    persons: List[Person] = Field(default_factory=list)
    companies: List[Company] = Field(default_factory=list)
    events: List[Event] = Field(default_factory=list)

llm = ChatOpenAI(model="gpt-4o-mini")
extractor = llm.with_structured_output(ExtractionResult)

def extract_entities(text: str) -> Optional[ExtractionResult]:
    """Extract entities from text."""
    try:
        return extractor.invoke(
            f"Extract all persons, companies, and events: {text}"
        )
    except Exception as e:
        print(f"Extraction failed: {e}")
        return None

# Test
text = """Apple Inc. announced that Tim Cook will present
the new iPhone at WWDC 2024 in Cupertino on June 10th."""

result = extract_entities(text)
if result:
    print("Persons:")
    for p in result.persons:
        print(f"  - {p.name} ({p.role or 'N/A'})")
    print("Companies:")
    for c in result.companies:
        print(f"  - {c.name}")
    print("Events:")
    for e in result.events:
        print(f"  - {e.name} on {e.date} in {e.location}")`,
  hints: [
    "Use List[Model] with default_factory=list for each entity type",
    "Use with_structured_output(ExtractionResult) on the LLM",
    "Wrap the invoke call in try/except for error handling"
  ]
};
