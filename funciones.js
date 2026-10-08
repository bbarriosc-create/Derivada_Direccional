const nodos = document.querySelectorAll(".nodo");
const mapa = document.querySelector(".mapa");
const introduccion = document.getElementById("introduccion");
const botonVolver = document.getElementById("volver-mapa");
const indicacion = document.querySelector(".indicacion");

nodos.forEach((nodo) => {
    nodo.addEventListener("click", () => {
        const seccion = nodo.getAttribute("data-seccion");

        // INTRODUCCIÓN (Se abre en la misma página)
        if (seccion === "introduccion") {
            mapa.style.display = "none";
            introduccion.style.display = "block";
            if (indicacion) {
                indicacion.style.display = "none";
            }
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }

        // CONCEPTOS (Redirige al nuevo HTML)
        if (seccion === "conceptos") {
            window.location.href = "conceptos.html";
        }
    });
});

if (botonVolver) {
    botonVolver.addEventListener("click", () => {
        introduccion.style.display = "none";
        mapa.style.display = "block";
        if (indicacion) {
            indicacion.style.display = "flex";
        }
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

window.addEventListener("load", () => {
    console.log("Cálculo II cargado correctamente.");
});

// Forzar inicio de música al mínimo toque por si el navegador bloquea el autoplay
window.addEventListener("click", () => {
    document.getElementById("musica-fondo").play().catch(() => {});
}, { once: true });