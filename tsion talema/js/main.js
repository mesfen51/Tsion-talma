// ===== MAIN JAVASCRIPT FILE =====

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    initializePortfolioFilters();
    initializeContactForm();
    initializeAnimations();
    loadPortfolioItems();
    loadTestimonials();
});

// ===== NAVIGATION =====
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Active navigation link
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ===== SCROLL EFFECTS =====
function initializeScrollEffects() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
}

// ===== PORTFOLIO FILTERS =====
function initializePortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    function setupFilters() {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');

                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // Get portfolio items
                const portfolioItems = document.querySelectorAll('.portfolio-item');

                // Filter portfolio items
                portfolioItems.forEach(item => {
                    const shouldShow = filter === 'all' || item.classList.contains(filter);

                    if (shouldShow) {
                        item.style.display = 'block';
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            if (item.style.opacity === '0') {
                                item.style.display = 'none';
                            }
                        }, 300);
                    }
                });
            });
        });

        console.log('Portfolio filters initialized');
    }

    // Initialize immediately for fallback content
    setupFilters();

    // Re-initialize after dynamic content loads
    setTimeout(setupFilters, 1000);
}

// ===== CONTACT FORM =====
function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (validateForm(data)) {
                // Show success message
                showMessage('Thank you for your message! I\'ll get back to you soon.', 'success');
                this.reset();
            }
        });
    }
}

function validateForm(data) {
    const { name, email, service, message } = data;
    
    if (!name.trim()) {
        showMessage('Please enter your name.', 'error');
        return false;
    }
    
    if (!email.trim() || !isValidEmail(email)) {
        showMessage('Please enter a valid email address.', 'error');
        return false;
    }
    
    if (!service) {
        showMessage('Please select a service.', 'error');
        return false;
    }
    
    if (!message.trim()) {
        showMessage('Please enter your message.', 'error');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    
    // Style the message
    messageDiv.style.cssText = `
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 0.5rem;
        font-weight: 500;
        ${type === 'success' 
            ? 'background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0;' 
            : 'background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5;'
        }
    `;
    
    // Insert message
    const contactForm = document.querySelector('.contact-form');
    contactForm.insertBefore(messageDiv, contactForm.firstChild);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// ===== ANIMATIONS =====
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .portfolio-item, .testimonial-item, .skill-item');
    animateElements.forEach(el => observer.observe(el));
}

// ===== PORTFOLIO DATA =====
function loadPortfolioItems() {
    const portfolioGrid = document.querySelector('.portfolio-grid');

    if (!portfolioGrid) {
        console.error('Portfolio grid not found');
        return;
    }

    const portfolioData = [
        {
            id: 1,
            title: 'Professional Fashion Portrait',
            category: 'modeling',
            image: 'assets/images/portfolio/fashion-tsion-1.jpg',
            description: 'Elegant studio fashion shoot showcasing contemporary style'
        },
        {
            id: 2,
            title: 'Runway Fashion Show',
            category: 'modeling',
            image: 'assets/images/portfolio/fashion-runway-1.jpg',
            description: 'Professional runway modeling showcasing contemporary fashion'
        },
        {
            id: 3,
            title: 'Fashion Editorial Shoot',
            category: 'modeling',
            image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=400&fit=crop&crop=face',
            description: 'High-fashion editorial for luxury brand'
        },
        {
            id: 4,
            title: 'TikTok Viral Campaign',
            category: 'content',
            image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop',
            description: 'Viral content creation for beauty brand'
        },
        {
            id: 5,
            title: 'Digital Marketing Strategy',
            category: 'marketing',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
            description: 'Complete digital transformation for startup'
        },
        {
            id: 6,
            title: 'Lifestyle Brand Collaboration',
            category: 'modeling',
            image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=400&fit=crop&crop=face',
            description: 'Brand ambassador campaign'
        },
        {
            id: 7,
            title: 'Social Media Content Series',
            category: 'content',
            image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop',
            description: 'Monthly content creation for fashion brand'
        },
        {
            id: 8,
            title: 'E-commerce Growth Campaign',
            category: 'marketing',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
            description: '300% increase in online sales'
        }
    ];

    try {
        portfolioGrid.innerHTML = portfolioData.map(item => `
            <div class="portfolio-item ${item.category}" style="opacity: 0; transform: scale(0.8); transition: all 0.3s ease;">
                <img src="${item.image}" alt="${item.title}" class="portfolio-image"
                     onerror="this.style.background='linear-gradient(135deg, #6366f1, #ec4899)'; this.style.display='flex'; this.style.alignItems='center'; this.style.justifyContent='center'; this.innerHTML='<span style=color:white;font-weight:bold;>${item.title}</span>';">
                <div class="portfolio-overlay">
                    <div class="portfolio-content">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                    </div>
                </div>
            </div>
        `).join('');

        // Animate items in
        setTimeout(() => {
            const items = portfolioGrid.querySelectorAll('.portfolio-item');
            items.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, index * 100);
            });
        }, 100);

        console.log('Portfolio items loaded successfully');
    } catch (error) {
        console.error('Error loading portfolio items:', error);
        // Keep the fallback content that's already in the HTML
        console.log('Using fallback portfolio content from HTML');
    }
}

// ===== TESTIMONIALS DATA =====
function loadTestimonials() {
    const testimonialsSlider = document.querySelector('.testimonials-slider');
    
    const testimonialsData = [
        {
            id: 1,
            text: "Tsion's creative vision and strategic approach transformed our brand's digital presence. Her content creation skills are exceptional, and she truly understands how to connect with audiences.",
            author: "Sarah Johnson",
            position: "Marketing Director, Fashion Forward",
            image: "assets/images/testimonials/client-1.jpg"
        },
        {
            id: 2,
            text: "Working with Tsion on our travel campaign was incredible. Her expertise as a licensed travel agent combined with her marketing skills delivered outstanding results.",
            author: "Michael Chen",
            position: "CEO, Adventure Travel Co.",
            image: "assets/images/testimonials/client-2.jpg"
        },
        {
            id: 3,
            text: "Tsion's authentic voice and creative content helped us reach a younger demographic. Her TikTok campaigns consistently go viral and drive real engagement.",
            author: "Emma Rodriguez",
            position: "Brand Manager, Beauty Collective",
            image: "assets/images/testimonials/client-3.jpg"
        }
    ];
    
    testimonialsSlider.innerHTML = testimonialsData.map(testimonial => `
        <div class="testimonial-item">
            <p class="testimonial-text">"${testimonial.text}"</p>
            <div class="testimonial-author">
                <img src="${testimonial.image}" alt="${testimonial.author}" class="author-image" onerror="this.src='assets/images/placeholder-avatar.jpg'">
                <div class="author-info">
                    <h4>${testimonial.author}</h4>
                    <p>${testimonial.position}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// ===== UTILITY FUNCTIONS =====
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

// Debounced scroll handler
window.addEventListener('scroll', debounce(updateActiveNavLink, 100));
