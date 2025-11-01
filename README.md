# 💹 FinanzApp

## 🎯 Objetivo
Ofrecer una visión clara, consolidada y actualizada del portafolio completo (efectivo + inversiones) para inversores argentinos, con conversión correcta según el tipo de cambio que corresponda a cada activo.

## 🧭 Visión General
- Consulta de tipos de cambio relevantes para Argentina (oficial, MEP, CCL, blue, etc.)
- Consolidación de cripto, acciones locales, CEDEARs y ONs en una sola interfaz
- Conversión ARS ↔ USD aplicando el tipo de dólar adecuado por clase de activo
- Indicadores clave: patrimonio total, distribución por clase de activo y evolución
- UI moderna, tema oscuro y acentos verde neón para una experiencia clara y agradable

## 💼 Problema
En Argentina:
- La información financiera está fragmentada entre brokers, exchanges y sitios de cotizaciones
- Existen múltiples tipos de cambio y no siempre se aplica el correcto para valuar
- Falta una vista consolidada y en tiempo real del patrimonio total

## 🚀 Propuesta de Valor
- Unificar datos y cotizaciones en un único lugar
- Normalizar conversiones entre ARS y USD según clase de activo
- Centralizar el seguimiento del portafolio con métricas simples y relevantes
- Automatizar actualizaciones con adaptadores a proveedores de datos

## 🧮 Meta
Que FinanzApp sea el "panel patrimonial" de referencia para el inversor argentino.

## 🧩 Alcance Inicial (MVP)
- Alta y gestión de activos: CRYPTO, ACCION_LOCAL, CEDEAR, ON
- Consulta de cotizaciones por clase de activo
- Conversión a ARS/USD usando MEP/CCL/Oficial/Blue (configurable)
- Reportes base: patrimonio total y distribución por clase

## 🌐 Frontend (este repositorio)

### Stack Tecnológico
- **Framework:** Next.js 16 (App Router)
- **Lenguaje:** TypeScript
- **UI:** Material UI (MUI)
- **Tema:** Oscuro + verde flúor `#39ff14`
- **Fondo:** Efecto de partículas neón (ligero y compatible con SSR)

### ⚙️ Empezar (Frontend)

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
# o
bun dev
```

## ⚙️ Variables de Entorno (Frontend)
Crea `.env.local`:

```env
# Base de la API (cambiar por prod al desplegar)
NEXT_PUBLIC_API_BASE=https://localhost:7088
Cuando integremos el backend, todos los fetch apuntarán a NEXT_PUBLIC_API_BASE.
```

## ☁️ Deploy (Vercel)

1. **Conectá el repo a Vercel**
2. **Seteá las Environment Variables** (ej. `NEXT_PUBLIC_API_BASE`)
3. **Hacé deploy** (Vercel detecta Next.js automáticamente)

**Docs útiles:** [Deploy Next.js en Vercel](https://vercel.com/docs/frameworks/nextjs)

## 🔌 Integraciones Planeadas (Datos)

- **Cripto:** CoinGecko / Binance API (precios en USD)
- **Acciones / CEDEARs / ONs:** BYMA / Rava / MAV (precios en ARS)
- **Tipos de cambio:** DólarHoy / Ámbito / BCRA (MEP, CCL, blue, oficial, etc.)

Se implementarán como adaptadores de proveedor para poder cambiar la fuente sin tocar el resto del sistema.

## 🗺️ Roadmap

- **MVP:** portafolio manual + cotizaciones + conversión ARS/USD
- **Autenticación y espacios personales**
- **Series temporales y reportes de evolución**
- **Importación** (CSV/Excel, brokers y exchanges)
- **Alertas de precio y rebalanceo**
- **App móvil** (MAUI / React Native)

## 🤝 Contribuir

1. **Fork**, rama `feature/...`, **PR**
2. **Asegurate de correr linters y tests** (cuando estén)
3. **Explicá cambios con claridad**

## ⚖️ Licencia

MIT – ver archivo LICENSE.

---

### 📝 Notas

Este repo es frontend. El backend (ASP.NET Core + PostgreSQL) vive en un repo aparte y expone Swagger/OpenAPI.

Cuando esté público, agregaremos un badge de API y una sección de integración con ejemplos de requests.
