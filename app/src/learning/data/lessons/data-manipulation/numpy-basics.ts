import type { LessonContent } from '../types';

export const numpyBasics: LessonContent = {
  slug: "numpy-basics",
  problemContent: `# NumPy Fundamentals

Welcome to NumPy! It's the foundation of data science in Python.

## What is NumPy?

NumPy gives you **super-fast arrays** for math. Think of it like Excel columns, but way faster!

\`\`\`python
import numpy as np

# Create an array (like a list, but faster)
numbers = np.array([1, 2, 3, 4, 5])
print(numbers)  # [1 2 3 4 5]
\`\`\`

## Creating Arrays

| Method | What it does | Example |
|--------|--------------|---------|
| \`np.array()\` | From a list | \`np.array([1,2,3])\` |
| \`np.zeros()\` | All zeros | \`np.zeros(5)\` |
| \`np.ones()\` | All ones | \`np.ones(3)\` |
| \`np.arange()\` | Range of numbers | \`np.arange(0, 10, 2)\` |

## Array Math (The Magic Part!)

With NumPy, math works on the WHOLE array at once:

\`\`\`python
prices = np.array([10, 20, 30])

# Add 5 to ALL prices
new_prices = prices + 5  # [15 25 35]

# Double ALL prices
doubled = prices * 2     # [20 40 60]
\`\`\`

No loops needed!

## Your Task

1. Create an array of temperatures in Fahrenheit: \`[72, 68, 75, 80, 77]\`
2. Convert to Celsius using: \`(fahrenheit - 32) * 5/9\`
3. Print the result`,

  solutionContent: `# Solution: NumPy Fundamentals

\`\`\`python
import numpy as np

# Step 1: Create the array
temps_f = np.array([72, 68, 75, 80, 77])

# Step 2: Convert to Celsius
temps_c = (temps_f - 32) * 5/9

# Step 3: Print
print("Fahrenheit:", temps_f)
print("Celsius:", temps_c)
\`\`\`

## Output
\`\`\`
Fahrenheit: [72 68 75 80 77]
Celsius: [22.22 20.   23.89 26.67 25.  ]
\`\`\`

## Key Point
Notice we did math on ALL 5 temperatures with just one line! No loops needed.`,

  explanationContent: `# Deep Dive: NumPy Arrays

## Why NumPy is Fast

Regular Python lists store each number separately in memory. NumPy arrays store them together, making math 50x faster!

## Useful Array Functions

\`\`\`python
arr = np.array([3, 1, 4, 1, 5, 9])

np.sum(arr)     # 23 (add all)
np.mean(arr)    # 3.83 (average)
np.max(arr)     # 9 (biggest)
np.min(arr)     # 1 (smallest)
np.sort(arr)    # [1 1 3 4 5 9] (sorted)
\`\`\`

## Indexing (Getting Values)

\`\`\`python
arr = np.array([10, 20, 30, 40, 50])

arr[0]      # 10 (first)
arr[-1]     # 50 (last)
arr[1:4]    # [20 30 40] (slice)
\`\`\``,

  realworldContent: `# Real-World Applications

## 1. Image Processing
Images are just arrays of numbers!
\`\`\`python
# A 100x100 pixel image
image = np.zeros((100, 100))
\`\`\`

## 2. Stock Prices
\`\`\`python
prices = np.array([150, 152, 148, 155])
daily_change = np.diff(prices)  # [2, -4, 7]
\`\`\`

## 3. Data Cleaning
\`\`\`python
data = np.array([23, 24, 100, 25])  # 100 is wrong!
clean = data[data < 50]  # [23, 24, 25]
\`\`\``,

  mistakesContent: `# Common Mistakes

## 1. List vs Array Math

\`\`\`python
# List - repeats!
[1, 2] * 3  # [1, 2, 1, 2, 1, 2]

# Array - multiplies!
np.array([1, 2]) * 3  # [3, 6]
\`\`\`

## 2. Forgetting to Import

\`\`\`python
# Wrong
array([1, 2, 3])  # Error!

# Right
import numpy as np
np.array([1, 2, 3])
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: Why use NumPy instead of lists?
**Answer:** NumPy is 50x faster for math because it stores numbers together in memory and uses optimized C code.

## Q2: What does "vectorized" mean?
**Answer:** Operations work on whole arrays at once, no loops needed. \`arr * 2\` multiplies everything.`,

  starterCode: `import numpy as np

# 1. Create an array of Fahrenheit temps
temps_f = np.array([72, 68, 75, 80, 77])

# 2. Convert to Celsius: (F - 32) * 5/9
temps_c =

# 3. Print both
print("Fahrenheit:", temps_f)
print("Celsius:", temps_c)`,

  solutionCode: `import numpy as np

# 1. Create an array of Fahrenheit temps
temps_f = np.array([72, 68, 75, 80, 77])

# 2. Convert to Celsius: (F - 32) * 5/9
temps_c = (temps_f - 32) * 5/9

# 3. Print both
print("Fahrenheit:", temps_f)
print("Celsius:", temps_c)`,

  hints: [
    "The formula is: (fahrenheit - 32) * 5/9",
    "Just use the formula directly on temps_f",
    "NumPy does the math on all values at once",
    "No loop needed!"
  ]
};
