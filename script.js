// Portfolio Draft JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio Draft initialized');
    
    // Initialize header functionality
    initializeHeader();
    
    // Initialize responsive behavior
    initializeResponsive();
    
    // Initialize page navigation
    initializeNavigation();
    
    // Initialize drag scroll for project pages
    initializeDragScroll();
    
    // Initialize wheel scroll for project pages
    initializeWheelScroll();
});

/**
 * Header functionality initialization
 */
function initializeHeader() {
    const header = document.getElementById('header');
    
    if (!header) {
        console.warn('Header element not found');
        return;
    }
    
    // Add scroll effect to header (optional enhancement)
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Add/remove scroll class for styling effects
        if (currentScrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
    });
    
    console.log('Header functionality initialized');
}

/**
 * Responsive behavior initialization
 */
function initializeResponsive() {
    // Handle window resize events
    window.addEventListener('resize', debounce(() => {
        updateViewportInfo();
    }, 250));
    
    // Initial viewport update
    updateViewportInfo();
    
    console.log('Responsive behavior initialized');
}

/**
 * Update viewport information for responsive adjustments
 */
function updateViewportInfo() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Set CSS custom properties for viewport dimensions
    document.documentElement.style.setProperty('--viewport-width', `${viewportWidth}px`);
    document.documentElement.style.setProperty('--viewport-height', `${viewportHeight}px`);
    
    // Add viewport classes for CSS targeting
    document.body.classList.remove('viewport-mobile', 'viewport-tablet', 'viewport-desktop');
    
    if (viewportWidth <= 480) {
        document.body.classList.add('viewport-mobile');
    } else if (viewportWidth <= 768) {
        document.body.classList.add('viewport-tablet');
    } else {
        document.body.classList.add('viewport-desktop');
    }
}

/**
 * Debounce utility function
 */
function debounce(func, wait) {
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

/**
 * Logo loading error handling
 */
document.addEventListener('DOMContentLoaded', function() {
    const logoImage = document.querySelector('.logo-image');
    
    if (logoImage) {
        logoImage.addEventListener('error', function() {
            console.warn('Logo image failed to load');
            this.style.opacity = '0.1';
            this.alt = 'Logo (Image not available)';
        });
        
        logoImage.addEventListener('load', function() {
            console.log('Logo image loaded successfully');
        });
    }
});

/**
 * Page navigation functionality
 */
function initializeNavigation() {
    // Logo click - go to home
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            showPage('home');
        });
        
        // Make logo clickable
        logo.style.cursor = 'pointer';
    }
    
    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const text = this.textContent.trim();
            let pageId;
            
            switch(text) {
                case 'Serendip VI':
                    pageId = 'serendip-vi';
                    break;
                case 'HiConnex':
                    pageId = 'hiconnex';
                    break;
                case '楽知':
                    pageId = 'rakuchi';
                    break;
                default:
                    pageId = 'home';
            }
            
            showPage(pageId);
        });
    });
    
    console.log('Navigation functionality initialized');
}

/**
 * Show specific page and hide others
 */
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Reset scroll position for project pages
        if (targetPage.classList.contains('project-page')) {
            targetPage.scrollLeft = 0;
        }
        
        console.log('Showing page:', pageId);
    } else {
        console.warn('Page not found:', pageId);
    }
    
    // Update active navigation state
    updateNavState(pageId);
}

/**
 * Update navigation active state
 */
function updateNavState(activePageId) {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        const text = link.textContent.trim();
        let linkPageId;
        
        switch(text) {
            case 'Serendip VI':
                linkPageId = 'serendip-vi';
                break;
            case 'HiConnex':
                linkPageId = 'hiconnex';
                break;
            case '楽知':
                linkPageId = 'rakuchi';
                break;
            default:
                linkPageId = 'home';
        }
        
        if (linkPageId === activePageId) {
            link.classList.add('active');
        }
    });
}

/**
 * Initialize drag scroll functionality for project pages
 */
function initializeDragScroll() {
    const projectPages = document.querySelectorAll('.project-page');
    
    projectPages.forEach(page => {
        let isDown = false;
        let startX;
        let scrollLeft;
        let animationId;
        let velocityTracker = [];
        
        // Mouse down event
        page.addEventListener('mousedown', (e) => {
            isDown = true;
            page.classList.add('dragging');
            startX = e.pageX - page.offsetLeft;
            scrollLeft = page.scrollLeft;
            velocityTracker = [];
            
            // Cancel any ongoing momentum scroll
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
            
            // Prevent text selection during drag
            e.preventDefault();
        });
        
        // Mouse leave event
        page.addEventListener('mouseleave', () => {
            if (isDown) {
                isDown = false;
                page.classList.remove('dragging');
                startMomentumScroll(page);
            }
        });
        
        // Mouse up event
        page.addEventListener('mouseup', () => {
            if (isDown) {
                isDown = false;
                page.classList.remove('dragging');
                startMomentumScroll(page);
            }
        });
        
        // Mouse move event
        page.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            
            e.preventDefault();
            const x = e.pageX - page.offsetLeft;
            const walk = (x - startX) * 1.5;
            const newScrollLeft = scrollLeft - walk;
            
            // Track velocity over the last few frames - track mouse movement, not scroll position
            const now = Date.now();
            velocityTracker.push({
                time: now,
                mouseX: x // Track mouse position instead of scroll position
            });
            
            // Keep only the last 5 measurements for velocity calculation
            if (velocityTracker.length > 5) {
                velocityTracker.shift();
            }
            
            page.scrollLeft = newScrollLeft;
        });
        
        // Touch events for mobile support
        page.addEventListener('touchstart', (e) => {
            isDown = true;
            page.classList.add('dragging');
            startX = e.touches[0].pageX - page.offsetLeft;
            scrollLeft = page.scrollLeft;
            velocityTracker = [];
            
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        });
        
        page.addEventListener('touchend', () => {
            if (isDown) {
                isDown = false;
                page.classList.remove('dragging');
                startMomentumScroll(page);
            }
        });
        
        page.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            
            const x = e.touches[0].pageX - page.offsetLeft;
            const walk = (x - startX) * 1.5;
            const newScrollLeft = scrollLeft - walk;
            
            const now = Date.now();
            velocityTracker.push({
                time: now,
                mouseX: x // Track touch position instead of scroll position
            });
            
            if (velocityTracker.length > 5) {
                velocityTracker.shift();
            }
            
            page.scrollLeft = newScrollLeft;
        });
        
        // Momentum scroll function
        function startMomentumScroll(element) {
            if (velocityTracker.length < 2) return;
            
            // Calculate velocity from the last few measurements
            const recent = velocityTracker.slice(-3); // Use last 3 measurements for better accuracy
            const oldest = recent[0];
            const newest = recent[recent.length - 1];
            
            const timeDiff = newest.time - oldest.time;
            const mouseDiff = newest.mouseX - oldest.mouseX; // Mouse movement difference
            
            if (timeDiff === 0) return;
            
            // Calculate velocity based on mouse movement direction
            // Positive mouseDiff = moving right, should scroll left (decrease scrollLeft)
            // Negative mouseDiff = moving left, should scroll right (increase scrollLeft)
            let velocity = (mouseDiff / timeDiff) * 30; // Mouse velocity to scroll velocity
            
            // Only start momentum if velocity is significant
            if (Math.abs(velocity) < 1) {
                console.log('Velocity too low for momentum:', velocity);
                return;
            }
            
            console.log('Starting momentum scroll with velocity:', velocity);
            
            const friction = 0.90; // Smoother deceleration
            const minVelocity = 0.3; // Lower minimum velocity for longer momentum
            
            function animate() {
                velocity *= friction;
                
                if (Math.abs(velocity) < minVelocity) {
                    animationId = null;
                    console.log('Momentum scroll ended');
                    return;
                }
                
                // Apply velocity in the direction of mouse movement
                element.scrollLeft -= velocity;
                animationId = requestAnimationFrame(animate);
            }
            
            animate();
        }
    });
    
    console.log('Drag scroll functionality initialized');
}

/**
 * Initialize wheel scroll functionality for project pages
 */
function initializeWheelScroll() {
    const projectPages = document.querySelectorAll('.project-page');
    
    projectPages.forEach(page => {
        page.addEventListener('wheel', (e) => {
            // Only apply to project pages, not the home page
            if (!page.classList.contains('active')) return;
            
            // Prevent default vertical scrolling
            e.preventDefault();
            
            // Convert vertical scroll to horizontal scroll
            const scrollAmount = e.deltaY * 2; // Multiply for smoother scrolling
            page.scrollLeft += scrollAmount;
            
            // Add temporary class for visual feedback (optional)
            page.classList.add('wheel-scrolling');
            clearTimeout(page.wheelTimeout);
            page.wheelTimeout = setTimeout(() => {
                page.classList.remove('wheel-scrolling');
            }, 150);
        }, { passive: false }); // passive: false to allow preventDefault
    });
    
    console.log('Wheel scroll functionality initialized');
}

// Debug information (remove in production)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('Portfolio Draft - Development Mode');
    console.log('Viewport:', window.innerWidth + 'x' + window.innerHeight);
    console.log('User Agent:', navigator.userAgent);
}