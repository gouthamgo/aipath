import type { LessonContent } from '../types';

export const crewaiBasics: LessonContent = {
  slug: "crewai-basics",
  problemContent: `# CrewAI: Build Agent Teams

CrewAI is a framework for creating **teams of AI agents** that work together.

## Why CrewAI?

| Manual Multi-Agent | CrewAI |
|-------------------|--------|
| Build from scratch | Pre-built patterns |
| Handle coordination | Automatic delegation |
| Define workflows | Declarative tasks |
| Manage state | Built-in memory |

## Core Concepts

\`\`\`python
from crewai import Agent, Task, Crew

# 1. Create Agents with roles
researcher = Agent(
    role="Researcher",
    goal="Find accurate information",
    backstory="Expert at research"
)

# 2. Define Tasks
task = Task(
    description="Research AI trends",
    agent=researcher
)

# 3. Assemble Crew
crew = Crew(
    agents=[researcher],
    tasks=[task]
)

# 4. Execute
result = crew.kickoff()
\`\`\`

## Your Task

Build your first CrewAI crew with two agents.`,

  solutionContent: `# Solution: CrewAI Team

\`\`\`python
from crewai import Agent, Task, Crew, Process

# Create Agents
researcher = Agent(
    role="Senior Research Analyst",
    goal="Uncover cutting-edge developments in AI",
    backstory="""You are an expert at analyzing tech trends.
    You excel at finding accurate, relevant information.""",
    verbose=True,
    allow_delegation=False
)

writer = Agent(
    role="Tech Content Writer",
    goal="Create engaging content about tech topics",
    backstory="""You are a skilled writer who transforms
    complex technical topics into clear, engaging content.""",
    verbose=True,
    allow_delegation=False
)

# Create Tasks
research_task = Task(
    description="""Research the latest trends in AI agents.
    Focus on: key developments, major players, future directions.
    Your output should be a comprehensive summary.""",
    expected_output="A detailed research summary with key findings",
    agent=researcher
)

writing_task = Task(
    description="""Using the research provided, write a blog post
    about AI agents. Make it engaging and accessible to a
    general tech audience. Include examples.""",
    expected_output="A well-written blog post (300-500 words)",
    agent=writer
)

# Assemble Crew
crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, writing_task],
    process=Process.sequential,  # Tasks run in order
    verbose=True
)

# Execute
result = crew.kickoff()
print(result)
\`\`\``,

  explanationContent: `# CrewAI Deep Dive

## Agents

\`\`\`python
Agent(
    role="Role Title",           # What they do
    goal="Their objective",      # What they aim for
    backstory="Background",      # Context and expertise
    tools=[...],                 # Available tools
    verbose=True,                # Show thinking
    allow_delegation=True        # Can assign to others
)
\`\`\`

## Tasks

\`\`\`python
Task(
    description="What to do",
    expected_output="What to produce",
    agent=assigned_agent,
    context=[other_tasks]        # Dependencies
)
\`\`\`

## Crew Processes

### Sequential
\`\`\`
Task1 → Task2 → Task3
(One after another)
\`\`\`

### Hierarchical
\`\`\`
Manager assigns and reviews
↓
Workers execute tasks
\`\`\`

## Task Dependencies

\`\`\`python
task2 = Task(
    description="Write based on research",
    context=[task1]  # Uses task1's output
)
\`\`\``,

  realworldContent: `# Real-World CrewAI Applications

## 1. Content Marketing Team

\`\`\`python
crew = Crew(
    agents=[
        Agent(role="SEO Analyst"),
        Agent(role="Content Writer"),
        Agent(role="Social Media Manager")
    ],
    tasks=[
        Task("Research trending topics"),
        Task("Write blog post"),
        Task("Create social posts")
    ]
)
\`\`\`

## 2. Code Review Team

\`\`\`python
crew = Crew(
    agents=[
        Agent(role="Security Reviewer"),
        Agent(role="Performance Analyst"),
        Agent(role="Style Checker")
    ],
    tasks=[
        Task("Check security issues"),
        Task("Analyze performance"),
        Task("Verify code style")
    ]
)
\`\`\`

## 3. Research Team

\`\`\`python
crew = Crew(
    agents=[
        Agent(role="Literature Reviewer"),
        Agent(role="Data Analyst"),
        Agent(role="Report Writer")
    ],
    tasks=[
        Task("Review existing research"),
        Task("Analyze data"),
        Task("Compile final report")
    ]
)
\`\`\``,

  mistakesContent: `# Common Mistakes

## 1. Vague Goals

\`\`\`python
# Wrong - too vague
Agent(
    role="Helper",
    goal="Help with stuff"
)

# Right - specific and clear
Agent(
    role="Market Research Analyst",
    goal="Identify market opportunities in the AI sector"
)
\`\`\`

## 2. Missing Context

\`\`\`python
# Wrong - tasks are independent
task1 = Task("Research topic")
task2 = Task("Write about topic")  # Doesn't use research!

# Right - connect with context
task1 = Task("Research topic")
task2 = Task("Write about topic", context=[task1])
\`\`\`

## 3. Too Many Agents

\`\`\`python
# Wrong - overkill
crew = Crew(agents=[a1, a2, a3, a4, a5, a6])

# Right - only what's needed
crew = Crew(agents=[researcher, writer])  # 2-3 usually enough
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: What are the core components of CrewAI?

**Answer:**
1. **Agents**: AI entities with roles, goals, backstories
2. **Tasks**: Work items with descriptions and expected outputs
3. **Crews**: Teams that combine agents and tasks
4. **Processes**: Execution patterns (sequential, hierarchical)

## Q2: How do you handle task dependencies?

**Answer:**
Use the \`context\` parameter:
\`\`\`python
task2 = Task(
    description="Write based on research",
    context=[task1]  # Gets task1's output
)
\`\`\`

## Q3: Sequential vs Hierarchical process?

**Answer:**
- **Sequential**: Tasks run in order, output flows to next
- **Hierarchical**: Manager agent assigns, reviews, and coordinates

Use sequential for simple pipelines, hierarchical for complex coordination.`,

  starterCode: `# Note: This requires crewai package
# pip install crewai

# Simulated CrewAI-style implementation
class Agent:
    def __init__(self, role, goal, backstory):
        self.role = role
        self.goal = goal
        self.backstory = backstory

    def execute(self, task, context=""):
        # Simulate agent work
        return f"[{self.role}] Completed: {task}"

class Task:
    def __init__(self, description, agent, context=None):
        self.description = description
        self.agent = agent
        self.context = context or []
        self.output = None

class Crew:
    def __init__(self, agents, tasks):
        self.agents = agents
        self.tasks = tasks

    def kickoff(self):
        results = []
        context = ""
        for task in self.tasks:
            output = task.agent.execute(task.description, context)
            task.output = output
            context += f"\\n{output}"
            results.append(output)
        return "\\n".join(results)

# TODO: Create a researcher agent
researcher = Agent(
    role="",
    goal="",
    backstory=""
)

# TODO: Create a writer agent
writer = Agent(
    role="",
    goal="",
    backstory=""
)

# TODO: Create tasks
research_task = Task("", researcher)
writing_task = Task("", writer)

# TODO: Create crew and run
crew = Crew(
    agents=[],
    tasks=[]
)

result = crew.kickoff()
print(result)`,

  solutionCode: `# Simulated CrewAI-style implementation
class Agent:
    def __init__(self, role, goal, backstory):
        self.role = role
        self.goal = goal
        self.backstory = backstory

    def execute(self, task, context=""):
        return f"[{self.role}] Completed: {task}"

class Task:
    def __init__(self, description, agent, context=None):
        self.description = description
        self.agent = agent
        self.context = context or []
        self.output = None

class Crew:
    def __init__(self, agents, tasks):
        self.agents = agents
        self.tasks = tasks

    def kickoff(self):
        results = []
        context = ""
        for task in self.tasks:
            output = task.agent.execute(task.description, context)
            task.output = output
            context += f"\\n{output}"
            results.append(output)
        return "\\n".join(results)

# Create agents
researcher = Agent(
    role="Research Analyst",
    goal="Find accurate, relevant information",
    backstory="Expert researcher with 10 years experience"
)

writer = Agent(
    role="Content Writer",
    goal="Create engaging, clear content",
    backstory="Skilled writer who makes complex topics simple"
)

# Create tasks
research_task = Task(
    description="Research the benefits of AI in education",
    agent=researcher
)

writing_task = Task(
    description="Write a blog post based on the research",
    agent=writer,
    context=[research_task]
)

# Create and run crew
crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, writing_task]
)

print("=== Crew Execution ===")
result = crew.kickoff()
print(result)`,

  hints: [
    "Agent needs role, goal, and backstory",
    "Tasks connect to agents via the agent parameter",
    "Use context to pass output between tasks",
    "Crew brings agents and tasks together",
  ],
};
