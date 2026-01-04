import type { LessonContent } from '../types';

export const promptingBasics: LessonContent = {
  slug: "prompting-basics",
  problemContent: `# Prompting Basics

Welcome to Prompt Engineering! Think of a prompt like **giving directions to a friend** - the clearer you are, the better the result.

## What is a Prompt?

A prompt is your instruction to an AI. It's how you tell the AI what you want it to do.

| Bad Prompt | Good Prompt | Why It's Better |
|------------|-------------|-----------------|
| "Write code" | "Write a Python function that validates email addresses" | Specific task and language |
| "Help me" | "Explain how Python dictionaries work with an example" | Clear topic and format |
| "Marketing" | "Write 3 Instagram captions for a coffee shop's new latte" | Specific quantity and context |

## The 3 Keys to Good Prompts

1. **Be Specific** - Say exactly what you want
2. **Give Context** - Provide background information
3. **Specify Format** - Tell the AI how to structure the response

## Your Task

Improve this vague prompt by making it specific, adding context, and requesting a format:

**Vague:** "Tell me about Python"

**Your goal:** Get the AI to explain Python lists to a beginner with code examples.`,

  solutionContent: `# Solution: Prompting Basics

Here's how to transform that vague prompt:

## Original (Vague)
\`\`\`
Tell me about Python
\`\`\`

## Improved (Specific)
\`\`\`
Explain Python lists to a beginner programmer. Include:
- What lists are and why they're useful
- How to create a list
- 3 common operations (append, access, remove)
- A simple example with comments
\`\`\`

## What Changed?

| Element | Before | After |
|---------|--------|-------|
| **Specificity** | "Python" (too broad) | "Python lists" (focused topic) |
| **Context** | None | "to a beginner programmer" |
| **Format** | Unstructured | Bulleted requirements |

## The Result

The AI now knows:
- **What** to explain (lists)
- **Who** it's for (beginners)
- **How** to structure it (specific points + example)

This turns a 3-word vague prompt into a clear instruction!`,

  explanationContent: `# Deep Dive: Prompting Basics

## Why Specificity Matters

Think of AI like a super-smart intern who needs clear instructions:

**Vague prompt:**
\`\`\`
"Make it better"
\`\`\`
The AI doesn't know what "it" is or what "better" means!

**Specific prompt:**
\`\`\`
"Improve this Python function's performance by using list
comprehensions instead of for loops"
\`\`\`
Now the AI knows exactly what to optimize and how.

## The Context Principle

Context helps AI understand your situation:

\`\`\`
Without context: "Explain variables"
❌ Too broad - could be math, programming, science...

With context: "Explain JavaScript variables to someone who
knows Python. Focus on var vs let vs const differences."
✅ Perfect - AI knows your background and focus area
\`\`\`

## Format Specifications

Tell the AI how to structure the response:

\`\`\`python
# Option 1: Bullet list
"List 5 benefits of using Python for data science"

# Option 2: Code with comments
"Show how to read a CSV file with explanatory comments"

# Option 3: Table
"Compare Python, JavaScript, and Java in a table"

# Option 4: Step-by-step
"Explain how to set up a Django project in numbered steps"
\`\`\`

## The "Triple C" Framework

Every good prompt has:
1. **Clear** objective - what do you want?
2. **Context** - what's your situation?
3. **Constraints** - format, length, style?`,

  realworldContent: `# Real-World Applications

## 1. Code Generation

**Vague:**
\`\`\`
"Create an API"
\`\`\`

**Specific:**
\`\`\`
"Create a Flask REST API with two endpoints:
- GET /users - returns list of users
- POST /users - creates a new user
Include input validation and error handling."
\`\`\`

## 2. Bug Fixing

**Vague:**
\`\`\`
"Fix this code"
\`\`\`

**Specific:**
\`\`\`
"This Python function should calculate the average of a list,
but it crashes with empty lists. Fix it by adding error handling
that returns 0 for empty inputs."
\`\`\`

## 3. Documentation

**Vague:**
\`\`\`
"Write docs"
\`\`\`

**Specific:**
\`\`\`
"Write a README for a weather API client library. Include:
- Installation instructions
- Quick start example
- API key setup
- 3 usage examples"
\`\`\`

## 4. Learning

**Vague:**
\`\`\`
"Teach me SQL"
\`\`\`

**Specific:**
\`\`\`
"Explain SQL JOIN operations to someone familiar with Python.
Use a simple example with two tables: users and orders.
Show the difference between INNER JOIN and LEFT JOIN."
\`\`\`

## 5. Code Review

**Vague:**
\`\`\`
"Review this"
\`\`\`

**Specific:**
\`\`\`
"Review this React component for:
- Performance issues (unnecessary re-renders)
- Best practices (hooks usage)
- Accessibility concerns
Provide specific line-by-line suggestions."
\`\`\``,

  mistakesContent: `# Common Mistakes to Avoid

## 1. Being Too Vague

\`\`\`python
# ❌ Wrong - too vague
"Help with my code"

# ✅ Correct - specific problem
"My Python script throws 'KeyError: username' on line 15.
How do I safely access dictionary keys that might not exist?"
\`\`\`

## 2. No Context

\`\`\`python
# ❌ Wrong - no background
"What's better for this?"

# ✅ Correct - provides context
"I'm building a REST API. Should I use Flask or Django?
I need something lightweight for 5 endpoints and don't need
an admin panel."
\`\`\`

## 3. Assuming AI Knows Everything About Your Project

\`\`\`python
# ❌ Wrong - assumes context
"Fix the login bug"

# ✅ Correct - provides code and error
"This login function returns 401 even with correct credentials:
[paste code]
Error message: 'Invalid token'
I'm using JWT authentication."
\`\`\`

## 4. No Format Specification

\`\`\`python
# ❌ Wrong - unclear desired output
"Explain recursion"

# ✅ Correct - specifies format
"Explain recursion with:
1. A simple analogy
2. A Python factorial example with comments
3. When to use vs. when to avoid"
\`\`\`

## 5. Asking Multiple Unrelated Things

\`\`\`python
# ❌ Wrong - too many topics
"Explain Docker, Kubernetes, microservices, and DevOps"

# ✅ Correct - focused request
"Explain what Docker is and show a simple Dockerfile example
for a Python Flask app"
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: What makes a prompt "good"?

**Answer:** A good prompt is:
1. **Specific** - clear objective, not vague
2. **Contextual** - provides background info
3. **Formatted** - specifies desired output structure

Example: Instead of "explain APIs", use "explain REST APIs to a frontend developer, including GET/POST examples in JavaScript fetch()"

## Q2: How do you improve a vague prompt?

**Answer:** Use the "5 W's + How":
- **What** - what exactly do you need?
- **Why** - what's the purpose/context?
- **Who** - who is this for? (beginner, expert?)
- **When** - any time constraints?
- **Where** - what environment/platform?
- **How** - what format should the response take?

## Q3: Why does context matter in prompts?

**Answer:** Context helps AI understand:
- Your skill level (beginner vs expert)
- Your constraints (can't use libraries, must use Python 3.9)
- Your goal (learning vs production code)

"Explain async/await" → Could mean JavaScript, Python, C#...
"Explain Python async/await to a JavaScript developer" → AI knows to compare with JS Promises!

## Q4: What's the difference between these prompts?

Prompt A: "Write a function"
Prompt B: "Write a Python function that takes a list of numbers and returns only even ones"

**Answer:**
- Prompt A is too vague (what language? what does it do?)
- Prompt B specifies: language (Python), input (list of numbers), output (even numbers only)
- Prompt B will get a useful response, Prompt A won't`,

  starterCode: `# Prompting Basics Exercise
# Improve these vague prompts!

# VAGUE PROMPT 1: "Code a game"
# TODO: Rewrite to be specific, include context, specify format
improved_prompt_1 = """

"""

# VAGUE PROMPT 2: "Help with database"
# TODO: Specify what you need, provide context, request format
improved_prompt_2 = """

"""

# VAGUE PROMPT 3: "Explain machine learning"
# TODO: Make it specific, add context (your skill level), request format
improved_prompt_3 = """

"""

# Test your prompts
print("Improved Prompt 1:")
print(improved_prompt_1)
print("\\nImproved Prompt 2:")
print(improved_prompt_2)
print("\\nImproved Prompt 3:")
print(improved_prompt_3)`,

  solutionCode: `# Prompting Basics Exercise
# Improved prompts with specificity, context, and format!

# VAGUE PROMPT 1: "Code a game"
improved_prompt_1 = """
Create a Python text-based number guessing game where:
- Computer picks a random number 1-100
- Player has 7 tries to guess it
- Show "higher" or "lower" hints
- Display win/loss message at end
Include comments explaining the code.
"""

# VAGUE PROMPT 2: "Help with database"
improved_prompt_2 = """
I'm building a Flask app and need to store user data.
Should I use SQLite or PostgreSQL for:
- 1000 users initially
- Simple CRUD operations
- Deployed on Heroku
Explain pros/cons of each in 2-3 sentences.
"""

# VAGUE PROMPT 3: "Explain machine learning"
improved_prompt_3 = """
Explain supervised learning to a Python programmer with no ML background.
Include:
- Simple analogy (like teaching a child)
- The difference between classification and regression
- One practical example (spam detection OR house prices)
- What libraries to start with (scikit-learn)
Keep it under 200 words.
"""

# Test your prompts
print("Improved Prompt 1:")
print(improved_prompt_1)
print("\\nImproved Prompt 2:")
print(improved_prompt_2)
print("\\nImproved Prompt 3:")
print(improved_prompt_3)`,

  hints: [
    "Ask yourself: What exactly do I want? Be super specific!",
    "Add context: Who are you? What's your skill level? What's your goal?",
    "Specify format: List? Code example? Table? Step-by-step?",
    "Use the 5 W's: What, Why, Who, When, Where + How",
  ],
};
