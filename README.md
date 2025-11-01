<h1>💹 FinanzApp - Frontend</h1>

<div align="center">
    <a href="https://github.com/agussantinelli/FinanzApp-FrontEnd.git" target="_blank" style="text-decoration: none;">
        <img src="https://img.shields.io/badge/🚀%20Repo%20Frontend%20(Estás%20Aquí)-Next.js-20232A?style=for-the-badge&logo=next.js&logoColor=white" alt="Frontend Repo Badge"/>
    </a>
    <a href="https://github.com/agussantinelli/FinanzApp-BackEnd.git" target="_blank" style="text-decoration: none;">
        <img src="https://img.shields.io/badge/⚙️%20Repo%20Backend-ASP.NET%20Core-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" alt="Backend Repo Badge"/>
    </a>
    <a href="https://github.com/agussantinelli" target="_blank" style="text-decoration: none;">
        <img src="https://img.shields.io/badge/👤%20Contacto-agussantinelli-000000?style=for-the-badge&logo=github&logoColor=white" alt="Contact Badge"/>
    </a>
</div>

<p align="center">
<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript Badge"/>
<img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel Badge"/>
<img src="https://img.shields.io/badge/Material%20UI-007FFF?style=for-the-badge&logo=mui&logoColor=white" alt="MUI Badge"/>
</p>

<hr>

<h2>🎯 Objetivo</h2>

<p>Ofrecer una visión clara, consolidada y actualizada del portafolio completo (efectivo + inversiones) para inversores argentinos, con conversión correcta según el tipo de cambio que corresponda a cada activo.</p>

<h2>🧭 Visión General</h2>

<p>FinanzApp es la herramienta diseñada para ser el "panel patrimonial" de referencia para el inversor argentino. Esto implica:</p>
<ul>
    <li>Consulta de tipos de cambio relevantes para Argentina (oficial, MEP, CCL, blue, etc.)</li>
    <li>Consolidación de cripto, acciones locales, CEDEARs y ONs en una sola interfaz</li>
    <li>Conversión ARS ↔ USD aplicando el tipo de dólar adecuado por clase de activo</li>
    <li>Indicadores clave: patrimonio total, distribución por clase de activo y evolución</li>
    <li>UI moderna, tema oscuro y acentos verde neón para una experiencia clara y agradable</li>
</ul>

<h2>💼 Problema</h2>

<p>En Argentina, el inversor se enfrenta a:</p>
<ul>
    <li>La información financiera fragmentada entre brokers, exchanges y sitios de cotizaciones.</li>
    <li>La dificultad de aplicar el tipo de cambio correcto para valuar cada activo.</li>
    <li>La falta de una vista consolidada y en tiempo real del patrimonio total.</li>
</ul>

<h2>🚀 Propuesta de Valor</h2>

<ul>
    <li>Unificar datos y cotizaciones en un único lugar.</li>
    <li>Normalizar conversiones entre ARS y USD según clase de activo.</li>
    <li>Centralizar el seguimiento del portafolio con métricas simples y relevantes.</li>
    <li>Automatizar actualizaciones mediante adaptadores de datos (gestionados por el Backend).</li>
</ul>

<h2>🧮 Meta</h2>

<p>Que FinanzApp sea el "panel patrimonial" de referencia para el inversor argentino.</p>

<h2>🧩 Alcance Inicial (MVP)</h2>

<ul>
    <li>Alta y gestión de activos: CRYPTO, ACCION_LOCAL, CEDEAR, ON</li>
    <li>Consulta de cotizaciones por clase de activo</li>
    <li>Conversión a ARS/USD usando MEP/CCL/Oficial/Blue (configurable)</li>
    <li>Reportes base: patrimonio total y distribución por clase</li>
</ul>

<hr>

<h2>🌐 Frontend (este repositorio)</h2>

<p>Este repositorio contiene la <strong>interfaz de usuario (UI)</strong> y la lógica de presentación, construida para ser una aplicación web de alto rendimiento y completamente responsiva.</p>

<h3>⚙️ Stack Tecnológico</h3>

<table>
 <thead>
  <tr>
   <th>Componente</th>
   <th>Tecnología</th>
   <th>Notas</th>
  </tr>
 </thead>
 <tbody>
  <tr>
   <td><strong>Framework</strong></td>
   <td>Next.js 16 (App Router)</td>
   <td>Alto rendimiento, Server Components y Routing.</td>
  </tr>
  <tr>
   <td><strong>Lenguaje</strong></td>
   <td>TypeScript</td>
   <td>Tipado estricto para escalabilidad.</td>
  </tr>
  <tr>
   <td><strong>UI Library</strong></td>
   <td>Material UI (MUI)</td>
   <td>Componentes UI robustos.</td>
  </tr>
  <tr>
   <td><strong>Estilo</strong></td>
   <td>Tema Oscuro + Verde Flúor (<code>#39ff14</code>)</td>
   <td>Estética moderna y legible.</td>
  </tr>
  <tr>
   <td><strong>Fondo</strong></td>
   <td>Efecto de partículas neón</td>
   <td>Ligero y compatible con SSR.</td>
  </tr>
 </tbody>
</table>

<h3>🚀 Empezar (Setup Local)</h3>

<p>Este es un proyecto <a href="https://nextjs.org">Next.js</a> inicializado con <code>create-next-app</code>.</p>

<p>Primero, ejecuta el servidor de desarrollo:</p>

<pre><code>npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
</code></pre>

<p>Abre <a href="http://localhost:3000">http://localhost:3000</a> en tu navegador para ver el resultado.</p>

<h3>⚙️ Variables de Entorno</h3>

<p>Crea un archivo <code>.env.local</code> en la raíz del proyecto para configurar la conexión al <a href="https://github.com/agussantinelli/FinanzApp-BackEnd.git">Backend</a>:</p>

<pre><code># Base de la API (cambiar por prod al desplegar)
NEXT_PUBLIC_API_BASE=https://localhost:7088
Cuando integremos el backend, todos los fetch apuntarán a NEXT_PUBLIC_API_BASE.
</code></pre>

<h2>☁️ Deploy (Vercel)</h2>

<p>La forma más sencilla de desplegar esta aplicación Next.js es usando la <a href="https://vercel.com/new?utm_medium=default-template&amp;filter=next.js&amp;utm_source=create-next-app&amp;utm_campaign=create-next-app-readme">Vercel Platform</a>.</p>

<ol>
    <li><strong>Conectá el repo a Vercel</strong></li>
    <li><strong>Seteá las Environment Variables</strong> (ej. <code>NEXT_PUBLIC_API_BASE</code>)</li>
    <li><strong>Hacé deploy</strong> (Vercel detecta Next.js automáticamente)</li>
</ol>

<p><strong>Docs útiles:</strong> <a href="https://vercel.com/docs/frameworks/nextjs">Deploy Next.js en Vercel</a></p>

<h2>🔌 Integraciones Planeadas (Datos - Consumidas por el Backend)</h2>

<p>Aunque el frontend solo consume la API de nuestro backend, las siguientes integraciones definen la fuente de los datos que se mostrarán:</p>

<ul>
    <li><strong>Cripto:</strong> CoinGecko / Binance API (precios en USD)</li>
    <li><strong>Acciones / CEDEARs / ONs:</strong> BYMA / Rava / MAV (precios en ARS)</li>
    <li><strong>Tipos de cambio:</strong> DólarHoy / Ámbito / BCRA (MEP, CCL, blue, oficial, etc.)</li>
</ul>

<p>Se implementarán como adaptadores de proveedor para poder cambiar la fuente sin tocar el resto del sistema.</p>

<h2>🗺️ Roadmap</h2>

<ul>
    <li><strong>MVP:</strong> portafolio manual + cotizaciones + conversión ARS/USD</li>
    <li><strong>Autenticación y espacios personales</strong></li>
    <li><strong>Series temporales y reportes de evolución</strong></li>
    <li><strong>Importación</strong> (CSV/Excel, brokers y exchanges)</li>
    <li><strong>Alertas de precio y rebalanceo</strong></li>
    <li><strong>App móvil</strong> (MAUI / React Native)</li>
</ul>

<h2>🤝 Contribuir</h2>

<ol>
    <li><strong>Fork</strong>, crea una rama con el formato <code>feature/...</code>, y envía un <strong>PR</strong>.</li>
    <li><strong>Asegurate de correr linters y tests</strong> (cuando estén disponibles).</li>
    <li><strong>Explicá los cambios con claridad</strong> en la descripción del PR.</li>
</ol>

<h2>⚖️ Licencia</h2>

<p>MIT – ver archivo <code>LICENSE</code>.</p>

<hr>

<h3>📝 Notas sobre la Arquitectura</h3>

<p>Este repo es estrictamente el <strong>Frontend</strong>. Toda la lógica de negocio, agregación de datos de APIs externas y la persistencia de datos reside en el repositorio <a href="https://github.com/agussantinelli/FinanzApp-BackEnd.git">FinanzApp-BackEnd</a>.</p>

<p>Cuando el Backend esté público, agregaremos un badge de API y una sección de integración con ejemplos de requests.</p>
