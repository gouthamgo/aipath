import type { LessonContent } from '../types';

export const structuredPrompts: LessonContent = {
  slug: "structured-prompts",
  problemContent: `# Structured Prompts

Use templates and formats for consistent, reliable outputs!

## Template Formats

| Format | Best For | Example |
|--------|----------|---------|
| Markdown | Human-readable docs | \`## Heading\`, \`- bullet\` |
| JSON | API responses | \`{"key": "value"}\` |
| XML | Nested structures | \`<tag>content</tag>\` |
| Tables | Comparisons | \`| A | B |\` |

## Why Structure?

Unstructured: "Tell me about the product"
→ Random format, varying length, missing info

Structured: Template with specific sections
→ Consistent format, complete info, easy to parse

## Template Example

\`\`\`python
template = \"\"\"
Analyze this product:

Product: {product_name}

Please provide:
1. **Target Audience**: Who would buy this?
2. **Key Features**: Top 3 features
3. **Pricing Strategy**: Recommended price point
\"\"\"
\`\`\`

## Your Task

1. Create a structured template for product reviews
2. Include sections: Rating, Pros, Cons, Verdict
3. Use markdown formatting for headers
4. Test with a sample product`,

  solutionContent: `# Solution: Structured Prompts

\`\`\`python
from openai import OpenAI

client = OpenAI()

def generate_review(product_name, product_description):
    template = f\"\"\"
You are a professional product reviewer.

Generate a balanced review for this product:

**Product**: {product_name}
**Description**: {product_description}

Use this exact format:

## Rating: X/10

## Pros
- [Pro 1]
- [Pro 2]
- [Pro 3]

## Cons
- [Con 1]
- [Con 2]

## Best For
[Describe ideal customer]

## Verdict
[2-3 sentence summary and recommendation]
\"\"\"

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": template}]
    )
    return response.choices[0].message.content

# Test
review = generate_review(
    "AirPods Pro 2",
    "Wireless earbuds with active noise cancellation, spatial audio, and H2 chip"
)
print(review)
\`\`\`

## Output Example
\`\`\`
## Rating: 8.5/10

## Pros
- Excellent noise cancellation
- Seamless Apple ecosystem integration
- Comfortable for extended wear

## Cons
- Premium price point
- No lossless audio support

## Best For
Apple users who want premium audio and ANC in a compact package.

## Verdict
The AirPods Pro 2 deliver exceptional noise cancellation and sound quality.
Highly recommended for iPhone users, though Android users have better options.
\`\`\``,

  explanationContent: `# Deep Dive: Template Patterns

## Fill-in-the-Blank

\`\`\`python
template = \"\"\"
Write a {tone} email about {topic}.

To: {recipient}
Subject: {subject}

Email body:
\"\"\"
\`\`\`

## JSON Output Template

\`\`\`python
template = \"\"\"
Extract information from this text and return JSON:

Text: {text}

Return this exact JSON structure:
{
    "entities": ["list of people/places/orgs"],
    "sentiment": "positive/negative/neutral",
    "key_points": ["main point 1", "main point 2"],
    "summary": "one sentence summary"
}
\"\"\"
\`\`\`

## Markdown Sections

\`\`\`python
template = \"\"\"
Create a study guide for: {topic}

Use this format:

# {topic} Study Guide

## Key Concepts
- Concept 1: explanation
- Concept 2: explanation

## Common Mistakes
1. Mistake and how to avoid

## Practice Questions
1. Question?
   Answer: ...

## Resources
- Resource 1
\"\"\"
\`\`\``,

  realworldContent: `# Real-World Applications

## 1. Bug Report Generator
\`\`\`python
bug_template = \"\"\"
Generate a bug report from this description:

Description: {user_description}

Format:
## Bug Report

**Title**: [Concise title]
**Severity**: [Critical/High/Medium/Low]
**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]

**Expected Behavior**: [What should happen]
**Actual Behavior**: [What actually happens]
**Environment**: [OS, browser, version]
\"\"\"
\`\`\`

## 2. Meeting Summary
\`\`\`python
meeting_template = \"\"\"
Summarize this meeting transcript:

{transcript}

Format:
## Meeting Summary

**Date**: [Date]
**Attendees**: [Names]

### Key Decisions
- Decision 1
- Decision 2

### Action Items
| Owner | Task | Due Date |
|-------|------|----------|
| Name  | Task | Date     |

### Next Steps
- Step 1
\"\"\"
\`\`\``,

  mistakesContent: `# Common Mistakes

## 1. Inconsistent Formatting
\`\`\`python
# Bad - mixes formats
"Give me bullets, then a table, then paragraphs..."

# Good - clear consistent format
"Use bullet points for all lists"
\`\`\`

## 2. Not Showing Examples
\`\`\`python
# Bad - ambiguous
"Format nicely"

# Good - explicit example
\"\"\"
Format like this:
- **Feature**: Description
- **Feature**: Description
\"\"\"
\`\`\`

## 3. Over-structured
\`\`\`python
# Too rigid - hard to fill
\"\"\"
Section 1.1.1: [exactly 3 words]
Section 1.1.2: [exactly 5 words]
\"\"\"

# Flexible enough
\"\"\"
## Overview
[1-2 sentences]

## Details
[As needed]
\"\"\"
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: Why use structured prompts?
**Answer:** Consistent outputs, easier parsing, complete information, better for downstream processing.

## Q2: XML vs Markdown structure?
**Answer:** XML is easier to parse programmatically. Markdown is more readable. Choose based on whether output is for humans or code.

## Q3: How to handle variable-length content?
**Answer:** Use flexible markers like "[as needed]" or "[1-3 items]" instead of fixed counts.`,

  starterCode: `from openai import OpenAI

client = OpenAI()

def generate_review(product_name, description):
    # TODO: Create a structured template for product reviews
    # Include: Rating, Pros, Cons, Best For, Verdict
    template = f\"\"\"

\"\"\"

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": template}]
    )
    return response.choices[0].message.content

# Test
print(generate_review("iPhone 15", "Latest Apple smartphone with USB-C"))`,

  solutionCode: `from openai import OpenAI

client = OpenAI()

def generate_review(product_name, description):
    template = f\"\"\"
Generate a balanced product review.

Product: {product_name}
Description: {description}

Use this exact format:

## Rating: X/10

## Pros
- [Advantage 1]
- [Advantage 2]
- [Advantage 3]

## Cons
- [Disadvantage 1]
- [Disadvantage 2]

## Best For
[Ideal customer in one sentence]

## Verdict
[2-3 sentence recommendation]
\"\"\"

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": template}]
    )
    return response.choices[0].message.content

# Test
print(generate_review("iPhone 15", "Latest Apple smartphone with USB-C"))`,

  hints: [
    "Define exact section headers with ##",
    "Show the format with placeholders",
    "Use consistent bullet/number styles",
    "Include expected length hints"
  ]
};
