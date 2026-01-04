import type { LessonContent } from '../types';

export const chainOfThought: LessonContent = {
  slug: "chain-of-thought",
  problemContent: `# Chain of Thought Prompting

Make LLMs "think out loud" for better reasoning!

## CoT Techniques

| Technique | Trigger Phrase | Best For |
|-----------|----------------|----------|
| Zero-Shot CoT | "Let's think step by step" | Quick reasoning |
| Few-Shot CoT | Provide example chains | Complex problems |
| Self-Consistency | Multiple runs + vote | High accuracy |

## The Problem

LLMs often jump to wrong answers on complex problems:

\`\`\`
Q: If I have 3 apples and give away 2, then buy 5 more, how many do I have?
A: 8 (Wrong jump!)
\`\`\`

## Chain of Thought (CoT)

Force step-by-step reasoning:

\`\`\`
Q: If I have 3 apples and give away 2, then buy 5 more, how many do I have?
Let's think step by step:
1. Start with 3 apples
2. Give away 2: 3 - 2 = 1
3. Buy 5 more: 1 + 5 = 6
A: 6 apples
\`\`\`

## Simple CoT Trigger

Just add "Let's think step by step" or "Think through this carefully":

\`\`\`python
prompt = f\"\"\"
{question}

Let's think step by step.
\"\"\"
\`\`\`

## Your Task

1. Create a function that uses CoT prompting
2. Solve this problem: "A store has 50 items. 30% are on sale, and half of those are electronics."
3. Extract the final numerical answer`,

  solutionContent: `# Solution: Chain of Thought

\`\`\`python
from openai import OpenAI

client = OpenAI()

def solve_with_cot(problem):
    prompt = f\"\"\"
Problem: {problem}

Let's solve this step by step:
1. First, identify what we know
2. Break down the calculation
3. Show each step clearly
4. State the final answer

Solution:
\"\"\"

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2
    )
    return response.choices[0].message.content

problem = "A store has 50 items. 30% are on sale, and half of those are electronics. How many electronics are on sale?"

print(solve_with_cot(problem))
\`\`\`

## Expected Output
\`\`\`
1. The store has 50 items total
2. 30% are on sale: 50 × 0.30 = 15 items on sale
3. Half of those are electronics: 15 × 0.5 = 7.5
4. Since we can't have half an item: 7 or 8 electronics

Answer: 7.5 (or round to 7 or 8 depending on context)
\`\`\``,

  explanationContent: `# Deep Dive: CoT Variations

## Zero-Shot CoT
\`\`\`python
prompt = f"{question}\\n\\nLet's think step by step."
\`\`\`

## Few-Shot CoT
\`\`\`python
prompt = \"\"\"
Q: Roger has 5 tennis balls. He buys 2 cans of 3. How many does he have?
Let's think: Roger starts with 5. He buys 2 cans × 3 balls = 6 more.
5 + 6 = 11 tennis balls.

Q: {your_question}
Let's think:
\"\"\"
\`\`\`

## Self-Consistency
Run CoT multiple times, take majority answer:
\`\`\`python
answers = []
for _ in range(5):
    answer = solve_with_cot(problem)
    answers.append(extract_answer(answer))

final = max(set(answers), key=answers.count)
\`\`\`

## Tree of Thought
Explore multiple reasoning paths:
\`\`\`python
prompt = \"\"\"
Consider multiple approaches:
Approach A: ...
Approach B: ...
Evaluate which is more reliable.
\"\"\"
\`\`\``,

  realworldContent: `# Real-World Applications

## 1. Code Debugging
\`\`\`python
prompt = \"\"\"
Debug this code step by step:
1. What should this code do?
2. Trace through line by line
3. Where does it deviate from expected?
4. What's the fix?

Code: {buggy_code}
\"\"\"
\`\`\`

## 2. Business Analysis
\`\`\`python
prompt = \"\"\"
Analyze this business decision step by step:
1. What are the key factors?
2. What are the pros and cons?
3. What are the risks?
4. What's your recommendation?

Decision: {decision}
\"\"\"
\`\`\`

## 3. Medical Reasoning
\`\`\`python
prompt = \"\"\"
Given these symptoms, reason through:
1. What conditions match these symptoms?
2. What conditions can we rule out?
3. What additional tests would help?
4. Most likely diagnosis?
\"\"\"
\`\`\``,

  mistakesContent: `# Common Mistakes

## 1. Using CoT for Simple Tasks
\`\`\`python
# Overkill - simple tasks don't need CoT
prompt = "What is 2+2? Let's think step by step..."

# Just ask directly
prompt = "What is 2+2?"
\`\`\`

## 2. Not Extracting the Answer
\`\`\`python
# CoT gives reasoning, but you need to extract final answer
response = "Step 1... Step 2... Therefore, 42..."

# Parse out the answer
import re
answer = re.search(r'Therefore,? (.+)', response).group(1)
\`\`\`

## 3. Too High Temperature
\`\`\`python
# Bad - reasoning becomes unreliable
temperature=1.0

# Good - lower temp for reasoning
temperature=0.2
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: When to use Chain of Thought?
**Answer:** For multi-step reasoning, math problems, logic puzzles, complex analysis. Not needed for simple factual questions.

## Q2: Zero-shot vs Few-shot CoT?
**Answer:** Zero-shot: Just add "think step by step". Few-shot: Provide example reasoning chains. Few-shot is more reliable but needs good examples.

## Q3: What's self-consistency?
**Answer:** Run CoT multiple times with temperature > 0, take the majority answer. Improves reliability through diverse reasoning paths.`,

  starterCode: `from openai import OpenAI

client = OpenAI()

def solve_with_cot(problem):
    # TODO: Create a prompt that encourages step-by-step reasoning
    prompt = f\"\"\"
{problem}

# Add your CoT trigger here
\"\"\"

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2
    )
    return response.choices[0].message.content

# Test
problem = "A store has 50 items. 30% are on sale, and half of those are electronics. How many electronics are on sale?"
print(solve_with_cot(problem))`,

  solutionCode: `from openai import OpenAI

client = OpenAI()

def solve_with_cot(problem):
    prompt = f\"\"\"
{problem}

Let's solve this step by step:
1. First, identify the key numbers and relationships
2. Calculate each step carefully
3. Show all work
4. State the final answer clearly
\"\"\"

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2
    )
    return response.choices[0].message.content

# Test
problem = "A store has 50 items. 30% are on sale, and half of those are electronics. How many electronics are on sale?"
print(solve_with_cot(problem))`,

  hints: [
    "Add 'Let's think step by step' or similar",
    "Ask for numbered steps explicitly",
    "Use low temperature for consistent reasoning",
    "Request a clear final answer"
  ]
};
