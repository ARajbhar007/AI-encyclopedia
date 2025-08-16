// AI Encyclopedia Interactive JavaScript
// macOS-inspired interactions and smooth navigation

class AIEncyclopedia {
    constructor() {
        this.currentSection = 'introduction';
        this.isScrolling = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupKeyboardNavigation();
        this.setupSearchFunctionality();
        this.setupAnimationObserver();
        this.setupTrafficLights();
    }

    setupEventListeners() {
        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const chapter = link.getAttribute('data-chapter');
                this.navigateToChapter(chapter);
                this.updateActiveNav(link);
            });
        });

        // Window resize handler
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Scroll handler with throttling
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
    }

    setupNavigation() {
        // Smooth scroll behavior
        document.documentElement.style.scrollBehavior = 'smooth';
        
        // Initial section setup
        this.showSection(this.currentSection);
    }

    navigateToChapter(chapter) {
        if (this.currentSection === chapter) return;
        
        const currentEl = document.getElementById(this.currentSection);
        const nextEl = document.getElementById(chapter);
        
        if (!nextEl) return;
        
        // Add transition effect
        if (currentEl) {
            currentEl.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                currentEl.classList.remove('active');
                currentEl.style.animation = '';
            }, 300);
        }
        
        setTimeout(() => {
            this.showSection(chapter);
            this.currentSection = chapter;
            
            // Add page transition sound effect (if audio is enabled)
            this.playTransitionSound();
            
            // Update URL hash without scrolling
            if (history.pushState) {
                history.pushState(null, null, `#${chapter}`);
            }
        }, 150);
    }

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Scroll to top of main content
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                mainContent.scrollTop = 0;
            }
            
            // Trigger animations
            this.animateSection(targetSection);
        }
    }

    updateActiveNav(activeLink) {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to clicked link
        activeLink.classList.add('active');
        
        // Add subtle feedback animation
        activeLink.style.transform = 'scale(0.98)';
        setTimeout(() => {
            activeLink.style.transform = '';
        }, 150);
    }

    setupScrollEffects() {
        // Parallax effect for background
        const body = document.body;
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up';
            
            // Update background position for parallax effect
            const offset = scrollTop * 0.5;
            body.style.backgroundPosition = `center ${offset}px`;
            
            lastScrollTop = scrollTop;
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // CMD/Ctrl + Number keys for quick navigation
            if ((e.metaKey || e.ctrlKey) && e.key >= '1' && e.key <= '9') {
                e.preventDefault();
                const chapters = ['introduction', 'genesis', 'evolution', 'current-state', 
                               'human-transformation', 'dark-side', 'psychological-impact', 
                               'future-scenarios', 'singularity', 'conclusion'];
                const index = parseInt(e.key) - 1;
                if (chapters[index]) {
                    this.navigateToChapter(chapters[index]);
                    const navLink = document.querySelector(`[data-chapter="${chapters[index]}"]`);
                    if (navLink) this.updateActiveNav(navLink);
                }
            }
            
            // Arrow key navigation
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                this.navigateWithArrowKeys(e.key);
            }
            
            // Escape key to return to introduction
            if (e.key === 'Escape') {
                this.navigateToChapter('introduction');
                const introLink = document.querySelector('[data-chapter="introduction"]');
                if (introLink) this.updateActiveNav(introLink);
            }
        });
    }

    navigateWithArrowKeys(key) {
        const chapters = ['introduction', 'genesis', 'evolution', 'current-state', 
                         'human-transformation', 'dark-side', 'psychological-impact', 
                         'future-scenarios', 'singularity', 'conclusion'];
        const currentIndex = chapters.indexOf(this.currentSection);
        
        let nextIndex;
        if (key === 'ArrowLeft') {
            nextIndex = currentIndex > 0 ? currentIndex - 1 : chapters.length - 1;
        } else {
            nextIndex = currentIndex < chapters.length - 1 ? currentIndex + 1 : 0;
        }
        
        this.navigateToChapter(chapters[nextIndex]);
        const navLink = document.querySelector(`[data-chapter="${chapters[nextIndex]}"]`);
        if (navLink) this.updateActiveNav(navLink);
    }

    setupSearchFunctionality() {
        const searchIcon = document.querySelector('.fa-search');
        if (searchIcon) {
            searchIcon.addEventListener('click', () => {
                this.showSearchDialog();
            });
        }
        
        // CMD/Ctrl + F for search
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
                e.preventDefault();
                this.showSearchDialog();
            }
        });
    }

    showSearchDialog() {
        const searchTerm = prompt('Search the AI Encyclopedia:', '');
        if (searchTerm && searchTerm.trim()) {
            this.performSearch(searchTerm.trim().toLowerCase());
        }
    }

    performSearch(term) {
        const sections = document.querySelectorAll('.content-section');
        let found = false;
        
        sections.forEach(section => {
            const content = section.textContent.toLowerCase();
            if (content.includes(term)) {
                const sectionId = section.id;
                this.navigateToChapter(sectionId);
                const navLink = document.querySelector(`[data-chapter="${sectionId}"]`);
                if (navLink) this.updateActiveNav(navLink);
                found = true;
                
                // Highlight search term (basic implementation)
                setTimeout(() => {
                    this.highlightText(section, term);
                }, 500);
                
                return; // Stop at first match
            }
        });
        
        if (!found) {
            this.showNotification('No results found for "' + term + '"', 'warning');
        }
    }

    highlightText(container, term) {
        // Simple text highlighting
        const walker = document.createTreeWalker(
            container,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        const textNodes = [];
        let node;
        
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }
        
        textNodes.forEach(textNode => {
            const content = textNode.textContent.toLowerCase();
            if (content.includes(term)) {
                const highlightedContent = textNode.textContent.replace(
                    new RegExp(term, 'gi'), 
                    `<mark style="background: #FFE066; padding: 2px 4px; border-radius: 3px;">$&</mark>`
                );
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = highlightedContent;
                
                while (tempDiv.firstChild) {
                    textNode.parentNode.insertBefore(tempDiv.firstChild, textNode);
                }
                textNode.parentNode.removeChild(textNode);
            }
        });
        
        // Remove highlights after 5 seconds
        setTimeout(() => {
            container.querySelectorAll('mark').forEach(mark => {
                mark.outerHTML = mark.innerHTML;
            });
        }, 5000);
    }

    setupAnimationObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        // Observe all cards and interactive elements
        document.querySelectorAll('.intro-card, .milestone-card, .domain-card, .dark-card, .crisis-item, .prediction-card').forEach(el => {
            observer.observe(el);
        });
    }

    animateSection(section) {
        const animatableElements = section.querySelectorAll(
            '.intro-card, .timeline-item, .milestone-card, .domain-card, .dark-card, .crisis-item, .prediction-card'
        );
        
        animatableElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    setupTrafficLights() {
        const redLight = document.querySelector('.traffic-light.red');
        const yellowLight = document.querySelector('.traffic-light.yellow');
        const greenLight = document.querySelector('.traffic-light.green');
        
        if (redLight) {
            redLight.addEventListener('click', () => {
                this.showCloseDialog();
            });
        }
        
        if (yellowLight) {
            yellowLight.addEventListener('click', () => {
                this.minimizeWindow();
            });
        }
        
        if (greenLight) {
            greenLight.addEventListener('click', () => {
                this.toggleFullscreen();
            });
        }
    }

    showCloseDialog() {
        const shouldClose = confirm('Are you sure you want to close the AI Encyclopedia?');
        if (shouldClose) {
            // Create a closing animation
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '0';
            
            setTimeout(() => {
                window.close();
            }, 500);
        }
    }

    minimizeWindow() {
        // Simulate minimize with a shrink animation
        const content = document.querySelector('.main-content');
        content.style.transition = 'transform 0.3s ease';
        content.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            content.style.transform = '';
        }, 300);
        
        this.showNotification('Window minimized (simulated)', 'info');
    }

    toggleFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen().catch(err => {
                this.showNotification('Fullscreen not supported', 'warning');
            });
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'warning' ? 'exclamation-triangle' : 
                              type === 'error' ? 'times-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Style notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '80px',
            right: '20px',
            background: type === 'warning' ? '#FF9500' : 
                       type === 'error' ? '#FF3B30' : '#007AFF',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            zIndex: '10000',
            transform: 'translateX(350px)',
            transition: 'transform 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(350px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    playTransitionSound() {
        // Create a subtle audio feedback (optional)
        if (typeof Audio !== 'undefined') {
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
                
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.2);
            } catch (e) {
                // Audio not supported or blocked
            }
        }
    }

    handleResize() {
        // Handle responsive sidebar toggle
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        
        if (window.innerWidth <= 1024) {
            sidebar.classList.remove('open');
            mainContent.style.marginLeft = '0';
        } else {
            mainContent.style.marginLeft = '280px';
        }
    }

    handleScroll() {
        if (this.isScrolling) return;
        
        this.isScrolling = true;
        
        // Add scroll-based effects here
        const menuBar = document.querySelector('.menu-bar');
        if (window.scrollY > 0) {
            menuBar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            menuBar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        }
        
        setTimeout(() => {
            this.isScrolling = false;
        }, 16);
    }

    // Utility function for throttling
    throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function() {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function() {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const encyclopedia = new AIEncyclopedia();
    
    // Add some additional interactive features
    
    // Hover effects for cards
    document.querySelectorAll('.intro-card, .milestone-card, .domain-card, .crisis-item').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add click ripple effect
    document.querySelectorAll('.nav-link, .intro-card').forEach(element => {
        element.addEventListener('click', function(e) {
            const ripple = document.createElement('div');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
    });
    
    // Add ripple animation to CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Handle initial hash navigation
    const hash = window.location.hash.slice(1);
    if (hash) {
        const navLink = document.querySelector(`[data-chapter="${hash}"]`);
        if (navLink) {
            encyclopedia.navigateToChapter(hash);
            encyclopedia.updateActiveNav(navLink);
        }
    }
    
    // Add easter egg
    let konami = [];
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
    
    document.addEventListener('keydown', (e) => {
        konami.push(e.keyCode);
        if (konami.length > konamiCode.length) {
            konami = konami.slice(-konamiCode.length);
        }
        
        if (konami.length === konamiCode.length && 
            konami.every((val, i) => val === konamiCode[i])) {
            encyclopedia.showNotification('🤖 AI Easter Egg Activated! Welcome, fellow AI enthusiast!', 'info');
            document.body.style.filter = 'hue-rotate(45deg)';
            setTimeout(() => {
                document.body.style.filter = '';
            }, 3000);
        }
    });
    
    console.log(`
    ╔══════════════════════════════════════════╗
    ║        🤖 AI ENCYCLOPEDIA LOADED        ║
    ║                                          ║
    ║  Keyboard shortcuts:                     ║
    ║  • Cmd/Ctrl + 1-9: Quick navigation     ║
    ║  • Arrow keys: Previous/Next chapter    ║
    ║  • Cmd/Ctrl + F: Search                 ║
    ║  • Esc: Return to introduction          ║
    ║                                          ║
    ║  Try the Konami code for a surprise! 😉  ║
    ╚══════════════════════════════════════════╝
    `);
});
