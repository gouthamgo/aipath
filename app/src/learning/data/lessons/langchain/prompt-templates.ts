import type { LessonContent } from '../types';

export const promptTemplates: LessonContent = {
  slug: "prompt-templates",
  problemContent: `# Prompt Templates

Templates let you create reusable prompts with variables!

## Template Types

| Type | Use Case | Example |
|------|----------|---------|
| ChatPromptTemplate | Chat models | Multi-turn conversations |
| PromptTemplate | Completion models | Simple text prompts |
| MessagesPlaceholder | Dynamic history | Chat memory |
| HumanMessagePromptTemplate | User messages | Custom formatting |

## Why Templates?

Instead of:
\`\`\`python
prompt = f"Translate '{text}' to {language}"
\`\`\`

Use:
\`\`\`python
from langchain_core.prompts import ChatPromptTemplate

template = ChatPromptTemplate.from_messages([
    ("system", "You are a translator."),
    ("user", "Translate '{text}' to {language}")
])
\`\`\`

## Creating Templates

\`\`\`python
from langchain_core.prompts import ChatPromptTemplate

template = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant."),
    ("user", "{question}")
])

# Fill in variables
prompt = template.invoke({"question": "What is Python?"})
\`\`\`

## Template Variables

Use \`{variable_name}\` as placeholders:

\`\`\`python
template = ChatPromptTemplate.from_messages([
    ("system", "You are a {role} expert."),
    ("user", "Help me with: {topic}")
])

prompt = template.invoke({
    "role": "Python",
    "topic": "list comprehensions"
})
\`\`\`

## Your Task

1. Create a template for a code reviewer
2. Include role (system) and code to review (user)
3. Test with sample code`,

  solutionContent: `# Solution: Prompt Templates

\`\`\`python
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

# Create the template
template = ChatPromptTemplate.from_messages([
    ("system", "You are a senior {language} code reviewer. Be concise."),
    ("user", "Review this code:\\n\\n{code}")
])

# Create the LLM
llm = ChatOpenAI(model="gpt-4o-mini")

# Fill in template and call LLM
prompt = template.invoke({
    "language": "Python",
    "code": "def add(a, b): return a + b"
})

response = llm.invoke(prompt)
print(response.content)
\`\`\`

## Output
\`\`\`
The function is clean and simple. Consider adding:
- Type hints: def add(a: int, b: int) -> int
- A docstring explaining the function
\`\`\``,

  explanationContent: `# Deep Dive: Templates

## Message Types

| Type | Purpose | Example |
|------|---------|---------|
| system | Set AI behavior | "You are a teacher" |
| user | User's input | "Explain {topic}" |
| assistant | AI's response | For few-shot examples |

## Chaining Template + LLM

\`\`\`python
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

template = ChatPromptTemplate.from_messages([...])
llm = ChatOpenAI()

# Chain them together
chain = template | llm

# Use the chain
result = chain.invoke({"question": "What is AI?"})
\`\`\`

## Multiple Variables

\`\`\`python
template = ChatPromptTemplate.from_messages([
    ("system", "You are a {role} speaking {style}."),
    ("user", "{question}")
])

prompt = template.invoke({
    "role": "teacher",
    "style": "simply",
    "question": "What is recursion?"
})
\`\`\``,

  realworldContent: `# Real-World Templates

## Customer Support Bot

\`\`\`python
support_template = ChatPromptTemplate.from_messages([
    ("system", """You are a support agent for {company}.
Product: {product}
Be helpful and concise."""),
    ("user", "{customer_question}")
])
\`\`\`

## Code Generator

\`\`\`python
code_template = ChatPromptTemplate.from_messages([
    ("system", "You are a {language} expert. Write clean code."),
    ("user", "Write a function that {task}")
])
\`\`\``,

  mistakesContent: `# Common Mistakes

## 1. Missing Variables

\`\`\`python
template = ChatPromptTemplate.from_messages([
    ("user", "Hello {name}")
])

# Wrong - missing 'name'
template.invoke({})  # Error!

# Right
template.invoke({"name": "Alice"})
\`\`\`

## 2. Wrong Brackets

\`\`\`python
# Wrong - using $
("user", "Hello $name")

# Right - using {}
("user", "Hello {name}")
\`\`\`

## 3. Forgetting to Invoke

\`\`\`python
# Wrong - just the template object
llm.invoke(template)

# Right - invoke template first
llm.invoke(template.invoke({"var": "value"}))
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: Why use templates?

**Answer:** Templates are reusable, maintainable, and separate prompt logic from code. Easy to test and version control.

## Q2: System vs User messages?

**Answer:** System sets AI behavior/role. User contains the actual request. System persists across the conversation.`,

  starterCode: `from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

# 1. Create a template for a code reviewer
template = ChatPromptTemplate.from_messages([
    ("system", "You are a code reviewer. Be concise."),
    ("user", "Review this code:\\n{code}")
])

# 2. Create LLM
llm = ChatOpenAI(model="gpt-4o-mini")

# 3. Test with sample code
code = """
def greet(name):
    print("Hello " + name)
"""

prompt = template.invoke({"code": code})
response = llm.invoke(prompt)
print(response.content)`,

  solutionCode: `from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

# 1. Create a template for a code reviewer
template = ChatPromptTemplate.from_messages([
    ("system", "You are a code reviewer. Be concise."),
    ("user", "Review this code:\\n{code}")
])

# 2. Create LLM
llm = ChatOpenAI(model="gpt-4o-mini")

# 3. Test with sample code
code = """
def greet(name):
    print("Hello " + name)
"""

prompt = template.invoke({"code": code})
response = llm.invoke(prompt)
print(response.content)`,

  hints: [
    "Use ChatPromptTemplate.from_messages()",
    "Variables use {curly_braces}",
    "First invoke the template, then the LLM",
    "System message sets the AI's role"
  ]
};
