# Avisos de terceros

Este archivo documenta recursos y servicios de terceros utilizados por la aplicación. No concede una licencia sobre el código de este repositorio (distribuido bajo la licencia MIT, ver [LICENSE](LICENSE)) ni sustituye los términos de cada proveedor.

## PokéAPI y contenido de Pokémon

- La aplicación consulta [PokéAPI](https://pokeapi.co/) para obtener nombres, tipos, estadísticas, habilidades, movimientos e ilustraciones.
- El código y la infraestructura de PokéAPI tienen sus propios términos y licencias, disponibles en el [repositorio oficial de PokéAPI](https://github.com/PokeAPI/pokeapi).
- Pokémon y los nombres, personajes, ilustraciones y marcas relacionados pertenecen a sus respectivos titulares. Este proyecto no afirma afiliación, patrocinio ni aprobación por parte de dichos titulares.

Antes de un uso comercial o una distribución pública amplia, el responsable del despliegue debe comprobar que su uso de los datos y recursos gráficos cumple los términos aplicables.

## Fuente Inter

La interfaz solicita la familia tipográfica [Inter](https://fonts.google.com/specimen/Inter) a Google Fonts. Inter fue creada por Rasmus Andersson y se distribuye bajo la [SIL Open Font License 1.1](https://openfontlicense.org/).

La fuente se carga de forma remota y no se redistribuye dentro de este repositorio.

## Dependencias de software

Las dependencias de producción y desarrollo declaradas en `package.json` pertenecen a sus respectivos autores y se distribuyen bajo sus propias licencias. Sus versiones resueltas se encuentran en `package-lock.json`; cualquier distribución debe conservar los avisos exigidos por esas licencias.

## Activos generados por IA

Los recursos locales de `public/` fueron generados mediante herramientas de inteligencia artificial para este proyecto, en especial:

- `pokedex.png`, `pokeball-icon.png`, `favicon.png`, `favicon.svg`, `maskable-icon.svg` y `og-pokedex-v2.png`;
- `header.png` y `Border.PNG`;
- los avatares de `public/assets/trainers/`;
- las insignias de `public/assets/types/`.

`maskable-icon.svg` es una adaptación vectorial creada para este repositorio a partir del motivo de Poké Ball de `favicon.svg`; su procedencia depende, por tanto, de la verificación pendiente de ese activo base.

Antes de un uso comercial, el titular debe verificar los términos de la herramienta de IA utilizada para generarlos, ya que las condiciones de uso comercial y de titularidad varían según el proveedor.

El repositorio no documenta todavía qué herramienta generó cada activo. Antes de publicar una nueva versión o autorizar un uso comercial, el responsable debe completar y conservar un registro de procedencia que incluya, como mínimo:

- archivo o grupo de archivos afectados;
- herramienta y proveedor;
- modelo y versión, si el proveedor los identifica;
- fecha de generación y, cuando corresponda, fecha de la última modificación mediante IA;
- URL y versión o fecha de consulta de los términos aplicables;
- cuenta o tipo de licencia con el que se generó el recurso y si permite el uso previsto;
- persona responsable de la verificación y fecha en que se realizó.

No deben completarse esos campos por suposición. Si no es posible recuperar información suficiente, el activo debe considerarse de procedencia pendiente y sustituirse por otro con licencia y origen verificables antes de un uso comercial.
