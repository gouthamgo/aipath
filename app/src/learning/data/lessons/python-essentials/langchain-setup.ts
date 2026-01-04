import type { LessonContent } from '../types';

export const langchainSetup: LessonContent = {
  slug: "langchain-setup",
  problemContent: `# LangChain Setup & Installation

Welcome to LangChain! Let's get your environment ready to build AI-powered applications.

## What is LangChain?

Think of LangChain as a **toolkit for connecting AI models to your applications**. It's like having pre-built LEGO blocks that handle the complex parts of working with LLMs.

## Why Use LangChain?

| Without LangChain | With LangChain |
|-------------------|----------------|
| Write complex API code | Use simple chains |
| Manage prompts manually | Use templates |
| Handle errors yourself | Built-in error handling |
| Build from scratch | Pre-built components |

## Your Task

Set up a basic LangChain project:

1. Install LangChain and OpenAI packages
2. Set up your environment variables
3. Test the connection with a simple chat
4. Verify everything works!`,

  solutionContent: `# Solution: LangChain Setup

## Step 1: Install Packages

\`\`\`bash
pip install langchain langchain-openai python-dotenv
\`\`\`

## Step 2: Create .env File

\`\`\`.env
OPENAI_API_KEY=your-api-key-here
\`\`\`

## Step 3: Test the Setup

\`\`\`python
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create a chat model
llm = ChatOpenAI(model="gpt-3.5-turbo")

# Test it!
response = llm.invoke("Say hello!")
print(response.content)
\`\`\`

## Output
\`\`\`
Hello! How can I help you today?
\`\`\`

## Key Points
- Always use \`.env\` for API keys (never hardcode!)
- \`langchain-openai\` is separate from core LangChain
- \`invoke()\` sends messages to the model`,

  explanationContent: `# Deep Dive: LangChain Architecture

## Core Components

LangChain is organized into several key packages:

\`\`\`python
# Core framework
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate

# Model-specific packages
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
\`\`\`

## Why Separate Packages?

LangChain moved to a modular design:
- **langchain**: Core abstractions
- **langchain-openai**: OpenAI models
- **langchain-anthropic**: Anthropic models
- **langchain-community**: Community integrations

## Environment Variables

\`\`\`python
import os
from dotenv import load_dotenv

load_dotenv()  # Loads .env file

# Now you can access variables
api_key = os.getenv("OPENAI_API_KEY")
\`\`\`

## The ChatOpenAI Model

\`\`\`python
llm = ChatOpenAI(
    model="gpt-3.5-turbo",
    temperature=0.7,  # Creativity (0-2)
    max_tokens=100    # Response length
)
\`\`\``,

  realworldContent: `# Real-World Applications

## 1. Customer Support Bot

\`\`\`python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-3.5-turbo")

# Handle customer questions
question = "How do I reset my password?"
response = llm.invoke(question)
print(response.content)
\`\`\`

## 2. Content Generation

\`\`\`python
llm = ChatOpenAI(temperature=0.9)

# Generate creative content
prompt = "Write a tagline for a coffee shop"
response = llm.invoke(prompt)
print(response.content)
\`\`\`

## 3. Code Review Assistant

\`\`\`python
llm = ChatOpenAI(model="gpt-4")

code = "def add(a,b): return a+b"
review = llm.invoke(f"Review this code: {code}")
print(review.content)
\`\`\`

## 4. Research Assistant

\`\`\`python
llm = ChatOpenAI(model="gpt-3.5-turbo")

question = "Summarize quantum computing in 3 sentences"
response = llm.invoke(question)
print(response.content)
\`\`\``,

  mistakesContent: `# Common Mistakes to Avoid

## 1. Hardcoding API Keys

\`\`\`python
# ❌ Wrong - security risk!
llm = ChatOpenAI(api_key="sk-abc123...")

# ✅ Correct - use environment variables
from dotenv import load_dotenv
load_dotenv()
llm = ChatOpenAI()  # Reads from OPENAI_API_KEY
\`\`\`

## 2. Wrong Package Import

\`\`\`python
# ❌ Wrong - old import style
from langchain.chat_models import ChatOpenAI

# ✅ Correct - new package structure
from langchain_openai import ChatOpenAI
\`\`\`

## 3. Forgetting to Load .env

\`\`\`python
# ❌ Wrong - .env not loaded
from langchain_openai import ChatOpenAI
llm = ChatOpenAI()  # Error: API key not found

# ✅ Correct - load first
from dotenv import load_dotenv
load_dotenv()
llm = ChatOpenAI()
\`\`\`

## 4. Not Installing Dependencies

\`\`\`bash
# ❌ Wrong - missing package
pip install langchain

# ✅ Correct - install both
pip install langchain langchain-openai
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: What is LangChain used for?

**Answer:** LangChain is a framework for building applications powered by large language models. It provides:
- Pre-built components for common LLM tasks
- Tools for chaining operations together
- Memory management for conversations
- Integration with various LLM providers

## Q2: Why use LangChain instead of calling the OpenAI API directly?

**Answer:** LangChain provides:
- **Abstraction**: Switch between models easily
- **Components**: Pre-built chains, prompts, parsers
- **Memory**: Built-in conversation history
- **Integrations**: Connect to databases, APIs, tools
- **Debugging**: Better error handling and tracing

## Q3: What's the difference between langchain and langchain-openai?

**Answer:**
- \`langchain\`: Core framework with base classes and abstractions
- \`langchain-openai\`: OpenAI-specific implementations (ChatOpenAI, embeddings, etc.)

This modular design means you only install what you need.

## Q4: How does LangChain handle API keys?

**Answer:** LangChain reads from environment variables:
\`\`\`python
# It looks for OPENAI_API_KEY automatically
llm = ChatOpenAI()  # No key needed in code
\`\`\`

Use \`.env\` files with \`python-dotenv\` for local development.`,

  starterCode: `# LangChain Setup
# Test your installation!

from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

# TODO: Load environment variables


# TODO: Create a ChatOpenAI instance (use gpt-3.5-turbo)


# TODO: Send a test message and print the response
`,

  solutionCode: `# LangChain Setup - Solution

from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create a ChatOpenAI instance
llm = ChatOpenAI(model="gpt-3.5-turbo")

# Send a test message
response = llm.invoke("Say hello!")
print(response.content)`,

  hints: [
    "Use load_dotenv() to read your .env file",
    "ChatOpenAI() automatically finds OPENAI_API_KEY",
    "Use .invoke() to send messages to the model",
    "The response has a .content attribute with the text",
  ],
};
