import type { LessonContent } from '../types';

export const jsonHandling: LessonContent = {
  slug: "json-handling",
  problemContent: `# JSON Handling

JSON is how data travels between computers. Let's learn to work with it!

## What is JSON?

JSON looks like Python dictionaries:
\`\`\`json
{
    "name": "Alice",
    "age": 25,
    "hobbies": ["reading", "coding"]
}
\`\`\`

## Python's json Module

\`\`\`python
import json

# Python dict to JSON string
data = {'name': 'Alice', 'age': 25}
json_string = json.dumps(data)
print(json_string)  # '{"name": "Alice", "age": 25}'

# JSON string to Python dict
json_string = '{"name": "Bob", "age": 30}'
data = json.loads(json_string)
print(data['name'])  # 'Bob'
\`\`\`

## The Easy Way (with requests)

\`\`\`python
# API responses automatically convert!
response = requests.get(url)
data = response.json()  # Already a Python dict!
\`\`\`

## Your Task

Parse this JSON and print each person's name:
\`\`\`json
[
  {"name": "Alice", "age": 25},
  {"name": "Bob", "age": 30}
]
\`\`\``,

  solutionContent: `# Solution: JSON Handling

\`\`\`python
import json

# The JSON string
json_string = '''
[
  {"name": "Alice", "age": 25},
  {"name": "Bob", "age": 30}
]
'''

# Parse it
people = json.loads(json_string)

# Print each name
for person in people:
    print(person['name'])
\`\`\`

## Output
\`\`\`
Alice
Bob
\`\`\`

## Key Points
- \`json.loads()\` = Load String (parse JSON)
- Result is a Python list of dicts
- Access values like normal: \`person['name']\``,

  explanationContent: `# Deep Dive: JSON

## loads vs load
\`\`\`python
# loads = from String
json.loads('{"a": 1}')

# load = from File
with open('data.json') as f:
    json.load(f)
\`\`\`

## dumps vs dump
\`\`\`python
# dumps = to String
json.dumps({'a': 1})

# dump = to File
with open('data.json', 'w') as f:
    json.dump({'a': 1}, f)
\`\`\`

## Pretty Printing
\`\`\`python
print(json.dumps(data, indent=2))
\`\`\``,

  realworldContent: `# Real-World Examples

## Config Files
\`\`\`python
# config.json: {"debug": true, "port": 3000}
with open('config.json') as f:
    config = json.load(f)
print(config['port'])  # 3000
\`\`\`

## API Responses
\`\`\`python
response = requests.get('https://api.github.com/users/octocat')
user = response.json()
print(user['name'])  # The Octocat
\`\`\``,

  mistakesContent: `# Common Mistakes

## 1. loads vs load
\`\`\`python
# loads = string
json.loads('{"a": 1}')

# load = file (not string!)
json.load(file_object)
\`\`\`

## 2. Single vs Double Quotes
\`\`\`python
# JSON needs double quotes!
# Wrong
'{"name": 'Alice'}'

# Right
'{"name": "Alice"}'
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: JSON vs Python dict?
**Answer:** JSON is a text format (string). Python dict is an object in memory. Use json.loads() to convert JSON to dict.

## Q2: How to handle invalid JSON?
**Answer:** Use try/except:
\`\`\`python
try:
    data = json.loads(text)
except json.JSONDecodeError:
    print("Invalid JSON!")
\`\`\``,

  starterCode: `import json

# JSON string to parse
json_string = '''
[
  {"name": "Alice", "age": 25},
  {"name": "Bob", "age": 30}
]
'''

# 1. Parse the JSON
people =

# 2. Print each person's name
for person in people:
    print()`,

  solutionCode: `import json

# JSON string to parse
json_string = '''
[
  {"name": "Alice", "age": 25},
  {"name": "Bob", "age": 30}
]
'''

# 1. Parse the JSON
people = json.loads(json_string)

# 2. Print each person's name
for person in people:
    print(person['name'])`,

  hints: [
    "Use json.loads() to parse a string",
    "The result is a Python list",
    "Loop through with: for person in people",
    "Access name with: person['name']"
  ]
};
