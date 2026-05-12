/* ================================
   DOCUMENT READY & INITIALIZATION
   ================================ */

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollAnimations();
    initBackToTop();
    initScrollReveal();
    initTypingEffect();
    initImageErrorHandling();
});

/* ================================
   NAVIGATION FUNCTIONALITY
   ================================ */

function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');

    // Hamburger menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            updateActiveNav();
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveNav();
    });
}

// Update active navigation link
function updateActiveNav() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

/* ================================
   SCROLL REVEAL ANIMATIONS
   ================================ */

function initScrollReveal() {
    const elements = document.querySelectorAll(
        '.about-content, .highlight-card, .skill-category, ' +
        '.timeline-item, .project-card, .certification-card, ' +
        '.achievement-card, .contact-method'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.animationDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
}

/* ================================
   BACK TO TOP BUTTON
   ================================ */

function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ================================
   SCROLL ANIMATIONS
   ================================ */

function initScrollAnimations() {
    const profileImage = document.querySelector('.profile-image');
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');

    // Stagger button animation
    heroButtons.forEach((btn, index) => {
        btn.style.animation = `fadeInUp 0.8s ease-out ${0.4 + index * 0.1}s backwards`;
    });
}

/* ================================
   TYPING EFFECT IN HERO
   ================================ */

function initTypingEffect() {
    const typingElement = document.querySelector('.typing');
    if (!typingElement) return;

    const text = typingElement.textContent;
    typingElement.textContent = '';

    let index = 0;
    const speed = 50; // milliseconds per character

    function typeCharacter() {
        if (index < text.length) {
            typingElement.textContent += text.charAt(index);
            index++;
            setTimeout(typeCharacter, speed);
        }
    }

    // Start typing after page load animation
    setTimeout(typeCharacter, 500);
}

/* ================================
   SKILL LEVEL ANIMATION ON SCROLL
   ================================ */

document.addEventListener('DOMContentLoaded', function() {
    const skillLevels = document.querySelectorAll('.skill-level');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const levelFill = entry.target.querySelector('.level-fill');
                if (levelFill && !levelFill.style.animation) {
                    levelFill.style.animation = 'none';
                    // Trigger reflow to restart animation
                    void levelFill.offsetWidth;
                    levelFill.style.animation = 'fillBar 1.5s ease-out forwards';
                    observer.unobserve(entry.target);
                }
            }
        });
    }, {
        threshold: 0.1
    });

    skillLevels.forEach(level => {
        observer.observe(level);
    });
});

/* ================================
   SMOOTH SCROLL BEHAVIOR
   ================================ */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

/* ================================
   PROJECT CARD INTERACTION
   ================================ */

document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
    });

    card.addEventListener('mouseleave', function() {
        this.style.zIndex = '1';
    });
});

/* ================================
   CONTACT METHOD HOVER EFFECT
   ================================ */

document.querySelectorAll('.contact-method').forEach(method => {
    method.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') {
            e.preventDefault();
        }
    });
});

/* ================================
   WINDOW RESIZE HANDLER
   ================================ */

let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Reset mobile menu on resize
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');

        if (window.innerWidth > 768) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }, 250);
});

/* ================================
   PERFORMANCE OPTIMIZATION
   ================================ */

// Lazy loading for images (if needed in future)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

/* ================================
   UTILITY FUNCTIONS
   ================================ */

// Get scroll position
function getScrollPosition() {
    return window.pageYOffset || document.documentElement.scrollTop;
}

// Check if element is in viewport
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
}

// Debounce function for performance
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

// Throttle function for performance
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

/* ================================
   ADDITIONAL INTERACTIVITY
   ================================ */

// Add ripple effect to buttons
document.querySelectorAll('.btn, .project-link, .contact-method').forEach(element => {
    element.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const ripple = document.createElement('span');
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        // Clean up ripple after animation
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add smooth transition when sections come into view
const sections = document.querySelectorAll('section');
sections.forEach((section, index) => {
    section.style.transitionDelay = `${index * 0.1}s`;
});

/* ================================
   CONSOLE GREETING
   ================================ */

console.log('%c Welcome to Ralph Lawrence F. Garcia\'s Portfolio! ', 'background: #6366f1; color: white; font-size: 14px; font-weight: bold; padding: 10px;');
console.log('%c Let\'s build something amazing together! 🚀', 'color: #8b5cf6; font-size: 12px;');

/* ================================
   PAGE VISIBILITY API
   ================================ */

document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden
        console.log('Page hidden');
    } else {
        // Page is visible
        console.log('Welcome back!');
    }
});

/* ================================
   KEYBOARD NAVIGATION
   ================================ */

document.addEventListener('keydown', function(e) {
    // Close mobile menu on Escape
    if (e.key === 'Escape') {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

/* ================================
   IMAGE ERROR HANDLING
   ================================ */

function initImageErrorHandling() {
    // Handle profile image errors
    const profileImg = document.querySelector('.profile-pic');
    if (profileImg) {
        profileImg.addEventListener('error', function() {
            this.style.display = 'none';
            this.parentElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background: linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.3)); color: rgba(241, 245, 249, 0.5); font-size: 3rem;"><i class="fas fa-user"></i></div>';
        });
    }

    // Handle certificate image errors
    const certImages = document.querySelectorAll('.cert-image');
    certImages.forEach(img => {
        img.addEventListener('error', function() {
            this.classList.add('error');
            this.style.display = 'flex';
            this.textContent = '📄 Image not found';
        });
    });
}
