// GSAP ScrollTrigger Service Animations - Fixed Implementation
document.addEventListener("DOMContentLoaded", () => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Get all service sections
    const services = document.querySelectorAll(".service");
    
    if (services.length === 0) {
        console.warn("No service sections found");
        return;
    }

    // Initialize all service backgrounds and content
    services.forEach((service, i) => {
        const bg = service.querySelector(".service-bg");
        const content = service.querySelector(".service-content");
        
        if (!bg || !content) {
            console.warn(`Service ${i}: Missing bg or content`);
            return;
        }

        // Set initial states
        gsap.set(bg, { 
            opacity: i === 0 ? 1 : 0,
            scale: 1,
            zIndex: i === 0 ? 2 : 1, // First service starts on top
            y: 0, // Ensure no vertical offset
            x: 0, // Ensure no horizontal offset
            transform: "translateZ(0)" // Force hardware acceleration, no other transforms
        });
        
        gsap.set(content, { 
            opacity: 0, 
            y: 100, 
            filter: "blur(10px)"
        });
    });

    // Initialize footer to be completely hidden
    const footer = document.querySelector('.footer-contact');
    if (footer) {
        gsap.set(footer, { 
            opacity: 0,
            zIndex: 99
        });
    }

    // Create individual ScrollTriggers for each service
    services.forEach((service, i) => {
        const bg = service.querySelector(".service-bg");
        const content = service.querySelector(".service-content");
        const nextService = services[i + 1];
        const nextBg = nextService ? nextService.querySelector(".service-bg") : null;
        
        if (!bg || !content) return;

        // Pin each service section with smooth unpinning
        const isLastService = i === services.length - 1;
        
        ScrollTrigger.create({
            trigger: service,
            start: "top top",
            end: "bottom top", // Keep consistent end point for proper pinning
            pin: true,
            pinSpacing: false, // Keep false for consistent behavior
            anticipatePin: 1,
            refreshPriority: -1,
            id: `pin-service-${i}`,
            onRefresh: () => {
                gsap.set(service, { clearProps: "transform" });
            }
        });

        // Single unified content animation timeline
        const contentTl = gsap.timeline({
            scrollTrigger: {
                trigger: service,
                start: "top top",
                end: "bottom top",
                scrub: 0.5, // Much smoother scrubbing
                ease: "power1.out",
                id: `content-${i}`,
                smoothChildTiming: true, // Smoother timeline playback
                onUpdate: (self) => {
                    // Debug: Track content animation progress
                    if (i === 0) { // Only log for first service to avoid spam
                        console.log(`Service ${i} content progress: ${(self.progress * 100).toFixed(1)}%`);
                    }
                }
            }
        });

        // Content slides in (0% to 25% of section)
        contentTl.fromTo(content, 
            {
                opacity: 0,
                y: 100,
                filter: "blur(10px)"
            },
            {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.25,
                ease: "power1.out" // Smoother ease
            }
        )
        // Content stays visible (25% to 45% of section)
        .to({}, { duration: 0.2 })
        // Content moves to top while staying visible (45% to 75% of section)
        .to(content, {
            y: -300, // Move content to top of screen
            duration: 0.3,
            ease: "none" // Linear movement for smooth scrolling
        })
        // Content fades out only after reaching top (75% to 100% of section)  
        .to(content, {
            opacity: 0,
            filter: "blur(8px)",
            duration: 0.25,
            ease: "power1.in" // Gentler fade
        });

        // Background crossfade - smooth transition for all services
        if (i < services.length - 1) {
            ScrollTrigger.create({
                trigger: service,
                start: "95% top", // Start very late - only after content has scrolled to top
                end: "bottom top",
                scrub: 0.5, // Same smooth scrub as footer transition
                ease: "power1.inOut",
                onUpdate: (self) => {
                    const progress = self.progress;
                    
                    // Two-phase transition for smooth crossfade
                    if (progress < 0.6) {
                        // Phase 1: Current service fades out first (0% to 60%)
                        const fadeOutProgress = progress / 0.6;
                        gsap.set(bg, { opacity: 1 - fadeOutProgress });
                        
                        // Next service stays hidden during fade-out
                        if (nextBg) {
                            gsap.set(nextBg, { 
                                opacity: 0,
                                zIndex: 1
                            });
                        }
                    } else {
                        // Phase 2: Next service fades in after current is gone (60% to 100%)
                        const fadeInProgress = (progress - 0.6) / 0.4;
                        gsap.set(bg, { opacity: 0 }); // Current service completely gone
                        
                        // Next service fades in smoothly
                        if (nextBg) {
                            gsap.set(nextBg, { 
                                opacity: fadeInProgress,
                                zIndex: 2 // Bring to front
                            });
                        }
                    }
                    
                    // Debug background transition
                    if (i === 0) {
                        console.log(`Service ${i} to ${i+1} transition: ${(progress * 100).toFixed(1)}%`);
                    }
                },
                id: `bg-crossfade-${i}`
            });
        } else {
            // Special handling for the last service - footer transition
            const footer = document.querySelector('.footer-contact');
            
            ScrollTrigger.create({
                trigger: service,
                start: "95% top", // Start very late - only after content has scrolled to top
                end: "bottom top",
                scrub: 0.5, // Same smooth scrub as other service transitions
                ease: "power1.inOut",
                onUpdate: (self) => {
                    const progress = self.progress;
                    
                    // Fade out last service background
                    gsap.set(bg, { opacity: 1 - progress });
                    
                    // Fade in footer with same crossfade timing as services
                    if (footer) {
                        gsap.set(footer, { 
                            opacity: progress,
                            zIndex: progress > 0.1 ? 101 : 99 // Bring footer to front when visible
                        });
                    }
                    
                    // Debug footer transition
                    console.log(`Service ${i} to footer transition: ${(progress * 100).toFixed(1)}%`);
                },
                id: `last-service-footer-transition-${i}`
            });
        }

        // Add smooth unpinning helper (except for last service)
        if (!isLastService) {
            ScrollTrigger.create({
                trigger: service,
                start: "bottom top",
                end: "bottom top",
                onEnter: () => {
                    // Ensure clean state when unpinning
                    gsap.set(service, { 
                        transform: "translateY(0px)",
                        willChange: "auto"
                    });
                },
                id: `unpin-helper-${i}`
            });
        }
    });

    // Debug info
    console.log(`Initialized ${services.length} service sections with ScrollTrigger`);

    // Refresh ScrollTrigger after setup
    ScrollTrigger.refresh();
});

// Handle window resize
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});

// Configure ScrollTrigger for smooth performance
ScrollTrigger.config({
    limitCallbacks: true, // Limit callbacks for better performance
    syncInterval: 150 // Sync every 150ms for smoother animations
});

// Force a ScrollTrigger refresh after initialization for smooth operation
gsap.delayedCall(0.2, () => {
    ScrollTrigger.refresh();
    console.log("ScrollTrigger refreshed for smooth operation");
});

// Export for potential external use
window.GSAPScrollAnimations = {
    refresh: () => ScrollTrigger.refresh(),
    kill: () => ScrollTrigger.killAll()
};