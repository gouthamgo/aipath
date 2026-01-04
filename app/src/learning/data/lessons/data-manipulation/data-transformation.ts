import type { LessonContent } from '../types';

export const dataTransformation: LessonContent = {
  slug: "data-transformation",
  problemContent: `# Data Transformation

Learn to reshape and summarize your data!

## Grouping Data

The most powerful Pandas feature - group by a column and calculate:

\`\`\`python
import pandas as pd

sales = pd.DataFrame({
    'region': ['East', 'West', 'East', 'West'],
    'product': ['A', 'A', 'B', 'B'],
    'revenue': [100, 150, 200, 250]
})

# Total revenue by region
by_region = sales.groupby('region')['revenue'].sum()
print(by_region)
\`\`\`

Output:
\`\`\`
region
East    300
West    400
\`\`\`

## Common Aggregations

| Method | What it does |
|--------|--------------|
| \`.sum()\` | Add all values |
| \`.mean()\` | Average |
| \`.count()\` | Count rows |
| \`.max()\` | Largest value |
| \`.min()\` | Smallest value |

## Your Task

Given sales data:
1. Calculate total revenue by region
2. Calculate total revenue by product`,

  solutionContent: `# Solution: Data Transformation

\`\`\`python
import pandas as pd

sales = pd.DataFrame({
    'region': ['East', 'West', 'East', 'West', 'East', 'West'],
    'product': ['Laptop', 'Laptop', 'Mouse', 'Mouse', 'Keyboard', 'Keyboard'],
    'revenue': [1000, 1200, 50, 60, 100, 120]
})

print("Sales data:")
print(sales)

# By region
print("\\nRevenue by Region:")
by_region = sales.groupby('region')['revenue'].sum()
print(by_region)

# By product
print("\\nRevenue by Product:")
by_product = sales.groupby('product')['revenue'].sum()
print(by_product)
\`\`\`

## Output
\`\`\`
Revenue by Region:
region
East    1150
West    1380

Revenue by Product:
product
Keyboard     220
Laptop      2200
Mouse        110
\`\`\``,

  explanationContent: `# Deep Dive: GroupBy

## Multiple Aggregations

\`\`\`python
# Get sum, mean, and count at once
sales.groupby('region')['revenue'].agg(['sum', 'mean', 'count'])
\`\`\`

## Group by Multiple Columns

\`\`\`python
# Group by region AND product
sales.groupby(['region', 'product'])['revenue'].sum()
\`\`\`

## Merging Tables

\`\`\`python
# Join two tables on a common column
orders = pd.DataFrame({'order_id': [1, 2], 'customer_id': [101, 102]})
customers = pd.DataFrame({'customer_id': [101, 102], 'name': ['Alice', 'Bob']})

merged = pd.merge(orders, customers, on='customer_id')
\`\`\``,

  realworldContent: `# Real-World Applications

## Sales Dashboard
\`\`\`python
# Monthly totals
monthly = sales.groupby('month')['revenue'].sum()
\`\`\`

## Customer Analysis
\`\`\`python
# Average order by customer
avg_order = orders.groupby('customer_id')['total'].mean()
\`\`\``,

  mistakesContent: `# Common Mistakes

## 1. Forgetting the Column to Aggregate

\`\`\`python
# Wrong - what should be summed?
sales.groupby('region').sum()

# Right - specify the column
sales.groupby('region')['revenue'].sum()
\`\`\`

## 2. Selecting String Columns for Math

\`\`\`python
# Wrong - can't sum names!
sales.groupby('region')['name'].sum()

# Right - sum numeric columns
sales.groupby('region')['revenue'].sum()
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: What does groupby do?
**Answer:** Splits data into groups based on a column, then applies a function (like sum) to each group.

## Q2: How to group by multiple columns?
**Answer:** Pass a list: \`df.groupby(['col1', 'col2'])\``,

  starterCode: `import pandas as pd

sales = pd.DataFrame({
    'region': ['East', 'West', 'East', 'West', 'East', 'West'],
    'product': ['Laptop', 'Laptop', 'Mouse', 'Mouse', 'Keyboard', 'Keyboard'],
    'revenue': [1000, 1200, 50, 60, 100, 120]
})

print("Sales data:")
print(sales)

# 1. Total revenue by region
print("\\nRevenue by Region:")
by_region =
print(by_region)

# 2. Total revenue by product
print("\\nRevenue by Product:")
by_product =
print(by_product)`,

  solutionCode: `import pandas as pd

sales = pd.DataFrame({
    'region': ['East', 'West', 'East', 'West', 'East', 'West'],
    'product': ['Laptop', 'Laptop', 'Mouse', 'Mouse', 'Keyboard', 'Keyboard'],
    'revenue': [1000, 1200, 50, 60, 100, 120]
})

print("Sales data:")
print(sales)

# 1. Total revenue by region
print("\\nRevenue by Region:")
by_region = sales.groupby('region')['revenue'].sum()
print(by_region)

# 2. Total revenue by product
print("\\nRevenue by Product:")
by_product = sales.groupby('product')['revenue'].sum()
print(by_product)`,

  hints: [
    "Use groupby('column') to group",
    "Select the column to sum: ['revenue']",
    "Call .sum() at the end",
    "Pattern: df.groupby('X')['Y'].sum()"
  ]
};
