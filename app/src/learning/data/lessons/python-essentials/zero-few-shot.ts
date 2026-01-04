import type { LessonContent } from '../types';

export const zeroFewShot: LessonContent = {
  slug: "zero-few-shot",
  problemContent: `# Zero-Shot vs Few-Shot Learning

Think of this like teaching someone a new task: sometimes you just explain it (zero-shot), and sometimes you show examples first (few-shot).

## What Are These?

**Zero-shot**: Give the AI a task with no examples
\`\`\`
"Extract the email from this text: Contact me at john@example.com"
\`\`\`

**Few-shot**: Show the AI examples, then give it the task
\`\`\`
Example 1: "Contact: john@example.com" → john@example.com
Example 2: "Email me: sarah@test.org" → sarah@test.org
Now you: "Reach out at mike@company.net"
\`\`\`

## When to Use Each

| Zero-Shot | Few-Shot |
|-----------|----------|
| Simple, common tasks | Custom formats |
| AI already knows the pattern | Specific style needed |
| Quick one-off requests | Consistent output format |

## Your Task

You need to classify customer feedback as "positive", "negative", or "neutral".

Try it both ways:
1. Zero-shot (just ask)
2. Few-shot (show 3 examples first)

Which gives more consistent results?`,

  solutionContent: `# Solution: Zero-Shot vs Few-Shot

Here's how to do both:

## Zero-Shot Approach

\`\`\`python
prompt = """
Classify this customer feedback as positive, negative, or neutral:
"The product arrived late but works great."
"""
\`\`\`

Result: Might say "Mixed" or "Neutral" - inconsistent!

## Few-Shot Approach

\`\`\`python
prompt = """
Classify customer feedback as positive, negative, or neutral.

Examples:
"Love this product!" → positive
"Terrible experience" → negative
"It's okay" → neutral

Now classify: "The product arrived late but works great."
"""
\`\`\`

Result: Consistently returns "positive" or "neutral" - more reliable!

## Why Few-Shot Won

The examples taught the AI:
- Your exact format (lowercase, one word)
- How to handle mixed sentiment
- What you mean by each category

## When to Use Few-Shot

✅ Custom classification tasks
✅ Specific output formats
✅ Consistent responses needed
✅ Unusual or domain-specific tasks`,

  explanationContent: `# Deep Dive: Zero-Shot vs Few-Shot

## Zero-Shot Learning

The AI uses its pre-trained knowledge:

\`\`\`python
# Works great for common tasks
"Translate to Spanish: Hello, how are you?"
"Summarize this article in 2 sentences"
"What is the capital of France?"
\`\`\`

**Pros:**
- Faster (shorter prompts)
- Good for standard tasks
- Less prompt engineering needed

**Cons:**
- Less control over format
- May not match your specific needs
- Inconsistent for custom tasks

## Few-Shot Learning

You teach the AI by showing examples:

\`\`\`python
prompt = """
Convert casual text to professional:

Casual: "Hey, got your email"
Professional: "Thank you for your message"

Casual: "Can't make it tomorrow"
Professional: "I am unable to attend tomorrow"

Casual: "Thanks a bunch!"
Professional: [AI completes this]
"""
\`\`\`

**Pros:**
- Consistent output format
- Works for custom tasks
- You control the style

**Cons:**
- Longer prompts (uses more tokens)
- Need to create good examples
- Takes more time to craft

## The Magic Number: 3-5 Examples

Research shows 3-5 examples is the sweet spot:
- 1-2 examples: Not enough to establish pattern
- 3-5 examples: AI gets it!
- 10+ examples: Diminishing returns (and costs more)

## Example Quality Matters

\`\`\`python
# ❌ Bad examples - too similar
"Great product" → positive
"Excellent item" → positive
"Amazing quality" → positive

# ✅ Good examples - diverse
"Great product" → positive
"Terrible quality" → negative
"It's okay" → neutral
\`\`\`

Diverse examples help AI generalize better!`,

  realworldContent: `# Real-World Applications

## 1. Email Classification

**Zero-shot:**
\`\`\`python
"Classify this email as spam or not spam:
'Congratulations! You won \$1000000!!!'"
\`\`\`

**Few-shot (better for custom categories):**
\`\`\`python
"""
Classify emails as: sales, support, spam, or general

sales: "Special offer on our product"
support: "How do I reset my password?"
spam: "You won a free iPhone!"
general: "Meeting tomorrow at 3pm"

Classify: "Exclusive discount just for you!"
"""
\`\`\`

## 2. Code Comment Generation

**Few-shot works better:**
\`\`\`python
"""
Add a concise comment above the function:

def calculate_tax(amount):
    return amount * 0.08
# Calculates 8% sales tax on given amount

def validate_email(email):
    return "@" in email and "." in email
# Checks if email contains @ and . symbols

def fetch_user(user_id):
    return database.get(user_id)
# [AI completes this]
"""
\`\`\`

## 3. Data Extraction

**Few-shot ensures consistent format:**
\`\`\`python
"""
Extract: name, email, phone as JSON

Input: "John Doe, john@test.com, 555-1234"
Output: {"name": "John Doe", "email": "john@test.com", "phone": "555-1234"}

Input: "Sarah at sarah@example.org, call 555-9999"
Output: {"name": "Sarah", "email": "sarah@example.org", "phone": "555-9999"}

Input: "Mike Johnson, mike@company.net, 555-0000"
Output: [AI completes]
"""
\`\`\`

## 4. Sentiment Analysis

**Few-shot for nuanced sentiment:**
\`\`\`python
"""
Rate sentiment 1-5 (1=very negative, 5=very positive)

"This is the worst product ever" → 1
"Not bad, could be better" → 3
"Absolutely love it!" → 5

"The product is okay" → [AI rates this]
"""
\`\`\``,

  mistakesContent: `# Common Mistakes to Avoid

## 1. Too Few Examples for Complex Tasks

\`\`\`python
# ❌ Wrong - only 1 example for complex task
"""
Convert to JSON:
"John, 25, engineer" → {"name": "John", "age": 25, "job": "engineer"}

Convert: "Sarah, teacher, 30"
"""

# ✅ Correct - show 3+ examples
"""
Convert to JSON:
"John, 25, engineer" → {"name": "John", "age": 25, "job": "engineer"}
"Mike, 30, teacher" → {"name": "Mike", "age": 30, "job": "teacher"}
"Sarah, 28, doctor" → {"name": "Sarah", "age": 28, "job": "doctor"}

Convert: "Tom, 35, lawyer"
"""
\`\`\`

## 2. Inconsistent Example Format

\`\`\`python
# ❌ Wrong - different formats confuse AI
"""
"happy" → positive
"Sad text here" → Negative
"neutral statement" → NEUTRAL
"""

# ✅ Correct - consistent format
"""
"I'm happy" → positive
"I'm sad" → negative
"It's okay" → neutral
"""
\`\`\`

## 3. Using Few-Shot When Zero-Shot Works

\`\`\`python
# ❌ Wrong - wasting tokens on simple task
"""
Examples:
"Hello" in Spanish → "Hola"
"Goodbye" in Spanish → "Adiós"

Translate "Thank you" to Spanish
"""

# ✅ Correct - zero-shot is fine
"Translate to Spanish: Thank you"
\`\`\`

## 4. Examples Don't Cover Edge Cases

\`\`\`python
# ❌ Wrong - all examples are simple
"""
Extract price:
"\$10.99" → 10.99
"\$25.00" → 25.00

Extract: "Price: 15 dollars"  # AI might fail!
"""

# ✅ Correct - diverse examples
"""
Extract price as number:
"\$10.99" → 10.99
"Price: 15 dollars" → 15.00
"Costs €20" → 20.00

Extract: "Only 30 bucks"
"""
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: What's the difference between zero-shot and few-shot prompting?

**Answer:**
- **Zero-shot**: Give task with no examples - AI uses pre-trained knowledge
  - Example: "Translate to French: Hello"
- **Few-shot**: Provide 3-5 examples before the actual task
  - Example: Show 3 translation examples, then ask for translation

Few-shot gives more control over format and consistency.

## Q2: When should you use few-shot instead of zero-shot?

**Answer:** Use few-shot when you need:
1. **Custom format** - specific JSON structure, style
2. **Consistency** - same format every time
3. **Domain-specific** - unusual tasks AI hasn't seen much
4. **Fine-grained control** - exact output style

Use zero-shot for common tasks like translation, summarization, simple Q&A.

## Q3: How many examples should you provide in few-shot prompting?

**Answer:**
- **Sweet spot: 3-5 examples**
- 1-2 examples: Often not enough to establish pattern
- 3-5 examples: AI learns the pattern well
- 10+ examples: Diminishing returns + higher cost

Quality > Quantity: Diverse examples teach better than many similar ones.

## Q4: Why might few-shot prompting fail?

**Answer:** Common reasons:
1. **Inconsistent examples** - different formats confuse AI
2. **Too few examples** - pattern not clear
3. **Non-diverse examples** - all too similar, AI can't generalize
4. **Conflicting examples** - examples contradict each other

Good few-shot prompts have consistent, diverse, quality examples.`,

  starterCode: `# Zero-Shot vs Few-Shot Exercise
import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Task: Classify code comments as "TODO", "FIXME", or "NOTE"

# TODO: Write a zero-shot prompt
zero_shot_prompt = """

"""

# TODO: Write a few-shot prompt with 3 examples
few_shot_prompt = """

"""

# Test data
test_comment = "# Remember to add error handling here"

# TODO: Test both approaches
def test_zero_shot():
    # Use zero_shot_prompt to classify test_comment
    pass

def test_few_shot():
    # Use few_shot_prompt to classify test_comment
    pass

# Run tests
print("Zero-shot result:", test_zero_shot())
print("Few-shot result:", test_few_shot())`,

  solutionCode: `# Zero-Shot vs Few-Shot Exercise
import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Task: Classify code comments as "TODO", "FIXME", or "NOTE"

# Zero-shot prompt
zero_shot_prompt = """
Classify this code comment as TODO, FIXME, or NOTE:
"{comment}"

Classification:
"""

# Few-shot prompt with examples
few_shot_prompt = """
Classify code comments as TODO, FIXME, or NOTE.

Examples:
"Add user authentication" → TODO
"This breaks on empty input" → FIXME
"Uses caching for performance" → NOTE

Classify: "{comment}"
"""

# Test data
test_comment = "Remember to add error handling here"

def test_zero_shot():
    """Test zero-shot classification."""
    prompt = zero_shot_prompt.format(comment=test_comment)

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=10
    )

    return response.choices[0].message.content.strip()

def test_few_shot():
    """Test few-shot classification."""
    prompt = few_shot_prompt.format(comment=test_comment)

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=10
    )

    return response.choices[0].message.content.strip()

# Run tests
print("Zero-shot result:", test_zero_shot())
print("Few-shot result:", test_few_shot())

# Few-shot should consistently return "TODO"
# Zero-shot might vary: "TODO", "Note", "Reminder", etc.`,

  hints: [
    "Zero-shot: Just describe the task clearly",
    "Few-shot: Show 3-5 diverse examples in consistent format",
    "Include the test comment in both prompts",
    "Few-shot examples: one for each category (TODO, FIXME, NOTE)",
  ],
};
