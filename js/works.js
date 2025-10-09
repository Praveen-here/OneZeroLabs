// Works Page JavaScript - Handles project loading and display

class WorksController {
    constructor() {
        this.projects = {};
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupWorks());
        } else {
            this.setupWorks();
        }
    }

    async setupWorks() {
        try {
            // Load projects data
            await this.loadProjects();
            
            // Render all project sections
            this.renderAllProjects();
            
            // Setup animations
            this.setupAnimations();
            
            // Setup interactions
            this.setupInteractions();
            
        } catch (error) {
            console.error('Error setting up works page:', error);
            this.showErrorState();
        }
    }

    async loadProjects() {
        try {
            const response = await fetch('data/projects.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.projects = data.projects;
            
            console.log('Projects loaded successfully:', this.projects);
        } catch (error) {
            console.error('Error loading projects:', error);
            throw error;
        }
    }

    renderAllProjects() {
        // Render each category
        this.renderProjectCategory('webDevelopment', 'webDevelopmentGrid');
        this.renderProjectCategory('uiuxDesign', 'uiuxDesignGrid');
        this.renderProjectCategory('graphicDesign', 'graphicDesignGrid');
        this.renderProjectCategory('seoOptimization', 'seoOptimizationGrid');
    }

    renderProjectCategory(categoryKey, gridId) {
        const grid = document.getElementById(gridId);
        const projects = this.projects[categoryKey];

        if (!grid || !projects) {
            console.warn(`Grid ${gridId} or projects for ${categoryKey} not found`);
            return;
        }

        // Clear loading state
        grid.innerHTML = '';
        
        // Add stagger animation class
        grid.classList.add('stagger-children');

        // Render each project
        projects.forEach((project, index) => {
            const projectCard = this.createProjectCard(project, index);
            grid.appendChild(projectCard);
        });
    }

    createProjectCard(project, index) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.dataset.projectId = project.id;

        // Create image element
        const imageHtml = this.createProjectImage(project);
        
        card.innerHTML = `
            ${imageHtml}
            <div class="project-category">${project.category}</div>
            <div class="project-content">
                <h3 class="project-name">${project.name}</h3>
                <p class="project-description">${project.description}</p>
            </div>
        `;

        // Add click handler
        card.addEventListener('click', () => this.handleProjectClick(project));

        return card;
    }

    createProjectImage(project) {
        // For now, create a placeholder since images might not exist
        // In a real project, you would handle image loading properly
        return `
            <div class="project-image">
                <div class="project-image-placeholder">
                    ${this.getProjectIcon(project.category)}
                </div>
            </div>
        `;
    }

    getProjectIcon(category) {
        const icons = {
            'Web Development': '💻',
            'UI/UX Design': '🎨',
            'Graphic Design': '✨',
            'SEO Optimization': '📈'
        };
        return icons[category] || '🔹';
    }

    handleProjectClick(project) {
        // For now, just log the project
        // In a real implementation, you might open a modal or navigate to a detail page
        console.log('Project clicked:', project);
        
        // You could implement:
        // - Modal with project details
        // - Navigation to project detail page
        // - Lightbox with more images
        
        // Example: Simple alert for demonstration
        alert(`Project: ${project.name}\n\nCategory: ${project.category}\n\nDescription: ${project.description}`);
    }

    setupAnimations() {
        // Setup intersection observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Handle staggered animations for project grids
                    if (entry.target.classList.contains('stagger-children')) {
                        this.animateStaggeredChildren(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe all animatable elements
        const animatableElements = document.querySelectorAll('.fade-in-up, .stagger-children');
        animatableElements.forEach(el => observer.observe(el));
    }

    animateStaggeredChildren(container) {
        // Add visible class with a slight delay to trigger staggered animation
        setTimeout(() => {
            container.classList.add('visible');
        }, 100);
    }

    setupInteractions() {
        // Setup smooth scrolling for section navigation if needed
        this.setupSmoothScrolling();
        
        // Setup any other interactions
        this.setupHoverEffects();
    }

    setupSmoothScrolling() {
        // Handle any anchor links for smooth scrolling
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupHoverEffects() {
        // Add any additional hover effects that can't be done with CSS alone
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                // Add any JavaScript-based hover effects here
                card.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    showErrorState() {
        // Show error state if data loading fails
        const grids = ['webDevelopmentGrid', 'uiuxDesignGrid', 'graphicDesignGrid', 'seoOptimizationGrid'];
        
        grids.forEach(gridId => {
            const grid = document.getElementById(gridId);
            if (grid) {
                grid.innerHTML = `
                    <div class="projects-error">
                        <p>Sorry, we couldn't load the projects at this time.</p>
                        <button onclick="location.reload()" class="retry-btn">Try Again</button>
                    </div>
                `;
            }
        });
    }

    showLoadingState() {
        // Show loading state while data is being fetched
        const grids = ['webDevelopmentGrid', 'uiuxDesignGrid', 'graphicDesignGrid', 'seoOptimizationGrid'];
        
        grids.forEach(gridId => {
            const grid = document.getElementById(gridId);
            if (grid) {
                grid.innerHTML = `
                    <div class="projects-loading">
                        <div class="loading-spinner"></div>
                        <p>Loading projects...</p>
                    </div>
                `;
            }
        });
    }
}

// Initialize the works controller
const worksController = new WorksController();

// Export for use in other scripts if needed
window.WorksController = WorksController;