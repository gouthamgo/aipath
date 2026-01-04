import type { LessonContent } from '../types';

export const projectPromptLib: LessonContent = {
  slug: "project-prompt-lib",
  problemContent: `# Project: Prompt Library

Build a reusable prompt template library!

## Library Features

| Feature | Method | Purpose |
|---------|--------|---------|
| Add | \`lib.add(name, template)\` | Store new prompt |
| Get | \`lib.get(name)\` | Retrieve template |
| Run | \`lib.run(name, **vars)\` | Execute with variables |
| Update | \`lib.update(name, template)\` | New version |
| List | \`lib.list_prompts()\` | Show all prompts |

## Usage Example

\`\`\`python
lib = PromptLibrary()

# Add prompts
lib.add("summarize", "Summarize in {length} sentences: {text}")

# Use prompts
result = lib.run("summarize", text=article, length=3)

# Version management
lib.update("summarize", new_template, notes="Added format")
\`\`\`

## Your Task

1. Create a PromptLibrary class with add/get/run methods
2. Support template variables with {variable} syntax
3. Track version history for each prompt
4. Add validation for missing variables`,

  solutionContent: `# Solution: Prompt Library

\`\`\`python
from openai import OpenAI
from datetime import datetime
import json
import re

class PromptLibrary:
    def __init__(self, filepath="prompts.json"):
        self.client = OpenAI()
        self.filepath = filepath
        self.prompts = self._load()

    def _load(self):
        try:
            with open(self.filepath) as f:
                return json.load(f)
        except FileNotFoundError:
            return {}

    def _save(self):
        with open(self.filepath, 'w') as f:
            json.dump(self.prompts, f, indent=2)

    def add(self, name, template, notes="Initial version"):
        if name in self.prompts:
            raise ValueError(f"Prompt '{name}' exists. Use update() instead.")

        self.prompts[name] = {
            "current": template,
            "versions": [{
                "version": 1,
                "template": template,
                "notes": notes,
                "created": datetime.now().isoformat()
            }]
        }
        self._save()
        print(f"Added prompt: {name}")

    def update(self, name, template, notes=""):
        if name not in self.prompts:
            raise ValueError(f"Prompt '{name}' not found")

        version = len(self.prompts[name]["versions"]) + 1
        self.prompts[name]["versions"].append({
            "version": version,
            "template": template,
            "notes": notes,
            "created": datetime.now().isoformat()
        })
        self.prompts[name]["current"] = template
        self._save()
        print(f"Updated {name} to v{version}")

    def get(self, name, version=None):
        if name not in self.prompts:
            raise ValueError(f"Prompt '{name}' not found")

        if version:
            for v in self.prompts[name]["versions"]:
                if v["version"] == version:
                    return v["template"]
            raise ValueError(f"Version {version} not found")

        return self.prompts[name]["current"]

    def run(self, name, model="gpt-3.5-turbo", **kwargs):
        template = self.get(name)

        # Check required variables
        required = set(re.findall(r'{(\\w+)}', template))
        provided = set(kwargs.keys())
        missing = required - provided

        if missing:
            raise ValueError(f"Missing variables: {missing}")

        prompt = template.format(**kwargs)

        response = self.client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content

    def list_prompts(self):
        for name, data in self.prompts.items():
            versions = len(data["versions"])
            print(f"- {name} (v{versions})")

    def show_history(self, name):
        if name not in self.prompts:
            raise ValueError(f"Prompt '{name}' not found")

        print(f"History for '{name}':")
        for v in self.prompts[name]["versions"]:
            print(f"  v{v['version']}: {v['notes']} ({v['created'][:10]})")

# Usage
lib = PromptLibrary()

# Add prompts
lib.add("summarize", \"\"\"
Summarize in {num_sentences} sentences:
{text}

Format: bullet points
\"\"\", notes="Initial summarizer")

lib.add("translate", \"\"\"
Translate to {language}:
{text}
\"\"\", notes="Basic translator")

# Use prompts
result = lib.run("summarize",
    text="AI is transforming how we work and live.",
    num_sentences="3"
)
print(result)

# Show all
lib.list_prompts()
\`\`\``,

  explanationContent: `# Deep Dive: Production Prompt Libraries

## Database Storage

\`\`\`python
# SQLite for local, PostgreSQL for production
import sqlite3

class DBPromptLibrary:
    def __init__(self, db_path="prompts.db"):
        self.conn = sqlite3.connect(db_path)
        self._init_db()

    def _init_db(self):
        self.conn.execute(\"\"\"
            CREATE TABLE IF NOT EXISTS prompts (
                id INTEGER PRIMARY KEY,
                name TEXT UNIQUE,
                template TEXT,
                version INTEGER,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        \"\"\")
\`\`\`

## A/B Testing Support

\`\`\`python
def run_ab_test(self, name, variants, test_input, n=10):
    results = {v: [] for v in variants}

    for variant in variants:
        template = self.get(name, version=variant)
        for _ in range(n):
            output = self._run_template(template, **test_input)
            score = self._score_output(output)
            results[variant].append(score)

    return {v: sum(s)/len(s) for v, s in results.items()}
\`\`\`

## Prompt Metadata

\`\`\`python
prompt_schema = {
    "name": "summarize",
    "template": "...",
    "metadata": {
        "author": "team-ml",
        "tags": ["summarization", "content"],
        "model": "gpt-4",
        "temperature": 0.3,
        "max_tokens": 500
    }
}
\`\`\``,

  realworldContent: `# Real-World Applications

## 1. Team Prompt Sharing
\`\`\`python
class TeamPromptLibrary(PromptLibrary):
    def __init__(self, team_id):
        self.team_id = team_id
        self.storage = CloudStorage(f"teams/{team_id}/prompts")

    def share(self, prompt_name, user_id):
        self.storage.grant_access(prompt_name, user_id)
\`\`\`

## 2. Analytics Integration
\`\`\`python
def run_with_tracking(self, name, **kwargs):
    start = time.time()
    result = self.run(name, **kwargs)
    duration = time.time() - start

    self.analytics.track({
        "prompt": name,
        "duration": duration,
        "tokens": count_tokens(result),
        "success": True
    })

    return result
\`\`\``,

  mistakesContent: `# Common Mistakes

## 1. No Validation
\`\`\`python
# Bad - crashes with missing vars
prompt.format(**kwargs)

# Good - validate first
required = extract_vars(prompt)
missing = required - set(kwargs.keys())
if missing:
    raise ValueError(f"Missing: {missing}")
\`\`\`

## 2. No Version History
\`\`\`python
# Bad - overwrites without history
self.prompts[name] = new_template

# Good - keep versions
self.prompts[name]["versions"].append(...)
self.prompts[name]["current"] = new_template
\`\`\`

## 3. Hardcoded Models
\`\`\`python
# Bad - can't change model
model="gpt-4"

# Good - configurable
model=kwargs.get("model", self.default_model)
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: Why version control prompts?
**Answer:** Track changes, rollback if needed, A/B test versions, audit trail for compliance, understand what works.

## Q2: How would you deploy this at scale?
**Answer:** Database storage, caching layer, analytics, access control, API endpoint, CI/CD for prompt changes.

## Q3: How to handle prompt security?
**Answer:** Don't expose prompts to users, sanitize inputs, rate limit, monitor for injection attempts, access control.`,

  starterCode: `from openai import OpenAI
import json
import re

class PromptLibrary:
    def __init__(self):
        self.client = OpenAI()
        self.prompts = {}

    def add(self, name, template, notes=""):
        # TODO: Add prompt with version tracking
        pass

    def get(self, name):
        # TODO: Return current template
        pass

    def run(self, name, **kwargs):
        # TODO: Get template, fill variables, call API
        pass

    def list_prompts(self):
        # TODO: Show all prompts
        pass

# Test
lib = PromptLibrary()
lib.add("greet", "Say hello to {name} in {language}")
print(lib.run("greet", name="Alice", language="French"))`,

  solutionCode: `from openai import OpenAI
import json
import re
from datetime import datetime

class PromptLibrary:
    def __init__(self):
        self.client = OpenAI()
        self.prompts = {}

    def add(self, name, template, notes="Initial"):
        self.prompts[name] = {
            "current": template,
            "versions": [{
                "version": 1,
                "template": template,
                "notes": notes,
                "created": datetime.now().isoformat()
            }]
        }
        print(f"Added: {name}")

    def get(self, name):
        if name not in self.prompts:
            raise ValueError(f"Prompt '{name}' not found")
        return self.prompts[name]["current"]

    def run(self, name, **kwargs):
        template = self.get(name)

        # Validate variables
        required = set(re.findall(r'{(\\w+)}', template))
        missing = required - set(kwargs.keys())
        if missing:
            raise ValueError(f"Missing: {missing}")

        prompt = template.format(**kwargs)
        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content

    def list_prompts(self):
        for name in self.prompts:
            v = len(self.prompts[name]["versions"])
            print(f"- {name} (v{v})")

# Test
lib = PromptLibrary()
lib.add("greet", "Say hello to {name} in {language}")
lib.list_prompts()
print(lib.run("greet", name="Alice", language="French"))`,

  hints: [
    "Store both current template and version history",
    "Use regex to find {variable} placeholders",
    "Validate all required variables are provided",
    "Use .format(**kwargs) to fill template"
  ]
};
