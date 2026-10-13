// =========================================
// ELEMENTOS QUE QUEREMOS ANIMAR
// =========================================
const elementos = document.querySelectorAll(".ruta, .concepto, .resumen");

// =========================================
// OBSERVADOR DE SCROLL
// =========================================
if (!("IntersectionObserver" in window)) {

    // Navegadores muy antiguos: mostrar todo sin animar
    elementos.forEach((elemento) => {
        elemento.classList.add("visible");
    });

} else {

    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add("visible");
                observador.unobserve(entrada.target);
            }
        });
    }, {
        threshold: 0.15
    });

    elementos.forEach((elemento) => {
        observador.observe(elemento);
    });
}
