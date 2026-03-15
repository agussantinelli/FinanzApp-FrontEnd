---
name: readme-auto-sync
description: Mandatory rules for automatically updating README.md when creating files or tests.
---

# README Auto-Sync

This skill defines the mandatory behavior of the AI agent regarding the maintenance of the project's `README.md` file.

## Context
To ensure the project documentation never becomes obsolete, the agent must proactively and automatically update the `README.md` whenever structural changes are made or test coverage is added.

## Mandatory Rules (Guidelines)

1. **Project Structure (Directory Tree)**:
   - **WHEN**: Every time you create, move, or delete a file (`.ts`, `.tsx`, `.css`, etc.) or a directory.
   - **WHAT TO DO**: You must run a command to list relevant files (like `find` or your internal tool) and overwrite the "Project Structure" section in the `README.md` to reflect the exact current state. Ignore irrelevant folders like `node_modules` or `.agent`.

2. **Test Counter**:
   - **WHEN**: Every time you create a new test file (`.test.tsx`, `.spec.ts`) or add/remove tests (Vitest) within an existing file.
   - **WHAT TO DO**: You must run the testing suite (`npx vitest run`), read the console output to get the exact number of passed tests, and update the badge or the "Tests Passing" section in the `README.md` header.

## Proactivity
**DO NOT WAIT** for the user to ask you to update the README. If your actions in a task involve creating or modifying the structure or tests, your final step in that task must be to update the `README.md` to reflect those changes before returning control to the user.
