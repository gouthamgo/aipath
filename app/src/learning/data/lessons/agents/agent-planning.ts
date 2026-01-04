import type { LessonContent } from '../types';

export const agentPlanning: LessonContent = {
  slug: "agent-planning",
  problemContent: `# Agent Planning

Smart agents plan before they act!

## Why Planning?

| Without Planning | With Planning |
|------------------|---------------|
| Act immediately | Think first |
| May miss steps | Comprehensive |
| Hard to recover | Can adjust |
| Inefficient | Optimized |

## Planning Strategies

\`\`\`python
# 1. Upfront planning
plan = agent.create_plan(task)
for step in plan:
    execute(step)

# 2. Dynamic planning
while not done:
    next_step = agent.plan_next(context)
    execute(next_step)

# 3. Hierarchical planning
high_level = agent.plan_goals(task)
for goal in high_level:
    sub_steps = agent.plan_steps(goal)
    execute(sub_steps)
\`\`\`

## Your Task

Implement a planning agent.`,
  solutionContent: `# Solution: Planning Agent

\`\`\`python
from openai import OpenAI
import json

client = OpenAI()

def create_plan(task: str) -> list[str]:
    """Create a plan for completing the task."""
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{
            "role": "user",
            "content": f"""Create a step-by-step plan to complete this task:
{task}

Return a JSON array of steps. Each step should be a clear action.
Example: ["Step 1: ...", "Step 2: ...", "Step 3: ..."]

Return ONLY the JSON array, no other text."""
        }],
        response_format={"type": "json_object"}
    )

    result = json.loads(response.choices[0].message.content)
    return result.get("steps", result.get("plan", []))

def execute_step(step: str, context: str) -> str:
    """Execute a single step and return the result."""
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{
            "role": "user",
            "content": f"""Context from previous steps:
{context}

Current step to execute:
{step}

Execute this step and provide the result."""
        }]
    )
    return response.choices[0].message.content

def planning_agent(task: str) -> str:
    """Agent that plans before executing."""

    # Phase 1: Create plan
    print("Creating plan...")
    plan = create_plan(task)
    print(f"Plan: {plan}\\n")

    # Phase 2: Execute each step
    context = ""
    for i, step in enumerate(plan):
        print(f"Executing step {i+1}: {step}")
        result = execute_step(step, context)
        context += f"\\nStep {i+1}: {step}\\nResult: {result}\\n"
        print(f"Result: {result}\\n")

    # Phase 3: Summarize
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{
            "role": "user",
            "content": f"Task: {task}\\n\\nExecution:\\n{context}\\n\\nProvide a final summary."
        }]
    )

    return response.choices[0].message.content

# Test
result = planning_agent("Write a haiku about programming and explain its meaning")
print(f"Final Result:\\n{result}")
\`\`\``,
  explanationContent: `# Planning Strategies Deep Dive

## 1. Upfront Planning

Create complete plan before execution:

\`\`\`python
# Good for: Well-defined tasks
plan = [
    "1. Gather requirements",
    "2. Design solution",
    "3. Implement code",
    "4. Test",
    "5. Deploy"
]
\`\`\`

## 2. Dynamic Re-planning

Adjust plan based on results:

\`\`\`python
while not done:
    plan = create_or_update_plan(task, results_so_far)
    next_step = plan[0]
    result = execute(next_step)

    if result.failed:
        # Re-plan with failure context
        continue
\`\`\`

## 3. Hierarchical Planning

Break down into goals → sub-goals → actions:

\`\`\`
Goal: Build a website
├── Sub-goal: Design
│   ├── Action: Create wireframes
│   └── Action: Choose colors
├── Sub-goal: Develop
│   ├── Action: Set up project
│   └── Action: Write code
└── Sub-goal: Deploy
    └── Action: Configure hosting
\`\`\`

## Plan Representation

\`\`\`python
# Simple: List of strings
["step 1", "step 2", "step 3"]

# Structured: With dependencies
{
    "steps": [
        {"id": 1, "action": "...", "depends_on": []},
        {"id": 2, "action": "...", "depends_on": [1]},
        {"id": 3, "action": "...", "depends_on": [1, 2]}
    ]
}
\`\`\``,
  realworldContent: `# Real-World: Project Management Agent

## Scenario: Automated Sprint Planning

\`\`\`python
class SprintPlanningAgent:
    def plan_sprint(self, backlog: list, team_capacity: int):
        # 1. Analyze backlog
        prioritized = self.prioritize_tasks(backlog)

        # 2. Estimate effort
        estimated = self.estimate_tasks(prioritized)

        # 3. Create sprint plan
        plan = self.fit_to_capacity(estimated, team_capacity)

        # 4. Identify dependencies
        ordered = self.resolve_dependencies(plan)

        # 5. Assign to team members
        assigned = self.assign_tasks(ordered)

        return assigned

# Agent creates actionable sprint plan
sprint = agent.plan_sprint(
    backlog=jira_tickets,
    team_capacity=40  # story points
)
\`\`\`

## Benefits

- Consistent planning process
- Considers all factors
- Can explain its reasoning
- Learns from past sprints`,
  mistakesContent: `# Common Mistakes

## 1. Over-planning

\`\`\`python
# WRONG - Too many steps for simple task
plan = create_plan("Add two numbers")
# Returns 10 steps...

# RIGHT - Keep plans proportional
def create_plan(task, max_steps=5):
    # Limit complexity
\`\`\`

## 2. Not Re-planning on Failure

\`\`\`python
# WRONG - Blindly continue after failure
for step in plan:
    result = execute(step)  # Step 2 fails
    # Continues to step 3...

# RIGHT - Re-plan after failure
for step in plan:
    result = execute(step)
    if result.failed:
        plan = replan(task, completed_steps, failure_reason)
\`\`\`

## 3. Ignoring Dependencies

\`\`\`python
# WRONG - Execute in parallel without checking
parallel_execute(all_steps)

# RIGHT - Respect dependencies
for step in topological_sort(steps, dependencies):
    execute(step)
\`\`\``,
  interviewContent: `# Interview Questions

## Q1: When should you use upfront vs dynamic planning?

**Answer**:
- Upfront: Clear requirements, stable environment, well-understood domain
- Dynamic: Uncertain requirements, changing conditions, exploratory tasks

## Q2: How do you handle plan failures?

**Answer**:
1. Detect failure early
2. Analyze root cause
3. Re-plan from current state
4. Consider alternative approaches
5. Know when to escalate/give up

## Q3: How do you evaluate plan quality?

**Answer**:
1. Completeness: Covers all requirements
2. Efficiency: Minimal unnecessary steps
3. Feasibility: Steps are executable
4. Robustness: Handles edge cases
5. Clarity: Steps are unambiguous`,
  starterCode: `from openai import OpenAI
import json

client = OpenAI()

# TODO: Implement plan creation
def create_plan(task: str) -> list[str]:
    """Create a list of steps to complete the task."""
    # Use LLM to generate plan
    # Return as list of strings
    pass

# TODO: Implement step execution
def execute_step(step: str, context: str) -> str:
    """Execute a step given the context."""
    pass

# TODO: Implement planning agent
def planning_agent(task: str) -> str:
    """
    1. Create plan
    2. Execute each step
    3. Return final result
    """
    pass

# Test
result = planning_agent("Explain quantum computing in simple terms")
print(result)`,
  solutionCode: `from openai import OpenAI
import json

client = OpenAI()

def create_plan(task: str) -> list[str]:
    """Create a list of steps to complete the task."""
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{
            "role": "user",
            "content": f"""Create 3-5 steps to complete this task: {task}

Return as JSON: {{"steps": ["step 1", "step 2", ...]}}"""
        }],
        response_format={"type": "json_object"}
    )

    data = json.loads(response.choices[0].message.content)
    return data.get("steps", [])

def execute_step(step: str, context: str) -> str:
    """Execute a step given the context."""
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{
            "role": "user",
            "content": f"Previous context:\\n{context}\\n\\nExecute this step: {step}"
        }]
    )
    return response.choices[0].message.content

def planning_agent(task: str) -> str:
    # Create plan
    plan = create_plan(task)
    print(f"Plan: {plan}\\n")

    # Execute steps
    context = ""
    for i, step in enumerate(plan, 1):
        print(f"Step {i}: {step}")
        result = execute_step(step, context)
        context += f"Step {i}: {step}\\nResult: {result}\\n\\n"

    # Return final context as result
    return context

result = planning_agent("Explain quantum computing in simple terms")
print(result)`,
  hints: [
    "Use JSON response format to get structured plan from LLM",
    "Pass accumulated context to each step for continuity",
    "Build context string as you execute each step"
  ]
};
