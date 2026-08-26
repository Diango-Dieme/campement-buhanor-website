document.addEventListener('DOMContentLoaded', function() {
    // ===== MENU HAMBURGER (S'applique à toutes les pages) =====
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (hamburgerMenu && navLinks) {
        const toggleMenu = () => {
            navLinks.classList.toggle('active');
            hamburgerMenu.classList.toggle('open');
            hamburgerMenu.setAttribute('aria-expanded', navLinks.classList.contains('active'));
        };

        hamburgerMenu.addEventListener('click', toggleMenu);

        // Ferme le menu si on clique en dehors
        document.addEventListener('click', (event) => {
            if (!navLinks.contains(event.target) && !hamburgerMenu.contains(event.target) && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburgerMenu.classList.remove('open');
                hamburgerMenu.setAttribute('aria-expanded', 'false');
            }
        });

        // Ferme le menu après avoir cliqué sur un lien
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });
    }

    // ===== NAVBAR INTELLIGENTE (S'applique à toutes les pages) =====
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        let lastScrollTop = 0;
        document.addEventListener('scroll', () => {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            // Ajoute la classe 'scrolled' après un défilement de 50px
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
             // Optionnel : Cache la navbar en descendant, la montre en remontant
             if (scrollTop > lastScrollTop && scrollTop > 100){ // Si on descend et a dépassé 100px
                 navbar.style.top = `-${navbar.offsetHeight}px`; // Cache la navbar
             } else {
                 navbar.style.top = "0"; // Montre la navbar
             }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Met à jour la position de défilement précédente
        }, { passive: true }); // Améliore la performance du scroll
    }

    // ===== GESTION DE L'IMAGE POSTER VIDÉO (Page d'accueil uniquement) =====
    const videoElement = document.getElementById('responsiveVideo');
    if (videoElement) {
        const posterImage = document.querySelector('.video-poster');

        // Fonction pour cacher l'image poster
        const hidePoster = () => {
            if (posterImage && !posterImage.classList.contains('hidden')) {
                posterImage.classList.add('hidden'); // Ajoute la classe CSS pour masquer l'image
            }
        };

        // Écouteurs d'événements : cache le poster dès que la vidéo peut commencer à jouer
        videoElement.addEventListener('canplay', hidePoster); // Assez de données chargées
        videoElement.addEventListener('play', hidePoster); // La lecture commence

        // Vérifie si la vidéo est déjà prête (ex: depuis le cache du navigateur)
        if (videoElement.readyState >= 3) { // HAVE_FUTURE_DATA ou HAVE_ENOUGH_DATA
             hidePoster();
        }

        // Tente de démarrer la lecture automatique (autoplay)
        videoElement.play().catch(error => {
            console.warn("La lecture automatique de la vidéo a été bloquée par le navigateur:", error);
        });
    }

    // ===== ANIMATIONS AU DÉFILEMENT (FADE-IN / REVEAL) =====
    // Fonctionne avec les classes '.fade-in' ET '.reveal' (nouveau design)
    const animatedElements = document.querySelectorAll('.fade-in, .reveal');
    if (animatedElements.length > 0) {
        // Configuration de l'Intersection Observer
        const observerOptions = {
            threshold: 0.1, // Déclenche quand 10% de l'élément est visible
            rootMargin: '0px 0px -50px 0px' // Commence l'animation 50px avant que l'élément n'atteigne le bas de l'écran
         };
        const fadeObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) { // Si l'élément devient visible
                    entry.target.classList.add('visible'); // Ajoute la classe CSS pour l'animer
                    observer.unobserve(entry.target); // Arrête d'observer cet élément (optimisation)
                }
            });
        }, observerOptions);
        // Applique l'observateur à tous les éléments concernés
        animatedElements.forEach(el => fadeObserver.observe(el));
    }

    // ===== LIGHTBOX (Galerie d'images) =====
    const galleryItems = document.querySelectorAll('.gallery-item'); // Tous les éléments cliquables de la galerie
    const lightbox = document.getElementById('lightbox'); // L'élément lightbox (le conteneur plein écran)

    // S'exécute seulement s'il y a des images et une lightbox dans la page
    if (galleryItems.length > 0 && lightbox) {
        const lightboxImg = document.getElementById('lightbox-img');
        const closeBtn = lightbox.querySelector('.close-btn');
        const prevBtn = lightbox.querySelector('.prev-btn');
        const nextBtn = lightbox.querySelector('.next-btn');
        let currentImageIndex;
        // Crée un tableau avec les URLs de toutes les images de la galerie
        const images = Array.from(galleryItems).map(item => item.querySelector('img').src);

        // Fonction pour ouvrir la lightbox à un index donné
        const openLightbox = (index) => {
             if (index >= 0 && index < images.length) {
                currentImageIndex = index;
                lightboxImg.src = images[currentImageIndex];
                lightbox.style.display = 'flex';
                document.body.style.overflow = 'hidden'; // Empêche le défilement derrière
                 prevBtn.style.display = images.length > 1 ? 'block' : 'none';
                 nextBtn.style.display = images.length > 1 ? 'block' : 'none';
             }
        };
        // Fonction pour fermer la lightbox
        const closeLightbox = () => {
            lightbox.style.display = 'none';
            document.body.style.overflow = ''; // Réautorise le défilement
        };
        // Fonction pour afficher l'image suivante (en boucle)
        const showNextImage = () => {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            lightboxImg.src = images[currentImageIndex];
        };
        // Fonction pour afficher l'image précédente (en boucle)
        const showPrevImage = () => {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            lightboxImg.src = images[currentImageIndex];
        };

        // Ajoute un écouteur de clic à chaque image de la galerie
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                 e.preventDefault();
                openLightbox(index);
            });
        });

        // Boutons + fermeture au clic sur le fond + navigation clavier
        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        if (nextBtn) nextBtn.addEventListener('click', showNextImage);
        if (prevBtn) prevBtn.addEventListener('click', showPrevImage);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        document.addEventListener('keydown', (e) => {
            if (lightbox.style.display === 'flex') {
                if (e.key === 'Escape') closeLightbox();
                else if (e.key === 'ArrowRight' && images.length > 1) showNextImage();
                else if (e.key === 'ArrowLeft' && images.length > 1) showPrevImage();
            }
        });
    }

    // ===== FORMULAIRE DE CONTACT/RÉSERVATION (Page Reservation-Contact) =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            clearErrors();
            const successMessageDiv = document.getElementById('successMessage');
            successMessageDiv.style.display = 'none';
            successMessageDiv.textContent = '';

            let isValid = validateForm();

            if (isValid) {
                const formData = new FormData(contactForm);
                const data = {};
                formData.forEach((value, key) => { data[key] = value; });

                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalButtonText = submitButton.textContent;
                submitButton.textContent = 'Envoi en cours...';
                submitButton.disabled = true;

                fetch('process_form.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                })
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        successMessageDiv.textContent = result.message;
                        successMessageDiv.style.display = 'block';
                        contactForm.reset();
                    } else {
                        displayError('generalError', result.message || 'Erreur serveur.');
                    }
                })
                .catch(error => {
                    console.error('Erreur:', error);
                    displayError('generalError', 'Erreur réseau. Vérifiez votre connexion.');
                })
                .finally(() => {
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                });
            }
        });

        // --- Fonctions utilitaires pour le formulaire ---
        function validateForm() {
            let valid = true;
            if (!document.getElementById('dateArrivee').value) { displayError('dateArriveeError', 'Date d\'arrivée requise.'); valid = false; }
            if (!document.getElementById('dateDepart').value) { displayError('dateDepartError', 'Date de départ requise.'); valid = false; }
            const dateArrivee = new Date(document.getElementById('dateArrivee').value);
            const dateDepart = new Date(document.getElementById('dateDepart').value);
            if (dateArrivee && dateDepart && dateDepart <= dateArrivee) { displayError('dateDepartError', 'Le départ doit être après l\'arrivée.'); valid = false; }
            const adultes = parseInt(document.getElementById('nombreAdultes').value, 10);
            if (isNaN(adultes) || adultes < 1) { displayError('nombreAdultesError', 'Minimum 1 adulte requis.'); valid = false; }
            if (!document.getElementById('typeChambre').value) { displayError('typeChambreError', 'Choix de chambre requis.'); valid = false; }
            if (!document.getElementById('lastName').value.trim()) { displayError('lastNameError', 'Nom requis.'); valid = false; }
            const email = document.getElementById('email').value.trim();
            if (!email) { displayError('emailError', 'Email requis.'); valid = false; }
            else if (!isValidEmail(email)) { displayError('emailError', 'Format email invalide.'); valid = false; }
            return valid;
        }
        function displayError(elementId, message) {
            const errorDiv = document.getElementById(elementId);
             if (elementId === 'generalError') {
                const msgContainer = document.getElementById('successMessage');
                msgContainer.textContent = message;
                msgContainer.style.color = '#dc3545';
                msgContainer.style.backgroundColor = '#f8d7da';
                msgContainer.style.borderColor = '#f5c6cb';
                msgContainer.style.display = 'block';
             } else if (errorDiv) {
                 errorDiv.textContent = message;
                 errorDiv.style.display = 'block';
             }
        }
        function clearErrors() {
            contactForm.querySelectorAll('.error-message').forEach(msg => { msg.textContent = ''; msg.style.display = 'none'; });
            const successDiv = document.getElementById('successMessage');
            successDiv.style.display = 'none'; successDiv.textContent = '';
            successDiv.style.color = '#28a745';
            successDiv.style.backgroundColor = '#d4edda';
            successDiv.style.borderColor = '#c3e6cb';
        }
        function isValidEmail(email) { const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; return regex.test(email); }
    }

}); // Fin de l'écouteur DOMContentLoaded
