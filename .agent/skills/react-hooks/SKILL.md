---
name: react-hooks
description: Guidelines for creating and maintaining custom React hooks in FinanzApp Frontend.
---

# React Hooks Skill

This skill ensures that all custom hooks follow best practices for maintainability, testability, and performance.

## Core Rules

1.  **Naming Convention**: All custom hooks MUST start with the prefix `use` (e.g., `useAuth`, `useOrders`).
2.  **One Hook per File**: Each hook must reside in its own file named after the hook (e.g., `src/hooks/useAuth.ts`).
3.  **Separation of Concerns**:
    *   Hooks should focus on state management and side effects.
    *   **Logic Extraction**: Any complex business logic, data transformation, or validation should be extracted to `src/utils/` to keep the hook clean and easily testable.
    *   Hooks should use services from `src/services/` for API interactions.
4.  **Mandatory Testing**: Every hook MUST have a corresponding `.test.ts` file in the same directory.
5.  **State Management**: Avoid deep nesting of state. Use `useReducer` for complex state logic or break the hook into smaller, specialized hooks.

## Example Structure

```typescript
// src/hooks/useLogin.ts
import { useState } from 'react';
import { login } from '@/services/AuthService';
import { validateLogin } from '@/utils/auth-validation'; // Logic extracted to utils

export function useLogin() {
    const [loading, setLoading] = useState(false);
    // ... logic using services and utils
    return { loading, /* ... */ };
}
```

## Rationale
Extracting logic to `utils` allows testing business rules in isolation without needing to mock the React environment (hooks), leading to more robust and faster tests.
