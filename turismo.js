// turismo.js - Guía Turística de Colombia
// Consume la API: https://api-colombia.com/api/v1/TouristicAttraction

const API_URL = "https://api-colombia.com/api/v1/TouristicAttraction";

// Seleccionamos los elementos del DOM que vamos a necesitar
const loadingDiv = document.getElementById("loading");
const errorDiv = document.getElementById("error");
const atraccionesDiv = document.getElementById("atracciones");
const contadorDiv = document.getElementById("contador");

// Función principal que carga los datos
async function cargarAtracciones() {
  try {
    // fetch() hace la petición a la API y espera la respuesta
    const respuesta = await fetch(API_URL);

    // Si la respuesta no es exitosa, lanzamos un error
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    // Convertimos la respuesta a JSON (formato de objeto JavaScript)
    const datos = await respuesta.json();

    // Tomamos solo los primeros 20 (requisito del extra de la opción 2)
    const primeros20 = datos.slice(0, 20);

    // Ocultamos el mensaje de carga
    loadingDiv.classList.add("hidden");

    // Mostramos el contador
    contadorDiv.classList.remove("hidden");
    contadorDiv.innerHTML = `<span> Mostrando <strong>${primeros20.length}</strong> de ${datos.length} atractivos turísticos</span>`;

    // Mostramos las tarjetas
    mostrarAtracciones(primeros20);

  } catch (error) {
    // Si algo sale mal, ocultamos el loading y mostramos el error
    console.error("Error al cargar las atracciones:", error);
    loadingDiv.classList.add("hidden");
    errorDiv.classList.remove("hidden");
  }
}

// Función que crea las tarjetas en el DOM
function mostrarAtracciones(atracciones) {
  // Vaciamos el contenedor por si ya tenía algo
  atraccionesDiv.innerHTML = "";

  // Recorremos cada atracción y creamos una tarjeta
  atracciones.forEach((atraccion) => {
    // Creamos el elemento div de la tarjeta
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("card");

    // Construimos el contenido HTML de la tarjeta
    // Usamos || para mostrar "No disponible" si el dato no existe
    tarjeta.innerHTML = `
      <div class="card-header">
        <h3 class="card-title">${atraccion.name || "Sin nombre"}</h3>
        <span class="card-badge">🏔️ Turismo</span>
      </div>
      <div class="card-body">
        <div class="card-meta">
          <span class="meta-item">
            🏙️ <strong>Ciudad:</strong> ${atraccion.city?.name || "No disponible"}
          </span>
          <span class="meta-item">
            🗺️ <strong>Departamento:</strong> ${atraccion.city?.department?.name || "No disponible"}
          </span>
          <span class="meta-item">
            🌎 <strong>Región:</strong> ${atraccion.city?.department?.regionStr || "No disponible"}
          </span>
        </div>
        <p class="card-desc">${atraccion.description || "Sin descripción disponible."}</p>
      </div>
    `;

    // Agregamos la tarjeta al contenedor del DOM
    atraccionesDiv.appendChild(tarjeta);
  });
}

// Llamamos a la función al cargar la página
cargarAtracciones();
