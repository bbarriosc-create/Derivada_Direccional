
/* =========================================
   EJERCICIOS - DERIVADA DIRECCIONAL
   Funcionalidad de las soluciones
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const solutionButtons = document.querySelectorAll(".solution-button");

    solutionButtons.forEach((button) => {

        button.addEventListener("click", async () => {

            const solutionId = button.dataset.solution;
            const solutionPanel = document.getElementById(solutionId);

            // Verificar que la solución exista.
            if (!solutionPanel) {
                console.error(
                    `No se encontró el panel de solución: ${solutionId}`
                );
                return;
            }

            const isExpanded =
                button.getAttribute("aria-expanded") === "true";

            // Actualizar el estado del botón.
            button.setAttribute("aria-expanded", String(!isExpanded));

            const buttonText = button.querySelector("span:first-child");

            if (isExpanded) {

                // Ocultar la solución.
                solutionPanel.hidden = true;

                buttonText.textContent = "Ver solución paso a paso";

            } else {

                // Mostrar la solución.
                solutionPanel.hidden = false;

                buttonText.textContent = "Ocultar solución";

                // Asegurar que las fórmulas se procesen con MathJax.
                if (
                    window.MathJax &&
                    typeof window.MathJax.typesetPromise === "function"
                ) {
                    try {
                        await window.MathJax.typesetPromise([
                            solutionPanel
                        ]);
                    } catch (error) {
                        console.error(
                            "No se pudieron procesar algunas fórmulas:",
                            error
                        );
                    }
                }
            }

        });

    });

});
