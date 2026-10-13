(function () {
    const musica = document.getElementById('musica-fondo');
    if (!musica) return;

    // Cada página define su volumen con data-volumen
    const volumenObjetivo = parseFloat(musica.dataset.volumen) || 0.5;
    const eventos = ['click', 'pointerdown', 'keydown', 'touchend'];

    const leer = (tipo, clave) => {
        try { return window[tipo].getItem(clave); } catch (e) { return null; }
    };
    const guardar = (tipo, clave, valor) => {
        try { window[tipo].setItem(clave, valor); } catch (e) {}
    };

    let silenciada = leer('localStorage', 'musicaSilenciada') === '1';
    let enPausa = false; // true mientras la página pide silencio (ej. la Introducción)

    // ---------- Volumen con fade suave ----------
    let temporizador;
    function fade(destino, ms = 1500, alTerminar) {
        clearInterval(temporizador);
        const inicio = musica.volume;
        const pasos = Math.max(1, Math.round(ms / 50));
        let n = 0;
        temporizador = setInterval(() => {
            n++;
            const v = inicio + (destino - inicio) * (n / pasos);
            musica.volume = Math.min(1, Math.max(0, v));
            if (n >= pasos) {
                clearInterval(temporizador);
                if (alTerminar) alTerminar();
            }
        }, 50);
    }

    // ---------- Pausar / reanudar desde la página ----------
    // La página dispara document.dispatchEvent(new CustomEvent('musica:pausar'))
    // y 'musica:reanudar'
    document.addEventListener('musica:pausar', () => {
        enPausa = true;
        fade(0, 700, () => { if (enPausa) musica.pause(); });
    });

    document.addEventListener('musica:reanudar', () => {
        enPausa = false;
        if (silenciada) return;
        musica.play()
            .then(() => fade(volumenObjetivo, 1200))
            .catch(() => {});
    });

    // Arranca con el volumen de la página anterior y baja/sube al suyo
    const volumenPrevio = parseFloat(leer('sessionStorage', 'musicaVolumen'));
    musica.volume = isNaN(volumenPrevio) ? volumenObjetivo : volumenPrevio;
    musica.addEventListener('playing', () => fade(volumenObjetivo), { once: true });

    // ---------- Retomar donde se quedó ----------
    function restaurarTiempo() {
        const t = parseFloat(leer('sessionStorage', 'musicaTiempo'));
        if (!isNaN(t) && t < musica.duration) musica.currentTime = t;
    }
    if (musica.readyState >= 1) restaurarTiempo();
    else musica.addEventListener('loadedmetadata', restaurarTiempo, { once: true });

    window.addEventListener('pagehide', () => {
        guardar('sessionStorage', 'musicaTiempo', musica.currentTime);
        guardar('sessionStorage', 'musicaVolumen', musica.volume);
    });

    // ---------- Reproducir: inmediato o con la primera interacción ----------
    function quitarListeners() {
        eventos.forEach(ev => window.removeEventListener(ev, intentar));
    }

    function intentar() {
        if (silenciada || enPausa) return;
        musica.play().then(quitarListeners).catch(() => {});
    }

    intentar();
    eventos.forEach(ev => window.addEventListener(ev, intentar));

    // ---------- Botón de silencio ----------
    const estilos = document.createElement('style');
    estilos.textContent = `
        .boton-musica {
            position: fixed; left: 20px; bottom: 20px; z-index: 1000;
            width: 44px; height: 44px; border-radius: 50%;
            border: 1px solid rgba(41, 76, 96, 0.35);
            background: rgba(250, 249, 245, 0.9);
            color: #294c60; font-size: 18px; cursor: pointer;
            box-shadow: 0 6px 18px rgba(30, 40, 45, 0.15);
            transition: transform 0.2s ease, background 0.2s ease;
        }
        .boton-musica:hover { transform: scale(1.08); background: #fff; }
    `;
    document.head.appendChild(estilos);

    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'boton-musica';

    function actualizarBoton() {
        boton.textContent = silenciada ? '🔇' : '🔊';
        const texto = silenciada ? 'Activar música' : 'Silenciar música';
        boton.title = texto;
        boton.setAttribute('aria-label', texto);
    }
    actualizarBoton();

    boton.addEventListener('pointerdown', e => e.stopPropagation());
    boton.addEventListener('click', e => {
        e.stopPropagation();
        silenciada = !silenciada;
        guardar('localStorage', 'musicaSilenciada', silenciada ? '1' : '0');
        actualizarBoton();
        if (silenciada) musica.pause();
        else if (!enPausa) musica.play().then(quitarListeners).catch(() => {});
    });

    document.body.appendChild(boton);
})();
