// Device Mockup Component
class DeviceMockupController {
    constructor() {
        this.mockupContainer = null;
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupMockups());
        } else {
            this.setupMockups();
        }
    }

    setupMockups() {
        this.mockupContainer = document.getElementById('deviceMockups');
    }

    // Create laptop mockup
    createLaptopMockup(className = '', delay = 0) {
        const mockup = document.createElement('div');
        mockup.className = `device-mockup laptop-mockup ${className}`;
        mockup.style.animationDelay = `${delay}ms`;
        
        mockup.innerHTML = `
            <div class="laptop-screen">
                <div class="laptop-screen-inner">
                    <div class="laptop-screen-content">
                        <div class="laptop-top-bar">
                            <div class="laptop-controls">
                                <div class="laptop-control red"></div>
                                <div class="laptop-control yellow"></div>
                                <div class="laptop-control green"></div>
                            </div>
                            <div class="laptop-title">AGENCY</div>
                        </div>
                        
                        <div class="laptop-main-content">
                            <h3 class="laptop-heading">Crafting Digital</h3>
                            <h3 class="laptop-heading">Experiences</h3>
                            <div class="laptop-graphic"></div>
                        </div>
                        
                        <div class="laptop-bottom-elements">
                            <div class="laptop-grid">
                                <div class="laptop-grid-item"></div>
                                <div class="laptop-grid-item"></div>
                                <div class="laptop-grid-item"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="laptop-keyboard"></div>
        `;
        
        return mockup;
    }

    // Create tablet mockup
    createTabletMockup(className = '', delay = 0) {
        const mockup = document.createElement('div');
        mockup.className = `device-mockup tablet-mockup ${className}`;
        mockup.style.animationDelay = `${delay}ms`;
        
        mockup.innerHTML = `
            <div class="tablet-screen">
                <div class="tablet-content">
                    <div class="tablet-grid">
                        <div class="tablet-grid-item"></div>
                        <div class="tablet-grid-item"></div>
                        <div class="tablet-grid-item"></div>
                        <div class="tablet-grid-item"></div>
                    </div>
                </div>
            </div>
        `;
        
        return mockup;
    }

    // Create phone mockup
    createPhoneMockup(className = '', delay = 0) {
        const mockup = document.createElement('div');
        mockup.className = `device-mockup phone-mockup ${className}`;
        mockup.style.animationDelay = `${delay}ms`;
        
        mockup.innerHTML = `
            <div class="phone-screen">
                <div class="phone-content">
                    <div class="phone-status-bar">
                        <span>9:41</span>
                        <div class="phone-battery"></div>
                    </div>
                    
                    <div class="phone-app-content">
                        <div class="phone-app-item"></div>
                        <div class="phone-app-item"></div>
                        <div class="phone-app-item"></div>
                    </div>
                </div>
            </div>
        `;
        
        return mockup;
    }

    // Create desktop mockup
    createDesktopMockup(className = '', delay = 0) {
        const mockup = document.createElement('div');
        mockup.className = `device-mockup desktop-mockup ${className}`;
        mockup.style.animationDelay = `${delay}ms`;
        
        mockup.innerHTML = `
            <div class="desktop-monitor">
                <div class="desktop-screen">
                    <div class="desktop-content">
                        <div class="desktop-editor">
                            <div class="desktop-controls">
                                <div class="desktop-control red"></div>
                                <div class="desktop-control yellow"></div>
                                <div class="desktop-control green"></div>
                            </div>
                            <div class="desktop-code">
                                <div class="desktop-code-line">&lt;div className="hero"&gt;</div>
                                <div class="desktop-code-line">&lt;h1&gt;OneZeroLabs&lt;/h1&gt;</div>
                                <div class="desktop-code-line">&lt;/div&gt;</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="desktop-stand">
                <div class="desktop-stand-neck"></div>
            </div>
            <div class="desktop-stand-base"></div>
        `;
        
        return mockup;
    }

    // Add mockup to container
    addMockup(type, className = '', delay = 0) {
        if (!this.mockupContainer) return null;

        let mockup;
        
        switch (type) {
            case 'laptop':
                mockup = this.createLaptopMockup(className, delay);
                break;
            case 'tablet':
                mockup = this.createTabletMockup(className, delay);
                break;
            case 'phone':
                mockup = this.createPhoneMockup(className, delay);
                break;
            case 'desktop':
                mockup = this.createDesktopMockup(className, delay);
                break;
            default:
                console.warn(`Unknown device type: ${type}`);
                return null;
        }

        this.mockupContainer.appendChild(mockup);
        
        // Animate in after a short delay
        setTimeout(() => {
            mockup.classList.add('animate-in');
        }, delay + 100);

        return mockup;
    }

    // Show mockup container
    showMockups() {
        if (this.mockupContainer) {
            this.mockupContainer.classList.remove('hidden');
        }
    }

    // Hide mockup container
    hideMockups() {
        if (this.mockupContainer) {
            this.mockupContainer.classList.add('hidden');
        }
    }
}

// Initialize device mockup controller
const deviceMockupController = new DeviceMockupController();

// Export for global use
window.DeviceMockupController = DeviceMockupController;
window.deviceMockupController = deviceMockupController;
