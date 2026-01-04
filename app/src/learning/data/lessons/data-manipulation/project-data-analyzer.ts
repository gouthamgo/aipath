import type { LessonContent } from '../types';

export const projectDataAnalyzer: LessonContent = {
  slug: "project-data-analyzer",
  problemContent: `# Project: Build a Data Analyzer

Put it all together! Build a tool that analyzes sales data.

## What You'll Build

A class that can:
1. Load data
2. Show summary stats
3. Group by category
4. Find top products

## Starter Code

\`\`\`python
class SalesAnalyzer:
    def __init__(self):
        self.df = self.create_sample_data()

    def get_summary(self):
        # Return total revenue, order count, average
        pass

    def revenue_by_category(self):
        # Group by category
        pass

    def top_products(self, n=5):
        # Find top n products
        pass
\`\`\`

## Your Task

1. Complete \`get_summary()\` - return a dict with totals
2. Complete \`revenue_by_category()\` - group and sum
3. Complete \`top_products()\` - find top sellers`,

  solutionContent: `# Solution: Data Analyzer

\`\`\`python
import pandas as pd
import numpy as np

class SalesAnalyzer:
    def __init__(self):
        self.df = self.create_sample_data()

    def create_sample_data(self):
        np.random.seed(42)
        n = 100
        df = pd.DataFrame({
            'product': [f'Product {i%20}' for i in range(n)],
            'category': np.random.choice(['Electronics', 'Clothing', 'Home'], n),
            'units': np.random.randint(10, 200, n),
            'price': np.round(np.random.uniform(10, 100, n), 2)
        })
        df['revenue'] = df['units'] * df['price']
        return df

    def get_summary(self):
        return {
            'total_revenue': round(self.df['revenue'].sum(), 2),
            'total_orders': len(self.df),
            'avg_order': round(self.df['revenue'].mean(), 2)
        }

    def revenue_by_category(self):
        return self.df.groupby('category')['revenue'].sum().sort_values(ascending=False)

    def top_products(self, n=5):
        return self.df.groupby('product')['revenue'].sum().nlargest(n)

# Test it!
analyzer = SalesAnalyzer()
print("Summary:", analyzer.get_summary())
print("\\nBy Category:")
print(analyzer.revenue_by_category())
print("\\nTop 5 Products:")
print(analyzer.top_products())
\`\`\``,

  explanationContent: `# How It Works

## The Class Structure

\`\`\`python
class SalesAnalyzer:
    def __init__(self):
        # Runs when you create the analyzer
        self.df = self.create_sample_data()
\`\`\`

## Key Methods

1. **get_summary()** - Uses .sum(), len(), .mean()
2. **revenue_by_category()** - Uses groupby().sum()
3. **top_products()** - Uses groupby().sum().nlargest()`,

  realworldContent: `# Real-World Applications

This pattern is used everywhere:

## Business Dashboards
Same structure, different data sources

## Report Generation
Add methods like \`export_to_excel()\`

## Automated Analysis
Run daily to track trends`,

  mistakesContent: `# Common Mistakes

## 1. Forgetting self

\`\`\`python
# Wrong
def get_summary():
    return df['revenue'].sum()

# Right
def get_summary(self):
    return self.df['revenue'].sum()
\`\`\`

## 2. Not Returning

\`\`\`python
# Wrong - prints but doesn't return
def get_summary(self):
    print(self.df['revenue'].sum())

# Right - returns the value
def get_summary(self):
    return self.df['revenue'].sum()
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: Why use a class?
**Answer:** Organizes related functions together. Keeps data (self.df) and methods in one place.

## Q2: How would you add caching?
**Answer:** Store results in self.cache dict. Check cache before calculating.`,

  starterCode: `import pandas as pd
import numpy as np

class SalesAnalyzer:
    def __init__(self):
        self.df = self.create_sample_data()

    def create_sample_data(self):
        np.random.seed(42)
        n = 100
        df = pd.DataFrame({
            'product': [f'Product {i%20}' for i in range(n)],
            'category': np.random.choice(['Electronics', 'Clothing', 'Home'], n),
            'units': np.random.randint(10, 200, n),
            'price': np.round(np.random.uniform(10, 100, n), 2)
        })
        df['revenue'] = df['units'] * df['price']
        return df

    def get_summary(self):
        # TODO: Return dict with total_revenue, total_orders, avg_order
        pass

    def revenue_by_category(self):
        # TODO: Group by category and sum revenue
        pass

    def top_products(self, n=5):
        # TODO: Find top n products by revenue
        pass

# Test
analyzer = SalesAnalyzer()
print("Summary:", analyzer.get_summary())`,

  solutionCode: `import pandas as pd
import numpy as np

class SalesAnalyzer:
    def __init__(self):
        self.df = self.create_sample_data()

    def create_sample_data(self):
        np.random.seed(42)
        n = 100
        df = pd.DataFrame({
            'product': [f'Product {i%20}' for i in range(n)],
            'category': np.random.choice(['Electronics', 'Clothing', 'Home'], n),
            'units': np.random.randint(10, 200, n),
            'price': np.round(np.random.uniform(10, 100, n), 2)
        })
        df['revenue'] = df['units'] * df['price']
        return df

    def get_summary(self):
        return {
            'total_revenue': round(self.df['revenue'].sum(), 2),
            'total_orders': len(self.df),
            'avg_order': round(self.df['revenue'].mean(), 2)
        }

    def revenue_by_category(self):
        return self.df.groupby('category')['revenue'].sum().sort_values(ascending=False)

    def top_products(self, n=5):
        return self.df.groupby('product')['revenue'].sum().nlargest(n)

# Test
analyzer = SalesAnalyzer()
print("Summary:", analyzer.get_summary())
print("\\nBy Category:")
print(analyzer.revenue_by_category())
print("\\nTop 5:")
print(analyzer.top_products())`,

  hints: [
    "get_summary: use .sum(), len(), .mean()",
    "revenue_by_category: groupby('category')['revenue'].sum()",
    "top_products: use .nlargest(n) after groupby",
    "Don't forget to return, not just print!"
  ]
};
