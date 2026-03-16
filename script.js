// ── Intersection Observer for Fade-In Animations ──
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll(
    '.polaroid, .video-wrapper'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const parent = entry.target.parentElement;
        const siblings = Array.from(parent.children).filter(
          child => child.classList.contains(entry.target.classList[0])
        );
        const index = siblings.indexOf(entry.target);
        const delay = index * 80;

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  animatedElements.forEach(el => observer.observe(el));

  // ── Setup Polaroid Clicks ──
  const polaroids = document.querySelectorAll('.polaroid');
  polaroids.forEach(p => {
    p.addEventListener('click', function() {
      const img = this.querySelector('img');
      if (img) openPhoto(img.src);
    });
  });

  // ESC key closes the photo modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePhoto();
  });

  // ── Hero scroll → trigger timeline autoplay ──
  setupHeroScrollTrigger();
});

// ── Splash Screen Handler ──
function startExperience() {
  const splash = document.getElementById('splashScreen');
  splash.classList.add('hidden');
  // Start balloon animation after splash fades
  setTimeout(() => {
    launchBalloons();
  }, 400);
}

// ── Hero Scroll Trigger ──
let timelineAutoplayDone = false;
let heroScrollHandled = false;

function setupHeroScrollTrigger() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  // Detect any downward scroll while hero is in view
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', function onHeroScroll() {
    if (timelineAutoplayDone || heroScrollHandled) {
      window.removeEventListener('scroll', onHeroScroll);
      return;
    }

    const currentScrollY = window.scrollY;
    const heroBottom = hero.getBoundingClientRect().bottom;

    // Trigger when scrolling down and hero is leaving viewport
    if (currentScrollY > lastScrollY && heroBottom < window.innerHeight * 0.6) {
      heroScrollHandled = true;
      window.removeEventListener('scroll', onHeroScroll);

      // Small delay then snap to timeline and start autoplay
      setTimeout(() => {
        enterTimelineAutoplay();
      }, 200);
    }

    lastScrollY = currentScrollY;
  }, { passive: true });
}

// ── Timeline Auto-Play Engine ──
function enterTimelineAutoplay() {
  const section = document.getElementById('timeline');
  const milestones = section.querySelectorAll('.milestone');
  const continueBtn = document.getElementById('timelineContinueBtn');
  const skipBtn = document.getElementById('timelineSkipBtn');
  const progressFill = document.getElementById('timelineProgressFill');

  // Prevent body scroll
  document.body.style.overflow = 'hidden';
  // Fullscreen mode
  section.classList.add('autoplay-mode');

  // Reset all cards to hidden
  milestones.forEach(m => m.classList.remove('visible', 'auto-visible'));

  const total = milestones.length;
  const interval = 1100; // ms between each card
  let current = 0;

  if (skipBtn) skipBtn.style.display = 'block';

  function revealNext() {
    if (current >= total) {
      if (progressFill) progressFill.style.width = '100%';
      setTimeout(() => {
        if (continueBtn) continueBtn.style.display = 'flex';
      }, 500);
      return;
    }
    milestones[current].classList.add('auto-visible');
    if (progressFill) {
      progressFill.style.width = ((current + 1) / total * 100) + '%';
    }
    current++;
    setTimeout(revealNext, interval);
  }

  setTimeout(revealNext, 600);
}



// ── Exit Timeline Auto-Play ──
function exitTimelineAutoplay() {
  const section = document.getElementById('timeline');
  const continueBtn = document.getElementById('timelineContinueBtn');
  const skipBtn = document.getElementById('timelineSkipBtn');
  const milestones = section.querySelectorAll('.milestone');

  timelineAutoplayDone = true;
  if (skipBtn) skipBtn.style.display = 'none';
  if (continueBtn) continueBtn.style.display = 'none';

  // Reveal all cards
  milestones.forEach(m => m.classList.add('auto-visible', 'visible'));

  // Exit fullscreen
  section.classList.remove('autoplay-mode');
  document.body.style.overflow = '';

  const gallery = document.getElementById('gallery');
  if (gallery) {
    setTimeout(() => gallery.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }
}



// ── Balloon & Stars Engine ──
function launchBalloons() {
  const canvas = document.getElementById('balloons-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const colors = ['#BF0426', '#4B95A6', '#6FB7BF', '#6E8C03', '#F2B705', '#FFD6E0', '#E8DDFF', '#FFDEC2'];

  // Balloons
  const balloons = [];
  for (let i = 0; i < 60; i++) {
    balloons.push({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 300 + 100,
      radius: Math.random() * 18 + 14,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 1.5 + 1.2,
      drift: (Math.random() - 0.5) * 0.4,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.02 + 0.01,
      opacity: Math.random() * 0.4 + 0.3
    });
  }

  // Stars / sparkles
  const stars = [];
  for (let i = 0; i < 30; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      opacity: 0,
      maxOpacity: Math.random() * 0.5 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.03 + 0.01,
      color: Math.random() > 0.5 ? '#F2B705' : '#FFD700'
    });
  }

  // Confetti
  const confetti = [];
  for (let i = 0; i < 60; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: -Math.random() * canvas.height,
      w: Math.random() * 8 + 4,
      h: Math.random() * 5 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 6,
      speedX: (Math.random() - 0.5) * 2,
      speedY: Math.random() * 2 + 1,
      opacity: 1,
      fadeStart: Math.random() * 150 + 80
    });
  }

  let frame = 0;

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame++;

    // Draw stars
    stars.forEach(s => {
      s.opacity = (Math.sin(s.phase + frame * s.speed) + 1) / 2 * s.maxOpacity;
      ctx.save();
      ctx.globalAlpha = s.opacity;
      ctx.fillStyle = s.color;
      // 4-point star
      ctx.beginPath();
      const spikes = 4;
      const outerR = s.size;
      const innerR = s.size * 0.4;
      for (let i = 0; i < spikes * 2; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const angle = (i * Math.PI) / spikes - Math.PI / 2;
        const px = s.x + Math.cos(angle) * r;
        const py = s.y + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });

    // Draw confetti (first 300 frames)
    if (frame < 300) {
      confetti.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        p.speedY += 0.02;

        if (frame > p.fadeStart) {
          p.opacity -= 0.006;
          if (p.opacity < 0) p.opacity = 0;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
    }

    // Draw balloons
    balloons.forEach(b => {
      b.y -= b.speedY;
      b.wobble += b.wobbleSpeed;
      const offsetX = Math.sin(b.wobble) * 15;

      if (b.y < -60) {
        b.y = canvas.height + 50;
        b.x = Math.random() * canvas.width;
      }

      ctx.save();
      ctx.globalAlpha = b.opacity;

      // String
      ctx.strokeStyle = 'rgba(0,0,0,0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(b.x + offsetX, b.y + b.radius);
      ctx.quadraticCurveTo(b.x + offsetX + 5, b.y + b.radius + 20, b.x + offsetX - 3, b.y + b.radius + 40);
      ctx.stroke();

      // Balloon body
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.ellipse(b.x + offsetX, b.y, b.radius * 0.85, b.radius, 0, 0, Math.PI * 2);
      ctx.fill();

      // Highlight
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.beginPath();
      ctx.ellipse(b.x + offsetX - b.radius * 0.25, b.y - b.radius * 0.25, b.radius * 0.25, b.radius * 0.35, -0.5, 0, Math.PI * 2);
      ctx.fill();

      // Knot
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.moveTo(b.x + offsetX - 3, b.y + b.radius);
      ctx.lineTo(b.x + offsetX + 3, b.y + b.radius);
      ctx.lineTo(b.x + offsetX, b.y + b.radius + 6);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

// ── Photo Lightbox Handler ──
function openPhoto(src) {
  const lightbox = document.getElementById('photoLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  
  if (!lightbox || !lightboxImg) return;
  
  lightboxImg.src = src;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent scroll
}

function closePhoto(event) {
  const lightbox = document.getElementById('photoLightbox');
  // If event is provided, only close if clicking backdrop or close button
  if (event && event.target !== lightbox && event.target.tagName !== 'BUTTON') return;

  lightbox.classList.remove('active');
  document.body.style.overflow = ''; // Restore scroll
}

