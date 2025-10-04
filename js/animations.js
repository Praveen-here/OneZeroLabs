// Animation Controller
class AnimationController {
    constructor() {
        this.initialized = false;
        this.observers = new Map();
        this.init();
    }

    init() {
        if (this.initialized) return;
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupAnimations());
        } else {
            this.setupAnimations();
        }
        
        this.initialized = true;
    }

    setupAnimations() {
        // Setup hero animations
        this.setupHeroAnimations();
        
        // Setup intersection observer for scroll animations
        this.setupScrollAnimations();
        
        // Setup device mockup animations
        this.setupDeviceAnimations();
    }

    setupHeroAnimations() {
        // Hero text animation
        const heroText = document.getElementById('heroText');
        const heroTitle = document.getElementById('heroTitle');
        const heroSubtitle = document.getElementById('heroSubtitle');
        const heroImageContainer = document.getElementById('heroImageContainer');

        if (heroText) {
            setTimeout(() => {
                heroText.classList.add('animate-fadeInUp');
            }, 100);
        }

        if (heroTitle) {
            setTimeout(() => {
                heroTitle.classList.add('animate-fadeInUp-delay-200');
            }, 200);
        }

        if (heroSubtitle) {
            setTimeout(() => {
                heroSubtitle.classList.add('animate-fadeInUp-delay-400');
            }, 400);
        }

        if (heroImageContainer) {
            setTimeout(() => {
                heroImageContainer.classList.add('animate-slideInUp');
            }, 600);
        }
    }

    setupScrollAnimations() {
        // Create intersection observer for scroll-triggered animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe elements with fade-in classes
        const fadeInElements = document.querySelectorAll('.fade-in-up, .slide-in-up');
        fadeInElements.forEach(el => observer.observe(el));

        this.observers.set('scroll', observer);
    }

    setupDeviceAnimations() {
        // Device mockup animations with staggered delays
        const deviceMockups = document.querySelectorAll('.device-mockup');
        
        deviceMockups.forEach((mockup, index) => {
            const delay = index * 200; // Stagger by 200ms
            
            setTimeout(() => {
                mockup.classList.add('animate-device');
                mockup.style.animationDelay = `${delay}ms`;
            }, delay);
        });
    }

    // Method to animate elements on demand
    animateElement(element, animationType = 'fadeInUp', delay = 0) {
        if (!element) return;
        
        setTimeout(() => {
            element.classList.add(`animate-${animationType}`);
        }, delay);
    }

    // Method to create staggered animations
    staggeredAnimation(elements, animationType = 'fadeInUp', staggerDelay = 100) {
        if (!elements || elements.length === 0) return;
        
        elements.forEach((element, index) => {
            const delay = index * staggerDelay;
            this.animateElement(element, animationType, delay);
        });
    }

    // Cleanup method
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        this.initialized = false;
    }
}

// Initialize animations when script loads
const animationController = new AnimationController();

// Export for use in other scripts
window.AnimationController = AnimationController;
window.animationController = animationController;
