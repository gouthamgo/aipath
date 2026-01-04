import type { LessonContent } from '../types';

export const chains: LessonContent = {
  slug: "chains",
  problemContent: `# Chains in LangChain

Chains connect multiple operations into a pipeline!

## Chain Types

| Type | Use Case | Example |
|------|----------|---------|
| Sequential | Multi-step processing | Generate topic → Explain |
| Parallel | Independent operations | Translate to multiple languages |
| Branching | Conditional logic | Route by input type |
| Combined | Complex workflows | RAG with fallbacks |

## What is a Chain?

A chain is a sequence of calls:
\`\`\`
Input -> Step 1 -> Step 2 -> Step 3 -> Output
\`\`\`

## Simple Chain

\`\`\`python
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI

# Step 1: Generate a topic
topic_prompt = ChatPromptTemplate.from_messages([
    ("user", "Give me a random programming topic in 2 words")
])

# Step 2: Explain the topic
explain_prompt = ChatPromptTemplate.from_messages([
    ("user", "Explain {topic} in simple terms")
])

llm = ChatOpenAI(model="gpt-4o-mini")

# Chain them
topic_chain = topic_prompt | llm | StrOutputParser()
\`\`\`

## Sequential Chains

Run one chain, then use output in another:

\`\`\`python
from langchain_core.runnables import RunnablePassthrough

chain = (
    {"topic": topic_chain}
    | explain_prompt
    | llm
    | StrOutputParser()
)
\`\`\`

## Your Task

1. Create a chain that: generates a topic -> explains it -> creates quiz questions
2. Each step uses the previous step's output`,

  solutionContent: `# Solution: Chains

\`\`\`python
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini")
parser = StrOutputParser()

# Step 1: Generate topic
topic_prompt = ChatPromptTemplate.from_messages([
    ("user", "Give me a programming concept in 2-3 words only")
])
topic_chain = topic_prompt | llm | parser

# Step 2: Explain topic
explain_prompt = ChatPromptTemplate.from_messages([
    ("user", "Explain '{topic}' in 2 sentences for beginners")
])

# Step 3: Create quiz
quiz_prompt = ChatPromptTemplate.from_messages([
    ("user", "Based on this explanation: {explanation}\\n\\nCreate 2 quiz questions")
])

# Full chain
full_chain = (
    {"topic": topic_chain}
    | explain_prompt
    | llm
    | parser
    | (lambda explanation: {"explanation": explanation})
    | quiz_prompt
    | llm
    | parser
)

result = full_chain.invoke({})
print(result)
\`\`\``,

  explanationContent: `# Deep Dive: Chain Patterns

## Passing Data Through

\`\`\`python
from langchain_core.runnables import RunnablePassthrough

# Pass original input AND new data
chain = (
    {"original": RunnablePassthrough(), "processed": some_chain}
    | next_step
)
\`\`\`

## Parallel Chains

\`\`\`python
from langchain_core.runnables import RunnableParallel

# Run multiple chains at once
parallel = RunnableParallel({
    "summary": summary_chain,
    "keywords": keyword_chain,
    "sentiment": sentiment_chain
})

result = parallel.invoke({"text": "..."})
# result = {"summary": "...", "keywords": [...], "sentiment": "..."}
\`\`\`

## Lambda in Chains

\`\`\`python
# Transform data between steps
chain = (
    step1
    | (lambda x: {"new_key": x})
    | step2
)
\`\`\``,

  realworldContent: `# Real-World Chains

## Document Processing

\`\`\`python
chain = (
    load_document
    | split_into_chunks
    | summarize_each_chunk
    | combine_summaries
    | final_summary
)
\`\`\`

## Customer Support

\`\`\`python
chain = (
    classify_intent
    | route_to_handler
    | generate_response
    | check_quality
)
\`\`\``,

  mistakesContent: `# Common Mistakes

## 1. Key Name Mismatch

\`\`\`python
# Chain outputs "result"
# But next prompt expects "topic"
chain = (
    {"result": some_chain}  # Wrong key!
    | ChatPromptTemplate.from_messages([
        ("user", "{topic}")  # Expects "topic"
    ])
)

# Fix: Use matching keys
chain = (
    {"topic": some_chain}
    | ChatPromptTemplate.from_messages([
        ("user", "{topic}")
    ])
)
\`\`\`

## 2. Forgetting Parser

Output is AIMessage, not string:
\`\`\`python
# Add parser to get string
chain = prompt | llm | StrOutputParser()
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: When to use chains?

**Answer:** When you need multi-step processing where each step depends on the previous. Examples: summarize then translate, extract then validate.

## Q2: Sequential vs Parallel?

**Answer:** Sequential for dependent steps. Parallel when steps are independent and you want speed.`,

  starterCode: `from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini")
parser = StrOutputParser()

# Step 1: Generate a topic
topic_prompt = ChatPromptTemplate.from_messages([
    ("user", "Name a Python data structure in 1-2 words")
])

topic_chain = topic_prompt | llm | parser

# Step 2: Explain the topic
explain_prompt = ChatPromptTemplate.from_messages([
    ("user", "Explain what a {topic} is in Python, in 2 sentences")
])

# Connect them: topic_chain output goes to explain_prompt
full_chain = (
    {"topic": topic_chain}
    | explain_prompt
    | llm
    | parser
)

# Run it
result = full_chain.invoke({})
print(result)`,

  solutionCode: `from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini")
parser = StrOutputParser()

# Step 1: Generate a topic
topic_prompt = ChatPromptTemplate.from_messages([
    ("user", "Name a Python data structure in 1-2 words")
])

topic_chain = topic_prompt | llm | parser

# Step 2: Explain the topic
explain_prompt = ChatPromptTemplate.from_messages([
    ("user", "Explain what a {topic} is in Python, in 2 sentences")
])

# Connect them: topic_chain output goes to explain_prompt
full_chain = (
    {"topic": topic_chain}
    | explain_prompt
    | llm
    | parser
)

# Run it
result = full_chain.invoke({})
print(result)`,

  hints: [
    "Use {\"key\": chain} to pass chain output as variable",
    "The key must match the variable in the next prompt",
    "Always end with a parser for clean output",
    "invoke({}) starts the chain with empty input"
  ]
};
