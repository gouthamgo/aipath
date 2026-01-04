import type { LessonContent } from '../types';

export const projectAgentTeam: LessonContent = {
  slug: "project-agent-team",
  problemContent: `# Project: Build an Agent Team

Create a complete multi-agent system for content creation!

## Requirements

Build a content team with:
1. **Content Strategist**: Plans topics and outlines
2. **Writer**: Creates the content
3. **Editor**: Reviews and improves
4. **Publisher**: Formats for distribution

## Workflow

\`\`\`
User Topic
    │
    ▼
┌─────────────┐
│ Strategist  │ → Creates outline
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Writer    │ → Writes draft
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Editor    │ → Reviews/improves
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Publisher  │ → Formats output
└─────────────┘
\`\`\`

## Your Task

Implement the complete team.`,

  solutionContent: `# Solution: Content Team

\`\`\`python
from openai import OpenAI
from dataclasses import dataclass
from typing import Optional

client = OpenAI()

@dataclass
class ContentPiece:
    topic: str
    outline: Optional[str] = None
    draft: Optional[str] = None
    edited: Optional[str] = None
    final: Optional[str] = None

class ContentAgent:
    def __init__(self, name: str, role: str, instructions: str):
        self.name = name
        self.role = role
        self.instructions = instructions

    def process(self, task: str, context: str = "") -> str:
        messages = [
            {
                "role": "system",
                "content": f"You are {self.name}, a {self.role}. {self.instructions}"
            }
        ]

        if context:
            messages.append({
                "role": "user",
                "content": f"Previous work:\\n{context}"
            })

        messages.append({"role": "user", "content": task})

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages
        )
        return response.choices[0].message.content

class ContentTeam:
    def __init__(self):
        self.strategist = ContentAgent(
            "Sarah the Strategist",
            "Content Strategist",
            """You plan content strategy. Create clear, structured outlines
            with key points, target audience, and tone guidance."""
        )

        self.writer = ContentAgent(
            "William the Writer",
            "Content Writer",
            """You write engaging content. Follow the outline provided.
            Use clear language and include examples."""
        )

        self.editor = ContentAgent(
            "Emma the Editor",
            "Editor",
            """You improve content quality. Fix errors, improve flow,
            enhance clarity. Preserve the author's voice."""
        )

        self.publisher = ContentAgent(
            "Peter the Publisher",
            "Publisher",
            """You format content for publication. Add formatting,
            create a catchy title, and add metadata."""
        )

    def create_content(self, topic: str, verbose: bool = True) -> ContentPiece:
        content = ContentPiece(topic=topic)

        # Step 1: Strategy
        if verbose:
            print("📋 Strategist creating outline...")
        content.outline = self.strategist.process(
            f"Create a content outline for: {topic}"
        )

        # Step 2: Write
        if verbose:
            print("✍️ Writer creating draft...")
        content.draft = self.writer.process(
            "Write the content based on this outline",
            content.outline
        )

        # Step 3: Edit
        if verbose:
            print("🔍 Editor reviewing...")
        content.edited = self.editor.process(
            "Edit and improve this content",
            content.draft
        )

        # Step 4: Publish
        if verbose:
            print("📰 Publisher formatting...")
        content.final = self.publisher.process(
            "Format this for blog publication",
            content.edited
        )

        return content

# Usage
team = ContentTeam()
result = team.create_content("The Future of AI in Healthcare")

print("\\n" + "="*50)
print("FINAL CONTENT")
print("="*50)
print(result.final)
\`\`\``,

  explanationContent: `# Project Architecture

## Agent Design

Each agent has:
- **Name**: Personality
- **Role**: Job function
- **Instructions**: How to behave

\`\`\`python
ContentAgent(
    name="Sarah",           # Identity
    role="Strategist",      # Function
    instructions="Plan..."  # Behavior
)
\`\`\`

## Data Flow

\`\`\`
ContentPiece
├── topic: str      (input)
├── outline: str    (strategist output)
├── draft: str      (writer output)
├── edited: str     (editor output)
└── final: str      (publisher output)
\`\`\`

## Why This Works

1. **Clear handoffs**: Each step builds on previous
2. **Specialized focus**: Each agent does one thing well
3. **Quality layers**: Multiple review points
4. **Traceable**: Can inspect any stage`,

  realworldContent: `# Extending the Team

## Add More Agents

\`\`\`python
# SEO Expert
seo = ContentAgent(
    "Sam the SEO Expert",
    "SEO Specialist",
    "Optimize content for search engines"
)

# Social Media Manager
social = ContentAgent(
    "Sophia the Social Manager",
    "Social Media Manager",
    "Create social media posts from content"
)
\`\`\`

## Add Quality Loops

\`\`\`python
def create_with_review(self, topic):
    # ... initial creation ...

    # Quality check
    quality = self.reviewer.process(
        "Rate this content 1-10",
        content.edited
    )

    if quality < 7:
        # Send back for revision
        content.edited = self.editor.process(
            "Improve based on feedback: " + feedback,
            content.draft
        )
\`\`\``,

  mistakesContent: `# Common Project Mistakes

## 1. No Context Passing

\`\`\`python
# Wrong
outline = strategist.process(topic)
draft = writer.process(topic)  # Ignores outline!

# Right
outline = strategist.process(topic)
draft = writer.process(topic, context=outline)
\`\`\`

## 2. Too Many Agents

\`\`\`python
# Wrong - too granular
team = [
    "Topic Researcher",
    "Keyword Analyst",
    "Outline Creator",
    "Introduction Writer",
    "Body Writer",
    "Conclusion Writer",
    ...  # 15 more agents
]

# Right - reasonable size
team = [Strategist, Writer, Editor, Publisher]
\`\`\`

## 3. No Error Handling

\`\`\`python
# Wrong
content.draft = writer.process(...)

# Right
try:
    content.draft = writer.process(...)
except Exception as e:
    print(f"Writer failed: {e}")
    content.draft = fallback_draft()
\`\`\``,

  interviewContent: `# Project Interview Questions

## Q1: How did you design the agent roles?

**Answer:** I used the content creation pipeline as a model:
1. **Strategist**: Planning (what to write)
2. **Writer**: Creation (first draft)
3. **Editor**: Quality (improvements)
4. **Publisher**: Distribution (formatting)

Each role has clear input/output and doesn't overlap.

## Q2: How do agents share context?

**Answer:** Each agent receives the previous stage's output:
\`\`\`python
writer.process(task, context=outline)
editor.process(task, context=draft)
\`\`\`

## Q3: How would you add feedback loops?

**Answer:** Add a reviewer agent that can send work back:
\`\`\`python
if quality_score < threshold:
    return to_previous_stage()
\`\`\``,

  starterCode: `from openai import OpenAI

client = OpenAI()

# TODO: Create ContentAgent class
class ContentAgent:
    def __init__(self, name, role, instructions):
        pass

    def process(self, task, context=""):
        # Call OpenAI API
        pass

# TODO: Create ContentTeam class
class ContentTeam:
    def __init__(self):
        # Create 4 agents: strategist, writer, editor, publisher
        pass

    def create_content(self, topic):
        # Run the pipeline:
        # 1. Strategist creates outline
        # 2. Writer creates draft from outline
        # 3. Editor improves draft
        # 4. Publisher formats final
        pass

# Test
team = ContentTeam()
result = team.create_content("Benefits of Remote Work")
print(result)`,

  solutionCode: `from openai import OpenAI

client = OpenAI()

class ContentAgent:
    def __init__(self, name, role, instructions):
        self.name = name
        self.role = role
        self.instructions = instructions

    def process(self, task, context=""):
        messages = [
            {"role": "system", "content": f"You are {self.name}, a {self.role}. {self.instructions}"}
        ]
        if context:
            messages.append({"role": "user", "content": f"Context:\\n{context}"})
        messages.append({"role": "user", "content": task})

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages
        )
        return response.choices[0].message.content

class ContentTeam:
    def __init__(self):
        self.strategist = ContentAgent(
            "Strategist",
            "Content Strategist",
            "Create clear content outlines with key points and structure."
        )
        self.writer = ContentAgent(
            "Writer",
            "Content Writer",
            "Write engaging content following the provided outline."
        )
        self.editor = ContentAgent(
            "Editor",
            "Editor",
            "Improve content clarity, fix errors, enhance flow."
        )
        self.publisher = ContentAgent(
            "Publisher",
            "Publisher",
            "Format content for publication with proper structure."
        )

    def create_content(self, topic):
        print(f"Creating content about: {topic}\\n")

        # Step 1: Strategy
        print("1. Strategist planning...")
        outline = self.strategist.process(f"Create outline for: {topic}")

        # Step 2: Write
        print("2. Writer drafting...")
        draft = self.writer.process("Write based on outline", outline)

        # Step 3: Edit
        print("3. Editor improving...")
        edited = self.editor.process("Edit and improve", draft)

        # Step 4: Publish
        print("4. Publisher formatting...")
        final = self.publisher.process("Format for blog", edited)

        return {
            "topic": topic,
            "outline": outline,
            "draft": draft,
            "edited": edited,
            "final": final
        }

# Test
team = ContentTeam()
result = team.create_content("Benefits of Remote Work")

print("\\n" + "="*40)
print("FINAL CONTENT")
print("="*40)
print(result["final"])`,

  hints: [
    "ContentAgent needs name, role, instructions in __init__",
    "process() builds messages and calls OpenAI API",
    "Pass previous output as context to next agent",
    "create_content runs 4 steps sequentially",
  ],
};
