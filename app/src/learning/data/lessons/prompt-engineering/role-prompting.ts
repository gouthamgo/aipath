import type { LessonContent } from '../types';

export const rolePrompting: LessonContent = {
  slug: "role-prompting",
  problemContent: `# Role Prompting

Give the AI a persona to unlock specialized knowledge!

## Role Types & Use Cases

| Role Type | Example | Best For |
|-----------|---------|----------|
| Expert | "Senior Google engineer" | Technical depth |
| Teacher | "Patient coding tutor" | Beginner explanations |
| Creative | "Award-winning novelist" | Writing tasks |
| Analyst | "McKinsey consultant" | Business insights |

## Why Roles Matter

Different roles access different "knowledge":

\`\`\`python
# Generic
"Explain machine learning"

# With role - more depth
"You are a Stanford ML professor.
Explain machine learning to a PhD student."
\`\`\`

## Role Prompting Formula

\`\`\`
You are a [ROLE] with [EXPERIENCE/EXPERTISE].
Your task is to [ACTION] for [AUDIENCE].
\`\`\`

## Your Task

1. Create a "teacher" role prompt to explain APIs to a beginner
2. Create an "expert" role prompt for database optimization
3. Create a "creative" role prompt for marketing copy
4. Compare how the same question gets different answers with each role`,

  solutionContent: `# Solution: Role Prompting

\`\`\`python
from openai import OpenAI

client = OpenAI()

def ask_expert(role, task, context=""):
    prompt = f\"\"\"
{role}

{task}

{context}
\"\"\"
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content

# 1. Explain APIs for beginners
beginner_response = ask_expert(
    role="You are a friendly coding teacher who specializes in teaching absolute beginners. You use simple analogies and avoid jargon.",
    task="Explain what an API is and how to use one.",
    context="The student has never programmed before but understands how to use apps on their phone."
)

# 2. Optimize database query for expert
expert_response = ask_expert(
    role="You are a senior database architect with 20 years of PostgreSQL experience, specializing in query optimization for high-traffic systems.",
    task="Optimize this query for a table with 100M rows: SELECT * FROM orders WHERE status = 'pending' ORDER BY created_at DESC LIMIT 100",
    context="Current query takes 15 seconds. We have indexes on id and created_at."
)

# 3. Marketing copy
marketing_response = ask_expert(
    role="You are a conversion-focused copywriter who has written for Apple, Nike, and Tesla. Your copy is punchy, benefit-driven, and creates urgency.",
    task="Write a landing page headline and subheadline for a new AI writing tool.",
    context="The tool helps busy professionals write emails 10x faster."
)

print("=== Beginner Explanation ===")
print(beginner_response)
\`\`\``,

  explanationContent: `# Deep Dive: Effective Role Design

## Role Components

1. **Title/Position**: What they are
2. **Experience**: How long/where
3. **Specialization**: Specific expertise
4. **Personality**: How they communicate

\`\`\`python
role = \"\"\"
You are Dr. Sarah Chen, a Stanford AI researcher (Position)
with 15 years in NLP and published 50+ papers (Experience)
specializing in prompt engineering and LLM behavior (Specialization)
known for making complex topics accessible with humor (Personality)
\"\"\"
\`\`\`

## Multi-Role Conversations

\`\`\`python
def debate(topic, role1, role2):
    messages = [
        {"role": "system", "content": f"Two experts debate: {role1} vs {role2}"},
        {"role": "user", "content": f"Debate topic: {topic}. {role1} goes first."}
    ]
    # Continue with back and forth
\`\`\`

## Role Switching

\`\`\`python
def analyze_from_perspectives(problem):
    perspectives = [
        "As a software engineer, I see...",
        "As a business analyst, I notice...",
        "As a user experience designer, I observe..."
    ]
    return "\\n".join([get_perspective(p, problem) for p in perspectives])
\`\`\``,

  realworldContent: `# Real-World Applications

## 1. Multi-Expert Analysis
\`\`\`python
def get_analysis(topic):
    experts = [
        ("Economist", "Analyze the economic implications"),
        ("Ethicist", "Consider the ethical dimensions"),
        ("Technologist", "Evaluate technical feasibility")
    ]

    analyses = []
    for title, task in experts:
        role = f"You are a {title} at a top university."
        analyses.append(ask_expert(role, f"{task} of: {topic}"))

    return analyses
\`\`\`

## 2. Audience-Specific Explanations
\`\`\`python
audiences = {
    "child": "You explain like a fun elementary school teacher",
    "student": "You're a patient college professor",
    "expert": "You're a peer researcher in the field"
}

def explain_for(topic, audience):
    role = audiences[audience]
    return ask_expert(role, f"Explain {topic}")
\`\`\``,

  mistakesContent: `# Common Mistakes

## 1. Vague Roles
\`\`\`python
# Bad - too generic
"You are an expert."

# Good - specific
"You are a senior backend engineer at Netflix specializing in microservices."
\`\`\`

## 2. Conflicting Role & Task
\`\`\`python
# Confusing - role doesn't match task
"You are a pediatrician. Write marketing copy for a car."

# Better - aligned
"You are an automotive marketing expert. Write copy for a family car."
\`\`\`

## 3. Overcomplicating
\`\`\`python
# Too much - confuses the model
"You are Dr. James who graduated from MIT in 1995 and worked at 5 companies..."

# Just right
"You are a senior data scientist with ML expertise."
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: How does role prompting improve outputs?
**Answer:** It activates relevant knowledge patterns, sets appropriate vocabulary and depth, and provides consistent persona for the response.

## Q2: When to use role prompting?
**Answer:** When you need specialized expertise, specific communication style, or audience-appropriate explanations.

## Q3: Can you combine roles?
**Answer:** Yes! "You are a data scientist who can explain concepts to business executives" combines technical knowledge with accessible communication.`,

  starterCode: `from openai import OpenAI

client = OpenAI()

def ask_with_role(role, question):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": role},
            {"role": "user", "content": question}
        ]
    )
    return response.choices[0].message.content

# TODO: Create 3 different role prompts
teacher_role = ""
engineer_role = ""
marketer_role = ""

# Test each role on the same question
question = "What makes a good website?"

print("=== Teacher ===")
print(ask_with_role(teacher_role, question))`,

  solutionCode: `from openai import OpenAI

client = OpenAI()

def ask_with_role(role, question):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": role},
            {"role": "user", "content": question}
        ]
    )
    return response.choices[0].message.content

# Different role prompts
teacher_role = "You are a patient web development teacher who explains concepts using simple analogies for absolute beginners."

engineer_role = "You are a senior frontend engineer at Google with 10 years of experience building high-performance web applications."

marketer_role = "You are a conversion rate optimization expert who has helped 100+ companies improve their website performance."

# Test each role
question = "What makes a good website?"

print("=== Teacher ===")
print(ask_with_role(teacher_role, question))
print("\\n=== Engineer ===")
print(ask_with_role(engineer_role, question))
print("\\n=== Marketer ===")
print(ask_with_role(marketer_role, question))`,

  hints: [
    "Include job title and expertise level",
    "Add years of experience or notable achievements",
    "Specify communication style for target audience",
    "Same question, different roles = different answers"
  ]
};
