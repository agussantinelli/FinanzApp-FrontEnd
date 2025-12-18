<h1 align="center">💹 FinanzApp - Frontend</h1>

<div align="center">
    <a href="https://github.com/agussantinelli/FinanzApp-FrontEnd.git" target="_blank">
        <img src="https://img.shields.io/badge/🚀%20Repo%20Frontend%20(Estás%20Aquí)-Next.js-20232A?style=for-the-badge&logo=next.js&logoColor=white" alt="Frontend Repo Badge"/>
    </a>
    <a href="https://github.com/agussantinelli/FinanzApp-BackEnd.git" target="_blank">
        <img src="https://img.shields.io/badge/⚙️%20Repo%20Backend-ASP.NET%20Core-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" alt="Backend Repo Badge"/>
    </a>
    <a href="https://github.com/agussantinelli" target="_blank">
        <img src="https://img.shields.io/badge/👤%20Contacto-agussantinelli-000000?style=for-the-badge&logo=github&logoColor=white" alt="Contact Badge"/>
    </a>
</div>

<p align="center">
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript Badge"/>
    <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel Badge"/>
    <img src="https://img.shields.io/badge/Material%20UI-007FFF?style=for-the-badge&logo=mui&logoColor=white" alt="MUI Badge"/>
    <img src="https://img.shields.io/badge/JWT%20Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT Badge"/>
    <a href="https://drive.google.com/drive/folders/1b5H8fDgOKmrxfY4RXfi4oYA3CvXy4ot6?usp=drive_link" target="_blank">
        <img src="https://img.shields.io/badge/📂%20Documentación%20Proyecto-4285F4?style=for-the-badge&logo=googledrive&logoColor=white" alt="Carpeta TPI Drive Badge"/>
    </a>
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
            <li><code>page.tsx</code>: Landing pública.</li>
            <li><code>auth/</code>: Rutas de autenticación (Login, Registro).</li>
            <li><code>dashboard/</code>, <code>admin/</code>, <code>expert/</code>: Paneles por rol.</li>
            <li><code>activos/</code>: Listado y detalle de activos con filtros avanzados.</li>
            <li><code>portafolio/</code>: Vista consolidada de posiciones.</li>
            <li><code>reportes/</code>: Gráficos y métricas del mercado.</li>
            <li><code>noticias/</code>: Feed de noticias financieras.</li>
        </ul>
    </li>
    <li><code>src/hooks/</code>: Custom Hooks para lógica de negocio (e.g., <code>useActivosFilters</code>, <code>useRegister</code>, <code>usePortfolioData</code>).</li>
    <li><code>src/services/</code>: Servicios HTTP (Axios) para consumir la API del backend.</li>
    <li><code>src/components/</code>:
        <ul>
            <li><code>sections/</code>: Bloques lógicos de UI (e.g., cotizaciones por sector).</li>
            <li><code>auth/</code>: Guards y componentes de seguridad (e.g., <code>RoleGuard</code>).</li>
            <li>Componentes reutilizables (Navbar, Cards, Gráficos).</li>
        </ul>
    </li>
    <li><code>src/types/</code>: DTOs e interfaces TypeScript (modelos de dominio).</li>
    <li><code>src/lib/</code>: Utilidades y configuraciones base (e.g., cache simple).</li>
    <li><code>src/config/</code>: Configuración de entorno y clientes HTTP.</li>
    <li><code>src/app-theme/</code>: Configuración del tema Material UI.</li>
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
<ol>
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
</ol>

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

<h3>📂 Portafolio</h3>

<p>Ruta principal: <code>/portafolio</code></p>

<ul>
    <li>Vista pensada como <strong>“panel patrimonial”</strong> del inversor.</li>
    <li>Cards de resumen (valor total, exposición a activos de riesgo, cantidad de instrumentos).</li>
    <li>Distribución básica por tipo de activo (CEDEAR, acción local, bono, cripto).</li>
    <li>Tabla demo de posiciones con:
        <ul>
            <li>Ticker, nombre, tipo.</li>
            <li>Cantidad, precio actual, valor total estimado.</li>
            <li>Variación diaria y variación total en %.</li>
        </ul>
    </li>
    <li>Actualmente los datos están <strong>hardcodeados</strong> a modo de maqueta para el TPI.</li>
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

<h3>🧠 Dashboard de Experto (maqueta)</h3>

<p>Ruta principal: <code>/expert</code></p>

<ul>
    <li>Pantalla pensada para usuarios con rol <strong>Experto</strong> (rol preconfigurado desde el backend).</li>
    <li>Resumen de:
        <ul>
            <li>Cantidad de recomendaciones emitidas.</li>
            <li>Activos distintos cubiertos por el experto.</li>
            <li>Performance promedio de las recomendaciones.</li>
        </ul>
    </li>
    <li>Lista demo de recomendaciones recientes con:
        <ul>
            <li>Ticker, tipo de activo, precio de entrada, target y stop loss.</li>
            <li>Horizonte temporal y estado (activa/cerrada).</li>
        </ul>
    </li>
    <li>Actualmente la carga de recomendaciones es solo conceptual (sin alta real todavía).</li>
</ul>

<hr>

<h2>👥 Roles y flujos de navegación</h2>

<p>El frontend respeta la información de rol provista por el JWT:</p>

<ul>
    <li><strong>Inversor</strong>
        <ul>
            <li>Inicio post-login: <code>/dashboard</code>.</li>
            <li>Acceso a: <code>/dashboard</code>, <code>/portafolio</code>, módulos de activos, noticias y reportes.</li>
            <li>Navbar:
                <ul>
                    <li>El logo / nombre de la app redirige al <strong>panel principal</strong> si el usuario está logueado.</li>
                    <li>Opción <strong>“Mi portafolio”</strong> disponible desde navegación.</li>
                    <li>Opción “Mi panel” centralizada dentro del menú de usuario.</li>
                </ul>
            </li>
        </ul>
    </li>
    <li><strong>Admin</strong>
        <ul>
            <li>Inicio post-login: <code>/admin</code>.</li>
            <li>Puede seguir usando el <code>/dashboard</code> de inversor a modo de vista personal.</li>
            <li>Navbar muestra claramente el rol <code>Admin</code> y enlaces hacia el panel de administración.</li>
        </ul>
    </li>
    <li><strong>Experto</strong> (rol preconfigurado)
        <ul>
            <li>Inicio post-login: <code>/expert</code> (definido por helper <code>getHomePathForRole</code> en el frontend).</li>
            <li>En el futuro, podrá:
                <ul>
                    <li>Cargar recomendaciones para diferentes activos.</li>
                    <li>Visualizar la performance de sus ideas de inversión.</li>
                    <li>Ver estadísticas de impacto sobre los inversores que siguen sus señales.</li>
                </ul>
            </li>
        </ul>
    </li>
</ul>

<p>Cuando un usuario intenta acceder a una ruta que no le corresponde, se lo redirige a una pantalla de <strong>access denied</strong> (<code>/access-denied</code>), donde se le informa que no tiene permisos para esa sección.</p>

<hr>

<h2>📌 Estado actual de implementación (Frontend)</h2>

<ul>
    <li><strong>Implementado</strong>
        <ul>
            <li>Autenticación JWT (login / register) integrada con el backend.</li>
            <li>Gestión de sesión en frontend:
                <ul>
                    <li>Almacenamiento de <code>fa_token</code> + <code>fa_user</code> en <code>localStorage</code>.</li>
                    <li>Notificación global vía evento <code>fa-auth-changed</code> para actualizar Navbar, etc.</li>
                </ul>
            </li>
            <li>Navbar responsivo:
                <ul>
                    <li>Navegación pública y privada.</li>
                    <li>Menú de usuario con acceso a perfil, panel y logout.</li>
                </ul>
            </li>
            <li>Dashboards:
                <ul>
                    <li><code>/dashboard</code> (inversor) – maqueta completa con cards y atajos.</li>
                    <li><code>/admin</code> – maqueta de métricas globales para rol Admin.</li>
                    <li><code>/expert</code> – maqueta inicial de panel de experto.</li>
                </ul>
            </li>
            <li><code>/portafolio</code> – vista de portafolio consolidado con datos demo.</li>
            <li>Enrutamiento de roles con helper <code>getHomePathForRole</code>.</li>
        </ul>
    </li>
    <li><strong>En progreso / futuro</strong>
        <ul>
            <li>Persistencia real de operaciones y posiciones en la base de datos.</li>
            <li>Cálculo de patrimonio y P&amp;L a partir de series temporales.</li>
            <li>Alta y gestión real de recomendaciones del rol Experto.</li>
            <li>Reportes exportables (PDF/Excel) desde el frontend.</li>
        </ul>
    </li>
</ul>

<hr>

<h2>⚖️ Licencia</h2>

<p>MIT – ver archivo <code>LICENSE</code>.</p>

<hr>

<h3>📝 Notas sobre la Arquitectura</h3>

<p>Este repo es estrictamente el <strong>Frontend</strong>. Toda la lógica de negocio, agregación de datos de APIs externas y la persistencia de datos reside en el repositorio <a href="https://github.com/agussantinelli/FinanzApp-BackEnd.git">FinanzApp-BackEnd</a>.</p>

<p>A medida que se consolida la API (incluyendo autenticación JWT, roles y rutas protegidas), se irán agregando ejemplos de requests, flujos completos de login/registro y secciones avanzadas de reportes dentro del frontend.</p>
