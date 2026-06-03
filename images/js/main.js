/**
 * Main JavaScript for Beijing Yiruyi Consulting Services Co., Ltd.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // Set Current Year in Footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Navbar Scroll Effect
    const header = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = mobileBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // Initial Trigger for Hero Animations
    setTimeout(() => {
        document.querySelectorAll('.fade-up').forEach(el => {
            el.classList.add('visible');
        });
    }, 100);

    // Scroll Reveal Intersection Observer
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    document.querySelectorAll('.scroll-reveal').forEach(el => {
        revealObserver.observe(el);
    });
    
    // Active Navigation Link Highlighting on Scroll
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    // ==========================================
    // Premium Certificate Lightbox Functionality
    // ==========================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxImgContainer = document.getElementById('lightbox-img-container');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const zoomIndicator = document.getElementById('zoom-indicator');
    
    const btnClose = document.getElementById('lightbox-close');
    const btnZoomIn = document.getElementById('lightbox-zoom-in');
    const btnZoomOut = document.getElementById('lightbox-zoom-out');
    const btnReset = document.getElementById('lightbox-reset');
    const btnPrev = document.getElementById('lightbox-prev');
    const btnNext = document.getElementById('lightbox-next');

    // If we are on a page that doesn't have the lightbox markup, return early
    if (lightbox) {
        // Collect all certificate cards on the page dynamically
        const certCards = document.querySelectorAll('.cert-card');
        const certificates = Array.from(certCards).map((card, index) => {
            const img = card.querySelector('img');
            const title = card.querySelector('.cert-title');
            
            // Add click listener to open lightbox at this index
            card.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
            
            return {
                src: img.getAttribute('src'),
                title: title ? title.textContent.trim() : (img.getAttribute('alt') || '')
            };
        });

        let currentIdx = 0;
        let scale = 1;
        let isDragging = false;
        let startX = 0, startY = 0;
        let translateX = 0, translateY = 0;
        let zoomIndicatorTimeout = null;

        const MIN_SCALE = 0.5;
        const MAX_SCALE = 5;
        const SCALE_STEP = 0.25;

        // Open lightbox
        function openLightbox(index) {
            currentIdx = index;
            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Lock background scroll
            loadImage(currentIdx);
            resetZoom();
        }

        // Close lightbox
        function closeLightbox() {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = ''; // Unlock background scroll
            setTimeout(() => {
                lightboxImg.src = '';
            }, 300); // Wait for transition
        }

        // Load image with bounds and caption
        function loadImage(index) {
            if (index < 0 || index >= certificates.length) return;
            
            const cert = certificates[index];
            lightboxImg.src = cert.src;
            lightboxCaption.textContent = cert.title;
            
            // Update arrow button visibility
            btnPrev.style.display = certificates.length > 1 ? 'flex' : 'none';
            btnNext.style.display = certificates.length > 1 ? 'flex' : 'none';
        }

        // Navigate prev / next
        function prevImage() {
            if (certificates.length <= 1) return;
            currentIdx = (currentIdx - 1 + certificates.length) % certificates.length;
            loadImage(currentIdx);
            resetZoom();
        }

        function nextImage() {
            if (certificates.length <= 1) return;
            currentIdx = (currentIdx + 1) % certificates.length;
            loadImage(currentIdx);
            resetZoom();
        }

        // Apply transformation
        function updateTransform() {
            lightboxImgContainer.style.transform = `translate(${translateX}px, ${translateY}px)`;
            lightboxImg.style.transform = `scale(${scale})`;
            
            // Show zoom level indicator temporarily
            showZoomIndicator();
        }

        // Show temporary zoom indicator
        function showZoomIndicator() {
            zoomIndicator.textContent = `${Math.round(scale * 100)}%`;
            zoomIndicator.classList.add('show');
            
            clearTimeout(zoomIndicatorTimeout);
            zoomIndicatorTimeout = setTimeout(() => {
                zoomIndicator.classList.remove('show');
            }, 1200);
        }

        // Reset zoom and pan
        function resetZoom() {
            scale = 1;
            translateX = 0;
            translateY = 0;
            updateTransform();
        }

        // Zoom in
        function zoomIn() {
            if (scale < MAX_SCALE) {
                scale = Math.min(MAX_SCALE, scale + SCALE_STEP);
                updateTransform();
            }
        }

        // Zoom out
        function zoomOut() {
            if (scale > MIN_SCALE) {
                scale = Math.max(MIN_SCALE, scale - SCALE_STEP);
                updateTransform();
            }
        }

        // Button event listeners
        btnClose.addEventListener('click', closeLightbox);
        btnZoomIn.addEventListener('click', zoomIn);
        btnZoomOut.addEventListener('click', zoomOut);
        btnReset.addEventListener('click', resetZoom);
        btnPrev.addEventListener('click', prevImage);
        btnNext.addEventListener('click', nextImage);

        // Click on overlay background to close
        lightbox.addEventListener('click', (e) => {
            // If clicking directly on the backdrop/lightbox/nav buttons but not the image container or toolbar buttons
            if (e.target === lightbox || e.target === document.getElementById('lightbox-content')) {
                closeLightbox();
            }
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                prevImage();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            } else if (e.key === '+' || e.key === '=') {
                zoomIn();
            } else if (e.key === '-') {
                zoomOut();
            }
        });

        // Mouse wheel zoom
        lightboxImgContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY;
            if (delta < 0) {
                // scroll up -> zoom in
                scale = Math.min(MAX_SCALE, scale + 0.1);
            } else {
                // scroll down -> zoom out
                scale = Math.max(MIN_SCALE, scale - 0.1);
            }
            updateTransform();
        }, { passive: false });

        // Drag-to-pan logic
        lightboxImgContainer.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isDragging = true;
            lightboxImgContainer.classList.add('dragging');
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            updateTransform();
        });

        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                lightboxImgContainer.classList.remove('dragging');
            }
        });

        // Touch support for mobile devices
        let touchStartDist = 0;
        let initialScale = 1;
        
        lightboxImgContainer.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                isDragging = true;
                startX = e.touches[0].clientX - translateX;
                startY = e.touches[0].clientY - translateY;
            } else if (e.touches.length === 2) {
                isDragging = false;
                touchStartDist = getTouchDistance(e.touches);
                initialScale = scale;
            }
        });

        lightboxImgContainer.addEventListener('touchmove', (e) => {
            if (isDragging && e.touches.length === 1) {
                e.preventDefault();
                translateX = e.touches[0].clientX - startX;
                translateY = e.touches[0].clientY - startY;
                updateTransform();
            } else if (e.touches.length === 2) {
                e.preventDefault();
                const dist = getTouchDistance(e.touches);
                const factor = dist / touchStartDist;
                scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, initialScale * factor));
                updateTransform();
            }
        }, { passive: false });

        lightboxImgContainer.addEventListener('touchend', (e) => {
            if (e.touches.length === 0) {
                isDragging = false;
            }
        });

        function getTouchDistance(touches) {
            const dx = touches[0].clientX - touches[1].clientX;
            const dy = touches[0].clientY - touches[1].clientY;
            return Math.sqrt(dx * dx + dy * dy);
        }
    }
});

