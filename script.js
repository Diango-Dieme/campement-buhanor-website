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

      // ===== FORMULAIRE DE CONTACT (NOUVELLE VERSION RESERVATION) =====
    const form = document.getElementById('contactForm');
    if (form) {
        // Déclaration des champs de réservation
        const dateArriveeInput = document.getElementById('dateArrivee');
        const dateDepartInput = document.getElementById('dateDepart');
        const nombreAdultesInput = document.getElementById('nombreAdultes');
        const nombreEnfantsInput = document.getElementById('nombreEnfants');
        const typeChambreInput = document.getElementById('typeChambre');
        
        // Déclaration des champs de contact
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        
        // Messages d'erreurs
        const dateArriveeError = document.getElementById('dateArriveeError');
        const dateDepartError = document.getElementById('dateDepartError');
        const nombreAdultesError = document.getElementById('nombreAdultesError');
        const typeChambreError = document.getElementById('typeChambreError');
        const lastNameError = document.getElementById('lastNameError');
        const emailError = document.getElementById('emailError');
        const successMessage = document.getElementById('successMessage');

        // Fonction d'affichage des erreurs
        const setError = (element, message) => {
            const errorDisplay = document.getElementById(element.id + 'Error');
            errorDisplay.textContent = message;
            errorDisplay.style.display = message ? 'block' : 'none';
        };

        // Fonction de validation de l'e-mail
        const isValidEmail = (email) => {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        };
        
        // Fonction de validation des champs de date
        const validateDateRange = () => {
            let isValid = true;
            const today = new Date();
            today.setHours(0, 0, 0, 0); 
            const dateArriveeValue = dateArriveeInput.value;
            const dateDepartValue = dateDepartInput.value;
            const dateArrivee = dateArriveeValue ? new Date(dateArriveeValue) : null;
            const dateDepart = dateDepartValue ? new Date(dateDepartValue) : null;
            
            setError(dateArriveeInput, '');
            setError(dateDepartInput, '');

            if (!dateArrivee) {
                setError(dateArriveeInput, 'La date d\'arrivée est obligatoire.');
                isValid = false;
            } else if (dateArrivee < today) {
                setError(dateArriveeInput, 'La date d\'arrivée ne peut pas être passée.');
                isValid = false;
            }

            if (!dateDepart) {
                setError(dateDepartInput, 'La date de départ est obligatoire.');
                isValid = false;
            }

            if (dateArrivee && dateDepart && dateDepart <= dateArrivee) {
                setError(dateDepartInput, 'La date de départ doit être postérieure à l\'arrivée.');
                isValid = false;
            }
            
            // Validation spéciale pour la location à la journée
            if (typeChambreInput.value === 'JOURNEE') {
                if (dateArriveeValue !== dateDepartValue) {
                    setError(dateArriveeInput, 'Les dates d\'arrivée et de départ doivent être identiques pour la location à la journée.');
                    setError(dateDepartInput, 'Les dates d\'arrivée et de départ doivent être identiques pour la location à la journée.');
                    isValid = false;
                }
            }


            return isValid;
        };

        // Fonction de validation de tous les inputs
        const validateInputs = () => {
            let isValid = true;

            // 1. Validation des champs de réservation (Dates)
            if (!validateDateRange()) {
                isValid = false;
            }

            // 2. Type de Chambre
            if (typeChambreInput.value === "") {
                setError(typeChambreInput, 'Veuillez sélectionner un type de chambre.');
                isValid = false;
            } else {
                setError(typeChambreInput, '');
            }
            
            // 3. Nombre d'Adultes
            const adultes = parseInt(nombreAdultesInput.value);
            if (isNaN(adultes) || adultes < 1) {
                setError(nombreAdultesInput, 'Minimum 1 adulte requis.');
                isValid = false;
            } else {
                setError(nombreAdultesInput, '');
            }
            
            // 4. Nom
            if (lastNameInput.value.trim() === "") {
                setError(lastNameInput, 'Le nom est obligatoire.');
                isValid = false;
            } else {
                setError(lastNameInput, '');
            }
            
            // 5. E-mail
            if (emailInput.value.trim() === "") {
                setError(emailInput, 'L\'e-mail est obligatoire.');
                isValid = false;
            } else if (!isValidEmail(emailInput.value.trim())) {
                setError(emailInput, 'Format d\'e-mail invalide.');
                isValid = false;
            } else {
                setError(emailInput, '');
            }

            return isValid;
        };
        
        // Écoute des changements pour les erreurs de date
        dateArriveeInput.addEventListener('change', validateDateRange);
        dateDepartInput.addEventListener('change', validateDateRange);
        typeChambreInput.addEventListener('change', validateDateRange); // pour la logique "Journée"

        // Gestion de la soumission
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            successMessage.style.display = 'none';

            if (validateInputs()) {
                const formData = {
                    dateArrivee: dateArriveeInput.value,
                    dateDepart: dateDepartInput.value,
                    typeChambre: typeChambreInput.value,
                    nombreAdultes: nombreAdultesInput.value,
                    nombreEnfants: nombreEnfantsInput.value,
                    firstName: firstNameInput.value,
                    lastName: lastNameInput.value,
                    email: emailInput.value,
                    message: messageInput.value
                };

                const submitButton = form.querySelector('button[type="submit"]');
                submitButton.disabled = true;
                submitButton.textContent = 'Envoi en cours...';

                try {
                    const response = await fetch('process_form.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    });

                    const result = await response.json();
                    
                    if (result.success) {
                        successMessage.textContent = result.message;
                        successMessage.style.backgroundColor = '#d4edda';
                        successMessage.style.color = '#155724';
                        successMessage.style.display = 'block';
                        form.reset(); // Vider le formulaire
                        
                    } else {
                        successMessage.textContent = 'Erreur: ' + result.message;
                        successMessage.style.backgroundColor = '#f8d7da';
                        successMessage.style.color = '#721c24';
                        successMessage.style.display = 'block';
                    }

                } catch (error) {
                    successMessage.textContent = 'Une erreur réseau est survenue. Veuillez réessayer.';
                    successMessage.style.backgroundColor = '#f8d7da';
                    successMessage.style.color = '#721c24';
                    successMessage.style.display = 'block';
                } finally {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Envoyer ma demande de réservation';
                }
            }
        });
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

