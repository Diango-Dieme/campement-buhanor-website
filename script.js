document.addEventListener('DOMContentLoaded', function() {
    // ===== MENU HAMBURGER =====
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

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

    // ===== GESTION DE LA VIDÉO RESPONSIVE =====
   const videoElement = document.getElementById('responsiveVideo');
const posterImage = document.querySelector('.video-poster');

videoElement.addEventListener('canplay', () => {
    // Masque l'image lorsque la vidéo est prête à être lue
    if (posterImage) {
        posterImage.classList.add('hidden');
    }
});

videoElement.addEventListener('play', () => {
    // Masque l'image au cas où l'événement 'canplay' ne serait pas suffisant
    if (posterImage) {
        posterImage.classList.add('hidden');
    }
});

// Vous pouvez également ajouter une logique pour le redimensionnement si les sources changent
function setVideoSource() {
    const mobileVideoSrc = 'sunset-plage-cap-skirring.mp4';
    const desktopVideoSrc = 'AA.mp4';
    const newSrc = window.innerWidth <= 968 ? mobileVideoSrc : desktopVideoSrc;
    
    if (videoElement.src.indexOf(newSrc) === -1) {
        videoElement.src = newSrc;
        videoElement.load();
        
        // Affiche à nouveau l'image le temps du chargement de la nouvelle vidéo
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

    // ===== LIGHTBOX =====
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const lightbox = document.getElementById('lightbox');
    
    if (galleryItems.length && lightbox) {
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

        const showError = (element, message) => {
            if (element) {
                element.textContent = message;
                element.style.display = 'block';
            }
        };

        const hideError = (element) => {
            if (element) {
                element.textContent = '';
                element.style.display = 'none';
            }
        };

        const hideAllErrors = () => {
            [firstNameError, lastNameError, emailError, messageError, successMessage]
                .forEach(el => hideError(el));
        };

        const showSuccessMessage = (message) => {
            if (successMessage) {
                successMessage.textContent = message;
                successMessage.style.display = 'block';
                successMessage.style.color = 'green';
            }
        };

        const isValidEmail = (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };

        form.addEventListener('submit', async function(event) {
            event.preventDefault();
            hideAllErrors();

            let isValid = true;

            if (lastNameInput && lastNameInput.value.trim() === '') {
                showError(lastNameError, 'Veuillez entrer votre nom.');
                isValid = false;
            } else if (lastNameInput && lastNameInput.value.trim().length < 2) {
                showError(lastNameError, 'Le nom doit contenir au moins 2 caractères.');
                isValid = false;
            }

            if (emailInput && emailInput.value.trim() === '') {
                showError(emailError, 'Veuillez entrer votre adresse email.');
                isValid = false;
            } else if (emailInput && !isValidEmail(emailInput.value.trim())) {
                showError(emailError, 'Veuillez entrer une adresse email valide.');
                isValid = false;
            }

            if (messageInput && messageInput.value.trim() === '') {
                showError(messageError, 'Veuillez entrer votre message ou commentaire.');
                isValid = false;
            } else if (messageInput && messageInput.value.trim().length < 10) {
                showError(messageError, 'Le message doit contenir au moins 10 caractères.');
                isValid = false;
            }

            if (isValid) {
                const formData = {
                    firstName: firstNameInput?.value.trim() || '',
                    lastName: lastNameInput.value.trim(),
                    email: emailInput.value.trim(),
                    message: messageInput.value.trim()
                };

                try {
                    const response = await fetch('process_form.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(errorText);
                    }

                    const data = await response.json();
                    if (data.success) {
                        showSuccessMessage('Votre message a été envoyé avec succès !');
                        form.reset();
                    } else {
                        showError(successMessage, data.message || 'Une erreur inconnue est survenue lors de l\'envoi.');
                    }
                } catch (error) {
                    console.error('Erreur lors de l\'envoi:', error);
                    showError(successMessage, 'Erreur de connexion ou problème serveur. Veuillez réessayer.');
                }
            }
        });

        if (firstNameInput) firstNameInput.addEventListener('input', () => hideError(firstNameError));
        if (lastNameInput) lastNameInput.addEventListener('input', () => hideError(lastNameError));
        if (emailInput) emailInput.addEventListener('input', () => hideError(emailError));
        if (messageInput) messageInput.addEventListener('input', () => hideError(messageError));
    }

   // ===== CARROUSEL SWIPER =====
const swiperContainer = document.querySelector('.swiper-container');
if (swiperContainer && typeof Swiper !== 'undefined') {
    new Swiper(swiperContainer, {
        // Enlevez le paramètre loop: true, ou le mettre à false
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