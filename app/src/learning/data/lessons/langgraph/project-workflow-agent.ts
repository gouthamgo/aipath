import type { LessonContent } from '../types';

export const projectWorkflowAgent: LessonContent = {
  slug: "project-workflow-agent",
  problemContent: `# Project: Build a Complete Workflow Agent

Apply everything you've learned to build a **Research Assistant Agent**.

## Requirements

Build an agent that:
1. Takes a research question
2. Plans research steps
3. Executes search (simulated)
4. Evaluates results
5. Retries if quality is low
6. Synthesizes final answer

## Architecture

\`\`\`
          ┌──────────────────────────────────────────┐
          │                                          │
          ▼                                          │
┌────────────┐    ┌────────────┐    ┌────────────┐   │
│   plan     │───►│  search    │───►│  evaluate  │───┤
└────────────┘    └────────────┘    └────────────┘   │
                                          │          │
                                          ▼          │
                                    ┌────────────┐   │
                                    │ synthesize │   │
                                    └────────────┘   │
                                          │          │
                                          ▼          │
                                       [END]         │
                                                     │
                        (retry if quality < 0.7) ────┘
\`\`\`

## Your Task

Implement all nodes and edges to create a working research agent.`,

  solutionContent: `# Solution Overview

\`\`\`python
from langgraph.graph import StateGraph, START, END
from typing import TypedDict, Literal, Annotated
from operator import add
import random

class ResearchState(TypedDict):
    question: str
    plan: list[str]
    search_results: Annotated[list[str], add]
    quality_score: float
    attempts: int
    final_answer: str
    logs: Annotated[list[str], add]

def plan_research(state):
    question = state["question"]
    steps = [
        f"1. Understand key terms in: {question}",
        "2. Search for relevant sources",
        "3. Extract key information",
        "4. Synthesize findings"
    ]
    return {
        "plan": steps,
        "logs": [f"Created {len(steps)}-step research plan"]
    }

def search(state):
    # Simulated search
    results = [
        f"Source 1: Information about {state['question'][:20]}...",
        f"Source 2: Related concepts and definitions",
        f"Source 3: Expert analysis on the topic"
    ]
    return {
        "search_results": results,
        "attempts": state["attempts"] + 1,
        "logs": [f"Search attempt {state['attempts'] + 1}: Found {len(results)} sources"]
    }

def evaluate(state):
    # Simulate quality evaluation (improves with attempts)
    base_score = 0.5
    attempt_bonus = state["attempts"] * 0.15
    score = min(base_score + attempt_bonus, 1.0)
    return {
        "quality_score": score,
        "logs": [f"Quality score: {score:.2f}"]
    }

def should_continue(state) -> Literal["retry", "synthesize"]:
    if state["quality_score"] >= 0.7:
        return "synthesize"
    if state["attempts"] >= 3:
        return "synthesize"  # Give up after 3 attempts
    return "retry"

def synthesize(state):
    sources = len(state["search_results"])
    answer = f"Based on {sources} sources over {state['attempts']} searches: "
    answer += f"Here's what we found about '{state['question']}'..."
    return {
        "final_answer": answer,
        "logs": ["Synthesized final answer"]
    }

# Build graph
graph = StateGraph(ResearchState)

graph.add_node("plan", plan_research)
graph.add_node("search", search)
graph.add_node("evaluate", evaluate)
graph.add_node("synthesize", synthesize)

graph.add_edge(START, "plan")
graph.add_edge("plan", "search")
graph.add_edge("search", "evaluate")
graph.add_conditional_edges(
    "evaluate",
    should_continue,
    {"retry": "search", "synthesize": "synthesize"}
)
graph.add_edge("synthesize", END)

app = graph.compile()
\`\`\``,

  explanationContent: `# Project Architecture

## State Design

The state captures everything the agent needs:

\`\`\`python
class ResearchState(TypedDict):
    question: str          # User's research question
    plan: list[str]        # Steps to execute
    search_results: ...    # Accumulated findings
    quality_score: float   # How good are results?
    attempts: int          # Retry counter
    final_answer: str      # Synthesized response
    logs: ...              # Execution trace
\`\`\`

## Node Responsibilities

1. **plan**: Creates research strategy
2. **search**: Gathers information
3. **evaluate**: Assesses quality
4. **synthesize**: Creates final answer

## Control Flow

The key insight is the **retry loop**:
- If quality < 0.7 AND attempts < 3: retry search
- Otherwise: synthesize what we have

This pattern is common in AI agents that need to iterate until quality thresholds are met.`,

  realworldContent: `# Real-World Extensions

## 1. Add Actual LLM Calls

\`\`\`python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI()

def plan_research(state):
    response = llm.invoke(
        f"Create a research plan for: {state['question']}"
    )
    return {"plan": response.content.split("\\n")}
\`\`\`

## 2. Add Web Search

\`\`\`python
from langchain_community.tools import DuckDuckGoSearchRun

search_tool = DuckDuckGoSearchRun()

def search_web(state):
    results = search_tool.run(state["question"])
    return {"search_results": [results]}
\`\`\`

## 3. Add Human Review

\`\`\`python
app = graph.compile(
    interrupt_before=["synthesize"]
)

# Execution pauses for human review
# Human can modify state before synthesis
\`\`\``,

  mistakesContent: `# Common Project Mistakes

## 1. Not Handling Edge Cases

\`\`\`python
# Wrong - assumes search always returns results
def synthesize(state):
    return {"answer": state["search_results"][0]}  # Might be empty!

# Right - handle empty results
def synthesize(state):
    if not state["search_results"]:
        return {"answer": "No results found."}
    return {"answer": state["search_results"][0]}
\`\`\`

## 2. Unbounded Retries

\`\`\`python
# Wrong - could loop forever
def should_continue(state):
    if state["quality"] < 0.7:
        return "retry"  # What if never reaches 0.7?
    return "done"

# Right - cap retries
def should_continue(state):
    if state["quality"] >= 0.7:
        return "done"
    if state["attempts"] >= 3:
        return "done"  # Safety limit
    return "retry"
\`\`\``,

  interviewContent: `# Project Interview Questions

## Q1: Walk me through your agent architecture.

**Answer:**
1. **State** holds question, plan, results, quality score, attempts
2. **Plan node** creates research strategy
3. **Search node** gathers information
4. **Evaluate node** scores result quality
5. **Conditional edge** routes to retry or synthesize
6. **Synthesize node** creates final answer

Key insight: The retry loop with quality threshold ensures we iterate until results meet our standard.

## Q2: How do you handle failures?

**Answer:**
- Attempt counter prevents infinite loops
- Quality score determines if retry needed
- Fallback to best available after max attempts
- Logs track execution for debugging

## Q3: How would you add a human approval step?

**Answer:**
\`\`\`python
# 1. Add approval node
def await_approval(state):
    return {"awaiting_approval": True}

# 2. Compile with interrupt
app = graph.compile(
    interrupt_before=["publish"]
)

# 3. Resume after human input
app.invoke(state, config)  # Pauses
# Human reviews...
app.invoke(None, config)  # Resumes
\`\`\``,

  starterCode: `# Project: Research Assistant Agent
from langgraph.graph import StateGraph, START, END
from typing import TypedDict, Literal, Annotated
from operator import add
import random

# TODO: Define ResearchState
class ResearchState(TypedDict):
    question: str
    # Add: plan, search_results, quality_score, attempts, final_answer, logs
    pass

# TODO: Plan research steps
def plan_research(state: ResearchState) -> dict:
    pass

# TODO: Execute search (simulate with random results)
def search(state: ResearchState) -> dict:
    pass

# TODO: Evaluate quality (simulate with random score, improves with attempts)
def evaluate(state: ResearchState) -> dict:
    pass

# TODO: Decide whether to retry or synthesize
def should_continue(state: ResearchState) -> Literal["retry", "synthesize"]:
    pass

# TODO: Synthesize final answer
def synthesize(state: ResearchState) -> dict:
    pass

# Build the graph
graph = StateGraph(ResearchState)

# TODO: Add nodes

# TODO: Add edges (including conditional)

# Compile
app = graph.compile()

# Test
result = app.invoke({
    "question": "What is machine learning?",
    "plan": [],
    "search_results": [],
    "quality_score": 0.0,
    "attempts": 0,
    "final_answer": "",
    "logs": []
})

print("=== Research Agent Results ===")
print(f"Question: {result['question']}")
print(f"Attempts: {result['attempts']}")
print(f"Answer: {result['final_answer']}")`,

  solutionCode: `# Project: Research Assistant Agent
from langgraph.graph import StateGraph, START, END
from typing import TypedDict, Literal, Annotated
from operator import add
import random

# Define ResearchState
class ResearchState(TypedDict):
    question: str
    plan: list[str]
    search_results: Annotated[list[str], add]
    quality_score: float
    attempts: int
    final_answer: str
    logs: Annotated[list[str], add]

# Plan research steps
def plan_research(state: ResearchState) -> dict:
    question = state["question"]
    plan = [
        f"1. Analyze the question: '{question}'",
        "2. Identify key concepts",
        "3. Search for sources",
        "4. Extract information",
        "5. Synthesize answer"
    ]
    return {
        "plan": plan,
        "logs": [f"Created {len(plan)}-step plan"]
    }

# Execute search (simulated)
def search(state: ResearchState) -> dict:
    attempt = state["attempts"] + 1
    sources = [
        f"[Source {attempt}.1] Overview of {state['question'][:20]}...",
        f"[Source {attempt}.2] Key concepts explained",
        f"[Source {attempt}.3] Expert analysis",
    ]
    return {
        "search_results": sources,
        "attempts": attempt,
        "logs": [f"Search {attempt}: Found {len(sources)} sources"]
    }

# Evaluate quality
def evaluate(state: ResearchState) -> dict:
    base = 0.4
    bonus = state["attempts"] * 0.2
    quality = min(base + bonus + random.uniform(-0.1, 0.1), 1.0)
    return {
        "quality_score": quality,
        "logs": [f"Quality: {quality:.2f}"]
    }

# Route decision
def should_continue(state: ResearchState) -> Literal["retry", "synthesize"]:
    if state["quality_score"] >= 0.7:
        return "synthesize"
    if state["attempts"] >= 3:
        return "synthesize"
    return "retry"

# Synthesize answer
def synthesize(state: ResearchState) -> dict:
    sources = len(state["search_results"])
    answer = f"Based on {sources} sources: Machine learning is a subset of AI..."
    return {
        "final_answer": answer,
        "logs": ["Synthesized final answer"]
    }

# Build graph
graph = StateGraph(ResearchState)

graph.add_node("plan", plan_research)
graph.add_node("search", search)
graph.add_node("evaluate", evaluate)
graph.add_node("synthesize", synthesize)

graph.add_edge(START, "plan")
graph.add_edge("plan", "search")
graph.add_edge("search", "evaluate")
graph.add_conditional_edges(
    "evaluate",
    should_continue,
    {"retry": "search", "synthesize": "synthesize"}
)
graph.add_edge("synthesize", END)

app = graph.compile()

# Test
result = app.invoke({
    "question": "What is machine learning?",
    "plan": [],
    "search_results": [],
    "quality_score": 0.0,
    "attempts": 0,
    "final_answer": "",
    "logs": []
})

print("=== Research Agent ===")
print(f"Question: {result['question']}")
print(f"Attempts: {result['attempts']}")
print(f"Quality: {result['quality_score']:.2f}")
print(f"\\nLogs:")
for log in result["logs"]:
    print(f"  - {log}")
print(f"\\nAnswer: {result['final_answer']}")`,

  hints: [
    "State needs Annotated[list, add] for accumulating fields",
    "Router returns 'retry' or 'synthesize' string",
    "Connect evaluate to search for retry loop",
    "Always check attempts < 3 before retrying",
  ],
};
