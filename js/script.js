// Bento-style skill card flip and fade-in
document.addEventListener('DOMContentLoaded', function() {
  // Fade-in on scroll
  const skillCards = document.querySelectorAll('.skill-card');
  const observer = new window.IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  skillCards.forEach(card => observer.observe(card));

  // Flip on hover for desktop, on tap/click for mobile
  function isTouchDevice() {
    return (('ontouchstart' in window) || navigator.maxTouchPoints > 0);
  }
  if (isTouchDevice()) {
    skillCards.forEach(card => {
      card.addEventListener('click', function(e) {
        // Flip back any other flipped card
        skillCards.forEach(c => {
          if (c !== card) c.classList.remove('flipped');
        });
        card.classList.toggle('flipped');
      });
      card.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          // Flip back any other flipped card
          skillCards.forEach(c => {
            if (c !== card) c.classList.remove('flipped');
          });
          card.classList.toggle('flipped');
        }
      });
    });
  } else {
    skillCards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        card.classList.add('flipped');
      });
      card.addEventListener('mouseleave', function() {
        card.classList.remove('flipped');
      });
    });
  }
});
// === Skill badge flipping logic ===
document.addEventListener('DOMContentLoaded', function() {
  const skillBadges = document.querySelectorAll('.about-box .skill-badge');
  skillBadges.forEach(badge => {
    badge.addEventListener('click', function(e) {
      // Only flip if not already flipped
      if (!badge.classList.contains('flipped')) {
        skillBadges.forEach(b => b.classList.remove('flipped'));
        badge.classList.add('flipped');
        badge.classList.add('skill-badge-active');
      } else {
        badge.classList.remove('flipped');
        badge.classList.remove('skill-badge-active');
      }
    });
    badge.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        badge.click();
      }
    });
    badge.setAttribute('tabindex', '0');
    badge.style.outline = 'none';
    // Flip back and unfocus on mouseleave
    badge.addEventListener('mouseleave', function() {
      badge.classList.remove('flipped');
      badge.classList.remove('skill-badge-active');
      badge.blur();
    });
    // Flip back and unfocus on blur (keyboard navigation)
    badge.addEventListener('blur', function() {
      badge.classList.remove('flipped');
      badge.classList.remove('skill-badge-active');
    });
  });
});


// === Hero Section Generative Canvas Background ===
document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('hero-bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h;
  function resize() {
    w = canvas.offsetWidth = canvas.parentElement.offsetWidth;
    h = canvas.offsetHeight = canvas.parentElement.offsetHeight;
    canvas.width = w;
    canvas.height = h;
  }
  resize();
  window.addEventListener('resize', resize);

  const AGENT_COUNT = 40;
  const MAX_SPEED = 1.2;
  const MIN_RADIUS = 2.5;
  const MAX_RADIUS = 5.5;
  const LINK_DIST = 120;
  const agents = [];
  function rand(a, b) { return a + Math.random() * (b - a); }
  for (let i = 0; i < AGENT_COUNT; i++) {
    agents.push({
      x: rand(0, w),
      y: rand(0, h),
      vx: rand(-MAX_SPEED, MAX_SPEED),
      vy: rand(-MAX_SPEED, MAX_SPEED),
      r: rand(MIN_RADIUS, MAX_RADIUS)
    });
  }

  function update() {
    for (const a of agents) {
      a.x += a.vx;
      a.y += a.vy;
      // Edge wrapping
      if (a.x < 0) a.x += w;
      if (a.x > w) a.x -= w;
      if (a.y < 0) a.y += h;
      if (a.y > h) a.y -= h;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    // Draw lines between close agents
    for (let i = 0; i < AGENT_COUNT; i++) {
      for (let j = i + 1; j < AGENT_COUNT; j++) {
        const a = agents[i], b = agents[j];
        // Consider wrapping for shortest distance
        let dx = Math.abs(a.x - b.x);
        let dy = Math.abs(a.y - b.y);
        if (dx > w / 2) dx = w - dx;
        if (dy > h / 2) dy = h - dy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          ctx.save();
          ctx.strokeStyle = 'rgba(111,75,42,' + (1 - dist / LINK_DIST) * 0.45 + ')';
          ctx.lineWidth = 2.5 - 2 * (dist / LINK_DIST);
          ctx.beginPath();
          // Draw line considering wrapping
          let x1 = a.x, y1 = a.y, x2 = b.x, y2 = b.y;
          if (Math.abs(a.x - b.x) > w / 2) {
            if (a.x > b.x) x1 -= w; else x2 -= w;
          }
          if (Math.abs(a.y - b.y) > h / 2) {
            if (a.y > b.y) y1 -= h; else y2 -= h;
          }
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
    // Draw agents
    for (const a of agents) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(111,75,42,0.22)';
      ctx.shadowColor = '#6b4b2a';
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.restore();
    }
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }
  loop();
});

// === End Hero Section Generative Canvas Background ===



// AOS Animation Library Init
if (window.AOS) {
  AOS.init({ once: true, duration: 800 });
}

// Carousel & Lightbox logic
const carouselTrack = document.querySelector('.carousel-track');
const carouselItems = Array.from(document.querySelectorAll('.carousel-item'));
const prevBtn = document.querySelector('.carousel-arrow.left');
const nextBtn = document.querySelector('.carousel-arrow.right');
const dotsContainer = document.querySelector('.carousel-dots');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentIndex = 0;

// Create dots
carouselItems.forEach((_, idx) => {
  const dot = document.createElement('button');
  dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
  if (idx === 0) dot.classList.add('active');
  dotsContainer.appendChild(dot);
});
const dots = Array.from(dotsContainer.children);

function updateCarousel() {
  carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
  dots.forEach((dot, idx) => dot.classList.toggle('active', idx === currentIndex));
}

function goToSlide(idx) {
  currentIndex = (idx + carouselItems.length) % carouselItems.length;
  updateCarousel();
}

prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
dots.forEach((dot, idx) => dot.addEventListener('click', () => goToSlide(idx)));

// Lightbox logic
let lightboxIndex = 0;
function openLightbox(idx) {
  lightboxIndex = idx;
  lightboxImg.src = carouselItems[lightboxIndex].querySelector('img').src;
  lightbox.classList.add('open');
}
function closeLightbox() {
  lightbox.classList.remove('open');
  lightboxImg.src = '';
}
function lightboxNav(dir) {
  lightboxIndex = (lightboxIndex + dir + carouselItems.length) % carouselItems.length;
  lightboxImg.src = carouselItems[lightboxIndex].querySelector('img').src;
}
carouselItems.forEach((item, idx) => {
  item.addEventListener('click', () => openLightbox(idx));
});
lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', () => lightboxNav(-1));
lightboxNext.addEventListener('click', () => lightboxNav(1));
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') lightboxNav(-1);
  if (e.key === 'ArrowRight') lightboxNav(1);
});

updateCarousel();
// === End Carousel & Lightbox ===

// Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const yOffset = -document.querySelector('.navbar').offsetHeight;
      const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      // Close nav on mobile after click
      if (window.innerWidth <= 700) {
        navLinks.classList.remove('open');
      }
    }
  });
});

