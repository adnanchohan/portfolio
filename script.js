// --------------------------------------------------------------------------
// Google Analytics 4 (GA4) Event Helper
// --------------------------------------------------------------------------
function trackAnalyticsEvent(eventName, params = {}) {
    try {
        if (typeof window.gtag === 'function') {
            window.gtag('event', eventName, params);
        }
    } catch (err) {
        console.debug('GA4 tracking skipped:', err);
    }
}

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

        const appCard = carousel.closest('.playstore-card');
        const appName = appCard ? (appCard.querySelector('.playstore-app-name')?.innerText.trim() || 'App') : 'App';

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
                trackAnalyticsEvent('carousel_nav_click', { direction: 'next', app_name: appName });
                setTimeout(startAutoSlide, 5000); // Resume auto-flipping after manual interaction
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                stopAutoSlide();
                slidePrev();
                trackAnalyticsEvent('carousel_nav_click', { direction: 'prev', app_name: appName });
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

            // Track screenshot view in GA4
            trackAnalyticsEvent('view_screenshot', {
                screenshot_alt: img.alt || 'Screenshot',
                screenshot_src: img.src
            });
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
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --------------------------------------------------------------------------
    // 5. Global Analytics Click Tracker (Buttons, CTAs, App Links, Socials)
    // --------------------------------------------------------------------------
    document.addEventListener('click', (e) => {
        const target = e.target.closest('[data-analytics]');
        if (target) {
            const eventName = target.getAttribute('data-analytics');
            const label = target.getAttribute('data-label') || target.innerText.trim();
            const app = target.getAttribute('data-app');
            const platform = target.getAttribute('data-platform');
            
            const params = {
                event_category: 'engagement',
                event_label: label,
            };
            if (app) params.app_name = app;
            if (platform) params.platform = platform;
            if (target.href) params.link_url = target.href;

            trackAnalyticsEvent(eventName, params);
        }
    });

});

