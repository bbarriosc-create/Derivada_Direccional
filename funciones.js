const nodos = document.querySelectorAll(".nodo");
const mapa = document.querySelector(".mapa");
const introduccion = document.getElementById("introduccion");
const botonVolver = document.getElementById("volver-mapa");
const indicacion = document.querySelector(".indicacion");

// Páginas a las que lleva cada nodo.
// Descomenta cada línea cuando esa página exista.
const paginas = {
    conceptos: "conceptos.html"
    // ejercicios: "ejercicios.html",
    // graficas: "graficas.html",
    // videos: "videos.html"
};

nodos.forEach((nodo) => {
    nodo.addEventListener("click", () => {
        const seccion = nodo.getAttribute("data-seccion");

        // 1. INTRODUCCIÓN (Se abre en la misma página)
        if (seccion === "introduccion") {
            mapa.style.display = "none";
            introduccion.style.display = "block";
            if (indicacion) indicacion.style.display = "none";
            
            const musica = document.getElementById("musica-fondo");
            if (musica) musica.volume = 0.2; 

            window.scrollTo({ top: 0, behavior: "smooth" });
        }

        // 2. CONCEPTOS (Redirige al HTML de conceptos)
        if (seccion === "conceptos") {
            window.location.href = "conceptos.html";
        }

        // 3. GRÁFICAS (Redirige al nuevo HTML de gráficas)
        if (seccion === "graficas") {
            window.location.href = "graficas.html";
        }
    });
});

if (botonVolver) {
    botonVolver.addEventListener("click", () => {
        introduccion.style.display = "none";
        mapa.style.display = "block";
        document.body.classList.remove("en-introduccion");
        // Al volver al mapa la música regresa
        document.dispatchEvent(new CustomEvent("musica:reanudar"));
        if (indicacion) {
            indicacion.style.display = "flex";
        }
        dibujarConexiones();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}


// =========================================
// LÍNEAS DEL MAPA
// Van del borde del bloque central al borde de cada nodo,
// así nunca atraviesan el título.
// =========================================
function bordeRect(ancho, alto, dx, dy) {
    const t = Math.min(
        (ancho / 2) / (Math.abs(dx) || 1e-9),
        (alto / 2) / (Math.abs(dy) || 1e-9)
    );
    return { x: dx * t, y: dy * t };
}

function dibujarConexiones() {
    const centro = document.querySelector(".nodo-central");

    // En móvil las líneas están ocultas; con el mapa oculto no hay medidas
    if (!mapa || !centro || !mapa.offsetWidth || window.innerWidth <= 900) {
        return;
    }

    const cx = mapa.offsetWidth / 2;
    const cy = mapa.offsetHeight / 2;
    const hueco = 10; // separación para que la línea no toque los bordes

    ["introduccion", "conceptos", "graficas", "ejercicios", "videos"].forEach((nombre) => {
        const nodo = mapa.querySelector(".nodo-" + nombre);
        const linea = mapa.querySelector(".conexion-" + nombre);
        if (!nodo || !linea) return;

        const nx = nodo.offsetLeft + nodo.offsetWidth / 2;
        const ny = nodo.offsetTop + nodo.offsetHeight / 2;
        const dx = nx - cx;
        const dy = ny - cy;

        const a = bordeRect(centro.offsetWidth, centro.offsetHeight, dx, dy);
        const b = bordeRect(nodo.offsetWidth, nodo.offsetHeight, -dx, -dy);

        const x1 = cx + a.x;
        const y1 = cy + a.y;
        const x2 = nx + b.x;
        const y2 = ny + b.y;

        const largo = Math.hypot(x2 - x1, y2 - y1);
        const angulo = Math.atan2(y2 - y1, x2 - x1);

        linea.style.left = (x1 + Math.cos(angulo) * hueco) + "px";
        linea.style.top = (y1 + Math.sin(angulo) * hueco) + "px";
        linea.style.width = Math.max(0, largo - hueco * 2) + "px";
        linea.style.setProperty("--giro", angulo + "rad");
    });
}

document.addEventListener("DOMContentLoaded", dibujarConexiones);
window.addEventListener("load", dibujarConexiones);
window.addEventListener("resize", dibujarConexiones);

if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(dibujarConexiones);
}

window.addEventListener("load", () => {
    console.log("Cálculo II cargado correctamente.");
});
