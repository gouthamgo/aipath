import type { LessonContent } from '../types';

export const variablesTypes: LessonContent = {
  slug: "variables-types",
  problemContent: `# Variables & Data Types

Welcome to your first Python lesson! Let's start with the absolute basics.

## What is a Variable?

Think of a variable like a **labeled box** where you store information. You give the box a name, and you can put something inside it.

\`\`\`python
# This creates a box called "name" with "Alice" inside
name = "Alice"

# This creates a box called "age" with 25 inside
age = 25
\`\`\`

## The 4 Basic Data Types

Python has different types of "boxes" for different kinds of data:

| Type | What it stores | Example |
|------|---------------|---------|
| **str** | Text (strings) | \`"Hello"\`, \`'World'\` |
| **int** | Whole numbers | \`42\`, \`-7\`, \`0\` |
| **float** | Decimal numbers | \`3.14\`, \`-0.5\` |
| **bool** | True or False | \`True\`, \`False\` |

## Your Task

Create 4 variables, one for each data type:
1. \`my_name\` - your name (string)
2. \`my_age\` - your age (integer)
3. \`my_height\` - your height in meters (float)
4. \`is_learning\` - are you learning Python? (boolean)

Then print each one to see the output!`,

  solutionContent: `# Solution: Variables & Data Types

Here's the complete solution:

\`\`\`python
# String - text wrapped in quotes
my_name = "Alex"

# Integer - whole number, no quotes
my_age = 28

# Float - decimal number
my_height = 1.75

# Boolean - True or False (capitalized!)
is_learning = True

# Print each variable
print(my_name)
print(my_age)
print(my_height)
print(is_learning)
\`\`\`

## Output
\`\`\`
Alex
28
1.75
True
\`\`\`

## Key Points
- Strings need quotes: \`"text"\` or \`'text'\`
- Numbers don't need quotes
- Booleans are capitalized: \`True\` not \`true\``,

  explanationContent: `# Deep Dive: Variables & Data Types

## How Variables Work in Memory

When you write \`name = "Alice"\`:
1. Python creates space in memory
2. Stores the value "Alice" there
3. Labels that space with "name"

## Variable Naming Rules

**Valid names:**
- \`my_variable\` - letters and underscores ✓
- \`user2\` - letters and numbers ✓
- \`_private\` - can start with underscore ✓

**Invalid names:**
- \`2users\` - can't start with number ✗
- \`my-var\` - no hyphens ✗
- \`class\` - can't use Python keywords ✗

## Type Checking

You can check a variable's type with \`type()\`:

\`\`\`python
name = "Alice"
print(type(name))  # <class 'str'>

age = 25
print(type(age))   # <class 'int'>
\`\`\`

## Type Conversion

Convert between types:

\`\`\`python
# String to integer
age_str = "25"
age_int = int(age_str)  # 25

# Integer to string
num = 42
num_str = str(num)  # "42"

# String to float
price = float("19.99")  # 19.99
\`\`\``,

  realworldContent: `# Real-World Applications

## 1. User Registration System

\`\`\`python
# Collecting user data
username = "john_doe"
email = "john@example.com"
age = 28
is_verified = False
account_balance = 150.75
\`\`\`

## 2. E-commerce Product

\`\`\`python
# Product information
product_name = "Wireless Mouse"
price = 29.99
quantity_in_stock = 150
is_available = True
\`\`\`

## 3. Game Character Stats

\`\`\`python
# Player stats
player_name = "DragonSlayer"
health = 100
level = 15
experience = 2500.5
is_alive = True
\`\`\`

## 4. Weather App Data

\`\`\`python
# Weather information
city = "San Francisco"
temperature = 18.5
humidity = 65
is_raining = False
\`\`\`

Every app you use stores data in variables like these!`,

  mistakesContent: `# Common Mistakes to Avoid

## 1. Forgetting Quotes for Strings

\`\`\`python
# ❌ Wrong - Python thinks Alice is a variable
name = Alice  # NameError: name 'Alice' is not defined

# ✅ Correct - Alice is a string value
name = "Alice"
\`\`\`

## 2. Using Wrong Quotes

\`\`\`python
# ❌ Wrong - mismatched quotes
message = "Hello'  # SyntaxError

# ✅ Correct - matching quotes
message = "Hello"
message = 'Hello'
\`\`\`

## 3. Lowercase Booleans

\`\`\`python
# ❌ Wrong - Python booleans are capitalized
is_active = true  # NameError

# ✅ Correct
is_active = True
is_active = False
\`\`\`

## 4. Spaces in Variable Names

\`\`\`python
# ❌ Wrong - no spaces allowed
my name = "Alex"  # SyntaxError

# ✅ Correct - use underscores
my_name = "Alex"
\`\`\`

## 5. Starting with Numbers

\`\`\`python
# ❌ Wrong - can't start with number
2nd_place = "Silver"  # SyntaxError

# ✅ Correct
second_place = "Silver"
place_2 = "Silver"
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: What's the difference between int and float?

**Answer:**
- \`int\` stores whole numbers: \`42\`, \`-7\`, \`0\`
- \`float\` stores decimals: \`3.14\`, \`-0.5\`, \`2.0\`

Even \`2.0\` is a float because it has a decimal point!

## Q2: Are Python variables statically or dynamically typed?

**Answer:** Python is **dynamically typed**. You don't declare the type - Python figures it out:

\`\`\`python
x = 5      # x is int
x = "hi"   # now x is str - totally fine!
\`\`\`

## Q3: What's the difference between = and ==?

**Answer:**
- \`=\` is **assignment**: puts a value in a variable
- \`==\` is **comparison**: checks if two values are equal

\`\`\`python
x = 5      # assignment
x == 5     # comparison, returns True
\`\`\`

## Q4: How do you check a variable's type?

**Answer:** Use the \`type()\` function:

\`\`\`python
x = "hello"
print(type(x))  # <class 'str'>
\`\`\``,

  starterCode: `# Variables & Data Types
# Create one variable of each type!

# 1. String - your name (use quotes)
my_name =

# 2. Integer - your age (whole number)
my_age =

# 3. Float - your height in meters (decimal)
my_height =

# 4. Boolean - are you learning? (True or False)
is_learning =

# Print all variables
print("Name:", my_name)
print("Age:", my_age)
print("Height:", my_height)
print("Learning:", is_learning)`,

  solutionCode: `# Variables & Data Types
# Create one variable of each type!

# 1. Create a string variable called my_name
my_name = "Alex"

# 2. Create an integer variable called my_age
my_age = 25

# 3. Create a float variable called my_height (in meters)
my_height = 1.75

# 4. Create a boolean variable called is_learning
is_learning = True

# Print all variables
print("Name:", my_name)
print("Age:", my_age)
print("Height:", my_height)
print("Learning:", is_learning)`,

  hints: [
    "Strings need quotes around them: \"your text here\"",
    "Integers are just numbers without quotes: 25",
    "Floats have a decimal point: 1.75",
    "Booleans are True or False (capitalized, no quotes)",
  ],
};
