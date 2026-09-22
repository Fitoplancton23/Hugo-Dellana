/* =========================================================
   HUGO DELLANA — PRESS KIT
   El contenido editable (bio, videos, galería, fechas) se
   hidrata desde content.json. Si content.json no carga, se
   muestra el contenido estático del HTML como fallback.
   ========================================================= */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------- Reveal al scroll (secciones) -------- */
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

  /* -------- Reveal en cascada de párrafos estáticos (Rider Técnico) -------- */
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
     Helpers de contenido
     ========================================================= */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  // Acepta un ID de 11 caracteres o cualquier link de YouTube (watch, youtu.be, embed, shorts)
  function ytId(s) {
    s = String(s || '').trim();
    var m = s.match(/(?:youtu\.be\/|[?&]v=|embed\/|shorts\/|\/v\/)([A-Za-z0-9_-]{11})/);
    if (m) return m[1];
    if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
    return '';
  }

  function renderBio(list) {
    var box = document.querySelector('.bio-full__text');
    if (!box || !list || !list.length) return;
    box.innerHTML = list.map(function (t) {
      return '<p class="reveal-line in">' + esc(t) + '</p>';
    }).join('');
  }

  function renderVideos(list) {
    var grid = document.getElementById('videoGrid');
    if (!grid || !list) return;
    var html = list.map(function (v) {
      var id = ytId(v && v.youtube);
      if (!id) return '';
      return '<div class="yt" data-id="' + id + '">' +
             '<button class="yt__btn" type="button" aria-label="Reproducir video">' +
             '<span class="yt__play" aria-hidden="true"></span></button></div>';
    }).join('');
    if (html) grid.innerHTML = html;
  }

  function renderGaleria(list) {
    var grid = document.getElementById('gridGallery');
    if (!grid || !list) return;
    var html = list.map(function (p, i) {
      var src = String((p && p.src) || '').replace(/^\//, '');
      if (!src) return '';
      var dim = (p.w && p.h) ? ' width="' + p.w + '" height="' + p.h + '"' : '';
      var alt = esc(p.alt || ('Hugo Dellana en vivo — ' + (i + 1)));
      return '<button class="gitem" type="button" data-full="' + esc(src) + '" aria-label="Ampliar foto ' + (i + 1) + '">' +
             '<img src="' + esc(src) + '" alt="' + alt + '" loading="lazy"' + dim + '></button>';
    }).join('');
    if (html) grid.innerHTML = html;
  }

  function renderFechas(list) {
    var ul = document.querySelector('.dates__list');
    if (!ul || !list) return;
    ul.innerHTML = list.map(function (d) {
      d = d || {};
      return '<li class="date">' +
             '<span class="date__d">' + esc(d.fecha) + '</span>' +
             '<span class="date__v">' + esc(d.evento) + '</span>' +
             '<span class="date__c">' + esc(d.ciudad) + '</span>' +
             '<span class="date__s">' + esc(d.estado) + '</span></li>';
    }).join('');
  }

  /* =========================================================
     GALERÍA — lightbox (click / teclado / swipe, sin secuestrar scroll)
     ========================================================= */
  function galleryLightbox() {
    var grid = document.getElementById('gridGallery');
    var lb = document.getElementById('lightbox');
    if (!grid || !lb) return;
    var img = document.getElementById('lbImg');
    var cap = document.getElementById('lbCap');
    var btns = [].slice.call(grid.querySelectorAll('.gitem'));
    if (!btns.length) return;
    var data = btns.map(function (b) {
      var im = b.querySelector('img');
      return { src: b.getAttribute('data-full'), alt: im ? im.getAttribute('alt') : '' };
    });
    var idx = 0;
    function show(i) {
      idx = (i + data.length) % data.length;
      img.setAttribute('src', data[idx].src);
      img.setAttribute('alt', data[idx].alt || '');
      cap.textContent = (idx + 1) + ' / ' + data.length;
    }
    function openAt(i) {
      show(i);
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.classList.add('no-scroll');
    }
    function close() {
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('no-scroll');
    }
    btns.forEach(function (b, i) { b.addEventListener('click', function () { openAt(i); }); });
    var next = document.getElementById('lbNext');
    var prev = document.getElementById('lbPrev');
    var closeBtn = document.getElementById('lbClose');
    if (next) next.addEventListener('click', function () { show(idx + 1); });
    if (prev) prev.addEventListener('click', function () { show(idx - 1); });
    if (closeBtn) closeBtn.addEventListener('click', close);
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') show(idx + 1);
      else if (e.key === 'ArrowLeft') show(idx - 1);
    });
    var sx = 0;
    lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }

  /* =========================================================
     FLYERS — carrusel cilindro 3D
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
      angle = startAngle + (e.clientX - startX) * SENS;
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

  /* =========================================================
     VIDEOS — facade: carga el iframe de YouTube recién al click
     ========================================================= */
  function ytFacade() {
    var grid = document.getElementById('videoGrid');
    if (!grid) return;
    [].slice.call(grid.querySelectorAll('.yt')).forEach(function (el) {
      if (el.dataset.wired) return;
      var id = el.getAttribute('data-id');
      if (!id) return;
      el.dataset.wired = '1';
      el.style.backgroundImage = "url('https://i.ytimg.com/vi/" + id + "/hqdefault.jpg')";
      var probe = new Image();
      probe.onload = function () {
        if (probe.naturalWidth > 120) {
          el.style.backgroundImage = "url('https://i.ytimg.com/vi/" + id + "/maxresdefault.jpg')";
        }
      };
      probe.src = "https://i.ytimg.com/vi/" + id + "/maxresdefault.jpg";
      var btn = el.querySelector('.yt__btn');
      function play() {
        var f = document.createElement('iframe');
        f.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
        f.setAttribute('allowfullscreen', '');
        f.setAttribute('title', 'YouTube video — Hugo Dellana');
        f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
        el.classList.add('playing');
        el.innerHTML = '';
        el.appendChild(f);
      }
      if (btn) btn.addEventListener('click', play);
    });
  }

  /* =========================================================
     Hidratación desde content.json (con fallback al HTML estático)
     ========================================================= */
  function wireInteractive() {
    galleryLightbox();
    ytFacade();
  }
  if (!window.fetch) {
    wireInteractive();
  } else {
    fetch('content.json', { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error('no content.json'); return r.json(); })
      .then(function (d) {
        if (d.bio) renderBio(d.bio);
        if (d.videos) renderVideos(d.videos);
        if (d.galeria) renderGaleria(d.galeria);
        if (d.fechas) renderFechas(d.fechas);
      })
      .catch(function () { /* fallback: se queda el HTML estático */ })
      .then(function () { wireInteractive(); });
  }

})();
