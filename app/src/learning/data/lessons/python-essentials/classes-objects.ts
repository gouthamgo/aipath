import type { LessonContent } from '../types';

export const classesObjects: LessonContent = {
  slug: "classes-objects",
  problemContent: `# Classes & Objects

Classes let you create your own data types. Think of a class as a **blueprint** for creating objects.

## Creating a Class

\`\`\`python
class Dog:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def bark(self):
        print(f"{self.name} says woof!")

# Create an object (instance)
my_dog = Dog("Buddy", 3)
print(my_dog.name)  # Buddy
my_dog.bark()       # Buddy says woof!
\`\`\`

## Key Concepts

| Term | Meaning |
|------|---------|
| **class** | A blueprint for creating objects |
| **object** | An instance of a class |
| **\`__init__\`** | Constructor - runs when you create an object |
| **self** | Reference to the current object |
| **attribute** | Variable belonging to an object |
| **method** | Function belonging to a class |

## Your Task

Create a \`Person\` class with:
1. \`__init__\` that takes \`name\` and \`age\`
2. A \`greet\` method that prints a greeting
3. Create a person and call their greet method`,

  solutionContent: `# Solution: Classes & Objects

\`\`\`python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def greet(self):
        print(f"Hi, I'm {self.name} and I'm {self.age} years old!")

# Create an instance
person = Person("Alice", 25)
person.greet()  # Hi, I'm Alice and I'm 25 years old!
\`\`\`

## How it works:
1. \`class Person:\` defines the blueprint
2. \`__init__\` stores name and age as attributes
3. \`greet\` is a method that uses those attributes
4. \`Person("Alice", 25)\` creates an object
5. \`person.greet()\` calls the method`,

  explanationContent: `# Deep Dive: Classes & Objects

## Why Use Classes?

Classes help you organize related data and functions together:

\`\`\`python
# Without classes - scattered data
user_name = "Alice"
user_email = "alice@mail.com"
user_age = 25

def user_greet():
    print(f"Hi, {user_name}")

# With classes - organized
class User:
    def __init__(self, name, email, age):
        self.name = name
        self.email = email
        self.age = age

    def greet(self):
        print(f"Hi, {self.name}")
\`\`\`

## Instance vs Class Attributes

\`\`\`python
class Dog:
    species = "Canis familiaris"  # Class attribute - shared

    def __init__(self, name):
        self.name = name  # Instance attribute - unique

dog1 = Dog("Buddy")
dog2 = Dog("Max")

print(dog1.species)  # Canis familiaris
print(dog2.species)  # Canis familiaris (same)
print(dog1.name)     # Buddy
print(dog2.name)     # Max (different)
\`\`\`

## String Representation

\`\`\`python
class Person:
    def __init__(self, name):
        self.name = name

    def __str__(self):
        return f"Person: {self.name}"

    def __repr__(self):
        return f"Person('{self.name}')"

p = Person("Alice")
print(p)      # Person: Alice
print(repr(p))  # Person('Alice')
\`\`\``,

  realworldContent: `# Real-World Applications

## 1. User Account System

\`\`\`python
class User:
    def __init__(self, username, email):
        self.username = username
        self.email = email
        self.is_active = True
        self.login_count = 0

    def login(self):
        self.login_count += 1
        print(f"{self.username} logged in!")

    def deactivate(self):
        self.is_active = False

user = User("john_doe", "john@mail.com")
user.login()  # john_doe logged in!
\`\`\`

## 2. Shopping Cart

\`\`\`python
class ShoppingCart:
    def __init__(self):
        self.items = []

    def add_item(self, name, price):
        self.items.append({"name": name, "price": price})

    def total(self):
        return sum(item["price"] for item in self.items)

    def checkout(self):
        print(f"Total: \${self.total():.2f}")

cart = ShoppingCart()
cart.add_item("Laptop", 999.99)
cart.add_item("Mouse", 29.99)
cart.checkout()  # Total: $1029.98
\`\`\`

## 3. Game Character

\`\`\`python
class Character:
    def __init__(self, name, health=100):
        self.name = name
        self.health = health
        self.level = 1

    def take_damage(self, amount):
        self.health -= amount
        if self.health <= 0:
            print(f"{self.name} has been defeated!")

    def level_up(self):
        self.level += 1
        self.health = 100
        print(f"{self.name} reached level {self.level}!")
\`\`\``,

  mistakesContent: `# Common Mistakes to Avoid

## 1. Forgetting self

\`\`\`python
# ❌ Wrong - missing self parameter
class Dog:
    def bark():
        print("Woof!")

# ✅ Correct
class Dog:
    def bark(self):
        print("Woof!")
\`\`\`

## 2. Forgetting self When Accessing Attributes

\`\`\`python
# ❌ Wrong - name is undefined
class Dog:
    def __init__(self, name):
        self.name = name

    def greet(self):
        print(f"I am {name}")  # Error!

# ✅ Correct
class Dog:
    def __init__(self, name):
        self.name = name

    def greet(self):
        print(f"I am {self.name}")
\`\`\`

## 3. Not Calling __init__ Properly

\`\`\`python
# ❌ Wrong - calling without parentheses
dog = Dog

# ✅ Correct
dog = Dog("Buddy", 3)
\`\`\`

## 4. Modifying Class Attributes by Mistake

\`\`\`python
# ❌ Dangerous - mutable class attribute
class Dog:
    tricks = []  # Shared by ALL dogs!

    def add_trick(self, trick):
        self.tricks.append(trick)

# ✅ Correct - instance attribute
class Dog:
    def __init__(self):
        self.tricks = []  # Each dog has own list
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: What is the difference between a class and an object?

**Answer:**
- **Class**: A blueprint or template
- **Object**: An instance created from that blueprint

\`\`\`python
class Car:      # Class (blueprint)
    pass

my_car = Car()  # Object (instance)
\`\`\`

## Q2: What is self in Python?

**Answer:** \`self\` refers to the current instance of the class. It's how methods access the object's attributes.

\`\`\`python
class Dog:
    def __init__(self, name):
        self.name = name  # self.name is this object's name
\`\`\`

## Q3: What is __init__?

**Answer:** The constructor method. It runs automatically when you create a new object and is used to initialize attributes.

## Q4: What is the difference between instance and class attributes?

**Answer:**
- **Instance attributes**: Unique to each object (defined with \`self.\`)
- **Class attributes**: Shared by all objects (defined outside \`__init__\`)

\`\`\`python
class Dog:
    species = "Canis"  # Class attribute

    def __init__(self, name):
        self.name = name  # Instance attribute
\`\`\``,

  starterCode: `# Classes & Objects
# Create a Person class!

class Person:
    def __init__(self, name, age):
        # Store name and age as attributes


    def greet(self):
        # Print: "Hi, I'm {name} and I'm {age} years old!"


# Create a person and call greet
person = Person("Alice", 25)
person.greet()`,

  solutionCode: `# Classes & Objects
# Create a Person class!

class Person:
    def __init__(self, name, age):
        # Store name and age as attributes
        self.name = name
        self.age = age

    def greet(self):
        # Print: "Hi, I'm {name} and I'm {age} years old!"
        print(f"Hi, I'm {self.name} and I'm {self.age} years old!")

# Create a person and call greet
person = Person("Alice", 25)
person.greet()`,

  hints: [
    "Use self.name = name to store the name attribute",
    "Use self.age = age to store the age attribute",
    "In greet, use self.name and self.age to access the attributes",
    "Use an f-string: print(f\"Hi, I'm {self.name}...\")",
  ],
};
