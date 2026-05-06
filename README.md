# Sebastian-Feo-api-colombia

## Descripción
Mini portal web que consume datos en tiempo real desde la [API de Colombia](https://api-colombia.com/) y los muestra dinámicamente usando JavaScript. Incluye una guía turística y datos generales del país.
 
## Páginas
- **Inicio** (`index.html`): Menú principal con enlaces a las dos secciones.
- **Guía Turística** (`turismo.html`): Muestra los primeros 20 atractivos turísticos del país.
- **Colombia en Datos** (`colombia.html`): Muestra información general de Colombia (capital, población, superficie, moneda, idiomas, bandera, etc.).
## Tecnologías usadas
- HTML5
- CSS3 (variables CSS, Flexbox, Grid, animaciones)
- JavaScript ES6+ (fetch, async/await, manipulación del DOM)
- API pública: https://api-colombia.com/
## Instrucciones de uso
1. Clona o descarga el repositorio.
2. Abre el archivo `index.html` en tu navegador.
3. Navega entre las páginas usando los enlaces del menú.
> ⚠️ Requiere conexión a internet para consumir la API.
 
## Endpoints usados
| Página | Endpoint |
|---|---|
| Guía Turística | `/api/v1/TouristicAttraction` |
| Colombia en Datos | `/api/v1/Country/Colombia` |
 
## Nombre del estudiante
Sebastian Feo Murillo