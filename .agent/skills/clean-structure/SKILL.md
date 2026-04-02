---
name: clean-structure
description: Component organization and modern React principles for the FrontEnd.
---

# Clean Structure (FrontEnd)

## Context
A well-organized frontend is easier to maintain and scale. This project uses Next.js with the App Router.

## Guidelines
1. **Folders**:
   - `src/app`: Page components and routing (App Router).
   - `src/components`: UI components.
   - `src/hooks`: Custom React hooks (logic, state, side effects).
   - `src/services`: API communication layer.
   - `src/types`: TypeScript definitions.
   - `src/utils`: Pure helper functions and shared logic.
   - `src/theme`: Global styles, themes, and design tokens.
2. **Logic separation**:
   - Keep components focused on UI.
   - Extract stateful logic to **Custom Hooks**.
   - Extract complex calculations or formatting to **Utils**.
   - Extract API calls to **Services**.
3. **Consistency**: Use a consistent naming convention (PascalCase for components, camelCase for hooks and utils).
4. **Testing**: Every logic file (hooks, utils, services) MUST have a corresponding `.test.ts` file in a nested `tests/` directory (except in `src/app/`).
