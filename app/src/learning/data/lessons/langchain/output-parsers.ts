import type { LessonContent } from '../types';

export const outputParsers: LessonContent = {
  slug: "output-parsers",
  problemContent: `# Output Parsers

Get structured data from LLMs instead of just text!

## The Problem

LLMs return text, but you often need:
- JSON objects
- Lists
- Specific formats

## Solution: Output Parsers

\`\`\`python
from langchain_core.output_parsers import JsonOutputParser

parser = JsonOutputParser()

# Include format instructions in your prompt
template = ChatPromptTemplate.from_messages([
    ("system", "Always respond in JSON format."),
    ("user", "{question}")
])

chain = template | llm | parser
result = chain.invoke({"question": "List 3 colors as JSON"})
# Returns: {"colors": ["red", "blue", "green"]}
\`\`\`

## Common Parsers

| Parser | Output Type |
|--------|-------------|
| \`StrOutputParser\` | Plain string |
| \`JsonOutputParser\` | Python dict |
| \`CommaSeparatedListOutputParser\` | List |

## Your Task

1. Create a chain that returns JSON
2. Ask for a list of 3 programming languages with their uses
3. Parse the response to a Python dict`,

  solutionContent: `# Solution: Output Parsers

\`\`\`python
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_openai import ChatOpenAI

# Create parser
parser = JsonOutputParser()

# Create template with JSON instruction
template = ChatPromptTemplate.from_messages([
    ("system", "You always respond in valid JSON format."),
    ("user", "{question}")
])

# Create LLM
llm = ChatOpenAI(model="gpt-4o-mini")

# Chain: template -> llm -> parser
chain = template | llm | parser

# Run the chain
result = chain.invoke({
    "question": "List 3 programming languages and their main use. Format: {languages: [{name, use}]}"
})

print("Type:", type(result))
print("Result:", result)
\`\`\`

## Output
\`\`\`
Type: <class 'dict'>
Result: {'languages': [
  {'name': 'Python', 'use': 'Data science and AI'},
  {'name': 'JavaScript', 'use': 'Web development'},
  {'name': 'Rust', 'use': 'Systems programming'}
]}
\`\`\``,

  explanationContent: `# Deep Dive: Output Parsers

## String Parser (Simplest)

\`\`\`python
from langchain_core.output_parsers import StrOutputParser

chain = template | llm | StrOutputParser()
result = chain.invoke(...)  # Returns string
\`\`\`

## List Parser

\`\`\`python
from langchain_core.output_parsers import CommaSeparatedListOutputParser

parser = CommaSeparatedListOutputParser()
chain = template | llm | parser
result = chain.invoke(...)  # Returns ["item1", "item2"]
\`\`\`

## Pydantic Parser (Best for Complex Data)

\`\`\`python
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel

class Person(BaseModel):
    name: str
    age: int

parser = PydanticOutputParser(pydantic_object=Person)
\`\`\``,

  realworldContent: `# Real-World Applications

## Extract Product Info

\`\`\`python
class Product(BaseModel):
    name: str
    price: float
    category: str

parser = PydanticOutputParser(pydantic_object=Product)

chain = template | llm | parser
product = chain.invoke({"text": "iPhone 15 Pro, $999, Electronics"})
# product.name = "iPhone 15 Pro"
# product.price = 999.0
\`\`\`

## API Response Formatting

\`\`\`python
# Always return consistent JSON for your API
parser = JsonOutputParser()
chain = template | llm | parser

# Your API can rely on structured output
\`\`\``,

  mistakesContent: `# Common Mistakes

## 1. LLM Returns Invalid JSON

\`\`\`python
# LLM might add markdown code blocks
# Parser fails on: \`\`\`json {...} \`\`\`

# Fix: Tell LLM to output ONLY JSON
("system", "Output ONLY valid JSON, no markdown.")
\`\`\`

## 2. Not Handling Errors

\`\`\`python
try:
    result = chain.invoke(...)
except OutputParserException:
    # Handle parse failure
    result = None
\`\`\`

## 3. Wrong Parser for Output

\`\`\`python
# Wrong - expecting JSON, using string parser
StrOutputParser()  # Just gives raw text

# Right - use JSON parser
JsonOutputParser()  # Parses to dict
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: Why use output parsers?

**Answer:** Convert LLM text to structured data (dict, list, objects). Makes output predictable and usable in code.

## Q2: How to handle parse failures?

**Answer:** Use try/except, add retry logic, or use more specific prompts to ensure correct format.`,

  starterCode: `from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_openai import ChatOpenAI

# 1. Create the parser
parser = JsonOutputParser()

# 2. Create template that asks for JSON
template = ChatPromptTemplate.from_messages([
    ("system", "Always respond in valid JSON only."),
    ("user", "{question}")
])

# 3. Create LLM and chain
llm = ChatOpenAI(model="gpt-4o-mini")
chain = template | llm | parser

# 4. Test it
result = chain.invoke({
    "question": "Give me info about Python: name, year_created, creator"
})

print("Type:", type(result))
print("Result:", result)`,

  solutionCode: `from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_openai import ChatOpenAI

# 1. Create the parser
parser = JsonOutputParser()

# 2. Create template that asks for JSON
template = ChatPromptTemplate.from_messages([
    ("system", "Always respond in valid JSON only."),
    ("user", "{question}")
])

# 3. Create LLM and chain
llm = ChatOpenAI(model="gpt-4o-mini")
chain = template | llm | parser

# 4. Test it
result = chain.invoke({
    "question": "Give me info about Python: name, year_created, creator"
})

print("Type:", type(result))
print("Result:", result)`,

  hints: [
    "JsonOutputParser converts text to dict",
    "Use | to chain components together",
    "Tell the LLM to output valid JSON in system message",
    "Result will be a Python dictionary"
  ]
};
