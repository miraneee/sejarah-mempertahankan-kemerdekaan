// Diplomacy Page JavaScript

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeDiplomacyPage();
});

function initializeDiplomacyPage() {
    // Initialize tab functionality
    initializeTabs();
    
    // Initialize animations
    initializeAnimations();
    
    // Initialize interactive effects
    initializeInteractiveEffects();
    
    // Initialize scroll effects
    initializeScrollEffects();
}

// Tab Functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked button and corresponding panel
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            // Add animation effect
            const activePanel = document.getElementById(targetTab);
            activePanel.style.opacity = '0';
            activePanel.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                activePanel.style.opacity = '1';
                activePanel.style.transform = 'translateY(0)';
            }, 50);
        });
    });
}

// Animation Initialization
function initializeAnimations() {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100
        });
    }
    
    // Timeline animation on scroll
    initializeTimelineAnimation();
    
    // Diplomat cards hover effects
    initializeDiplomatCards();
}

// Timeline Animation
function initializeTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, observerOptions);
    
    timelineItems.forEach((item, index) => {
        // Set initial state
        item.style.opacity = '0';
        item.style.transition = 'all 0.8s ease';
        
        // Alternate animation direction
        if (index % 2 === 0) {
            item.style.transform = 'translateX(-50px)';
        } else {
            item.style.transform = 'translateX(50px)';
        }
        
        timelineObserver.observe(item);
    });
}

// Diplomat Cards Interactive Effects
function initializeDiplomatCards() {
    const diplomatCards = document.querySelectorAll('.diplomat-card');
    
    diplomatCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            
            // Add glow effect
            this.style.boxShadow = '0 20px 40px rgba(220, 20, 60, 0.15), 0 0 0 1px rgba(220, 20, 60, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
        
        // Click effect for mobile
        card.addEventListener('click', function() {
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 200);
        });
    });
}

// Interactive Effects
function initializeInteractiveEffects() {
    // Highlight items hover effects
    const highlightItems = document.querySelectorAll('.highlight-item');
    
    highlightItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.highlight-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.highlight-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
    
    // Agreement cards interactive effects
    const agreementCards = document.querySelectorAll('.agreement-card');
    
    agreementCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.agreement-icon');
            if (icon) {
                icon.style.transform = 'scale(1.05)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.agreement-icon');
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
        });
    });
    
    // Navigation cards effects
    const navCards = document.querySelectorAll('.nav-card');
    
    navCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.nav-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.nav-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
}

// Scroll Effects
function initializeScrollEffects() {
    // Parallax effect for hero section
    const hero = document.querySelector('.page-hero');
    
    if (hero) {
        window.addEventListener('scroll', throttle(() => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            if (scrolled < hero.offsetHeight) {
                hero.style.transform = `translateY(${rate}px)`;
            }
        }, 16));
    }
    
    // Timeline progress indicator
    initializeTimelineProgress();
}

// Timeline Progress Indicator
function initializeTimelineProgress() {
    const timeline = document.querySelector('.timeline-container');
    const timelineLine = document.querySelector('.timeline-container::before');
    
    if (timeline) {
        window.addEventListener('scroll', throttle(() => {
            const timelineRect = timeline.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Calculate progress
            const timelineTop = timelineRect.top;
            const timelineHeight = timelineRect.height;
            const progress = Math.max(0, Math.min(1, (windowHeight - timelineTop) / timelineHeight));
            
            // Update timeline line (this would require additional CSS for the effect)
            timeline.style.setProperty('--timeline-progress', `${progress * 100}%`);
        }, 16));
    }
}

// Utility Functions
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add CSS for clicked effect
const style = document.createElement('style');
style.textContent = `
    .diplomat-card.clicked {
        transform: translateY(-5px) scale(0.98) !important;
        transition: transform 0.1s ease !important;
    }
    
    .highlight-icon {
        transition: transform 0.3s ease;
    }
    
    .agreement-icon {
        transition: transform 0.3s ease;
    }
    
    .nav-icon {
        transition: transform 0.3s ease;
    }
    
    /* Timeline progress effect */
    .timeline-container {
        --timeline-progress: 0%;
    }
    
    .timeline-container::before {
        background: linear-gradient(
            to bottom,
            var(--primary-color) 0%,
            var(--primary-color) var(--timeline-progress),
            rgba(220, 20, 60, 0.3) var(--timeline-progress),
            rgba(220, 20, 60, 0.3) 100%
        );
    }
`;
document.head.appendChild(style);

// Export functions for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeDiplomacyPage,
        initializeTabs,
        initializeAnimations,
        throttle,
        debounce
    };
}