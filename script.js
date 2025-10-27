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
    // La sélection de la source vidéo est maintenant gérée par le HTML (<source media>)
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
            // Affiche un avertissement si l'autoplay est bloqué (fréquent sur mobile)
            console.warn("La lecture automatique de la vidéo a été bloquée par le navigateur:", error);
            // Ici, tu pourrais ajouter un bouton "Play" visible si l'autoplay échoue
        });
    }

    // ===== CARROUSEL SWIPER POUR LES PROMOTIONS (Page d'accueil uniquement) =====
    if (document.querySelector('.promo-swiper')) {
        new Swiper('.promo-swiper', {
            loop: false, // Désactivé pour éviter les répétitions si peu d'éléments
            autoplay: {
                delay: 5000, // Change toutes les 5 secondes
                disableOnInteraction: false, // Continue même si l'utilisateur interagit
                pauseOnMouseEnter: true, // Met en pause au survol de la souris
             },
            pagination: {
                el: '#promotions .swiper-pagination', // L'élément pour les points de navigation
                clickable: true, // Permet de cliquer sur les points
            },
            breakpoints: { // Adapte le nombre de slides visibles selon la largeur
                320: { slidesPerView: 1, spaceBetween: 15 }, // Mobile
                768: { slidesPerView: 2, spaceBetween: 25 }, // Tablette
                1024: { slidesPerView: 3, spaceBetween: 30 }, // Desktop
            },
            a11y: { // Améliorations pour l'accessibilité
                prevSlideMessage: 'Promotion précédente',
                nextSlideMessage: 'Promotion suivante',
                paginationBulletMessage: 'Aller à la promotion {{index}}',
            },
        });
    }

    // ===== CARROUSEL SWIPER POUR LES AVIS CLIENTS (Page d'accueil uniquement) =====
    if (document.querySelector('.reviews-swiper')) {
        new Swiper('.reviews-swiper', {
            loop: false,
            autoplay: { delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true },
            slidesPerView: 1, // 1 avis visible par défaut (mobile)
            spaceBetween: 30, // Espace entre les avis
            pagination: { el: '.reviews-section .swiper-pagination', clickable: true },
            breakpoints: {
                768: { slidesPerView: 2 }, // 2 avis sur tablette
                1024: { slidesPerView: 3 } // 3 avis sur desktop
            },
            a11y: {
                prevSlideMessage: 'Avis précédent',
                nextSlideMessage: 'Avis suivant',
                paginationBulletMessage: 'Aller à l\'avis {{index}}',
            },
        });
    }

    // ===== CARROUSEL SWIPER POUR LE BLOG (Page d'accueil uniquement) =====
    if (document.querySelector('.blog-swiper')) {
        new Swiper('.blog-swiper', {
            loop: false,
            autoplay: {
                delay: 7000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            },
            slidesPerView: 1, // Mobile par défaut
            spaceBetween: 20, // Espace réduit pour mobile
            pagination: {
                el: '.blog-preview-section .swiper-pagination',
                clickable: true
            },
            breakpoints: {
                // Tablette
                768: {
                    slidesPerView: 2,
                    spaceBetween: 25 // Espace réduit pour tablette
                },
                // Desktop
                1200: {
                    slidesPerView: 3,
                    spaceBetween: 30 // Espace réduit pour desktop
                },
                // Très grand écran
                1600: {
                    slidesPerView: 3, // Garde 3 slides
                    spaceBetween: 30 // Espace réduit pour très grand écran
                }
            },
            a11y: {
                prevSlideMessage: 'Article précédent',
                nextSlideMessage: 'Article suivant',
                paginationBulletMessage: 'Aller à l\'article {{index}}',
            },
        });
    }

    // ===== ANIMATIONS AU DÉFILEMENT (FADE-IN) =====
    const fadeInElements = document.querySelectorAll('.fade-in');
    if (fadeInElements.length > 0) {
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
        fadeInElements.forEach(el => fadeObserver.observe(el));
    }

    // ===== LIGHTBOX (Galerie d'images) =====
    const galleryItems = document.querySelectorAll('.gallery-item'); // Tous les éléments cliquables de la galerie
    const lightbox = document.getElementById('lightbox'); // L'élément lightbox (le conteneur plein écran)

    // S'exécute seulement s'il y a des images et une lightbox dans la page
    if (galleryItems.length > 0 && lightbox) {
        const lightboxImg = document.getElementById('lightbox-img'); // L'élément <img> dans la lightbox
        const closeBtn = lightbox.querySelector('.close-btn'); // Le bouton 'X'
        const prevBtn = lightbox.querySelector('.prev-btn'); // Le bouton '<'
        const nextBtn = lightbox.querySelector('.next-btn'); // Le bouton '>'
        let currentImageIndex; // Garde en mémoire l'index de l'image affichée
        // Crée un tableau avec les URLs de toutes les images de la galerie
        const images = Array.from(galleryItems).map(item => item.querySelector('img').src);

        // Fonction pour ouvrir la lightbox à un index donné
        const openLightbox = (index) => {
             if (index >= 0 && index < images.length) { // Vérifie la validité de l'index
                currentImageIndex = index;
                lightboxImg.src = images[currentImageIndex]; // Affiche l'image correspondante
                lightbox.style.display = 'flex'; // Rend la lightbox visible
                document.body.style.overflow = 'hidden'; // Empêche le défilement de la page derrière
                // Affiche les boutons précédent/suivant seulement s'il y a plus d'une image
                 prevBtn.style.display = images.length > 1 ? 'block' : 'none';
                 nextBtn.style.display = images.length > 1 ? 'block' : 'none';
             }
        };
        // Fonction pour fermer la lightbox
        const closeLightbox = () => {
            lightbox.style.display = 'none'; // Cache la lightbox
            document.body.style.overflow = ''; // Réautorise le défilement de la page
        };
        // Fonction pour afficher l'image suivante (en boucle)
        const showNextImage = () => {
            currentImageIndex = (currentImageIndex + 1) % images.length; // Passe à l'index suivant (ou revient à 0)
            lightboxImg.src = images[currentImageIndex];
        };
        // Fonction pour afficher l'image précédente (en boucle)
        const showPrevImage = () => {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length; // Passe à l'index précédent (ou va à la fin)
            lightboxImg.src = images[currentImageIndex];
        };

        // Ajoute un écouteur de clic à chaque image de la galerie
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                 e.preventDefault(); // Empêche le comportement par défaut (ex: si l'image est dans un lien <a>)
                openLightbox(index); // Ouvre la lightbox avec l'image cliquée
            });
        });

        // Ajoute les écouteurs aux boutons de contrôle de la lightbox
        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        if (nextBtn) nextBtn.addEventListener('click', showNextImage);
        if (prevBtn) prevBtn.addEventListener('click', showPrevImage);
        // Ferme la lightbox si on clique sur le fond noir
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        // Ajoute la navigation au clavier (flèches et Echap)
        document.addEventListener('keydown', (e) => {
            if (lightbox.style.display === 'flex') { // Seulement si la lightbox est visible
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
            event.preventDefault(); // Empêche la soumission HTML classique
            clearErrors(); // Efface les anciens messages d'erreur/succès
            const successMessageDiv = document.getElementById('successMessage');
            successMessageDiv.style.display = 'none'; // Cache le message de succès
            successMessageDiv.textContent = '';

            let isValid = validateForm(); // Vérifie les champs côté client

            if (isValid) {
                // Collecte les données
                const formData = new FormData(contactForm);
                const data = {};
                formData.forEach((value, key) => { data[key] = value; });

                // Prépare le bouton pour l'envoi
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalButtonText = submitButton.textContent;
                submitButton.textContent = 'Envoi en cours...';
                submitButton.disabled = true;

                // Envoie les données au serveur (script PHP)
                // !!! ADAPTEZ 'process_form.php' SI NÉCESSAIRE !!!
                fetch('process_form.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data), // Convertit les données en JSON
                })
                .then(response => response.json()) // Attend la réponse JSON du serveur
                .then(result => { // Traite la réponse
                    if (result.success) { // Si le serveur indique succès
                        successMessageDiv.textContent = result.message; // Affiche le message de succès
                        successMessageDiv.style.display = 'block';
                        contactForm.reset(); // Vide le formulaire
                    } else { // Si le serveur indique une erreur
                        displayError('generalError', result.message || 'Erreur serveur.'); // Affiche l'erreur
                    }
                })
                .catch(error => { // En cas d'erreur réseau
                    console.error('Erreur:', error);
                    displayError('generalError', 'Erreur réseau. Vérifiez votre connexion.');
                })
                .finally(() => { // S'exécute toujours après le fetch (succès ou échec)
                    // Restaure le bouton
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                });
            }
        });

        // --- Fonctions utilitaires pour le formulaire ---
        function validateForm() {
            let valid = true; // Indicateur de validité globale
            // Vérifie chaque champ requis et affiche une erreur si invalide
            if (!document.getElementById('dateArrivee').value) { displayError('dateArriveeError', 'Date d\'arrivée requise.'); valid = false; }
            if (!document.getElementById('dateDepart').value) { displayError('dateDepartError', 'Date de départ requise.'); valid = false; }
            const dateArrivee = new Date(document.getElementById('dateArrivee').value);
            const dateDepart = new Date(document.getElementById('dateDepart').value);
            // Vérifie que la date de départ est après la date d'arrivée
            if (dateArrivee && dateDepart && dateDepart <= dateArrivee) { displayError('dateDepartError', 'Le départ doit être après l\'arrivée.'); valid = false; }
            const adultes = parseInt(document.getElementById('nombreAdultes').value, 10);
            if (isNaN(adultes) || adultes < 1) { displayError('nombreAdultesError', 'Minimum 1 adulte requis.'); valid = false; }
            if (!document.getElementById('typeChambre').value) { displayError('typeChambreError', 'Choix de chambre requis.'); valid = false; }
            if (!document.getElementById('lastName').value.trim()) { displayError('lastNameError', 'Nom requis.'); valid = false; }
            const email = document.getElementById('email').value.trim();
            if (!email) { displayError('emailError', 'Email requis.'); valid = false; }
            else if (!isValidEmail(email)) { displayError('emailError', 'Format email invalide.'); valid = false; }
            return valid; // Retourne true si tout est valide, false sinon
        }
        // Affiche un message d'erreur pour un champ spécifique ou une erreur générale
        function displayError(elementId, message) {
            const errorDiv = document.getElementById(elementId);
             if (elementId === 'generalError') { // Cas spécial pour erreur générale (réseau, serveur)
                const msgContainer = document.getElementById('successMessage'); // Réutilise le conteneur succès
                msgContainer.textContent = message;
                // Style pour indiquer une erreur
                msgContainer.style.color = '#dc3545'; // Rouge
                msgContainer.style.backgroundColor = '#f8d7da';
                msgContainer.style.borderColor = '#f5c6cb';
                msgContainer.style.display = 'block';
             } else if (errorDiv) { // Pour les erreurs de champ spécifiques
                 errorDiv.textContent = message;
                 errorDiv.style.display = 'block';
             }
        }
        // Efface tous les messages d'erreur et réinitialise le message de succès/général
        function clearErrors() {
            contactForm.querySelectorAll('.error-message').forEach(msg => { msg.textContent = ''; msg.style.display = 'none'; });
            const successDiv = document.getElementById('successMessage');
            successDiv.style.display = 'none'; successDiv.textContent = '';
            // Réinitialise le style au cas où c'était une erreur générale avant
            successDiv.style.color = '#28a745'; // Vert (style succès)
            successDiv.style.backgroundColor = '#d4edda';
            successDiv.style.borderColor = '#c3e6cb';
        }
        // Vérifie le format de l'email avec une expression régulière simple
        function isValidEmail(email) { const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; return regex.test(email); }
    }

}); // Fin de l'écouteur DOMContentLoaded