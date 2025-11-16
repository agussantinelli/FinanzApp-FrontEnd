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
    <img src="https://img.shields.io/badge/JWT%20Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT Badge"/>
</p>

<hr>

<h2>🎯 Objetivo</h2>

<p>Ofrecer una visión clara, consolidada y actualizada del portafolio completo (<strong>efectivo + inversiones</strong>) para inversores argentinos, con conversión correcta según el tipo de cambio que corresponda a cada activo.</p>

<h2>🧭 Visión General</h2>

<p>FinanzApp es la herramienta diseñada para ser el <strong>"panel patrimonial"</strong> de referencia para el inversor argentino. Esto implica:</p>
<ul>
    <li>Consulta de tipos de cambio relevantes para Argentina (oficial, MEP, CCL, blue, etc.).</li>
    <li>Consolidación de cripto, acciones locales, CEDEARs y ONs en una sola interfaz.</li>
    <li>Conversión ARS ↔ USD aplicando el tipo de dólar adecuado por clase de activo.</li>
    <li>Indicadores clave: patrimonio total, distribución por clase de activo y evolución.</li>
    <li>UI moderna, tema oscuro y acentos verde neón para una experiencia clara y agradable.</li>
</ul>

<h2>💼 Problema</h2>

<p>En Argentina, el inversor se enfrenta a:</p>
<ul>
    <li>Información financiera <strong>fragmentada</strong> entre brokers, exchanges y sitios de cotizaciones.</li>
    <li>Dificultad para aplicar el <strong>tipo de cambio correcto</strong> para valuar cada activo.</li>
    <li>Falta de una vista <strong>consolidada y en tiempo (casi) real</strong> del patrimonio total.</li>
</ul>

<h2>🚀 Propuesta de Valor</h2>

<ul>
    <li>Unificar datos y cotizaciones en un único lugar.</li>
    <li>Normalizar conversiones entre ARS y USD según clase de activo.</li>
    <li>Centralizar el seguimiento del portafolio con métricas simples y relevantes.</li>
    <li>Automatizar actualizaciones mediante adaptadores de datos (gestionados por el Backend).</li>
</ul>

<h2>🧮 Meta</h2>

<p>Que FinanzApp sea el <strong>panel patrimonial de referencia</strong> para el inversor argentino.</p>

<h2>🧩 Alcance Inicial (MVP)</h2>

<ul>
    <li>Alta y gestión de activos: <code>CRYPTO</code>, <code>ACCION_LOCAL</code>, <code>CEDEAR</code>, <code>ON</code>.</li>
    <li>Consulta de cotizaciones por clase de activo.</li>
    <li>Conversión a ARS/USD usando MEP/CCL/Oficial/Blue (configurable).</li>
    <li>Reportes base: patrimonio total y distribución por clase.</li>
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
   <td>Next.js (App Router)</td>
   <td>Routing moderno, Server/Client Components y SSR/SSG.</td>
  </tr>
  <tr>
   <td><strong>Lenguaje</strong></td>
   <td>TypeScript</td>
   <td>Tipado estricto para escalabilidad.</td>
  </tr>
  <tr>
   <td><strong>UI Library</strong></td>
   <td>Material UI (MUI)</td>
   <td>Componentes UI robustos y accesibles.</td>
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

<h3>📁 Estructura Principal del Proyecto</h3>

<ul>
    <li><code>src/app/</code>
        <ul>
            <li><code>page.tsx</code>: landing pública.</li>
            <li><code>auth/login</code>, <code>auth/register</code>: formularios de autenticación.</li>
            <li><code>dashboard</code>: panel de inversor autenticado.</li>
            <li><code>admin</code>: dashboard de administrador (métricas globales).</li>
        </ul>
    </li>
    <li><code>src/services/</code>: servicios HTTP (Axios) para consumir la API del backend.</li>
    <li><code>src/types/</code>: DTOs tipados compartidos entre vistas.</li>
    <li><code>src/components/</code>: componentes reutilizables (Navbar, cards, <code>FormStatus</code>, etc.).</li>
</ul>

<h3>🚀 Empezar (Setup Local)</h3>

<p>Este es un proyecto <a href="https://nextjs.org">Next.js</a> inicializado con <code>create-next-app</code>.</p>

<p>Instalá dependencias y levantá el servidor de desarrollo:</p>

<pre><code>npm install
npm run dev
# o
yarn install
yarn dev
# o
pnpm install
pnpm dev
</code></pre>

<p>Abrí <a href="http://localhost:3000">http://localhost:3000</a> en tu navegador para ver el resultado.</p>

<h3>⚙️ Variables de Entorno</h3>

<p>Crea un archivo <code>.env.local</code> en la raíz del proyecto para configurar la conexión al <a href="https://github.com/agussantinelli/FinanzApp-BackEnd.git">Backend</a>:</p>

<pre><code># Base de la API (cambiar por prod al desplegar)
NEXT_PUBLIC_API_BASE=https://localhost:7088
</code></pre>

<p>Todos los <code>fetch</code> / llamadas Axios del frontend apuntan a <code>NEXT_PUBLIC_API_BASE</code> (incluidos los endpoints protegidos con JWT).</p>

<h3>🔐 Autenticación (JWT)</h3>

<p>El backend utiliza <strong>JWT Bearer</strong> para proteger los endpoints de la API. El flujo actual es:</p>
<ul>
    <li>El usuario se registra o inicia sesión contra los endpoints:
        <ul>
            <li><code>POST /auth/register</code></li>
            <li><code>POST /auth/login</code></li>
            <li><code>GET /auth/me</code> (información del usuario autenticado)</li>
        </ul>
    </li>
    <li>El backend devuelve un <strong>token JWT</strong> más datos básicos de la persona (id, nombre, rol, etc.).</li>
    <li>El frontend guarda:
        <ul>
            <li><code>fa_token</code>: token JWT.</li>
            <li><code>fa_user</code>: datos serializados del usuario autenticado (localStorage).</li>
        </ul>
    </li>
    <li>Las llamadas posteriores usan el cliente configurado en <code>Http.ts</code>, que adjunta:
        <pre><code>Authorization: Bearer &lt;fa_token&gt;</code></pre>
        en los endpoints protegidos (por ejemplo, <code>/api/stocks/duals</code>, <code>/api/crypto/top</code>, etc.).
    </li>
</ul>

<p>La aplicación distingue actualmente entre los roles <strong>Inversor</strong> y <strong>Admin</strong>. El navbar y el acceso a ciertos paneles se adaptan dinámicamente según el rol del usuario autenticado.</p>

<hr>

<h2>📊 Dashboards</h2>

<h3>👤 Dashboard de Inversor</h3>

<p>Ruta principal: <code>/dashboard</code></p>

<ul>
    <li>Bienvenida personalizada (nombre + rol).</li>
    <li>Resumen rápido del portafolio (valor estimado, resultado diario, etc.).</li>
    <li>Accesos rápidos a secciones clave (activos, reportes, noticias).</li>
    <li>Datos de cotizaciones de dólar, CEDEARs, acciones y cripto consumidos desde el backend.</li>
</ul>

<h3>🛠️ Dashboard de Administrador</h3>

<p>Ruta principal: <code>/admin</code></p>

<ul>
    <li>Cards con métricas globales (hardcodeadas en la primera versión):
        <ul>
            <li>Cantidad de usuarios registrados / activos.</li>
            <li>Número de operaciones registradas.</li>
            <li>Volumen aproximado operado.</li>
        </ul>
    </li>
    <li>Sección para monitorear el estado general de la plataforma (a futuro: logs, health checks, etc.).</li>
    <li>Accesible únicamente para usuarios con rol <code>Admin</code> (controlado desde el backend y el frontend).</li>
</ul>

<hr>

<h2>🔌 Servicios de Datos (consumidos por el Frontend)</h2>

<p>Aunque el frontend solo consume la API de nuestro backend, las siguientes integraciones definen la fuente de los datos que se mostrarán:</p>

<ul>
    <li><strong>Cripto:</strong> Binance API / CoinGecko.</li>
    <li><strong>Acciones / CEDEARs / ONs:</strong> Yahoo Finance / BYMA / Rava / MAV (precios en ARS).</li>
    <li><strong>Tipos de cambio:</strong> DolarAPI / DólarHoy / Ámbito / BCRA (MEP, CCL, blue, oficial, etc.).</li>
</ul>

<p>Se implementan como adaptadores de proveedor en el backend para poder cambiar la fuente sin tocar el resto del sistema.</p>

<hr>

<h2>🗺️ Roadmap</h2>

<ul>
    <li><strong>MVP:</strong> portafolio manual + cotizaciones + conversión ARS/USD.</li>
    <li><strong>Autenticación y espacios personales</strong> (ya implementado el flujo básico JWT).</li>
    <li><strong>Series temporales y reportes de evolución</strong> (gráficos de patrimonio en el tiempo).</li>
    <li><strong>Importación</strong> (CSV/Excel, integraciones con brokers y exchanges).</li>
    <li><strong>Alertas de precio y rebalanceo</strong>.</li>
    <li><strong>App móvil</strong> (MAUI / React Native).</li>
</ul>

<hr>

<h2>🤝 Contribuir</h2>

<ol>
    <li>Hacé <strong>fork</strong>, creá una rama con el formato <code>feature/...</code>, y enviá un <strong>PR</strong>.</li>
    <li>Asegurate de correr linters y tests (cuando estén disponibles).</li>
    <li>Explicá los cambios con claridad en la descripción del PR.</li>
</ol>

<h2>⚖️ Licencia</h2>

<p>MIT – ver archivo <code>LICENSE</code>.</p>

<hr>

<h3>📝 Notas sobre la Arquitectura</h3>

<p>Este repo es estrictamente el <strong>Frontend</strong>. Toda la lógica de negocio, agregación de datos de APIs externas y la persistencia de datos reside en el repositorio <a href="https://github.com/agussantinelli/FinanzApp-BackEnd.git">FinanzApp-BackEnd</a>.</p>

<p>A medida que se consolida la API (incluyendo autenticación JWT, roles y rutas protegidas), se irán agregando ejemplos de requests, flujos completos de login/registro y secciones avanzadas de reportes dentro del frontend.</p>
