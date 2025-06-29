// Modern Gallery JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize audio autoplay
    initAudioPlayer();
    
    // Gallery elements
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.querySelector('#lightbox-image');
    const closeBtn = document.getElementById('close-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const counter = document.getElementById('counter');
    
    // Gallery state
    let currentImageIndex = 0;
    const images = Array.from(galleryItems).map(item => {
        // Support for both img and picture elements
        const picture = item.querySelector('picture');
        const img = item.querySelector('img');
        
        if (picture) {
            const source = picture.querySelector('source[srcset]');
            return {
                src: source ? source.srcset : img.src,
                fallback: img.src,
                alt: img.alt
            };
        } else {
            return {
                src: img.src,
                fallback: img.src,
                alt: img.alt
            };
        }
    });
    
    // Initialize gallery
    initGallery();
    
    function initGallery() {
        // Add click event to gallery items
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
            
            // Add keyboard support
            item.setAttribute('tabindex', '0');
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(index);
                }
            });
        });
        
        // Enhanced lightbox event listeners
        closeBtn.addEventListener('click', closeLightbox);
        closeBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            closeLightbox();
        });
        
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);
        
        // Close lightbox when clicking overlay
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // Enhanced touch support for mobile
        lightbox.addEventListener('touchend', (e) => {
            if (e.target === lightbox) {
                e.preventDefault();
                closeLightbox();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', handleKeyboard);
        
        // Touch/swipe support
        addTouchSupport();
        
        // Lazy loading
        addLazyLoading();
    }
    
    function openLightbox(index) {
        currentImageIndex = index;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Force close button visibility
        setTimeout(() => {
            const closeButton = document.getElementById('close-btn');
            if (closeButton) {
                closeButton.style.cssText = `
                    position: fixed !important;
                    top: 20px !important;
                    right: 20px !important;
                    z-index: 999999 !important;
                    opacity: 1 !important;
                    visibility: visible !important;
                    display: flex !important;
                    pointer-events: auto !important;
                    background: rgba(255, 107, 157, 0.95) !important;
                    color: white !important;
                    width: 50px !important;
                    height: 50px !important;
                    border-radius: 50% !important;
                    font-size: 28px !important;
                    align-items: center !important;
                    justify-content: center !important;
                    border: 2px solid rgba(255, 255, 255, 0.4) !important;
                    backdrop-filter: blur(10px) !important;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4) !important;
                    cursor: pointer !important;
                `;
                
                // Mobile specific
                if (window.innerWidth <= 768) {
                    closeButton.style.cssText += `
                        width: 60px !important;
                        height: 60px !important;
                        font-size: 32px !important;
                        top: 15px !important;
                        right: 15px !important;
                    `;
                }
            }
        }, 50);
        
        updateLightboxImage();
        
        // Add entrance animation
        lightboxImage.style.opacity = '0';
        lightboxImage.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            lightboxImage.style.opacity = '1';
            lightboxImage.style.transform = 'scale(1)';
        }, 50);
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateLightboxImage();
    }
    
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateLightboxImage();
    }
    
    function updateLightboxImage() {
        const currentImage = images[currentImageIndex];
        lightboxImage.src = currentImage.src;
        lightboxImage.alt = currentImage.alt;
        counter.textContent = `${currentImageIndex + 1} / ${images.length}`;
        
        // Add slide animation
        lightboxImage.style.opacity = '0';
        setTimeout(() => {
            lightboxImage.style.opacity = '1';
        }, 150);
    }
    
    function handleKeyboard(e) {
        if (!lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPrevImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    }
    
    function addTouchSupport() {
        let touchStartX = 0;
        let touchEndX = 0;
        
        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        lightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const swipeDistance = touchEndX - touchStartX;
            
            if (Math.abs(swipeDistance) > swipeThreshold) {
                if (swipeDistance > 0) {
                    showPrevImage();
                } else {
                    showNextImage();
                }
            }
        }
    }
    
    function addLazyLoading() {
        const images = document.querySelectorAll('.gallery-item img');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.style.opacity = '1';
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
            imageObserver.observe(img);
        });
    }
    
    // Add hover effects and animations
    function addHoverEffects() {
        galleryItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    // Initialize hover effects
    addHoverEffects();
    
    // Parallax effect for background
    function addParallaxEffect() {
        const bgEffects = document.querySelector('.bg-effects');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            bgEffects.style.transform = `translateY(${rate}px)`;
        });
    }
    
    // Initialize parallax
    addParallaxEffect();
    
    // Smooth reveal animation on scroll
    function addScrollReveal() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        galleryItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(item);
        });
    }
    
    // Initialize scroll reveal
    addScrollReveal();
    
    // Performance optimization
    function optimizePerformance() {
        // Debounce scroll events
        let ticking = false;
        
        function updateOnScroll() {
            addParallaxEffect();
            ticking = false;
        }
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateOnScroll);
                ticking = true;
            }
        });
    }
    
    // Initialize performance optimizations
    optimizePerformance();
    
    // Add loading states
    function addLoadingStates() {
        const images = document.querySelectorAll('.gallery-item img');
        
        images.forEach(img => {
            const container = img.closest('.gallery-item');
            container.classList.add('loading');
            
            img.addEventListener('load', () => {
                container.classList.remove('loading');
            });
            
            img.addEventListener('error', () => {
                container.classList.remove('loading');
                container.style.opacity = '0.5';
            });
        });
    }
    
    // Initialize loading states
    addLoadingStates();
    
    console.log('🌸 Gallery initialized successfully! ✨');
});

// Add custom cursor effect
document.addEventListener('mousemove', (e) => {
    // Create sparkle effect occasionally
    if (Math.random() < 0.02) {
        createSparkle(e.clientX, e.clientY);
    }
});

function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.innerHTML = '✨';
    sparkle.style.position = 'fixed';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.fontSize = '12px';
    sparkle.style.zIndex = '10000';
    sparkle.style.animation = 'sparkleAnimation 1s ease-out forwards';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        if (sparkle.parentNode) {
            sparkle.parentNode.removeChild(sparkle);
        }
    }, 1000);
}

// Add sparkle animation CSS
const style = document.createElement('style');
style.textContent = `
@keyframes sparkleAnimation {
    0% {
        opacity: 0;
        transform: scale(0) rotate(0deg);
    }
    50% {
        opacity: 1;
        transform: scale(1) rotate(180deg);
    }
    100% {
        opacity: 0;
        transform: scale(0) rotate(360deg);
    }
}
`;
document.head.appendChild(style);

function initAudioPlayer() {
    const audio = document.getElementById('bgMusic');
    
    // Try to autoplay
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            console.log('🎵 Music started automatically!');
        }).catch(error => {
            console.log('🎵 Autoplay blocked by browser. User interaction needed.');
            
            // Add click listener to start music on first user interaction
            const startMusicOnInteraction = () => {
                audio.play().then(() => {
                    console.log('🎵 Music started after user interaction!');
                }).catch(err => {
                    console.log('🎵 Music failed to start:', err);
                });
                
                // Remove listeners after first interaction
                document.removeEventListener('click', startMusicOnInteraction);
                document.removeEventListener('keydown', startMusicOnInteraction);
                document.removeEventListener('touchstart', startMusicOnInteraction);
            };
            
            // Listen for various user interactions
            document.addEventListener('click', startMusicOnInteraction);
            document.addEventListener('keydown', startMusicOnInteraction);
            document.addEventListener('touchstart', startMusicOnInteraction);
        });
    }
    
    // Volume control
    audio.volume = 0.7; // Set to 70% volume
    
    // Add fade in effect
    audio.addEventListener('loadeddata', () => {
        audio.volume = 0;
        let vol = 0;
        const fadeIn = setInterval(() => {
            if (vol < 0.7) {
                vol += 0.05;
                audio.volume = vol;
            } else {
                clearInterval(fadeIn);
            }
        }, 100);
    });
}
