---
name: accessibility
description: Reglas obligatorias para garantizar la accesibilidad web (A11y) en FinanzApp. Sigue estándares WCAG 2.1 para usuarios con discapacidad visual y navegación por teclado.
---

# ♿ Web Accessibility (A11y) - Estándar FinanzApp

Esta skill define las reglas obligatorias para que la interfaz de FinanzApp sea inclusiva. Todo componente nuevo o modificado en el frontend **debe** cumplir con estos lineamientos de accesibilidad sin comprometer la estética premium (Neon/Dark Mode).

## 📋 Reglas de Oro (Mandatory)

### 1. Etiquetas de Interacción (`aria-label`)
Cualquier botón, enlace o control que use únicamente un icono (SVG/Lucide/Material UI) **DEBE** tener un `aria-label` descriptivo en español.
- **✅ Correcto**: `<IconButton aria-label="Cerrar chat"><CloseIcon /></IconButton>`
- **❌ Incorrecto**: `<IconButton><CloseIcon /></IconButton>`

### 2. Iconos Decorativos (`aria-hidden`)
Todos los iconos o SVGs que no aporten información semántica (ej: iconos junto a texto descriptivo en el dashboard) **DEBEN** tener `aria-hidden="true"`.
- **✅ Correcto**: `<span><TrendingUpIcon aria-hidden="true" /> Patrimonio</span>`
- **❌ Incorrecto**: `<span><TrendingUpIcon /> Patrimonio</span>`

### 3. Navegación por Teclado
- **Foco Visible**: Nunca elimines el `outline` del foco a menos que proveas una alternativa visual clara compatible con el tema Neon.
- **Tabulación Lógica**: Los elementos interactivos deben seguir el orden visual del DOM.
- **Eventos Combinados**: Los elementos no semánticos que actúen como botones deben manejar `onKeyDown` (teclas Enter y Space).

### 4. Regiones Dinámicas (`aria-live`)
Para componentes que actualizan contenido sin recargar la página (FinanzAI Chat, actualizaciones de cotizaciones, mensajes de éxito), usa `aria-live` para anunciar cambios.
- `aria-live="polite"`: Para mensajes informativos (ej: "Cotización actualizada").
- `aria-live="assertive"`: Para errores críticos (ej: "Error al registrar operación").

### 5. Semántica de Estructura
- Usa **Landmarks** (`<main>`, `<nav>`, `<header>`, `<footer>`, `<aside>`).
- Mantén una jerarquía de encabezados coherente (`h1` -> `h2` -> `h3`). No saltes niveles.
- Usa `role="region"` y `aria-labelledby` en secciones complejas como el Portfolio o el Dashboard de Inversor.

## 🛠️ Checklist de Validación
- [ ] ¿Todos los botones tienen texto visible o un `aria-label`?
- [ ] ¿Los iconos decorativos están ocultos para los lectores (`aria-hidden`)?
- [ ] ¿Puedo completar el flujo principal (ej: compra de activo) usando solo el teclado (`Tab` + `Enter`)?
- [ ] ¿Los cambios de estado (cargando, éxito, error) se anuncian?
- [ ] ¿Las imágenes tienen un `alt` descriptivo (o `alt=""` si son decorativas)?

---

_Cualquier componente que ignore estas reglas será considerado un fallo de calidad técnica._
