document.addEventListener('DOMContentLoaded', () => {

    // --------------------------------------------------------------------------
    // 1. Goal Progress Fill Animation
    // --------------------------------------------------------------------------
    const progressFill = document.querySelector('.goal-progress-fill');
    if (progressFill) {
        setTimeout(() => {
            progressFill.style.width = '12.5%';
        }, 300);
    }

    // --------------------------------------------------------------------------
    // 2. Screenshots Auto-Flipping Carousel Engine
    // --------------------------------------------------------------------------
    const carousels = document.querySelectorAll('.carousel-container');

    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const prevBtn = carousel.querySelector('.prev-btn');
        const nextBtn = carousel.querySelector('.next-btn');

        if (!track) return;

        let autoSlideInterval = null;
        const slideStep = 220; // Scroll distance per step

        // Function to step forward
        const slideNext = () => {
            const maxScroll = track.scrollWidth - track.clientWidth;
            if (track.scrollLeft >= maxScroll - 15) {
                track.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                track.scrollBy({ left: slideStep, behavior: 'smooth' });
            }
        };

        // Function to step backward
        const slidePrev = () => {
            if (track.scrollLeft <= 15) {
                track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
            } else {
                track.scrollBy({ left: -slideStep, behavior: 'smooth' });
            }
        };

        // Start Auto-Flipping Loop (Every 2.5s)
        const startAutoSlide = () => {
            if (!autoSlideInterval) {
                autoSlideInterval = setInterval(slideNext, 2500);
            }
        };

        // Stop Auto-Flipping Loop
        const stopAutoSlide = () => {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
                autoSlideInterval = null;
            }
        };

        // Event listeners for Manual Buttons
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                stopAutoSlide();
                slideNext();
                setTimeout(startAutoSlide, 5000); // Resume auto-flipping after manual interaction
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                stopAutoSlide();
                slidePrev();
                setTimeout(startAutoSlide, 5000);
            });
        }

        // Pause auto-sliding on hover / touch
        carousel.addEventListener('mouseenter', stopAutoSlide);
        carousel.addEventListener('mouseleave', startAutoSlide);
        carousel.addEventListener('touchstart', stopAutoSlide, { passive: true });
        carousel.addEventListener('touchend', () => setTimeout(startAutoSlide, 4000));

        // Initial Start
        startAutoSlide();
    });

    // --------------------------------------------------------------------------
    // 3. Modal Lightbox for Full-Size Screenshot View
    // --------------------------------------------------------------------------
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(28, 25, 23, 0.9);
        backdrop-filter: blur(8px);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        cursor: pointer;
        padding: 20px;
    `;
    
    const lightboxImg = document.createElement('img');
    lightboxImg.style.cssText = `
        max-width: 92%;
        max-height: 88vh;
        border-radius: 16px;
        box-shadow: 0 24px 48px rgba(0, 0, 0, 0.4);
        border: 3px solid #F9F7F2;
        object-fit: contain;
    `;
    
    lightbox.appendChild(lightboxImg);
    document.body.appendChild(lightbox);

    // Add click event to carousel images
    document.querySelectorAll('.carousel-track img').forEach(img => {
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.style.display = 'flex';
        });
    });

    lightbox.addEventListener('click', () => {
        lightbox.style.display = 'none';
    });

    // --------------------------------------------------------------------------
    // 4. Smooth Scroll for Anchor Links
    // --------------------------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

});
