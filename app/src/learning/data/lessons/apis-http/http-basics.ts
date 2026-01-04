import type { LessonContent } from '../types';

export const httpBasics: LessonContent = {
  slug: "http-basics",
  problemContent: `# HTTP Fundamentals

HTTP is how computers talk to each other on the internet!

## How It Works

1. You send a **request** to a server
2. Server sends back a **response**
3. Response contains the data you wanted

## HTTP Methods (The 4 Main Ones)

| Method | What it does | Example |
|--------|--------------|---------|
| **GET** | Get data | View a webpage |
| **POST** | Send new data | Submit a form |
| **PUT** | Update data | Edit your profile |
| **DELETE** | Remove data | Delete a post |

## Status Codes (What the Server Says Back)

| Code | Meaning |
|------|---------|
| **200** | OK - Success! |
| **201** | Created |
| **400** | Bad Request - You made an error |
| **404** | Not Found - Page doesn't exist |
| **500** | Server Error - Their problem |

## Your Task

Match each action to the correct HTTP method:
1. Getting a list of products
2. Adding a new user
3. Updating your email
4. Removing an item from cart`,

  solutionContent: `# Solution: HTTP Fundamentals

## Answers

1. **Getting products** → **GET**
   - You're reading/retrieving data

2. **Adding a new user** → **POST**
   - You're creating something new

3. **Updating email** → **PUT**
   - You're changing existing data

4. **Removing from cart** → **DELETE**
   - You're removing data

## Easy Way to Remember

- **GET** = I want to SEE something
- **POST** = I want to CREATE something
- **PUT** = I want to CHANGE something
- **DELETE** = I want to REMOVE something`,

  explanationContent: `# Deep Dive: HTTP

## A Request Looks Like This

\`\`\`
GET /api/users HTTP/1.1
Host: example.com
Authorization: Bearer token123
\`\`\`

## A Response Looks Like This

\`\`\`
HTTP/1.1 200 OK
Content-Type: application/json

{"name": "Alice", "email": "alice@test.com"}
\`\`\`

## Query Parameters

Add extra info to your request:
\`\`\`
/api/products?category=books&limit=10
\`\`\``,

  realworldContent: `# Real-World Examples

## Shopping Website
\`\`\`
GET /products         # Browse items
POST /cart            # Add to cart
DELETE /cart/item/5   # Remove from cart
POST /orders          # Place order
\`\`\`

## Social Media
\`\`\`
GET /feed             # View posts
POST /posts           # Create post
PUT /posts/123        # Edit post
DELETE /posts/123     # Delete post
\`\`\``,

  mistakesContent: `# Common Mistakes

## 1. Using GET to Delete
\`\`\`
# Wrong!
GET /delete-user/123

# Right
DELETE /users/123
\`\`\`

## 2. Ignoring Status Codes
Always check if your request worked!
- 200-299 = Success
- 400-499 = Your mistake
- 500-599 = Server's mistake`,

  interviewContent: `# Interview Questions

## Q1: GET vs POST?
**Answer:** GET retrieves data (no changes). POST sends data to create something new.

## Q2: What's REST?
**Answer:** A style of building APIs using HTTP methods on URLs. Example: GET /users, POST /users, DELETE /users/123`,

  starterCode: `# HTTP Methods Quiz
# Match each action to the correct method

actions = [
    "Getting a list of products",
    "Adding a new user",
    "Updating your email",
    "Removing item from cart"
]

# Fill in: "GET", "POST", "PUT", or "DELETE"
answers = [
    "",  # Getting products
    "",  # Adding user
    "",  # Updating email
    "",  # Removing item
]

# Check your answers
correct = ["GET", "POST", "PUT", "DELETE"]
for i, (action, answer) in enumerate(zip(actions, answers)):
    if answer == correct[i]:
        print(f"{i+1}. {action}: {answer} - Correct!")
    else:
        print(f"{i+1}. {action}: {answer or '???'} - Try again")`,

  solutionCode: `# HTTP Methods Quiz
# Match each action to the correct method

actions = [
    "Getting a list of products",
    "Adding a new user",
    "Updating your email",
    "Removing item from cart"
]

# Fill in: "GET", "POST", "PUT", or "DELETE"
answers = [
    "GET",     # Getting products - reading data
    "POST",    # Adding user - creating new data
    "PUT",     # Updating email - changing data
    "DELETE",  # Removing item - deleting data
]

# Check your answers
correct = ["GET", "POST", "PUT", "DELETE"]
for i, (action, answer) in enumerate(zip(actions, answers)):
    if answer == correct[i]:
        print(f"{i+1}. {action}: {answer} - Correct!")
    else:
        print(f"{i+1}. {action}: {answer or '???'} - Try again")`,

  hints: [
    "GET = reading/viewing data",
    "POST = creating new data",
    "PUT = updating existing data",
    "DELETE = removing data"
  ]
};
