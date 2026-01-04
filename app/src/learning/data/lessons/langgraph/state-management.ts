import type { LessonContent } from '../types';

export const stateManagement: LessonContent = {
  slug: "state-management",
  problemContent: `# State Management: The Heart of LangGraph

State is how data flows through your graph. Master it!

## State Definition

\`\`\`python
from typing import TypedDict, Annotated
from operator import add

class State(TypedDict):
    messages: Annotated[list, add]  # Append to list
    count: int                       # Overwrite
\`\`\`

## Reducer Functions

Control how state updates merge:

\`\`\`python
# Annotated[type, reducer]
messages: Annotated[list, add]  # Appends new items
\`\`\`

## State Channels

Different ways to update state:
1. **LastValue** (default): Overwrites with new value
2. **Append**: Adds to list
3. **Custom**: Your own reducer

## Your Task

Build a conversation agent that:
1. Accumulates message history
2. Tracks turn count
3. Maintains context`,

  solutionContent: `# Solution

\`\`\`python
from langgraph.graph import StateGraph, START, END
from typing import TypedDict, Annotated
from operator import add

class State(TypedDict):
    messages: Annotated[list[str], add]  # Accumulates
    turn_count: int
    context: dict

def add_user_message(state: State) -> dict:
    return {
        "messages": [f"User: {state.get('input', 'Hello')}"],
        "turn_count": state["turn_count"] + 1
    }

def generate_response(state: State) -> dict:
    # Simulate LLM response based on context
    history = "\\n".join(state["messages"])
    response = f"Based on {len(state['messages'])} messages, here's my response."
    return {
        "messages": [f"Assistant: {response}"],
        "context": {"last_topic": "general"}
    }

graph = StateGraph(State)
graph.add_node("user", add_user_message)
graph.add_node("assistant", generate_response)

graph.add_edge(START, "user")
graph.add_edge("user", "assistant")
graph.add_edge("assistant", END)

app = graph.compile()

# Run multiple turns
state = {"messages": [], "turn_count": 0, "context": {}}
result = app.invoke({**state, "input": "Hi there!"})
print(result["messages"])  # ['User: Hi there!', 'Assistant: ...']
\`\`\``,

  explanationContent: `# State Management Deep Dive

## How Reducers Work

\`\`\`python
from typing import Annotated
from operator import add

class State(TypedDict):
    # add reducer: appends new items to list
    messages: Annotated[list, add]

    # No reducer: overwrites (LastValue)
    current_step: str
\`\`\`

## Custom Reducers

Create your own merge logic:

\`\`\`python
def merge_dicts(left: dict, right: dict) -> dict:
    return {**left, **right}

class State(TypedDict):
    context: Annotated[dict, merge_dicts]
\`\`\`

## State Persistence

LangGraph can checkpoint state:

\`\`\`python
from langgraph.checkpoint.memory import MemorySaver

checkpointer = MemorySaver()
app = graph.compile(checkpointer=checkpointer)

# Resume from checkpoint
config = {"configurable": {"thread_id": "user-123"}}
result = app.invoke(state, config)
\`\`\`

## State Schemas

Use Pydantic for validation:

\`\`\`python
from pydantic import BaseModel

class ConversationState(BaseModel):
    messages: list[str] = []
    user_id: str
    active: bool = True
\`\`\``,

  realworldContent: `# Real-World State Patterns

## 1. Conversation Memory

\`\`\`python
class ChatState(TypedDict):
    messages: Annotated[list, add]
    user_profile: dict
    session_id: str
\`\`\`

## 2. Multi-Step Processing

\`\`\`python
class ProcessingState(TypedDict):
    raw_data: str
    extracted: dict
    validated: bool
    errors: Annotated[list, add]
\`\`\`

## 3. Agent with Tools

\`\`\`python
class AgentState(TypedDict):
    messages: Annotated[list, add]
    tool_calls: list
    tool_results: Annotated[list, add]
    final_answer: str
\`\`\`

## 4. Workflow Tracking

\`\`\`python
class WorkflowState(TypedDict):
    steps_completed: Annotated[list, add]
    current_step: str
    approvals: dict
    status: str
\`\`\``,

  mistakesContent: `# Common Mistakes

## 1. Forgetting Reducer for Lists

\`\`\`python
# Wrong - overwrites entire list
class State(TypedDict):
    items: list

def add_item(state):
    return {"items": ["new"]}  # Replaces all items!

# Right - use add reducer
class State(TypedDict):
    items: Annotated[list, add]

def add_item(state):
    return {"items": ["new"]}  # Appends to list
\`\`\`

## 2. Mutating State Directly

\`\`\`python
# Wrong - mutating state
def bad_node(state):
    state["items"].append("new")  # Don't mutate!
    return state

# Right - return new values
def good_node(state):
    return {"items": ["new"]}
\`\`\`

## 3. Missing Required Keys

\`\`\`python
# Wrong - missing initial value
result = app.invoke({"partial": "state"})  # Missing keys!

# Right - provide all required keys
result = app.invoke({
    "messages": [],
    "count": 0,
    "context": {}
})
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: How does state flow through a LangGraph?

**Answer:**
1. Initial state passed to \`invoke()\`
2. First node receives full state
3. Node returns partial update
4. Update merges with state (using reducers)
5. Next node receives merged state
6. Continues until END

## Q2: What are reducers and why use them?

**Answer:** Reducers define how new values merge with existing state:

- **Default (LastValue)**: New value replaces old
- **add**: Appends to list (\`Annotated[list, add]\`)
- **Custom**: Any function \`(old, new) -> merged\`

Use reducers when you want to accumulate data (like chat history).

## Q3: How do you persist state between sessions?

**Answer:** Use checkpointers:

\`\`\`python
from langgraph.checkpoint.memory import MemorySaver

checkpointer = MemorySaver()
app = graph.compile(checkpointer=checkpointer)

# Each thread_id maintains separate state
config = {"configurable": {"thread_id": "user-123"}}
result = app.invoke(state, config)
\`\`\``,

  starterCode: `# State Management Exercise
from langgraph.graph import StateGraph, START, END
from typing import TypedDict, Annotated
from operator import add

# TODO: Define State with:
# - messages: list that accumulates (use add reducer)
# - step_count: int that overwrites
# - metadata: dict for context
class State(TypedDict):
    pass

# TODO: Node that adds a processing step message
def step_one(state: State) -> dict:
    pass

# TODO: Node that adds completion message and updates metadata
def step_two(state: State) -> dict:
    pass

# TODO: Node that increments step count
def track_progress(state: State) -> dict:
    pass

# Build and run
graph = StateGraph(State)

# Add nodes and edges

app = graph.compile()

initial = {"messages": [], "step_count": 0, "metadata": {}}
result = app.invoke(initial)
print(f"Messages: {result['messages']}")
print(f"Steps: {result['step_count']}")`,

  solutionCode: `# State Management Exercise
from langgraph.graph import StateGraph, START, END
from typing import TypedDict, Annotated
from operator import add

# Define State with reducers
class State(TypedDict):
    messages: Annotated[list[str], add]
    step_count: int
    metadata: dict

# Node that adds a processing step message
def step_one(state: State) -> dict:
    return {
        "messages": ["Step 1: Initialized processing"],
        "step_count": state["step_count"] + 1
    }

# Node that adds completion message and updates metadata
def step_two(state: State) -> dict:
    return {
        "messages": ["Step 2: Processing complete"],
        "step_count": state["step_count"] + 1,
        "metadata": {"status": "completed", "steps_run": 2}
    }

# Node that adds summary
def summarize(state: State) -> dict:
    return {
        "messages": [f"Summary: Ran {state['step_count']} steps"]
    }

# Build graph
graph = StateGraph(State)

# Add nodes
graph.add_node("step_one", step_one)
graph.add_node("step_two", step_two)
graph.add_node("summarize", summarize)

# Add edges
graph.add_edge(START, "step_one")
graph.add_edge("step_one", "step_two")
graph.add_edge("step_two", "summarize")
graph.add_edge("summarize", END)

app = graph.compile()

# Run
initial = {"messages": [], "step_count": 0, "metadata": {}}
result = app.invoke(initial)

print("Messages:")
for msg in result["messages"]:
    print(f"  - {msg}")
print(f"\\nTotal Steps: {result['step_count']}")
print(f"Metadata: {result['metadata']}")`,

  hints: [
    "Annotated[list, add] makes lists accumulate",
    "Regular types overwrite on update",
    "Return only keys you want to change",
    "Import 'add' from operator module",
  ],
};
