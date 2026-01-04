import type { LessonContent } from '../types';

export const nodesEdges: LessonContent = {
  slug: "nodes-edges",
  problemContent: `# Nodes & Edges: Building the Graph

Learn to create complex workflows with multiple nodes and edge types.

## Node Types

\`\`\`python
# Regular function node
def my_node(state):
    return {"key": "value"}

# Async node for I/O operations
async def async_node(state):
    result = await fetch_data()
    return {"data": result}
\`\`\`

## Edge Types

1. **Normal Edge**: Always follows this path
2. **Conditional Edge**: Routes based on state

\`\`\`python
# Normal edge
graph.add_edge("node_a", "node_b")

# Conditional edge
graph.add_conditional_edges(
    "router",
    route_function,
    {"option_a": "node_a", "option_b": "node_b"}
)
\`\`\`

## Your Task

Build a support ticket router that:
1. Classifies ticket type
2. Routes to appropriate handler
3. Generates response`,

  solutionContent: `# Solution

\`\`\`python
from langgraph.graph import StateGraph, START, END
from typing import TypedDict, Literal

class State(TypedDict):
    ticket: str
    category: str
    response: str

def classify(state: State) -> dict:
    ticket = state["ticket"].lower()
    if "bill" in ticket or "payment" in ticket:
        return {"category": "billing"}
    elif "bug" in ticket or "error" in ticket:
        return {"category": "technical"}
    return {"category": "general"}

def handle_billing(state: State) -> dict:
    return {"response": "Billing team will review your payment issue."}

def handle_technical(state: State) -> dict:
    return {"response": "Technical support is investigating the bug."}

def handle_general(state: State) -> dict:
    return {"response": "Our team will respond to your inquiry."}

def route(state: State) -> Literal["billing", "technical", "general"]:
    return state["category"]

# Build graph
graph = StateGraph(State)

# Add nodes
graph.add_node("classify", classify)
graph.add_node("billing", handle_billing)
graph.add_node("technical", handle_technical)
graph.add_node("general", handle_general)

# Add edges
graph.add_edge(START, "classify")
graph.add_conditional_edges(
    "classify",
    route,
    {
        "billing": "billing",
        "technical": "technical",
        "general": "general"
    }
)
graph.add_edge("billing", END)
graph.add_edge("technical", END)
graph.add_edge("general", END)

app = graph.compile()
\`\`\``,

  explanationContent: `# Deep Dive: Nodes & Edges

## Node Best Practices

1. **Single Responsibility**: Each node does one thing
2. **Pure Functions**: Same input = same output
3. **Return Partial State**: Only update what changed

## Conditional Edges

The routing function must return a **key** that maps to a node:

\`\`\`python
def router(state) -> str:
    if state["score"] > 0.8:
        return "high_quality"
    return "needs_review"

graph.add_conditional_edges(
    "evaluate",
    router,
    {
        "high_quality": "approve",
        "needs_review": "review"
    }
)
\`\`\`

## Parallel Nodes

Send state to multiple nodes simultaneously:

\`\`\`python
# Fan-out to parallel processing
graph.add_edge("split", "process_a")
graph.add_edge("split", "process_b")
\`\`\`

## Entry Points

You can have multiple entry points:

\`\`\`python
graph.add_edge(START, "node_a")  # Default entry
graph.set_entry_point("node_b")  # Alternative entry
\`\`\``,

  realworldContent: `# Real-World Patterns

## 1. Router Pattern

\`\`\`
         ┌──► handler_a ──┐
classify─┼──► handler_b ──┼──► respond
         └──► handler_c ──┘
\`\`\`

## 2. Pipeline Pattern

\`\`\`
extract → transform → validate → load
\`\`\`

## 3. Retry Pattern

\`\`\`
              ┌───────────┐
              ▼           │
attempt ──► check ──► retry (if failed)
              │
              └──► success ──► END
\`\`\`

## 4. Approval Pattern

\`\`\`
draft ──► review ──► approve ──► publish
              │
              └──► reject ──► revise ──► review
\`\`\``,

  mistakesContent: `# Common Mistakes

## 1. Missing Route Mapping

\`\`\`python
# Wrong - router returns value not in map
def route(state):
    return "unknown"  # Not in mapping!

graph.add_conditional_edges("node", route, {"a": "a"})

# Right - cover all cases
graph.add_conditional_edges("node", route, {
    "a": "node_a",
    "b": "node_b",
    "unknown": "fallback"  # Handle unknown
})
\`\`\`

## 2. Wrong Return Type for Router

\`\`\`python
# Wrong - returning node reference
def route(state):
    return handle_billing  # Function, not string!

# Right - return mapping key
def route(state) -> str:
    return "billing"  # String key
\`\`\`

## 3. Disconnected Nodes

\`\`\`python
# Wrong - orphan node
graph.add_node("orphan", func)
# No edges to/from orphan!

# Right - always connect nodes
graph.add_edge("previous", "orphan")
graph.add_edge("orphan", END)
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: How do conditional edges work?

**Answer:** Conditional edges use a router function that:
1. Receives current state
2. Returns a string key
3. Key maps to next node name

\`\`\`python
def router(state) -> str:
    return "next_node_key"

graph.add_conditional_edges(
    "source",
    router,
    {"next_node_key": "actual_node_name"}
)
\`\`\`

## Q2: Can nodes be async?

**Answer:** Yes, LangGraph supports async nodes:

\`\`\`python
async def fetch_data(state):
    result = await api.get("/data")
    return {"data": result}

# Use ainvoke for async execution
result = await app.ainvoke(state)
\`\`\`

## Q3: How do you handle errors in nodes?

**Answer:**
1. Try/except within nodes
2. Return error state for downstream handling
3. Use conditional edge to route errors`,

  starterCode: `# Nodes & Edges Exercise
from langgraph.graph import StateGraph, START, END
from typing import TypedDict, Literal

class State(TypedDict):
    query: str
    intent: str
    response: str

# TODO: Classify intent (question, command, or chat)
def classify_intent(state: State) -> dict:
    pass

# TODO: Handle question intent
def handle_question(state: State) -> dict:
    pass

# TODO: Handle command intent
def handle_command(state: State) -> dict:
    pass

# TODO: Handle chat intent
def handle_chat(state: State) -> dict:
    pass

# TODO: Route based on intent
def route_intent(state: State) -> Literal["question", "command", "chat"]:
    pass

# Build graph
graph = StateGraph(State)

# TODO: Add nodes

# TODO: Add edges with conditional routing

app = graph.compile()

# Test
result = app.invoke({"query": "What is Python?", "intent": "", "response": ""})
print(result)`,

  solutionCode: `# Nodes & Edges Exercise
from langgraph.graph import StateGraph, START, END
from typing import TypedDict, Literal

class State(TypedDict):
    query: str
    intent: str
    response: str

# Classify intent (question, command, or chat)
def classify_intent(state: State) -> dict:
    query = state["query"].lower()
    if query.startswith(("what", "how", "why", "when", "where", "who")):
        return {"intent": "question"}
    elif query.startswith(("run", "execute", "do", "create", "delete")):
        return {"intent": "command"}
    return {"intent": "chat"}

# Handle question intent
def handle_question(state: State) -> dict:
    return {"response": f"Let me answer: {state['query']}"}

# Handle command intent
def handle_command(state: State) -> dict:
    return {"response": f"Executing: {state['query']}"}

# Handle chat intent
def handle_chat(state: State) -> dict:
    return {"response": f"Let's chat about: {state['query']}"}

# Route based on intent
def route_intent(state: State) -> Literal["question", "command", "chat"]:
    return state["intent"]

# Build graph
graph = StateGraph(State)

# Add nodes
graph.add_node("classify", classify_intent)
graph.add_node("question", handle_question)
graph.add_node("command", handle_command)
graph.add_node("chat", handle_chat)

# Add edges with conditional routing
graph.add_edge(START, "classify")
graph.add_conditional_edges(
    "classify",
    route_intent,
    {
        "question": "question",
        "command": "command",
        "chat": "chat"
    }
)
graph.add_edge("question", END)
graph.add_edge("command", END)
graph.add_edge("chat", END)

app = graph.compile()

# Test different intents
queries = [
    "What is Python?",
    "Run the tests",
    "Hello there!"
]

for query in queries:
    result = app.invoke({"query": query, "intent": "", "response": ""})
    print(f"Query: {query}")
    print(f"Intent: {result['intent']}")
    print(f"Response: {result['response']}\\n")`,

  hints: [
    "Router function returns string matching edge map keys",
    "Use Literal type hint for router return",
    "Connect all handler nodes to END",
    "add_conditional_edges needs: source, router, mapping",
  ],
};
