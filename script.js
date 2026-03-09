/* ============================================
   CONCEPTINFRA MASHRIQ HEIGHTS - JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Preloader ----
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('loaded');
        }, 1800);
    });
    // Fallback: hide preloader after 3s even if load event doesn't fire
    setTimeout(() => {
        preloader.classList.add('loaded');
    }, 3000);

    // ---- Header scroll effect ----
    const header = document.getElementById('header');
    const floatingCta = document.querySelector('.floating-cta');
    const backToTop = document.getElementById('backToTop');

    function handleScroll() {
        const scrollY = window.scrollY;

        // Header background
        if (scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Floating CTA & Back to top
        if (scrollY > 600) {
            floatingCta.classList.add('visible');
            backToTop.classList.add('visible');
        } else {
            floatingCta.classList.remove('visible');
            backToTop.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ---- Back to Top ----
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ---- Mobile Navigation ----
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        nav.classList.toggle('open');
        document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            nav.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ---- Active nav link on scroll ----
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        const scrollY = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // ---- Smooth scroll for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---- Scroll reveal animations ----
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add reveal class to elements
    const revealElements = document.querySelectorAll(
        '.consultant-card, .concept-card, .amenity-item, .location-feature, .stat-item, .founder-card, .why-card, .vision-card'
    );

    revealElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index % 6 * 0.1}s, transform 0.6s ease ${index % 6 * 0.1}s`;
        observer.observe(el);
    });

    // Add revealed style
    const style = document.createElement('style');
    style.textContent = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // ---- Counter animation ----
    const statNumbers = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    function animateCounter(element) {
        const text = element.textContent;
        const match = text.match(/(\d+)/);
        if (!match) return;

        const target = parseInt(match[1]);
        const prefix = text.substring(0, text.indexOf(match[1]));
        const suffix = text.substring(text.indexOf(match[1]) + match[1].length);
        const duration = 2000;
        const start = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * target);

            element.textContent = prefix + current + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = text;
            }
        }

        requestAnimationFrame(update);
    }

    // ---- Helpers ----
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    function isValidPhone(phone) {
        return /^[\d\s\-+()]{7,15}$/.test(phone);
    }

    // Shared form validation - returns true if valid, false if error shown
    function validateFormFields(data, nameField) {
        if (!data[nameField] || !data.email || !data.phone) {
            showNotification('Please fill in all required fields.', 'error');
            return false;
        }
        if (!isValidEmail(data.email)) {
            showNotification('Please enter a valid email address.', 'error');
            return false;
        }
        if (!isValidPhone(data.phone)) {
            showNotification('Please enter a valid phone number.', 'error');
            return false;
        }
        return true;
    }

    // Shared form submit handler
    function handleFormSubmit(form, nameField, successMsg, btnLoadingText) {
        if (!form) return;
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => data[key] = value);

            if (!validateFormFields(data, nameField)) return;

            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = btnLoadingText;
            btn.disabled = true;

            setTimeout(() => {
                btn.textContent = 'Thank You!';
                btn.style.background = '#2d8a4e';
                showNotification(successMsg, 'success');
                setTimeout(() => {
                    this.reset();
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // ---- Enquiry Form ----
    handleFormSubmit(
        document.getElementById('enquiryForm'),
        'name',
        'Thank you! Our team will contact you shortly.',
        'Sending...'
    );

    // ---- Brochure Form ----
    handleFormSubmit(
        document.getElementById('brochureForm'),
        'fullname',
        'Thank you! The brochure download link will be sent to your email shortly.',
        'Processing...'
    );

    function showNotification(message, type) {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;

        const span = document.createElement('span');
        span.textContent = message;
        notification.appendChild(span);

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '\u00D7';
        closeBtn.setAttribute('style', 'background:none;border:none;color:inherit;cursor:pointer;font-size:1.2rem;margin-left:12px;');
        closeBtn.addEventListener('click', () => notification.remove());
        notification.appendChild(closeBtn);

        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '30px',
            padding: '16px 24px',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontFamily: "'Montserrat', sans-serif",
            zIndex: '10001',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeInUp 0.4s ease',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            background: type === 'success' ? '#2d8a4e' : '#c0392b',
            color: '#fff'
        });

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.opacity = '0';
                notification.style.transform = 'translateY(-10px)';
                notification.style.transition = 'all 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // ---- Walkthrough Tour video player ----
    const wtVideo = document.getElementById('walkthroughVideo');
    const wtOverlay = document.getElementById('videoPlayOverlay');

    if (wtVideo && wtOverlay) {
        // Click overlay to play
        wtOverlay.addEventListener('click', () => {
            wtVideo.play().catch(() => {});
            wtOverlay.classList.add('hidden');
        });

        // Click video to pause and show overlay again
        wtVideo.addEventListener('click', () => {
            wtVideo.pause();
            wtOverlay.classList.remove('hidden');
        });
    }

    // ---- Hero video reel: crossfade between real video clips ----
    const vidA = document.getElementById('heroVidA');
    const vidB = document.getElementById('heroVidB');

    if (vidA && vidB) {
        // Add/remove clips: download from https://mixkit.co/free-stock-video/
        const clips = [
            'videos/clip1.mp4', // Architecture team checking blueprints
            'videos/clip2.mp4', // Architect choosing color from palette
            'videos/clip3.mp4', // Architect working on a model
            'videos/clip4.mp4', // Building under construction
            'videos/clip5.mp4'  // Modern house on the beach
        ];

        const CLIP_DURATION = 6; // seconds per clip
        let idx = 0;
        let active = vidA;
        let standby = vidB;
        let scrollPaused = false;
        let clipTimer = null;

        // Load and play first clip
        active.src = clips[0];
        active.load();
        active.play().catch(() => {});

        // Preload next clip
        standby.src = clips[1];
        standby.load();

        // Error handling - skip to next clip on load failure
        vidA.addEventListener('error', () => { nextClip(); });
        vidB.addEventListener('error', () => { nextClip(); });

        function startClipTimer() {
            clearTimeout(clipTimer);
            clipTimer = setTimeout(nextClip, CLIP_DURATION * 1000);
        }

        function nextClip() {
            clearTimeout(clipTimer);
            if (scrollPaused) return;
            idx = (idx + 1) % clips.length;

            // Ensure standby is at frame 0 before showing
            standby.currentTime = 0;

            function doSwap() {
                // Play standby then crossfade
                standby.play().catch(() => {});
                standby.classList.add('hero-vid-active');
                active.classList.remove('hero-vid-active');

                // Swap roles
                const tmp = active;
                active = standby;
                standby = tmp;

                // Preload next into standby (hidden, reset to 0)
                const nextIdx = (idx + 1) % clips.length;
                standby.classList.remove('hero-vid-active');
                standby.src = clips[nextIdx];
                standby.load();
                standby.addEventListener('loadeddata', function onLoad() {
                    standby.currentTime = 0;
                    standby.removeEventListener('loadeddata', onLoad);
                });

                startClipTimer();
            }

            // Wait until standby is seeked to 0 before revealing
            if (standby.readyState >= 2) {
                doSwap();
            } else {
                standby.addEventListener('seeked', function onSeeked() {
                    standby.removeEventListener('seeked', onSeeked);
                    doSwap();
                });
                // Fallback if seeked doesn't fire
                setTimeout(doSwap, 200);
            }
        }

        // Preload first standby properly
        standby.addEventListener('loadeddata', function onFirstLoad() {
            standby.currentTime = 0;
            standby.removeEventListener('loadeddata', onFirstLoad);
        });

        // Start first timer
        startClipTimer();

        // Also switch if a short video ends before 6s
        vidA.addEventListener('ended', nextClip);
        vidB.addEventListener('ended', nextClip);

        // Pause when scrolled past hero
        window.addEventListener('scroll', () => {
            if (window.scrollY > window.innerHeight) {
                if (!scrollPaused) {
                    scrollPaused = true;
                    clearTimeout(clipTimer);
                    vidA.pause();
                    vidB.pause();
                }
            } else {
                if (scrollPaused) {
                    scrollPaused = false;
                    active.play().catch(() => {});
                    startClipTimer();
                }
            }
        }, { passive: true });
    }

    // ---- Typed effect for hero tagline ----
    const taglineText = document.querySelector('.hero-tagline p');
    if (taglineText) {
        const originalText = taglineText.textContent;
        taglineText.textContent = '';
        let i = 0;

        function typeWriter() {
            if (i < originalText.length) {
                taglineText.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }

        // Start typing after hero animations
        setTimeout(typeWriter, 2000);
    }

});
