document.addEventListener('DOMContentLoaded', () => {
    // Flag to prevent carousel swipe when slider is moving
    let isAnySliderActive = false;

    // === BEFORE/AFTER SLIDER LOGIC ===
    const comparisonCards = document.querySelectorAll('.comparison-card');

    comparisonCards.forEach(card => {
        const slider = card.querySelector('.comparison-slider');
        const beforeImg = card.querySelector('.comparison-img.before');
        let isDragging = false;

        const moveSlider = (clientX) => {
            const rect = card.getBoundingClientRect();
            // ClientX is relative to viewport, rect.left is relative to viewport
            let position = ((clientX - rect.left) / rect.width) * 100;

            // Constrain
            position = Math.max(0, Math.min(100, position));

            slider.style.left = `${position}%`;
            // clip-path for smooth reveals
            beforeImg.style.clipPath = `inset(0 ${100 - position}% 0 0)`;
        };

        const startDragging = (e) => {
            isDragging = true;
            isAnySliderActive = true;
            card.classList.add('is-dragging');

            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            moveSlider(clientX);

            // On mobile, prevent swipe/scroll from taking over
            if (e.type.includes('touch')) {
                // e.stopPropagation(); // Don't propagate to carousel parent
            }
        };

        const stopDragging = () => {
            if (isDragging) {
                isDragging = false;
                isAnySliderActive = false;
                card.classList.remove('is-dragging');
                // Small delay to prevent carousel from immediately firing a swipe
                setTimeout(() => { isAnySliderActive = false; }, 100);
            }
        };

        const onMove = (e) => {
            if (!isDragging) return;

            // Stop page scroll on mobile only when dragging
            if (e.cancelable) e.preventDefault();

            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            moveSlider(clientX);
        };

        // Local listeners for start
        card.addEventListener('mousedown', startDragging);
        card.addEventListener('touchstart', startDragging, { passive: false });

        // Window-wide listeners for move and end to avoid "losing" the slider
        window.addEventListener('mousemove', onMove);
        window.addEventListener('touchmove', onMove, { passive: false });

        window.addEventListener('mouseup', stopDragging);
        window.addEventListener('touchend', stopDragging);
    });

    // === MOBILE CAROUSEL LOGIC ===
    const grid = document.querySelector('.before-after-grid');
    const dots = document.querySelectorAll('.dot');
    const nextBtn = document.querySelector('.next-case');
    const prevBtn = document.querySelector('.prev-case');
    const totalItems = comparisonCards.length;
    let currentIndex = 0;

    const updateCarousel = (index) => {
        if (window.innerWidth <= 992) {
            // Loop index
            currentIndex = (index + totalItems) % totalItems;
            const offset = -currentIndex * 100;
            grid.style.transform = `translateX(${offset}%)`;

            // Active dot
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }
    };

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => updateCarousel(currentIndex + 1));
        prevBtn.addEventListener('click', () => updateCarousel(currentIndex - 1));
    }

    // Swipe Swipe Swipe
    let touchStartX = 0;
    let touchEndX = 0;

    grid.addEventListener('touchstart', e => {
        if (isAnySliderActive) return; // Block swipe if we are using the comparison slider
        touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    grid.addEventListener('touchend', e => {
        if (isAnySliderActive) return;
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const threshold = 60;
        const diff = touchEndX - touchStartX;

        if (Math.abs(diff) > threshold) {
            if (diff < 0) {
                updateCarousel(currentIndex + 1);
            } else {
                updateCarousel(currentIndex - 1);
            }
        }
    }

    // Resize fix
    window.addEventListener('resize', () => {
        if (window.innerWidth > 992) {
            grid.style.transform = 'none';
        } else {
            updateCarousel(currentIndex);
        }
    });
    // === CAR ZONE INTERACTIVITY ===
    const carZones = document.querySelectorAll('.car-zone');
    const panelDefault = document.getElementById('panelDefault');
    const panelActive = document.getElementById('panelActive');
    const panelPart = document.getElementById('panelPart');
    const panelPrice = document.getElementById('panelPrice');

    if (carZones.length) {
        carZones.forEach(zone => {
            zone.addEventListener('mouseenter', () => {
                const part = zone.dataset.part;
                const price = zone.dataset.price;

                // Update panel
                if (panelDefault) panelDefault.style.display = 'none';
                if (panelActive) {
                    panelActive.style.display = 'block';
                    panelPart.textContent = part;
                    panelPrice.textContent = price;
                }
            });

            zone.addEventListener('mouseleave', () => {
                // Reset panel
                if (panelDefault) panelDefault.style.display = 'block';
                if (panelActive) panelActive.style.display = 'none';
            });
        });
    }

    // === FLOATING ACTION BUTTONS (V2) ===
    const fabUpBtn = document.getElementById('fabUpBtn');
    if (fabUpBtn) {
        // Show/hide up button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                fabUpBtn.classList.add('visible');
            } else {
                fabUpBtn.classList.remove('visible');
            }
        });

        // Smooth scroll to top on click
        fabUpBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // === REVIEWS SLIDER ===
    const reviewsTrack = document.querySelector('.reviews-track');
    const reviewCards = document.querySelectorAll('.review-card');
    const reviewPrev = document.querySelector('.review-prev');
    const reviewNext = document.querySelector('.review-next');

    if (reviewsTrack && reviewCards.length > 0) {
        let currentReviewIndex = 1; // Start with second card as center

        const updateReviews = () => {
            // Update active classes
            reviewCards.forEach((card, i) => {
                card.classList.toggle('active', i === currentReviewIndex);
            });

            // Calculate shift manually
            let shift = 0;
            if (window.innerWidth > 1200) {
                // Desktop rigid 3-card frame
                shift = (currentReviewIndex - 1) * -410;
            } else if (window.innerWidth > 576) {
                // Tablet centering
                const cardWidth = 380;
                const gap = 30;
                const step = cardWidth + gap;
                shift = (window.innerWidth / 2) - ((currentReviewIndex * step) + (cardWidth / 2));
            } else {
                // Mobile centering
                const cardWidth = 300;
                const gap = 15;
                const step = cardWidth + gap;
                shift = (window.innerWidth / 2) - ((currentReviewIndex * step) + (cardWidth / 2));
            }

            reviewsTrack.style.transform = `translateX(${shift}px)`;
        };

        // Arrow navigation
        if (reviewPrev && reviewNext) {
            reviewPrev.addEventListener('click', () => {
                if (currentReviewIndex > 0) {
                    currentReviewIndex--;
                    updateReviews();
                }
            });

            reviewNext.addEventListener('click', () => {
                if (currentReviewIndex < reviewCards.length - 1) {
                    currentReviewIndex++;
                    updateReviews();
                }
            });
        }

        // Window resize needs recalculation to keep it centered
        window.addEventListener('resize', updateReviews);

        // Initial setup
        updateReviews();
    }

    // === FAQ ACCORDION ===
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-item__header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all items
            faqItems.forEach(otherItem => otherItem.classList.remove('active'));

            // Toggle clicked item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // === SCROLL ANIMATIONS ===
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% visible
    };

    const fadeElements = document.querySelectorAll('.fade-up, .fade-in, .section-header');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Unobserve after animating once
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(item => {
        observer.observe(item);
    });

    // === STICKY HEADER SCROLL ===
    const header = document.querySelector('.header');

    if (header) {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > 20) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        // Run once on load to catch current position
        handleScroll();
    }

    // === MOBILE BURGER MENU ===
    const burgerBtn = document.getElementById('burgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (burgerBtn && mobileMenu) {
        burgerBtn.addEventListener('click', () => {
            burgerBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        // Close menu if link inside is clicked
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                burgerBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
    }
});
