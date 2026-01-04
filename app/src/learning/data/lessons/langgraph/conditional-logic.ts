import type { LessonContent } from '../types';

export const conditionalLogic: LessonContent = {
  slug: "conditional-logic",
  problemContent: `# Conditional Logic: Branching & Loops

Build dynamic workflows with conditions and cycles.

## Conditional Edges (Review)

\`\`\`python
def should_continue(state) -> Literal["continue", "end"]:
    if state["attempts"] < 3:
        return "continue"
    return "end"

graph.add_conditional_edges(
    "check",
    should_continue,
    {"continue": "retry", "end": END}
)
\`\`\`

## Cycles (Loops)

LangGraph supports cycles - nodes can loop back:

\`\`\`
        ┌─────────────┐
        ▼             │
    ┌───────┐    ┌────┴────┐
───►│ work  │───►│ check   │───► END
    └───────┘    └─────────┘
\`\`\`

## Your Task

Build an agent that:
1. Attempts a task
2. Checks if successful
3. Retries up to 3 times if failed
4. Reports final result`,

  solutionContent: `# Solution

\`\`\`python
from langgraph.graph import StateGraph, START, END
from typing import TypedDict, Literal, Annotated
from operator import add
import random

class State(TypedDict):
    task: str
    attempts: int
    success: bool
    logs: Annotated[list[str], add]

def attempt_task(state: State) -> dict:
    attempt_num = state["attempts"] + 1
    # Simulate 50% success rate
    success = random.random() > 0.5

    return {
        "attempts": attempt_num,
        "success": success,
        "logs": [f"Attempt {attempt_num}: {'Success!' if success else 'Failed'}"]
    }

def should_retry(state: State) -> Literal["retry", "done"]:
    if state["success"]:
        return "done"
    if state["attempts"] >= 3:
        return "done"  # Max retries reached
    return "retry"

def finalize(state: State) -> dict:
    status = "completed successfully" if state["success"] else "failed after max retries"
    return {
        "logs": [f"Task {status} after {state['attempts']} attempts"]
    }

graph = StateGraph(State)

graph.add_node("attempt", attempt_task)
graph.add_node("finalize", finalize)

graph.add_edge(START, "attempt")
graph.add_conditional_edges(
    "attempt",
    should_retry,
    {"retry": "attempt", "done": "finalize"}  # Loop back!
)
graph.add_edge("finalize", END)

app = graph.compile()

result = app.invoke({
    "task": "process_data",
    "attempts": 0,
    "success": False,
    "logs": []
})

for log in result["logs"]:
    print(log)
\`\`\``,

  explanationContent: `# Conditional Logic Deep Dive

## Types of Conditions

### 1. Binary Branch (if/else)

\`\`\`python
def route(state) -> Literal["yes", "no"]:
    return "yes" if state["condition"] else "no"
\`\`\`

### 2. Multi-way Branch (switch)

\`\`\`python
def route(state) -> Literal["a", "b", "c", "default"]:
    match state["type"]:
        case "type_a": return "a"
        case "type_b": return "b"
        case "type_c": return "c"
        case _: return "default"
\`\`\`

### 3. Cycles with Exit Condition

\`\`\`python
def should_loop(state) -> Literal["loop", "exit"]:
    if state["iterations"] >= state["max_iterations"]:
        return "exit"
    if state["goal_reached"]:
        return "exit"
    return "loop"
\`\`\`

## Preventing Infinite Loops

Always have an exit condition:

\`\`\`python
class State(TypedDict):
    iterations: int
    max_iterations: int  # Safety limit

def check_loop(state) -> Literal["continue", "stop"]:
    if state["iterations"] >= state["max_iterations"]:
        return "stop"  # Guaranteed exit
    return "continue"
\`\`\``,

  realworldContent: `# Real-World Conditional Patterns

## 1. Retry with Backoff

\`\`\`python
def should_retry(state):
    if state["success"]:
        return "done"
    if state["attempts"] >= 3:
        return "fail"
    return "wait_and_retry"
\`\`\`

## 2. Approval Workflow

\`\`\`python
def check_approval(state):
    if state["approved"]:
        return "publish"
    if state["rejected"]:
        return "revise"
    return "wait"  # Human in the loop
\`\`\`

## 3. Quality Gate

\`\`\`python
def quality_check(state):
    if state["score"] >= 0.9:
        return "excellent"
    if state["score"] >= 0.7:
        return "acceptable"
    return "needs_improvement"
\`\`\`

## 4. Agent Tool Loop

\`\`\`python
def agent_loop(state):
    if state["has_final_answer"]:
        return "respond"
    if state["needs_tool"]:
        return "call_tool"
    return "think"
\`\`\``,

  mistakesContent: `# Common Mistakes

## 1. Infinite Loop

\`\`\`python
# Wrong - no exit condition!
def always_retry(state):
    return "retry"  # Never ends!

# Right - always have exit condition
def smart_retry(state):
    if state["attempts"] >= 3:
        return "stop"
    return "retry"
\`\`\`

## 2. Unreachable Branches

\`\`\`python
# Wrong - condition always false
def route(state):
    if state["count"] > 100 and state["count"] < 0:
        return "impossible"  # Never reached!
    return "default"

# Right - valid conditions
def route(state):
    if state["count"] > 100:
        return "high"
    return "normal"
\`\`\`

## 3. Missing Return Path

\`\`\`python
# Wrong - missing return in some cases
def route(state):
    if state["type"] == "a":
        return "node_a"
    # What if type is not "a"? No return!

# Right - always return
def route(state):
    if state["type"] == "a":
        return "node_a"
    return "default"  # Fallback
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: How do you implement loops in LangGraph?

**Answer:** Use conditional edges that route back to a previous node:

\`\`\`python
graph.add_conditional_edges(
    "check",
    lambda s: "loop" if s["continue"] else "exit",
    {
        "loop": "work",   # Back to work node
        "exit": END
    }
)
\`\`\`

Always include exit conditions to prevent infinite loops.

## Q2: How do you handle human-in-the-loop?

**Answer:** LangGraph supports interrupts:

\`\`\`python
# Interrupt before a node
graph.add_node("human_review", review_func)
app = graph.compile(interrupt_before=["human_review"])

# Execution pauses, human provides input
# Resume with updated state
\`\`\`

## Q3: Can conditional edges go to END?

**Answer:** Yes! END is a valid target:

\`\`\`python
graph.add_conditional_edges(
    "check",
    router,
    {
        "continue": "next_node",
        "done": END  # Direct to END
    }
)
\`\`\``,

  starterCode: `# Conditional Logic Exercise
from langgraph.graph import StateGraph, START, END
from typing import TypedDict, Literal, Annotated
from operator import add
import random

class State(TypedDict):
    query: str
    answer: str
    confidence: float
    attempts: int
    history: Annotated[list[str], add]

# TODO: Generate answer with random confidence
def generate_answer(state: State) -> dict:
    pass

# TODO: Route based on confidence (>0.8 = accept, <=0.8 and <3 attempts = retry, else = fallback)
def evaluate_answer(state: State) -> Literal["accept", "retry", "fallback"]:
    pass

# TODO: Accept the answer
def accept_answer(state: State) -> dict:
    pass

# TODO: Fallback response
def fallback(state: State) -> dict:
    pass

# Build graph with conditional logic
graph = StateGraph(State)

# Add nodes

# Add conditional edges

app = graph.compile()

result = app.invoke({
    "query": "What is AI?",
    "answer": "",
    "confidence": 0.0,
    "attempts": 0,
    "history": []
})

print("History:")
for h in result["history"]:
    print(f"  {h}")
print(f"\\nFinal: {result['answer']}")`,

  solutionCode: `# Conditional Logic Exercise
from langgraph.graph import StateGraph, START, END
from typing import TypedDict, Literal, Annotated
from operator import add
import random

class State(TypedDict):
    query: str
    answer: str
    confidence: float
    attempts: int
    history: Annotated[list[str], add]

# Generate answer with random confidence
def generate_answer(state: State) -> dict:
    confidence = random.random()
    attempt = state["attempts"] + 1
    answer = f"Answer attempt {attempt}: AI is artificial intelligence."

    return {
        "answer": answer,
        "confidence": confidence,
        "attempts": attempt,
        "history": [f"Attempt {attempt}: confidence={confidence:.2f}"]
    }

# Route based on confidence
def evaluate_answer(state: State) -> Literal["accept", "retry", "fallback"]:
    if state["confidence"] > 0.8:
        return "accept"
    if state["attempts"] < 3:
        return "retry"
    return "fallback"

# Accept the answer
def accept_answer(state: State) -> dict:
    return {
        "history": [f"Accepted with confidence {state['confidence']:.2f}"]
    }

# Fallback response
def fallback(state: State) -> dict:
    return {
        "answer": "I'm not confident, but here's what I know about AI...",
        "history": ["Fell back to safe response after max attempts"]
    }

# Build graph
graph = StateGraph(State)

# Add nodes
graph.add_node("generate", generate_answer)
graph.add_node("accept", accept_answer)
graph.add_node("fallback", fallback)

# Add edges
graph.add_edge(START, "generate")
graph.add_conditional_edges(
    "generate",
    evaluate_answer,
    {
        "accept": "accept",
        "retry": "generate",  # Loop back
        "fallback": "fallback"
    }
)
graph.add_edge("accept", END)
graph.add_edge("fallback", END)

app = graph.compile()

# Run
result = app.invoke({
    "query": "What is AI?",
    "answer": "",
    "confidence": 0.0,
    "attempts": 0,
    "history": []
})

print("History:")
for h in result["history"]:
    print(f"  {h}")
print(f"\\nFinal Answer: {result['answer']}")
print(f"Attempts: {result['attempts']}")`,

  hints: [
    "Router returns one of the Literal options",
    "Use 'retry': 'generate' to loop back",
    "Check attempts < 3 for retry condition",
    "Always have a fallback path",
  ],
};
