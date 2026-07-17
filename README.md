# Task Tracker CLI

A command-line interface (CLI) application to track and manage your tasks, built with **Node.js**.

Project URL: https://roadmap.sh/projects/task-tracker

This project is a solution to the [Task Tracker](https://roadmap.sh/projects/task-tracker) challenge on [roadmap.sh](https://roadmap.sh).

## Features

- **Add** new tasks with a description (defaults to `todo` status)
- **Update** task descriptions
- **Delete** tasks
- **Mark** tasks as `in-progress` or `done`
- **List** all tasks, or filter tasks by status (`todo`, `in-progress`, `done`)
- **Data Persistence**: Tasks are saved in a local JSON file (`task.json`).

## Setup and Installation

1. **Prerequisites**: Make sure you have [Node.js](https://nodejs.org/) installed (v16.0.0 or higher recommended).
2. **Navigate to the project directory**:
   ```bash
   cd task_tracker_cli
   ```
3. **Configure package type**: If not already present, ensure `"type": "module"` is configured in `package.json` to allow ES import syntax.

## Usage Guide

All commands are run using `node index.js <command> [arguments]`.

### 1. Add a new task
```bash
node index.js add "Buy groceries"
# Output: Thêm công việc thành công (ID: 1)
```

### 2. Update a task description
```bash
node index.js update <id> "New task description"
# Example:
node index.js update 1 "Buy groceries and cook dinner"
```

### 3. Delete a task
```bash
node index.js delete <id>
# Example:
node index.js delete 1
```

### 4. Update task status
```bash
# Mark a task as in-progress
node index.js mark-in-progress <id>

# Mark a task as done
node index.js mark-done <id>
```

### 5. List tasks
```bash
# List all tasks
node index.js list

# List only 'todo' tasks
node index.js list todo

# List only 'in-progress' tasks
node index.js list in-progress

# List only 'done' tasks
node index.js list done
```

## Tech Stack
- Language: JavaScript (Node.js runtime)
- Native Modules: `fs/promises`, `path`
- Data format: JSON (`task.json`)
