# Pokédex App

Aplicación web para explorar Pokémon, buscar por nombre, filtrar por tipo y consultar información detallada como estadísticas, habilidades, peso, altura y movimientos.

El proyecto consume datos de [PokéAPI](https://pokeapi.co/) y está construido como una SPA con React y Vite.

## Funcionalidades

- Acceso mediante el nombre y el género visual del entrenador.
- Listado paginado de Pokémon.
- Ilustraciones de Pokémon obtenidas desde PokéAPI, con una alternativa accesible cuando no están disponibles.
- Interfaz en español de forma predeterminada y cambio inmediato a inglés.
- Modos claro y oscuro con preferencias persistentes entre sesiones.
- Búsqueda por nombre.
- Filtro por tipo compatible con la búsqueda activa.
- Página de detalle con estadísticas, habilidades y movimientos.
- Estados visibles de carga, error, reintento y resultados vacíos.
- Caché en memoria y cancelación de peticiones obsoletas.
- Navegación accesible mediante teclado.
- Diseño adaptable para escritorio, tablet y móvil.
- Persistencia del nombre y género visual del entrenador durante la sesión.
- Avatares masculino/femenino e insignias gráficas para los 18 tipos principales.
- Favoritos persistentes entre sesiones y filtro combinable con búsqueda y tipo.
- Búsqueda, tipo y página guardados en la URL.
- Retorno desde el detalle conservando los filtros y la página activa.
- Detalles resilientes con fallback de imagen y movimientos expandibles.
- Carga diferida de páginas para reducir el JavaScript inicial.
- Página 404 para rutas inexistentes.

## Tecnologías

- React 19
- React Router
- Redux Toolkit y React Redux
- Axios
- Vite
- ESLint
- Vitest, Playwright y axe-core
- PropTypes
- PokéAPI

## Requisitos

- Node.js `^22.22.2`, `^24.15.0` o `>=26.0.0`, de acuerdo con `package.json`.
- npm `>=10.9.0`; el gestor declarado para reproducir el lockfile es npm 11.13.0.
- Conexión a internet para consultar PokéAPI y cargar la fuente Inter.

## Instalación

```bash
git clone https://github.com/DavidDevXPe/pokedex_app.git
cd pokedex_app
npm ci
npm run dev
```

Vite mostrará la dirección local de la aplicación, normalmente `http://localhost:5173`.

En PowerShell, si la política de ejecución bloquea `npm.ps1`, utiliza `npm.cmd`:

```powershell
npm.cmd ci
npm.cmd run dev
```

## Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo. |
| `npm run lint` | Revisa JavaScript y JSX con ESLint. |
| `npm run build` | Genera la compilación de producción en `dist/`. |
| `npm run preview` | Sirve localmente la compilación de producción. |
| `npm test` | Ejecuta la suite automatizada una vez. |
| `npm run test:watch` | Ejecuta pruebas en modo interactivo. |
| `npm run test:coverage` | Ejecuta las pruebas unitarias y genera cobertura. |
| `npm run test:e2e` | Ejecuta los smoke tests de Playwright. |
| `npm run test:e2e:install` | Instala Chromium para Playwright. |
| `npm run check` | Ejecuta lint, cobertura y build en secuencia. |

## Estructura principal

```text
src/
├── components/       Componentes reutilizables por página
├── hooks/            Acceso a datos y estados de peticiones
├── pages/            Vistas asociadas a las rutas
├── store/            Store y slices de Redux Toolkit
├── styles/           Estilos globales compartidos
├── App.jsx           Definición de rutas
└── main.jsx          Punto de entrada de React
e2e/                   Smoke tests de Playwright
public/                Activos estáticos, manifest y robots.txt
.github/workflows/     Validación automatizada
netlify.toml           Build, cabeceras y caché de producción
```

## Rutas

| Ruta | Contenido |
| --- | --- |
| `/#/` | Formulario de acceso del entrenador. |
| `/#/pokedex` | Listado, búsqueda, filtros y paginación. |
| `/#/pokedex/:id` | Detalle del Pokémon seleccionado. |
| Cualquier otra ruta | Página 404 con retorno seguro. |

Las rutas de la Pokédex requieren que el usuario introduzca primero un nombre válido.

## Calidad y compilación

Antes de publicar cambios se recomienda ejecutar:

```bash
npm run check
npm run test:e2e
npm audit
```

La aplicación utiliza `HashRouter`, por lo que Netlify puede servir la carpeta `dist/` sin configurar redirecciones para las rutas internas.

El workflow `.github/workflows/quality.yml` ejecuta lint, cobertura con umbrales, build, auditoría de dependencias y pruebas E2E en las ramas de trabajo y en cada pull request dirigido a `main`.

## Despliegue en Netlify

El destino público del proyecto es [https://pokedex08.netlify.app/](https://pokedex08.netlify.app/). `netlify.toml` mantiene la configuración de producción dentro del repositorio:

- ejecuta `npm run build` con Node.js 24.15.0;
- publica la carpeta `dist/` desde la raíz del dominio;
- aplica cabeceras de seguridad compatibles con PokéAPI, los sprites oficiales y Google Fonts;
- evita almacenar HTML obsoleto y aplica caché inmutable a los bundles JavaScript y CSS versionados de `dist/assets/`;
- sirve `site.webmanifest` con su tipo MIME correspondiente.

Al conectar el repositorio en Netlify no es necesario duplicar el comando de build ni el directorio de publicación en la interfaz. Tampoco debe definirse `VITE_BASE_PATH`: el despliegue oficial se sirve desde `/`. La aplicación utiliza `HashRouter`, por lo que las rutas internas no necesitan reglas de redirección.

Antes de publicar, ejecuta localmente los comandos indicados en «Calidad y compilación». Netlify se ocupa del build y la publicación; GitHub Actions conserva únicamente las comprobaciones de calidad.

## SEO y manifest web

`index.html` incluye descripción, directivas de indexación, URL canónica, Open Graph, Twitter Cards y un aviso para navegadores sin JavaScript. Las URLs canónica y sociales apuntan al despliegue oficial en Netlify, y `public/robots.txt` permite rastrear el documento público.

`public/site.webmanifest` aporta nombre, colores e iconos para la integración que ofrezca cada navegador. El proyecto no se presenta como una PWA con funcionamiento sin conexión: no registra un service worker ni almacena las respuestas de PokéAPI para uso offline.

No se declara un sitemap artificial para las rutas con fragmento (`/#/...`), porque los fragmentos no representan documentos independientes para los rastreadores. Si el sitio adopta rutas reales o un dominio distinto, deben revisarse conjuntamente el sitemap, la URL canónica y las etiquetas sociales.

## Pruebas E2E

`playwright.config.js`, `scripts/run-e2e.js` y `e2e/smoke.spec.js` definen recorridos deterministas con PokéAPI simulada: entrada y validación del entrenador, listado, búsqueda, tipos, favoritos, paginación por teclado, detalle, cambio de idioma y ruta 404. Las 10 pruebas se ejecutan en escritorio y móvil, cubren los temas claro y oscuro y realizan auditorías WCAG 2.0–2.2 con axe-core. El comando compila la aplicación, levanta `vite preview` en el puerto 4173 y lo cierra al finalizar, también en Windows.

Después de `npm ci`, instala Chromium una vez y ejecuta la suite:

```bash
npm run test:e2e:install
npm run test:e2e
```

En CI, instala Chromium y sus dependencias del sistema con:

```bash
npx playwright install --with-deps chromium
```

Para ejecutar el smoke test contra un despliegue ya existente, define `E2E_BASE_URL` con la URL que contiene la aplicación y ejecuta Playwright; en ese caso no se inicia el servidor local.

## Créditos

Los datos e ilustraciones se obtienen desde [PokéAPI](https://pokeapi.co/). Pokémon y los nombres, personajes, ilustraciones y marcas relacionados pertenecen a sus respectivos titulares. Este proyecto no afirma afiliación ni patrocinio oficial.

Consulta [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) para ver atribuciones, dependencias y activos cuya procedencia aún debe confirmarse.

## Licencia

El código de este repositorio se distribuye bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para el texto completo.

Esta licencia cubre únicamente el código fuente. Los datos e ilustraciones de PokéAPI, la fuente Inter y los activos locales de `public/` mantienen sus propios términos; consulta [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
