import type { LessonContent } from '../types';

export const langgraphIntro: LessonContent = {
  slug: "langgraph-intro",
  problemContent: `# LangGraph: Graph-Based AI Agents

LangGraph is a library for building **stateful, multi-step AI workflows** as graphs.

## Why LangGraph?

Think of it like a **flowchart for AI** - each step is a node, and edges connect them.

\`\`\`
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Start   │────►│  Think   │────►│   Act    │
└──────────┘     └──────────┘     └────┬─────┘
                                       │
                      ┌────────────────┘
                      ▼
               ┌──────────┐
               │   End    │
               └──────────┘
\`\`\`

## Key Concepts

1. **State**: Shared data that flows through the graph
2. **Nodes**: Functions that process and update state
3. **Edges**: Connections that route between nodes

## LangGraph vs LangChain

| LangChain | LangGraph |
|-----------|-----------|
| Linear chains | Graph with cycles |
| Simple flows | Complex workflows |
| Limited state | Rich state management |
| No loops | Supports loops |

## Your Task

1. Install LangGraph
2. Create a simple graph with 2 nodes
3. Run it and observe state flow`,

  solutionContent: `# Solution

\`\`\`python
from langgraph.graph import StateGraph, START, END
from typing import TypedDict

# 1. Define State
class State(TypedDict):
    message: str
    processed: bool

# 2. Define Nodes
def greet(state: State) -> dict:
    return {"message": f"Hello, {state['message']}!"}

def process(state: State) -> dict:
    return {"processed": True}

# 3. Build Graph
graph = StateGraph(State)
graph.add_node("greet", greet)
graph.add_node("process", process)

# 4. Add Edges
graph.add_edge(START, "greet")
graph.add_edge("greet", "process")
graph.add_edge("process", END)

# 5. Compile and Run
app = graph.compile()
result = app.invoke({"message": "World", "processed": False})
print(result)  # {'message': 'Hello, World!', 'processed': True}
\`\`\``,

  explanationContent: `# How LangGraph Works

## The Graph Model

LangGraph uses a **directed graph** where:
- **Nodes** = Functions that transform state
- **Edges** = Routes between nodes
- **State** = Data container passed through graph

## Execution Flow

1. Start with initial state
2. Execute node connected to START
3. Follow edges to next node
4. Continue until reaching END
5. Return final state

## State Updates

Nodes return **partial updates** that merge into state:

\`\`\`python
# State: {"count": 0, "name": "Alice"}
def increment(state):
    return {"count": state["count"] + 1}
# Result: {"count": 1, "name": "Alice"}
\`\`\`

Only returned keys are updated - others preserved.

## Why Graphs?

1. **Visual**: Easy to understand workflow
2. **Modular**: Each node is independent
3. **Flexible**: Add loops, branches, conditions
4. **Debuggable**: Inspect state at each step`,

  realworldContent: `# Real-World Applications

## 1. Customer Support Bot

\`\`\`
classify_intent → route → handle_billing
                       → handle_technical
                       → handle_general
\`\`\`

## 2. Document Processing

\`\`\`
extract_text → analyze → summarize → store
\`\`\`

## 3. Code Review Agent

\`\`\`
parse_code → find_issues → suggest_fixes → format_response
\`\`\`

## 4. Research Assistant

\`\`\`
understand_query → search → evaluate → synthesize → respond
\`\`\``,

  mistakesContent: `# Common Mistakes

## 1. Forgetting to Connect to END

\`\`\`python
# Wrong - graph never ends
graph.add_edge("process", "another_node")

# Right - always have path to END
graph.add_edge("final_node", END)
\`\`\`

## 2. Not Using TypedDict for State

\`\`\`python
# Wrong - plain dict
def node(state):
    return {"key": "value"}

# Right - TypedDict for type safety
class State(TypedDict):
    key: str

def node(state: State) -> dict:
    return {"key": "value"}
\`\`\`

## 3. Returning Full State Instead of Updates

\`\`\`python
# Wrong - overwrites entire state
def node(state):
    return {"message": "Hi", "count": 0, "name": "..."}

# Right - return only changes
def node(state):
    return {"message": "Hi"}
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: What is LangGraph?

**Answer:** LangGraph is a library for building stateful, multi-step AI applications using a graph-based architecture. It's built on top of LangChain and provides:
- State management across steps
- Cyclic graph support (loops)
- Conditional routing
- Checkpointing for persistence

## Q2: How does LangGraph differ from LangChain chains?

**Answer:**
- **Chains**: Linear, no cycles, limited state
- **LangGraph**: Graph-based, supports cycles, rich state management

LangGraph is better for complex agents that need to loop, branch, or maintain state.

## Q3: What's the execution model?

**Answer:** LangGraph uses a message-passing model:
1. State flows through nodes
2. Each node receives current state
3. Node returns partial update
4. Updates merge into state
5. Continues until END`,

  starterCode: `# LangGraph Introduction
from langgraph.graph import StateGraph, START, END
from typing import TypedDict

# TODO: Define State with 'message' (str) and 'count' (int)
class State(TypedDict):
    pass

# TODO: Define a node that adds greeting
def greet(state: State) -> dict:
    pass

# TODO: Define a node that increments count
def increment(state: State) -> dict:
    pass

# TODO: Build the graph
graph = StateGraph(State)

# Add nodes

# Add edges (START -> greet -> increment -> END)

# Compile and run
app = graph.compile()
result = app.invoke({"message": "World", "count": 0})
print(result)`,

  solutionCode: `# LangGraph Introduction
from langgraph.graph import StateGraph, START, END
from typing import TypedDict

# Define State with 'message' (str) and 'count' (int)
class State(TypedDict):
    message: str
    count: int

# Define a node that adds greeting
def greet(state: State) -> dict:
    name = state["message"]
    return {"message": f"Hello, {name}!"}

# Define a node that increments count
def increment(state: State) -> dict:
    return {"count": state["count"] + 1}

# Build the graph
graph = StateGraph(State)

# Add nodes
graph.add_node("greet", greet)
graph.add_node("increment", increment)

# Add edges (START -> greet -> increment -> END)
graph.add_edge(START, "greet")
graph.add_edge("greet", "increment")
graph.add_edge("increment", END)

# Compile and run
app = graph.compile()
result = app.invoke({"message": "World", "count": 0})
print(f"Result: {result}")
print(f"Message: {result['message']}")
print(f"Count: {result['count']}")`,

  hints: [
    "State fields go in TypedDict class",
    "Nodes return dict with only changed keys",
    "Use add_node() then add_edge()",
    "START and END are special constants",
  ],
};
