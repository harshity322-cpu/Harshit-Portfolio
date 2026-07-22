/* ============================================
   Harshit Yadav — Portfolio JS
   Particles | Typing | Scroll | Cursor | Filters
   ============================================ */

(function () {
  'use strict';

  /* ---- DOM Elements ---- */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navLinkEls = document.querySelectorAll('.nav-link');
  // const cursorDot = document.getElementById('cursorDot'); //
  // const cursorRing = document.getElementById('cursorRing'); //
  const typedEl = document.getElementById('typedText');
  const backToTop = document.getElementById('backToTop');
  const contactForm = document.getElementById('contactForm');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const skillFills = document.querySelectorAll('.skill-fill');
  const statNumbers = document.querySelectorAll('.stat-number');

  /* ============================================
     PARTICLE BACKGROUND
     ============================================ */
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrame;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.4 + 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(124, 58, 237, ${this.opacity})`;
      ctx.fill();
    }
  }

  function initParticles() {
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 100);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(124, 58, 237, ${0.06 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    connectParticles();
    animFrame = requestAnimationFrame(animateParticles);
  }

  resizeCanvas();
  initParticles();
  animateParticles();

  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      resizeCanvas();
      initParticles();
    }, 200);
  });

  /* ============================================
     TYPING EFFECT
     ============================================ */
  const roles = [
    'Full Stack Developer',
    'React Developer',
    'Frontend Developer',
    'Node.js Developer',
    'Web Developer',
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 80;

  function typeEffect() {
    const current = roles[roleIndex];
    if (isDeleting) {
      typedEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40;
    } else {
      typedEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 80;
    }

    if (!isDeleting && charIndex === current.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 300;
    }

    setTimeout(typeEffect, typeSpeed);
  }
  typeEffect();

  /* ============================================
     CUSTOM CURSOR
     ============================================ */
  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .project-card, .filter-btn').forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      cursorRing.classList.add('hover');
    });
    el.addEventListener('mouseleave', function () {
      cursorRing.classList.remove('hover');
    });
  });

  /* ============================================
     NAVBAR
     ============================================ */
  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    updateActiveNav();
  });

  /* Mobile Nav Toggle */
  navToggle.addEventListener('click', function () {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  navLinkEls.forEach(function (link) {
    link.addEventListener('click', function () {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  /* Active Section */
  function updateActiveNav() {
    const sections = document.querySelectorAll('.section, .hero');
    let current = '';
    sections.forEach(function (section) {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });
    navLinkEls.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  /* ============================================
     BACK TO TOP
     ============================================ */
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ============================================
     SCROLL REVEAL ANIMATIONS
     ============================================ */
  function addRevealClasses() {
    document
      .querySelectorAll(
        '.skill-category, .project-card, .timeline-item, .education-card, .cert-card, .about-content, .about-image, .contact-info, .contact-form, .roadmap'
      )
      .forEach(function (el) {
        el.classList.add('reveal');
      });
  }
  addRevealClasses();

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          /* Animate skill bars when visible */
          if (entry.target.classList.contains('skill-category')) {
            entry.target.querySelectorAll('.skill-fill').forEach(function (fill) {
              fill.classList.add('animated');
            });
          }
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(function (el) {
    observer.observe(el);
  });

  /* ============================================
     COUNTER ANIMATION
     ============================================ */
  let countersAnimated = false;

  const counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          statNumbers.forEach(function (num) {
            const target = parseInt(num.getAttribute('data-target'));
            let current = 0;
            const increment = target / 40;
            const timer = setInterval(function () {
              current += increment;
              if (current >= target) {
                num.textContent = target;
                clearInterval(timer);
              } else {
                num.textContent = Math.floor(current);
              }
            }, 40);
          });
        }
      });
    },
    { threshold: 0.5 }
  );

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) counterObserver.observe(statsSection);

  /* ============================================
     PROJECT FILTERS
     ============================================ */
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      projectCards.forEach(function (card) {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ============================================
     CONTACT FORM
     ============================================ */
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    contactForm.innerHTML =
      '<div class="form-success">' +
      '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin:0 auto 16px;display:block;color:#22C55E"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' +
      '<h3 style="margin-bottom:8px;font-family:var(--font-heading);color:var(--text)">Message Sent!</h3>' +
      '<p style="color:var(--text-muted);font-size:0.9rem">Thanks for reaching out. I\'ll get back to you soon.</p>' +
      '</div>';
  });

  /* ============================================
     SCROLL ANIMATION KEYFRAMES (CSS Injection)
     ============================================ */
  var styleSheet = document.createElement('style');
  styleSheet.textContent =
    '@keyframes fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }';
  document.head.appendChild(styleSheet);

  /* ============================================
     SMOOTH ANCHOR SCROLL (fallback)
     ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ============================================
     TILT EFFECT ON PROJECT CARDS
     ============================================ */
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.project-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = (y - centerY) / 20;
        var rotateY = (centerX - x) / 20;
        card.style.transform =
          'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  /* ============================================
     MAGNETIC EFFECT ON BUTTONS
     ============================================ */
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.btn, .social-btn, .social-icon').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + x * 0.15 + 'px, ' + y * 0.15 + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  /* ============================================
     PARALLAX ON HERO SHAPE
     ============================================ */
  window.addEventListener('scroll', function () {
    var scrolled = window.scrollY;
    var heroShape = document.querySelector('.hero-shape');
    if (heroShape && scrolled < window.innerHeight) {
      heroShape.style.transform = 'translateY(' + scrolled * 0.15 + 'px)';
    }
  });


})();

const petBtn = document.getElementById("spawnPetBtn");

let petRunning = false;
let offBtn = null;

if (petBtn) {

   petBtn.addEventListener("click", function () {

    if (petRunning) return;

    if (window.spawnVirtualPet) {
        window.spawnVirtualPet();
    }

    document.getElementById("fishBtn").style.display = "inline-flex";

document.getElementById("yarnBtn").style.display = "inline-flex";

    petRunning = true;

    offBtn = document.createElement("span");

    offBtn.innerHTML = "✕";

    offBtn.style.marginLeft = "8px";
    offBtn.style.display = "inline-flex";
    offBtn.style.alignItems = "center";
    offBtn.style.justifyContent = "center";
    offBtn.style.width = "18px";
    offBtn.style.height = "18px";
    offBtn.style.borderRadius = "50%";
    offBtn.style.background = "#ff4d4f";
    offBtn.style.color = "#fff";
    offBtn.style.fontSize = "11px";
    offBtn.style.fontWeight = "700";
    offBtn.style.cursor = "pointer";

    petBtn.appendChild(offBtn);

    offBtn.addEventListener("click", function (e) {

        e.stopPropagation();

       if (window.destroyVirtualPet) {
    window.destroyVirtualPet();
}

document.getElementById("fishBtn").style.display = "none";

document.getElementById("yarnBtn").style.display = "none";

offBtn.remove();
offBtn = null;

petRunning = false;

window.__petStarted = false; 

    });

});

}
