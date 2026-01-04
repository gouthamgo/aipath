import type { LessonContent } from '../types';

export const multiAgentIntro: LessonContent = {
  slug: "multi-agent-intro",
  problemContent: `# Multi-Agent Systems: Why Multiple Agents?

One agent is good. Multiple agents working together is **powerful**!

## The Problem with Single Agents

| Single Agent | Multi-Agent |
|-------------|-------------|
| One perspective | Multiple perspectives |
| Limited expertise | Specialized experts |
| Sequential work | Parallel work |
| Single point of failure | Redundancy |

## Real-World Analogy

Think of a **software team**:
- Product Manager plans features
- Developer writes code
- QA Engineer tests
- Tech Writer documents

Each has specialized skills. Together they ship great products!

## Multi-Agent Architecture

\`\`\`
┌─────────────┐
│   Manager   │ ← Coordinates work
└──────┬──────┘
       │
┌──────┴──────┐
│             │
▼             ▼
┌─────────┐ ┌─────────┐
│Research │ │ Writer  │ ← Specialized agents
└─────────┘ └─────────┘
\`\`\`

## Your Task

Understand when and why to use multiple agents.`,

  solutionContent: `# Solution: Multi-Agent Simulation

\`\`\`python
from openai import OpenAI

client = OpenAI()

def create_agent(role: str, expertise: str):
    """Create an agent with specific role."""
    return {
        "role": role,
        "expertise": expertise,
        "system_prompt": f"""You are a {role} with expertise in {expertise}.
Respond only from your professional perspective.
Be concise and focused on your area of expertise."""
    }

def agent_respond(agent: dict, task: str) -> str:
    """Get agent's response to a task."""
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": agent["system_prompt"]},
            {"role": "user", "content": task}
        ]
    )
    return response.choices[0].message.content

# Create specialized agents
researcher = create_agent("Research Analyst", "gathering and analyzing information")
writer = create_agent("Content Writer", "creating clear, engaging content")
editor = create_agent("Editor", "reviewing and improving content quality")

# Multi-agent workflow
task = "Create a brief article about AI in healthcare"

# Step 1: Research
research = agent_respond(researcher, f"Research key points for: {task}")
print(f"Researcher:\\n{research}\\n")

# Step 2: Write
draft = agent_respond(writer, f"Based on this research, write the article:\\n{research}")
print(f"Writer:\\n{draft}\\n")

# Step 3: Edit
final = agent_respond(editor, f"Edit and improve this article:\\n{draft}")
print(f"Editor:\\n{final}")
\`\`\``,

  explanationContent: `# Multi-Agent Concepts

## Why Multiple Agents?

### 1. Specialization
Each agent focuses on what it does best:
\`\`\`
Researcher → Good at finding information
Writer → Good at creating content
Coder → Good at writing code
\`\`\`

### 2. Division of Labor
Complex tasks split into manageable pieces:
\`\`\`
Big Task → [Research] + [Analyze] + [Write] + [Review]
\`\`\`

### 3. Checks and Balances
Agents can verify each other's work:
\`\`\`
Writer creates → Editor reviews → Writer revises
\`\`\`

## Agent Communication Patterns

### Sequential (Pipeline)
\`\`\`
A → B → C → D
\`\`\`

### Hierarchical
\`\`\`
    Manager
   /   |   \\
  A    B    C
\`\`\`

### Collaborative
\`\`\`
A ←→ B ←→ C
(all communicate)
\`\`\`

## When to Use Multi-Agent

✅ Use when:
- Task needs multiple expertise areas
- Want checks and balances
- Workflow has clear stages
- Need parallel processing

❌ Avoid when:
- Simple, single-step task
- Tight latency requirements
- Communication overhead too high`,

  realworldContent: `# Real-World Multi-Agent Systems

## 1. Content Creation Pipeline

\`\`\`
Topic → Researcher → Writer → Editor → Publisher
\`\`\`

## 2. Software Development

\`\`\`
Requirements → Architect → Developer → Tester → DevOps
\`\`\`

## 3. Customer Support

\`\`\`
Query → Classifier → Specialist → Quality Check → Response
\`\`\`

## 4. Data Analysis

\`\`\`
Data → Cleaner → Analyst → Visualizer → Reporter
\`\`\`

## Industry Examples

| Company | Multi-Agent Use |
|---------|----------------|
| AutoGPT | Task decomposition agents |
| Devin | Coding agent team |
| ChatDev | Simulated software company |
| MetaGPT | Role-based development |`,

  mistakesContent: `# Common Mistakes

## 1. Too Many Agents

\`\`\`python
# Wrong - overkill for simple task
agents = [researcher, analyst, writer, editor, reviewer, publisher]
result = run_all(agents, "Write a tweet")

# Right - one agent is enough
result = writer.generate("Write a tweet about AI")
\`\`\`

## 2. Unclear Roles

\`\`\`python
# Wrong - overlapping responsibilities
agent1 = "You write and edit content"
agent2 = "You edit and write content"

# Right - clear separation
writer = "You write first drafts"
editor = "You improve existing drafts"
\`\`\`

## 3. No Coordination

\`\`\`python
# Wrong - agents work independently
research = researcher.work()
writing = writer.work()  # Doesn't use research!

# Right - pass context between agents
research = researcher.work(topic)
writing = writer.work(research)  # Uses research
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: When would you use a multi-agent system?

**Answer:**
- Tasks requiring multiple expertise areas
- Complex workflows with distinct stages
- Need for quality checks and verification
- Parallel processing opportunities
- When single agent context window is insufficient

## Q2: How do agents communicate?

**Answer:**
1. **Shared state**: All agents read/write common state
2. **Message passing**: Agents send messages to each other
3. **Blackboard**: Central knowledge base all access
4. **Orchestrator**: Manager routes between agents

## Q3: What are the drawbacks?

**Answer:**
- Increased latency (multiple LLM calls)
- Higher cost (more tokens)
- Complexity in coordination
- Potential for miscommunication
- Harder to debug`,

  starterCode: `from openai import OpenAI

client = OpenAI()

# TODO: Create a function to make agents
def create_agent(role: str, expertise: str) -> dict:
    """Create an agent with role and expertise."""
    pass

# TODO: Create a function for agent responses
def agent_respond(agent: dict, task: str) -> str:
    """Get agent's response to a task."""
    pass

# TODO: Create three agents: researcher, writer, reviewer
researcher = None
writer = None
reviewer = None

# TODO: Run a simple multi-agent workflow
# 1. Researcher finds key points
# 2. Writer creates content
# 3. Reviewer improves it

task = "Explain why Python is popular"

# Your workflow here`,

  solutionCode: `from openai import OpenAI

client = OpenAI()

def create_agent(role: str, expertise: str) -> dict:
    """Create an agent with role and expertise."""
    return {
        "role": role,
        "expertise": expertise,
        "system_prompt": f"""You are a {role} with expertise in {expertise}.
Stay focused on your specific role and expertise.
Be concise and professional."""
    }

def agent_respond(agent: dict, task: str) -> str:
    """Get agent's response to a task."""
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": agent["system_prompt"]},
            {"role": "user", "content": task}
        ]
    )
    return response.choices[0].message.content

# Create three specialized agents
researcher = create_agent("Research Analyst", "technical research")
writer = create_agent("Technical Writer", "clear explanations")
reviewer = create_agent("Quality Reviewer", "improving content clarity")

# Multi-agent workflow
task = "Explain why Python is popular"

print("=== Multi-Agent Workflow ===\\n")

# Step 1: Research
print("1. Researcher working...")
research = agent_respond(researcher, f"List 5 key reasons for: {task}")
print(f"Research:\\n{research}\\n")

# Step 2: Write
print("2. Writer working...")
draft = agent_respond(writer, f"Write a short explanation based on:\\n{research}")
print(f"Draft:\\n{draft}\\n")

# Step 3: Review
print("3. Reviewer working...")
final = agent_respond(reviewer, f"Improve this explanation:\\n{draft}")
print(f"Final:\\n{final}")`,

  hints: [
    "Each agent needs a system prompt defining its role",
    "Pass output from one agent as input to the next",
    "Keep system prompts focused and specific",
    "The workflow is: Research → Write → Review",
  ],
};
