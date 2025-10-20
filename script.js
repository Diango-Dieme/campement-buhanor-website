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

        // Ferme le menu après avoir cliqué sur un lien (pour la navigation sur une seule page)
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
        document.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // ===== GESTION DE LA VIDÉO RESPONSIVE (Page d'accueil uniquement) =====
    const videoElement = document.getElementById('responsiveVideo');
    if (videoElement) {
        const posterImage = document.querySelector('.video-poster');
        let currentVideoSrc = '';

        const setVideoSource = () => {
            const newSrc = window.innerWidth <= 968 ? 'sunset-plage-cap-skirring.mp4' : 'AA.mp4';
            if (newSrc !== currentVideoSrc) {
                videoElement.src = newSrc;
                videoElement.load();
                currentVideoSrc = newSrc;
                if (posterImage) posterImage.classList.remove('hidden');
            }
        };

        videoElement.addEventListener('canplay', () => {
            if (posterImage) posterImage.classList.add('hidden');
        });
        videoElement.addEventListener('play', () => {
            if (posterImage) posterImage.classList.add('hidden');
        });

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(setVideoSource, 250);
        });

        setVideoSource();
    }

    // ===== CARROUSEL POUR LES PROMOTIONS (Page d'accueil uniquement) =====
    if (document.querySelector('.promo-swiper')) {
        new Swiper('.promo-swiper', {
            autoplay: { delay: 5000, disableOnInteraction: false },
            pagination: { el: '#promotions .swiper-pagination', clickable: true },
            breakpoints: {
                320: { slidesPerView: 1, spaceBetween: 15 },
                768: { slidesPerView: 2, spaceBetween: 25 },
                1024: { slidesPerView: 3, spaceBetween: 30 },
            }
        });
    }

    // ===== CARROUSEL POUR LES AVIS CLIENTS (Page d'accueil uniquement) =====
    if (document.querySelector('.reviews-swiper')) {
        new Swiper('.reviews-swiper', {
            loop: false, // Corrigé pour éviter l'avertissement
            autoplay: { delay: 6000, disableOnInteraction: false },
            slidesPerView: 1,
            spaceBetween: 30,
            pagination: { el: '.reviews-section .swiper-pagination', clickable: true },
            breakpoints: {
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
            }
        });
    }

    // ===== CARROUSEL POUR LE BLOG (Page d'accueil uniquement) =====
    if (document.querySelector('.blog-swiper')) {
        new Swiper('.blog-swiper', {
            loop: false, // Corrigé pour éviter l'avertissement
            autoplay: { delay: 7000, disableOnInteraction: false },
            slidesPerView: 1,
            spaceBetween: 30,
            pagination: { el: '.blog-preview-section .swiper-pagination', clickable: true },
            breakpoints: {
                768: { slidesPerView: 2, spaceBetween: 30 },
                1200: { slidesPerView: 3, spaceBetween: 40 }
            }
        });
    }

    // ===== ANIMATIONS AU DÉFILEMENT (FADE-IN) =====
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

    // ===== LIGHTBOX (Galerie d'images) =====
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');

    if (galleryItems.length > 0 && lightbox) {
        const lightboxImg = document.getElementById('lightbox-img');
        const closeBtn = lightbox.querySelector('.close-btn');
        const prevBtn = lightbox.querySelector('.prev-btn');
        const nextBtn = lightbox.querySelector('.next-btn');
        let currentImageIndex;
        
        // On récupère les sources des images de la galerie
        const images = Array.from(galleryItems).map(item => item.querySelector('img').src);

        const openLightbox = (index) => {
            currentImageIndex = index;
            lightboxImg.src = images[currentImageIndex];
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.style.display = 'none';
            document.body.style.overflow = '';
        };

        const showNextImage = () => {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            lightboxImg.src = images[currentImageIndex];
        };

        const showPrevImage = () => {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            lightboxImg.src = images[currentImageIndex];
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });

        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        if (nextBtn) nextBtn.addEventListener('click', showNextImage);
        if (prevBtn) prevBtn.addEventListener('click', showPrevImage);
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
});