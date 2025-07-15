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
        let velocity = 0;
        let lastX = 0;
        let lastTime = 0;
        
        // Mouse down event
        page.addEventListener('mousedown', (e) => {
            isDown = true;
            page.classList.add('dragging');
            startX = e.pageX - page.offsetLeft;
            scrollLeft = page.scrollLeft;
            lastX = e.pageX;
            lastTime = Date.now();
            velocity = 0;
            
            // Cancel any ongoing momentum scroll
            if (animationId) {
                cancelAnimationFrame(animationId);
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
            const walk = (x - startX) * 1.5; // Adjust scroll speed multiplier
            const newScrollLeft = scrollLeft - walk;
            
            // Calculate velocity for momentum scroll
            const currentTime = Date.now();
            const deltaTime = currentTime - lastTime;
            
            if (deltaTime > 10) { // Only calculate if enough time has passed
                const deltaScroll = page.scrollLeft - (scrollLeft - walk);
                velocity = deltaScroll / deltaTime * 1000; // pixels per second
            }
            
            lastX = e.pageX;
            lastTime = currentTime;
            
            page.scrollLeft = newScrollLeft;
        });
        
        // Touch events for mobile support
        page.addEventListener('touchstart', (e) => {
            isDown = true;
            page.classList.add('dragging');
            startX = e.touches[0].pageX - page.offsetLeft;
            scrollLeft = page.scrollLeft;
            lastX = e.touches[0].pageX;
            lastTime = Date.now();
            velocity = 0;
            
            if (animationId) {
                cancelAnimationFrame(animationId);
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
            
            const currentTime = Date.now();
            const deltaTime = currentTime - lastTime;
            const deltaX = e.touches[0].pageX - lastX;
            
            if (deltaTime > 0) {
                velocity = deltaX / deltaTime * 16;
            }
            
            lastX = e.touches[0].pageX;
            lastTime = currentTime;
            
            page.scrollLeft = scrollLeft - walk;
        });
        
        // Momentum scroll function
        function startMomentumScroll(element) {
            const friction = 0.92;
            const minVelocity = 10; // pixels per second
            
            function animate() {
                velocity *= friction;
                
                if (Math.abs(velocity) < minVelocity) {
                    animationId = null;
                    return;
                }
                
                // Convert velocity from pixels/second to pixels/frame (60fps)
                const scrollDelta = velocity / 60;
                element.scrollLeft -= scrollDelta;
                
                animationId = requestAnimationFrame(animate);
            }
            
            if (Math.abs(velocity) > minVelocity) {
                console.log('Starting momentum scroll with velocity:', velocity);
                animate();
            } else {
                console.log('Velocity too low for momentum:', velocity);
            }
        }
    });
    
    console.log('Drag scroll functionality initialized');
}

// Debug information (remove in production)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('Portfolio Draft - Development Mode');
    console.log('Viewport:', window.innerWidth + 'x' + window.innerHeight);
    console.log('User Agent:', navigator.userAgent);
}