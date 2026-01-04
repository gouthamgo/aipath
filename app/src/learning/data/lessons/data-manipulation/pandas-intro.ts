import type { LessonContent } from '../types';

export const pandasIntro: LessonContent = {
  slug: "pandas-intro",
  problemContent: `# Pandas Introduction

Pandas is your best friend for working with data tables!

## What is a DataFrame?

Think of it like an **Excel spreadsheet** in Python:

\`\`\`python
import pandas as pd

# Create a table
data = {
    'name': ['Alice', 'Bob', 'Charlie'],
    'age': [25, 30, 35],
    'city': ['NYC', 'LA', 'Chicago']
}
df = pd.DataFrame(data)
print(df)
\`\`\`

Output:
\`\`\`
      name  age     city
0    Alice   25      NYC
1      Bob   30       LA
2  Charlie   35  Chicago
\`\`\`

## Getting Data

| Method | What it does |
|--------|--------------|
| \`df.head()\` | First 5 rows |
| \`df.tail()\` | Last 5 rows |
| \`df.shape\` | (rows, columns) |
| \`df.columns\` | Column names |

## Selecting Columns

\`\`\`python
# One column
df['name']

# Multiple columns
df[['name', 'age']]
\`\`\`

## Your Task

1. Create a DataFrame with 3 products: name, price, quantity
2. Print the DataFrame
3. Select just the 'name' and 'price' columns`,

  solutionContent: `# Solution: Pandas Introduction

\`\`\`python
import pandas as pd

# Step 1: Create the data
products = {
    'name': ['Laptop', 'Mouse', 'Keyboard'],
    'price': [999, 29, 79],
    'quantity': [50, 200, 150]
}

# Step 2: Create and print DataFrame
df = pd.DataFrame(products)
print("All products:")
print(df)

# Step 3: Select name and price
print("\\nName and Price:")
print(df[['name', 'price']])
\`\`\`

## Output
\`\`\`
All products:
       name  price  quantity
0    Laptop    999        50
1     Mouse     29       200
2  Keyboard     79       150

Name and Price:
       name  price
0    Laptop    999
1     Mouse     29
2  Keyboard     79
\`\`\``,

  explanationContent: `# Deep Dive: DataFrames

## Filtering Rows

\`\`\`python
# Get expensive products
expensive = df[df['price'] > 50]

# Get products with lots of stock
in_stock = df[df['quantity'] >= 100]
\`\`\`

## Adding Columns

\`\`\`python
# Add a total value column
df['total'] = df['price'] * df['quantity']
\`\`\`

## Sorting

\`\`\`python
# Sort by price (low to high)
df.sort_values('price')

# Sort by price (high to low)
df.sort_values('price', ascending=False)
\`\`\``,

  realworldContent: `# Real-World Applications

## 1. Sales Data
\`\`\`python
sales = pd.read_csv('sales.csv')
total = sales['revenue'].sum()
\`\`\`

## 2. Customer Analysis
\`\`\`python
customers = pd.read_csv('customers.csv')
vip = customers[customers['purchases'] > 1000]
\`\`\``,

  mistakesContent: `# Common Mistakes

## 1. Single vs Double Brackets

\`\`\`python
# One column (returns Series)
df['name']

# Multiple columns (need double brackets!)
df[['name', 'age']]  # NOT df['name', 'age']
\`\`\`

## 2. Forgetting Quotes

\`\`\`python
# Wrong
df[name]  # Error!

# Right
df['name']
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: Series vs DataFrame?
**Answer:** Series = one column. DataFrame = table with multiple columns.

## Q2: How to read a CSV file?
**Answer:** \`df = pd.read_csv('filename.csv')\``,

  starterCode: `import pandas as pd

# 1. Create product data (fill in the lists)
products = {
    'name': [],      # Add 3 product names
    'price': [],     # Add 3 prices
    'quantity': []   # Add 3 quantities
}

# 2. Create DataFrame
df = pd.DataFrame(products)
print("All products:")
print(df)

# 3. Select name and price columns
print("\\nName and Price:")
selected =
print(selected)`,

  solutionCode: `import pandas as pd

# 1. Create product data
products = {
    'name': ['Laptop', 'Mouse', 'Keyboard'],
    'price': [999, 29, 79],
    'quantity': [50, 200, 150]
}

# 2. Create DataFrame
df = pd.DataFrame(products)
print("All products:")
print(df)

# 3. Select name and price columns
print("\\nName and Price:")
selected = df[['name', 'price']]
print(selected)`,

  hints: [
    "Add strings in quotes for names: 'Laptop'",
    "Add numbers without quotes for price: 999",
    "Use double brackets for multiple columns",
    "df[['name', 'price']] selects both columns"
  ]
};
