import type { LessonContent } from '../types';

export const promptDebugging: LessonContent = {
  slug: "prompt-debugging",
  problemContent: `# Prompt Debugging

When prompts don't work, here's how to fix them!

## Common Problems & Fixes

| Problem | Cause | Fix |
|---------|-------|-----|
| Wrong format | Unclear instructions | Add explicit example |
| Too long | No length limit | Specify word/sentence count |
| Missing info | Not required | List required fields |
| Hallucinations | No constraints | Add "only use provided info" |

## Debugging Process

1. **Identify** - What exactly is wrong?
2. **Isolate** - Which part causes it?
3. **Test** - Try one fix at a time
4. **Iterate** - Repeat until solved

## Debugging Techniques

\`\`\`python
# Add explicit length
"Maximum 50 words"

# Add format example
"Format as JSON like: {\\"name\\": \\"value\\"}"

# Add negative constraints
"Do NOT include disclaimers or caveats."
\`\`\`

## Your Task

1. Take this broken prompt: "Summarize this article"
2. Identify 3 problems with it
3. Create an improved version with explicit format
4. Test both versions and compare results`,

  solutionContent: `# Solution: Prompt Debugging

\`\`\`python
from openai import OpenAI

client = OpenAI()

# PROBLEM: "Summarize this article" gives inconsistent results

# Step 1: Identify issues
issues = [
    "No length specified",
    "No format defined",
    "No focus areas",
    "No context about audience"
]

# Step 2: Improved prompt
def summarize_article(article, debug=False):
    # v1 - Original broken prompt
    v1_prompt = f"Summarize this article:\\n{article}"

    # v2 - Add length
    v2_prompt = f"Summarize in 3 sentences:\\n{article}"

    # v3 - Add format and structure
    v3_prompt = f\"\"\"
Summarize this article:

{article}

Requirements:
- 3 bullet points maximum
- Each bullet: 1 sentence
- Focus on key facts, not opinions
- No introductory phrases like "This article discusses..."
\"\"\"

    # v4 - Add example (final version)
    final_prompt = f\"\"\"
Summarize this article in exactly 3 bullet points.

Article:
{article}

Format:
- [Key point 1]
- [Key point 2]
- [Key point 3]

Rules:
- One sentence per bullet
- Facts only, no opinions
- No filler phrases
\"\"\"

    if debug:
        print("Using prompt version 4 (final)")

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": final_prompt}],
        temperature=0.3
    )
    return response.choices[0].message.content

# Debug helper
def test_prompt(prompt, article):
    \"\"\"Run the same prompt 3 times to check consistency\"\"\"
    results = []
    for i in range(3):
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt.format(article=article)}],
            temperature=0.3
        )
        results.append(response.choices[0].message.content)

    # Check consistency
    if len(set(results)) == 1:
        print("Consistent output")
    else:
        print(f"Inconsistent: {len(set(results))} different outputs")

    return results

# Test
article = "OpenAI released GPT-4 in March 2023. It shows improved reasoning and can accept images. The model is available via API."
print(summarize_article(article, debug=True))
\`\`\``,

  explanationContent: `# Deep Dive: Debugging Strategies

## A/B Testing Prompts

\`\`\`python
def ab_test(prompt_a, prompt_b, test_inputs, n=5):
    results = {"a": [], "b": []}

    for input in test_inputs[:n]:
        results["a"].append(run_prompt(prompt_a, input))
        results["b"].append(run_prompt(prompt_b, input))

    # Score results
    scores_a = [score_output(r) for r in results["a"]]
    scores_b = [score_output(r) for r in results["b"]]

    return {
        "prompt_a_avg": sum(scores_a) / len(scores_a),
        "prompt_b_avg": sum(scores_b) / len(scores_b)
    }
\`\`\`

## Prompt Versioning

\`\`\`python
class PromptVersion:
    def __init__(self, template, version, notes):
        self.template = template
        self.version = version
        self.notes = notes
        self.created_at = datetime.now()

# Keep history
prompt_v1 = PromptVersion("Summarize: {text}", "1.0", "Initial")
prompt_v2 = PromptVersion("Summarize in 3 points: {text}", "1.1", "Added structure")
prompt_v3 = PromptVersion("...", "1.2", "Added examples")
\`\`\`

## Common Fixes

| Problem | Solution |
|---------|----------|
| Wrong format | Add explicit example |
| Too long | Specify word/sentence limit |
| Missing info | List required fields |
| Hallucinations | Add "only use provided info" |
| Inconsistent | Lower temperature |`,

  realworldContent: `# Real-World Applications

## 1. Prompt Evaluation Framework
\`\`\`python
class PromptEvaluator:
    def __init__(self):
        self.criteria = [
            ("format", self.check_format),
            ("length", self.check_length),
            ("accuracy", self.check_accuracy),
            ("relevance", self.check_relevance)
        ]

    def evaluate(self, output, expected):
        scores = {}
        for name, check in self.criteria:
            scores[name] = check(output, expected)
        return scores
\`\`\`

## 2. Automated Testing
\`\`\`python
def test_prompt_regression(prompt, test_cases):
    failures = []
    for input, expected in test_cases:
        output = run_prompt(prompt, input)
        if not matches_expected(output, expected):
            failures.append({
                "input": input,
                "expected": expected,
                "actual": output
            })
    return failures
\`\`\``,

  mistakesContent: `# Common Debugging Mistakes

## 1. Changing Too Much at Once
\`\`\`python
# Bad - changed 5 things, what fixed it?
v1 → v2 (completely different)

# Good - one change at a time
v1 → v1.1 (add length) → v1.2 (add format) → v1.3 (add example)
\`\`\`

## 2. Not Testing Edge Cases
\`\`\`python
# Test with:
# - Very short input
# - Very long input
# - Missing expected fields
# - Unusual formats
# - Multiple languages
\`\`\`

## 3. Ignoring Temperature
\`\`\`python
# For consistent outputs, lower temperature
temperature=0.2

# Test at temperature=0 first to establish baseline
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: How do you debug a failing prompt?
**Answer:** Identify the specific failure, check examples at temperature=0, add explicit instructions, test one change at a time, use few-shot examples.

## Q2: How do you ensure prompt reliability?
**Answer:** Version control prompts, create test suites, use low temperature, monitor outputs in production, set up regression tests.

## Q3: How do you handle inconsistent outputs?
**Answer:** Lower temperature, add explicit format requirements, use few-shot examples, increase specificity of instructions.`,

  starterCode: `from openai import OpenAI

client = OpenAI()

# This prompt is giving inconsistent results
# Debug and fix it!

broken_prompt = "Summarize this article: {article}"

def summarize(article):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": broken_prompt.format(article=article)}]
    )
    return response.choices[0].message.content

# TODO: Create an improved version
improved_prompt = ""

def summarize_improved(article):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": improved_prompt.format(article=article)}],
        temperature=0.3
    )
    return response.choices[0].message.content

# Test
article = "OpenAI released GPT-4 in March 2023. It shows improved reasoning abilities."
print("Original:", summarize(article))
print("\\nImproved:", summarize_improved(article))`,

  solutionCode: `from openai import OpenAI

client = OpenAI()

# Original broken prompt
broken_prompt = "Summarize this article: {article}"

def summarize(article):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": broken_prompt.format(article=article)}]
    )
    return response.choices[0].message.content

# Improved version with clear structure
improved_prompt = \"\"\"
Summarize this article in exactly 3 bullet points.

Article: {article}

Format:
- [Key point 1]
- [Key point 2]
- [Key point 3]

Rules:
- One sentence per bullet
- Focus on facts only
- No introductory phrases
\"\"\"

def summarize_improved(article):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": improved_prompt.format(article=article)}],
        temperature=0.3  # Lower temp for consistency
    )
    return response.choices[0].message.content

# Test
article = "OpenAI released GPT-4 in March 2023. It shows improved reasoning abilities."
print("Original:", summarize(article))
print("\\nImproved:", summarize_improved(article))`,

  hints: [
    "Add explicit length requirements",
    "Specify the output format clearly",
    "Lower temperature for consistency",
    "Add 'do not' rules for unwanted behavior"
  ]
};
