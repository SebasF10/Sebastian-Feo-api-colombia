// presidentes.js - Presidentes de Colombia
// Consume la API: https://api-colombia.com/api/v1/President
// Extra: ordenar por año de inicio de mandato

const API_URL = "https://api-colombia.com/api/v1/President";

// Seleccionamos los elementos del DOM
const loadingDiv      = document.getElementById("loading");
const errorDiv        = document.getElementById("error");
const presidentesDiv  = document.getElementById("presidentes");
const contadorDiv     = document.getElementById("contador");

// Imagen de respaldo si la foto no carga o no existe
const IMG_FALLBACK = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Escudo_de_Colombia.svg/200px-Escudo_de_Colombia.svg.png";

// Función principal que carga los datos
async function cargarPresidentes() {
  try {
    const respuesta = await fetch(API_URL);

    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const datos = await respuesta.json();

    // Extra: ordenamos por año de inicio (startPeriodDate o similarField)
    // La API devuelve campos: startPeriodDate, endPeriodDate como strings "YYYY-MM-DD"
    const ordenados = datos.slice().sort((a, b) => {
      const añoA = parseInt(a.startPeriodDate?.substring(0, 4) || "0");
      const añoB = parseInt(b.startPeriodDate?.substring(0, 4) || "0");
      return añoA - añoB;
    });

    // Ocultamos el mensaje de carga
    loadingDiv.classList.add("hidden");

    // Mostramos el contador
    contadorDiv.classList.remove("hidden");
    contadorDiv.innerHTML = `<span>Mostrando <strong>${ordenados.length}</strong> presidentes · ordenados por año de mandato</span>`;

    // Mostramos las tarjetas
    mostrarPresidentes(ordenados);

  } catch (error) {
    console.error("Error al cargar los presidentes:", error);
    loadingDiv.classList.add("hidden");
    errorDiv.classList.remove("hidden");
  }
}

// Función que formatea una fecha "YYYY-MM-DD" → "YYYY"
function extraerAnio(fechaStr) {
  if (!fechaStr) return "?";
  return fechaStr.substring(0, 4);
}

// Función que formatea "YYYY-MM-DD" → "DD/MM/YYYY"
function formatearFecha(fechaStr) {
  if (!fechaStr) return "No disponible";
  const [anio, mes, dia] = fechaStr.split("-");
  return `${dia}/${mes}/${anio}`;
}

// Función que crea las tarjetas en el DOM
function mostrarPresidentes(presidentes) {
  presidentesDiv.innerHTML = "";

  presidentes.forEach((presidente) => {
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("card", "card-presidente");

    // Calculamos el período
    const anioInicio = extraerAnio(presidente.startPeriodDate);
    const anioFin    = extraerAnio(presidente.endPeriodDate);
    const periodo    = (anioInicio !== "?" || anioFin !== "?")
      ? `${anioInicio} – ${anioFin}`
      : "Período no disponible";

    // Construimos la URL de la foto; si es nula o relativa, usamos fallback
    const fotoUrl = presidente.image && presidente.image.startsWith("http")
      ? presidente.image
      : IMG_FALLBACK;

    tarjeta.innerHTML = `
      <div class="card-header pres-header">
        <div class="pres-foto-wrap">
          <img
            class="pres-foto"
            src="${fotoUrl}"
            alt="Foto de ${presidente.name || 'presidente'}"
            onerror="this.src='${IMG_FALLBACK}'"
          />
        </div>
        <div class="pres-header-info">
          <h3 class="card-title">${presidente.name || "Sin nombre"}</h3>
          <span class="card-badge pres-badge">🏛️ ${periodo}</span>
        </div>
      </div>
      <div class="card-body">
        <div class="card-meta">
          <span class="meta-item">
            🗓️ <strong>Inicio:</strong> ${formatearFecha(presidente.startPeriodDate)}
          </span>
          <span class="meta-item">
            🗓️ <strong>Fin:</strong> ${formatearFecha(presidente.endPeriodDate)}
          </span>
          <span class="meta-item">
            🏷️ <strong>Partido:</strong> ${presidente.politicalParty || "No disponible"}
          </span>
        </div>
        ${presidente.description
          ? `<p class="card-desc">${presidente.description}</p>`
          : ""}
      </div>
    `;

    presidentesDiv.appendChild(tarjeta);
  });
}

// Llamamos a la función al cargar la página
cargarPresidentes();
