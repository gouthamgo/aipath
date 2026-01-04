import type { LessonContent } from '../types';

export const fileIO: LessonContent = {
  slug: "file-io",
  problemContent: `# File I/O

Python can read and write files on your computer.

## Reading a File

\`\`\`python
# Open, read, close
file = open("hello.txt", "r")
content = file.read()
file.close()
print(content)
\`\`\`

## The Better Way: with Statement

\`\`\`python
# Automatically closes the file!
with open("hello.txt", "r") as file:
    content = file.read()
    print(content)
\`\`\`

## File Modes

| Mode | Meaning |
|------|---------|
| \`"r"\` | Read (default) |
| \`"w"\` | Write (overwrites!) |
| \`"a"\` | Append (adds to end) |
| \`"r+"\` | Read and write |

## Writing to a File

\`\`\`python
with open("output.txt", "w") as file:
    file.write("Hello, World!")
    file.write("\\nSecond line")
\`\`\`

## Reading Line by Line

\`\`\`python
with open("data.txt", "r") as file:
    for line in file:
        print(line.strip())  # strip removes \\n
\`\`\`

## Your Task

Write a function \`save_notes(filename, notes)\` that:
1. Opens the file in write mode
2. Writes each note on a new line
3. Use the \`with\` statement`,

  solutionContent: `# Solution: File I/O

\`\`\`python
def save_notes(filename, notes):
    with open(filename, "w") as file:
        for note in notes:
            file.write(note + "\\n")

# Test it
notes = ["Buy groceries", "Call mom", "Finish homework"]
save_notes("notes.txt", notes)

# Verify by reading
with open("notes.txt", "r") as file:
    print(file.read())
\`\`\`

## Output
\`\`\`
Buy groceries
Call mom
Finish homework
\`\`\`

## Alternative: Using writelines

\`\`\`python
def save_notes(filename, notes):
    with open(filename, "w") as file:
        file.writelines(note + "\\n" for note in notes)
\`\`\``,

  explanationContent: `# Deep Dive: File I/O

## Reading Methods

\`\`\`python
with open("file.txt") as f:
    # Read entire file as string
    content = f.read()

    # Read one line
    line = f.readline()

    # Read all lines into list
    lines = f.readlines()
\`\`\`

## Working with Paths

\`\`\`python
from pathlib import Path

# Modern way to handle paths
path = Path("data") / "file.txt"

# Check if file exists
if path.exists():
    content = path.read_text()

# Write easily
path.write_text("Hello!")

# Get file info
print(path.name)      # file.txt
print(path.suffix)    # .txt
print(path.parent)    # data
\`\`\`

## Working with CSV

\`\`\`python
import csv

# Reading CSV
with open("data.csv") as f:
    reader = csv.reader(f)
    for row in reader:
        print(row)  # Each row is a list

# Writing CSV
with open("output.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["Name", "Age"])
    writer.writerow(["Alice", 25])
\`\`\`

## Working with JSON

\`\`\`python
import json

# Reading JSON
with open("data.json") as f:
    data = json.load(f)

# Writing JSON
with open("output.json", "w") as f:
    json.dump({"name": "Alice", "age": 25}, f, indent=2)
\`\`\``,

  realworldContent: `# Real-World Applications

## 1. Configuration Files

\`\`\`python
import json

def load_config(filename="config.json"):
    try:
        with open(filename) as f:
            return json.load(f)
    except FileNotFoundError:
        return {"debug": False, "port": 8080}

def save_config(config, filename="config.json"):
    with open(filename, "w") as f:
        json.dump(config, f, indent=2)

config = load_config()
config["debug"] = True
save_config(config)
\`\`\`

## 2. Log File

\`\`\`python
from datetime import datetime

def log(message, filename="app.log"):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open(filename, "a") as f:
        f.write(f"[{timestamp}] {message}\\n")

log("Application started")
log("User logged in")
\`\`\`

## 3. Data Processing

\`\`\`python
def process_sales(input_file, output_file):
    total = 0
    with open(input_file) as f:
        for line in f:
            amount = float(line.strip())
            total += amount

    with open(output_file, "w") as f:
        f.write(f"Total Sales: \${total:.2f}")
\`\`\`

## 4. Backup System

\`\`\`python
from pathlib import Path
from datetime import datetime

def backup_file(filepath):
    path = Path(filepath)
    if not path.exists():
        return False

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = path.with_suffix(f".{timestamp}.bak")
    backup_path.write_text(path.read_text())
    return True
\`\`\``,

  mistakesContent: `# Common Mistakes to Avoid

## 1. Forgetting to Close Files

\`\`\`python
# ❌ Wrong - file never closed
file = open("data.txt")
data = file.read()
# file.close() is missing!

# ✅ Correct - with statement auto-closes
with open("data.txt") as file:
    data = file.read()
\`\`\`

## 2. Wrong Mode

\`\`\`python
# ❌ Wrong - "w" deletes existing content!
with open("important.txt", "w") as f:
    f.write("new data")  # Old data is gone!

# ✅ Correct - "a" appends
with open("important.txt", "a") as f:
    f.write("new data")  # Added to end
\`\`\`

## 3. Not Handling Missing Files

\`\`\`python
# ❌ Wrong - crashes if file doesn't exist
with open("missing.txt") as f:
    data = f.read()

# ✅ Correct - handle the error
try:
    with open("missing.txt") as f:
        data = f.read()
except FileNotFoundError:
    data = ""
\`\`\`

## 4. Forgetting Newlines

\`\`\`python
# ❌ Wrong - all on one line
with open("output.txt", "w") as f:
    f.write("Line 1")
    f.write("Line 2")  # Result: "Line 1Line 2"

# ✅ Correct - add newlines
with open("output.txt", "w") as f:
    f.write("Line 1\\n")
    f.write("Line 2\\n")
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: What's the advantage of using 'with' for file operations?

**Answer:** The \`with\` statement automatically closes the file when done, even if an error occurs. This prevents resource leaks.

\`\`\`python
with open("file.txt") as f:
    data = f.read()
# File is auto-closed here
\`\`\`

## Q2: What's the difference between read(), readline(), and readlines()?

**Answer:**
- \`read()\` - Returns entire file as one string
- \`readline()\` - Returns one line at a time
- \`readlines()\` - Returns list of all lines

## Q3: How do you append to a file without overwriting?

**Answer:** Use mode \`"a"\` instead of \`"w"\`:

\`\`\`python
with open("log.txt", "a") as f:
    f.write("New entry\\n")
\`\`\`

## Q4: How do you read a file line by line efficiently?

**Answer:** Iterate over the file object directly:

\`\`\`python
with open("large_file.txt") as f:
    for line in f:  # Memory efficient!
        process(line)
\`\`\`

This is memory-efficient because it doesn't load the entire file at once.`,

  starterCode: `# File I/O
# Create a function to save notes to a file!

def save_notes(filename, notes):
    # Open file in write mode using 'with'
    # Write each note on a new line


# Test your function
notes = ["Buy groceries", "Call mom", "Finish homework"]
save_notes("notes.txt", notes)
print("Notes saved!")`,

  solutionCode: `# File I/O
# Create a function to save notes to a file!

def save_notes(filename, notes):
    # Open file in write mode using 'with'
    # Write each note on a new line
    with open(filename, "w") as file:
        for note in notes:
            file.write(note + "\\n")

# Test your function
notes = ["Buy groceries", "Call mom", "Finish homework"]
save_notes("notes.txt", notes)
print("Notes saved!")`,

  hints: [
    "Use: with open(filename, \"w\") as file:",
    "Loop through notes with: for note in notes:",
    "Write each note: file.write(note + \"\\n\")",
    "The \\n adds a new line after each note",
  ],
};
