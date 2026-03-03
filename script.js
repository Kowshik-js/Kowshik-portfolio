// ========================
// Navigation functionality
// ========================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.getElementById('navbar');

// ========================
// Dark / Light Mode Toggle
// ========================
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;

// Apply saved theme on page load
const savedTheme = localStorage.getItem('theme') || 'dark';
root.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
});

// Toggle mobile menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ========================
// Active nav link on scroll
// ========================
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ========================
// Contact form — Formspree AJAX
// ========================
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;

    // Loading state
    btn.disabled = true;
    btn.innerHTML = 'Sending…';

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value,
    };

    // ⚠️ IMPORTANT: Replace YOUR_FORM_ID with your actual Formspree form ID
    // Steps: 1) Go to https://formspree.io  2) Sign up free  3) Create New Form
    // 4) Copy the ID from the endpoint URL (e.g. "xabcdefg" from formspree.io/f/xabcdefg)
    const FORMSPREE_URL = 'https://formspree.io/f/YOUR_FORM_ID';

    try {
        const response = await fetch(FORMSPREE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            contactForm.reset();
            showFormFeedback('success', 'Message sent! I\'ll get back to you soon.');
            btn.innerHTML = 'Sent!';
            btn.style.background = 'linear-gradient(135deg,#43e97b,#38f9d7)';
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                btn.disabled = false;
            }, 4000);
        } else {
            const data = await response.json();
            throw new Error(data.error || 'Server error');
        }
    } catch (err) {
        showFormFeedback('error', 'Something went wrong. Email me directly at kowshikjs487@gmail.com');
        btn.innerHTML = originalHTML;
        btn.disabled = false;
    }
});

function showFormFeedback(type, message) {
    const existing = document.getElementById('form-feedback');
    if (existing) existing.remove();

    const el = document.createElement('div');
    el.id = 'form-feedback';
    el.textContent = message;
    const isSuccess = type === 'success';
    el.style.cssText = [
        'margin-top: 1rem',
        'padding: 0.875rem 1.25rem',
        'border-radius: 10px',
        'font-size: 0.9rem',
        'font-weight: 500',
        'animation: fadeInUp 0.4s ease both',
        isSuccess
            ? 'background: rgba(67,233,123,0.12); border: 1px solid rgba(67,233,123,0.35); color: #43e97b'
            : 'background: rgba(245,87,108,0.12); border: 1px solid rgba(245,87,108,0.35); color: #f5576c'
    ].join(';');

    contactForm.appendChild(el);
    if (isSuccess) setTimeout(() => el.remove(), 6000);
}

// ========================
// Smooth scroll
// ========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ========================
// Scroll-in animations
// ========================
const observerOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -80px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) translateX(0)';
        }
    });
}, observerOptions);

const animatables = document.querySelectorAll(
    '.project-card, .skill-block, .contact-card, .timeline-content, .cert-card, .info-card, .stat-item'
);

animatables.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = `opacity 0.55s ease ${index * 0.06}s, transform 0.55s ease ${index * 0.06}s`;
    observer.observe(el);
});
