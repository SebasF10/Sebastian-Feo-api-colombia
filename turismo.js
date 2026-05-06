// turismo.js - Guía Turística de Colombia
// Consume la API: https://api-colombia.com/api/v1/TouristicAttraction
// Corrección: el campo city.department viene null, se resuelve con fetch paralelo a /Department

const API_ATRACCIONES = "https://api-colombia.com/api/v1/TouristicAttraction";
const API_DEPARTAMENTOS = "https://api-colombia.com/api/v1/Department";

// Seleccionamos los elementos del DOM
const loadingDiv    = document.getElementById("loading");
const errorDiv      = document.getElementById("error");
const atraccionesDiv = document.getElementById("atracciones");
const contadorDiv   = document.getElementById("contador");

// Función principal que carga los datos
async function cargarAtracciones() {
  try {
    // Hacemos las dos peticiones en paralelo para mayor eficiencia
    const [respAtracciones, respDepartamentos] = await Promise.all([
      fetch(API_ATRACCIONES),
      fetch(API_DEPARTAMENTOS)
    ]);

    if (!respAtracciones.ok) throw new Error(`Error HTTP atracciones: ${respAtracciones.status}`);
    if (!respDepartamentos.ok) throw new Error(`Error HTTP departamentos: ${respDepartamentos.status}`);

    const [datos, departamentos] = await Promise.all([
      respAtracciones.json(),
      respDepartamentos.json()
    ]);

    // Construimos un mapa de id -> departamento para búsqueda rápida
    // La API devuelve { id, name, regionStr, ... }
    const mapaDepartamentos = {};
    departamentos.forEach(dep => {
      mapaDepartamentos[dep.id] = dep;
    });

    // Tomamos solo los primeros 20 (requisito extra opción 2)
    const primeros20 = datos.slice(0, 20);

    // Ocultamos el mensaje de carga
    loadingDiv.classList.add("hidden");

    // Mostramos el contador
    contadorDiv.classList.remove("hidden");
    contadorDiv.innerHTML = `<span>Mostrando <strong>${primeros20.length}</strong> de ${datos.length} atractivos turísticos</span>`;

    // Mostramos las tarjetas pasando también el mapa de departamentos
    mostrarAtracciones(primeros20, mapaDepartamentos);

  } catch (error) {
    console.error("Error al cargar las atracciones:", error);
    loadingDiv.classList.add("hidden");
    errorDiv.classList.remove("hidden");
  }
}

// Función que crea las tarjetas en el DOM
function mostrarAtracciones(atracciones, mapaDepartamentos) {
  atraccionesDiv.innerHTML = "";

  atracciones.forEach((atraccion) => {
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("card");

    // Obtenemos el nombre de la ciudad directamente del objeto city
    const nombreCiudad = atraccion.city?.name || "No disponible";

    // El departamento viene null en city.department, pero city.departmentId sí existe
    // Lo buscamos en nuestro mapa local
    const depId = atraccion.city?.departmentId;
    const departamento = depId ? mapaDepartamentos[depId] : null;
    const nombreDepartamento = departamento?.name || "No disponible";
    const nombreRegion       = departamento?.regionStr || "No disponible";

    tarjeta.innerHTML = `
      <div class="card-header">
        <h3 class="card-title">${atraccion.name || "Sin nombre"}</h3>
        <span class="card-badge">🏔️ Turismo</span>
      </div>
      <div class="card-body">
        <div class="card-meta">
          <span class="meta-item">
            🏙️ <strong>Ciudad:</strong> ${nombreCiudad}
          </span>
          <span class="meta-item">
            🗺️ <strong>Departamento:</strong> ${nombreDepartamento}
          </span>
          <span class="meta-item">
            🌎 <strong>Región:</strong> ${nombreRegion}
          </span>
        </div>
        <p class="card-desc">${atraccion.description || "Sin descripción disponible."}</p>
      </div>
    `;

    atraccionesDiv.appendChild(tarjeta);
  });
}

// Llamamos a la función al cargar la página
cargarAtracciones();
