// =========================================
// ELEMENTOS QUE QUEREMOS ANIMAR
// =========================================
const elementos = document.querySelectorAll(".ruta, .concepto, .resumen");

// =========================================
// OBSERVADOR DE SCROLL
// =========================================
const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
            entrada.target.classList.add("visible");
        }
    });
}, {
    threshold: 0.15
});

// =========================================
// ACTIVAR OBSERVADOR
// =========================================
elementos.forEach((elemento) => {
    observador.observe(elemento);
});