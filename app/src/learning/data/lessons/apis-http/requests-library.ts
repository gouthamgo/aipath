import type { LessonContent } from '../types';

export const requestsLibrary: LessonContent = {
  slug: "requests-library",
  problemContent: `# Python Requests Library

The easiest way to make HTTP requests in Python!

## Installation

\`\`\`bash
pip install requests
\`\`\`

## Making a GET Request

\`\`\`python
import requests

response = requests.get('https://api.example.com/users')
print(response.status_code)  # 200
print(response.json())       # The data!
\`\`\`

## Making a POST Request

\`\`\`python
data = {'name': 'Alice', 'email': 'alice@test.com'}
response = requests.post('https://api.example.com/users', json=data)
\`\`\`

## Key Response Properties

| Property | What it gives you |
|----------|------------------|
| \`.status_code\` | 200, 404, etc. |
| \`.json()\` | Data as a Python dict |
| \`.text\` | Raw text response |

## Your Task

1. Make a GET request to: \`https://jsonplaceholder.typicode.com/posts/1\`
2. Print the status code
3. Print the title from the response`,

  solutionContent: `# Solution: Requests Library

\`\`\`python
import requests

# Step 1: Make the request
url = 'https://jsonplaceholder.typicode.com/posts/1'
response = requests.get(url)

# Step 2: Print status code
print("Status:", response.status_code)

# Step 3: Get data and print title
data = response.json()
print("Title:", data['title'])
\`\`\`

## Output
\`\`\`
Status: 200
Title: sunt aut facere repellat provident occaecati excepturi optio
\`\`\`

## What Happened?
1. We asked the server for post #1
2. Server said "200 OK" (success!)
3. We got JSON data with the post's title`,

  explanationContent: `# Deep Dive: Requests

## Adding Headers

\`\`\`python
headers = {'Authorization': 'Bearer my-token'}
response = requests.get(url, headers=headers)
\`\`\`

## Query Parameters

\`\`\`python
# Instead of building URL manually...
params = {'page': 1, 'limit': 10}
response = requests.get(url, params=params)
# Becomes: url?page=1&limit=10
\`\`\`

## Checking for Errors

\`\`\`python
response = requests.get(url)

if response.status_code == 200:
    data = response.json()
else:
    print("Error:", response.status_code)
\`\`\``,

  realworldContent: `# Real-World Examples

## Weather API
\`\`\`python
url = 'https://api.weather.com/current'
params = {'city': 'London'}
response = requests.get(url, params=params)
weather = response.json()
print(f"Temperature: {weather['temp']}°C")
\`\`\`

## GitHub API
\`\`\`python
url = 'https://api.github.com/users/octocat'
response = requests.get(url)
user = response.json()
print(f"Repos: {user['public_repos']}")
\`\`\``,

  mistakesContent: `# Common Mistakes

## 1. Not Checking Status
\`\`\`python
# Bad - might crash if request failed
data = requests.get(url).json()

# Good - check first
response = requests.get(url)
if response.status_code == 200:
    data = response.json()
\`\`\`

## 2. Forgetting .json()
\`\`\`python
# Wrong - this is the Response object
data = requests.get(url)

# Right - call .json() to get data
data = requests.get(url).json()
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: How to add a timeout?
**Answer:** \`requests.get(url, timeout=10)\` - waits max 10 seconds

## Q2: json= vs data= in POST?
**Answer:** \`json=\` sends JSON (most APIs). \`data=\` sends form data.`,

  starterCode: `import requests

# 1. Make a GET request to this URL
url = 'https://jsonplaceholder.typicode.com/posts/1'
response =

# 2. Print the status code
print("Status:", )

# 3. Get the JSON data and print the title
data =
print("Title:", )`,

  solutionCode: `import requests

# 1. Make a GET request to this URL
url = 'https://jsonplaceholder.typicode.com/posts/1'
response = requests.get(url)

# 2. Print the status code
print("Status:", response.status_code)

# 3. Get the JSON data and print the title
data = response.json()
print("Title:", data['title'])`,

  hints: [
    "Use requests.get(url) to make the request",
    "Status is in response.status_code",
    "Call response.json() to get the data",
    "Access the title with data['title']"
  ]
};
