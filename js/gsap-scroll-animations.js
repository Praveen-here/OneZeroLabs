// GSAP ScrollTrigger Service Animations
document.addEventListener("DOMContentLoaded", () => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Get all service sections
    const services = document.querySelectorAll(".service");

    services.forEach((service, i) => {
        const bg = service.querySelector(".service-bg");
        const content = service.querySelector(".service-content");

        // Debug: Check if elements exist
        if (!bg || !content) {
            console.warn(`Service ${i}: Missing elements`, { bg: !!bg, content: !!content });
            return;
        }

        // Set initial states
        gsap.set(bg, { opacity: 0 });
        gsap.set(content, { opacity: 0, y: 100, filter: "blur(10px)" });

        // Show first service immediately for testing
        if (i === 0) {
            gsap.set(bg, { opacity: 1 });
            gsap.set(content, { opacity: 1, y: 0, filter: "blur(0px)" });
        }

        // Pin the section
        ScrollTrigger.create({
            trigger: service,
            start: "top top",
            end: "bottom top",
            pin: true,
            pinSpacing: false,
            anticipatePin: 1,
        });

        // Background animation
        gsap.to(bg, {
            opacity: 1,
            scrollTrigger: {
                trigger: service,
                start: "top center",
                end: "top top",
                scrub: true,
            }
        });

        // Content slide in animation
        gsap.fromTo(content, 
            { opacity: 0, y: 100, filter: "blur(10px)" },
            {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                scrollTrigger: {
                    trigger: service,
                    start: "top top",
                    end: "center top",
                    scrub: true,
                }
            }
        );

        // Content slide out animation
        gsap.to(content, {
            opacity: 0,
            y: -50,
            filter: "blur(5px)",
            scrollTrigger: {
                trigger: service,
                start: "center top",
                end: "bottom top",
                scrub: true,
            }
        });
    });

    // Refresh ScrollTrigger after setup
    ScrollTrigger.refresh();
});

// Handle window resize
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});

// Optional: Add smooth scrolling enhancement
gsap.registerPlugin(ScrollTrigger);

// Create a smooth scroll effect for better performance
let smoother = ScrollSmoother?.create({
    wrapper: "body",
    content: "body",
    smooth: 1,
    effects: true
});

// Export for potential external use
window.GSAPScrollAnimations = {
    refresh: () => ScrollTrigger.refresh(),
    kill: () => ScrollTrigger.killAll()
};
