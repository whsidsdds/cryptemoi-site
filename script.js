/**
 * CrypteMoi - Logiciel de gestion d'interface
 * Gère le curseur personnalisé, le suivi du défilement et les effets de parallaxe.
 */

document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.getElementById('custom-cursor');
    const handle = document.getElementById('leverHandle');
    const sections = document.querySelectorAll('section');
    const cards = document.querySelectorAll('.float-card');
    const glow = document.querySelector('.glow');

    /**
     * Gestion du curseur personnalisé
     * Suit les mouvements de la souris avec une légère transition fluide définie en CSS.
     */
    document.addEventListener('mousemove', (e) => {
        if (cursor) {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        }

        /**
         * Effets de parallaxe 3D
         * Calcule l'inclinaison basée sur la position de la souris par rapport au centre.
         */
        const xRotation = (window.innerHeight / 2 - e.clientY) / 30;
        const yRotation = (e.clientX - window.innerWidth / 2) / 30;

        cards.forEach(card => {
            card.style.transform = `rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
        });

        // Déplacement léger de la lueur d'ambiance
        if (glow) {
            glow.style.transform = `translate(${yRotation * 2}px, ${xRotation * 2}px)`;
        }
    });

    /**
     * Animations au clic (Feedback visuel)
     */
    document.addEventListener('mousedown', () => {
        if (cursor) cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
    });

    document.addEventListener('mouseup', () => {
        if (cursor) cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    /**
     * Observateur d'intersection pour les sections
     * Active les animations de texte et déplace le levier de navigation.
     */
    const observerOptions = {
        threshold: 0.5 // Déclenche quand 50% de la section est visible
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Ajoute la classe visible pour déclencher les animations de texte CSS
                entry.target.classList.add('visible');

                // Calcule la position du levier (Handle) sur la barre latérale
                const sectionIndex = Array.from(sections).indexOf(entry.target);
                if (handle) {
                    const totalSteps = sections.length - 1;
                    const position = (sectionIndex / totalSteps) * 250; // 250px est la hauteur de la track
                    handle.style.top = `${position}px`;
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
});