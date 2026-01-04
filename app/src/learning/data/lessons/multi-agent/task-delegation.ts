import type { LessonContent } from '../types';

export const taskDelegation: LessonContent = {
  slug: "task-delegation",
  problemContent: `# Task Delegation: Distributing Work

Effective delegation is key to multi-agent success!

## Delegation Patterns

### 1. Sequential Delegation
\`\`\`
Manager → Agent1 → Agent2 → Agent3
(Each passes to next)
\`\`\`

### 2. Parallel Delegation
\`\`\`
Manager → Agent1
       → Agent2  (All work simultaneously)
       → Agent3
\`\`\`

### 3. Dynamic Delegation
\`\`\`
Manager evaluates → Assigns to best agent
                  → Reviews result
                  → Reassigns if needed
\`\`\`

## Delegation Components

\`\`\`python
# Task specification
task = {
    "description": "What to do",
    "assignee": "Who does it",
    "dependencies": ["What's needed first"],
    "deadline": "When it's due",
    "priority": "How important"
}
\`\`\`

## Your Task

Implement a task delegation system.`,

  solutionContent: `# Solution: Task Delegation System

\`\`\`python
from openai import OpenAI
from typing import Optional
from dataclasses import dataclass
import json

client = OpenAI()

@dataclass
class Task:
    id: str
    description: str
    assignee: Optional[str] = None
    status: str = "pending"
    result: Optional[str] = None
    dependencies: list = None

    def __post_init__(self):
        self.dependencies = self.dependencies or []

class Agent:
    def __init__(self, name: str, skills: list[str]):
        self.name = name
        self.skills = skills

    def can_handle(self, task: Task) -> bool:
        # Check if any skill matches task
        task_lower = task.description.lower()
        return any(skill.lower() in task_lower for skill in self.skills)

    def execute(self, task: Task) -> str:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": f"You are {self.name}. Skills: {', '.join(self.skills)}"},
                {"role": "user", "content": task.description}
            ]
        )
        return response.choices[0].message.content

class TaskManager:
    def __init__(self):
        self.agents: list[Agent] = []
        self.tasks: list[Task] = []

    def add_agent(self, agent: Agent):
        self.agents.append(agent)

    def add_task(self, task: Task):
        self.tasks.append(task)

    def find_best_agent(self, task: Task) -> Optional[Agent]:
        for agent in self.agents:
            if agent.can_handle(task):
                return agent
        return None

    def delegate_and_execute(self):
        results = {}

        for task in self.tasks:
            # Check dependencies
            for dep_id in task.dependencies:
                if dep_id not in results:
                    print(f"Waiting for dependency: {dep_id}")
                    continue

            # Find agent
            agent = self.find_best_agent(task)
            if not agent:
                print(f"No agent for: {task.description}")
                continue

            # Delegate
            task.assignee = agent.name
            task.status = "in_progress"
            print(f"Delegating '{task.id}' to {agent.name}")

            # Execute
            task.result = agent.execute(task)
            task.status = "completed"
            results[task.id] = task.result

        return results

# Usage
manager = TaskManager()

# Add specialized agents
manager.add_agent(Agent("Researcher", ["research", "find", "search"]))
manager.add_agent(Agent("Writer", ["write", "create", "draft"]))
manager.add_agent(Agent("Reviewer", ["review", "check", "verify"]))

# Add tasks
manager.add_task(Task("t1", "Research AI trends"))
manager.add_task(Task("t2", "Write summary of findings", dependencies=["t1"]))
manager.add_task(Task("t3", "Review the summary", dependencies=["t2"]))

# Execute
results = manager.delegate_and_execute()

for task_id, result in results.items():
    print(f"\\n{task_id}: {result[:100]}...")
\`\`\``,

  explanationContent: `# Delegation Deep Dive

## Task Properties

\`\`\`python
task = {
    "id": "unique_id",
    "description": "What needs to be done",
    "assignee": "Which agent handles it",
    "status": "pending|in_progress|completed|failed",
    "priority": "high|medium|low",
    "dependencies": ["task_ids that must complete first"],
    "result": "Output when completed"
}
\`\`\`

## Delegation Strategies

### 1. Skill-Based
\`\`\`python
def assign(task, agents):
    for agent in agents:
        if task.required_skill in agent.skills:
            return agent
\`\`\`

### 2. Load-Balanced
\`\`\`python
def assign(task, agents):
    return min(agents, key=lambda a: a.current_tasks)
\`\`\`

### 3. Priority-Based
\`\`\`python
def assign(task, agents):
    if task.priority == "high":
        return agents.best_performer
    return agents.available
\`\`\`

## Dependency Resolution

\`\`\`python
def execute_with_deps(task, completed):
    # Wait for all dependencies
    for dep in task.dependencies:
        if dep not in completed:
            return "blocked"

    # Get dependency outputs
    context = [completed[dep] for dep in task.dependencies]

    # Execute with context
    return agent.execute(task, context)
\`\`\``,

  realworldContent: `# Real-World Delegation

## Project Management

\`\`\`python
tasks = [
    Task("Design API", assignee="Architect"),
    Task("Implement API", assignee="Developer", deps=["Design API"]),
    Task("Write docs", assignee="Writer", deps=["Implement API"]),
    Task("Review all", assignee="Lead", deps=["Write docs"])
]
\`\`\`

## Content Pipeline

\`\`\`python
tasks = [
    Task("Research topic", assignee="Researcher"),
    Task("Create outline", assignee="Strategist", deps=["Research"]),
    Task("Write draft", assignee="Writer", deps=["outline"]),
    Task("Edit", assignee="Editor", deps=["draft"]),
    Task("Publish", assignee="Publisher", deps=["Edit"])
]
\`\`\`

## Support Escalation

\`\`\`python
def escalate(ticket, agents):
    if ticket.complexity == "low":
        return agents["tier1"]
    elif ticket.complexity == "medium":
        return agents["tier2"]
    else:
        return agents["specialist"]
\`\`\``,

  mistakesContent: `# Common Delegation Mistakes

## 1. Circular Dependencies

\`\`\`python
# Wrong - deadlock!
task1 = Task("A", dependencies=["B"])
task2 = Task("B", dependencies=["A"])

# Right - clear order
task1 = Task("A", dependencies=[])
task2 = Task("B", dependencies=["A"])
\`\`\`

## 2. No Fallback

\`\`\`python
# Wrong - fails if no match
agent = find_agent(task)
agent.execute(task)  # Crashes if None!

# Right - handle missing
agent = find_agent(task)
if agent:
    agent.execute(task)
else:
    fallback_agent.execute(task)
\`\`\`

## 3. Ignoring Results

\`\`\`python
# Wrong - not passing context
task1_result = agent1.execute(task1)
agent2.execute(task2)  # Doesn't use task1_result!

# Right - pass context
task1_result = agent1.execute(task1)
agent2.execute(task2, context=task1_result)
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: How do you handle task dependencies?

**Answer:**
1. Build dependency graph
2. Topological sort for execution order
3. Wait for dependencies before execution
4. Pass dependency outputs as context

## Q2: What if no agent can handle a task?

**Answer:**
- Have a fallback/general agent
- Escalate to human
- Queue for later
- Break into smaller tasks

## Q3: How do you parallelize independent tasks?

**Answer:**
\`\`\`python
import asyncio

async def execute_parallel(tasks):
    independent = [t for t in tasks if not t.dependencies]
    results = await asyncio.gather(
        *[agent.execute(t) for t in independent]
    )
    return results
\`\`\``,

  starterCode: `# Task Delegation Exercise

class Task:
    def __init__(self, id, description, dependencies=None):
        self.id = id
        self.description = description
        self.dependencies = dependencies or []
        self.assignee = None
        self.result = None

class Agent:
    def __init__(self, name, skills):
        self.name = name
        self.skills = skills

    def can_handle(self, task):
        # TODO: Check if agent's skills match task
        pass

    def execute(self, task):
        # Simulate execution
        return f"{self.name} completed: {task.description}"

class Delegator:
    def __init__(self):
        self.agents = []
        self.tasks = []
        self.completed = {}

    def add_agent(self, agent):
        self.agents.append(agent)

    def add_task(self, task):
        self.tasks.append(task)

    def find_agent(self, task):
        # TODO: Find an agent that can handle the task
        pass

    def run(self):
        # TODO: Execute all tasks respecting dependencies
        pass

# Test
delegator = Delegator()

# Add agents
delegator.add_agent(Agent("Alice", ["research", "analyze"]))
delegator.add_agent(Agent("Bob", ["write", "edit"]))

# Add tasks
delegator.add_task(Task("t1", "Research the topic"))
delegator.add_task(Task("t2", "Write a report", ["t1"]))

# Run
delegator.run()`,

  solutionCode: `class Task:
    def __init__(self, id, description, dependencies=None):
        self.id = id
        self.description = description
        self.dependencies = dependencies or []
        self.assignee = None
        self.result = None

class Agent:
    def __init__(self, name, skills):
        self.name = name
        self.skills = skills

    def can_handle(self, task):
        task_lower = task.description.lower()
        return any(skill.lower() in task_lower for skill in self.skills)

    def execute(self, task, context=""):
        output = f"{self.name} completed: {task.description}"
        if context:
            output += f" (using: {context[:50]}...)"
        return output

class Delegator:
    def __init__(self):
        self.agents = []
        self.tasks = []
        self.completed = {}

    def add_agent(self, agent):
        self.agents.append(agent)

    def add_task(self, task):
        self.tasks.append(task)

    def find_agent(self, task):
        for agent in self.agents:
            if agent.can_handle(task):
                return agent
        return self.agents[0] if self.agents else None

    def run(self):
        # Sort by dependencies (simple topological sort)
        pending = self.tasks.copy()

        while pending:
            for task in pending[:]:
                # Check if dependencies are met
                deps_met = all(d in self.completed for d in task.dependencies)

                if deps_met:
                    # Find and assign agent
                    agent = self.find_agent(task)
                    if agent:
                        task.assignee = agent.name

                        # Get context from dependencies
                        context = " | ".join(
                            self.completed[d] for d in task.dependencies
                        )

                        # Execute
                        result = agent.execute(task, context)
                        task.result = result
                        self.completed[task.id] = result

                        print(f"[{task.id}] {agent.name}: {task.description}")
                        pending.remove(task)

        return self.completed

# Test
delegator = Delegator()

# Add agents
delegator.add_agent(Agent("Alice", ["research", "analyze"]))
delegator.add_agent(Agent("Bob", ["write", "edit", "report"]))

# Add tasks
delegator.add_task(Task("t1", "Research the topic"))
delegator.add_task(Task("t2", "Write a report", ["t1"]))

# Run
print("=== Delegation Results ===")
results = delegator.run()`,

  hints: [
    "can_handle checks if skill keywords appear in task",
    "find_agent loops through agents calling can_handle",
    "run() must check dependencies before executing",
    "Pass completed task results as context",
  ],
};
