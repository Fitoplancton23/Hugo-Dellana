/* =========================================================
   HUGO DELLANA — PRESS KIT
   ========================================================= */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------- Reveal al scroll -------- */
  var reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && reveals.length && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* -------- Reveal en cascada de párrafos (Bio, Rider Técnico) -------- */
  var revealLines = document.querySelectorAll('.reveal-line');
  if ('IntersectionObserver' in window && revealLines.length && !reduce) {
    var lineIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); lineIO.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    revealLines.forEach(function (el) { lineIO.observe(el); });
  } else {
    revealLines.forEach(function (el) { el.classList.add('in'); });
  }

  /* -------- Nav: fondo sólido al scrollear -------- */
  var nav = document.getElementById('nav');
  function onScroll() {
    if (nav) nav.classList.toggle('solid', window.scrollY > 40);
    if (!reduce) parallax();
  }

  /* -------- Nav: link activo según sección visible -------- */
  var navLinks = [].slice.call(document.querySelectorAll('.nav__links a'));
  var targets = navLinks.map(function (a) {
    return document.querySelector(a.getAttribute('href'));
  });
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var i = targets.indexOf(e.target);
        navLinks.forEach(function (a, k) { a.classList.toggle('active', k === i); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    targets.forEach(function (t) { if (t) spy.observe(t); });
  }

  /* -------- Parallax sutil del hero -------- */
  var heroFig = document.querySelector('.hero__figure');
  function parallax() {
    if (!heroFig) return;
    var y = window.scrollY;
    if (y < window.innerHeight) {
      heroFig.style.transform = 'translateX(-50%) translateY(' + (y * 0.12) + 'px)';
    }
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { onScroll(); ticking = false; });
  }, { passive: true });
  onScroll();

  /* =========================================================
     GALERÍA — carrusel abanico impulsado por scroll (pin sticky)
     ========================================================= */
  (function fanScrollDriver() {
    var section = document.getElementById('galeria');
    var items = section ? [].slice.call(section.querySelectorAll('.fan-item')) : [];
    if (!section || !items.length) return;

    function progress() {
      var rect = section.getBoundingClientRect();
      var scrolled = window.innerHeight - rect.top;
      var p = (scrolled / rect.height) * 100;
      return Math.max(0, Math.min(100, p));
    }
    function update() {
      var activeFloat = (progress() / 100) * (items.length - 1);
      var activeRounded = Math.round(activeFloat);
      items.forEach(function (it, i) {
        var z = (activeRounded === i) ? items.length : items.length - Math.abs(activeRounded - i);
        it.style.setProperty('--zIndex', z);
        it.style.setProperty('--active', (i - activeFloat) / items.length);
      });
    }
    var ticking = false;
    function onGalleryScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { update(); ticking = false; });
    }
    update();
    window.addEventListener('scroll', onGalleryScroll, { passive: true });
    window.addEventListener('resize', onGalleryScroll, { passive: true });
  })();

  /* =========================================================
     FLYERS — carrusel cilindro 3D  (reutilizado)
     ========================================================= */
  (function cylinderCarousel() {
    var scene = document.querySelector('.cyl-scene');
    var ring = document.querySelector('.cyl-ring');
    if (!scene || !ring) return;
    var angle = 0, AUTO = -360 / 38000, SENS = 0.4;
    var hovering = false, dragging = false, startX = 0, startAngle = 0;

    scene.addEventListener('mouseenter', function () { hovering = true; });
    scene.addEventListener('mouseleave', function () { hovering = false; });
    scene.addEventListener('pointerdown', function (e) {
      dragging = true; startX = e.clientX; startAngle = angle; scene.classList.add('dragging');
      try { scene.setPointerCapture(e.pointerId); } catch (_) {}
    });
    scene.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      angle = startAngle + (e.clientX - startX) * SENS;   // si el sentido queda al revés, cambiá + por -
    });
    function endDrag(e) {
      if (!dragging) return;
      dragging = false; scene.classList.remove('dragging');
      try { scene.releasePointerCapture(e.pointerId); } catch (_) {}
    }
    scene.addEventListener('pointerup', endDrag);
    scene.addEventListener('pointercancel', endDrag);

    var last = performance.now();
    (function loop(now) {
      var dt = now - last; last = now;
      if (dt > 50) dt = 50;
      if (!dragging && !hovering) angle += AUTO * dt;
      ring.style.transform = 'rotateY(' + angle + 'deg)';
      requestAnimationFrame(loop);
    })(last);
  })();

})();
