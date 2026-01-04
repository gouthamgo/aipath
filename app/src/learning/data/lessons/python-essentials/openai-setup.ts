import type { LessonContent } from '../types';

export const openaiSetup: LessonContent = {
  slug: "openai-setup",
  problemContent: `# OpenAI Setup & Your First API Call

Welcome to OpenAI API Mastery! Let's get you set up and make your first AI call.

## What is the OpenAI API?

Think of an API key like a **password** that lets your code talk to OpenAI's servers. Instead of using ChatGPT in a browser, you can build AI directly into your own apps!

\`\`\`python
# Soon you'll be doing this:
response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[{"role": "user", "content": "Hello!"}]
)
\`\`\`

## What You'll Need

| Step | What | Why |
|------|------|-----|
| 1 | OpenAI account | To get an API key |
| 2 | API key | Like a password for your code |
| 3 | \`openai\` package | Python library to call the API |

## Your Task

Create a simple script that:
1. Loads your API key securely (never hardcode it!)
2. Makes a test API call
3. Prints the response

Let's get you set up!`,

  solutionContent: `# Solution: OpenAI Setup

Here's how to get up and running!

## Step 1: Install the Package

\`\`\`bash
pip install openai
\`\`\`

## Step 2: Set Your API Key (Securely!)

Create a \`.env\` file in your project folder:
\`\`\`
OPENAI_API_KEY=sk-your-actual-key-here
\`\`\`

**Important:** Add \`.env\` to your \`.gitignore\` so you never commit it!

## Step 3: Your First API Call

\`\`\`python
import os
from openai import OpenAI

# Create client with your API key
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Make your first call!
response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "user", "content": "Say hello!"}
    ]
)

print(response.choices[0].message.content)
\`\`\`

## Output
\`\`\`
Hello! How can I assist you today?
\`\`\`

Great job! You just made your first AI API call!`,

  explanationContent: `# Deep Dive: How the OpenAI API Works

## Think of the Client as Your AI Phone

\`\`\`python
from openai import OpenAI

# This creates your "phone" to call OpenAI
client = OpenAI()  # Looks for OPENAI_API_KEY automatically
\`\`\`

## Why Environment Variables?

Think of your API key like a house key - you don't write it on a sticky note in your code!

\`\`\`python
# ❌ NEVER do this - anyone can see your key!
client = OpenAI(api_key="sk-abc123...")

# ✅ Use environment variables instead
import os
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
\`\`\`

**Pro tip:** Use \`python-dotenv\` to load from a \`.env\` file:

\`\`\`python
from dotenv import load_dotenv
load_dotenv()  # Loads .env file
client = OpenAI()  # Finds OPENAI_API_KEY automatically
\`\`\`

## What's Inside a Response?

\`\`\`python
response = client.chat.completions.create(...)

# The AI's message
response.choices[0].message.content

# How many tokens you used
response.usage.total_tokens

# Which model answered
response.model
\`\`\`

## Quick Reference

| What | Where | Example |
|------|-------|---------|
| AI's answer | \`response.choices[0].message.content\` | "Hello!" |
| Tokens used | \`response.usage.total_tokens\` | 25 |
| Model used | \`response.model\` | "gpt-3.5-turbo" |`,

  realworldContent: `# Real-World Uses

## 1. Reusable Client Setup

\`\`\`python
# utils/openai_client.py
import os
from openai import OpenAI

def get_client():
    """Get a configured OpenAI client - use everywhere!"""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("Set OPENAI_API_KEY first!")
    return OpenAI(api_key=api_key)

# Now use it anywhere:
client = get_client()
\`\`\`

## 2. Health Check Function

\`\`\`python
def test_api_connection():
    """Quick test - is the API working?"""
    try:
        client = get_client()
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": "Hi"}],
            max_tokens=5
        )
        print("✓ API connection successful!")
        return True
    except Exception as e:
        print(f"✗ Connection failed: {e}")
        return False
\`\`\`

## 3. Building a Simple Chatbot

\`\`\`python
import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def chat(user_message):
    """Send a message, get a response!"""
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": user_message}]
    )
    return response.choices[0].message.content

# Try it!
print(chat("Tell me a joke!"))
\`\`\``,

  mistakesContent: `# Common Mistakes (Don't Worry, Everyone Makes These!)

## 1. Putting Your API Key in Code

\`\`\`python
# ❌ NEVER do this - your key will be exposed!
client = OpenAI(api_key="sk-proj-abc123...")

# ✅ Always use environment variables
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
\`\`\`

**Why?** If you push this to GitHub, anyone can steal your key!

## 2. Forgetting to Add .env to .gitignore

\`\`\`bash
# Add this to .gitignore immediately!
.env
\`\`\`

## 3. Using Old OpenAI Library Code

\`\`\`python
# ❌ Old way (before v1.0)
import openai
openai.api_key = "..."
openai.ChatCompletion.create(...)

# ✅ New way (v1.0+) - use this!
from openai import OpenAI
client = OpenAI()
client.chat.completions.create(...)
\`\`\`

## 4. Not Checking if API Key Exists

\`\`\`python
# ❌ Will crash if OPENAI_API_KEY not set
client = OpenAI()

# ✅ Check first, give helpful error
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    print("Error: Set your OPENAI_API_KEY first!")
    exit()
client = OpenAI(api_key=api_key)
\`\`\``,

  interviewContent: `# Interview Prep

## Q1: How do you keep API keys secure?

**Answer:** Never hardcode them! Use environment variables:
- Store in \`.env\` file locally
- Add \`.env\` to \`.gitignore\`
- In production, use secrets managers (AWS Secrets Manager, etc.)
- Rotate keys immediately if exposed

\`\`\`python
# ✓ Secure
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
\`\`\`

## Q2: What's the response structure from a chat completion?

**Answer:** The response has three key parts:
- \`response.choices[0].message.content\` - The AI's text
- \`response.usage.total_tokens\` - Tokens used (for billing)
- \`response.model\` - Which model answered

## Q3: How would you test if the API connection works?

**Answer:**
\`\`\`python
try:
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": "Hi"}],
        max_tokens=5
    )
    print("Connection works!")
except Exception as e:
    print(f"Failed: {e}")
\`\`\`

## Q4: What's the difference between the old and new OpenAI library?

**Answer:**
- **Old (pre-1.0):** \`openai.ChatCompletion.create(...)\`
- **New (1.0+):** \`client.chat.completions.create(...)\`
- New version is cleaner and has better error handling`,

  starterCode: `# OpenAI Setup - Your Turn!
import os

# TODO: Import the OpenAI library
# (Hint: from openai import OpenAI)


# TODO: Create client with your API key
# 1. Get OPENAI_API_KEY from environment
# 2. Create OpenAI client with it
api_key = # Your code here
client = # Your code here


# TODO: Make your first API call!
response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "user", "content": "Say hello and welcome me to OpenAI!"}
    ]
)

# TODO: Print the AI's response
# (Hint: response.choices[0].message.content)
print()`,

  solutionCode: `# OpenAI Setup - Solution
import os
from openai import OpenAI

# 1. Get API key from environment
api_key = os.getenv("OPENAI_API_KEY")

# 2. Create OpenAI client
client = OpenAI(api_key=api_key)

# 3. Make your first API call!
response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "user", "content": "Say hello and welcome me to OpenAI!"}
    ]
)

# 4. Print the AI's response
print(response.choices[0].message.content)

# Great job! You just talked to an AI!`,

  hints: [
    "Import the library: from openai import OpenAI",
    "Get environment variable: os.getenv('OPENAI_API_KEY')",
    "Create client: OpenAI(api_key=your_key)",
    "Get response text: response.choices[0].message.content",
  ],
};
