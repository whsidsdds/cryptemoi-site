/**
 * script.js - Logique d'interaction CrypteMoi (Édition Souveraine)
 * Gère le séquençage du chat P2P, l'immersion 3D et la protection des données.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Initialisation des icônes Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Navigation : Effet de verre au défilement
    const nav = document.getElementById('mainNav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            nav.style.background = "rgba(0, 0, 0, 0.9)";
            nav.style.borderBottom = "1px solid rgba(255, 255, 255, 0.1)";
        } else {
            nav.style.background = "rgba(0, 0, 0, 0.8)";
            nav.style.borderBottom = "1px solid rgba(255, 255, 255, 0.05)";
        }
    });

    // 3. Simulation du Chat P2P (Séquençage temporel)
    const chatBubbles = document.querySelectorAll('.chat-bubble');
    const animateChat = () => {
        chatBubbles.forEach((bubble, index) => {
            setTimeout(() => {
                bubble.style.opacity = "1";
                bubble.style.transform = "translateY(0)";
                // Petit effet de vibration bleue lors de la réception
                if (bubble.classList.contains('received')) {
                    bubble.style.borderLeft = "2px solid #0071e3";
                }
            }, 1000 * (index + 1));
        });
    };

    // Lancer l'animation du chat dès que le téléphone est visible
    const chatObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            animateChat();
            chatObserver.unobserve(entries[0].target);
        }
    }, { threshold: 0.5 });

    const phone = document.getElementById('phoneWrapper');
    if (phone) chatObserver.observe(phone);

    // 4. Effet 3D Immersif (Gyroscope de souris)
    if (phone) {
        document.addEventListener('mousemove', (e) => {
            // Amplitude réduite pour un aspect plus "Luxe/Pro"
            const x = (window.innerWidth / 2 - e.pageX) / 45;
            const y = (window.innerHeight / 2 - e.pageY) / 45;
            
            phone.style.transition = "transform 0.1s ease-out";
            phone.style.transform = `rotateX(${y}deg) rotateY(${-x}deg)`;
        });

        document.addEventListener('mouseleave', () => {
            phone.style.transition = "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)";
            phone.style.transform = `rotateX(0deg) rotateY(0deg)`;
        });
    }

    // 5. Gestion des accès Stores (Alerte France 2026)
    window.alertFrance = () => {
        const msg = "CrypteMoi : Souveraineté confirmée.\n\nL'application est en cours de déploiement final pour le territoire français.\nDisponibilité prévue : Premier trimestre 2026.";
        alert(msg);
    };

    // 6. Reveal System (Apparition fluide des sections)
    const revealElements = document.querySelectorAll('.card, .manifesto-box, .hero h1');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -20px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                entry.target.style.transition = "all 0.8s cubic-bezier(0.25, 1, 0.5, 1)";
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        revealObserver.observe(el);
    });

    // 7. Smooth Scroll pour les ancres
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 60,
                    behavior: 'smooth'
                });
            }
        });
    });
});
