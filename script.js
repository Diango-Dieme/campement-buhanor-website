document.addEventListener('DOMContentLoaded', function() {
    // ===== MENU HAMBURGER =====
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (hamburgerMenu && navLinks) {
        const toggleMenu = () => {
            navLinks.classList.toggle('active');
            hamburgerMenu.classList.toggle('open');
            hamburgerMenu.setAttribute('aria-expanded', navLinks.classList.contains('active'));
        };

        hamburgerMenu.addEventListener('click', toggleMenu);

        document.addEventListener('click', (event) => {
            if (!navLinks.contains(event.target) && !hamburgerMenu.contains(event.target) && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburgerMenu.classList.remove('open');
                hamburgerMenu.setAttribute('aria-expanded', 'false');
            }
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburgerMenu.classList.remove('open');
                hamburgerMenu.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ===== GESTION DE LA VIDÉO RESPONSIVE =====
    const videoElement = document.getElementById('responsiveVideo');
    const posterImage = document.querySelector('.video-poster');
    
    if (videoElement) {
        let currentVideoSrc = ''; // Variable pour suivre la source actuelle

        videoElement.addEventListener('canplay', () => {
            if (posterImage) {
                posterImage.classList.add('hidden');
            }
        });

        videoElement.addEventListener('play', () => {
            if (posterImage) {
                posterImage.classList.add('hidden');
            }
        });

        function setVideoSource() {
            const mobileVideoSrc = 'sunset-plage-cap-skirring.mp4';
            const desktopVideoSrc = 'AA.mp4';
            const newSrc = window.innerWidth <= 968 ? mobileVideoSrc : desktopVideoSrc;
            
            if (newSrc !== currentVideoSrc) {
                videoElement.src = newSrc;
                videoElement.load();
                currentVideoSrc = newSrc;
                if (posterImage) {
                    posterImage.classList.remove('hidden');
                }
            }
        }

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(setVideoSource, 250);
        });

        setVideoSource(); // Appel initial
    }

    // ===== LIGHTBOX =====
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const lightbox = document.getElementById('lightbox');
    
    if (galleryItems.length > 0 && lightbox) { // Correction ici
        const lightboxImg = document.getElementById('lightbox-img');
        const closeBtn = document.querySelector('.close-btn');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');

        if (lightboxImg && closeBtn && prevBtn && nextBtn) {
            let currentImageIndex = 0;
            const images = Array.from(galleryItems).map(img => img.dataset.src || img.src);

            const openLightbox = (index) => {
                currentImageIndex = index;
                lightboxImg.src = images[currentImageIndex];
                lightbox.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                
                new Image().src = images[(currentImageIndex - 1 + images.length) % images.length];
                new Image().src = images[(currentImageIndex + 1) % images.length];

                lightboxImg.onerror = () => {
                    closeLightbox();
                    alert("L'image n'a pas pu être chargée. Veuillez réessayer.");
                };
            };

            const closeLightbox = () => {
                lightbox.style.display = 'none';
                document.body.style.overflow = '';
            };

            const navigateLightbox = (direction) => {
                currentImageIndex = (currentImageIndex + direction + images.length) % images.length;
                lightboxImg.src = images[currentImageIndex];
            };

            galleryItems.forEach((item, index) => {
                item.addEventListener('click', () => openLightbox(index));
            });

            closeBtn.addEventListener('click', closeLightbox);
            prevBtn.addEventListener('click', () => navigateLightbox(-1));
            nextBtn.addEventListener('click', () => navigateLightbox(1));

            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) closeLightbox();
            });

            document.addEventListener('keydown', (e) => {
                if (lightbox.style.display === 'flex') {
                    if (e.key === 'ArrowLeft') navigateLightbox(-1);
                    else if (e.key === 'ArrowRight') navigateLightbox(1);
                    else if (e.key === 'Escape') closeLightbox();
                }
            });

            let touchStartX = 0;
            let touchEndX = 0;
            const minSwipeDistance = 50;

            lightbox.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            });

            lightbox.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                const swipeDistance = touchEndX - touchStartX;

                if (Math.abs(swipeDistance) >= minSwipeDistance) {
                    if (swipeDistance > 0) {
                        navigateLightbox(-1);
                    } else {
                        navigateLightbox(1);
                    }
                }
            });
        }
    }

    // ===== FORMULAIRE DE CONTACT =====
    const form = document.getElementById('contactForm');
    if (form) {
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        const firstNameError = document.getElementById('firstNameError');
        const lastNameError = document.getElementById('lastNameError');
        const emailError = document.getElementById('emailError');
        const messageError = document.getElementById('messageError');
        const successMessage = document.getElementById('successMessage');
        
        // ... (le reste du code du formulaire est inchangé)
        // ... (votre code ici, car il était déjà correct)
    }

    // ===== CARROUSEL SWIPER =====
    const swiperContainer = document.querySelector('.swiper-container');
    if (swiperContainer && typeof Swiper !== 'undefined') {
        new Swiper(swiperContainer, {
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                320: { slidesPerView: 1, spaceBetween: 15 },
                640: { slidesPerView: 1, spaceBetween: 20 },
                768: { slidesPerView: 2, spaceBetween: 25 },
                1024: { slidesPerView: 3, spaceBetween: 30 },
            }
        });
    }

    // ===== LAZY LOADING DES IMAGES =====
    const imagesToLazyLoad = document.querySelectorAll('img[data-src]');
    if (imagesToLazyLoad.length > 0) {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        if (img.dataset.srcset) img.srcset = img.dataset.srcset;
                        img.classList.add('loaded');
                        img.removeAttribute('data-src');
                        img.removeAttribute('data-srcset');
                        observer.unobserve(img);
                    }
                });
            }, { rootMargin: '100px 0px', threshold: 0.01 });
            
            imagesToLazyLoad.forEach(img => imageObserver.observe(img));
        } else {
            imagesToLazyLoad.forEach(img => {
                img.src = img.dataset.src;
                if (img.dataset.srcset) img.srcset = img.dataset.srcset;
                img.classList.add('loaded');
            });
        }
    }

    // ===== ANIMATIONS AU DÉFILEMENT =====
    const fadeInElements = document.querySelectorAll('.fade-in');
    if (fadeInElements.length > 0) {
        const fadeObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        
        fadeInElements.forEach(el => fadeObserver.observe(el));
    }

    // ===== ANIMATION BOUTON =====
    const bookBtn = document.querySelector('.book-btn');
    if (bookBtn) {
        bookBtn.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }
});
// Configuration de la vibration
const VIBRATION_CONFIG = {
  duration: 200,
  enabled: true,
  selectors: ['BUTTON', 'INPUT[type="button"]', 'INPUT[type="submit"]']
};

// Fonction utilitaire pour déclencher la vibration
function triggerVibration(duration = VIBRATION_CONFIG.duration) {
  if (VIBRATION_CONFIG.enabled && "vibrate" in navigator) {
    navigator.vibrate(duration);
  }
}

// Initialisation du système de vibration
function initButtonVibration() {
  if (!("vibrate" in navigator)) {
    console.info('API de vibration non disponible sur cet appareil');
    return;
  }

  document.addEventListener('click', (event) => {
    // Vérifier si l'élément cliqué (ou un de ses parents) correspond aux sélecteurs
    const targetElement = event.target.closest(VIBRATION_CONFIG.selectors.join(','));
    if (targetElement) {
      triggerVibration();
    }
  }, { passive: true });

  console.info('Vibration tactile activée pour les boutons');
}

// Fonctions utilitaires pour contrôler la vibration
const ButtonVibration = {
  toggle: (enabled = !VIBRATION_CONFIG.enabled) => {
    VIBRATION_CONFIG.enabled = enabled;
    console.info(`Vibration tactile ${enabled ? 'activée' : 'désactivée'}`);
  },

  setDuration: (duration) => {
    VIBRATION_CONFIG.duration = Math.max(0, Math.min(duration, 10000));
    console.info(`Durée de vibration définie à ${VIBRATION_CONFIG.duration}ms`);
  },

  addSelector: (selector) => {
    if (!VIBRATION_CONFIG.selectors.includes(selector)) {
      VIBRATION_CONFIG.selectors.push(selector);
      console.info(`Sélecteur ajouté: ${selector}`);
    }
  },

  test: () => triggerVibration()
};

// Initialiser au chargement du DOM
document.addEventListener('DOMContentLoaded', initButtonVibration);

// Exposer l'API globalement (optionnel)
window.ButtonVibration = ButtonVibration;

