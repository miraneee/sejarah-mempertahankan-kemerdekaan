// Armed Struggle Page Interactive Features

// Modal Management
class ModalManager {
    constructor() {
        this.activeModal = null;
        this.eventListeners = new Map();
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Close modal when clicking outside
        const clickHandler = (e) => {
            if (e.target && e.target.classList.contains('battle-modal')) {
                this.closeActiveModal();
            }
        };
        
        // Close modal with Escape key
        const keyHandler = (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.closeActiveModal();
            }
        };
        
        document.addEventListener('click', clickHandler);
        document.addEventListener('keydown', keyHandler);
        
        // Store references for cleanup
        this.eventListeners.set('click', clickHandler);
        this.eventListeners.set('keydown', keyHandler);
    }

    openModal(modalId) {
        try {
            if (!modalId) {
                console.warn('Modal ID is required');
                return;
            }
            
            const modal = document.getElementById(`modal-${modalId}`);
            if (!modal) {
                console.warn(`Modal with ID 'modal-${modalId}' not found`);
                return;
            }
            
            // Close any existing modal first
            this.closeActiveModal();
            
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            this.activeModal = modal;
            document.body.style.overflow = 'hidden';
            
            // Focus trap for accessibility
            this.trapFocus(modal);
        } catch (error) {
            console.error('Error opening modal:', error);
        }
    }

    closeModal(modalId) {
        try {
            if (!modalId) {
                console.warn('Modal ID is required');
                return;
            }
            
            const modal = document.getElementById(`modal-${modalId}`);
            if (!modal) {
                console.warn(`Modal with ID 'modal-${modalId}' not found`);
                return;
            }
            
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            
            if (this.activeModal === modal) {
                this.activeModal = null;
                document.body.style.overflow = '';
            }
        } catch (error) {
            console.error('Error closing modal:', error);
        }
    }

    closeActiveModal() {
        try {
            if (this.activeModal) {
                this.activeModal.classList.remove('active');
                this.activeModal.setAttribute('aria-hidden', 'true');
                this.activeModal = null;
                document.body.style.overflow = '';
            }
        } catch (error) {
            console.error('Error closing active modal:', error);
        }
    }

    // Cleanup method to remove event listeners
    destroy() {
        try {
            this.eventListeners.forEach((handler, event) => {
                document.removeEventListener(event, handler);
            });
            this.eventListeners.clear();
            this.closeActiveModal();
        } catch (error) {
            console.error('Error destroying modal manager:', error);
        }
    }

    trapFocus(modal) {
        try {
            if (!modal) {
                console.warn('Modal element is required for focus trap');
                return;
            }
            
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            if (focusableElements.length === 0) {
                console.warn('No focusable elements found in modal');
                return;
            }
            
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            // Remove existing focus trap listener if any
            if (modal.focusTrapHandler) {
                modal.removeEventListener('keydown', modal.focusTrapHandler);
            }
            
            // Create new focus trap handler
            const focusTrapHandler = (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            e.preventDefault();
                            firstElement.focus();
                        }
                    }
                }
            };
            
            modal.addEventListener('keydown', focusTrapHandler);
            modal.focusTrapHandler = focusTrapHandler; // Store reference for cleanup

            // Focus first element
            setTimeout(() => {
                if (firstElement && typeof firstElement.focus === 'function') {
                    firstElement.focus();
                }
            }, 100);
        } catch (error) {
            console.error('Error setting up focus trap:', error);
        }
    }
}

// Timeline Animation Manager
class TimelineAnimationManager {
    constructor() {
        this.timelineEvents = document.querySelectorAll('.timeline-event');
        this.timelineLine = document.querySelector('.timeline-line');
        this.init();
    }

    init() {
        this.observeTimelineEvents();
        this.animateTimelineLine();
        this.bindHoverEffects();
    }

    observeTimelineEvents() {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-50px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    this.animateTimelineCard(entry.target);
                }
            });
        }, observerOptions);

        this.timelineEvents.forEach(event => {
            observer.observe(event);
        });
    }

    animateTimelineCard(eventElement) {
        const card = eventElement.querySelector('.timeline-card');
        const marker = eventElement.querySelector('.timeline-marker');
        
        if (card && marker) {
            // Animate marker
            marker.style.transform = 'translateX(-50%) scale(1.2)';
            marker.style.boxShadow = '0 0 20px rgba(220, 38, 38, 0.5)';
            
            setTimeout(() => {
                marker.style.transform = 'translateX(-50%) scale(1)';
                marker.style.boxShadow = 'none';
            }, 600);

            // Animate card
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.1)';
            
            setTimeout(() => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '';
            }, 800);
        }
    }

    animateTimelineLine() {
        if (!this.timelineLine) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.timelineLine.style.animation = 'drawLine 2s ease-out forwards';
                }
            });
        }, { threshold: 0.1 });

        observer.observe(this.timelineLine);
    }

    bindHoverEffects() {
        this.timelineEvents.forEach(event => {
            const card = event.querySelector('.timeline-card');
            const marker = event.querySelector('.timeline-marker');

            if (card && marker) {
                card.addEventListener('mouseenter', () => {
                    marker.style.transform = 'translateX(-50%) scale(1.3)';
                    marker.style.boxShadow = '0 0 25px rgba(220, 38, 38, 0.6)';
                });

                card.addEventListener('mouseleave', () => {
                    marker.style.transform = 'translateX(-50%) scale(1)';
                    marker.style.boxShadow = 'none';
                });
            }
        });
    }
}

// Statistics Counter Animation
class StatsAnimationManager {
    constructor() {
        this.statNumbers = document.querySelectorAll('.stat-number[data-counter]');
        this.init();
    }

    init() {
        this.observeStats();
    }

    observeStats() {
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

        this.statNumbers.forEach(stat => {
            observer.observe(stat);
        });
    }

    animateCounter(element) {
        try {
            if (!element) {
                console.warn('Element is required for counter animation');
                return;
            }
            
            const targetAttr = element.getAttribute('data-counter');
            if (!targetAttr) {
                console.warn('data-counter attribute is required');
                return;
            }
            
            const target = parseInt(targetAttr);
            if (isNaN(target)) {
                console.warn('Invalid data-counter value:', targetAttr);
                return;
            }
            
            const duration = 2000;
            const startTime = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function for smoother animation
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(target * easeOutQuart);
                
                element.textContent = current;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.textContent = target;
                }
            };
            
            requestAnimationFrame(animate);
        } catch (error) {
            console.error('Error animating counter:', error);
        }
    }
}

// Hero Cards Interactive Effects
class HeroCardsManager {
    constructor() {
        this.heroCards = document.querySelectorAll('.hero-card');
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.heroCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateCard(card, 'enter');
            });

            card.addEventListener('mouseleave', () => {
                this.animateCard(card, 'leave');
            });

            card.addEventListener('click', () => {
                this.showHeroDetail(card);
            });
        });
    }

    animateCard(card, action) {
        const image = card.querySelector('.hero-image .image-placeholder');
        const info = card.querySelector('.hero-info');

        if (action === 'enter') {
            if (image) image.style.transform = 'scale(1.1) rotate(2deg)';
            if (info) info.style.transform = 'translateY(-3px)';
        } else {
            if (image) image.style.transform = 'scale(1) rotate(0deg)';
            if (info) info.style.transform = 'translateY(0)';
        }
    }

    showHeroDetail(card) {
        try {
            if (!card) {
                console.warn('Card element is required');
                return;
            }
            
            const heroNameElement = card.querySelector('h3');
            const heroRoleElement = card.querySelector('.hero-role');
            
            if (!heroNameElement || !heroRoleElement) {
                console.warn('Hero name or role element not found');
                return;
            }
            
            const heroName = heroNameElement.textContent || 'Unknown Hero';
            const heroRole = heroRoleElement.textContent || 'Unknown Role';
            
            // Create a simple notification or could open a detailed modal
            this.showNotification(`Menampilkan detail untuk ${heroName} - ${heroRole}`);
        } catch (error) {
            console.error('Error showing hero detail:', error);
        }
    }

    showNotification(message) {
        try {
            if (!message) {
                console.warn('Message is required for notification');
                return;
            }
            
            // Create notification element
            const notification = document.createElement('div');
            notification.className = 'hero-notification';
            notification.textContent = message;
            notification.setAttribute('role', 'alert');
            notification.setAttribute('aria-live', 'polite');
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: var(--primary-red, #dc2626);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                z-index: 1001;
                animation: slideInRight 0.3s ease-out;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                max-width: 300px;
                word-wrap: break-word;
            `;

            if (document.body) {
                document.body.appendChild(notification);

                // Remove notification after 3 seconds
                setTimeout(() => {
                    if (notification && notification.style) {
                        notification.style.animation = 'slideOutRight 0.3s ease-out';
                        setTimeout(() => {
                            if (notification && notification.parentNode) {
                                notification.parentNode.removeChild(notification);
                            }
                        }, 300);
                    }
                }, 3000);
            } else {
                console.warn('Document body not available for notification');
            }
        } catch (error) {
            console.error('Error showing notification:', error);
        }
    }
}

// Page-specific Navigation Effects
class PageNavigationManager {
    constructor() {
        this.navCards = document.querySelectorAll('.nav-card');
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.navCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateNavCard(card, 'enter');
            });

            card.addEventListener('mouseleave', () => {
                this.animateNavCard(card, 'leave');
            });
        });
    }

    animateNavCard(card, action) {
        const icon = card.querySelector('.nav-icon');
        
        if (action === 'enter') {
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
                icon.style.boxShadow = '0 5px 15px rgba(220, 38, 38, 0.3)';
            }
        } else {
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
                icon.style.boxShadow = 'none';
            }
        }
    }
}

// Armed Struggle Page Module
const ArmedStrugglePage = (() => {
    let managers = {};
    
    // Global functions for modal control (called from HTML)
    window.openModal = function(modalId) {
        try {
            if (managers.modal) {
                managers.modal.openModal(modalId);
            } else {
                console.warn('Modal manager not initialized');
            }
        } catch (error) {
            console.error('Error opening modal:', error);
        }
    };

    window.closeModal = function(modalId) {
        try {
            if (managers.modal) {
                managers.modal.closeModal(modalId);
            } else {
                console.warn('Modal manager not initialized');
            }
        } catch (error) {
            console.error('Error closing modal:', error);
        }
    };
    
    // Cleanup function
    const cleanup = () => {
        try {
            if (managers.modal && typeof managers.modal.destroy === 'function') {
                managers.modal.destroy();
            }
            managers = {};
            console.log('✅ Armed Struggle page components cleaned up');
        } catch (error) {
            console.error('❌ Error cleaning up components:', error);
        }
    };
    
    // Initialize all managers when DOM is loaded
    const init = () => {
        try {
            // Check if DOM is ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', init);
                return;
            }
            
            managers.modal = new ModalManager();
            managers.timeline = new TimelineAnimationManager();
            managers.stats = new StatsAnimationManager();
            managers.heroCards = new HeroCardsManager();
            managers.pageNav = new PageNavigationManager();
            
            console.log('✅ Armed Struggle page components initialized successfully');
            
            // Cleanup on page unload
            window.addEventListener('beforeunload', cleanup);
        } catch (error) {
            console.error('❌ Error initializing Armed Struggle page components:', error);
        }
    };
    
    return {
        init,
        cleanup,
        getManagers: () => managers
    };
})();

// Auto-initialize
ArmedStrugglePage.init();

// Add custom CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes drawLine {
        from {
            height: 0;
        }
        to {
            height: 100%;
        }
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    .timeline-event.animate-in .timeline-card {
        animation: cardSlideIn 0.6s ease-out;
    }
    
    @keyframes cardSlideIn {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ModalManager,
        TimelineAnimationManager,
        StatsAnimationManager,
        HeroCardsManager,
        PageNavigationManager
    };
}