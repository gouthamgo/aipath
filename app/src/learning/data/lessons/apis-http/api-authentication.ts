import type { LessonContent } from '../types';

export const apiAuthentication: LessonContent = {
  slug: "api-authentication",
  problemContent: `# API Authentication

Most APIs need you to prove who you are!

## Why Authentication?

- Identifies you
- Controls what you can access
- Tracks your usage

## Common Methods

### 1. API Key in Header
\`\`\`python
headers = {'X-API-Key': 'your-key-here'}
response = requests.get(url, headers=headers)
\`\`\`

### 2. Bearer Token (Most Common)
\`\`\`python
headers = {'Authorization': 'Bearer your-token'}
response = requests.get(url, headers=headers)
\`\`\`

### 3. Basic Auth (Username/Password)
\`\`\`python
response = requests.get(url, auth=('username', 'password'))
\`\`\`

## IMPORTANT: Keep Keys Secret!

\`\`\`python
import os

# Good - from environment variable
API_KEY = os.getenv('API_KEY')

# Bad - hardcoded (don't do this!)
API_KEY = 'sk-abc123'  # Anyone can see this!
\`\`\`

## Your Task

Make an authenticated request using a Bearer token.`,

  solutionContent: `# Solution: API Authentication

\`\`\`python
import requests
import os

# Get API key from environment (or use a test value)
API_KEY = os.getenv('API_KEY', 'test-token-123')

# Create headers with Bearer token
headers = {
    'Authorization': f'Bearer {API_KEY}'
}

# Make authenticated request
url = 'https://httpbin.org/bearer'
response = requests.get(url, headers=headers)

# Check result
if response.status_code == 200:
    print("Authenticated!")
    print(response.json())
else:
    print("Auth failed:", response.status_code)
\`\`\`

## Key Points
- \`Authorization: Bearer TOKEN\` is the standard format
- Always use environment variables for real keys
- httpbin.org is a free test API`,

  explanationContent: `# Deep Dive: Auth Methods

## Environment Variables

\`\`\`bash
# In terminal:
export API_KEY="your-secret-key"
\`\`\`

\`\`\`python
# In Python:
import os
key = os.getenv('API_KEY')
\`\`\`

## Using .env Files

\`\`\`python
# Install: pip install python-dotenv
from dotenv import load_dotenv
load_dotenv()

API_KEY = os.getenv('API_KEY')
\`\`\`

## .env file:
\`\`\`
API_KEY=your-secret-key
\`\`\``,

  realworldContent: `# Real-World Examples

## OpenAI API
\`\`\`python
headers = {'Authorization': f'Bearer {OPENAI_KEY}'}
response = requests.post(
    'https://api.openai.com/v1/chat/completions',
    headers=headers,
    json={'model': 'gpt-4', 'messages': [...]}
)
\`\`\`

## GitHub API
\`\`\`python
headers = {'Authorization': f'token {GITHUB_TOKEN}'}
response = requests.get(
    'https://api.github.com/user',
    headers=headers
)
\`\`\``,

  mistakesContent: `# Common Mistakes

## 1. Forgetting "Bearer "
\`\`\`python
# Wrong - missing "Bearer "
headers = {'Authorization': token}

# Right
headers = {'Authorization': f'Bearer {token}'}
\`\`\`

## 2. Hardcoding Secrets
\`\`\`python
# Bad - in your code!
API_KEY = 'sk-secret123'

# Good - from environment
API_KEY = os.getenv('API_KEY')
\`\`\`

## 3. Committing .env Files
Add to .gitignore:
\`\`\`
.env
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: Where to store API keys?
**Answer:** Environment variables or secret managers. Never in code or git.

## Q2: Bearer vs API Key?
**Answer:** Bearer tokens are typically short-lived and can be refreshed. API keys are static and simpler.`,

  starterCode: `import requests
import os

# API key (in real app, use os.getenv)
API_KEY = "test-token-123"

# Create headers with Bearer token
headers = {

}

# Make request
url = 'https://httpbin.org/bearer'
response = requests.get(url, headers=headers)

# Check result
if response.status_code == 200:
    print("Success!")
    print(response.json())
else:
    print("Failed:", response.status_code)`,

  solutionCode: `import requests
import os

# API key (in real app, use os.getenv)
API_KEY = "test-token-123"

# Create headers with Bearer token
headers = {
    'Authorization': f'Bearer {API_KEY}'
}

# Make request
url = 'https://httpbin.org/bearer'
response = requests.get(url, headers=headers)

# Check result
if response.status_code == 200:
    print("Success!")
    print(response.json())
else:
    print("Failed:", response.status_code)`,

  hints: [
    "The header key is 'Authorization'",
    "The value format is: 'Bearer YOUR_TOKEN'",
    "Use f-string: f'Bearer {API_KEY}'",
    "httpbin.org/bearer tests Bearer auth"
  ]
};
