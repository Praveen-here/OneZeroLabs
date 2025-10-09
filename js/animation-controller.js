// Animation Controller - Handles all site animations
class AnimationController {
    constructor() {
        this.observedElements = new Set();
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupAnimations());
        } else {
            this.setupAnimations();
        }
    }

    setupAnimations() {
        // Initialize page load animations
        this.initPageLoadAnimations();
        
        // Setup intersection observer for scroll animations
        this.setupScrollAnimations();
        
        // Add hover effects
        this.setupHoverEffects();
        
        // Setup header animations
        this.setupHeaderAnimations();
        
        // Setup dynamic image sizing
        this.setupDynamicImageSizing();
    }

    initPageLoadAnimations() {
        // Add logo glow effect
        const logo = document.querySelector('.logo h1');
        if (logo) {
            setTimeout(() => {
                logo.classList.add('logo-glow');
            }, 1200);
        }

        // Add subtle entrance animations without hiding elements initially
        const heroTitle = document.getElementById('heroTitle');
        const heroSubtitle = document.getElementById('heroSubtitle');
        const heroImage = document.getElementById('heroImage');

        if (heroTitle) {
            setTimeout(() => {
                heroTitle.classList.add('animate-textReveal');
            }, 300);
        }

        if (heroSubtitle) {
            setTimeout(() => {
                heroSubtitle.classList.add('animate-fadeInUp');
            }, 600);
        }

        if (heroImage) {
            setTimeout(() => {
                heroImage.classList.add('animate-fadeInScale');
            }, 900);
        }
    }

    setupScrollAnimations() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.observedElements.has(entry.target)) {
                    entry.target.classList.add('visible');
                    this.observedElements.add(entry.target);
                    
                    // Add special handling for staggered animations
                    if (entry.target.classList.contains('stagger-children')) {
                        this.animateStaggeredChildren(entry.target);
                    }
                }
            });
        }, options);

        // Observe elements for scroll animations
        const animatedElements = document.querySelectorAll([
            '.fade-in-up',
            '.fade-in-left', 
            '.fade-in-right',
            '.fade-in-scale',
            '.slide-in-up',
            '.stagger-children'
        ].join(','));

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    animateStaggeredChildren(parent) {
        const children = Array.from(parent.children);
        children.forEach((child, index) => {
            setTimeout(() => {
                child.style.opacity = '1';
                child.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }

    setupHoverEffects() {
        // Add hover effects to service cards
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.classList.add('hover-float');
            
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
                card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
            });
        });

        // Add hover effects to menu button
        const menuBtn = document.getElementById('menuBtn');
        if (menuBtn) {
            menuBtn.addEventListener('mouseenter', () => {
                menuBtn.style.transform = 'scale(1.05)';
                menuBtn.style.background = '#4b5563';
            });
            
            menuBtn.addEventListener('mouseleave', () => {
                if (!menuBtn.classList.contains('menu-open')) {
                    menuBtn.style.transform = 'scale(1)';
                    menuBtn.style.background = '#37415196';
                }
            });
        }
    }

    setupHeaderAnimations() {
        let lastScrollTop = 0;
        const header = document.getElementById('header');
        const logo = document.querySelector('.logo h1');

        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Keep header background consistent - no changes on scroll
            // Remove parallax effect - keep logo stable
            if (logo) {
                logo.style.transform = 'none';
            }

            lastScrollTop = scrollTop;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // Method to add animation classes to elements
    addScrollAnimation(selector, animationType = 'fade-in-up') {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.classList.add(animationType);
        });
    }

    setupDynamicImageSizing() {
        const heroImage = document.getElementById('heroImage');
        const heroImageContainer = document.getElementById('heroImageContainer');
        const heroImageWrapper = document.querySelector('.hero-image-wrapper');

        if (heroImage && heroImageContainer && heroImageWrapper) {
            // Function to adjust container to image
            const adjustContainerSize = () => {
                // Wait for image to load
                if (heroImage.complete && heroImage.naturalHeight !== 0) {
                    // Calculate aspect ratio
                    const aspectRatio = heroImage.naturalWidth / heroImage.naturalHeight;
                    const containerWidth = heroImageWrapper.offsetWidth;
                    
                    // Set dynamic height based on image aspect ratio
                    const dynamicHeight = containerWidth / aspectRatio;
                    
                    // Apply minimum and maximum constraints
                    const minHeight = window.innerWidth <= 768 ? 200 : 300;
                    const maxHeight = window.innerWidth <= 768 ? 400 : 600;
                    
                    const finalHeight = Math.max(minHeight, Math.min(maxHeight, dynamicHeight));
                    
                    // Apply the calculated height
                    heroImageWrapper.style.height = `${finalHeight}px`;
                    
                    // Ensure image maintains aspect ratio
                    heroImage.style.width = '100%';
                    heroImage.style.height = '100%';
                    heroImage.style.objectFit = 'contain';
                } else {
                    // Retry when image loads
                    heroImage.addEventListener('load', adjustContainerSize, { once: true });
                }
            };

            // Initial adjustment
            adjustContainerSize();

            // Adjust on window resize
            window.addEventListener('resize', adjustContainerSize);

            // Handle image changes (if image src changes dynamically)
            const imageObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                        // Reset and recalculate when image source changes
                        heroImage.addEventListener('load', adjustContainerSize, { once: true });
                    }
                });
            });

            imageObserver.observe(heroImage, {
                attributes: true,
                attributeFilter: ['src']
            });
        }
    }

    // Method to trigger custom animations
    triggerAnimation(element, animationClass) {
        if (element) {
            element.classList.add(animationClass);
        }
    }
}

// Initialize animation controller
const animationController = new AnimationController();

// Export for use in other scripts
window.AnimationController = AnimationController;