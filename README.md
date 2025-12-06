<h1 align="center">🛠️ FinanzApp - Backend</h1>

<div align="center">
    <a href="https://github.com/agussantinelli/FinanzApp-FrontEnd.git" target="_blank">
        <img src="https://img.shields.io/badge/🚀%20Repo%20Frontend-Next.js-20232A?style=for-the-badge&logo=next.js&logoColor=white" alt="Frontend Repo Badge"/>
    </a>
    <a href="https://github.com/agussantinelli/FinanzApp-BackEnd.git" target="_blank">
        <img src="https://img.shields.io/badge/⚙️%20Repo%20Backend%20(Estás%20Aquí)-ASP.NET%20Core-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" alt="Backend Repo Badge"/>
    </a>
    <a href="https://github.com/agussantinelli" target="_blank">
        <img src="https://img.shields.io/badge/👤%20Contacto-agussantinelli-000000?style=for-the-badge&logo=github&logoColor=white" alt="Contact Badge"/>
    </a>
</div>

<p align="center">
    <img src="https://img.shields.io/badge/.NET-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" alt=".NET Badge"/>
    <img src="https://img.shields.io/badge/ASP.NET%20Core-512BD4?style=for-the-badge&logo=asp.net&logoColor=white" alt="ASP.NET Core Badge"/>
    <img src="https://img.shields.io/badge/SQL%20Server-CC2927?style=for-the-badge&logo=microsoftsqlserver&logoColor=white" alt="SQL Server Badge"/>
    <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger Badge"/>
    <img src="https://img.shields.io/badge/JWT%20Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT Badge"/>
    <a href="https://drive.google.com/drive/folders/1b5H8fDgOKmrxfY4RXfi4oYA3CvXy4ot6?usp=drive_link" target="_blank">
        <img src="https://img.shields.io/badge/📂%20Documentación%20Proyecto-4285F4?style=for-the-badge&logo=googledrive&logoColor=white" alt="Carpeta TPI Drive Badge"/>
    </a>
</p>

<hr>

<h2>🎯 Objetivo y Rol</h2>

<p>Este repositorio contiene la <strong>API REST</strong> de alto rendimiento construida en <strong>ASP.NET Core</strong> que actúa como el <em>motor de datos, lógica de negocio y persistencia</em> para toda la aplicación FinanzApp.</p>

<p>Su rol principal es:</p>
<ul>
    <li><strong>Agregación de Datos:</strong> Consumir, normalizar y cachear datos de múltiples APIs financieras externas (<strong>CoinGecko</strong> para cripto, <strong>DolarAPI</strong> para tipos de cambio en ARS, <strong>Yahoo Finance</strong> para acciones y CEDEARs).</li>
    <li><strong>Lógica de Conversión:</strong> Aplicar la lógica compleja para la valuación y conversión de activos usando los tipos de cambio argentinos (MEP, CCL, Oficial, Blue).</li>
    <li><strong>Persistencia:</strong> Gestionar los portafolios de usuarios, históricos y cotizaciones en una base de datos relacional. Actualmente se utiliza <strong>SQL Server</strong>.</li>
    <li><strong>Seguridad:</strong> Implementar la autenticación y autorización (JWT, espacios personales, roles de usuario).</li>
</ul>

<h2>⚙️ Stack Tecnológico</h2>

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
            <td>ASP.NET Core (mínimo .NET 8)</td>
            <td>Alto rendimiento para APIs REST, usando Minimal APIs.</td>
        </tr>
        <tr>
            <td><strong>Lenguaje</strong></td>
            <td>C#</td>
            <td>Foco en una arquitectura limpia, extensible y mantenible.</td>
        </tr>
        <tr>
            <td><strong>Base de Datos</strong></td>
            <td>SQL Server</td>
            <td>Base de datos relacional robusta, enfoque Code First.</td>
        </tr>
        <tr>
            <td><strong>ORM</strong></td>
            <td>Entity Framework Core</td>
            <td>Contexto principal: <code>DBFinanzasContext</code> (proyecto <code>Data</code>).</td>
        </tr>
        <tr>
            <td><strong>Documentación</strong></td>
            <td>Swagger / OpenAPI</td>
            <td>Exploración y prueba de endpoints desde <code>/swagger</code>.</td>
        </tr>
    </tbody>
</table>

<h2>🏗️ Arquitectura de la Solución</h2>

<ul>
    <li><strong>Domain</strong> (Capa de Dominio)
        <ul>
            <li>Entidades principales:
                <ul>
                    <li><code>Persona</code>: Usuario del sistema (Admin, Inversor, Experto) con datos personales, residencia y rol.</li>
                    <li><code>Activo</code>: Instrumento financiero (acción, bono, CEDEAR, cripto, índice, ON, moneda, etc.).</li>
                    <li><code>Operacion</code>: Registro de compra/venta de un activo por parte de una persona.</li>
                    <li><code>Cotizacion</code>: Precio de un activo en un momento determinado, con moneda y fuente.</li>
                    <li><code>CedearRatio</code>: Relación entre un CEDEAR y su activo subyacente en USA.</li>
                    <li><code>TipoActivo</code>: Catálogo de tipos (Acciones, Bonos, CEDEARs, Cripto, ON, Índices, Moneda, etc.).</li>
                    <li><code>Pais</code>, <code>Provincia</code>, <code>Localidad</code>: Modelo geográfico para residencia y nacionalidad.</li>
                    <li><code>Recomendacion</code>: Informe de inversión creado por un experto con título, justificación, riesgo y horizonte.</li>
                    <li><code>RecomendacionDetalle</code>: Detalle de cada activo incluido en una recomendación (precio al recomendar, objetivo, stop loss, acción sugerida).</li>
                </ul>
            </li>
            <li>Enums:
                <ul>
                    <li><code>RolPersona</code>: Define el rol del usuario (Admin, Inversor, Experto).</li>
                    <li><code>TipoOperacion</code>: Tipo de operación (Compra, Venta).</li>
                    <li><code>HorizonteInversion</code>: Horizonte temporal de la inversión:
                        <ul>
                            <li><code>Intradia</code> (1)</li>
                            <li><code>CortoPlazo</code> (2)</li>
                            <li><code>MedianoPlazo</code> (3)</li>
                            <li><code>LargoPlazo</code> (4)</li>
                        </ul>
                    </li>
                    <li><code>NivelRiesgo</code>: Perfil de riesgo:
                        <ul>
                            <li><code>Conservador</code> (1)</li>
                            <li><code>Moderado</code> (2)</li>
                            <li><code>Agresivo</code> (3)</li>
                            <li><code>Especulativo</code> (4)</li>
                        </ul>
                    </li>
                    <li><code>TipoRecomendacion</code>: Intensidad de la recomendación:
                        <ul>
                            <li><code>CompraFuerte</code> (1)</li>
                            <li><code>Comprar</code> (2)</li>
                            <li><code>Mantener</code> (3)</li>
                            <li><code>Vender</code> (4)</li>
                            <li><code>VentaFuerte</code> (5)</li>
                        </ul>
                    </li>
                </ul>
            </li>
        </ul>
    </li>
    <li><strong>Data</strong> (Acceso a Datos)
        <ul>
            <li><code>DBFinanzasContext</code>:
                <ul>
                    <li><code>DbSet&lt;Persona&gt; Personas</code></li>
                    <li><code>DbSet&lt;Activo&gt; Activos</code></li>
                    <li><code>DbSet&lt;Operacion&gt; Operaciones</code></li>
                    <li><code>DbSet&lt;Cotizacion&gt; Cotizaciones</code></li>
                    <li><code>DbSet&lt;CedearRatio&gt; CedearRatios</code></li>
                    <li><code>DbSet&lt;TipoActivo&gt; TiposActivos</code></li>
                    <li><code>DbSet&lt;Pais&gt; Paises</code></li>
                    <li><code>DbSet&lt;Provincia&gt; Provincias</code></li>
                    <li><code>DbSet&lt;Localidad&gt; Localidades</code></li>
                    <li><code>DbSet&lt;Recomendacion&gt; Recomendaciones</code></li>
                    <li><code>DbSet&lt;RecomendacionDetalle&gt; RecomendacionDetalles</code></li>
                </ul>
            </li>
            <li>Configuración Fluent API:
                <ul>
                    <li>Índices únicos (<code>Email</code> en <code>Persona</code>, <code>Symbol</code> en <code>Activo</code>, códigos ISO en <code>Pais</code>, etc.).</li>
                    <li>Tipos de datos específicos (<code>decimal(18,4)</code>, <code>decimal(18,2)</code>, <code>datetime2</code>, <code>char(3)</code>, <code>tinyint</code>, <code>bit</code>...).</li>
                    <li>Relaciones y claves foráneas con reglas de borrado (<code>Restrict</code>, <code>Cascade</code>).</li>
                    <li>Relaciones uno a uno para <code>CedearRatio</code> (CEDEAR &lt;-&gt; Activo USA).</li>
                    <li>Relaciones uno a muchos para <code>Recomendacion</code> &rarr; <code>RecomendacionDetalle</code>.</li>
                </ul>
            </li>
            <li><code>DbSeeder</code>: Carga inicial de:
                <ul>
                    <li>Países (RestCountries) y provincias/localidades de Argentina (Georef AR).</li>
                    <li>Tipos de activo, activos base y ratios CEDEAR.</li>
                    <li>Usuarios demo (Admin, Inversor, Experto).</li>
                </ul>
            </li>
        </ul>
    </li>
    <li><strong>Services</strong> (Capa de Servicios / Lógica de Negocio)
        <ul>
            <li><code>PersonaService</code>, <code>GeoService</code>, <code>CedearsService</code>, <code>CryptoService</code>, <code>StocksService</code>, <code>DolarService</code>, <code>RecomendacionesService</code>, etc.</li>
            <li>Encapsulan reglas de negocio, orquestación entre repositorios y clientes externos.</li>
        </ul>
    </li>
    <li><strong>ApiClient</strong> (Integraciones Externas)
        <ul>
            <li><code>CoinGeckoClient</code>: Precios y top de criptomonedas.</li>
            <li><code>DolarApiClient</code>: Tipos de cambio ARS (Oficial, Blue, MEP, CCL, etc.).</li>
            <li><code>YahooFinanceClient</code>: Precios de acciones, índices y CEDEARs.</li>
        </ul>
    </li>
    <li><strong>WebAPI</strong> (Capa de Presentación / Endpoints)
        <ul>
            <li>Punto de entrada de la app (<code>Program.cs</code>).</li>
            <li>Endpoints agrupados por módulo con Minimal APIs (Auth, Dólar, Cripto, Stocks, Cedears, Activos, Operaciones, Recomendaciones, etc.).</li>
            <li><code>JwtTokenService</code> y configuración de autenticación/autorización.</li>
        </ul>
    </li>
</ul>

<hr>

<h2>📦 Schemas principales (Swagger)</h2>

<p>En la documentación OpenAPI (<code>/swagger/v1/swagger.json</code>) se exponen los modelos más relevantes:</p>

<ul>
    <li><strong>Persona</strong>:
        <ul>
            <li>Identidad básica (Nombre, Apellido, Email, FechaNacimiento).</li>
            <li>Datos de residencia (<code>NacionalidadId</code>, <code>PaisResidenciaId</code>, <code>LocalidadResidenciaId</code>).</li>
            <li>Seguridad (<code>PasswordHash</code>, <code>Rol</code>, <code>Estado</code>, <code>FechaAlta</code>).</li>
        </ul>
    </li>
    <li><strong>Activo</strong>:
        <ul>
            <li><code>Id</code>, <code>Symbol</code>, <code>Nombre</code>, <code>Descripcion</code>, <code>MonedaBase</code>, <code>EsLocal</code>, <code>TipoActivoId</code>.</li>
        </ul>
    </li>
    <li><strong>TipoActivo</strong>:
        <ul>
            <li><code>Id</code>, <code>Nombre</code>, <code>Descripcion</code>.</li>
        </ul>
    </li>
    <li><strong>Operacion</strong>:
        <ul>
            <li><code>Id</code>, <code>PersonaId</code>, <code>ActivoId</code>, <code>Tipo</code> (<code>TipoOperacion</code>), <code>Cantidad</code>, <code>PrecioUnitario</code>, <code>MonedaOperacion</code>, <code>Comision</code>, <code>FechaOperacion</code>.</li>
        </ul>
    </li>
    <li><strong>Cotizacion</strong>:
        <ul>
            <li><code>Id</code>, <code>ActivoId</code>, <code>Precio</code>, <code>Moneda</code>, <code>TimestampUtc</code>, <code>Source</code>.</li>
        </ul>
    </li>
    <li><strong>CedearRatio</strong>:
        <ul>
            <li><code>Id</code>, <code>CedearId</code>, <code>UsAssetId</code>, <code>Ratio</code>.</li>
        </ul>
    </li>
    <li><strong>Recomendacion</strong>:
        <ul>
            <li><code>Id</code>, <code>PersonaId</code> (autor experto), <code>Titulo</code>, <code>JustificacionLogica</code>, <code>Fuente</code>, <code>FechaInforme</code>, <code>Riesgo</code> (<code>NivelRiesgo</code>), <code>Horizonte</code> (<code>HorizonteInversion</code>).</li>
        </ul>
    </li>
    <li><strong>RecomendacionDetalle</strong>:
        <ul>
            <li><code>Id</code>, <code>RecomendacionId</code>, <code>ActivoId</code>, <code>PrecioAlRecomendar</code>, <code>PrecioObjetivo</code>, <code>StopLoss</code>, <code>Accion</code> (<code>TipoRecomendacion</code>).</li>
        </ul>
    </li>
    <li><strong>DTOs de integración</strong> (ejemplos):
        <ul>
            <li><code>DolarDTO</code>: Tipo de dólar, valor compra/venta, variación.</li>
            <li><code>CryptoDTO</code>/<code>CryptoDetailDTO</code>: Símbolo, nombre, precios, variaciones.</li>
            <li><code>DualQuoteDTO</code> / <code>PairDTO</code>: Pares de activos para cálculos ARS/USD.</li>
        </ul>
    </li>
</ul>

<hr>

<h2>🌐 Conexión con el Frontend</h2>

<p>Esta API es la fuente de datos para el <a href="https://github.com/agussantinelli/FinanzApp-FrontEnd.git">FinanzApp-FrontEnd</a>.</p>
<ul>
    <li><strong>Endpoint Base (desarrollo):</strong> <code>https://localhost:7088</code> (o puerto configurado en <code>launchSettings.json</code>).</li>
    <li><strong>CORS:</strong> Configurado para aceptar peticiones desde <code>http://localhost:3000</code> (Next.js) durante desarrollo.</li>
    <li><strong>Swagger:</strong> <code>https://localhost:7209/swagger</code> (o equivalente según configuración).</li>
</ul>

<hr>

<h2>📚 Catálogo de Endpoints</h2>

<p>A continuación se detalla la lista de endpoints disponibles en la API, organizada por módulo funcional.</p>

<!-- AUTENTICACIÓN -->
<h3>🔐 Autenticación</h3>
<table>
    <thead>
        <tr>
            <th>Método</th>
            <th>Endpoint</th>
            <th>Descripción</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>POST</code></td>
            <td><code>/api/auth/login</code></td>
            <td>Inicia sesión y genera un token JWT.</td>
        </tr>
        <tr>
            <td><code>POST</code></td>
            <td><code>/api/auth/register</code></td>
            <td>Registra un nuevo usuario inversor en el sistema.</td>
        </tr>
    </tbody>
</table>

<!-- DÓLAR -->
<h3>💵 Dólar y Divisas</h3>
<table>
    <thead>
        <tr>
            <th>Método</th>
            <th>Endpoint</th>
            <th>Descripción</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>GET</code></td>
            <td><code>/api/dolar/cotizaciones</code></td>
            <td>Obtiene las cotizaciones de los distintos tipos de dólar (Blue, MEP, CCL, Oficial, etc.).</td>
        </tr>
    </tbody>
</table>

<!-- CRIPTO -->
<h3>₿ Criptomonedas</h3>
<table>
    <thead>
        <tr>
            <th>Método</th>
            <th>Endpoint</th>
            <th>Descripción</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>GET</code></td>
            <td><code>/api/crypto/top</code></td>
            <td>Obtiene el Top 10 de criptomonedas filtrado (por ejemplo, por capitalización de mercado).</td>
        </tr>
        <tr>
            <td><code>GET</code></td>
            <td><code>/api/crypto/{symbol}</code></td>
            <td>Obtiene precio individual e información básica de una criptomoneda específica.</td>
        </tr>
    </tbody>
</table>

<!-- ACCIONES -->
<h3>📈 Acciones (Stocks)</h3>
<table>
    <thead>
        <tr>
            <th>Método</th>
            <th>Endpoint</th>
            <th>Descripción</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>GET</code></td>
            <td><code>/api/stocks/indices</code></td>
            <td>Obtiene los principales índices bursátiles para el tablero de mercado.</td>
        </tr>
        <tr>
            <td><code>POST</code></td>
            <td><code>/api/stocks/duals</code></td>
            <td>Obtiene cotizaciones duales (ARS/USD) para un conjunto de pares de acciones, usando el dólar indicado.</td>
        </tr>
    </tbody>
</table>

<!-- CEDEARS -->
<h3>📄 Cedears</h3>
<table>
    <thead>
        <tr>
            <th>Método</th>
            <th>Endpoint</th>
            <th>Descripción</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>GET</code></td>
            <td><code>/api/cedears/duals</code></td>
            <td>Calcula información combinada para pares acción local / acción USA (duals).</td>
        </tr>
    </tbody>
</table>

<!-- GEOGRAFÍA -->
<h3>🗺️ Geografía</h3>
<table>
    <thead>
        <tr>
            <th>Método</th>
            <th>Endpoint</th>
            <th>Descripción</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>GET</code></td>
            <td><code>/geo/register-data</code></td>
            <td>Devuelve datos geográficos (países, provincias, localidades) para el formulario de registro.</td>
        </tr>
    </tbody>
</table>

<!-- GESTIÓN DE ACTIVOS -->
<h3>🧾 Gestión de Activos</h3>
<table>
    <thead>
        <tr>
            <th>Método</th>
            <th>Endpoint</th>
            <th>Descripción</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>GET</code></td>
            <td><code>/api/activos/{id}</code></td>
            <td>Obtiene el detalle completo de un activo específico buscado por su ID numérico.</td>
        </tr>
        <tr>
            <td><code>POST</code></td>
            <td><code>/api/activos</code></td>
            <td>Registra un nuevo instrumento financiero en la base de datos.</td>
        </tr>
        <tr>
            <td><code>GET</code></td>
            <td><code>/api/activos</code></td>
            <td>Recupera el listado completo de activos, ordenados por defecto.</td>
        </tr>
        <tr>
            <td><code>GET</code></td>
            <td><code>/api/activos/tipo/{tipoId}</code></td>
            <td>Devuelve una lista de activos filtrada por su categoría (por ejemplo, solo Criptos).</td>
        </tr>
        <tr>
            <td><code>GET</code></td>
            <td><code>/api/activos/no-moneda</code></td>
            <td>Obtiene el universo de activos invertibles, excluyendo las monedas FIAT.</td>
        </tr>
        <tr>
            <td><code>GET</code></td>
            <td><code>/api/activos/ranking</code></td>
            <td>Obtiene activos ordenados dinámicamente por criterios de mercado (precio, variación) o alfabéticos.</td>
        </tr>
        <tr>
            <td><code>GET</code></td>
            <td><code>/api/activos/buscar/{texto}</code></td>
            <td>Busca activos por coincidencia parcial en símbolo o nombre.</td>
        </tr>
    </tbody>
</table>

<!-- OPERACIONES -->
<h3>📊 Operaciones</h3>
<table>
    <thead>
        <tr>
            <th>Método</th>
            <th>Endpoint</th>
            <th>Descripción</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>POST</code></td>
            <td><code>/api/operaciones</code></td>
            <td>Registra una nueva operación de compra o venta de activos.</td>
        </tr>
        <tr>
            <td><code>GET</code></td>
            <td><code>/api/operaciones</code></td>
            <td>Obtiene el historial completo de operaciones del sistema.</td>
        </tr>
        <tr>
            <td><code>GET</code></td>
            <td><code>/api/operaciones/persona/{personaId}</code></td>
            <td>Obtiene las operaciones realizadas por un usuario específico.</td>
        </tr>
        <tr>
            <td><code>GET</code></td>
            <td><code>/api/operaciones/activo/{activoId}</code></td>
            <td>Obtiene todas las operaciones asociadas a un activo específico.</td>
        </tr>
    </tbody>
</table>

<!-- RECOMENDACIONES -->
<h3>🧠 Recomendaciones</h3>
<table>
    <thead>
        <tr>
            <th>Método</th>
            <th>Endpoint</th>
            <th>Descripción</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>GET</code></td>
            <td><code>/api/recomendaciones</code></td>
            <td>Obtiene la lista completa de recomendaciones/informes.</td>
        </tr>
        <tr>
            <td><code>POST</code></td>
            <td><code>/api/recomendaciones</code></td>
            <td>Crea un nuevo informe de recomendación con sus detalles.</td>
        </tr>
        <tr>
            <td><code>GET</code></td>
            <td><code>/api/recomendaciones/{id}</code></td>
            <td>Obtiene el detalle completo de una recomendación, incluyendo sus activos.</td>
        </tr>
        <tr>
            <td><code>GET</code></td>
            <td><code>/api/recomendaciones/activo/{activoId}</code></td>
            <td>Trae recomendaciones que incluyan el activo especificado.</td>
        </tr>
        <tr>
            <td><code>GET</code></td>
            <td><code>/api/recomendaciones/tipo-activo/{tipoId}</code></td>
            <td>Trae recomendaciones que contengan activos de cierto tipo.</td>
        </tr>
        <tr>
            <td><code>GET</code></td>
            <td><code>/api/recomendaciones/recientes/{cantidad}</code></td>
            <td>Obtiene las últimas recomendaciones publicadas.</td>
        </tr>
    </tbody>
</table>

<!-- TIPOS DE ACTIVO -->
<h3>📑 Tipos de Activo</h3>
<table>
    <thead>
        <tr>
            <th>Método</th>
            <th>Endpoint</th>
            <th>Descripción</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>GET</code></td>
            <td><code>/api/tipos-activo</code></td>
            <td>Obtiene la lista de tipos de activo disponibles ordenados por ID.</td>
        </tr>
        <tr>
            <td><code>GET</code></td>
            <td><code>/api/tipos-activo/no-moneda</code></td>
            <td>Obtiene todos los tipos de activo excepto <code>Moneda</code>.</td>
        </tr>
    </tbody>
</table>

<hr>

<h2>🔐 Seguridad (JWT &amp; Hashing)</h2>

<p>La API utiliza <strong>JWT Bearer</strong> para proteger los endpoints.</p>

<h3>🔑 Hash de Contraseñas</h3>
<ul>
    <li>Las contraseñas se almacenan hasheadas usando <strong>BCrypt</strong>.</li>
    <li>Nunca se guarda texto plano.</li>
</ul>

<h3>🔏 Roles y Políticas</h3>
<ul>
    <li><strong>UserLogged</strong>: Requiere autenticación (JWT válido).</li>
    <li><strong>AdminOnly</strong>: Solo rol <code>Admin</code>.</li>
    <li><strong>InversorOnly</strong>: Solo rol <code>Inversor</code> (dashboard personal).</li>
    <li><strong>ExpertoOnly</strong>: Solo rol <code>Experto</code> (gestión de recomendaciones).</li>
</ul>

<hr>

<h2>👥 Usuarios Demo</h2>

<p>El <code>DbSeeder</code> crea estos usuarios si no existen:</p>

<table>
    <thead>
        <tr>
            <th>Rol</th>
            <th>Email</th>
            <th>Password</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>Admin</strong></td>
            <td><code>admin@gmail.com</code></td>
            <td><code>admin</code></td>
        </tr>
        <tr>
            <td><strong>Inversor</strong></td>
            <td><code>agus@gmail.com</code></td>
            <td><code>agus</code></td>
        </tr>
        <tr>
            <td><strong>Experto</strong></td>
            <td><code>experto@gmail.com</code></td>
            <td><code>experto</code></td>
        </tr>
    </tbody>
</table>

<hr>

<h2>🚀 Setup Local</h2>

<h3>1. Requisitos</h3>
<ul>
    <li><a href="https://dotnet.microsoft.com/download" target="_blank">.NET SDK 8</a></li>
    <li>SQL Server (Express o LocalDB)</li>
</ul>

<h3>2. Configuración (<code>appsettings.json</code>)</h3>

<p><strong>Opción SQL Server Express:</strong></p>
<pre><code>"ConnectionStrings": {
  "FinanzAppDb": "Server=.\\SQLEXPRESS;Database=FinanzAppDb;Trusted_Connection=True;MultipleActiveResultSets=True;TrustServerCertificate=True;Connect Timeout=60;"
}</code></pre>

<p><strong>Opción LocalDB:</strong></p>
<pre><code>"ConnectionStrings": {
  "FinanzAppDb": "Server=(localdb)\\MSSQLLocalDB;Database=FinanzAppDb;Trusted_Connection=True;TrustServerCertificate=True;"
}</code></pre>

<h3>3. Base de Datos (Migraciones)</h3>

<p>Desde la terminal en la carpeta de la solución:</p>
<pre><code># Proyecto de inicio: WebAPI, Proyecto de datos: Data
dotnet ef database update --project Data --startup-project WebAPI</code></pre>
<p><em>O usando la consola de Package Manager: <code>Update-Database</code></em></p>

<h3>4. Ejecución</h3>

<pre><code>cd WebAPI
dotnet run</code></pre>

<p>Accedé a Swagger en: <code>https://localhost:7209/swagger</code></p>

<hr>

<h2>🔌 Integraciones (APIs Externas)</h2>

<table>
    <thead>
        <tr>
            <th>API</th>
            <th>Uso</th>
            <th>Notas</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>CoinGecko</strong></td>
            <td>Criptomonedas</td>
            <td>Fuente unificada de precios y top global.</td>
        </tr>
        <tr>
            <td><strong>DolarAPI</strong></td>
            <td>Tipos de Cambio</td>
            <td>Cotizaciones ARS (Oficial, Blue, MEP, CCL, etc.).</td>
        </tr>
        <tr>
            <td><strong>Yahoo Finance</strong></td>
            <td>Stocks / CEDEARs</td>
            <td>Precios de acciones, índices y ratios CEDEAR.</td>
        </tr>
        <tr>
            <td><strong>RestCountries</strong></td>
            <td>Países</td>
            <td>Seed inicial de países.</td>
        </tr>
        <tr>
            <td><strong>Georef AR</strong></td>
            <td>Provincias / Localidades</td>
            <td>Seed inicial para la geografía de Argentina.</td>
        </tr>
    </tbody>
</table>

<hr>

<h2>📌 Estado del Proyecto</h2>

<ul>
    <li>✅ <strong>Implementado:</strong> Arquitectura base, Auth JWT, Seeders, conexión a APIs externas, catálogos, ABM de usuarios, gestión de activos, operaciones básicas y sistema de recomendaciones.</li>
    <li>🚧 <strong>En Progreso:</strong> Persistencia de operaciones complejas, reportes (PDF/Excel), armado avanzado de portafolios, métricas de performance y módulo de recomendaciones inteligentes.</li>
</ul>

<hr>

<h2>🤝 Contribuir</h2>

<ol>
    <li>Hacé un <strong>Fork</strong> del repositorio.</li>
    <li>Creá una rama <code>feature/...</code> para tu cambio.</li>
    <li>Enviá un <strong>Pull Request</strong> con una descripción clara de la mejora o fix.</li>
</ol>

<h2>⚖️ Licencia</h2>

<p>MIT – ver archivo <code>LICENSE</code>.</p>
