import type { LessonContent } from '../types';

export const dataCleaning: LessonContent = {
  slug: "data-cleaning",
  problemContent: `# Data Cleaning

Real data is messy! Let's learn to clean it up.

## The Problem: Missing Data

\`\`\`python
import pandas as pd

df = pd.DataFrame({
    'name': ['Alice', None, 'Charlie'],
    'age': [25, 30, None],
    'email': ['a@test.com', 'b@test.com', None]
})
\`\`\`

See those \`None\` values? That's missing data!

## Finding Missing Data

\`\`\`python
# Check for missing values
df.isna()           # Shows True where missing
df.isna().sum()     # Count missing per column
\`\`\`

## Fixing Missing Data

| Method | What it does |
|--------|--------------|
| \`df.dropna()\` | Remove rows with missing |
| \`df.fillna(0)\` | Replace missing with 0 |
| \`df.fillna(df.mean())\` | Replace with average |

## Your Task

1. Find which columns have missing values
2. Fill missing ages with the average age
3. Drop rows where email is missing`,

  solutionContent: `# Solution: Data Cleaning

\`\`\`python
import pandas as pd

# Create messy data
df = pd.DataFrame({
    'name': ['Alice', 'Bob', None, 'Diana'],
    'age': [25, None, 35, 28],
    'email': ['a@test.com', 'b@test.com', 'c@test.com', None]
})

print("Original data:")
print(df)

# Step 1: Find missing
print("\\nMissing values:")
print(df.isna().sum())

# Step 2: Fill missing ages with average
avg_age = df['age'].mean()
df['age'] = df['age'].fillna(avg_age)

# Step 3: Drop rows without email
df = df.dropna(subset=['email'])

print("\\nCleaned data:")
print(df)
\`\`\``,

  explanationContent: `# Deep Dive: Cleaning Strategies

## When to Drop vs Fill?

**Drop** when:
- Few rows are missing
- The missing data can't be guessed

**Fill** when:
- Many rows would be lost
- You can estimate the value (like average)

## Common Fill Strategies

\`\`\`python
# Numbers: use average
df['age'].fillna(df['age'].mean())

# Categories: use most common
df['city'].fillna(df['city'].mode()[0])

# Use previous value
df.fillna(method='ffill')
\`\`\``,

  realworldContent: `# Real-World Applications

## Survey Data
People skip questions - fill with average or "Unknown"

## Sensor Data
Sensors malfunction - fill gaps with nearby values

## Customer Records
Missing emails = can't contact them, might drop`,

  mistakesContent: `# Common Mistakes

## 1. Dropping Too Much

\`\`\`python
# Bad - drops ANY row with missing data
df.dropna()  # Might lose 80% of data!

# Better - only drop where email is missing
df.dropna(subset=['email'])
\`\`\`

## 2. Not Saving the Result

\`\`\`python
# This doesn't change df!
df.dropna()

# This does:
df = df.dropna()
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: How do you handle missing data?
**Answer:** First check how much is missing. Then either drop (if few) or fill with mean/median/mode (if many).

## Q2: Mean vs Median for filling?
**Answer:** Mean for normal data. Median when there are outliers (extreme values).`,

  starterCode: `import pandas as pd

# Messy data
df = pd.DataFrame({
    'name': ['Alice', 'Bob', None, 'Diana'],
    'age': [25, None, 35, 28],
    'email': ['a@test.com', 'b@test.com', 'c@test.com', None]
})

print("Original:")
print(df)

# 1. Show missing values count
print("\\nMissing values:")
missing =
print(missing)

# 2. Fill missing ages with average
avg_age =
df['age'] =

# 3. Drop rows where email is missing
df =

print("\\nCleaned:")
print(df)`,

  solutionCode: `import pandas as pd

# Messy data
df = pd.DataFrame({
    'name': ['Alice', 'Bob', None, 'Diana'],
    'age': [25, None, 35, 28],
    'email': ['a@test.com', 'b@test.com', 'c@test.com', None]
})

print("Original:")
print(df)

# 1. Show missing values count
print("\\nMissing values:")
missing = df.isna().sum()
print(missing)

# 2. Fill missing ages with average
avg_age = df['age'].mean()
df['age'] = df['age'].fillna(avg_age)

# 3. Drop rows where email is missing
df = df.dropna(subset=['email'])

print("\\nCleaned:")
print(df)`,

  hints: [
    "Use df.isna().sum() to count missing",
    "Calculate average with df['age'].mean()",
    "Use fillna() to replace missing values",
    "Use dropna(subset=['email']) to drop only where email is missing"
  ]
};
