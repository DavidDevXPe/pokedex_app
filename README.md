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

- React 18
- React Router
- Redux Toolkit y React Redux
- Axios
- Vite
- ESLint
- Vitest, Playwright y axe-core
- PropTypes
- PokéAPI

## Requisitos

- Node.js 20.19 o superior, o Node.js 22.12 o superior.
- npm.
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
.github/workflows/     Validación y despliegue automatizados
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

La aplicación utiliza `HashRouter`, por lo que la carpeta `dist/` puede desplegarse en un alojamiento estático sin configurar redirecciones de rutas.

El workflow `.github/workflows/quality.yml` ejecuta lint, cobertura con umbrales, build, auditoría de dependencias y pruebas E2E en las ramas de trabajo y en cada pull request dirigido a `main`.

## Base pública y compilación para subrutas

Vite usa `/` como base predeterminada. Para alojar la aplicación dentro de una subruta, define `VITE_BASE_PATH` con barras inicial y final:

```bash
VITE_BASE_PATH=/pokedex_app/ npm run build
```

En PowerShell:

```powershell
$env:VITE_BASE_PATH = '/pokedex_app/'
npm.cmd run build
```

La configuración acepta también `./` para generar rutas relativas. Las referencias de la interfaz a archivos de `public/` pasan por `src/utils/publicAsset.js`, por lo que respetan la base configurada sin mantener una lista manual de nombres.

## Despliegue en GitHub Pages

El workflow `.github/workflows/deploy-pages.yml` valida, audita, ejecuta los E2E sobre la subruta, compila y publica `dist/` al hacer push a `main` o al ejecutarse manualmente. Está preparado para el repositorio `pokedex_app` con `VITE_BASE_PATH=/pokedex_app/`.

Para activarlo:

1. Abre **Settings → Pages** en GitHub.
2. Selecciona **GitHub Actions** como fuente de publicación.
3. Envía los cambios a `main` o ejecuta **Deploy to GitHub Pages** desde la pestaña Actions.
4. Usa la URL que devuelve el job `deploy`; el README no fija un usuario, organización ni dominio final.

Si el repositorio cambia de nombre, ajusta `VITE_BASE_PATH` en el workflow. Para un sitio de usuario u organización (`<usuario>.github.io`) o un dominio personalizado servido desde la raíz, utiliza `/`.

La aplicación usa `HashRouter`, por lo que sus rutas internas no requieren reglas de reescritura en Pages.

## SEO y aplicación instalable

`index.html` incluye descripción, directivas de indexación, Open Graph, Twitter Cards y un aviso para navegadores sin JavaScript. `public/site.webmanifest` aporta metadatos básicos de instalación y `public/robots.txt` permite el rastreo.

`index.html` declara `canonical` y `og:url` apuntando al despliegue en Vercel (`https://pokedex-app-mu-livid.vercel.app/`), y las imágenes sociales (`og:image`, `twitter:image`) usan esa misma URL absoluta. Si el proyecto pasa a un dominio propio o a GitHub Pages como destino principal, actualiza estas URLs en consecuencia.

En un GitHub Pages de proyecto, `robots.txt` queda dentro de `/pokedex_app/`; si se configura un dominio propio conviene revisar también el archivo servido en la raíz del host.

## Pruebas E2E

`playwright.config.js`, `scripts/run-e2e.js` y `e2e/smoke.spec.js` definen un recorrido determinista con PokéAPI simulada: entrada del entrenador, listado, detalle y ruta 404. Se ejecuta en escritorio y móvil, cubre los temas claro y oscuro y realiza auditorías WCAG 2.0–2.2 con axe-core. El comando compila la aplicación, levanta `vite preview` en el puerto 4173 y lo cierra al finalizar, también en Windows.

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
