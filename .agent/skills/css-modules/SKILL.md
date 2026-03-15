---
name: css-modules
description: Guidelines for implementing CSS Modules in Next.js components for better maintainability and scoped styling.
---

# CSS Modules Skill

## Context
Next.js provides built-in support for CSS Modules. To maintain a clean directory structure and standard modularity, complex CSS should be extracted to CSS Module files (`.module.css`).

## Guidelines

1. **Extraction Rule**: Any significant CSS block (typically >20 lines or reused logic) SHOULD be moved to a CSS Module file.
2. **Directory Structure**: 
    - Create a `styles/` subdirectory within the component's folder.
    - Path: `src/components/[category]/styles/[ComponentName].module.css`.
    - For pages: `src/app/[page]/styles/[PageName].module.css`.
3. **Naming Convention**: 
    - Use `PascalCase` or `kebab-case` matching the component name.
    - Always use the `.module.css` extension.
4. **Integration**:
    - Import the styles in the `.tsx` file:
      `import styles from './styles/MyComponent.module.css';`
    - Apply classes using the `className={styles.className}` syntax.
    - For multiple classes, use template literals or a utility like `clsx`: `className={`${styles.base} ${styles.active}`}`.

## Example

### Component Structure
```
src/components/products/
├── ProductCard.tsx
└── styles/
    └── ProductCard.module.css
```

### `ProductCard.tsx`
```tsx
import styles from './styles/ProductCard.module.css';

export default function ProductCard() {
  return (
    <article className={styles.card}>
      <h3 className={styles.title}>Product Title</h3>
    </article>
  );
}
```
```
