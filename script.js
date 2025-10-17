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

    // ===== CARROUSEL POUR LES PROMOTIONS =====
    if (document.querySelector('.promo-swiper')) {
        new Swiper('.promo-swiper', {
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '#promotions .swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '#promotions .swiper-button-next',
                prevEl: '#promotions .swiper-button-prev',
            },
            breakpoints: {
                320: { slidesPerView: 1, spaceBetween: 15 },
                640: { slidesPerView: 1, spaceBetween: 20 },
                768: { slidesPerView: 2, spaceBetween: 25 },
                1024: { slidesPerView: 3, spaceBetween: 30 },
            }
        });
    }

    // ===== CARROUSEL POUR LES AVIS CLIENTS =====
    if (document.querySelector('.reviews-swiper')) {
        new Swiper('.reviews-swiper', {
            loop: true,
            autoplay: {
                delay: 6000, // Durée légèrement différente pour désynchroniser
                disableOnInteraction: false,
            },
            slidesPerView: 1,
            spaceBetween: 30,
            pagination: {
                el: '.reviews-section .swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
            }
        });
    }

    // ===== ANIMATIONS AU DÉFILEMENT (FADE-IN) - CORRIGÉ =====
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
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const lightbox = document.getElementById('lightbox');
    
    if (galleryItems.length > 0 && lightbox) {
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
        }
    }

    // ===== NAVBAR INTELLIGENTE AU DÉFILEMENT =====
    document.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

});