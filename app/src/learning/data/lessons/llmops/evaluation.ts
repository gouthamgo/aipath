import type { LessonContent } from '../types';

export const evaluation: LessonContent = {
  slug: "evaluation",
  problemContent: `# LLM Evaluation: Measuring Quality

How do you know if your LLM is doing a good job?

## The Evaluation Challenge

\`\`\`
Input: "Summarize this article"
Output: "The article discusses climate change..."

Is this good? 🤔
- Is it accurate?
- Is it complete?
- Is it relevant?
\`\`\`

## Evaluation Types

| Type | What it Measures | Example |
|------|-----------------|---------|
| Exact Match | Output = Expected | QA tasks |
| Similarity | Output ≈ Expected | Embeddings |
| LLM-as-Judge | LLM rates quality | Open-ended |
| Human Eval | Humans rate output | Gold standard |

## Key Metrics

- **Accuracy**: % correct answers
- **Relevance**: Is output useful?
- **Faithfulness**: Grounded in sources?
- **Coherence**: Well-structured?

## Your Task

Build an evaluation pipeline.`,

  solutionContent: `# Solution: Evaluation System

\`\`\`python
from openai import OpenAI
from dataclasses import dataclass
from typing import Callable

client = OpenAI()

@dataclass
class EvalResult:
    score: float
    reasoning: str

class Evaluator:
    """LLM-based evaluator."""

    def __init__(self, criteria: str):
        self.criteria = criteria

    def evaluate(self, input: str, output: str, reference: str = None) -> EvalResult:
        prompt = f"""Evaluate this output based on: {self.criteria}

Input: {input}
Output: {output}
{f'Reference: {reference}' if reference else ''}

Rate from 0-10 and explain your reasoning.
Format:
SCORE: [0-10]
REASONING: [explanation]"""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}]
        )

        content = response.choices[0].message.content
        # Parse response
        lines = content.strip().split("\\n")
        score = float(lines[0].replace("SCORE:", "").strip())
        reasoning = lines[1].replace("REASONING:", "").strip()

        return EvalResult(score=score, reasoning=reasoning)

class EvalSuite:
    """Run multiple evaluations."""

    def __init__(self):
        self.evaluators = {}

    def add_evaluator(self, name: str, evaluator: Evaluator):
        self.evaluators[name] = evaluator

    def run(self, test_cases: list[dict]) -> dict:
        results = []

        for case in test_cases:
            case_results = {"input": case["input"], "output": case["output"]}

            for name, evaluator in self.evaluators.items():
                result = evaluator.evaluate(
                    case["input"],
                    case["output"],
                    case.get("reference")
                )
                case_results[name] = {"score": result.score, "reason": result.reasoning}

            results.append(case_results)

        # Aggregate scores
        summary = {}
        for name in self.evaluators:
            scores = [r[name]["score"] for r in results]
            summary[name] = sum(scores) / len(scores)

        return {"results": results, "summary": summary}

# Usage
suite = EvalSuite()
suite.add_evaluator("relevance", Evaluator("Is the output relevant to the input?"))
suite.add_evaluator("accuracy", Evaluator("Is the output factually accurate?"))

test_cases = [
    {
        "input": "What is the capital of France?",
        "output": "The capital of France is Paris.",
        "reference": "Paris"
    },
    {
        "input": "Explain machine learning briefly",
        "output": "ML is a subset of AI where computers learn from data.",
        "reference": None
    }
]

report = suite.run(test_cases)
print(f"Summary: {report['summary']}")
\`\`\``,

  explanationContent: `# Evaluation Deep Dive

## Evaluation Strategies

### 1. Exact Match
\`\`\`python
def exact_match(output, expected):
    return output.strip() == expected.strip()
\`\`\`

### 2. Contains
\`\`\`python
def contains(output, expected):
    return expected.lower() in output.lower()
\`\`\`

### 3. Semantic Similarity
\`\`\`python
def semantic_similarity(output, expected):
    emb1 = embed(output)
    emb2 = embed(expected)
    return cosine_similarity(emb1, emb2)
\`\`\`

### 4. LLM-as-Judge
\`\`\`python
def llm_judge(output, criteria):
    prompt = f"Rate this output: {output}\\nCriteria: {criteria}"
    return llm.evaluate(prompt)
\`\`\`

## Evaluation Criteria

| Criterion | Description |
|-----------|-------------|
| Relevance | Addresses the question |
| Accuracy | Factually correct |
| Completeness | Covers all aspects |
| Coherence | Well-organized |
| Conciseness | Not too verbose |

## Building a Test Set

1. Collect real user queries
2. Generate synthetic examples
3. Include edge cases
4. Get human labels`,

  realworldContent: `# Real-World Evaluation

## RAG Evaluation (RAGAS)

\`\`\`python
# Key RAG metrics
metrics = {
    "faithfulness": "Is answer grounded in context?",
    "relevance": "Is answer relevant to question?",
    "context_precision": "Is retrieved context useful?",
    "context_recall": "Did we retrieve all needed info?"
}
\`\`\`

## A/B Testing

\`\`\`python
def ab_test(prompt, model_a, model_b, n=100):
    results = {"a": 0, "b": 0, "tie": 0}

    for _ in range(n):
        resp_a = model_a.generate(prompt)
        resp_b = model_b.generate(prompt)

        winner = judge.compare(resp_a, resp_b)
        results[winner] += 1

    return results
\`\`\``,

  mistakesContent: `# Common Evaluation Mistakes

## 1. No Ground Truth

\`\`\`python
# Wrong - no reference
def evaluate(output):
    return len(output) > 0  # Meaningless!

# Right - compare to reference
def evaluate(output, expected):
    return similarity(output, expected)
\`\`\`

## 2. Single Metric

\`\`\`python
# Wrong - only accuracy
score = accuracy_score(outputs, expected)

# Right - multiple metrics
scores = {
    "accuracy": accuracy_score(...),
    "relevance": relevance_score(...),
    "fluency": fluency_score(...)
}
\`\`\`

## 3. Too Small Test Set

\`\`\`python
# Wrong - 5 examples
test_set = [ex1, ex2, ex3, ex4, ex5]

# Right - statistically significant
test_set = load_test_set(n=100)  # Or more
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: How do you evaluate LLM outputs?

**Answer:**
1. **Automated metrics**: BLEU, ROUGE for text similarity
2. **LLM-as-Judge**: Use another LLM to evaluate
3. **Human evaluation**: Gold standard for quality
4. **Task-specific**: Accuracy for QA, faithfulness for RAG

## Q2: What's LLM-as-Judge?

**Answer:** Using an LLM to evaluate another LLM's output:
\`\`\`python
judge_prompt = "Rate this response 1-10: {output}"
score = judge_llm.evaluate(judge_prompt)
\`\`\`

Pros: Scalable, consistent
Cons: May have biases, not perfect

## Q3: How do you evaluate RAG systems?

**Answer:**
- **Faithfulness**: Is answer grounded in retrieved docs?
- **Relevance**: Does answer address the question?
- **Context quality**: Did retrieval find the right docs?`,

  starterCode: `from openai import OpenAI

client = OpenAI()

# TODO: Create an LLM-based evaluator
def evaluate_output(input: str, output: str, criteria: str) -> dict:
    """
    Use an LLM to evaluate the output.
    Returns: {"score": 0-10, "reasoning": "..."}
    """
    pass

# TODO: Run evaluation on test cases
def run_evaluation(test_cases: list) -> dict:
    """
    Evaluate all test cases and return summary.
    """
    pass

# Test cases
test_cases = [
    {
        "input": "What is 2+2?",
        "output": "4",
        "criteria": "accuracy"
    },
    {
        "input": "Explain gravity",
        "output": "Gravity is a force that pulls objects toward each other.",
        "criteria": "clarity"
    }
]

results = run_evaluation(test_cases)
print(results)`,

  solutionCode: `from openai import OpenAI

client = OpenAI()

def evaluate_output(input: str, output: str, criteria: str) -> dict:
    """Use an LLM to evaluate the output."""
    prompt = f"""Evaluate this output.

Input: {input}
Output: {output}
Criteria: {criteria}

Provide a score from 0-10 and brief reasoning.
Format your response as:
SCORE: [number]
REASONING: [explanation]"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    content = response.choices[0].message.content

    # Parse response
    lines = content.strip().split("\\n")
    score = 0
    reasoning = ""

    for line in lines:
        if line.startswith("SCORE:"):
            score = float(line.replace("SCORE:", "").strip())
        if line.startswith("REASONING:"):
            reasoning = line.replace("REASONING:", "").strip()

    return {"score": score, "reasoning": reasoning}

def run_evaluation(test_cases: list) -> dict:
    """Evaluate all test cases and return summary."""
    results = []
    total_score = 0

    for case in test_cases:
        result = evaluate_output(
            case["input"],
            case["output"],
            case["criteria"]
        )
        results.append({
            "input": case["input"][:50],
            "score": result["score"],
            "reasoning": result["reasoning"]
        })
        total_score += result["score"]

    return {
        "results": results,
        "average_score": total_score / len(test_cases),
        "total_cases": len(test_cases)
    }

# Test cases
test_cases = [
    {
        "input": "What is 2+2?",
        "output": "4",
        "criteria": "accuracy"
    },
    {
        "input": "Explain gravity",
        "output": "Gravity is a force that pulls objects toward each other.",
        "criteria": "clarity"
    }
]

print("Running evaluation...\\n")
results = run_evaluation(test_cases)

print(f"Average Score: {results['average_score']:.1f}/10")
print(f"\\nDetails:")
for r in results["results"]:
    print(f"  • {r['input']}: {r['score']}/10 - {r['reasoning']}")`,

  hints: [
    "Use a clear prompt format asking for SCORE and REASONING",
    "Parse the LLM response to extract score and reasoning",
    "Calculate average score across all test cases",
    "Handle cases where parsing might fail",
  ],
};
