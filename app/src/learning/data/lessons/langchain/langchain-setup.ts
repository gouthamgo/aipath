import type { LessonContent } from '../types';

export const langchainSetup: LessonContent = {
  slug: "langchain-setup",
  problemContent: `# LangChain Setup

Welcome to LangChain - the most popular framework for building AI apps!

## LangChain Packages

| Package | Purpose | Example |
|---------|---------|---------|
| \`langchain\` | Core framework | Base classes, utilities |
| \`langchain-openai\` | OpenAI integration | ChatOpenAI, OpenAI |
| \`langchain-anthropic\` | Claude integration | ChatAnthropic |
| \`python-dotenv\` | Environment variables | load_dotenv() |

## What is LangChain?

LangChain makes it easy to:
- Connect to AI models (OpenAI, Anthropic, etc.)
- Chain multiple AI calls together
- Add memory to your chatbots
- Build agents that can use tools

## Installation

\`\`\`bash
pip install langchain langchain-openai python-dotenv
\`\`\`

## Basic Setup

\`\`\`python
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

# Load your API key from .env file
load_dotenv()

# Create the LLM
llm = ChatOpenAI(model="gpt-4o-mini")

# Test it!
response = llm.invoke("Hello, how are you?")
print(response.content)
\`\`\`

## Your .env File

Create a file called \`.env\`:
\`\`\`
OPENAI_API_KEY=sk-your-key-here
\`\`\`

## Your Task

1. Install the required packages
2. Create a .env file with your API key
3. Test the connection with a simple message`,

  solutionContent: `# Solution: LangChain Setup

\`\`\`python
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

# Load environment variables
load_dotenv()

# Create the ChatOpenAI instance
llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0.7
)

# Test the connection
response = llm.invoke("Say hello and introduce yourself in one sentence.")
print("Response:", response.content)

# You should see something like:
# "Hello! I'm an AI assistant here to help you."
\`\`\`

## Key Points

- \`load_dotenv()\` reads your .env file
- \`ChatOpenAI\` connects to OpenAI's chat models
- \`invoke()\` sends a message and gets a response`,

  explanationContent: `# Deep Dive: LangChain Setup

## Package Structure

| Package | What it does |
|---------|--------------|
| \`langchain\` | Core framework |
| \`langchain-openai\` | OpenAI integration |
| \`langchain-anthropic\` | Claude integration |
| \`python-dotenv\` | Load .env files |

## Environment Variables

\`\`\`python
# Option 1: .env file (recommended)
load_dotenv()

# Option 2: Set directly (not recommended)
os.environ["OPENAI_API_KEY"] = "sk-..."
\`\`\`

## Model Parameters

\`\`\`python
llm = ChatOpenAI(
    model="gpt-4o-mini",     # Which model
    temperature=0.7,          # Creativity (0-1)
    max_tokens=1000,          # Max response length
)
\`\`\``,

  realworldContent: `# Real-World Setup

## Production Setup

\`\`\`python
import os
from langchain_openai import ChatOpenAI

# In production, use environment variables
llm = ChatOpenAI(
    model=os.getenv("LLM_MODEL", "gpt-4o-mini"),
    temperature=float(os.getenv("LLM_TEMP", "0.7"))
)
\`\`\`

## Multiple Providers

\`\`\`python
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic

openai_llm = ChatOpenAI(model="gpt-4o-mini")
claude_llm = ChatAnthropic(model="claude-3-haiku-20240307")
\`\`\``,

  mistakesContent: `# Common Mistakes

## 1. Missing API Key

\`\`\`python
# Error: No API key found
llm = ChatOpenAI()  # Crashes!

# Fix: Set your key
load_dotenv()  # Loads from .env
\`\`\`

## 2. Wrong Package

\`\`\`python
# Old way (deprecated)
from langchain.chat_models import ChatOpenAI

# New way
from langchain_openai import ChatOpenAI
\`\`\`

## 3. Forgetting .env in .gitignore

Always add to .gitignore:
\`\`\`
.env
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: What is LangChain?

**Answer:** LangChain is a framework for building LLM applications. It provides abstractions for models, prompts, chains, memory, and agents.

## Q2: Why use LangChain vs raw API?

**Answer:** LangChain adds chains (combine calls), memory (conversation history), and agents (tools). Raw API is simpler for basic use.`,

  starterCode: `import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

# 1. Load environment variables
load_dotenv()

# 2. Create the LLM
llm = ChatOpenAI(model="gpt-4o-mini")

# 3. Test with a simple message
response = llm.invoke("Hello! What's 2 + 2?")
print("Response:", response.content)`,

  solutionCode: `import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

# 1. Load environment variables
load_dotenv()

# 2. Create the LLM
llm = ChatOpenAI(model="gpt-4o-mini")

# 3. Test with a simple message
response = llm.invoke("Hello! What's 2 + 2?")
print("Response:", response.content)`,

  hints: [
    "Make sure you have a .env file with OPENAI_API_KEY",
    "Install packages: pip install langchain langchain-openai python-dotenv",
    "Use load_dotenv() before creating the LLM",
    "The response is in response.content"
  ]
};
