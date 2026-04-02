---
name: global-skills
description: Catalog of all specialized skills used across the FinanzApp project (Frontend & Backend).
---

# 📚 FinanzApp Global Skills Catalog

This skill serves as a central index for all architectural and development guidelines established in the FinanzApp project. Each skill defines rules and best practices that **MUST** be respected by the agent and developers.

## Frontend Skills (`FinanzApp-FrontEnd`)

- **[accessibility](file:///c:/Users/Agus/Documents/FinanzApp/FinanzApp-FrontEnd/.agent/skills/accessibility/SKILL.md)**: Reglas obligatorias para garantizar la accesibilidad web (A11y).
- **[api-communication](file:///c:/Users/Agus/Documents/FinanzApp/FinanzApp-FrontEnd/.agent/skills/api-communication/SKILL.md)**: Mandatory rules for API communication using the central `http` client.
- **[clean-structure](file:///c:/Users/Agus/Documents/FinanzApp/FinanzApp-FrontEnd/.agent/skills/clean-structure/SKILL.md)**: Component organization and modern React principles for the FrontEnd.
- **[code-quality](file:///c:/Users/Agus/Documents/FinanzApp/FinanzApp-FrontEnd/.agent/skills/code-quality/SKILL.md)**: Guidelines for clean code, readability, and the "No Comments" policy.
- **[css-modules](file:///c:/Users/Agus/Documents/FinanzApp/FinanzApp-FrontEnd/.agent/skills/css-modules/SKILL.md)**: Rules for extracting CSS to `.module.css` files.
- **[e2e-testing](file:///c:/Users/Agus/Documents/FinanzApp/FinanzApp-FrontEnd/.agent/skills/e2e-testing/SKILL.md)**: End-to-end testing standards using Playwright.
- **[integration-testing](file:///c:/Users/Agus/Documents/FinanzApp/FinanzApp-FrontEnd/.agent/skills/integration-testing/SKILL.md)**: Guidelines for cross-layer testing (Hooks + UI + Services) with MSW.
- **[modular-architecture](file:///c:/Users/Agus/Documents/FinanzApp/FinanzApp-FrontEnd/.agent/skills/modular-architecture/SKILL.md)**: Maintaining the modular structure of the frontend.
- **[react-hooks](file:///c:/Users/Agus/Documents/FinanzApp/FinanzApp-FrontEnd/.agent/skills/react-hooks/SKILL.md)**: Best practices and mandatory testing for custom React hooks.
- **[readme-auto-sync](file:///c:/Users/Agus/Documents/FinanzApp/FinanzApp-FrontEnd/.agent/skills/readme-auto-sync/SKILL.md)**: Mandatory automated README syncing for project structure and tests.
- **[responsive-design](file:///c:/Users/Agus/Documents/FinanzApp/FinanzApp-FrontEnd/.agent/skills/responsive-design/SKILL.md)**: Mobile-first and fluid layout best practices.
- **[skill-generator](file:///c:/Users/Agus/Documents/FinanzApp/FinanzApp-FrontEnd/.agent/skills/skill-generator/SKILL.md)**: A tool for creating new skills following the FinanzApp standard.
- **[test](file:///c:/Users/Agus/Documents/FinanzApp/FinanzApp-FrontEnd/.agent/skills/test/SKILL.md)**: Guidelines and E2E testing.
- **[test-enforcement](file:///c:/Users/Agus/Documents/FinanzApp/FinanzApp-FrontEnd/.agent/skills/test-enforcement/SKILL.md)**: Mandatory rule requiring one test per file.

## 🛠️ Usage guidelines

1. **Check before coding**: Always consult the relevant skill(s) before implementing a new feature.
2. **Consistency over speed**: If a skill defines a pattern, follow it strictly.
3. **Skill updates**: When a new architectural pattern is established, update the relevant skill or create a new one using the `skill-generator`.
