// colombia.js - Colombia en Datos
// Consume la API: https://api-colombia.com/api/v1/Country/Colombia

const API_URL = "https://api-colombia.com/api/v1/Country/Colombia";

// Seleccionamos los elementos del DOM
const loadingDiv = document.getElementById("loading");
const errorDiv = document.getElementById("error");
const paisDiv = document.getElementById("pais-info");

// Función principal que carga los datos del país
async function cargarDatosPais() {
  try {
    // Hacemos la petición a la API con fetch
    const respuesta = await fetch(API_URL);

    // Verificamos que la respuesta fue exitosa
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    // Convertimos la respuesta a JSON
    const pais = await respuesta.json();

    // Ocultamos el mensaje de carga
    loadingDiv.classList.add("hidden");

    // Mostramos los datos del país
    mostrarDatosPais(pais);

  } catch (error) {
    // Manejo de errores: ocultamos el loading y mostramos el error
    console.error("Error al cargar datos del país:", error);
    loadingDiv.classList.add("hidden");
    errorDiv.classList.remove("hidden");
  }
}

// Función que construye el DOM con los datos del país
function mostrarDatosPais(pais) {
  // Mostramos el contenedor
  paisDiv.classList.remove("hidden");

  // Procesamos los idiomas (viene como array de strings o de objetos)
  const idiomas = Array.isArray(pais.languages)
    ? pais.languages
        .map(l => (typeof l === "string" ? l : l.name || l.nativeName || ""))
        .filter(Boolean)
        .join(", ")
    : "No disponible";

  // Procesamos las monedas
  const monedas = Array.isArray(pais.currencies)
    ? pais.currencies
        .map(m => {
          const name = m.name || m.currency || "";
          const symbol = m.symbol || m.code || "";
          return `${name}${symbol ? ` (${symbol})` : ""}`.trim();
        })
        .filter(Boolean)
        .join(", ")
    : pais.currency
    ? `${pais.currency}${pais.currencySymbol ? ` (${pais.currencySymbol})` : pais.currencyCode ? ` (${pais.currencyCode})` : ""}`
    : "No disponible";

  // Procesamos las zonas horarias
  const zonas = Array.isArray(pais.timeZones)
    ? pais.timeZones.join(", ")
    : pais.timeZone || "No disponible";

  // Procesamos los países fronterizos
  const fronteras = Array.isArray(pais.borders)
    ? pais.borders.join(", ")
    : "No disponible";

  // Formateamos números grandes con separador de miles
  const poblacionFormateada = pais.population
    ? pais.population.toLocaleString("es-CO")
    : "No disponible";

  const superficieFormateada = pais.surface
    ? pais.surface.toLocaleString("es-CO") + " km²"
    : "No disponible";

  const bandera = Array.isArray(pais.flags)
    ? pais.flags[1] || pais.flags[0]
    : pais.flagDescription || "https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Colombia.svg";

  const capital = pais.capital || pais.stateCapital || "Bogotá";
  const region = pais.region || "Américas";
  const subregion = pais.subRegion || pais.subregion || "América del Sur";
  const telefono = pais.phoneCode ? `+${pais.phoneCode}` : pais.phonePrefix || "+57";

  // Construimos el HTML completo con todos los datos
  paisDiv.innerHTML = `
    <!-- Sección principal con bandera y nombre -->
    <div class="pais-hero">
      <img 
        src="${bandera}" 
        alt="Bandera de Colombia" 
        class="bandera"
        onerror="this.src='https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Colombia.svg'"
      >
      <div class="pais-hero-info">
        <h2>${pais.name || "Colombia"}</h2>
        <p class="pais-nombre-oficial">${pais.officialName || "República de Colombia"}</p>
        <div class="tags">
          <span class="tag">🌎 América del Sur</span>
        </div>
      </div>
    </div>

    <!-- Grid de datos estadísticos -->
    <div class="datos-grid">
      <div class="dato-card">
        <span class="dato-icon">🏛️</span>
        <span class="dato-label">Capital</span>
        <span class="dato-valor">${capital}</span>
      </div>
      <div class="dato-card">
        <span class="dato-icon">👥</span>
        <span class="dato-label">Población</span>
        <span class="dato-valor">${poblacionFormateada}</span>
      </div>
      <div class="dato-card">
        <span class="dato-icon">📐</span>
        <span class="dato-label">Superficie</span>
        <span class="dato-valor">${superficieFormateada}</span>
      </div>
      <div class="dato-card">
        <span class="dato-icon">💰</span>
        <span class="dato-label">Moneda</span>
        <span class="dato-valor">${monedas}</span>
      </div>
      <div class="dato-card">
        <span class="dato-icon">🌐</span>
        <span class="dato-label">Dominio Internet</span>
        <span class="dato-valor">${pais.internetDomain || ".co"}</span>
      </div>
      <div class="dato-card">
        <span class="dato-icon">📞</span>
        <span class="dato-label">Código telefónico</span>
        <span class="dato-valor">${telefono}</span>
      </div>
      <div class="dato-card">
        <span class="dato-icon">🕐</span>
        <span class="dato-label">Zona Horaria</span>
        <span class="dato-valor">${zonas}</span>
      </div>
      <div class="dato-card">
        <span class="dato-icon">🗺️</span>
        <span class="dato-label">Países fronterizos</span>
        <span class="dato-valor">${fronteras}</span>
      </div>
      <div class="dato-card">
        <span class="dato-icon">🌊</span>
        <span class="dato-label">Región</span>
        <span class="dato-valor">${region}</span>
      </div>
      <div class="dato-card">
        <span class="dato-icon">🏙️</span>
        <span class="dato-label">Subregión</span>
        <span class="dato-valor">${subregion}</span>
      </div>
    </div>

    <!-- Sección de descripción -->
    ${pais.description ? `
    <div class="descripcion-section">
      <h3>📖 Descripción</h3>
      <p>${pais.description}</p>
    </div>
    ` : ""}

    <!-- Himno si está disponible -->
    ${pais.nationalAnthemName ? `
    <div class="himno-section">
      <h3>🎵 Himno Nacional</h3>
      <p><strong>${pais.nationalAnthemName}</strong></p>
    </div>
    ` : ""}
  `;
}

// Llamamos a la función al cargar la página
cargarDatosPais();
