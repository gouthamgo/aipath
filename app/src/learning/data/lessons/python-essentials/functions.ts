import type { LessonContent } from '../types';

export const functions: LessonContent = {
  slug: "functions",
  problemContent: `# Functions & Modules

Functions are reusable blocks of code. Instead of writing the same code over and over, write it once and call it whenever you need it!

## Creating a Function

Use the \`def\` keyword:

\`\`\`python
def greet():
    print("Hello, World!")

# Call the function
greet()  # Output: Hello, World!
\`\`\`

## Functions with Parameters

Parameters let you pass data into the function:

\`\`\`python
def greet(name):
    print(f"Hello, {name}!")

greet("Alice")  # Output: Hello, Alice!
greet("Bob")    # Output: Hello, Bob!
\`\`\`

## Returning Values

Use \`return\` to send a value back:

\`\`\`python
def add(a, b):
    return a + b

result = add(5, 3)
print(result)  # Output: 8
\`\`\`

## Default Parameters

Give parameters a default value:

\`\`\`python
def greet(name="World"):
    print(f"Hello, {name}!")

greet()         # Output: Hello, World!
greet("Alice")  # Output: Hello, Alice!
\`\`\`

## Your Task

Create a function called \`calculate_area\` that:
1. Takes \`width\` and \`height\` as parameters
2. Returns the area (width × height)
3. Test it with width=5 and height=3`,

  solutionContent: `# Solution: Functions

\`\`\`python
def calculate_area(width, height):
    area = width * height
    return area

# Test the function
result = calculate_area(5, 3)
print(result)  # Output: 15
\`\`\`

## Shorter Version

You can return directly without a variable:

\`\`\`python
def calculate_area(width, height):
    return width * height

print(calculate_area(5, 3))  # Output: 15
\`\`\`

## With Default Values

\`\`\`python
def calculate_area(width, height=1):
    return width * height

print(calculate_area(5, 3))  # Output: 15
print(calculate_area(5))     # Output: 5 (height defaults to 1)
\`\`\``,

  explanationContent: `# Deep Dive: Functions

## Why Use Functions?

1. **Reusability** - Write once, use many times
2. **Organization** - Break code into logical pieces
3. **Readability** - Give blocks of code meaningful names
4. **Testing** - Test small pieces independently

## Function Anatomy

\`\`\`python
def function_name(parameter1, parameter2):
    \"\"\"This is a docstring - describes the function\"\"\"
    # Function body
    result = parameter1 + parameter2
    return result
\`\`\`

## Multiple Return Values

Return multiple values as a tuple:

\`\`\`python
def get_user():
    return "Alice", 25, "alice@email.com"

name, age, email = get_user()
print(name)   # Alice
print(age)    # 25
\`\`\`

## *args and **kwargs

Accept any number of arguments:

\`\`\`python
# *args - any number of positional args
def add_all(*numbers):
    return sum(numbers)

print(add_all(1, 2, 3, 4))  # 10

# **kwargs - any number of keyword args
def print_info(**info):
    for key, value in info.items():
        print(f"{key}: {value}")

print_info(name="Alice", age=25)
\`\`\`

## Scope

Variables inside functions are local:

\`\`\`python
def my_function():
    x = 10  # Local variable
    print(x)

my_function()  # 10
print(x)       # Error! x doesn't exist here
\`\`\``,

  realworldContent: `# Real-World Applications

## 1. Data Validation

\`\`\`python
def is_valid_email(email):
    return "@" in email and "." in email

# Usage
if is_valid_email("user@example.com"):
    print("Valid email!")
\`\`\`

## 2. Price Calculator

\`\`\`python
def calculate_total(price, quantity, discount=0):
    subtotal = price * quantity
    discount_amount = subtotal * discount
    return subtotal - discount_amount

# Regular purchase
print(calculate_total(10, 5))  # 50

# With 20% discount
print(calculate_total(10, 5, 0.20))  # 40
\`\`\`

## 3. Password Strength Checker

\`\`\`python
def check_password(password):
    if len(password) < 8:
        return "Weak - too short"
    if not any(c.isupper() for c in password):
        return "Weak - needs uppercase"
    if not any(c.isdigit() for c in password):
        return "Weak - needs number"
    return "Strong"

print(check_password("abc"))        # Weak - too short
print(check_password("MyPass123"))  # Strong
\`\`\`

## 4. API Response Handler

\`\`\`python
def format_api_response(data, success=True):
    return {
        "success": success,
        "data": data,
        "error": None if success else "Request failed"
    }

response = format_api_response({"user": "Alice"})
print(response)
\`\`\``,

  mistakesContent: `# Common Mistakes to Avoid

## 1. Forgetting return

\`\`\`python
# ❌ Wrong - prints but doesn't return
def add(a, b):
    print(a + b)

result = add(5, 3)
print(result)  # None!

# ✅ Correct
def add(a, b):
    return a + b
\`\`\`

## 2. Calling Without Parentheses

\`\`\`python
# ❌ Wrong - references the function, doesn't call it
def greet():
    return "Hello"

message = greet  # message is the function itself!

# ✅ Correct
message = greet()  # message is "Hello"
\`\`\`

## 3. Mutable Default Arguments

\`\`\`python
# ❌ Dangerous - list is shared between calls
def add_item(item, items=[]):
    items.append(item)
    return items

print(add_item("a"))  # ['a']
print(add_item("b"))  # ['a', 'b'] - unexpected!

# ✅ Correct
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items
\`\`\`

## 4. Wrong Argument Order

\`\`\`python
def greet(name, greeting="Hello"):
    print(f"{greeting}, {name}!")

# ❌ Wrong order
greet("Hi", "Alice")  # Output: Alice, Hi!

# ✅ Correct order
greet("Alice", "Hi")  # Output: Hi, Alice!
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: What's the difference between parameters and arguments?

**Answer:**
- **Parameters**: Variables in the function definition
- **Arguments**: Actual values passed when calling

\`\`\`python
def greet(name):     # name is a parameter
    print(name)

greet("Alice")       # "Alice" is an argument
\`\`\`

## Q2: What does a function return if there's no return statement?

**Answer:** It returns \`None\`:

\`\`\`python
def no_return():
    x = 5

result = no_return()
print(result)  # None
\`\`\`

## Q3: What are lambda functions?

**Answer:** Anonymous, single-expression functions:

\`\`\`python
# Regular function
def add(a, b):
    return a + b

# Lambda equivalent
add = lambda a, b: a + b

print(add(5, 3))  # 8
\`\`\`

## Q4: Explain function scope.

**Answer:** Variables defined inside a function are **local** - they only exist inside that function and are destroyed when it ends.

\`\`\`python
def my_func():
    local_var = 10
    # local_var exists here

# local_var doesn't exist here
\`\`\``,

  starterCode: `# Functions Exercise
# Create a function to calculate area!

# Define a function called calculate_area
# It should take width and height as parameters
# It should return width * height

def calculate_area(width, height):
    # Return the area here


# Test your function
result = calculate_area(5, 3)
print("Area:", result)  # Should print: Area: 15`,

  solutionCode: `# Functions Exercise
# Create a function to calculate area!

# Define a function called calculate_area
# It should take width and height as parameters
# It should return width * height

def calculate_area(width, height):
    return width * height

# Test your function
result = calculate_area(5, 3)
print("Area:", result)  # Should print: Area: 15`,

  hints: [
    "The function needs two parameters: width and height",
    "Inside the function, multiply width * height",
    "Use the return keyword to send the result back",
    "def calculate_area(width, height): return width * height",
  ],
};
