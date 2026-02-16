/**
 * CrypteMoi - Système Logiciel de l'Interface
 * Script principal gérant l'interactivité avancée, le curseur matériel et la navigation.
 * @version 1.0.0
 * @author CrypteMoi Team
 */

(function() {
    'use strict';

    // ===== CONFIGURATION & CONSTANTES =====
    const CONFIG = {
        particles: {
            count: 50,
            minDuration: 5,
            maxDuration: 15
        },
        parallax: {
            intensity: 40,
            glowMultiplier: 5
        },
        observer: {
            threshold: 0.4
        },
        lever: {
            trackHeight: 250
        }
    };

    // ===== SÉLECTION DES ÉLÉMENTS DOM =====
    let cursor, handle, sections, cards, glow, particlesContainer;

    /**
     * Initialisation des références DOM
     */
    const initDOMReferences = () => {
        cursor = document.getElementById('custom-cursor');
        handle = document.getElementById('leverHandle');
        sections = document.querySelectorAll('section');
        cards = document.querySelectorAll('.float-card');
        glow = document.querySelector('.glow');
        particlesContainer = document.getElementById('particles');
    };

    // ===== SYSTÈME DE PARTICULES =====
    /**
     * Génération de particules animées dans le fond
     */
    const createParticles = () => {
        if (!particlesContainer) return;

        const fragment = document.createDocumentFragment();
        
        for (let i = 0; i < CONFIG.particles.count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Position aléatoire
            particle.style.left = `${Math.random() * 100}%`;
            
            // Durée d'animation aléatoire
            const duration = Math.random() * 
                (CONFIG.particles.maxDuration - CONFIG.particles.minDuration) + 
                CONFIG.particles.minDuration;
            particle.style.animationDuration = `${duration}s`;
            
            // Délai aléatoire pour un effet échelonné
            particle.style.animationDelay = `${Math.random() * 5}s`;
            
            fragment.appendChild(particle);
        }
        
        particlesContainer.appendChild(fragment);
    };

    // ===== CURSEUR PERSONNALISÉ =====
    /**
     * Initialisation du curseur matériel personnalisé
     * Injection du logo CrypteMoi (C + Personne + Cadenas)
     */
    const initCursor = () => {
        if (!cursor) return;
        
        cursor.innerHTML = `
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <!-- Cercle extérieur (Lettre C stylisée) -->
                <path d="M78 30C72 20 62 15 50 15C30.7 15 15 30.7 15 50C15 69.3 30.7 85 50 85C62 85 72 80 78 70" 
                      stroke="white" stroke-width="7" stroke-linecap="round" fill="none"/>
                <!-- Icône utilisateur centrale -->
                <circle cx="50" cy="42" r="10" fill="white"/>
                <path d="M35 65C35 58 40 53 50 53C60 53 65 58 65 65" fill="white"/>
                <!-- Symbole Cadenas (Base) -->
                <rect x="42" y="68" width="16" height="12" rx="2" fill="white"/>
                <!-- Anse du cadenas -->
                <path d="M45 68V65C45 62.2 47.2 60 50 60C52.8 60 55 62.2 55 65V68" 
                      stroke="white" stroke-width="2.5" fill="none"/>
            </svg>
        `;
    };

    /**
     * Gestion du mouvement du curseur avec effet de parallaxe
     */
    const initCursorMovement = () => {
        let mouseX = 0, mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Mise à jour de la position du curseur
            if (cursor) {
                cursor.style.left = `${mouseX}px`;
                cursor.style.top = `${mouseY}px`;
            }

            // Calcul des angles pour l'effet de profondeur (Parallaxe)
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            const rotateY = (mouseX - centerX) / CONFIG.parallax.intensity;
            const rotateX = (centerY - mouseY) / CONFIG.parallax.intensity;

            // Application de la rotation aux cartes flottantes
            if (cards) {
                cards.forEach(card => {
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                });
            }

            // Déplacement de la lueur d'arrière-plan
            if (glow) {
                const glowX = rotateY * CONFIG.parallax.glowMultiplier;
                const glowY = -rotateX * CONFIG.parallax.glowMultiplier;
                glow.style.transform = `translate(calc(-50% + ${glowX}px), calc(-50% + ${glowY}px))`;
            }
        });
    };

    /**
     * Interactions tactiles sur le curseur
     */
    const initCursorInteractions = () => {
        if (!cursor) return;

        document.addEventListener('mousedown', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(0.85)';
        });

        document.addEventListener('mouseup', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    };

    // ===== EFFETS SUR LES CARTES =====
    /**
     * Gestion des effets de survol sur les cartes
     */
    const initCardEffects = () => {
        if (!cards) return;

        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.zIndex = '10';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.zIndex = '1';
            });
        });
    };

    // ===== SYSTÈME DE NAVIGATION =====
    /**
     * Observation des sections avec Intersection Observer
     * Détecte quelle section est visible pour déplacer le levier
     */
    const initSectionObserver = () => {
        if (!sections || sections.length === 0) return;

        const observerOptions = {
            root: null,
            threshold: CONFIG.observer.threshold
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animation de révélation
                    entry.target.classList.add('visible');

                    // Mise à jour de la position du levier
                    updateLeverPosition(entry.target);
                }
            });
        }, observerOptions);

        sections.forEach(section => sectionObserver.observe(section));
    };

    /**
     * Mise à jour de la position du levier en fonction de la section active
     * @param {HTMLElement} activeSection - Section actuellement visible
     */
    const updateLeverPosition = (activeSection) => {
        if (!handle || !sections) return;

        const index = Array.from(sections).indexOf(activeSection);
        const position = (index / (sections.length - 1)) * CONFIG.lever.trackHeight;
        
        handle.style.top = `${position}px`;
    };

    /**
     * Navigation au clic sur le levier
     */
    const initLeverNavigation = () => {
        if (!handle || !sections) return;

        handle.addEventListener('click', () => {
            const currentTop = parseFloat(handle.style.top) || 0;
            const currentIndex = Math.round((currentTop / CONFIG.lever.trackHeight) * (sections.length - 1));
            const nextIndex = (currentIndex + 1) % sections.length;
            
            sections[nextIndex].scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
            });
        });
    };

    /**
     * Smooth scroll pour les liens d'ancrage
     */
    const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    target.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }
            });
        });
    };

    // ===== ANIMATION DE CHARGEMENT =====
    /**
     * Révèle la première section après le chargement
     */
    const initLoadingAnimation = () => {
        setTimeout(() => {
            if (sections && sections.length > 0) {
                sections[0].classList.add('visible');
            }
        }, 300);
    };

    // ===== INITIALISATION PRINCIPALE =====
    /**
     * Point d'entrée principal - Lance tous les systèmes
     */
    const init = () => {
        // Initialisation des références DOM
        initDOMReferences();

        // Création des particules
        createParticles();

        // Initialisation du curseur
        initCursor();
        initCursorMovement();
        initCursorInteractions();

        // Effets sur les cartes
        initCardEffects();

        // Système de navigation
        initSectionObserver();
        initLeverNavigation();
        initSmoothScroll();

        // Animation de chargement
        initLoadingAnimation();

        console.log('🔐 CrypteMoi Interface System - Initialisé avec succès');
    };

    // Lancement au chargement du DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
