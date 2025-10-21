document.addEventListener('DOMContentLoaded', function() {
    // ===== MENU HAMBURGER (S'applique à toutes les pages) =====
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (hamburgerMenu && navLinks) {
        const toggleMenu = () => {
            navLinks.classList.toggle('active');
            hamburgerMenu.classList.toggle('open');
            // Met à jour l'attribut aria-expanded pour l'accessibilité
            hamburgerMenu.setAttribute('aria-expanded', navLinks.classList.contains('active'));
        };

        hamburgerMenu.addEventListener('click', toggleMenu);

        // Ferme le menu si on clique en dehors du menu ou du bouton hamburger
        document.addEventListener('click', (event) => {
            if (!navLinks.contains(event.target) && !hamburgerMenu.contains(event.target) && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburgerMenu.classList.remove('open');
                hamburgerMenu.setAttribute('aria-expanded', 'false');
            }
        });

        // Ferme le menu après avoir cliqué sur un lien (utile pour les ancres sur une même page)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    toggleMenu(); // Réutilise la fonction toggle pour fermer
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
            if (scrollTop > 50) { // Ajoute 'scrolled' après un peu de défilement
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            // Optionnel: Cacher la navbar en descendant, montrer en remontant (si 'scrolled')
            if (scrollTop > lastScrollTop && scrollTop > 100) { // Si on descend et a dépassé 100px
                 navbar.style.top = `-${navbar.offsetHeight}px`; // Cache la navbar
             } else {
                 navbar.style.top = "0"; // Montre la navbar
             }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Pour gérer le défilement vers le haut/bas
        }, { passive: true }); // Améliore la performance du scroll
    }


    // ===== GESTION DE L'IMAGE POSTER VIDÉO (Page d'accueil uniquement) =====
    const videoElement = document.getElementById('responsiveVideo');
    if (videoElement) {
        const posterImage = document.querySelector('.video-poster');

        // Fonction pour cacher le poster
        const hidePoster = () => {
            // Vérifie si l'image poster existe et n'est pas déjà cachée
            if (posterImage && !posterImage.classList.contains('hidden')) {
                posterImage.classList.add('hidden');
                console.log('Poster caché'); // Pour vérifier dans la console
            }
        };

        // Écouteurs d'événements pour détecter quand la vidéo est prête à jouer
        videoElement.addEventListener('canplay', hidePoster); // Quand assez de données sont chargées pour commencer
        videoElement.addEventListener('play', hidePoster); // Quand la lecture commence réellement

        // Vérifie si la vidéo est déjà prête (par exemple, si elle vient du cache du navigateur)
        // readyState >= 3 signifie HAVE_FUTURE_DATA ou HAVE_ENOUGH_DATA
        if (videoElement.readyState >= 3) {
             hidePoster();
        }

        // Essayer de lancer la lecture auto si possible (certains navigateurs bloquent sans interaction)
        videoElement.play().catch(error => {
            console.warn("La lecture automatique de la vidéo a été bloquée par le navigateur.", error);
            // On pourrait afficher un bouton play ici si l'autoplay échoue
        });
    }


    // ===== CARROUSEL SWIPER POUR LES PROMOTIONS (Page d'accueil uniquement) =====
    if (document.querySelector('.promo-swiper')) {
        new Swiper('.promo-swiper', {
            // Options Swiper
            loop: false, // Recommandé de désactiver loop si peu de slides
            autoplay: {
                delay: 5000, // Défilement toutes les 5 secondes
                disableOnInteraction: false, // Continue après interaction utilisateur
                pauseOnMouseEnter: true, // Met en pause au survol
            },
            pagination: {
                el: '#promotions .swiper-pagination', // Sélecteur pour les points
                clickable: true, // Permet de cliquer sur les points
            },
             // Responsive: Nombre de slides affichées selon la taille de l'écran
            breakpoints: {
                 // quand la largeur d'écran est >= 320px
                320: {
                    slidesPerView: 1, // 1 slide visible
                    spaceBetween: 15 // Espace entre slides
                },
                // quand la largeur d'écran est >= 768px
                768: {
                    slidesPerView: 2, // 2 slides visibles
                    spaceBetween: 25
                },
                // quand la largeur d'écran est >= 1024px
                1024: {
                    slidesPerView: 3, // 3 slides visibles
                    spaceBetween: 30
                }
            },
            // Accessibilité
            a11y: {
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
            autoplay: {
                delay: 6000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            },
            slidesPerView: 1, // Affichage par défaut (mobile)
            spaceBetween: 30, // Espace entre les avis
            pagination: {
                el: '.reviews-section .swiper-pagination', // Points de navigation
                clickable: true,
            },
            // Responsive
            breakpoints: {
                768: { // Pour tablettes
                    slidesPerView: 2,
                },
                1024: { // Pour desktops
                    slidesPerView: 3,
                }
            },
            // Accessibilité
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
                pauseOnMouseEnter: true,
            },
            slidesPerView: 1, // Affichage par défaut (mobile)
            spaceBetween: 30, // Espace entre articles
            pagination: {
                el: '.blog-preview-section .swiper-pagination', // Points de navigation
                clickable: true,
            },
            // Responsive
            breakpoints: {
                768: { // Pour tablettes
                    slidesPerView: 2,
                    spaceBetween: 30,
                },
                1200: { // Pour desktops larges
                    slidesPerView: 3,
                    spaceBetween: 40,
                }
            },
            // Accessibilité
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
        // Options pour l'Intersection Observer
        const observerOptions = {
            threshold: 0.1, // Déclenche quand 10% de l'élément est visible
            rootMargin: '0px 0px -50px 0px' // Déclenche un peu avant que l'élément n'atteigne le bas de l'écran
        };

        const fadeObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                // Si l'élément entre dans la zone visible
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible'); // Ajoute la classe pour l'animation CSS
                    observer.unobserve(entry.target); // Arrête d'observer cet élément une fois animé
                }
            });
        }, observerOptions);

        // Attache l'observateur à chaque élément .fade-in
        fadeInElements.forEach(el => {
            fadeObserver.observe(el);
        });
    }


    // ===== LIGHTBOX POUR LA GALERIE D'IMAGES (Pages Galerie, Activités, Hébergement) =====
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');

    // Vérifie si on est sur une page avec une galerie et une lightbox
    if (galleryItems.length > 0 && lightbox) {
        const lightboxImg = document.getElementById('lightbox-img');
        const closeBtn = lightbox.querySelector('.close-btn');
        const prevBtn = lightbox.querySelector('.prev-btn');
        const nextBtn = lightbox.querySelector('.next-btn');
        let currentImageIndex;

        // Crée un tableau contenant les URLs de toutes les images de la galerie
        const images = Array.from(galleryItems).map(item => item.querySelector('img').src);

        // Fonction pour ouvrir la lightbox avec une image spécifique
        const openLightbox = (index) => {
            if (index >= 0 && index < images.length) { // Vérifie que l'index est valide
                currentImageIndex = index;
                lightboxImg.src = images[currentImageIndex]; // Charge l'image
                lightbox.style.display = 'flex'; // Affiche la lightbox
                document.body.style.overflow = 'hidden'; // Bloque le défilement de la page
                // Affiche ou masque les boutons Précédent/Suivant si nécessaire
                 prevBtn.style.display = images.length > 1 ? 'block' : 'none';
                 nextBtn.style.display = images.length > 1 ? 'block' : 'none';
            }
        };

        // Fonction pour fermer la lightbox
        const closeLightbox = () => {
            lightbox.style.display = 'none'; // Masque la lightbox
            document.body.style.overflow = ''; // Réactive le défilement de la page
        };

        // Fonction pour afficher l'image suivante
        const showNextImage = () => {
            // Calcule l'index suivant (revient à 0 si on est à la fin)
            currentImageIndex = (currentImageIndex + 1) % images.length;
            lightboxImg.src = images[currentImageIndex]; // Charge la nouvelle image
        };

        // Fonction pour afficher l'image précédente
        const showPrevImage = () => {
            // Calcule l'index précédent (revient à la fin si on est au début)
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            lightboxImg.src = images[currentImageIndex]; // Charge la nouvelle image
        };

        // Ajoute un écouteur de clic à chaque élément de la galerie
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                 e.preventDefault(); // Empêche le comportement par défaut si l'item est un lien
                openLightbox(index); // Ouvre la lightbox avec l'image cliquée
            });
        });

        // Ajoute les écouteurs pour les boutons et la fermeture
        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        if (nextBtn) nextBtn.addEventListener('click', showNextImage);
        if (prevBtn) prevBtn.addEventListener('click', showPrevImage);

        // Ferme la lightbox si on clique sur le fond semi-transparent
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) { // Si le clic est directement sur le fond
                closeLightbox();
            }
        });

         // Ajoute la navigation au clavier (flèches gauche/droite, Echap)
        document.addEventListener('keydown', (e) => {
            if (lightbox.style.display === 'flex') { // Si la lightbox est ouverte
                if (e.key === 'Escape') {
                    closeLightbox();
                } else if (e.key === 'ArrowRight' && images.length > 1) {
                    showNextImage();
                } else if (e.key === 'ArrowLeft' && images.length > 1) {
                    showPrevImage();
                }
            }
        });
    }

     // ===== FORMULAIRE DE CONTACT/RÉSERVATION (Page Reservation-Contact) =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Empêche l'envoi HTML standard

            // Réinitialise les messages d'erreur/succès précédents
            clearErrors();
            const successMessageDiv = document.getElementById('successMessage');
            successMessageDiv.style.display = 'none';
            successMessageDiv.textContent = '';

            // Validation simple côté client
            let isValid = validateForm();

            if (isValid) {
                // Récupère les données du formulaire
                const formData = new FormData(contactForm);
                const data = {};
                formData.forEach((value, key) => {
                    data[key] = value;
                });

                 // Affiche un indicateur de chargement (optionnel)
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalButtonText = submitButton.textContent;
                submitButton.textContent = 'Envoi en cours...';
                submitButton.disabled = true;


                // Envoie les données au script PHP
                // IMPORTANT: Remplacez 'process_form.php' par l'URL correcte de votre script PHP sur votre serveur !
                fetch('process_form.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                })
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        // Affiche le message de succès
                        successMessageDiv.textContent = result.message;
                        successMessageDiv.style.display = 'block';
                        contactForm.reset(); // Vide le formulaire
                    } else {
                        // Affiche une erreur générale si le serveur renvoie une erreur
                         displayError('generalError', result.message || 'Une erreur s\'est produite côté serveur.');
                    }
                })
                .catch(error => {
                    console.error('Erreur lors de l\'envoi:', error);
                    // Affiche une erreur réseau
                     displayError('generalError', 'Impossible d\'envoyer la demande. Vérifiez votre connexion internet.');
                })
                 .finally(() => {
                    // Réactive le bouton et restaure son texte
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                 });
            }
        });

        // --- Fonctions d'aide pour la validation ---
        function validateForm() {
            let valid = true;
            // Date Arrivée
            if (!document.getElementById('dateArrivee').value) {
                 displayError('dateArriveeError', 'Date d\'arrivée requise.');
                valid = false;
            }
            // Date Départ
            if (!document.getElementById('dateDepart').value) {
                 displayError('dateDepartError', 'Date de départ requise.');
                valid = false;
            }
            // Comparaison Dates
             const dateArrivee = new Date(document.getElementById('dateArrivee').value);
             const dateDepart = new Date(document.getElementById('dateDepart').value);
             if (dateArrivee && dateDepart && dateDepart <= dateArrivee) {
                displayError('dateDepartError', 'La date de départ doit être après la date d\'arrivée.');
                valid = false;
             }
             // Nombre Adultes
            const adultes = parseInt(document.getElementById('nombreAdultes').value, 10);
            if (isNaN(adultes) || adultes < 1) {
                 displayError('nombreAdultesError', 'Minimum 1 adulte requis.');
                valid = false;
            }
            // Type Chambre
            if (!document.getElementById('typeChambre').value) {
                 displayError('typeChambreError', 'Veuillez choisir un type de chambre.');
                valid = false;
            }
             // Nom
            if (!document.getElementById('lastName').value.trim()) {
                 displayError('lastNameError', 'Le nom est requis.');
                valid = false;
            }
            // Email
            const email = document.getElementById('email').value.trim();
            if (!email) {
                 displayError('emailError', 'L\'email est requis.');
                valid = false;
            } else if (!isValidEmail(email)) {
                 displayError('emailError', 'Format de l\'email invalide.');
                valid = false;
            }

            return valid;
        }

        function displayError(elementId, message) {
            const errorDiv = document.getElementById(elementId);
             // Cas spécial pour une erreur générale non liée à un champ
             if (elementId === 'generalError') {
                const generalErrorContainer = document.getElementById('successMessage'); // Réutilise le conteneur de succès pour l'erreur générale
                generalErrorContainer.textContent = message;
                generalErrorContainer.style.color = '#dc3545'; // Rouge
                generalErrorContainer.style.backgroundColor = '#f8d7da';
                generalErrorContainer.style.borderColor = '#f5c6cb';
                generalErrorContainer.style.display = 'block';
             } else if (errorDiv) {
                 errorDiv.textContent = message;
                 errorDiv.style.display = 'block';
             }
        }

        function clearErrors() {
            const errorMessages = contactForm.querySelectorAll('.error-message');
            errorMessages.forEach(msg => {
                msg.textContent = '';
                msg.style.display = 'none';
            });
             // Réinitialise aussi le conteneur de message général/succès
            const successMessageDiv = document.getElementById('successMessage');
            successMessageDiv.style.display = 'none';
            successMessageDiv.textContent = '';
             // Réinitialise le style du message général/succès (au cas où c'était une erreur)
            successMessageDiv.style.color = '#28a745'; // Vert
            successMessageDiv.style.backgroundColor = '#d4edda';
            successMessageDiv.style.borderColor = '#c3e6cb';
        }

        function isValidEmail(email) {
            // Expression régulière simple pour la validation d'email
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        }
    }


}); // Fin de DOMContentLoaded