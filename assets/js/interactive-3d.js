/**
 * 3D Interactive Card Tilt & Ambient Canvas Particle Mesh
 * High-performance 60fps implementation with RAF
 */

class Interactive3D {
  constructor() {
    this.initTiltCards();
    this.initCanvas();
    this.initMouseGlowTracking();
  }

  /* 3D Tilt for Hero Card & Interactive Cards */
  initTiltCards() {
    const cards = document.querySelectorAll('.tilt-card, .hero-card-3d');
    
    // Only enable on desktop / pointer devices
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      cards.forEach(card => {
        let isHovered = false;
        let rafId = null;

        card.addEventListener('mouseenter', () => {
          isHovered = true;
          card.style.transition = 'transform 0.1s ease-out';
        });

        card.addEventListener('mousemove', (e) => {
          if (!isHovered) return;

          if (rafId) cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(() => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Constrain rotation between -8 and +8 degrees for a subtle, high-end feel
            const rotateX = ((y - centerY) / centerY) * -7;
            const rotateY = ((x - centerX) / centerX) * 7;

            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(10px)`;
          });
        });

        card.addEventListener('mouseleave', () => {
          isHovered = false;
          if (rafId) cancelAnimationFrame(rafId);
          card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
          card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
      });
    }
  }

  /* Mouse coordinates tracking for dynamic radial card glows */
  initMouseGlowTracking() {
    document.addEventListener('mousemove', (e) => {
      const cards = document.querySelectorAll('.glass-card, .service-card, .project-card');
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        // Check if card is visible inside viewport
        if (
          e.clientX >= rect.left - 100 &&
          e.clientX <= rect.right + 100 &&
          e.clientY >= rect.top - 100 &&
          e.clientY <= rect.bottom + 100
        ) {
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
        }
      });
    });
  }

  /* Lightweight Ambient Canvas Mesh */
  initCanvas() {
    const canvas = document.getElementById('ambient-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 28000), 45);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.5 + 0.8,
        color: Math.random() > 0.4 ? 'rgba(255, 51, 102, ' : 'rgba(139, 92, 246, '
      });
    }

    let animationFrameId;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0) p1.x = width;
        if (p1.x > width) p1.x = 0;
        if (p1.y < 0) p1.y = height;
        if (p1.y > height) p1.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = p1.color + '0.5)';
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 51, 102, ${(1 - dist / 130) * 0.08})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // Pause canvas if tab is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        render();
      }
    });

    render();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Interactive3D();
});
