/* ===== INITIUM V3 — JS UNIFIÉ ===== */

(function () {
  'use strict';

  /* -------------------------------------------------- */
  /*  Curseur custom rouge                              */
  /* -------------------------------------------------- */
  const cursor = document.getElementById('cursor');
  if (cursor && window.innerWidth > 768 && !('ontouchstart' in window)) {
    document.addEventListener('mousemove', function (e) {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
    document.querySelectorAll('a, .btn, .card, .faq-question, button[type="submit"], select').forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursor.classList.add('cursor-dot--hover'); });
      el.addEventListener('mouseleave', function () { cursor.classList.remove('cursor-dot--hover'); });
    });
  } else if (cursor) {
    cursor.style.display = 'none';
  }

  /* -------------------------------------------------- */
  /*  Hamburger menu                                    */
  /* -------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  /* -------------------------------------------------- */
  /*  Nav scroll shrink                                 */
  /* -------------------------------------------------- */
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('site-nav--scrolled', window.scrollY > 80);
    });
  }

  /* -------------------------------------------------- */
  /*  Reveal au scroll (standard + variantes)           */
  /* -------------------------------------------------- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-scale, .reveal-clip, .reveal-blur');
  if (revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* -------------------------------------------------- */
  /*  Parallax GPU (translate3d + will-change)          */
  /* -------------------------------------------------- */
  var isMobile = window.innerWidth <= 768;
  if (!isMobile) {
    var parallaxEls = document.querySelectorAll('[data-parallax]');
    if (parallaxEls.length) {
      var ticking = false;
      // Set will-change on init
      parallaxEls.forEach(function (el) { el.style.willChange = 'transform'; });

      window.addEventListener('scroll', function () {
        if (!ticking) {
          requestAnimationFrame(function () {
            var scrollY = window.pageYOffset;
            parallaxEls.forEach(function (el) {
              var speed = parseFloat(el.dataset.parallax);
              var rect = el.getBoundingClientRect();
              var centerOffset = rect.top + rect.height / 2 - window.innerHeight / 2;
              var translateY = centerOffset * speed * -1;
              if (el.hasAttribute('data-scale-scroll')) {
                var progress = Math.max(0, Math.min(1, 1 - rect.top / window.innerHeight));
                var scale = 0.92 + progress * 0.12;
                var baseRotate = el.closest('.split__figure') ? 1.5 : -2;
                el.style.transform = 'translate3d(0,' + translateY + 'px,0) scale(' + scale + ') rotate(' + baseRotate + 'deg)';
              } else {
                el.style.transform = 'translate3d(0,' + translateY + 'px,0)';
              }
            });
            ticking = false;
          });
          ticking = true;
        }
      });
    }
  }

  /* -------------------------------------------------- */
  /*  FAQ Accordion + ARIA                              */
  /* -------------------------------------------------- */
  var faqButtons = document.querySelectorAll('.faq-question');
  if (faqButtons.length) {
    faqButtons.forEach(function (btn) {
      var answer = btn.nextElementSibling;
      // Init ARIA
      btn.setAttribute('aria-expanded', 'false');
      if (answer) { answer.setAttribute('role', 'region'); }

      btn.addEventListener('click', function () {
        var item = btn.parentElement;
        var wasOpen = item.classList.contains('open');

        // Close all
        document.querySelectorAll('.faq-item').forEach(function (i) {
          i.classList.remove('open');
          var b = i.querySelector('.faq-question');
          if (b) b.setAttribute('aria-expanded', 'false');
        });

        // Open this one if it was closed
        if (!wasOpen) {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* -------------------------------------------------- */
  /*  Form handler (fetch + inline confirmation)        */
  /* -------------------------------------------------- */
  var form = document.querySelector('.form-wrapper form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var submitBtn = form.querySelector('button[type="submit"]');
      var originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi en cours…';

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            form.innerHTML = '<div class="form-confirmation"><p class="t-lapidaire t-lapidaire--sm mb-16">Merci pour votre demande</p><p class="t-corps">Nous vous répondons sous 48h.</p></div>';
          } else {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            alert('Une erreur est survenue. Veuillez réessayer.');
          }
        })
        .catch(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          alert('Erreur de connexion. Veuillez réessayer.');
        });
    });
  }

  /* -------------------------------------------------- */
  /*  Marquee pause on hover                            */
  /* -------------------------------------------------- */
  var marquee = document.querySelector('.marquee');
  if (marquee) {
    marquee.addEventListener('mouseenter', function () {
      var track = marquee.querySelector('.marquee__track');
      if (track) track.style.animationPlayState = 'paused';
    });
    marquee.addEventListener('mouseleave', function () {
      var track = marquee.querySelector('.marquee__track');
      if (track) track.style.animationPlayState = 'running';
    });
  }

})();
