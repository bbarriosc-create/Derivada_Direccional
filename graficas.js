// =========================================
// OBSERVADOR PARA ANIMACIONES DE SCROLL
// =========================================
const elementos = document.querySelectorAll(".concepto");

const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
            entrada.target.classList.add("visible");
        }
    });
}, {
    threshold: 0.15 // Aparece cuando el 15% de la caja es visible
});

elementos.forEach((elemento) => {
    observador.observe(elemento);
});

// =========================================
// MÚSICA TENUE PARA ESTUDIAR
// =========================================
window.addEventListener("load", () => {
    const musica = document.getElementById("musica-fondo");
    if (musica) {
        musica.volume = 0.2; // 20% para que no abrume al leer
    }
});

// =========================================
// GENERADOR DE GRÁFICA 3D (EJERCICIO 1)
// =========================================
function dibujarGrafica3D() {
    // 1. Crear los ejes X y Y
    let valoresX = [];
    let valoresY = [];
    for (let i = -3; i <= 3; i += 0.2) {
        valoresX.push(i);
        valoresY.push(i);
    }

    // 2. Calcular la altura Z usando la ecuación: z = 4 - x^2 - y^2
    let valoresZ = [];
    for (let i = 0; i < valoresY.length; i++) {
        let filaZ = [];
        for (let j = 0; j < valoresX.length; j++) {
            let x = valoresX[j];
            let y = valoresY[i];
            let z = 4 - Math.pow(x, 2) - Math.pow(y, 2);
            filaZ.push(z);
        }
        valoresZ.push(filaZ);
    }

    // 3. Configurar el diseño 3D
    let datos = [{
        z: valoresZ,
        x: valoresX,
        y: valoresY,
        type: 'surface',
        colorscale: 'Blues', // Color elegante que combina con tu página
        showscale: false // Oculta la barra de colores para verse más limpio
    }];

    let diseno = {
        margin: { l: 0, r: 0, b: 0, t: 0 },
        paper_bgcolor: 'rgba(0,0,0,0)', // Fondo transparente
        scene: {
            camera: { eye: { x: 1.5, y: 1.5, z: 0.5 } } // Ángulo de vista inicial
        }
    };

    // 4. Dibujar la gráfica en el contenedor de HTML
    Plotly.newPlot('grafica-paraboloide', datos, diseno, {displayModeBar: false});
}

// Ejecutar el dibujo cuando la página cargue
window.addEventListener('load', dibujarGrafica3D);