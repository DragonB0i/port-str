document.addEventListener('DOMContentLoaded', () => {
  
  // -------------------------------------------------------------
  // 0. Prefers Reduced Motion Detection
  // -------------------------------------------------------------
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // -------------------------------------------------------------
  // 1. Typing Animation for Hero Subtitle
  // -------------------------------------------------------------
  const typedTextSpan = document.getElementById('typed-text');
  const textArray = [
    "BACKEND DEVELOPER", 
    "CYBERSECURITY ENTHUSIAST", 
    "SYSTEM INTERNALS DEVELOPER",
    "EAGER LEARNER"
  ];
  const typingSpeed = 80;
  const erasingSpeed = 40;
  const newTextDelay = 2000; // Delay between current and next text
  let textArrayIndex = 0;
  let charIndex = 0;

  function type() {
    if (charIndex < textArray[textArrayIndex].length) {
      typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
      charIndex++;
      setTimeout(type, typingSpeed);
    } else {
      setTimeout(erase, newTextDelay);
    }
  }

  function erase() {
    if (charIndex > 0) {
      typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(erase, erasingSpeed);
    } else {
      textArrayIndex++;
      if (textArrayIndex >= textArray.length) textArrayIndex = 0;
      setTimeout(type, typingSpeed + 500);
    }
  }

  // Start typing on load
  if (typedTextSpan && textArray.length) setTimeout(type, 1000);

  // -------------------------------------------------------------
  // 2. Responsive Mobile Menu Toggle
  // -------------------------------------------------------------
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Close menu when links are clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }

  // -------------------------------------------------------------
  // 3. Scroll Reveal Animation (Intersection Observer)
  // -------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once revealed, no need to track it further
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // -------------------------------------------------------------
  // 4. Skills Bar Animation Trigger (Accessibility / Fallback)
  // -------------------------------------------------------------
  if (prefersReducedMotion) {
    const bars = document.querySelectorAll('.skill-bar');
    bars.forEach(bar => {
      bar.style.width = bar.getAttribute('data-percent');
    });
  }

  // -------------------------------------------------------------
  // 5. Active Link Highlighting on Scroll
  // -------------------------------------------------------------
  const sections = document.querySelectorAll('section');
  const header = document.getElementById('header');

  window.addEventListener('scroll', () => {
    if (!header) return;
    
    // Add box-shadow and darker backdrop to header when scrolled
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    let currentSectionId = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150; // Offset for header height
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // -------------------------------------------------------------
  // 6. Project Category Filtering
  // -------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Set active filter tab
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hide');
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          }, 50);
        } else {
          card.classList.add('hide');
        }
      });
    });
  });

  // -------------------------------------------------------------
  // 7. Custom Canvas Trailing Sparkle Animation (Cursor Trail)
  // -------------------------------------------------------------
  const trailCanvas = document.getElementById('trail-canvas');
  if (trailCanvas && !prefersReducedMotion) {
    const ctx = trailCanvas.getContext('2d');
    let particles = [];
    let animationFrameId = null;

    function resizeTrailCanvas() {
      trailCanvas.width = window.innerWidth;
      trailCanvas.height = window.innerHeight;
    }
    resizeTrailCanvas();
    window.addEventListener('resize', resizeTrailCanvas);

    class TrailParticle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 2;
        this.speedX = (Math.random() - 0.5) * 0.35;
        this.speedY = (Math.random() - 0.5) * 0.35;
        this.alpha = 1.0;
        this.decay = Math.random() * 0.02 + 0.02; // quick fading dither
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= this.decay;
      }

      draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
      }
    }

    function addTrailParticles(x, y) {
      for (let i = 0; i < 2; i++) {
        particles.push(new TrailParticle(x, y));
      }
      if (!animationFrameId) {
        tickTrail();
      }
    }

    function tickTrail() {
      ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
      
      particles.forEach((p, index) => {
        p.update();
        if (p.alpha <= 0) {
          particles.splice(index, 1);
        } else {
          p.draw();
        }
      });

      if (particles.length === 0) {
        ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
        animationFrameId = null;
      } else {
        animationFrameId = requestAnimationFrame(tickTrail);
      }
    }

    document.addEventListener('mousemove', (e) => {
      addTrailParticles(e.clientX, e.clientY);
    });
  }

  // -------------------------------------------------------------
  // 8. Section Canvas Managers (Modular Cosmic Animations)
  // -------------------------------------------------------------
  const canvases = {};
  const contexts = {};
  const activeLoops = {};
  const canvasIds = ['canvas-about', 'canvas-academic', 'canvas-experience', 'canvas-projects', 'canvas-skills', 'canvas-contact'];

  canvasIds.forEach(id => {
    const canvas = document.getElementById(id);
    if (canvas) {
      canvases[id] = canvas;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Canvas context unavailable');
      } else {
        contexts[id] = ctx;
      }
      activeLoops[id] = false;
    }
  });

  function resizeSectionCanvases() {
    canvasIds.forEach(id => {
      const canvas = canvases[id];
      if (canvas) {
        const parent = canvas.parentElement;
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        
        // Re-initialize section particle state on window resize
        if (id === 'canvas-about') initAbout();
        if (id === 'canvas-academic') initAcademic();
        if (id === 'canvas-experience') initExperience();
        if (id === 'canvas-projects') initProjects();
        if (id === 'canvas-skills') initSkills();
        if (id === 'canvas-contact') initContact();
      }
    });
  }
  
  // Sizing event listener registration (actual call moved to bottom of file)
  window.addEventListener('resize', resizeSectionCanvases);

  // --- SECTION 1: ABOUT ME (Twinkling starfield drifting downward) ---
  let aboutStars = [];
  function initAbout() {
    const canvas = canvases['canvas-about'];
    if (!canvas) return;
    aboutStars = [];
    const count = prefersReducedMotion ? 20 : 80;
    for (let i = 0; i < count; i++) {
      aboutStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.8 + 0.6,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        phase: Math.random() * Math.PI * 2,
        trailLength: Math.random() * 18 + 10
      });
    }
  }

  function drawAbout(ctx, canvas, scrollPercent) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const driftY = scrollPercent * 180; // stars drift downward on scroll

    aboutStars.forEach(star => {
      star.phase += star.twinkleSpeed;
      const alpha = Math.sin(star.phase) * 0.45 + 0.55;
      const drawY = (star.y + driftY) % canvas.height;

      // Draw faint trails
      if (!prefersReducedMotion && scrollPercent > 0.01) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.2})`;
        ctx.lineWidth = star.size * 0.6;
        ctx.beginPath();
        ctx.moveTo(star.x, drawY);
        ctx.lineTo(star.x, drawY - star.trailLength);
        ctx.stroke();
      }

      // Draw Star
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(star.x, drawY, star.size, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // --- SECTION 2: ACADEMIC DETAILS ("Lightfall" and bright bounds) ---
  let academicParticles = [];
  function initAcademic() {
    const canvas = canvases['canvas-academic'];
    if (!canvas) return;
    academicParticles = [];
    const count = prefersReducedMotion ? 10 : 35;
    for (let i = 0; i < count; i++) {
      academicParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.8,
        speed: Math.random() * 0.7 + 0.3,
        opacity: Math.random() * 0.6 + 0.4,
        trailLength: Math.random() * 45 + 25
      });
    }
  }

  function drawAcademic(ctx, canvas, scrollPercent) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    academicParticles.forEach(p => {
      if (!prefersReducedMotion) {
        // Particles slide downwards naturally + accelerated scroll drift
        p.y += p.speed + scrollPercent * 1.5;
      }
      if (p.y > canvas.height) {
        p.y = -p.trailLength;
        p.x = Math.random() * canvas.width;
      }

      // Soft glow trail gradient
      if (!prefersReducedMotion) {
        const grad = ctx.createLinearGradient(p.x, p.y, p.x, p.y - p.trailLength);
        grad.addColorStop(0, `rgba(255, 255, 255, ${p.opacity * 0.5})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = p.size;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x, p.y - p.trailLength);
        ctx.stroke();
      }

      // Core Particle
      ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Divider brightening effect
    const dividers = document.querySelectorAll('.section-divider');
    dividers.forEach(div => {
      const rect = div.getBoundingClientRect();
      const distFromCenter = Math.abs(rect.top - window.innerHeight / 2);
      // If divider is within 25% of viewport center, make it glow
      if (rect.top < window.innerHeight && rect.bottom > 0 && distFromCenter < window.innerHeight * 0.28) {
        div.classList.add('glow');
      } else {
        div.classList.remove('glow');
      }
    });
  }

  // --- SECTION 3: INTERNSHIP EXPERIENCE (Static stars + concentric ripples) ---
  let experienceStars = [];
  let experienceRipples = [];
  let rippleTimer = 0;

  function initExperience() {
    const canvas = canvases['canvas-experience'];
    if (!canvas) return;
    experienceStars = [];
    experienceRipples = [];
    const count = 50;
    for (let i = 0; i < count; i++) {
      experienceStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.2 + 0.4,
        alpha: Math.random() * 0.6 + 0.2
      });
    }
  }

  function addExperienceRipple(canvas) {
    if (prefersReducedMotion) return;
    experienceRipples.push({
      x: canvas.width * (0.2 + Math.random() * 0.6),
      y: canvas.height * (0.3 + Math.random() * 0.4),
      r: 2,
      maxR: Math.random() * 120 + 80,
      speed: Math.random() * 1.0 + 0.8,
      opacity: 0.75
    });
  }

  function drawExperience(ctx, canvas, scrollPercent) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw static backdrop particles
    experienceStars.forEach(star => {
      ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Create ripples periodically
    if (!prefersReducedMotion && activeLoops['canvas-experience']) {
      rippleTimer++;
      if (rippleTimer > 200) { // every ~3.3s
        addExperienceRipple(canvas);
        rippleTimer = 0;
      }
    }

    // Render ripples
    experienceRipples.forEach((ripple, index) => {
      ripple.r += ripple.speed;
      ripple.opacity = 1.0 - (ripple.r / ripple.maxR);

      if (ripple.opacity <= 0 || ripple.r >= ripple.maxR) {
        experienceRipples.splice(index, 1);
      } else {
        ctx.strokeStyle = `rgba(255, 255, 255, ${ripple.opacity * 0.4})`;
        ctx.lineWidth = 1.75;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.r, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
  }

  // --- SECTION 4: PROJECTS (Galaxy center glow + scroll starfall) ---
  let projectsStars = [];
  let projectsStarfall = [];

  function initProjects() {
    const canvas = canvases['canvas-projects'];
    if (!canvas) return;
    projectsStars = [];
    projectsStarfall = [];

    // Background stars
    const count = 75;
    for (let i = 0; i < count; i++) {
      projectsStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.2 + 0.4,
        alpha: Math.random() * 0.5 + 0.2
      });
    }

    // Dynamic starfall stars
    const fallCount = prefersReducedMotion ? 6 : 25;
    for (let i = 0; i < fallCount; i++) {
      projectsStarfall.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.8 + 0.8,
        speed: Math.random() * 3.5 + 1.5,
        trailLength: Math.random() * 40 + 30,
        alpha: Math.random() * 0.7 + 0.4
      });
    }
  }

  function drawProjects(ctx, canvas, scrollPercent) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Galaxy core glowing dust
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const sizeLimit = Math.max(canvas.width, canvas.height) * 0.45;
    const nebula = ctx.createRadialGradient(cx, cy, 30, cx, cy, sizeLimit);
    nebula.addColorStop(0, 'rgba(255, 255, 255, 0.04)');
    nebula.addColorStop(0.5, 'rgba(255, 255, 255, 0.01)');
    nebula.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = nebula;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Background stars
    projectsStars.forEach(star => {
      ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Scroll-linked starfall displacement
    const yDisplacement = scrollPercent * canvas.height * 0.85;

    projectsStarfall.forEach(star => {
      const drawY = (star.y + yDisplacement * (star.speed * 0.3)) % canvas.height;

      // Soft white starfall trail
      if (!prefersReducedMotion) {
        const trailGrad = ctx.createLinearGradient(star.x, drawY, star.x, drawY - star.trailLength);
        trailGrad.addColorStop(0, `rgba(255, 255, 255, ${star.alpha * 0.45})`);
        trailGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.strokeStyle = trailGrad;
        ctx.lineWidth = star.size * 0.8;
        ctx.beginPath();
        ctx.moveTo(star.x, drawY);
        ctx.lineTo(star.x, drawY - star.trailLength);
        ctx.stroke();
      }

      // Star Head
      ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
      ctx.beginPath();
      ctx.arc(star.x, drawY, star.size, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // --- SECTION 5: SKILLS (Subtle starfield + Diagonal scroll shooting star) ---
  let skillsStars = [];
  let shootingStar = null;

  function initSkills() {
    const canvas = canvases['canvas-skills'];
    if (!canvas) return;
    skillsStars = [];

    const count = 45;
    for (let i = 0; i < count; i++) {
      skillsStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.2 + 0.4,
        alpha: Math.random() * 0.5 + 0.2
      });
    }

    // Shooting Star trajectory across the screen
    shootingStar = {
      startX: -150,
      startY: canvas.height * 0.15,
      endX: canvas.width + 150,
      endY: canvas.height * 0.85,
      size: 4.5,
      glowSize: 15,
      trailLength: 240,
      phase: 0
    };
  }

  function drawSkills(ctx, canvas, scrollPercent) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Starfield
    skillsStars.forEach(star => {
      ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });

    if (shootingStar) {
      // Linear interpolation based on scroll position
      const cx = shootingStar.startX + scrollPercent * (shootingStar.endX - shootingStar.startX);
      const cy = shootingStar.startY + scrollPercent * (shootingStar.endY - shootingStar.startY);
      
      shootingStar.phase += 0.08;
      const glowAlpha = Math.sin(shootingStar.phase) * 0.3 + 0.7;

      // Shooting star diagonal trail
      if (!prefersReducedMotion) {
        const dx = shootingStar.endX - shootingStar.startX;
        const dy = shootingStar.endY - shootingStar.startY;
        const angle = Math.atan2(dy, dx);
        
        const trailX = cx - Math.cos(angle) * shootingStar.trailLength;
        const trailY = cy - Math.sin(angle) * shootingStar.trailLength;

        const trailGrad = ctx.createLinearGradient(cx, cy, trailX, trailY);
        trailGrad.addColorStop(0, `rgba(255, 255, 255, ${glowAlpha * 0.6})`);
        trailGrad.addColorStop(0.25, `rgba(255, 255, 255, ${glowAlpha * 0.3})`);
        trailGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.strokeStyle = trailGrad;
        ctx.lineWidth = shootingStar.size * 1.5;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(trailX, trailY);
        ctx.stroke();
      }

      // Draw head with glowing shadow effect
      ctx.shadowBlur = shootingStar.glowSize;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      ctx.fillStyle = `rgba(255, 255, 255, ${glowAlpha})`;
      ctx.beginPath();
      ctx.arc(cx, cy, shootingStar.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Reset canvas context shadow settings
      ctx.shadowBlur = 0;

      // Progressively reveal categories & expand skill bars as the shooting star crosses
      if (!prefersReducedMotion) {
        const skillCategories = document.querySelectorAll('.skills-category');
        skillCategories.forEach((cat, index) => {
          // Trigger thresholds tied to diagonal progression
          const triggerPoint = 0.15 + (index * 0.22);
          if (scrollPercent >= triggerPoint) {
            cat.classList.add('active');
            const bars = cat.querySelectorAll('.skill-bar');
            bars.forEach(bar => {
              const targetPct = bar.getAttribute('data-percent');
              bar.style.width = targetPct;
            });
          }
        });
      }
    }
  }

  // --- SECTION 6: GET IN TOUCH (Quiet twinkling background stars) ---
  let contactStars = [];
  function initContact() {
    const canvas = canvases['canvas-contact'];
    if (!canvas) return;
    contactStars = [];
    const count = prefersReducedMotion ? 15 : 45;
    for (let i = 0; i < count; i++) {
      contactStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.3 + 0.5,
        twinkleSpeed: Math.random() * 0.015 + 0.005,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  function drawContact(ctx, canvas, scrollPercent) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    contactStars.forEach(star => {
      star.phase += star.twinkleSpeed;
      const alpha = Math.sin(star.phase) * 0.35 + 0.55;

      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // -------------------------------------------------------------
  // 9. Lanyard Card Sway Physics (Interactive Spring Solver)
  // -------------------------------------------------------------
  const lanyardCard = document.querySelector('.lanyard-card');
  const lanyardStrap = document.querySelector('.lanyard-strap');
  const contactSection = document.getElementById('contact');

  let targetRotateX = 0;
  let targetRotateY = 0;
  let currentRotateX = 0;
  let currentRotateY = 0;
  let vx = 0;
  let vy = 0;
  const spring = 0.045; // spring stiffness
  const friction = 0.86; // friction damping
  let isMouseOverContact = false;

  if (contactSection && lanyardCard && !prefersReducedMotion) {
    contactSection.addEventListener('mousemove', (e) => {
      isMouseOverContact = true;
      const rect = lanyardCard.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;

      // Distance from mouse to card center
      const dx = e.clientX - cardCenterX;
      const dy = e.clientY - cardCenterY;

      // Convert layout displacement to rotational degrees (cap at 22deg)
      targetRotateY = (dx / window.innerWidth) * 26;
      targetRotateX = -(dy / window.innerHeight) * 26;

      targetRotateY = Math.min(Math.max(targetRotateY, -22), 22);
      targetRotateX = Math.min(Math.max(targetRotateX, -22), 22);
    });

    contactSection.addEventListener('mouseleave', () => {
      isMouseOverContact = false;
    });

    // Touch support for mobile devices
    contactSection.addEventListener('touchmove', (e) => {
      isMouseOverContact = true;
      const touch = e.touches[0];
      const rect = lanyardCard.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;

      const dx = touch.clientX - cardCenterX;
      const dy = touch.clientY - cardCenterY;

      targetRotateY = (dx / window.innerWidth) * 20;
      targetRotateX = -(dy / window.innerHeight) * 20;

      targetRotateY = Math.min(Math.max(targetRotateY, -16), 16);
      targetRotateX = Math.min(Math.max(targetRotateX, -16), 16);
    }, { passive: true });

    contactSection.addEventListener('touchend', () => {
      isMouseOverContact = false;
    });
  }

  function updateLanyardPhysics(time) {
    if (!lanyardCard) return;

    if (prefersReducedMotion) {
      lanyardCard.style.transform = 'none';
      if (lanyardStrap) lanyardStrap.style.transform = 'none';
      return;
    }

    if (!isMouseOverContact) {
      // Idle sway simulation using sin/cos time series
      const t = time * 0.0012;
      targetRotateY = Math.sin(t) * 2.8;
      targetRotateX = Math.cos(t * 0.7) * 1.4;
    }

    // Spring math updates
    const ax = (targetRotateX - currentRotateX) * spring;
    const ay = (targetRotateY - currentRotateY) * spring;

    vx += ax;
    vy += ay;
    vx *= friction;
    vy *= friction;

    currentRotateX += vx;
    currentRotateY += vy;

    // Apply rotation & 3D tilt
    lanyardCard.style.transform = `rotateX(${currentRotateX.toFixed(2)}deg) rotateY(${currentRotateY.toFixed(2)}deg) rotateZ(${(-currentRotateY * 0.15).toFixed(2)}deg)`;

    // Make strap follow rotating hanger point
    if (lanyardStrap) {
      lanyardStrap.style.transform = `rotateZ(${(currentRotateY * 0.4).toFixed(2)}deg)`;
    }
  }

  // -------------------------------------------------------------
  // 10. Individual Animation Loops & Intersection Observer Hookups
  // -------------------------------------------------------------
  const observerOptions = {
    threshold: 0.01,
    rootMargin: '100px 0px 100px 0px' // pre-load canvases when entering viewport borders
  };

  const animationFrameIds = {
    'canvas-about': null,
    'canvas-academic': null,
    'canvas-experience': null,
    'canvas-projects': null,
    'canvas-skills': null,
    'canvas-contact': null
  };

  function animateAbout() {
    if (!activeLoops['canvas-about']) {
      animationFrameIds['canvas-about'] = null;
      return;
    }
    const canvas = canvases['canvas-about'];
    const ctx = contexts['canvas-about'];
    if (canvas && ctx) {
      const scrollPercent = getScrollPercent(canvas.parentElement);
      drawAbout(ctx, canvas, scrollPercent);
    }
    animationFrameIds['canvas-about'] = requestAnimationFrame(animateAbout);
  }

  function animateAcademic() {
    if (!activeLoops['canvas-academic']) {
      animationFrameIds['canvas-academic'] = null;
      return;
    }
    const canvas = canvases['canvas-academic'];
    const ctx = contexts['canvas-academic'];
    if (canvas && ctx) {
      const scrollPercent = getScrollPercent(canvas.parentElement);
      drawAcademic(ctx, canvas, scrollPercent);
    }
    animationFrameIds['canvas-academic'] = requestAnimationFrame(animateAcademic);
  }

  function animateExperience() {
    if (!activeLoops['canvas-experience']) {
      animationFrameIds['canvas-experience'] = null;
      return;
    }
    const canvas = canvases['canvas-experience'];
    const ctx = contexts['canvas-experience'];
    if (canvas && ctx) {
      const scrollPercent = getScrollPercent(canvas.parentElement);
      drawExperience(ctx, canvas, scrollPercent);
    }
    animationFrameIds['canvas-experience'] = requestAnimationFrame(animateExperience);
  }

  function animateProjects() {
    if (!activeLoops['canvas-projects']) {
      animationFrameIds['canvas-projects'] = null;
      return;
    }
    const canvas = canvases['canvas-projects'];
    const ctx = contexts['canvas-projects'];
    if (canvas && ctx) {
      const scrollPercent = getScrollPercent(canvas.parentElement);
      drawProjects(ctx, canvas, scrollPercent);
    }
    animationFrameIds['canvas-projects'] = requestAnimationFrame(animateProjects);
  }

  function animateSkills() {
    if (!activeLoops['canvas-skills']) {
      animationFrameIds['canvas-skills'] = null;
      return;
    }
    const canvas = canvases['canvas-skills'];
    const ctx = contexts['canvas-skills'];
    if (canvas && ctx) {
      const scrollPercent = getScrollPercent(canvas.parentElement);
      drawSkills(ctx, canvas, scrollPercent);
    }
    animationFrameIds['canvas-skills'] = requestAnimationFrame(animateSkills);
  }

  function animateContact() {
    if (!activeLoops['canvas-contact']) {
      animationFrameIds['canvas-contact'] = null;
      return;
    }
    const canvas = canvases['canvas-contact'];
    const ctx = contexts['canvas-contact'];
    if (canvas && ctx) {
      const scrollPercent = getScrollPercent(canvas.parentElement);
      drawContact(ctx, canvas, scrollPercent);
    }
    animationFrameIds['canvas-contact'] = requestAnimationFrame(animateContact);
  }

  function startAnimation(id) {
    if (!activeLoops[id]) return;
    if (animationFrameIds[id]) return; // already running

    if (id === 'canvas-about') {
      animateAbout();
    } else if (id === 'canvas-academic') {
      animateAcademic();
    } else if (id === 'canvas-experience') {
      animateExperience();
    } else if (id === 'canvas-projects') {
      animateProjects();
    } else if (id === 'canvas-skills') {
      animateSkills();
    } else if (id === 'canvas-contact') {
      animateContact();
    }
  }

  function stopAnimation(id) {
    if (animationFrameIds[id]) {
      cancelAnimationFrame(animationFrameIds[id]);
      animationFrameIds[id] = null;
    }
  }

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const sectionId = entry.target.getAttribute('id');
      const canvasId = `canvas-${sectionId}`;
      if (entry.isIntersecting) {
        activeLoops[canvasId] = true;
        startAnimation(canvasId);
      } else {
        activeLoops[canvasId] = false;
        stopAnimation(canvasId);
      }
    });
  }, observerOptions);

  sections.forEach(sec => {
    sectionObserver.observe(sec);
  });

  // Always solve lanyard spring physics
  let lanyardAnimationFrameId = null;
  function animateLanyard(time) {
    updateLanyardPhysics(time);
    lanyardAnimationFrameId = requestAnimationFrame(animateLanyard);
  }
  if (lanyardCard && !prefersReducedMotion) {
    animateLanyard(0);
  }

  function getScrollPercent(el) {
    const rect = el.getBoundingClientRect();
    const viewHeight = window.innerHeight;
    const totalHeight = rect.height + viewHeight;
    const currentProgress = viewHeight - rect.top;
    return Math.min(Math.max(currentProgress / totalHeight, 0), 1);
  }

  // Initialize sizes and coordinates
  resizeSectionCanvases();
});
