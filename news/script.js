// DOM Elements
const navbar = document.querySelector('.navbar');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const filterTabs = document.querySelectorAll('.filter-tab');
const articleCards = document.querySelectorAll('.article-card');
const newsletterForm = document.querySelector('.newsletter-form');
const loadMoreBtn = document.querySelector('.btn-load-more');

// Mobile Menu Toggle
mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    }
});

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        }
    });
});

// Filter Articles
filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Update active tab
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.dataset.filter;

        // Filter articles
        articleCards.forEach(card => {
            const category = card.dataset.category;

            if (filter === 'all' || category === filter) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Newsletter Form
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input').value;
        const btn = newsletterForm.querySelector('button');
        const originalText = btn.textContent;

        // Simulate submission
        btn.textContent = 'Subscribing...';
        btn.disabled = true;

        setTimeout(() => {
            btn.textContent = 'Subscribed!';
            btn.style.background = '#059669';
            newsletterForm.querySelector('input').value = '';

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        }, 1000);
    });
}

// Load More Button (simulated)
if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        const originalText = loadMoreBtn.textContent;
        loadMoreBtn.textContent = 'Loading...';
        loadMoreBtn.disabled = true;

        setTimeout(() => {
            // In a real app, this would fetch more articles
            loadMoreBtn.textContent = 'No More Articles';
            loadMoreBtn.disabled = true;
        }, 1500);
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeIn 0.5s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe article cards
document.querySelectorAll('.article-card, .category-card, .sidebar-article').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');

const updateActiveNavLink = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

        if (navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
            navLink.classList.add('active');
        }
    });
};

window.addEventListener('scroll', updateActiveNavLink);

// Search functionality (placeholder)
const searchBtn = document.querySelector('.search-btn');
if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        const query = prompt('Search articles:');
        if (query) {
            alert(`Searching for: "${query}"\n\nThis is a demo. In production, this would search articles.`);
        }
    });
}

// Clickable article cards
document.querySelectorAll('.article-card, .category-card, .sidebar-article, .opinion-article, .trending-list li').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
        // Don't trigger if clicking a link inside
        if (e.target.tagName === 'A') return;

        // Get the article title
        const title = card.querySelector('h3, h4, a');
        if (title) {
            console.log(`Clicked: ${title.textContent}`);
            // In production, this would navigate to the article
        }
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set first nav link as active if no hash
    if (!window.location.hash) {
        const homeLink = document.querySelector('.nav-links a[href="#"]');
        if (homeLink) {
            homeLink.classList.add('active');
        }
    }
});
