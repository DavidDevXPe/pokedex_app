# Pokédex App

Aplicación web para explorar Pokémon, buscar por nombre, filtrar por tipo y consultar información detallada como estadísticas, habilidades, peso, altura y movimientos.

El proyecto consume datos de [PokéAPI](https://pokeapi.co/) y está construido como una SPA con React y Vite.

## Funcionalidades

- Acceso mediante el nombre del entrenador.
- Listado paginado de Pokémon.
- Búsqueda por nombre.
- Filtro por tipo compatible con la búsqueda activa.
- Página de detalle con estadísticas, habilidades y movimientos.
- Estados visibles de carga, error, reintento y resultados vacíos.
- Caché en memoria y cancelación de peticiones obsoletas.
- Navegación accesible mediante teclado.
- Diseño adaptable para escritorio, tablet y móvil.
- Persistencia del entrenador durante la sesión.
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
- PropTypes
- PokéAPI

## Requisitos

- Node.js 20.19 o superior, o Node.js 22.12 o superior.
- npm.
- Conexión a internet para consultar PokéAPI y cargar la fuente Nunito.

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
| `npm run check` | Ejecuta lint, pruebas y build en secuencia. |

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
npm run lint
npm test
npm run build
npm audit
```

La aplicación utiliza `HashRouter`, por lo que la carpeta `dist/` puede desplegarse en un alojamiento estático sin configurar redirecciones de rutas.

El workflow `.github/workflows/quality.yml` ejecuta estas validaciones automáticamente en las ramas de trabajo y en cada pull request dirigido a `main`.

## Créditos

Los datos e ilustraciones oficiales se obtienen desde [PokéAPI](https://pokeapi.co/). Pokémon y sus nombres relacionados pertenecen a sus respectivos propietarios.
