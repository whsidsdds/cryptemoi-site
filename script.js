/**
 * CrypteMoi - Système d'Interface Apple-Style
 * Script principal gérant les animations fluides et interactions
 * @version 2.0.0
 * @author CrypteMoi Team
 */

(function() {
    'use strict';

    // ===== CONFIGURATION =====
    const CONFIG = {
        observer: {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        },
        scroll: {
            navbarThreshold: 50
        }
    };

    // ===== SÉLECTION DES ÉLÉMENTS DOM =====
    let navbar, revealElements, problemCards, navbar, sections;

    /**
     * Initialisation des références DOM
     */
    const initDOMReferences = () => {
        navbar = document.getElementById('navbar');
        revealElements = document.querySelectorAll('.reveal');
        problemCards = document.querySelectorAll('.problem-card');
        sections = document.querySelectorAll('section');
    };

    // ===== SCROLL REVEAL ANIMATIONS =====
    /**
     * Animation de révélation au scroll avec Intersection Observer
     */
    const initScrollReveal = () => {
        const observerOptions = {
            threshold: CONFIG.observer.threshold,
            rootMargin: CONFIG.observer.rootMargin
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    entry.target.classList.add('visible');
                    
                    // Désactiver l'observer pour cet élément (animation une seule fois)
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observer tous les éléments avec classe 'reveal' et 'problem-card'
        revealElements.forEach(el => observer.observe(el));
        problemCards.forEach(el => observer.observe(el));
    };

    // ===== NAVBAR SCROLL EFFECT =====
    /**
     * Effet de transparence et ombre sur la navbar au scroll
     */
    const initNavbarScroll = () => {
        if (!navbar) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > CONFIG.scroll.navbarThreshold) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    };

    // ===== SMOOTH SCROLL =====
    /**
     * Défilement fluide pour tous les liens d'ancrage
     */
    const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Offset pour la navbar fixe
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    };

    // ===== PARALLAX SUBTIL SUR HERO =====
    /**
     * Effet parallaxe léger sur la section hero
     */
    const initParallax = () => {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.scrollY;
                    const parallaxSpeed = 0.5;
                    
                    if (scrolled < window.innerHeight) {
                        hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
                        hero.style.opacity = 1 - (scrolled / window.innerHeight);
                    }
                    
                    ticking = false;
                });
                
                ticking = true;
            }
        });
    };

    // ===== ANIMATION DES CARTES PROBLÈME =====
    /**
     * Animation échelonnée des cartes de problème
     */
    const initProblemCardsAnimation = () => {
        problemCards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.1}s`;
        });
    };

    // ===== BOUTONS STORE INTERACTION =====
    /**
     * Effets d'interaction sur les boutons de téléchargement
     */
    const initStoreButtons = () => {
        const storeButtons = document.querySelectorAll('.store-btn');
        
        storeButtons.forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px) scale(1.02)';
            });
            
            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });

            // Effet de clic
            btn.addEventListener('mousedown', function() {
                this.style.transform = 'translateY(-3px) scale(0.98)';
            });

            btn.addEventListener('mouseup', function() {
                this.style.transform = 'translateY(-5px) scale(1.02)';
            });
        });
    };

    // ===== DÉTECTION MOBILE =====
    /**
     * Détecte si l'utilisateur est sur mobile et ajuste les animations
     */
    const initMobileDetection = () => {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            document.body.classList.add('mobile');
            
            // Désactiver le parallaxe sur mobile pour de meilleures performances
            CONFIG.observer.threshold = 0.1;
        }
    };

    // ===== SECTION ACTIVE TRACKING =====
    /**
     * Suivi de la section active pour mettre à jour la navigation
     */
    const initSectionTracking = () => {
        if (!sections || sections.length === 0) return;

        const navLinks = document.querySelectorAll('.nav-links a');
        
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-100px 0px -66% 0px'
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    
                    // Mettre à jour les liens actifs
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            if (section.id) {
                sectionObserver.observe(section);
            }
        });
    };

    // ===== ANIMATION COMPTEUR =====
    /**
     * Animation de compteur pour les statistiques (si besoin futur)
     */
    const animateCounter = (element, target, duration = 2000) => {
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            element.textContent = Math.floor(start).toLocaleString();
            
            if (start >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            }
        }, 16);
    };

    // ===== PERFORMANCE OPTIMIZATION =====
    /**
     * Optimisation des performances avec debounce
     */
    const debounce = (func, wait = 10) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // ===== EASTER EGG =====
    /**
     * Konami code easter egg
     */
    const initEasterEgg = () => {
        const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        let konamiIndex = 0;

        document.addEventListener('keydown', (e) => {
            if (e.key === konamiCode[konamiIndex]) {
                konamiIndex++;
                
                if (konamiIndex === konamiCode.length) {
                    console.log('🔐 CrypteMoi Secret Mode Activated! 🎉');
                    document.body.style.filter = 'hue-rotate(180deg)';
                    
                    setTimeout(() => {
                        document.body.style.filter = '';
                        konamiIndex = 0;
                    }, 5000);
                }
            } else {
                konamiIndex = 0;
            }
        });
    };

    // ===== LOADING ANIMATION =====
    /**
     * Animation de chargement initial
     */
    const initLoadingAnimation = () => {
        document.body.classList.add('loaded');
        
        // Fade in progressif du contenu
        setTimeout(() => {
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.opacity = '1';
                hero.style.transform = 'translateY(0)';
            }
        }, 100);
    };

    // ===== ACCESSIBILITÉ =====
    /**
     * Amélioration de l'accessibilité
     */
    const initAccessibility = () => {
        // Détection de la préférence pour les animations réduites
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            document.body.classList.add('reduced-motion');
        }

        // Focus visible pour la navigation au clavier
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-nav');
        });
    };

    // ===== INITIALISATION PRINCIPALE =====
    /**
     * Point d'entrée - Lance tous les systèmes
     */
    const init = () => {
        // Initialisation des références DOM
        initDOMReferences();

        // Détection mobile
        initMobileDetection();

        // Animations et interactions
        initScrollReveal();
        initNavbarScroll();
        initSmoothScroll();
        initParallax();
        initProblemCardsAnimation();
        initStoreButtons();
        initSectionTracking();
        
        // Accessibilité
        initAccessibility();

        // Easter egg
        initEasterEgg();

        // Animation de chargement
        initLoadingAnimation();

        // Log de confirmation
        console.log('%c🔐 CrypteMoi', 'font-size: 20px; font-weight: bold;');
        console.log('%cInterface System v2.0 - Initialisé avec succès', 'color: #86868b;');
        console.log('%cVotre vie privée, notre priorité.', 'font-style: italic; color: #1d1d1f;');
    };

    // ===== LANCEMENT =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export pour debug (développement uniquement)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.CrypteMoi = {
            version: '2.0.0',
            config: CONFIG,
            debug: true
        };
    }

})();
