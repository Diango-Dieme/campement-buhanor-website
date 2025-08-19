document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    hamburgerMenu.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        hamburgerMenu.classList.toggle('open');
    });

    // Optionnel : Fermer le menu si on clique en dehors
    document.addEventListener('click', function(event) {
        if (!navLinks.contains(event.target) && !hamburgerMenu.contains(event.target) && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburgerMenu.classList.remove('open');
        }
    });

    // Optionnel : Fermer le menu si un lien est cliqué (pour les Single Page Applications ou si vous ne voulez pas de rechargement)
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburgerMenu.classList.remove('open');
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    let currentImageIndex = 0;
    // Ligne corrigée : Récupère l'URL de l'image depuis data-src si elle existe, sinon depuis src
    const images = Array.from(galleryItems).map(img => img.dataset.src || img.src);

    function openLightbox(index) {
        currentImageIndex = index;
        lightboxImg.src = images[currentImageIndex];
        lightbox.style.display = 'flex';
        
        // Pré-charge les images précédentes et suivantes pour une navigation fluide
        const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
        const nextIndex = (currentImageIndex + 1) % images.length;
        new Image().src = images[prevIndex];
        new Image().src = images[nextIndex];

        // Gère les erreurs de chargement d'image
        lightboxImg.onerror = () => {
            closeLightbox();
            alert("L'image n'a pas pu être chargée. Veuillez réessayer.");
        };
    }

    function closeLightbox() {
        lightbox.style.display = 'none';
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        lightboxImg.src = images[currentImageIndex];
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        lightboxImg.src = images[currentImageIndex];
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'ArrowLeft') {
                showPrevImage();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            } else if (e.key === 'Escape') {
                closeLightbox();
            }
        }
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    const firstNameError = document.getElementById('firstNameError');
    const lastNameError = document.getElementById('lastNameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    const successMessage = document.getElementById('successMessage'); // Assurez-vous que cet ID existe dans votre HTML pour afficher les messages de succès/erreur globaux

    // Vérification si le formulaire existe avant d'ajouter l'écouteur d'événements
    if (!form) {
        console.error("Erreur : L'élément avec l'ID 'contactForm' n'a pas été trouvé dans le DOM.");
        return; // Arrête l'exécution si le formulaire n'est pas trouvé
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Empêche l'envoi par défaut du formulaire

        // Réinitialiser les messages d'erreur et de succès
        hideAllErrors();
        hideSuccessMessage();

        let isValid = true;

        // Validation du Nom (obligatoire selon la maquette)
        if (lastNameInput.value.trim() === '') {
            showError(lastNameError, 'Veuillez entrer votre nom.');
            isValid = false;
        } else if (lastNameInput.value.trim().length < 2) {
            showError(lastNameError, 'Le nom doit contenir au moins 2 caractères.');
            isValid = false;
        }

        // Validation du Prénom (facultatif selon la maquette, mais vous pouvez le rendre obligatoire ici si vous voulez)
        // if (firstNameInput.value.trim() === '') {
        //     showError(firstNameError, 'Veuillez entrer votre prénom.');
        //     isValid = false;
        // } else if (firstNameInput.value.trim().length < 2) {
        //     showError(firstNameError, 'Le prénom doit contenir au moins 2 caractères.');
        //     isValid = false;
        // }


        // Validation de l'Email
        if (emailInput.value.trim() === '') {
            showError(emailError, 'Veuillez entrer votre adresse email.');
            isValid = false;
        } else if (!isValidEmail(emailInput.value.trim())) {
            showError(emailError, 'Veuillez entrer une adresse email valide.');
            isValid = false;
        }

        // Validation du Message (Commentaire ou message) - vous pouvez le rendre obligatoire ici
        if (messageInput.value.trim() === '') {
            showError(messageError, 'Veuillez entrer votre message ou commentaire.');
            isValid = false;
        } else if (messageInput.value.trim().length < 10) {
            showError(messageError, 'Le message doit contenir au moins 10 caractères.');
            isValid = false;
        }

        if (isValid) {
            // Si toutes les validations sont passées, envoyer le formulaire au backend
            const formData = {
                firstName: firstNameInput.value.trim(),
                lastName: lastNameInput.value.trim(),
                email: emailInput.value.trim(),
                message: messageInput.value.trim()
            };

            // URL de votre script PHP sur le serveur
            fetch('process_form.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (!response.ok) {
                    // Si la réponse n'est pas OK (statut 4xx ou 5xx), lisez le texte de l'erreur

                // et lancez une erreur pour passer au bloc .catch
                    return response.text().then(text => { throw new Error(text) });
                }
                return response.json(); // Tente de parser la réponse comme du JSON
            })
            .then(data => {
                console.log('Réponse du serveur:', data);
                if (data.success) {
                    showSuccessMessage('Votre message a été envoyé avec succès !');
                    form.reset(); // Réinitialise les champs du formulaire
                } else {
                    // Affiche le message d'erreur renvoyé par le serveur, ou un message générique
                    showError(successMessage, data.message || 'Une erreur inconnue est survenue lors de l\'envoi.');
                }
            })
            .catch(error => {
                console.error('Erreur lors de l\'envoi:', error);
                // Si une erreur survient (réseau, JSON invalide, erreur lancée par !response.ok),
                // affichez un message d'erreur générique ou spécifique si possible
                showError(successMessage, 'Erreur de connexion ou problème serveur. Veuillez réessayer.');
            });
        }
    });

    // Fonctions utilitaires pour afficher/masquer les messages
    function showError(element, message) {
        if (element) { // S'assure que l'élément existe avant de manipuler
            element.textContent = message;
            element.style.display = 'block';
        }
    }

    function hideError(element) {
        if (element) { // S'assure que l'élément existe avant de manipuler
            element.textContent = '';
            element.style.display = 'none';
        }
    }

    function hideAllErrors() {
        hideError(firstNameError);
        hideError(lastNameError);
        hideError(emailError);
        hideError(messageError);
        hideError(successMessage); // Cache aussi le message de succès/erreur global
    }

    function showSuccessMessage(message) {
        if (successMessage) { // S'assure que l'élément existe
            successMessage.textContent = message;
            successMessage.style.display = 'block';
            successMessage.style.color = 'green'; // Optionnel : couleur pour le succès
        }
    }

    function hideSuccessMessage() {
        if (successMessage) { // S'assure que l'élément existe
            successMessage.textContent = '';
            successMessage.style.display = 'none';
            successMessage.style.color = ''; // Réinitialise la couleur
        }
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Masquer les erreurs quand l'utilisateur tape (ajout de vérifications d'existence)
    if (firstNameInput) firstNameInput.addEventListener('input', () => hideError(firstNameError));
    if (lastNameInput) lastNameInput.addEventListener('input', () => hideError(lastNameError));
    if (emailInput) emailInput.addEventListener('input', () => hideError(emailError));
    if (messageInput) messageInput.addEventListener('input', () => hideError(messageError));
});