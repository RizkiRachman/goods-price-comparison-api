# Project Tour: Goods Price Comparison API

**Welcome!** This guide explains what this project is and what all the files do, **written for everyone** - even if you've never written code before.

---

## 📋 Table of Contents

- [What Is This Project?](#what-is-this-project)
- [Project Structure Overview](#project-structure-overview)
- [File-by-File Explanation](#file-by-file-explanation)
- [What Do These Tools Do?](#what-do-these-tools-do)
- [How Does the Team Work?](#how-does-the-team-work)
- [Glossary (Simple Terms)](#glossary-simple-terms)

---

## What Is This Project?

### The Simple Version

This project creates a **digital rulebook** that tells computer programs how to talk to each other about grocery prices.

**Think of it like this:**
- 🏪 **Supermarkets** have price data
- 📱 **Mobile apps** want to show those prices to shoppers
- 📋 **This project** creates the "language" they both understand

### Real-World Example

When you open a price comparison app on your phone:
1. The app asks: "What's the price of milk at Supermarket A?"
2. Supermarket A's computer replies: "It's $3.50"
3. Both sides understand each other because they follow the rules from this project

**This project = The rulebook that makes that conversation possible**

### What It Actually Creates

Instead of building the actual app, this project creates:
- 📄 **Documents** explaining the rules (like a contract)
- 📦 **Building blocks** that developers use to build apps
- ✅ **Quality checks** to make sure everything works correctly

---

## Project Structure Overview

```
goods-price-comparison-api/
├── 📄 Configuration Files
│   ├── pom.xml              ← "Recipe book" for building
│   ├── Dockerfile           ← Instructions for packaging
│   ├── docker-compose.yml   ← "Starter kit" for testing
│   └── .spectral.yaml       ← "Grammar checker" for rules
│
├── 🔧 Automation (GitHub)
│   └── .github/
│       └── workflows/       ← "Robots" that check work
│
├── 📝 API Rules (OpenAPI)
│   └── src/
│       └── main/
│           └── resources/
│               └── openapi/ ← The actual rulebook
│                   ├── main.yaml
│                   ├── paths/     ← "What URLs do"
│                   └── schemas/   ← "What data looks like"
│
├── 📚 Documentation
│   ├── README.md            ← "Start here" guide
│   ├── CONTRIBUTING.md      ← "How to help" guide
│   ├── CHANGELOG.md         ← "What changed" history
│   ├── LICENSE              ← "Usage rights" (MIT)
│   └── docs/
│       ├── GITHUB_WORKFLOWS.md  ← "Robot instructions"
│       └── PROJECT_TOUR.md      ← This file!
│
└── 🤖 AI Assistant Guide
    └── .ai/                 ← "Instructions for AI helpers"
```

---

## File-by-File Explanation

### 🔧 Configuration Files

#### `pom.xml`
**What it is:** A recipe book for computers

**Analogy:** Like a cooking recipe that lists ingredients and steps

**What it does:**
- Lists all the tools needed to build this project
- Tells the computer "use Java version 17"
- Says "download these helper programs"
- Explains how to put everything together

**Simple version:** "Computer, here's what you need and how to build it"

---

#### `Dockerfile`
**What it is:** Packaging instructions

**Analogy:** Like a moving company packing your house into boxes

**What it does:**
- Puts the project into a "container" (like a shipping box)
- Makes sure the container has everything needed to run
- Allows the project to run on any computer, anywhere

**Simple version:** "Put this project in a box that works everywhere"

**Why it's useful:**
- Developer A uses Mac → Project runs ✓
- Developer B uses Windows → Project runs ✓
- Server uses Linux → Project runs ✓
- Same box, anywhere!

---

#### `docker-compose.yml`
**What it is:** A "starter kit" for testing

**Analogy:** Like a LEGO set with instructions - press one button, everything assembles

**What it does:**
- Sets up the project with one command
- Creates a test environment automatically
- No manual setup needed

**Simple version:** "Press this button to test the project instantly"

**Example commands:**
```bash
# Build and test everything
docker-compose up

# Just check the rules
docker-compose up spectral-lint

# Just run tests
docker-compose up api-test
```

---

#### `.spectral.yaml`
**What it is:** A grammar checker for the rulebook

**Analogy:** Like spell-check in Microsoft Word, but for API rules

**What it does:**
- Checks if the API rules are written correctly
- Makes sure all rules follow the same format
- Catches mistakes before they cause problems

**Simple version:** "Make sure our rulebook follows proper format"

**Example checks:**
- ✅ Does every rule have a name?
- ✅ Are all descriptions filled in?
- ✅ Do the data types make sense?

---

#### `Makefile`
**What it is:** Shortcut commands

**Analogy:** Like speed-dial on your phone - press one button, get what you need

**What it does:**
- Creates shortcuts for common tasks
- Instead of typing long commands, type short ones

**Examples:**
```bash
make build     # Instead of: mvn clean compile
make test      # Instead of: mvn test
make lint      # Instead of: spectral lint ...
```

**Simple version:** "Shortcuts so you don't have to remember long commands"

---

### 🔧 Automation (GitHub Folder)

#### `.github/workflows/ci.yml`
**What it is:** A robot that checks the work

**Analogy:** Like a quality inspector in a factory that checks every product

**What it does:**
- Automatically runs whenever someone makes changes
- Checks if the code is correct
- Runs tests to make sure nothing is broken
- Packages everything up

**The Process:**
1. Someone submits changes (Pull Request)
2. Robot automatically:
   - ✅ Checks the grammar (Spectral)
   - ✅ Builds the project (Maven)
   - ✅ Runs tests
   - ✅ Checks code quality
   - ✅ Packages everything
3. Reports: "Everything good!" or "Problems found"

**Simple version:** "Robot that automatically checks every change"

**Why it's useful:**
- Catches mistakes early
- Ensures consistency
- No manual checking needed
- Works 24/7

---

#### `.github/workflows/codeql.yml`
**What it is:** A security guard

**Analogy:** Like a security camera that watches for vulnerabilities

**What it does:**
- Scans code for security problems
- Looks for common mistakes that hackers could exploit
- Runs automatically on a schedule (every Monday)

**What it checks for:**
- 🛡️ Security holes
- 🔒 Unsafe data handling
- 🔑 Hardcoded passwords
- ⚠️ Other security risks

**Simple version:** "Security scanner that watches for problems"

---

### 📝 API Rules (OpenAPI Folder)

#### `src/main/resources/openapi/main.yaml`
**What it is:** The main rulebook

**Analogy:** Like a restaurant menu that lists all available dishes

**What it does:**
- Lists all the "conversations" the API can have
- Says "you can ask about prices here"
- Defines "this is what the answer looks like"

**Simple version:** "The master list of all rules"

---

#### `src/main/resources/openapi/paths/`
**What it is:** Individual conversation rules

**Analogy:** Like chapters in a book - each file covers one topic

**Files in this folder:**
- `receipts.yaml` ← Rules for uploading receipts
- `prices.yaml` ← Rules for checking prices
- `shopping.yaml` ← Rules for shopping routes
- `products.yaml` ← Rules for product trends
- `alerts.yaml` ← Rules for price alerts
- `system.yaml` ← Rules for system info

**Simple version:** "Separate files for each type of conversation"

**Why split them?**
- Easier to find what you need
- Multiple people can work on different files
- No one file becomes too big

---

#### `src/main/resources/openapi/schemas/`
**What it is:** Data templates

**Analogy:** Like forms at the doctor's office - defines what information goes where

**What it does:**
- Defines what data should look like
- Says "a price search needs: product name, location, etc."
- Creates templates for responses

**Files in this folder:**
- `common.yaml` ← Shared stuff (errors, dates)
- `requests.yaml` ← Input templates
- `responses.yaml` ← Output templates
- `models.yaml` ← Data structures
- `v2/prices.yaml` ← Version 2 enhancements

**Simple version:** "Templates that define what data looks like"

---

### 📚 Documentation

#### `README.md`
**What it is:** The "Start Here" guide

**Analogy:** Like the cover and introduction of a book

**What it does:**
- Tells you what the project is
- Shows how to get started
- Lists important information
- Has badges showing status

**Who should read it:** Everyone!

---

#### `CONTRIBUTING.md`
**What it is:** The "How to Help" guide

**Analogy:** Like volunteer instructions at a community center

**What it does:**
- Explains how to suggest changes
- Shows the process for contributing
- Lists rules for submissions
- Provides templates

**Who should read it:** Anyone who wants to help improve the project

---

#### `CHANGELOG.md`
**What it is:** The history book

**Analogy:** Like a diary that records what happened and when

**What it does:**
- Lists all changes made to the project
- Shows version history
- Explains what was added/removed/fixed

**Why it's useful:**
- See what's new
- Track when features were added
- Understand project evolution

---

#### `LICENSE`
**What it is:** The usage rights

**Analogy:** Like terms of service for software

**What it does:**
- Says "you can use this for free"
- Explains what you can and cannot do
- MIT License = Very permissive (do almost anything)

**Simple version:** "This is free to use!"

---

#### `docs/GITHUB_WORKFLOWS.md`
**What it is:** Robot instruction manual

**Analogy:** Like the manual for a complicated appliance

**What it does:**
- Explains how the automation works
- Shows how to modify the robots
- Provides troubleshooting tips

**Who should read it:** Developers who want to understand/improve CI/CD

---

#### `docs/PROJECT_TOUR.md` (This File!)
**What it is:** The friendly guide you're reading now

**What it does:**
- Explains everything in plain English
- No coding knowledge required
- Helps everyone understand the project

---

### 🤖 AI Assistant Guide

#### `.ai/` Folder
**What it is:** Instructions for AI helpers

**Analogy:** Like training materials for new employees

**What it does:**
- Tells AI assistants (like me!) how to help
- Lists coding standards
- Explains project rules
- Provides guidelines for contributions

**Files in this folder:**
- `AGENTS.md` ← Main instructions for AI
- `RULES.md` ← Coding standards
- `PR_WORKFLOW.md` ← How to create pull requests
- `README.md` ← Guide to the guides

**Simple version:** "Instructions so AI can help correctly"

---

## What Do These Tools Do?

### GitHub Actions (The Robots)
**Purpose:** Automatically check and package the code

**Real-world analogy:**
Like an assembly line in a car factory:
- Raw materials come in (code)
- Robots check quality (tests)
- Robots assemble parts (build)
- Finished car comes out (package)

**Benefits:**
- ✅ Catches mistakes automatically
- ✅ Works 24/7 without breaks
- ✅ Consistent every time
- ✅ Frees up humans for creative work

---

### Docker (The Shipping Container)
**Purpose:** Package the project so it works anywhere

**Real-world analogy:**
Like a shipping container for cargo:
- 📦 Put everything in a standard box
- 🚢 Ship it anywhere (Mac, Windows, Linux)
- 🏭 Open it, works the same everywhere

**Benefits:**
- ✅ Works on any computer
- ✅ Same environment everywhere
- ✅ Easy to share
- ✅ No "works on my machine" problems

---

### Spectral (The Grammar Checker)
**Purpose:** Ensure API rules are written correctly

**Real-world analogy:**
Like spell-check and grammar-check in Word:
- 📝 You write something
- 🔍 Tool checks it
- ⚠️ Highlights mistakes
- ✅ Helps you fix them

**Benefits:**
- ✅ Consistent formatting
- ✅ Catches errors early
- ✅ Maintains quality
- ✅ Automated checking

---

### Maven (The Builder)
**Purpose:** Put all the pieces together

**Real-world analogy:**
Like a general contractor building a house:
- 📋 Has a plan (pom.xml)
- 🔧 Gathers materials (downloads dependencies)
- 🏗️ Builds the structure (compiles code)
- 📦 Delivers the finished house (creates package)

**Benefits:**
- ✅ Automatic dependency management
- ✅ Consistent builds
- ✅ One command to build everything
- ✅ Industry standard tool

---

### Git (The Time Machine)
**Purpose:** Track changes and collaborate

**Real-world analogy:**
Like "Track Changes" in Word, but supercharged:
- 📝 Tracks every change
- ⏪ Can go back to any point in time
- 👥 Multiple people can work together
- 🌿 Can create branches (parallel versions)

**Benefits:**
- ✅ Never lose work
- ✅ See who changed what
- ✅ Collaborate safely
- ✅ Experiment without risk

---

## How Does the Team Work?

### The Typical Workflow

1. **Developer has an idea**
   ```
   "I want to add a new feature!"
   ```

2. **Create a branch** (parallel version)
   ```
   git checkout -b feature/my-new-feature
   ```

3. **Make changes**
   - Edit files
   - Add new rules
   - Update documentation

4. **Test locally**
   ```bash
   make lint      # Check grammar
   make build     # Build project
   make test      # Run tests
   ```

5. **Submit for review** (Pull Request)
   ```
   git push origin feature/my-new-feature
   ```

6. **Robots check automatically**
   - ✅ GitHub Actions runs all checks
   - ✅ CodeQL scans for security
   - ✅ Tests must pass

7. **Team reviews**
   - Other developers check the code
   - Suggest improvements
   - Approve if good

8. **Merge to main**
   - Changes become official
   - Automatically published
   - Available for everyone

### Why This Process?

- ✅ **Quality:** Multiple checks catch problems
- ✅ **Safety:** Can't break the main project
- ✅ **Collaboration:** Multiple people work together
- ✅ **History:** Every change is tracked
- ✅ **Automation:** Robots do repetitive work

---

## Glossary (Simple Terms)

### Technical Terms Explained

**API (Application Programming Interface)**
→ A set of rules that let different programs talk to each other

**Endpoint**
→ A specific URL where programs can send requests

**DTO (Data Transfer Object)**
→ A package of data that gets sent between programs

**Linting**
→ Checking code for style and format mistakes

**CI/CD (Continuous Integration/Continuous Deployment)**
→ Automatically building, testing, and releasing code

**Container (Docker)**
→ A package that includes everything needed to run a program

**Pull Request (PR)**
→ A request to add your changes to the main project

**Repository (Repo)**
→ A storage place for code and files

**Schema**
→ A template that defines what data should look like

**Version Control (Git)**
→ A system that tracks all changes to files

**Workflow**
→ An automated process that runs on GitHub

**YAML**
→ A file format that's easy for both humans and computers to read

---

## Quick Reference

### I Want To...

| Task | File/Command |
|------|-------------|
| **Understand the project** | Read `README.md` |
| **See all API rules** | Look in `src/main/resources/openapi/` |
| **Build the project** | Run `make build` |
| **Check code quality** | Run `make lint` |
| **Test everything** | Run `make test` |
| **See what changed** | Read `CHANGELOG.md` |
| **Help contribute** | Read `CONTRIBUTING.md` |
| **Understand automation** | Read `docs/GITHUB_WORKFLOWS.md` |
| **Package for shipping** | Use `Dockerfile` |
| **Test quickly** | Use `docker-compose.yml` |

---

## Need Help?

- 🤔 **Technical questions?** Check `docs/GITHUB_WORKFLOWS.md`
- 🐛 **Found a bug?** Create an issue on GitHub
- 💡 **Have an idea?** Read `CONTRIBUTING.md`
- 📧 **Contact:** rizkifaizalr@gmail.com

---

**Remember:** This project is like a rulebook that helps computers talk about grocery prices. Everything else supports creating, checking, and sharing that rulebook!

*Last Updated: March 2026*
