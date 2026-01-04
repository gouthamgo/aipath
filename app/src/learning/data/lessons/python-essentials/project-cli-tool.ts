import type { LessonContent } from '../types';

export const projectCLI: LessonContent = {
  slug: "project-cli-tool",
  problemContent: `# Project: Build a CLI To-Do App

Time to combine everything you've learned! Build a command-line to-do list application.

## Requirements

1. **Add tasks** to a list
2. **View all tasks** with numbers
3. **Mark tasks as done**
4. **Save tasks** to a file
5. **Load tasks** when starting

## Program Structure

\`\`\`python
class TodoApp:
    def __init__(self):
        self.tasks = []
        self.load_tasks()

    def add_task(self, task):
        # Add task to list

    def show_tasks(self):
        # Display all tasks

    def complete_task(self, index):
        # Mark task as done

    def save_tasks(self):
        # Save to file

    def load_tasks(self):
        # Load from file
\`\`\`

## Your Task

Implement the TodoApp class with all methods. The app should:
- Store tasks as dictionaries: \`{"text": "...", "done": False}\`
- Save/load from "todos.txt" as JSON
- Handle errors gracefully`,

  solutionContent: `# Solution: CLI To-Do App

\`\`\`python
import json

class TodoApp:
    def __init__(self, filename="todos.json"):
        self.filename = filename
        self.tasks = []
        self.load_tasks()

    def add_task(self, text):
        task = {"text": text, "done": False}
        self.tasks.append(task)
        self.save_tasks()
        print(f"Added: {text}")

    def show_tasks(self):
        if not self.tasks:
            print("No tasks yet!")
            return

        print("\\n--- Your Tasks ---")
        for i, task in enumerate(self.tasks, 1):
            status = "✓" if task["done"] else " "
            print(f"{i}. [{status}] {task['text']}")
        print()

    def complete_task(self, index):
        try:
            task = self.tasks[index - 1]
            task["done"] = True
            self.save_tasks()
            print(f"Completed: {task['text']}")
        except IndexError:
            print("Invalid task number!")

    def save_tasks(self):
        with open(self.filename, "w") as f:
            json.dump(self.tasks, f)

    def load_tasks(self):
        try:
            with open(self.filename) as f:
                self.tasks = json.load(f)
        except FileNotFoundError:
            self.tasks = []

# Usage
app = TodoApp()
app.add_task("Learn Python")
app.add_task("Build projects")
app.show_tasks()
app.complete_task(1)
app.show_tasks()
\`\`\``,

  explanationContent: `# Deep Dive: Building CLI Apps

## Program Design

A good CLI app follows these principles:

1. **Separation of concerns** - Each method does one thing
2. **Persistence** - Data survives between runs
3. **Error handling** - Graceful failures
4. **User feedback** - Clear messages

## Adding a Menu Loop

\`\`\`python
def run(self):
    while True:
        print("\\n1. Add task")
        print("2. Show tasks")
        print("3. Complete task")
        print("4. Exit")

        choice = input("\\nChoice: ")

        if choice == "1":
            text = input("Task: ")
            self.add_task(text)
        elif choice == "2":
            self.show_tasks()
        elif choice == "3":
            num = int(input("Task number: "))
            self.complete_task(num)
        elif choice == "4":
            print("Goodbye!")
            break
        else:
            print("Invalid choice")
\`\`\`

## Command Line Arguments

\`\`\`python
import sys

if len(sys.argv) > 1:
    command = sys.argv[1]

    if command == "add" and len(sys.argv) > 2:
        app.add_task(sys.argv[2])
    elif command == "list":
        app.show_tasks()
    elif command == "done" and len(sys.argv) > 2:
        app.complete_task(int(sys.argv[2]))
\`\`\`

## Better CLI with argparse

\`\`\`python
import argparse

parser = argparse.ArgumentParser(description="Todo App")
parser.add_argument("command", choices=["add", "list", "done"])
parser.add_argument("--task", "-t", help="Task text")
parser.add_argument("--id", "-i", type=int, help="Task ID")

args = parser.parse_args()
\`\`\``,

  realworldContent: `# Real-World Applications

## 1. Note-Taking App

\`\`\`python
class NoteApp:
    def __init__(self):
        self.notes = {}
        self.load_notes()

    def add_note(self, title, content):
        self.notes[title] = {
            "content": content,
            "created": datetime.now().isoformat()
        }
        self.save_notes()

    def search_notes(self, query):
        results = []
        for title, note in self.notes.items():
            if query.lower() in title.lower():
                results.append(title)
            elif query.lower() in note["content"].lower():
                results.append(title)
        return results
\`\`\`

## 2. Expense Tracker

\`\`\`python
class ExpenseTracker:
    def __init__(self):
        self.expenses = []

    def add_expense(self, amount, category, description):
        self.expenses.append({
            "amount": amount,
            "category": category,
            "description": description,
            "date": datetime.now().isoformat()
        })

    def get_total(self, category=None):
        if category:
            return sum(e["amount"] for e in self.expenses
                      if e["category"] == category)
        return sum(e["amount"] for e in self.expenses)
\`\`\`

## 3. Password Manager (Basic)

\`\`\`python
class PasswordManager:
    def __init__(self, master_password):
        self.master = master_password
        self.passwords = {}

    def add_password(self, site, username, password):
        self.passwords[site] = {
            "username": username,
            "password": password  # In real app: encrypt this!
        }

    def get_password(self, site, master):
        if master != self.master:
            raise ValueError("Wrong master password!")
        return self.passwords.get(site)
\`\`\``,

  mistakesContent: `# Common Mistakes to Avoid

## 1. Not Saving After Changes

\`\`\`python
# ❌ Wrong - changes lost on exit
def add_task(self, task):
    self.tasks.append(task)
    # Forgot to save!

# ✅ Correct - always save
def add_task(self, task):
    self.tasks.append(task)
    self.save_tasks()
\`\`\`

## 2. Not Handling Empty Input

\`\`\`python
# ❌ Wrong - crashes on empty input
num = int(input("Task number: "))  # ValueError if empty!

# ✅ Correct - validate input
try:
    num = int(input("Task number: "))
    self.complete_task(num)
except ValueError:
    print("Please enter a number!")
\`\`\`

## 3. Off-by-One Errors

\`\`\`python
# ❌ Wrong - users think in 1-indexed
def complete_task(self, index):
    self.tasks[index]["done"] = True  # User enters 1, gets task 2!

# ✅ Correct - convert to 0-indexed
def complete_task(self, index):
    self.tasks[index - 1]["done"] = True
\`\`\`

## 4. No Input Validation

\`\`\`python
# ❌ Wrong - can crash
def complete_task(self, index):
    self.tasks[index - 1]["done"] = True

# ✅ Correct - check bounds
def complete_task(self, index):
    if 1 <= index <= len(self.tasks):
        self.tasks[index - 1]["done"] = True
    else:
        print("Invalid task number!")
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: How would you structure a CLI application?

**Answer:** Use a class to encapsulate state and behavior:
- Constructor initializes state and loads data
- Methods for each operation (add, list, complete)
- Save/load methods for persistence
- Main loop handles user input

## Q2: How do you handle user input safely?

**Answer:**
1. Validate input type (use try/except for conversions)
2. Check bounds (array indices)
3. Handle empty input
4. Provide clear error messages

\`\`\`python
try:
    num = int(input("Enter number: "))
    if 1 <= num <= len(items):
        process(items[num - 1])
    else:
        print("Number out of range")
except ValueError:
    print("Please enter a valid number")
\`\`\`

## Q3: How would you add data persistence?

**Answer:** Use JSON for structured data:

\`\`\`python
import json

def save(data, filename):
    with open(filename, "w") as f:
        json.dump(data, f)

def load(filename):
    try:
        with open(filename) as f:
            return json.load(f)
    except FileNotFoundError:
        return []
\`\`\`

## Q4: How would you test a CLI app?

**Answer:**
- Separate logic from I/O (pure functions are easier to test)
- Mock user input with unittest.mock
- Test each method independently
- Test edge cases (empty list, invalid input)`,

  starterCode: `# Project: CLI To-Do App
import json

class TodoApp:
    def __init__(self):
        self.tasks = []
        self.load_tasks()

    def add_task(self, text):
        # Create task dict with "text" and "done": False
        # Add to self.tasks and save


    def show_tasks(self):
        # Print all tasks with numbers
        # Show [✓] for done, [ ] for not done


    def complete_task(self, index):
        # Mark task at index-1 as done (user uses 1-based)
        # Handle invalid index


    def save_tasks(self):
        # Save self.tasks to "todos.json" as JSON


    def load_tasks(self):
        # Load tasks from "todos.json"
        # If file doesn't exist, use empty list


# Test your app
app = TodoApp()
app.add_task("Learn Python")
app.add_task("Build projects")
app.show_tasks()`,

  solutionCode: `# Project: CLI To-Do App
import json

class TodoApp:
    def __init__(self):
        self.tasks = []
        self.load_tasks()

    def add_task(self, text):
        task = {"text": text, "done": False}
        self.tasks.append(task)
        self.save_tasks()
        print(f"Added: {text}")

    def show_tasks(self):
        if not self.tasks:
            print("No tasks yet!")
            return
        for i, task in enumerate(self.tasks, 1):
            status = "✓" if task["done"] else " "
            print(f"{i}. [{status}] {task['text']}")

    def complete_task(self, index):
        if 1 <= index <= len(self.tasks):
            self.tasks[index - 1]["done"] = True
            self.save_tasks()
            print("Task completed!")
        else:
            print("Invalid task number!")

    def save_tasks(self):
        with open("todos.json", "w") as f:
            json.dump(self.tasks, f)

    def load_tasks(self):
        try:
            with open("todos.json") as f:
                self.tasks = json.load(f)
        except FileNotFoundError:
            self.tasks = []

# Test your app
app = TodoApp()
app.add_task("Learn Python")
app.add_task("Build projects")
app.show_tasks()`,

  hints: [
    "For add_task: create a dict {\"text\": text, \"done\": False}",
    "For show_tasks: use enumerate(self.tasks, 1) for 1-based numbering",
    "For complete_task: check if index is valid before accessing",
    "For save/load: use json.dump() and json.load()",
  ],
};
