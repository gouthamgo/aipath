import type { LessonContent } from '../types';

export const lcelIntro: LessonContent = {
  slug: "lcel-intro",
  problemContent: `# LCEL: LangChain Expression Language

LCEL is how you compose LangChain components together!

## LCEL Components

| Component | Symbol | Purpose |
|-----------|--------|---------|
| Pipe | \`\\|\` | Chain components sequentially |
| Dict | \`{}\` | Run parallel branches |
| invoke() | method | Execute the chain |
| stream() | method | Get streaming output |

## The Pipe Operator |

Chain components using \`|\` (pipe):

\`\`\`python
chain = prompt | llm | parser
\`\`\`

This means: prompt -> llm -> parser

## Simple Example

\`\`\`python
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI

prompt = ChatPromptTemplate.from_messages([
    ("user", "Tell me a joke about {topic}")
])

llm = ChatOpenAI(model="gpt-4o-mini")
parser = StrOutputParser()

# Create the chain
chain = prompt | llm | parser

# Run it
result = chain.invoke({"topic": "programming"})
print(result)
\`\`\`

## Why LCEL?

- **Readable**: Left to right flow
- **Composable**: Mix and match components
- **Streamable**: Built-in streaming support
- **Async**: Async support out of the box

## Your Task

1. Create a chain: prompt -> llm -> string parser
2. The prompt should translate text to a language
3. Test with "Hello" to Spanish`,

  solutionContent: `# Solution: LCEL

\`\`\`python
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI

# Create components
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a translator. Only output the translation."),
    ("user", "Translate '{text}' to {language}")
])

llm = ChatOpenAI(model="gpt-4o-mini")
parser = StrOutputParser()

# Chain them with |
chain = prompt | llm | parser

# Test it
result = chain.invoke({
    "text": "Hello",
    "language": "Spanish"
})

print(result)  # "Hola"
\`\`\`

## Key Points

- \`|\` connects components in order
- Data flows left to right
- \`.invoke()\` runs the whole chain`,

  explanationContent: `# Deep Dive: LCEL

## How It Works

\`\`\`python
chain = prompt | llm | parser

# Is equivalent to:
def chain(inputs):
    step1 = prompt.invoke(inputs)
    step2 = llm.invoke(step1)
    step3 = parser.invoke(step2)
    return step3
\`\`\`

## Streaming

\`\`\`python
# Stream tokens as they come
for chunk in chain.stream({"topic": "AI"}):
    print(chunk, end="")
\`\`\`

## Async

\`\`\`python
# Async version
result = await chain.ainvoke({"topic": "AI"})
\`\`\`

## Batch Processing

\`\`\`python
# Process multiple inputs
results = chain.batch([
    {"topic": "dogs"},
    {"topic": "cats"}
])
\`\`\``,

  realworldContent: `# Real-World LCEL

## Multi-Step Processing

\`\`\`python
# Extract -> Summarize -> Translate
extract_chain = extract_prompt | llm | parser
summary_chain = summary_prompt | llm | parser
translate_chain = translate_prompt | llm | parser

# Combine them
full_chain = extract_chain | summary_chain | translate_chain
\`\`\`

## Conditional Routing

\`\`\`python
from langchain_core.runnables import RunnableBranch

chain = RunnableBranch(
    (lambda x: x["type"] == "question", qa_chain),
    (lambda x: x["type"] == "summary", summary_chain),
    default_chain
)
\`\`\``,

  mistakesContent: `# Common Mistakes

## 1. Wrong Order

\`\`\`python
# Wrong - parser before llm
chain = prompt | parser | llm  # Error!

# Right - parser after llm
chain = prompt | llm | parser
\`\`\`

## 2. Forgetting Parser

\`\`\`python
# Without parser - returns AIMessage object
chain = prompt | llm
result = chain.invoke(...)
print(result)  # AIMessage(content="...")

# With parser - returns string
chain = prompt | llm | StrOutputParser()
result = chain.invoke(...)
print(result)  # Just the text
\`\`\`

## 3. Mixing Invoke Types

\`\`\`python
# Wrong - mixing sync and async
result = chain.invoke(...)  # sync
result = await chain.invoke(...)  # Error!

# Right
result = await chain.ainvoke(...)  # async
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: What is LCEL?

**Answer:** LangChain Expression Language. A way to compose LangChain components using the pipe operator (|). Makes chains readable and supports streaming/async.

## Q2: Benefits of LCEL?

**Answer:** Readable code, built-in streaming, async support, easy composition, and batch processing.`,

  starterCode: `from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI

# 1. Create the prompt template
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a translator. Only output the translation."),
    ("user", "Translate '{text}' to {language}")
])

# 2. Create LLM and parser
llm = ChatOpenAI(model="gpt-4o-mini")
parser = StrOutputParser()

# 3. Chain them together with |
chain = prompt | llm | parser

# 4. Test the chain
result = chain.invoke({
    "text": "Hello, how are you?",
    "language": "French"
})

print(result)`,

  solutionCode: `from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI

# 1. Create the prompt template
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a translator. Only output the translation."),
    ("user", "Translate '{text}' to {language}")
])

# 2. Create LLM and parser
llm = ChatOpenAI(model="gpt-4o-mini")
parser = StrOutputParser()

# 3. Chain them together with |
chain = prompt | llm | parser

# 4. Test the chain
result = chain.invoke({
    "text": "Hello, how are you?",
    "language": "French"
})

print(result)`,

  hints: [
    "Use | to connect prompt, llm, and parser",
    "Order matters: prompt first, parser last",
    "StrOutputParser extracts just the text",
    "invoke() takes a dict with your variables"
  ]
};
