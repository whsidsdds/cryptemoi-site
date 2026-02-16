/**
 * script.js - Logique d'interaction pour CrypteMoi
 * Gère les animations, les effets 3D et le défilement fluide.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialisation des icônes Lucide
    // Cette fonction remplace les balises <i data-lucide="..."> par des SVG
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Gestion de la barre de navigation au défilement
    const nav = document.getElementById('mainNav');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);

    // 3. Effet d'inclinaison 3D sur le téléphone (Hero Section)
    const phone = document.getElementById('heroPhone');
    
    if (phone) {
        document.addEventListener('mousemove', (e) => {
            // Calcul de la position de la souris par rapport au centre de l'écran
            // On divise par 30 pour limiter l'amplitude du mouvement
            const x = (window.innerWidth / 2 - e.pageX) / 30;
            const y = (window.innerHeight / 2 - e.pageY) / 30;
            
            // Applique la rotation 3D
            // On garde une rotation de base de 5deg sur l'axe X pour le look "penché"
            phone.style.transform = `rotateX(${5 + y}deg) rotateY(${-x}deg)`;
        });

        // Réinitialisation douce quand la souris quitte la fenêtre
        document.addEventListener('mouseleave', () => {
            phone.style.transform = `rotateX(5deg) rotateY(0deg)`;
        });
    }

    // 4. Système de "Reveal" (Apparition au défilement)
    // Utilise l'API IntersectionObserver pour détecter quand les éléments sont visibles
    const revealOptions = {
        threshold: 0.1, // L'élément doit être visible à 10%
        rootMargin: "0px 0px -50px 0px" // Déclenche un peu avant l'arrivée en bas de l'écran
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optionnel : on arrête d'observer une fois l'animation jouée
                // revealObserver.unobserve(entry.target);
            }
        });
    }, revealOptions);

    // On applique l'observateur à tous les éléments ayant la classe .reveal
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => revealObserver.observe(el));

    // 5. Gestion des ancres de navigation fluides (Smooth Scroll)
    const navLinks = document.querySelectorAll('.nav-menu a, .nav-cta');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // On ne gère que les liens internes commençant par #
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 70, // -70 pour compenser la hauteur de la nav
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});
