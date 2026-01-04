import type { LessonContent } from '../types';

export const agentRoles: LessonContent = {
  slug: "agent-roles",
  problemContent: `# Agent Roles: Specialization Matters

Well-defined roles make agents more effective!

## The Role Framework

\`\`\`python
Agent(
    role="Job Title",           # What they are
    goal="Primary objective",   # What they achieve
    backstory="Experience"      # Why they're qualified
)
\`\`\`

## Common Role Patterns

| Role | Goal | Use Case |
|------|------|----------|
| Researcher | Find information | Data gathering |
| Analyst | Extract insights | Data interpretation |
| Writer | Create content | Documentation |
| Reviewer | Ensure quality | Quality control |
| Planner | Organize work | Coordination |

## Role Design Principles

1. **Single Responsibility**: One clear purpose
2. **Complementary Skills**: Roles work together
3. **Clear Boundaries**: No overlap
4. **Appropriate Expertise**: Match role to task

## Your Task

Design a team of agents for a specific use case.`,

  solutionContent: `# Solution: Specialized Agent Team

\`\`\`python
from openai import OpenAI

client = OpenAI()

# Role definitions with detailed personas
ROLES = {
    "project_manager": {
        "role": "Project Manager",
        "goal": "Coordinate team efforts and ensure project success",
        "backstory": """You are an experienced PM with a track record of
        delivering complex projects. You excel at breaking down tasks,
        identifying dependencies, and keeping teams aligned.""",
        "responsibilities": [
            "Define project scope",
            "Create task breakdown",
            "Assign to appropriate team members",
            "Track progress"
        ]
    },
    "developer": {
        "role": "Senior Software Developer",
        "goal": "Write clean, efficient, well-tested code",
        "backstory": """You are a skilled developer with 10+ years experience.
        You write maintainable code, follow best practices, and consider
        edge cases. You're pragmatic about technical decisions.""",
        "responsibilities": [
            "Implement features",
            "Write tests",
            "Review code",
            "Optimize performance"
        ]
    },
    "qa_engineer": {
        "role": "QA Engineer",
        "goal": "Ensure software quality through thorough testing",
        "backstory": """You are a meticulous QA professional who finds bugs
        others miss. You think about edge cases, user scenarios, and
        potential failure modes.""",
        "responsibilities": [
            "Create test plans",
            "Execute tests",
            "Report bugs",
            "Verify fixes"
        ]
    }
}

def create_agent(role_key: str) -> dict:
    """Create agent from role definition."""
    role_def = ROLES[role_key]
    return {
        **role_def,
        "system_prompt": f"""You are a {role_def['role']}.

Goal: {role_def['goal']}

Background: {role_def['backstory']}

Your responsibilities:
{chr(10).join(f'- {r}' for r in role_def['responsibilities'])}

Stay in character and focus on your specific role."""
    }

def agent_work(agent: dict, task: str, context: str = "") -> str:
    """Have agent perform work."""
    messages = [{"role": "system", "content": agent["system_prompt"]}]

    if context:
        messages.append({"role": "user", "content": f"Context:\\n{context}"})

    messages.append({"role": "user", "content": task})

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages
    )
    return response.choices[0].message.content

# Create team
pm = create_agent("project_manager")
dev = create_agent("developer")
qa = create_agent("qa_engineer")

# Example workflow
project = "Build a user authentication system"

# PM plans
plan = agent_work(pm, f"Create a task breakdown for: {project}")
print(f"PM Plan:\\n{plan}\\n")

# Dev implements
code = agent_work(dev, "Implement the login functionality", plan)
print(f"Dev Output:\\n{code}\\n")

# QA tests
tests = agent_work(qa, "Create a test plan for login", code)
print(f"QA Plan:\\n{tests}")
\`\`\``,

  explanationContent: `# Role Design Deep Dive

## The RAGE Framework for Roles

**R**ole: What is the agent's job title?
**A**ctions: What can they do?
**G**oal: What are they trying to achieve?
**E**xpertise: What qualifies them?

## Example: Research Team

### Lead Researcher
\`\`\`python
role="Lead Researcher"
goal="Discover novel insights and synthesize findings"
actions=["design studies", "analyze data", "write papers"]
expertise="PhD with 20 publications"
\`\`\`

### Data Analyst
\`\`\`python
role="Data Analyst"
goal="Extract actionable insights from data"
actions=["clean data", "run analyses", "create visualizations"]
expertise="Statistics expert, Python proficient"
\`\`\`

### Literature Reviewer
\`\`\`python
role="Literature Reviewer"
goal="Survey existing research comprehensively"
actions=["search papers", "summarize findings", "identify gaps"]
expertise="Domain expert, speed reader"
\`\`\`

## Role Interaction Patterns

\`\`\`
PM creates plan
    │
    ├── assigns to → Developer
    │                    │
    │                    ├── implements
    │                    │
    │                    └── submits to → QA
    │                                      │
    │                                      └── reports to → PM
    │
    └── adjusts plan based on feedback
\`\`\``,

  realworldContent: `# Real-World Role Examples

## Software Team

| Role | Specialization |
|------|---------------|
| Architect | System design |
| Backend Dev | API, database |
| Frontend Dev | UI, UX |
| DevOps | Deployment |
| Security | Vulnerabilities |

## Content Team

| Role | Specialization |
|------|---------------|
| Strategist | Planning |
| Writer | Creation |
| Editor | Quality |
| SEO Expert | Optimization |
| Designer | Visuals |

## Analysis Team

| Role | Specialization |
|------|---------------|
| Data Engineer | Pipelines |
| Analyst | Insights |
| Statistician | Methods |
| Visualizer | Dashboards |
| Reporter | Communication |`,

  mistakesContent: `# Common Role Design Mistakes

## 1. Overlapping Roles

\`\`\`python
# Wrong - too similar
agent1 = Agent(role="Writer", goal="Write content")
agent2 = Agent(role="Author", goal="Create content")

# Right - distinct roles
agent1 = Agent(role="Writer", goal="Create first drafts")
agent2 = Agent(role="Editor", goal="Polish and improve drafts")
\`\`\`

## 2. Too Broad

\`\`\`python
# Wrong - does everything
Agent(
    role="AI Assistant",
    goal="Help with anything"
)

# Right - focused
Agent(
    role="Technical Documentation Writer",
    goal="Create clear API documentation"
)
\`\`\`

## 3. Missing Expertise

\`\`\`python
# Wrong - no context
Agent(role="Analyst")

# Right - with background
Agent(
    role="Financial Analyst",
    backstory="CFA with 15 years in investment banking"
)
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: How do you design agent roles?

**Answer:** Use the RAGE framework:
- **Role**: Clear job title
- **Actions**: What they can do
- **Goal**: What they achieve
- **Expertise**: Why they're qualified

## Q2: How many roles should a team have?

**Answer:**
- Start with 2-3 essential roles
- Add more only if needed
- Each role should have clear value
- Avoid overlapping responsibilities

## Q3: How do roles interact?

**Answer:**
- **Sequential**: Output of one is input to next
- **Hierarchical**: Manager coordinates workers
- **Peer review**: Roles check each other's work`,

  starterCode: `# Design a customer support team
from openai import OpenAI

client = OpenAI()

# TODO: Design three complementary roles for customer support
# Think about: who handles what type of query?

ROLES = {
    "classifier": {
        "role": "",
        "goal": "",
        "backstory": ""
    },
    "specialist": {
        "role": "",
        "goal": "",
        "backstory": ""
    },
    "quality": {
        "role": "",
        "goal": "",
        "backstory": ""
    }
}

# TODO: Create agents and run a support query through them
customer_query = "I was charged twice for my subscription"

# Workflow:
# 1. Classifier categorizes the issue
# 2. Specialist handles it
# 3. Quality reviews the response`,

  solutionCode: `from openai import OpenAI

client = OpenAI()

ROLES = {
    "classifier": {
        "role": "Support Ticket Classifier",
        "goal": "Accurately categorize customer issues",
        "backstory": "Expert at understanding customer intent with 5 years in support ops"
    },
    "specialist": {
        "role": "Billing Support Specialist",
        "goal": "Resolve billing issues efficiently and empathetically",
        "backstory": "Experienced billing expert who has handled 10,000+ tickets"
    },
    "quality": {
        "role": "Quality Assurance Reviewer",
        "goal": "Ensure responses are helpful, accurate, and professional",
        "backstory": "Former support lead focused on customer satisfaction"
    }
}

def create_agent(role_key):
    role = ROLES[role_key]
    return {
        **role,
        "system_prompt": f"You are a {role['role']}. {role['goal']}. {role['backstory']}"
    }

def agent_work(agent, task, context=""):
    messages = [{"role": "system", "content": agent["system_prompt"]}]
    if context:
        messages.append({"role": "user", "content": f"Context: {context}"})
    messages.append({"role": "user", "content": task})

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages
    )
    return response.choices[0].message.content

# Create team
classifier = create_agent("classifier")
specialist = create_agent("specialist")
quality = create_agent("quality")

# Customer query
query = "I was charged twice for my subscription"

print("=== Support Ticket Flow ===\\n")

# Step 1: Classify
category = agent_work(classifier, f"Classify this ticket: {query}")
print(f"1. Classification:\\n{category}\\n")

# Step 2: Handle
response = agent_work(specialist, f"Handle this billing issue: {query}", category)
print(f"2. Specialist Response:\\n{response}\\n")

# Step 3: Review
review = agent_work(quality, f"Review this response for quality:\\n{response}")
print(f"3. Quality Review:\\n{review}")`,

  hints: [
    "Classifier determines the type of issue",
    "Specialist handles the specific category",
    "Quality ensures the response is good",
    "Each role has distinct responsibilities",
  ],
};
