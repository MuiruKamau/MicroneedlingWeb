/* ==========================================================
   FACE NEEDLING — MAIN JAVASCRIPT
   ========================================================== */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. HERO SLIDER
     ---------------------------------------------------------- */
  var slides   = document.querySelectorAll('.slide');
  var dots     = document.querySelectorAll('.slider-dot');
  var progress = document.getElementById('sp');
  var slider   = document.querySelector('.hero-slider');

  var current  = 0;
  var timer    = null;
  var interval = null;
  var pVal     = 0;
  var DURATION = 6000;
  var touchStartX = 0;

  function goToSlide(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    resetProgress();
  }

  function nextSlide() { goToSlide(current + 1); }
  function prevSlide()  { goToSlide(current - 1); }

  function resetProgress() {
    clearTimeout(timer);
    clearInterval(interval);
    pVal = 0;
    if (progress) progress.style.width = '0%';
    interval = setInterval(function () {
      pVal += 100 / (DURATION / 50);
      if (progress) progress.style.width = Math.min(pVal, 100) + '%';
    }, 50);
    timer = setTimeout(nextSlide, DURATION);
  }

  // Pause on hover
  if (slider) {
    slider.addEventListener('mouseenter', function () {
      clearTimeout(timer);
      clearInterval(interval);
    });
    slider.addEventListener('mouseleave', resetProgress);

    // Swipe support
    slider.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    slider.addEventListener('touchend', function (e) {
      var delta = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(delta) > 50) {
        delta > 0 ? nextSlide() : prevSlide();
      }
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft')  prevSlide();
  });

  // Expose to inline HTML onclick handlers
  window.goToSlide = goToSlide;
  window.nextSlide = nextSlide;
  window.prevSlide = prevSlide;

  // Start
  resetProgress();


  /* ----------------------------------------------------------
     2. NAVBAR — scroll shadow + mobile hamburger
     ---------------------------------------------------------- */
  var navbar     = document.getElementById('navbar');
  var hamburger  = document.getElementById('navHamburger');
  var mobileMenu = document.getElementById('mobileMenu');

  window.addEventListener('scroll', function () {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 10);
  });

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      }
    });
  }


  /* ----------------------------------------------------------
     3. SCROLL REVEAL
     ---------------------------------------------------------- */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });


  /* ----------------------------------------------------------
     4. PRODUCT CATEGORY FILTER
     ---------------------------------------------------------- */
  var filterBtns = document.querySelectorAll('.shop-cat-btn');
  var prodCards  = document.querySelectorAll('.prod-card');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      // Update active button
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var cat = btn.getAttribute('data-cat');

      // Show / hide cards
      prodCards.forEach(function (card) {
        if (cat === 'all' || card.getAttribute('data-cat') === cat) {
          card.classList.remove('hidden');
          // Tiny re-entrance animation
          card.style.animation = 'none';
          card.offsetHeight; // reflow
          card.style.animation = '';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });


  /* ----------------------------------------------------------
     5. CONTACT FORM — validation + submission feedback
     ---------------------------------------------------------- */
  var contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var nameEl    = document.getElementById('cf-name');
      var emailEl   = document.getElementById('cf-email');
      var phoneEl   = document.getElementById('cf-phone');
      var serviceEl = document.getElementById('cf-service');
      var msgEl     = document.getElementById('cf-message');
      var formMsg   = document.getElementById('formMsg');

      // Clear previous errors
      [nameEl, emailEl, phoneEl, serviceEl, msgEl].forEach(function (el) {
        if (el) el.classList.remove('error');
      });
      if (formMsg) { formMsg.className = 'form-msg'; formMsg.textContent = ''; }

      var valid = true;

      function flagError(el) {
        if (el) { el.classList.add('error'); valid = false; }
      }

      if (!nameEl || nameEl.value.trim() === '')          flagError(nameEl);
      if (!emailEl || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) flagError(emailEl);
      if (!phoneEl || phoneEl.value.trim() === '')        flagError(phoneEl);
      if (!serviceEl || serviceEl.value === '')           flagError(serviceEl);

      if (!valid) {
        if (formMsg) {
          formMsg.className = 'form-msg error-msg';
          formMsg.textContent = 'Please fill in all required fields correctly.';
        }
        return;
      }

      // Simulate submission (replace with real fetch/endpoint later)
      var submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      setTimeout(function () {
        if (formMsg) {
          formMsg.className = 'form-msg success';
          formMsg.textContent = 'Thank you! We will be in touch within 24 hours.';
        }
        contactForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        }
      }, 1200);
    });
  }


  /* ----------------------------------------------------------
     6. SMOOTH SCROLL for anchor links
     ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = navbar ? navbar.offsetHeight : 0;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

})();
