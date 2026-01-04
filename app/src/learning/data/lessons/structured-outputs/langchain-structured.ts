import type { LessonContent } from '../types';

export const langchainStructured: LessonContent = {
  slug: "langchain-structured",
  problemContent: `# LangChain Structured Output

LangChain makes structured outputs even easier with Pydantic integration!

## LangChain Benefits

| Feature | Benefit |
|---------|---------|
| One line setup | \`.with_structured_output()\` |
| Type hints | IDE autocomplete works |
| Validation | Built-in Pydantic checks |
| Chaining | Works in LCEL pipelines |

## The with_structured_output Method

\`\`\`python
from langchain_openai import ChatOpenAI
from pydantic import BaseModel

class Person(BaseModel):
    name: str
    age: int

llm = ChatOpenAI(model="gpt-4o-mini")
structured_llm = llm.with_structured_output(Person)

result = structured_llm.invoke("John is 25 years old")
# result is a Person object!
\`\`\`

## Your Task

1. Create a Book model with title, author, year, genres (list)
2. Use Field descriptions to guide the LLM
3. Create a structured LLM with \`with_structured_output()\`
4. Extract book info and print the results`,
  solutionContent: `# Solution: LangChain Structured Output

\`\`\`python
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field
from typing import List

class Recipe(BaseModel):
    """A cooking recipe."""
    name: str = Field(description="Name of the dish")
    ingredients: List[str] = Field(description="List of ingredients")
    prep_time: int = Field(description="Prep time in minutes")
    difficulty: str = Field(description="easy, medium, or hard")

llm = ChatOpenAI(model="gpt-4o-mini")
structured_llm = llm.with_structured_output(Recipe)

recipe = structured_llm.invoke(
    "Give me a recipe for chocolate chip cookies"
)

print(f"Recipe: {recipe.name}")
print(f"Prep time: {recipe.prep_time} minutes")
print(f"Difficulty: {recipe.difficulty}")
print("Ingredients:")
for ing in recipe.ingredients:
    print(f"  - {ing}")
\`\`\``,
  explanationContent: `# Deep Dive: How It Works

## Under the Hood

LangChain's \`with_structured_output\`:
1. Converts your Pydantic model to a function schema
2. Uses function calling under the hood
3. Parses response back to Pydantic model

## Field Descriptions Matter

\`\`\`python
class Event(BaseModel):
    # Descriptions help the LLM understand what to extract
    title: str = Field(description="Event title")
    date: str = Field(description="Date in YYYY-MM-DD format")
    attendees: int = Field(description="Number of attendees")
\`\`\`

## Works in LCEL Chains

\`\`\`python
from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_messages([
    ("system", "Extract event details."),
    ("user", "{text}")
])

chain = prompt | structured_llm

result = chain.invoke({"text": "Team meeting on Jan 15 with 5 people"})
\`\`\``,
  realworldContent: `# Real-World: Data Pipeline

## Scenario: Processing Customer Feedback

Automatically categorize and structure thousands of reviews:

\`\`\`python
class FeedbackAnalysis(BaseModel):
    sentiment: str = Field(description="positive, negative, neutral")
    topics: List[str] = Field(description="Main topics mentioned")
    urgency: int = Field(description="1-5 urgency score")
    suggested_action: str = Field(description="Recommended response")

# Process each review
for review in reviews:
    analysis = structured_llm.invoke(review)
    save_to_database(analysis)
\`\`\`

## Benefits

- Consistent data format for analytics
- Automatic routing based on urgency
- Type-safe database operations`,
  mistakesContent: `# Common Mistakes

## 1. Forgetting Field Descriptions

\`\`\`python
# WRONG - LLM has no guidance
class Data(BaseModel):
    x: str
    y: int

# RIGHT - Clear descriptions
class Data(BaseModel):
    x: str = Field(description="The name of the item")
    y: int = Field(description="Quantity in stock")
\`\`\`

## 2. Not Handling Errors

\`\`\`python
# WRONG
result = structured_llm.invoke(text)

# RIGHT
try:
    result = structured_llm.invoke(text)
except Exception as e:
    print(f"Extraction failed: {e}")
    result = None
\`\`\`

## 3. Overly Complex Models

\`\`\`python
# WRONG - Too many nested levels
class Response(BaseModel):
    data: Data
    metadata: Metadata
    # ... 10 nested classes

# RIGHT - Keep it simple
class Response(BaseModel):
    main_field: str
    secondary: Optional[str]
\`\`\``,
  interviewContent: `# Interview Questions

## Q1: How does LangChain's with_structured_output compare to raw function calling?

**Answer**:
- with_structured_output: Higher level, less code, Pydantic integration
- Raw function calling: More control, works without LangChain

## Q2: Can you use structured output in a chain?

**Answer**: Yes! It's an LCEL Runnable:
\`\`\`python
chain = prompt | llm.with_structured_output(Model) | process_fn
\`\`\`

## Q3: What happens if extraction fails?

**Answer**: LangChain raises an OutputParserException. You should catch it and either retry or handle gracefully.`,
  starterCode: `from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field
from typing import List

# TODO: Create a Pydantic model for a Book with:
# - title (str)
# - author (str)
# - year (int)
# - genres (List[str])
# Add Field descriptions!

class Book(BaseModel):
    pass  # Replace with your fields

# TODO: Create structured LLM
llm = ChatOpenAI(model="gpt-4o-mini")
# Add with_structured_output

# TODO: Extract book info
text = "1984 by George Orwell was published in 1949. It's a dystopian science fiction novel."

# Print the extracted book details`,
  solutionCode: `from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field
from typing import List

class Book(BaseModel):
    title: str = Field(description="The book title")
    author: str = Field(description="The author's name")
    year: int = Field(description="Publication year")
    genres: List[str] = Field(description="List of genres")

llm = ChatOpenAI(model="gpt-4o-mini")
structured_llm = llm.with_structured_output(Book)

text = "1984 by George Orwell was published in 1949. It's a dystopian science fiction novel."
book = structured_llm.invoke(text)

print(f"Title: {book.title}")
print(f"Author: {book.author}")
print(f"Year: {book.year}")
print(f"Genres: {', '.join(book.genres)}")`,
  hints: [
    "Use Field(description=...) to help the LLM understand each field",
    "Call llm.with_structured_output(Book) to create the structured LLM",
    "The result is already a Book object - use dot notation to access fields"
  ]
};
