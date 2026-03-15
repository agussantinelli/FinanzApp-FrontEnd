---
name: modular-architecture
description: Guidelines for maintaining a modular architecture in FinanzApp Frontend
---
# Modular Architecture Guidelines

This project follows a strict modular architecture to ensure scalability and maintainability.

## Core Rules

1.  **Type Separation**:
    *   **NEVER** define types or interfaces inside service files or components.
    *   **ALWAYS** create a dedicated file in `src/types/`.
    *   Use `type` aliases instead of `interface` unless extending is strictly necessary.

2.  **Service Layer**:
    *   Services (`src/services/`) should only contain API calls and data transformation logic.
    *   They must import types from `src/types/`.
    *   They should not contain UI logic or state management.

3.  **Hooks Layer**:
    *   Custom hooks (`src/hooks/`) should encapsulate reusable logic, state, and side effects.
    *   They should consume services for data fetching and actions.
    *   Complex validation or business logic should be extracted to `src/utils/`.

4.  **Components**:
    *   Components (`src/components/`, `src/app/`) should focus on UI and interaction.
    *   They should consume hooks or services for data fetching and actions.
    *   They should import types from `src/types/`.

5.  **Directory Structure**:
    *   `src/types/`: Centralized type definitions.
    *   `src/services/`: API integration services.
    *   `src/hooks/`: Custom React hooks for logic and state.
    *   `src/components/`: Reusable UI components.
    *   `src/app/`: Next.js App Router pages and layouts.
    *   `src/lib/`: Third-party library configurations (e.g., Axios client).

## Example Workflow

When adding a new feature (e.g., "Orders"):
1.  Create `src/types/order.types.ts`.
2.  Create `src/services/OrderService.ts` importing those types.
3.  Create `src/hooks/useOrders.ts` to manage state and fetch data using the service.
4.  Create components in `src/components/orders/` using the hook and types.
