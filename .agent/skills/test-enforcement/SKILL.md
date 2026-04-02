---
name: test-enforcement
description: Mandatory rule requiring a corresponding test file for every business logic file and UI component.
---

# Test Enforcement (FrontEnd)

## Context
To maintain 100% reliability and prevent visual or logic regressions in the FinanzApp Frontend, it is OBLIGATORY that every file containing business logic, services, stores, or UI components has a corresponding test file.

## Guidelines
1. **Rule of One**: Every `.ts` or `.tsx` file in `src/services`, `src/store`, `src/utils`, `src/hooks`, or `src/components` MUST have a matching `.test.ts` or `.test.tsx` file.
2. **Location**: Test files MUST be located in a nested `tests/` directory within the same directory as the source file (Except for `src/app/`, where they remain in the same directory).
3. **Naming**: If the file is `useAuth.ts`, the test file MUST be `useAuth.test.ts`.
4. **Content**:
    - **Logic/Services/Hooks**: Tests must cover main success paths and edge cases.
    - **Components**: Tests must cover rendering, user interaction, and state changes (using Vitest + React Testing Library).
5. **Simultaneous Creation/Modification**: If a testable file is created, its corresponding test file MUST be created simultaneously in the same step. If a functional file is modified (logic altered), its corresponding test file MUST be modified simultaneously to reflect those changes. Never leave tests outdated.

## Examples

### Correct Structure (Logic/Utils/Hooks)
```
src/hooks/
├── useAuth.ts
└── tests/
    └── useAuth.test.ts
```

### Correct Structure (App Router - Exception)
```
src/app/dashboard/
├── page.tsx
└── page.test.tsx
```

### Incorrect Structure (Missing Test)
```
src/components/common/
└── Button.tsx
(Error: Missing Button.test.tsx)
```
