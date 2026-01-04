import type { LessonContent } from '../types';

export const runnables: LessonContent = {
  slug: "runnables",
  problemContent: `# Runnables in LangChain

Runnables are the building blocks of LCEL!

## What is a Runnable?

Anything that can be:
- \`invoke()\` - run once
- \`stream()\` - get results incrementally
- \`batch()\` - run on multiple inputs

## Key Runnables

| Runnable | Purpose |
|----------|---------|
| \`RunnablePassthrough\` | Pass input unchanged |
| \`RunnableLambda\` | Run custom function |
| \`RunnableParallel\` | Run multiple chains |

## RunnablePassthrough

Pass data through unchanged:

\`\`\`python
from langchain_core.runnables import RunnablePassthrough

chain = {
    "original": RunnablePassthrough(),
    "processed": some_chain
} | next_step
\`\`\`

## RunnableLambda

Use any Python function:

\`\`\`python
from langchain_core.runnables import RunnableLambda

def uppercase(text):
    return text.upper()

chain = some_chain | RunnableLambda(uppercase)
\`\`\`

## Your Task

1. Create a chain that transforms text (uppercase)
2. Run it in parallel with the original
3. Combine results`,

  solutionContent: `# Solution: Runnables

\`\`\`python
from langchain_core.runnables import (
    RunnablePassthrough,
    RunnableLambda,
    RunnableParallel
)
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini")

# Custom function
def word_count(text):
    return str(len(text.split()))

# Parallel processing
chain = RunnableParallel({
    "original": RunnablePassthrough(),
    "uppercase": RunnableLambda(lambda x: x.upper()),
    "word_count": RunnableLambda(word_count)
})

result = chain.invoke("Hello world from LangChain")
print(result)
# {
#   "original": "Hello world from LangChain",
#   "uppercase": "HELLO WORLD FROM LANGCHAIN",
#   "word_count": "4"
# }
\`\`\``,

  explanationContent: `# Deep Dive: Runnables

## RunnableParallel

Run multiple operations at once:

\`\`\`python
parallel = RunnableParallel({
    "summary": summary_chain,
    "sentiment": sentiment_chain,
    "entities": entity_chain
})

# All run in parallel!
result = parallel.invoke({"text": "..."})
\`\`\`

## RunnableBranch

Conditional routing:

\`\`\`python
from langchain_core.runnables import RunnableBranch

chain = RunnableBranch(
    (lambda x: "python" in x.lower(), python_chain),
    (lambda x: "javascript" in x.lower(), js_chain),
    default_chain  # Fallback
)
\`\`\`

## Combining Runnables

\`\`\`python
chain = (
    RunnablePassthrough()
    | RunnableLambda(preprocess)
    | llm_chain
    | RunnableLambda(postprocess)
)
\`\`\``,

  realworldContent: `# Real-World Applications

## Data Preprocessing

\`\`\`python
preprocess = RunnableLambda(lambda x: {
    "text": x["text"].strip().lower(),
    "metadata": x.get("metadata", {})
})

chain = preprocess | main_chain
\`\`\`

## Parallel Analysis

\`\`\`python
analysis = RunnableParallel({
    "classification": classify_chain,
    "extraction": extract_chain,
    "summary": summary_chain
})

# One API call worth of time, 3x the results!
\`\`\``,

  mistakesContent: `# Common Mistakes

## 1. Lambda vs RunnableLambda

\`\`\`python
# This works in simple cases
chain = step1 | (lambda x: x.upper())

# But for complex chains, use RunnableLambda
chain = step1 | RunnableLambda(lambda x: x.upper())
\`\`\`

## 2. Forgetting Return Value

\`\`\`python
# Wrong - no return
def process(x):
    print(x)  # Prints but returns None!

# Right - return the value
def process(x):
    return x.upper()
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: What is RunnablePassthrough?

**Answer:** Passes input through unchanged. Useful for keeping original data alongside processed data.

## Q2: When to use RunnableParallel?

**Answer:** When you have independent operations that can run simultaneously. Reduces total time.`,

  starterCode: `from langchain_core.runnables import (
    RunnablePassthrough,
    RunnableLambda,
    RunnableParallel
)

# Custom functions
def uppercase(text):
    return text.upper()

def reverse(text):
    return text[::-1]

# Create parallel chain
chain = RunnableParallel({
    "original": RunnablePassthrough(),
    "uppercase": RunnableLambda(uppercase),
    "reversed": RunnableLambda(reverse)
})

# Test it
result = chain.invoke("Hello LangChain")
print(result)`,

  solutionCode: `from langchain_core.runnables import (
    RunnablePassthrough,
    RunnableLambda,
    RunnableParallel
)

# Custom functions
def uppercase(text):
    return text.upper()

def reverse(text):
    return text[::-1]

# Create parallel chain
chain = RunnableParallel({
    "original": RunnablePassthrough(),
    "uppercase": RunnableLambda(uppercase),
    "reversed": RunnableLambda(reverse)
})

# Test it
result = chain.invoke("Hello LangChain")
print(result)`,

  hints: [
    "RunnablePassthrough() passes input unchanged",
    "RunnableLambda wraps a Python function",
    "RunnableParallel takes a dict of runnables",
    "All parallel runnables receive the same input"
  ]
};
