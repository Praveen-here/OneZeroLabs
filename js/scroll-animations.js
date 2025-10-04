// Advanced Service Section Scroll Animations
class ServiceScrollAnimations {
    constructor() {
        this.serviceSections = document.querySelectorAll('.services-section');
        this.currentServiceIndex = -1;
        this.isTransitioning = false;
        this.init();
    }

    init() {
        this.setupServiceSections();
        this.bindScrollEvents();
        this.handleInitialState();
    }

    setupServiceSections() {
        this.serviceSections.forEach((section, index) => {
            const serviceContent = section.querySelector('.service-content');
            const serviceImage = section.querySelector('.services-image');
            
            // Set initial states for images
            if (serviceImage) {
                if (index === 0) {
                    serviceImage.style.opacity = '1';
                } else {
                    serviceImage.style.opacity = '0';
                }
            }
            
            // Set initial states for content
            if (serviceContent) {
                serviceContent.style.opacity = '0';
                serviceContent.style.transform = 'translateY(100px)';
                serviceContent.style.filter = 'blur(10px)';
            }
            
            // Add data attributes for tracking
            section.setAttribute('data-service-index', index);
        });
    }

    bindScrollEvents() {
        let ticking = false;
        let scrollTimeout;
        
        window.addEventListener('scroll', () => {
            // Add scrolling class for performance
            document.body.classList.add('scrolling');
            
            // Clear existing timeout
            clearTimeout(scrollTimeout);
            
            // Remove scrolling class after scroll ends
            scrollTimeout = setTimeout(() => {
                document.body.classList.remove('scrolling');
            }, 150);
            
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    handleScroll() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        this.serviceSections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const serviceContent = section.querySelector('.service-content');
            const serviceImage = section.querySelector('.services-image');
            
            // Calculate section boundaries
            const sectionStart = sectionTop;
            const sectionEnd = sectionTop + sectionHeight;
            
            // Check if section is in viewport
            const isInViewport = scrollY >= sectionStart && scrollY < sectionEnd;
            
            if (isInViewport) {
                // Calculate progress within this section (0 to 1)
                const sectionProgress = (scrollY - sectionStart) / sectionHeight;
                const clampedProgress = Math.max(0, Math.min(1, sectionProgress));
                
                // Show this service image
                if (serviceImage) {
                    serviceImage.style.opacity = '1';
                }
                
                // Hide other service images
                this.serviceSections.forEach((otherSection, otherIndex) => {
                    if (otherIndex !== index) {
                        const otherImage = otherSection.querySelector('.services-image');
                        if (otherImage) {
                            otherImage.style.opacity = '0';
                        }
                    }
                });
                
                // Animate content based on scroll progress
                this.handleContentAnimation(serviceContent, clampedProgress, index);
                
                // Update current service index
                this.currentServiceIndex = index;
            } else {
                // Hide content for sections not in viewport
                if (serviceContent) {
                    serviceContent.style.opacity = '0';
                    serviceContent.style.transform = 'translateY(100px)';
                    serviceContent.style.filter = 'blur(10px)';
                }
            }
        });
    }

    // Remove the handleImageTransition method as it's now handled in handleScroll

    handleContentAnimation(serviceContent, progress, sectionIndex) {
        // Content animation phases:
        // 0.0 - 0.3: Content slides up from bottom with blur
        // 0.3 - 0.7: Content is fully visible and sticky
        // 0.7 - 1.0: Content slides up and fades out
        
        if (progress <= 0.3) {
            // Slide in phase
            const slideProgress = progress / 0.3;
            const translateY = 100 - (slideProgress * 150); // From 100px to -50px
            const opacity = slideProgress;
            const blur = 10 - (slideProgress * 10); // From 10px to 0px
            
            serviceContent.style.transform = `translateY(${translateY}px)`;
            serviceContent.style.opacity = opacity;
            serviceContent.style.filter = `blur(${blur}px)`;
            
            serviceContent.classList.remove('animate-out');
            if (slideProgress > 0.1) {
                serviceContent.classList.add('animate-in');
            }
            
        } else if (progress <= 0.7) {
            // Fully visible and sticky phase - content stays in center
            serviceContent.style.transform = 'translateY(-50%)';
            serviceContent.style.opacity = '1';
            serviceContent.style.filter = 'blur(0px)';
            serviceContent.classList.add('animate-in');
            serviceContent.classList.remove('animate-out');
            
        } else {
            // Slide out phase
            const slideOutProgress = (progress - 0.7) / 0.3;
            const translateY = -50 - (slideOutProgress * 100); // From -50px to -150px
            const opacity = 1 - slideOutProgress;
            const blur = slideOutProgress * 5; // From 0px to 5px
            
            serviceContent.style.transform = `translateY(${translateY}px)`;
            serviceContent.style.opacity = opacity;
            serviceContent.style.filter = `blur(${blur}px)`;
            
            serviceContent.classList.remove('animate-in');
            serviceContent.classList.add('animate-out');
        }
    }

    transitionToService(newIndex) {
        if (this.isTransitioning || newIndex === this.currentServiceIndex) return;
        
        this.isTransitioning = true;
        this.currentServiceIndex = newIndex;
        
        // Reset transition flag after animation completes
        setTimeout(() => {
            this.isTransitioning = false;
        }, 800);
    }

    handleInitialState() {
        // Trigger initial scroll handling
        this.handleScroll();
    }
}

// Enhanced smooth scrolling
class SmoothScrollEnhancer {
    constructor() {
        this.init();
    }

    init() {
        // Add smooth scrolling behavior
        document.documentElement.style.scrollBehavior = 'smooth';
        
        // Optional: Add momentum scrolling for better mobile experience
        document.body.style.webkitOverflowScrolling = 'touch';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other scripts to load
    setTimeout(() => {
        new ServiceScrollAnimations();
        new SmoothScrollEnhancer();
    }, 100);
});

// Handle resize events
window.addEventListener('resize', () => {
    // Reinitialize on resize to recalculate positions
    setTimeout(() => {
        if (window.serviceScrollAnimations) {
            window.serviceScrollAnimations.handleScroll();
        }
    }, 100);
});