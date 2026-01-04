import type { LessonContent } from '../types';

export const errorHandling: LessonContent = {
  slug: "error-handling",
  problemContent: `# Error Handling

Errors happen! Good code handles them gracefully instead of crashing.

## The try/except Pattern

\`\`\`python
try:
    # Code that might fail
    result = 10 / 0
except:
    # What to do if it fails
    print("Something went wrong!")
\`\`\`

## Catching Specific Errors

\`\`\`python
try:
    number = int("hello")
except ValueError:
    print("That's not a valid number!")
\`\`\`

## Common Error Types

| Error | When It Happens |
|-------|-----------------|
| **ValueError** | Wrong type of value |
| **TypeError** | Wrong type for operation |
| **ZeroDivisionError** | Dividing by zero |
| **FileNotFoundError** | File doesn't exist |
| **KeyError** | Dictionary key not found |
| **IndexError** | List index out of range |

## The Full Pattern

\`\`\`python
try:
    result = 10 / 2
except ZeroDivisionError:
    print("Can't divide by zero!")
else:
    print(f"Result: {result}")  # Runs if no error
finally:
    print("Done!")  # Always runs
\`\`\`

## Your Task

Write a function \`safe_divide(a, b)\` that:
1. Returns a / b if possible
2. Returns 0 if division by zero
3. Print "Cannot divide by zero!" for the error case`,

  solutionContent: `# Solution: Error Handling

\`\`\`python
def safe_divide(a, b):
    try:
        result = a / b
        return result
    except ZeroDivisionError:
        print("Cannot divide by zero!")
        return 0

# Test it
print(safe_divide(10, 2))   # 5.0
print(safe_divide(10, 0))   # Cannot divide by zero! → 0
\`\`\`

## Alternative with else

\`\`\`python
def safe_divide(a, b):
    try:
        result = a / b
    except ZeroDivisionError:
        print("Cannot divide by zero!")
        return 0
    else:
        return result
\`\`\``,

  explanationContent: `# Deep Dive: Error Handling

## Multiple Except Blocks

Handle different errors differently:

\`\`\`python
def process_input(value):
    try:
        number = int(value)
        result = 100 / number
        return result
    except ValueError:
        print("Please enter a number!")
    except ZeroDivisionError:
        print("Number can't be zero!")
    except Exception as e:
        print(f"Unexpected error: {e}")
\`\`\`

## Getting Error Details

\`\`\`python
try:
    file = open("missing.txt")
except FileNotFoundError as e:
    print(f"Error: {e}")
    # Error: [Errno 2] No such file or directory: 'missing.txt'
\`\`\`

## Raising Errors

Create your own errors:

\`\`\`python
def set_age(age):
    if age < 0:
        raise ValueError("Age cannot be negative!")
    return age

try:
    set_age(-5)
except ValueError as e:
    print(e)  # Age cannot be negative!
\`\`\`

## The finally Block

Always runs, even if there's an error:

\`\`\`python
def read_file(filename):
    file = None
    try:
        file = open(filename)
        return file.read()
    except FileNotFoundError:
        return "File not found"
    finally:
        if file:
            file.close()  # Always close the file!
\`\`\``,

  realworldContent: `# Real-World Applications

## 1. User Input Validation

\`\`\`python
def get_age():
    while True:
        try:
            age = int(input("Enter your age: "))
            if age < 0 or age > 150:
                raise ValueError("Invalid age range")
            return age
        except ValueError as e:
            print(f"Invalid input: {e}. Try again.")
\`\`\`

## 2. API Request Handling

\`\`\`python
import requests

def fetch_data(url):
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        return response.json()
    except requests.Timeout:
        print("Request timed out")
    except requests.HTTPError as e:
        print(f"HTTP error: {e}")
    except requests.RequestException as e:
        print(f"Request failed: {e}")
    return None
\`\`\`

## 3. File Processing

\`\`\`python
def process_config(filename):
    try:
        with open(filename) as f:
            config = json.load(f)
        return config
    except FileNotFoundError:
        print(f"Config file {filename} not found")
        return {}
    except json.JSONDecodeError:
        print("Invalid JSON in config file")
        return {}
\`\`\`

## 4. Database Operations

\`\`\`python
def save_user(user_data):
    try:
        db.insert(user_data)
        return True
    except DuplicateKeyError:
        print("User already exists")
    except DatabaseError as e:
        print(f"Database error: {e}")
    return False
\`\`\``,

  mistakesContent: `# Common Mistakes to Avoid

## 1. Bare Except (Too Broad)

\`\`\`python
# ❌ Wrong - catches everything including Ctrl+C
try:
    do_something()
except:
    pass

# ✅ Correct - catch specific errors
try:
    do_something()
except ValueError:
    handle_value_error()
except Exception as e:
    print(f"Unexpected: {e}")
\`\`\`

## 2. Silently Swallowing Errors

\`\`\`python
# ❌ Wrong - error disappears
try:
    result = calculate()
except:
    pass  # What went wrong? No idea!

# ✅ Correct - at least log it
try:
    result = calculate()
except Exception as e:
    print(f"Calculation failed: {e}")
    result = 0
\`\`\`

## 3. Too Much Code in try Block

\`\`\`python
# ❌ Wrong - hard to know what caused the error
try:
    data = fetch_data()
    processed = process(data)
    save(processed)
    send_email()
except Exception:
    print("Something failed")

# ✅ Better - focused try blocks
try:
    data = fetch_data()
except RequestError:
    print("Fetch failed")
else:
    processed = process(data)
    save(processed)
\`\`\`

## 4. Not Re-raising When Needed

\`\`\`python
# ❌ Wrong - error is hidden
def process():
    try:
        risky_operation()
    except:
        print("Error")  # Caller never knows!

# ✅ Correct - log and re-raise
def process():
    try:
        risky_operation()
    except Exception as e:
        print(f"Error: {e}")
        raise  # Let caller handle it too
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: What's the difference between except and except Exception?

**Answer:**
- \`except:\` catches everything (including KeyboardInterrupt, SystemExit)
- \`except Exception:\` catches most errors but not system exits

Always prefer \`except Exception\` or specific exceptions.

## Q2: When does the finally block run?

**Answer:** Always! Whether there's an error or not, whether you return or not.

\`\`\`python
def test():
    try:
        return "try"
    finally:
        print("finally runs!")  # Still runs!
\`\`\`

## Q3: How do you create a custom exception?

**Answer:**

\`\`\`python
class InvalidAgeError(Exception):
    pass

def set_age(age):
    if age < 0:
        raise InvalidAgeError("Age cannot be negative")
\`\`\`

## Q4: What is the purpose of else in try/except?

**Answer:** The \`else\` block runs only if no exception was raised. It keeps the "happy path" code separate from error handling.

\`\`\`python
try:
    result = calculate()
except ValueError:
    print("Error!")
else:
    print(f"Success: {result}")  # Only if no error
\`\`\``,

  starterCode: `# Error Handling
# Create a safe division function!

def safe_divide(a, b):
    # Use try/except to handle division
    # Return a/b if possible
    # Print "Cannot divide by zero!" and return 0 if ZeroDivisionError


# Test your function
print(safe_divide(10, 2))   # Should print 5.0
print(safe_divide(10, 0))   # Should print error message and 0`,

  solutionCode: `# Error Handling
# Create a safe division function!

def safe_divide(a, b):
    # Use try/except to handle division
    # Return a/b if possible
    # Print "Cannot divide by zero!" and return 0 if ZeroDivisionError
    try:
        return a / b
    except ZeroDivisionError:
        print("Cannot divide by zero!")
        return 0

# Test your function
print(safe_divide(10, 2))   # Should print 5.0
print(safe_divide(10, 0))   # Should print error message and 0`,

  hints: [
    "Start with try: and put the division inside",
    "Use except ZeroDivisionError: to catch the error",
    "In the except block, print the message and return 0",
    "In the try block, just return a / b",
  ],
};
