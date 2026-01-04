import type { LessonContent } from '../types';

export const controlFlow: LessonContent = {
  slug: "control-flow",
  problemContent: `# Control Flow: if, elif, else

Now that you know variables, let's make decisions with them!

## The if Statement

An \`if\` statement runs code only when a condition is True:

\`\`\`python
age = 18

if age >= 18:
    print("You can vote!")
\`\`\`

**Important:** The code inside \`if\` must be **indented** (4 spaces)!

## Adding else

\`else\` runs when the condition is False:

\`\`\`python
age = 15

if age >= 18:
    print("You can vote!")
else:
    print("Too young to vote")
\`\`\`

## Multiple Conditions with elif

\`elif\` (else if) checks another condition:

\`\`\`python
score = 85

if score >= 90:
    print("Grade: A")
elif score >= 80:
    print("Grade: B")
elif score >= 70:
    print("Grade: C")
else:
    print("Grade: F")
\`\`\`

## Comparison Operators

| Operator | Meaning | Example |
|----------|---------|---------|
| \`==\` | Equal to | \`x == 5\` |
| \`!=\` | Not equal | \`x != 5\` |
| \`>\` | Greater than | \`x > 5\` |
| \`<\` | Less than | \`x < 5\` |
| \`>=\` | Greater or equal | \`x >= 5\` |
| \`<=\` | Less or equal | \`x <= 5\` |

## Your Task

Write a program that:
1. Takes a \`temperature\` variable
2. Prints "Hot!" if temp > 30
3. Prints "Nice" if temp is 20-30
4. Prints "Cold" if temp < 20`,

  solutionContent: `# Solution: Control Flow

\`\`\`python
temperature = 25

if temperature > 30:
    print("Hot!")
elif temperature >= 20:
    print("Nice")
else:
    print("Cold")
\`\`\`

## How it works:

1. First, check if \`temperature > 30\` → False (25 is not > 30)
2. Skip to \`elif\`, check if \`temperature >= 20\` → True!
3. Print "Nice" and stop checking

## Testing Different Values

\`\`\`python
# Test with temperature = 35
temperature = 35
# Output: "Hot!"

# Test with temperature = 15
temperature = 15
# Output: "Cold"

# Test with temperature = 20
temperature = 20
# Output: "Nice" (20 >= 20 is True)
\`\`\``,

  explanationContent: `# Deep Dive: Control Flow

## How Python Evaluates Conditions

Python checks conditions **top to bottom** and stops at the first True:

\`\`\`python
x = 15

if x > 10:      # True! Runs this
    print("A")
elif x > 5:     # Never checked
    print("B")
else:           # Never checked
    print("C")
\`\`\`

Output: \`A\`

## Combining Conditions

Use \`and\`, \`or\`, \`not\`:

\`\`\`python
age = 25
has_license = True

# Both must be true
if age >= 18 and has_license:
    print("You can drive")

# At least one must be true
if age < 18 or not has_license:
    print("Cannot drive")
\`\`\`

## Nested if Statements

You can put \`if\` inside \`if\`:

\`\`\`python
age = 20
is_student = True

if age >= 18:
    print("Adult")
    if is_student:
        print("Student discount!")
\`\`\`

## Truthy and Falsy Values

Python treats some values as False:
- \`0\`, \`0.0\`
- \`""\` (empty string)
- \`[]\` (empty list)
- \`None\`

\`\`\`python
name = ""
if name:
    print("Has name")
else:
    print("No name")  # This runs
\`\`\``,

  realworldContent: `# Real-World Applications

## 1. Login System

\`\`\`python
username = "admin"
password = "secret123"

if username == "admin" and password == "secret123":
    print("Login successful!")
else:
    print("Invalid credentials")
\`\`\`

## 2. E-commerce Discount

\`\`\`python
cart_total = 150
is_member = True

if cart_total >= 100 and is_member:
    discount = 0.20  # 20% off
elif cart_total >= 100:
    discount = 0.10  # 10% off
elif is_member:
    discount = 0.05  # 5% off
else:
    discount = 0

final_price = cart_total * (1 - discount)
print("Final price:", final_price)
\`\`\`

## 3. Age Verification

\`\`\`python
age = 21
country = "USA"

if country == "USA":
    if age >= 21:
        print("Can purchase alcohol")
    else:
        print("Must be 21+")
elif country == "UK":
    if age >= 18:
        print("Can purchase alcohol")
    else:
        print("Must be 18+")
\`\`\`

## 4. Game Level Unlocking

\`\`\`python
player_score = 2500
levels_completed = 10

if player_score >= 5000 and levels_completed >= 20:
    print("Unlocked: MASTER LEVEL")
elif player_score >= 2000 and levels_completed >= 10:
    print("Unlocked: ADVANCED LEVEL")
else:
    print("Keep playing to unlock more!")
\`\`\``,

  mistakesContent: `# Common Mistakes to Avoid

## 1. Forgetting the Colon

\`\`\`python
# ❌ Wrong - missing colon
if age >= 18
    print("Adult")

# ✅ Correct
if age >= 18:
    print("Adult")
\`\`\`

## 2. Wrong Indentation

\`\`\`python
# ❌ Wrong - no indentation
if age >= 18:
print("Adult")  # IndentationError

# ✅ Correct - 4 spaces
if age >= 18:
    print("Adult")
\`\`\`

## 3. Using = Instead of ==

\`\`\`python
# ❌ Wrong - this assigns, doesn't compare
if name = "Alice":  # SyntaxError
    print("Hi Alice")

# ✅ Correct - double equals for comparison
if name == "Alice":
    print("Hi Alice")
\`\`\`

## 4. Wrong Order of elif/else

\`\`\`python
# ❌ Wrong - else must be last
if x > 10:
    print("Big")
else:
    print("Other")
elif x > 5:  # SyntaxError - elif after else
    print("Medium")

# ✅ Correct order
if x > 10:
    print("Big")
elif x > 5:
    print("Medium")
else:
    print("Small")
\`\`\`

## 5. Checking for True Explicitly

\`\`\`python
# ❌ Unnecessary
if is_active == True:
    print("Active")

# ✅ Cleaner
if is_active:
    print("Active")
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: What's the difference between if-elif-else and multiple if statements?

**Answer:**
- \`if-elif-else\`: Only ONE block runs (stops at first True)
- Multiple \`if\`s: Each one is checked independently

\`\`\`python
x = 15

# Only prints "A"
if x > 10:
    print("A")
elif x > 5:
    print("B")

# Prints both "A" and "B"
if x > 10:
    print("A")
if x > 5:
    print("B")
\`\`\`

## Q2: What is short-circuit evaluation?

**Answer:** Python stops evaluating as soon as the result is known:

\`\`\`python
# If first is False, second isn't checked
if False and some_function():
    pass  # some_function never runs!

# If first is True, second isn't checked
if True or some_function():
    pass  # some_function never runs!
\`\`\`

## Q3: Can you use if without else?

**Answer:** Yes! \`else\` is optional:

\`\`\`python
if score >= 90:
    print("Excellent!")
# If score < 90, nothing happens
\`\`\``,

  starterCode: `# Control Flow Exercise
# Write a temperature checker!

temperature = 25

# If temperature > 30, print "Hot!"
# If temperature is 20-30, print "Nice"
# If temperature < 20, print "Cold"

# Write your if/elif/else below:
`,

  solutionCode: `# Control Flow Exercise
# Write a temperature checker!

temperature = 25

# If temperature > 30, print "Hot!"
# If temperature is 20-30, print "Nice"
# If temperature < 20, print "Cold"

if temperature > 30:
    print("Hot!")
elif temperature >= 20:
    print("Nice")
else:
    print("Cold")`,

  hints: [
    "Start with: if temperature > 30:",
    "Don't forget the colon : at the end of each condition",
    "Use elif for the middle range (20-30)",
    "Use else for everything below 20",
  ],
};
