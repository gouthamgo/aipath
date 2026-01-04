import type { LessonContent } from '../types';

export const promptChaining: LessonContent = {
  slug: "prompt-chaining",
  problemContent: `# Prompt Chaining

Break complex tasks into a series of simpler prompts!

## Chain Patterns

| Pattern | Flow | Use Case |
|---------|------|----------|
| Sequential | A → B → C | Step-by-step tasks |
| Parallel | A → [B, C] → D | Independent subtasks |
| Branching | A → B or C | Conditional logic |

## The Problem

Complex tasks in one prompt often fail:
- Too many instructions
- Context gets lost
- Quality degrades

## The Solution: Chains

\`\`\`
Input → Prompt 1 → Output 1 → Prompt 2 → Output 2 → Final
\`\`\`

## Basic Chain Pattern

\`\`\`python
def chain_prompts(initial_input):
    outline = generate_outline(initial_input)
    sections = write_sections(outline)
    final = edit_and_polish(sections)
    return final
\`\`\`

## Your Task

1. Create a content generation chain for a topic
2. Step 1: Generate 3 key points
3. Step 2: Expand each point into a paragraph
4. Step 3: Write a summary of everything`,

  solutionContent: `# Solution: Prompt Chaining

\`\`\`python
from openai import OpenAI

client = OpenAI()

def call_llm(prompt, temperature=0.7):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=temperature
    )
    return response.choices[0].message.content

def generate_content_chain(topic):
    print(f"Processing: {topic}\\n")

    # Step 1: Generate key points
    step1_prompt = f\"\"\"
Topic: {topic}

Generate exactly 3 key points about this topic.
Format:
1. [Point 1]
2. [Point 2]
3. [Point 3]
\"\"\"
    key_points = call_llm(step1_prompt)
    print("Step 1 - Key Points:")
    print(key_points)

    # Step 2: Expand each point
    step2_prompt = f\"\"\"
Expand each of these points into a detailed paragraph (3-4 sentences each):

{key_points}

Format:
## Point 1
[Paragraph]

## Point 2
[Paragraph]

## Point 3
[Paragraph]
\"\"\"
    expanded = call_llm(step2_prompt)
    print("\\nStep 2 - Expanded:")
    print(expanded)

    # Step 3: Write summary
    step3_prompt = f\"\"\"
Based on this content, write a concise summary (2-3 sentences):

{expanded}

Summary:
\"\"\"
    summary = call_llm(step3_prompt)
    print("\\nStep 3 - Summary:")
    print(summary)

    return {
        "key_points": key_points,
        "expanded": expanded,
        "summary": summary
    }

# Test
result = generate_content_chain("The benefits of meditation")
\`\`\``,

  explanationContent: `# Deep Dive: Chain Patterns

## Sequential Chain

\`\`\`
A → B → C → D
Each step uses output from previous
\`\`\`

## Parallel Chain

\`\`\`
    ↗ B ↘
A →      → D
    ↘ C ↗
Multiple steps run in parallel, merge results
\`\`\`

## Branching Chain

\`\`\`
      ↗ B (if X)
A → ?
      ↘ C (if Y)
Different paths based on conditions
\`\`\`

## Implementation Patterns

\`\`\`python
# Sequential
def sequential_chain(input):
    a = step_a(input)
    b = step_b(a)
    c = step_c(b)
    return c

# Parallel
import asyncio

async def parallel_chain(input):
    a, b = await asyncio.gather(
        step_a(input),
        step_b(input)
    )
    return combine(a, b)

# Branching
def branching_chain(input):
    analysis = analyze(input)
    if analysis.type == "simple":
        return simple_handler(input)
    else:
        return complex_handler(input)
\`\`\``,

  realworldContent: `# Real-World Applications

## 1. Research Pipeline
\`\`\`python
def research_chain(question):
    # 1. Identify key terms
    terms = extract_key_terms(question)

    # 2. Search for each term (parallel)
    results = [search(term) for term in terms]

    # 3. Synthesize findings
    synthesis = synthesize(results)

    # 4. Generate answer
    answer = generate_answer(question, synthesis)

    # 5. Verify facts
    verified = verify_facts(answer)

    return verified
\`\`\`

## 2. Code Generation Pipeline
\`\`\`python
def code_gen_chain(requirements):
    # 1. Understand requirements
    parsed = parse_requirements(requirements)

    # 2. Design architecture
    design = create_design(parsed)

    # 3. Generate code
    code = generate_code(design)

    # 4. Review code
    issues = review_code(code)

    # 5. Fix issues
    final = fix_issues(code, issues)

    return final
\`\`\``,

  mistakesContent: `# Common Mistakes

## 1. No Context Passing
\`\`\`python
# Bad - loses context
def chain():
    outline = step1()
    content = step2()  # Doesn't know about outline!

# Good - pass context
def chain():
    outline = step1()
    content = step2(outline)  # Uses outline
\`\`\`

## 2. Too Many Steps
\`\`\`python
# Bad - 10 tiny steps, slow and expensive
step1 → step2 → step3 → ... → step10

# Good - consolidate related operations
step1 (research) → step2 (write) → step3 (review)
\`\`\`

## 3. No Error Handling
\`\`\`python
# Bad - chain breaks on any error
a = step_a()
b = step_b(a)

# Good - handle errors
try:
    a = step_a()
    if not validate(a):
        return retry_or_fallback()
    b = step_b(a)
except Exception as e:
    log_error(e)
    return fallback_result()
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: When to use prompt chaining?
**Answer:** For complex multi-step tasks, when quality degrades in single prompts, or when you need intermediate validation.

## Q2: Chain vs single long prompt?
**Answer:** Chains: more control, debuggable, can validate steps. Single: faster, cheaper for simple tasks. Use chains for complex or critical outputs.

## Q3: How to handle chain failures?
**Answer:** Retry individual steps, use fallbacks, log intermediate outputs, implement checkpoints to resume failed chains.`,

  starterCode: `from openai import OpenAI

client = OpenAI()

def call_llm(prompt):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content

def content_chain(topic):
    # TODO: Step 1 - Generate 3 key points
    step1_prompt = ""
    key_points = call_llm(step1_prompt)

    # TODO: Step 2 - Expand each point
    step2_prompt = ""
    expanded = call_llm(step2_prompt)

    # TODO: Step 3 - Write summary
    step3_prompt = ""
    summary = call_llm(step3_prompt)

    return summary

# Test
print(content_chain("Artificial Intelligence"))`,

  solutionCode: `from openai import OpenAI

client = OpenAI()

def call_llm(prompt):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content

def content_chain(topic):
    # Step 1 - Generate 3 key points
    step1_prompt = f"List 3 key points about {topic}. Number them 1, 2, 3."
    key_points = call_llm(step1_prompt)
    print("Key Points:", key_points)

    # Step 2 - Expand each point
    step2_prompt = f"Expand each point into a paragraph:\\n\\n{key_points}"
    expanded = call_llm(step2_prompt)
    print("\\nExpanded:", expanded)

    # Step 3 - Write summary
    step3_prompt = f"Summarize this in 2 sentences:\\n\\n{expanded}"
    summary = call_llm(step3_prompt)
    print("\\nSummary:", summary)

    return summary

# Test
print("\\n=== Final Output ===")
print(content_chain("Artificial Intelligence"))`,

  hints: [
    "Each step should have one clear purpose",
    "Pass output from one step as input to next",
    "Print intermediate results for debugging",
    "Use the {variable} in f-strings to include previous outputs"
  ]
};
