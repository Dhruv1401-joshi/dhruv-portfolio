/**
 * Main Controller — Navbar, Rotating Role Typer, Stats Count-Up, Scroll Reveals
 */

class PortfolioApp {
  constructor() {
    this.initNavbar();
    this.initMobileMenu();
    this.initRoleTyper();
    this.initStatsCountUp();
    this.initScrollReveals();
    this.initProcessSteps();
  }

  /* Sticky Navbar on Scroll */
  initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /* Mobile Navigation Drawer */
  initMobileMenu() {
    const toggleBtn = document.getElementById('nav-toggle-btn');
    const drawer = document.getElementById('mobile-nav-drawer');
    const links = document.querySelectorAll('.mobile-nav-links .nav-link');

    if (!toggleBtn || !drawer) return;

    toggleBtn.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
      toggleBtn.innerHTML = isOpen ? '&times;' : '&#9776;';
    });

    links.forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.innerHTML = '&#9776;';
      });
    });
  }

  /* Rotating Role Typewriter System */
  initRoleTyper() {
    const roleTarget = document.getElementById('hero-rotating-role');
    if (!roleTarget) return;

    const roles = [
      'Web Developer',
      'AI Automation Specialist',
      'Software Builder',
      'Founder',
      'Co-Founder & CEO — Yrex'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    const type = () => {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        roleTarget.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 45;
      } else {
        roleTarget.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 90;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        // Pause at full word
        typingSpeed = 2200;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 400;
      }

      setTimeout(type, typingSpeed);
    };

    setTimeout(type, 600);
  }

  /* Verified Stats Count-Up Animation */
  initStatsCountUp() {
    const statsContainer = document.querySelector('.stats-card-container');
    const statNumbers = document.querySelectorAll('.stat-number');

    if (!statsContainer || !statNumbers.length) return;

    let hasAnimated = false;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;

          statNumbers.forEach(el => {
            const target = parseInt(el.dataset.target, 10);
            const duration = 1600;
            const startTime = performance.now();

            const updateCount = (now) => {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease-out cubic
              const easeOut = 1 - Math.pow(1 - progress, 3);
              const currentVal = Math.floor(easeOut * target);

              el.textContent = currentVal;

              if (progress < 1) {
                requestAnimationFrame(updateCount);
              } else {
                el.textContent = target;
              }
            };

            requestAnimationFrame(updateCount);
          });
        }
      });
    }, { threshold: 0.25 });

    observer.observe(statsContainer);
  }

  /* Scroll-Triggered Reveal Animations */
  initScrollReveals() {
    const reveals = document.querySelectorAll('.reveal-on-scroll');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => observer.observe(el));
  }

  /* Work Process Step Interactive Highlight */
  initProcessSteps() {
    const steps = document.querySelectorAll('.process-step-card');
    if (!steps.length) return;

    steps.forEach(step => {
      step.addEventListener('click', () => {
        steps.forEach(s => s.classList.remove('active'));
        step.classList.add('active');
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new PortfolioApp();
});
