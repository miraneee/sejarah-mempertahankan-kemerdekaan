// Theme Management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme();
        this.bindEvents();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        const themeIcon = document.querySelector('#themeToggle i');
        if (themeIcon) {
            themeIcon.className = this.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
        this.applyTheme();
    }

    bindEvents() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        this.handleScroll();
        this.bindEvents();
        this.setActiveLink();
    }

    handleScroll() {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (this.navbar) {
                if (currentScrollY > 100) {
                    this.navbar.style.background = this.getNavBackground(0.98);
                } else {
                    this.navbar.style.background = this.getNavBackground(0.95);
                }
            }
            
            lastScrollY = currentScrollY;
        });
    }

    getNavBackground(opacity) {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        return isDark 
            ? `rgba(15, 23, 42, ${opacity})` 
            : `rgba(255, 255, 255, ${opacity})`;
    }

    setActiveLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }

    bindEvents() {
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Animation Manager
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        // Initialize AOS (Animate On Scroll)
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 100
            });
        }

        this.initParallax();
        this.initCounters();
    }

    initParallax() {
        const parallaxElements = document.querySelectorAll('.hero-background');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            parallaxElements.forEach(element => {
                element.style.transform = `translateY(${rate}px)`;
            });
        });
    }

    initCounters() {
        const counters = document.querySelectorAll('[data-counter]');
        const observerOptions = {
            threshold: 0.7
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-counter'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            element.textContent = Math.floor(current);
            
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 16);
    }
}

// Interactive Timeline
class TimelineManager {
    constructor() {
        this.timelineItems = document.querySelectorAll('.timeline-item');
        this.init();
    }

    init() {
        this.bindEvents();
        this.observeTimeline();
    }

    bindEvents() {
        this.timelineItems.forEach(item => {
            item.addEventListener('click', () => {
                this.showTimelineDetail(item);
            });
        });
    }

    observeTimeline() {
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '-50px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        this.timelineItems.forEach(item => observer.observe(item));
    }

    showTimelineDetail(item) {
        const content = item.querySelector('.timeline-content');
        if (content) {
            content.style.transform = 'scale(1.05)';
            setTimeout(() => {
                content.style.transform = 'scale(1)';
            }, 200);
        }
    }
}

// Figure Cards Manager
class FigureCardsManager {
    constructor() {
        this.figureCards = document.querySelectorAll('.figure-card');
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.figureCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateCard(card, 'enter');
            });

            card.addEventListener('mouseleave', () => {
                this.animateCard(card, 'leave');
            });

            card.addEventListener('click', () => {
                this.showFigureDetail(card);
            });
        });
    }

    animateCard(card, action) {
        const image = card.querySelector('.figure-image');
        const info = card.querySelector('.figure-info');

        if (action === 'enter') {
            image.style.transform = 'scale(1.1)';
            info.style.transform = 'translateY(-5px)';
        } else {
            image.style.transform = 'scale(1)';
            info.style.transform = 'translateY(0)';
        }
    }

    showFigureDetail(card) {
        const figureName = card.querySelector('h4').textContent;
        console.log(`Showing details for: ${figureName}`);
        // This would typically open a modal or navigate to a detail page
    }
}

// Utility Functions
class Utils {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
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

    static fadeIn(element, duration = 300) {
        element.style.opacity = 0;
        element.style.display = 'block';
        
        const start = performance.now();
        
        function animate(currentTime) {
            const elapsed = currentTime - start;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                element.style.opacity = progress;
                requestAnimationFrame(animate);
            } else {
                element.style.opacity = 1;
            }
        }
        
        requestAnimationFrame(animate);
    }

    static fadeOut(element, duration = 300) {
        const start = performance.now();
        const startOpacity = parseFloat(getComputedStyle(element).opacity);
        
        function animate(currentTime) {
            const elapsed = currentTime - start;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                element.style.opacity = startOpacity * (1 - progress);
                requestAnimationFrame(animate);
            } else {
                element.style.opacity = 0;
                element.style.display = 'none';
            }
        }
        
        requestAnimationFrame(animate);
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            loadTime: 0,
            renderTime: 0,
            interactionTime: 0
        };
        this.init();
    }

    init() {
        this.measureLoadTime();
        this.measureRenderTime();
    }

    measureLoadTime() {
        window.addEventListener('load', () => {
            this.metrics.loadTime = performance.now();
            console.log(`Page load time: ${this.metrics.loadTime.toFixed(2)}ms`);
        });
    }

    measureRenderTime() {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                if (entry.entryType === 'measure') {
                    console.log(`${entry.name}: ${entry.duration.toFixed(2)}ms`);
                }
            });
        });
        
        observer.observe({ entryTypes: ['measure'] });
    }
}

// Main Application
class App {
    constructor() {
        this.themeManager = null;
        this.navigationManager = null;
        this.animationManager = null;
        this.timelineManager = null;
        this.figureCardsManager = null;
        this.performanceMonitor = null;
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        try {
            this.themeManager = new ThemeManager();
            this.navigationManager = new NavigationManager();
            this.animationManager = new AnimationManager();
            this.timelineManager = new TimelineManager();
            this.figureCardsManager = new FigureCardsManager();
            this.performanceMonitor = new PerformanceMonitor();
            
            console.log('✅ All components initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing components:', error);
        }
    }
}

// Initialize the application
const app = new App();

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        App,
        ThemeManager,
        NavigationManager,
        AnimationManager,
        TimelineManager,
        FigureCardsManager,
        Utils,
        PerformanceMonitor
    };
}