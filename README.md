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
            <li><code>auth/</code>: Módulos de Login y Registro.</li>
            <li><code>dashboard/</code>: Panel principal del Inversor.</li>
            <li><code>portfolio/</code>: Visualización y análisis patrimonial.</li>
            <li><code>activos/</code>: Buscador y detalles de instrumentos.</li>
            <li><code>registrar-operacion/</code>: Formulario de compra/venta.</li>
            <li><code>recomendaciones/</code>: Módulo de señales de expertos.</li>
            <li><code>expert/</code>: Dashboard para expertos financieros.</li>
            <li><code>admin/</code>: Panel de control de la plataforma.</li>
            <li><code>reportes/</code> & <code>noticias/</code>: Información de mercado.</li>
        </ul>
    </li>
    <li><code>src/hooks/</code>: Lógica de negocio encapsulada (e.g., <code>usePortfolioData</code>, <code>useAuth</code>, <code>useMisRecomendaciones</code>).</li>
    <li><code>src/services/</code>: Comunicación con API Backend (Axios + DTOs).</li>
    <li><code>src/components/</code>:
        <ul>
            <li><code>portfolio/</code>: Gráficos y tablas específicos del portafolio.</li>
            <li><code>sections/</code>: Bloques visuales de la Landing/Dashboard.</li>
            <li><code>auth/</code>: Componentes de seguridad (<code>RoleGuard</code>).</li>
        </ul>
    </li>
    <li><code>src/types/</code>: Definiciones de TypeScript alineadas con el Backend.</li>
    <li><code>src/lib/</code>: Utilidades y configuraciones base (e.g., cache simple).</li>
    <li><code>src/config/</code>: Configuración de entorno y clientes HTTP.</li>
    <li><code>src/app-theme/</code>: Configuración del tema Material UI.</li>
</ul>


<h3> Empezar (Setup Local)</h3>

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
        en los endpoints protegidos.
    </li>
</ol>

<hr>

<h2>📊 Módulos Principales</h2>

<h3>👤 Dashboard de Inversor</h3>

<p>Ruta principal: <code>/dashboard</code></p>

<ul>
    <li>Bienvenida personalizada (nombre + rol).</li>
    <li>Resumen rápido del portafolio (valor estimado, resultado diario, etc.).</li>
    <li>Accesos rápidos a secciones clave (activos, reportes, noticias).</li>
    <li>Datos de cotizaciones en tiempo real consumidos desde el backend.</li>
</ul>

<h3>📂 Portafolio Inteligente (Multimoneda)</h3>

<p>Ruta principal: <code>/portfolio</code></p>

<ul>
    <li><strong>Vista Consolidada:</strong> Visualización del patrimonio total en ARS y USD.</li>
    <li><strong>Valuación Dinámica:</strong>
        <ul>
            <li>Conversión automática de activos usando cotización <strong>CCL Implícito</strong> de la cartera.</li>
            <li>Columnas comparativas: <code>Precio (ARS)</code> vs <code>Precio (USD)</code> y <code>Total (ARS)</code> vs <code>Total (USD)</code>.</li>
            <li>Detección automática de moneda origen (Pesos, Dólares, USDT/C).</li>
        </ul>
    </li>
    <li><strong>Gráfico de Composición:</strong> Doughnut chart interactivo con distribución porcentual y visualización de valores nativos.</li>
    <li><strong>Soporte para CEDEARs:</strong> Etiquetas visuales específicas y tratamiento fiscal unificado.</li>
    <li>Acceso directo a "Registrar Operación" para mantener la cartera actualizada.</li>
</ul>

<h3>🛒 Operaciones y Mercado</h3>

<p>Ruta principal: <code>/registrar-operacion</code></p>

<ul>
    <li>Motor de búsqueda de activos integrado (Acciones, Bonos, CEDEARs, Cripto).</li>
    <li>Formulario de alta de operaciones (Compra/Venta) con validación en tiempo real:
        <ul>
            <li>Validación de stock disponible al vender.</li>
            <li>Precios de referencia automáticos según mercado.</li>
            <li>Selección de portafolio destino.</li>
        </ul>
    </li>
    <li>Historial completo de transacciones.</li>
</ul>

<h3>🛠️ Panel de Administración y Expertos</h3>

<p>Rutas: <code>/admin</code> y <code>/expert</code></p>

<ul>
    <li>Dashboards específicos por rol protegidos por <code>RoleGuard</code>.</li>
    <li>Gestión de usuarios y métricas globales de la plataforma.</li>
    <li>Módulo (beta) para carga de señales de inversión por parte de expertos.</li>
</ul>

<hr>

<h2>👥 Roles y Seguridad</h2>

<p>La aplicación implementa un sistema de control de acceso basado en roles (RBAC) asegurado por <code>RoleGuard</code>.</p>

<h3>Flujos de Navegación por Rol</h3>

<ul>
    <li><strong>Inversor (Rol Default)</strong>
        <ul>
            <li><strong>Inicio:</strong> Redirige a <code>/dashboard</code>.</li>
            <li><strong>Permisos:</strong>
                <ul>
                    <li>Ver su propio portafolio y valuación en tiempo real.</li>
                    <li>Registrar operaciones de compra/venta.</li>
                    <li>Consultar cotizaciones de mercado.</li>
                </ul>
            </li>
            <li><strong>Restricciones:</strong> No tiene acceso a paneles de métricas globales.</li>
        </ul>
    </li>
    <li><strong>Administrador (Admin)</strong>
        <ul>
            <li><strong>Inicio:</strong> Redirige a <code>/admin</code>.</li>
            <li><strong>Permisos:</strong>
                <ul>
                    <li>Acceso total a métricas de negocio (Usuarios, Volumen Operado).</li>
                    <li>Gestión de la plataforma.</li>
                </ul>
            </li>
        </ul>
    </li>
    <li><strong>Experto Financiero</strong>
        <ul>
            <li><strong>Inicio:</strong> Redirige a <code>/expert</code>.</li>
            <li><strong>Permisos:</strong>
                <ul>
                    <li>Emitir recomendaciones de inversión (Señales de compra/venta).</li>
                    <li>Gestionar su track record de sugerencias.</li>
                </ul>
            </li>
        </ul>
    </li>
</ul>

<p><strong>Seguridad Check:</strong> Si un usuario intenta acceder a una ruta no autorizada (ej. Inversor entrando a <code>/admin</code>), el sistema lo intercepta y redirige automáticamente a <code>/access-denied</code>.</p>

<hr>

<h2>📌 Estado actual de implementación (Frontend)</h2>

<ul>
    <li><strong>Completado (V1.0)</strong>
        <ul>
            <li>✅ Autenticación Full (JWT, Persistencia, Logout).</li>
            <li>✅ Flow de Inversión Completo: Buscar Activo -> Registrar Operación -> Ver en Portafolio.</li>
            <li>✅ Lógica Multimoneda: Manejo robusto de pares ARS/USD en tablas y gráficos.</li>
            <li>✅ Dashboards Responsivos: UI adaptada a Móvil/Tablet/Desktop con Material UI.</li>
            <li>✅ Integración Backend: Consumo de endpoints reales para Valuación, Operaciones y Cotizaciones.</li>
        </ul>
    </li>
    <li><strong>En Roadmap</strong>
        <ul>
            <li>Reportes exportables (PDF/Excel).</li>
            <li>Notificaciones en tiempo real (WebSockets) para cambios de precio.</li>
            <li>Expansión del módulo de "Comunidad" y "Noticias".</li>
        </ul>
    </li>
</ul>

<hr>

<h3>👨‍💻 Tips de Desarrollo</h3>

<ul>
    <li>
        <strong>Documentación API (Swagger):</strong>
        <p>Con el backend corriendo, accedé a <a href="https://localhost:7088/swagger" target="_blank">https://localhost:7088/swagger</a> para ver todos los endpoints disponibles, probar requests y ver los schemas de los DTOs.</p>
    </li>
    <li>
        <strong>Errores de Conexión (SSL):</strong>
        <p>Si ves errores tipo <code>Network Error</code> al intentar loguearte, probá abrir la URL del backend en otra pestaña y aceptar el certificado SSL autofirmado de desarrollo ("Continuar a localhost (no seguro)").</p>
    </li>
</ul>

<hr>

<h2>⚖️ Licencia</h2>

<p>MIT – ver archivo <code>LICENSE</code>.</p>
