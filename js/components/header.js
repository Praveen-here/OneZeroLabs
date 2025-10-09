// Header Component Controller
class HeaderController {
    constructor() {
        this.header = null;
        this.menuBtn = null;
        this.menuOverlay = null;
        this.isMenuOpen = false;
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupHeader());
        } else {
            this.setupHeader();
        }
    }

    setupHeader() {
        this.header = document.getElementById('header');
        this.menuBtn = document.getElementById('menuBtn');
        this.menuOverlay = document.getElementById('menuOverlay');
        
        if (this.menuBtn) {
            this.menuBtn.addEventListener('click', () => this.toggleMenu());
        }

        // Close menu when clicking on menu links
        if (this.menuOverlay) {
            const menuLinks = this.menuOverlay.querySelectorAll('.menu-link, .menu-heading-link');
            menuLinks.forEach(link => {
                link.addEventListener('click', () => this.closeMenu());
            });
        }

        // Setup scroll effects
        this.setupScrollEffects();
        
        // Setup resize handler
        this.setupResizeHandler();
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        
        if (this.isMenuOpen) {
            this.openMenu();
        } else {
            this.closeMenu();
        }
    }

    openMenu() {
        if (this.menuBtn) {
            this.menuBtn.textContent = '✕';
            this.menuBtn.classList.add('menu-open');
        }
        
        if (this.menuOverlay) {
            this.menuOverlay.classList.add('active');
            // Prevent body scroll when menu is open
            document.body.style.overflow = 'hidden';
        }
    }

    closeMenu() {
        this.isMenuOpen = false;
        
        if (this.menuBtn) {
            this.menuBtn.textContent = 'Menu';
            this.menuBtn.classList.remove('menu-open');
        }
        
        if (this.menuOverlay) {
            this.menuOverlay.classList.remove('active');
            // Restore body scroll
            document.body.style.overflow = '';
        }
    }

    setupScrollEffects() {
        let lastScrollTop = 0;
        let scrollTimeout;

        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add scroll-based header styling
            if (scrollTop > 50) {
                this.header?.classList.add('scrolled');
            } else {
                this.header?.classList.remove('scrolled');
            }

            // Header stays visible - hide/show behavior removed

            lastScrollTop = scrollTop;

            // Clear timeout
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.header?.classList.remove('scrolling');
            }, 150);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    setupResizeHandler() {
        const handleResize = () => {
            // Close menu on resize if open
            if (this.isMenuOpen && window.innerWidth > 768) {
                this.closeMenu();
            }
        };

        window.addEventListener('resize', handleResize);
    }
}

// Additional header styles for scroll effects
const headerScrollStyles = `
    .header.scrolled {
        background: transparent;
    }

    .header {
        transition: background 0.3s ease;
    }

    .menu-btn.menu-open {
        background: #ef4444;
    }

    .menu-btn.menu-open:hover {
        background: #dc2626;
    }
`;

// Inject scroll styles
const style = document.createElement('style');
style.textContent = headerScrollStyles;
document.head.appendChild(style);

// Initialize header controller
const headerController = new HeaderController();

// Export for global use
window.HeaderController = HeaderController;
window.headerController = headerController;
