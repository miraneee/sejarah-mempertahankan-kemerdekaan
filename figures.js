// Key Figures Page JavaScript

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeFiguresPage();
});

function initializeFiguresPage() {
    // Initialize filtering system
    initializeFiltering();
    
    // Initialize card interactions
    initializeCardInteractions();
    
    // Initialize animations
    initializeAnimations();
    
    // Initialize timeline effects
    initializeTimelineEffects();
    
    // Initialize mobile interactions
    initializeMobileInteractions();
}

// Filtering System
function initializeFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const figureCards = document.querySelectorAll('.figure-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter cards with animation
            filterCards(figureCards, category);
        });
    });
}

function filterCards(cards, category) {
    cards.forEach((card, index) => {
        const cardCategory = card.getAttribute('data-category');
        const shouldShow = category === 'all' || cardCategory === category;
        
        if (shouldShow) {
            // Show card with delay for stagger effect
            setTimeout(() => {
                card.classList.remove('hidden');
                card.classList.add('show');
            }, index * 100);
        } else {
            // Hide card immediately
            card.classList.add('hidden');
            card.classList.remove('show');
        }
    });
}

// Card Interactions
function initializeCardInteractions() {
    const figureCards = document.querySelectorAll('.figure-card');
    
    figureCards.forEach(card => {
        const cardInner = card.querySelector('.card-inner');
        
        // Desktop hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
        
        // Click interaction for mobile
        card.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                this.classList.toggle('flipped');
            }
        });
        
        // Prevent card flip when clicking on interactive elements
        const interactiveElements = card.querySelectorAll('button, a, input');
        interactiveElements.forEach(element => {
            element.addEventListener('click', function(e) {
                e.stopPropagation();
            });
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
    
    // Initialize card entrance animations
    initializeCardAnimations();
    
    // Initialize scroll-triggered effects
    initializeScrollEffects();
}

// Card Animations
function initializeCardAnimations() {
    const cards = document.querySelectorAll('.figure-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
            }
        });
    }, observerOptions);
    
    cards.forEach((card, index) => {
        // Set initial state
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px) scale(0.9)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        
        cardObserver.observe(card);
    });
}

// Timeline Effects
function initializeTimelineEffects() {
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
                
                // Animate figure tags
                const figureTags = entry.target.querySelectorAll('.figure-tag');
                figureTags.forEach((tag, index) => {
                    setTimeout(() => {
                        tag.style.opacity = '1';
                        tag.style.transform = 'translateY(0) scale(1)';
                    }, index * 100);
                });
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
        
        // Set initial state for figure tags
        const figureTags = item.querySelectorAll('.figure-tag');
        figureTags.forEach(tag => {
            tag.style.opacity = '0';
            tag.style.transform = 'translateY(10px) scale(0.9)';
            tag.style.transition = 'all 0.3s ease';
        });
        
        timelineObserver.observe(item);
    });
}

// Scroll Effects
function initializeScrollEffects() {
    // Parallax effect for hero section
    const hero = document.querySelector('.page-hero');
    
    if (hero) {
        window.addEventListener('scroll', throttle(() => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;
            
            if (scrolled < hero.offsetHeight) {
                hero.style.transform = `translateY(${rate}px)`;
            }
        }, 16));
    }
    
    // Timeline progress effect
    initializeTimelineProgress();
    
    // Card reveal on scroll
    initializeCardReveal();
}

// Timeline Progress
function initializeTimelineProgress() {
    const timeline = document.querySelector('.timeline-container');
    
    if (timeline) {
        window.addEventListener('scroll', throttle(() => {
            const timelineRect = timeline.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Calculate progress
            const timelineTop = timelineRect.top;
            const timelineHeight = timelineRect.height;
            const progress = Math.max(0, Math.min(1, (windowHeight - timelineTop) / timelineHeight));
            
            // Update CSS custom property for timeline progress
            timeline.style.setProperty('--timeline-progress', `${progress * 100}%`);
        }, 16));
    }
}

// Card Reveal Effect
function initializeCardReveal() {
    const cards = document.querySelectorAll('.figure-card');
    
    window.addEventListener('scroll', throttle(() => {
        cards.forEach(card => {
            const cardRect = card.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (cardRect.top < windowHeight * 0.8) {
                card.classList.add('revealed');
            }
        });
    }, 100));
}

// Mobile Interactions
function initializeMobileInteractions() {
    // Touch events for better mobile experience
    if ('ontouchstart' in window) {
        const cards = document.querySelectorAll('.figure-card');
        
        cards.forEach(card => {
            let touchStartTime = 0;
            
            card.addEventListener('touchstart', function(e) {
                touchStartTime = Date.now();
            });
            
            card.addEventListener('touchend', function(e) {
                const touchDuration = Date.now() - touchStartTime;
                
                // Only flip if it's a quick tap (not a scroll)
                if (touchDuration < 200) {
                    e.preventDefault();
                    this.classList.toggle('flipped');
                }
            });
        });
    }
    
    // Handle orientation change
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            // Recalculate positions after orientation change
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        }, 500);
    });
}

// Interactive Effects for Filter Buttons
function initializeFilterEffects() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(-2px) scale(1.05)';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
}

// Search Functionality (Optional Enhancement)
function initializeSearch() {
    const searchInput = document.getElementById('figureSearch');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            const searchTerm = this.value.toLowerCase();
            const cards = document.querySelectorAll('.figure-card');
            
            cards.forEach(card => {
                const figureName = card.querySelector('h3').textContent.toLowerCase();
                const figureRole = card.querySelector('.figure-role').textContent.toLowerCase();
                
                const matches = figureName.includes(searchTerm) || figureRole.includes(searchTerm);
                
                if (matches || searchTerm === '') {
                    card.classList.remove('hidden');
                    card.classList.add('show');
                } else {
                    card.classList.add('hidden');
                    card.classList.remove('show');
                }
            });
        }, 300));
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

// Add dynamic CSS for enhanced effects
const style = document.createElement('style');
style.textContent = `
    /* Enhanced card effects */
    .figure-card.revealed {
        animation: cardReveal 0.6s ease forwards;
    }
    
    @keyframes cardReveal {
        from {
            opacity: 0;
            transform: translateY(30px) rotateX(10deg);
        }
        to {
            opacity: 1;
            transform: translateY(0) rotateX(0deg);
        }
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
    
    /* Filter button transitions */
    .filter-btn {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    /* Card loading state */
    .figure-card.loading {
        pointer-events: none;
    }
    
    .figure-card.loading .card-inner {
        opacity: 0.6;
    }
    
    /* Mobile flip indicator */
    @media (max-width: 768px) {
        .figure-card::after {
            content: '👆 Tap to flip';
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 0.3rem 0.8rem;
            border-radius: 15px;
            font-size: 0.8rem;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            z-index: 10;
        }
        
        .figure-card:hover::after {
            opacity: 1;
        }
        
        .figure-card.flipped::after {
            content: '👆 Tap to return';
        }
    }
`;
document.head.appendChild(style);

// Initialize additional effects
initializeFilterEffects();
initializeSearch();

// Export functions for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeFiguresPage,
        initializeFiltering,
        initializeCardInteractions,
        filterCards,
        throttle,
        debounce
    };
}