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
            
            if (header) {
                if (scrollTop > 100) {
                    header.style.background = 'rgba(0, 0, 0, 0.9)';
                    header.style.backdropFilter = 'blur(10px)';
                } else {
                    header.style.background = 'transparent';
                    header.style.backdropFilter = 'none';
                }
            }

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