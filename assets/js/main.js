(function () {
  "use strict";

  var navbar = document.getElementById("navbar");
  var navHamburger = document.getElementById("navHamburger");
  var mobileMenu = document.getElementById("mobileMenu");

  window.addEventListener("scroll", function () {
    if (navbar) {
      navbar.classList.toggle("scrolled", window.scrollY > 10);
    }
  });

  if (navHamburger && mobileMenu) {
    navHamburger.addEventListener("click", function () {
      var opened = mobileMenu.classList.toggle("open");
      navHamburger.setAttribute("aria-expanded", String(opened));
    });

    mobileMenu.querySelectorAll("a").forEach(function (item) {
      item.addEventListener("click", function () {
        mobileMenu.classList.remove("open");
        navHamburger.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Mega-menu helper
  function makeMegaMenu(triggerId, menuId, navItemId) {
    var trigger = document.getElementById(triggerId);
    var menu = document.getElementById(menuId);
    var navItem = document.getElementById(navItemId);
    if (!trigger || !menu) return null;
    return { trigger: trigger, menu: menu, navItem: navItem };
  }

  function positionMenu(menu) {
    if (navbar && menu) {
      menu.style.top = navbar.getBoundingClientRect().bottom + "px";
    }
  }

  function closeMenu(m) {
    if (!m) return;
    m.menu.classList.remove("open");
    m.menu.setAttribute("aria-hidden", "true");
    m.trigger.setAttribute("aria-expanded", "false");
  }

  var treatmentsM = makeMegaMenu("treatmentsTrigger", "treatmentsMegaMenu", "treatmentsNavItem");
  var serumM = makeMegaMenu("serumTrigger", "serumMegaMenu", "serumNavItem");

  function closeAll() {
    closeMenu(treatmentsM);
    closeMenu(serumM);
  }

  function openMenu(m) {
    if (!m) return;
    positionMenu(m.menu);
    m.menu.classList.add("open");
    m.menu.setAttribute("aria-hidden", "false");
    m.trigger.setAttribute("aria-expanded", "true");
  }

  function initMegaMenu(m, allMenus) {
    if (!m) return;
    var closeTimer;

    function scheduleClose() {
      closeTimer = setTimeout(function () { closeMenu(m); }, 120);
    }
    function cancelClose() {
      clearTimeout(closeTimer);
    }

    // Hover on nav item
    m.navItem.addEventListener("mouseenter", function () {
      cancelClose();
      allMenus.forEach(function (x) { if (x !== m) closeMenu(x); });
      openMenu(m);
    });
    m.navItem.addEventListener("mouseleave", scheduleClose);

    // Keep open while hovering the panel itself
    m.menu.addEventListener("mouseenter", cancelClose);
    m.menu.addEventListener("mouseleave", scheduleClose);

    // Click navigates to the page (hover already handles menu open/close)
    // No preventDefault — follow the href directly
  }

  var allMenus = [treatmentsM, serumM];
  allMenus.forEach(function (m) { initMegaMenu(m, allMenus); });

  document.addEventListener("click", function (e) {
    allMenus.forEach(function (m) {
      if (!m) return;
      if (m.navItem && !m.navItem.contains(e.target) && !m.menu.contains(e.target)) {
        closeMenu(m);
      }
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeAll();
  });

  window.addEventListener("scroll", function () {
    allMenus.forEach(function (m) {
      if (m && m.menu.classList.contains("open")) positionMenu(m.menu);
    });
  });

  window.addEventListener("resize", function () {
    allMenus.forEach(function (m) {
      if (m && m.menu.classList.contains("open")) positionMenu(m.menu);
    });
  });

  // Concern links: store filter in sessionStorage for treatments.html
  if (treatmentsM) {
    treatmentsM.menu.querySelectorAll(".mega-concern-link").forEach(function (link) {
      link.addEventListener("click", function () {
        var concern = link.getAttribute("data-filter-concern");
        if (concern) sessionStorage.setItem("pendingConcernFilter", concern);
        closeMenu(treatmentsM);
      });
    });
  }

  // Hero slider
  var slides = document.querySelectorAll(".hero-slide");
  var dots = document.querySelectorAll(".slider-dot");
  var prev = document.getElementById("prevSlide");
  var next = document.getElementById("nextSlide");
  var current = 0;
  var timer;

  function renderSlide(index) {
    slides.forEach(function (slide, idx) {
      slide.classList.toggle("active", idx === index);
    });
    dots.forEach(function (dot, idx) {
      dot.classList.toggle("active", idx === index);
    });
    current = index;
  }

  function goToSlide(index) {
    var normalized = (index + slides.length) % slides.length;
    renderSlide(normalized);
    restartAutoSlide();
  }

  function restartAutoSlide() {
    clearInterval(timer);
    timer = setInterval(function () {
      goToSlide(current + 1);
    }, 6000);
  }

  if (slides.length > 0) {
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        var idx = Number(dot.getAttribute("data-slide"));
        goToSlide(idx);
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        goToSlide(current - 1);
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        goToSlide(current + 1);
      });
    }

    // Show first slide instantly (no transition), then enable transitions
    renderSlide(0);
    var heroSlider = document.querySelector(".hero-slider");
    setTimeout(function () {
      if (heroSlider) heroSlider.classList.add("is-loaded");
      restartAutoSlide();
    }, 50);
  }

  // Hash navigation: jump instantly to anchor on page load
  // (avoids the browser smooth-scrolling past the hero on cross-page nav)
  if (window.location.hash) {
    var target = document.querySelector(window.location.hash);
    if (target) {
      document.documentElement.style.scrollBehavior = "auto";
      target.scrollIntoView();
      setTimeout(function () {
        document.documentElement.style.scrollBehavior = "";
      }, 100);
    }
  }

  // Scroll reveal
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  document.querySelectorAll(".reveal").forEach(function (el) {
    revealObserver.observe(el);
  });

  // Checkbox multi-filter
  var filterChecks = document.querySelectorAll(".filter-check");
  var serviceCards = document.querySelectorAll(".services-grid-all .service-card");
  var filterResultsCount = document.getElementById("filterResultsCount");

  function getSelectedValues(group) {
    var values = [];
    filterChecks.forEach(function (check) {
      if (check.getAttribute("data-group") === group && check.checked) {
        values.push(check.getAttribute("data-value"));
      }
    });
    return values;
  }

  function applyCheckboxFilters() {
    var selectedTypes = getSelectedValues("type");
    var selectedConcerns = getSelectedValues("concern");

    var typeAll = selectedTypes.indexOf("all") !== -1;
    var concernAll = selectedConcerns.indexOf("all") !== -1;

    var visible = 0;
    serviceCards.forEach(function (card) {
      var typeTags = (card.getAttribute("data-type") || "").split(" ");
      var concernTags = (card.getAttribute("data-concern") || "").split(" ");

      var typeMatch = typeAll || selectedTypes.some(function (t) {
        return typeTags.indexOf(t) !== -1;
      });
      var concernMatch = concernAll || selectedConcerns.some(function (c) {
        return concernTags.indexOf(c) !== -1;
      });

      var show = typeMatch && concernMatch;
      card.classList.toggle("hidden", !show);
      if (show) visible++;
    });

    if (filterResultsCount) {
      filterResultsCount.innerHTML =
        "<strong>" + visible + "</strong> treatment" + (visible !== 1 ? "s" : "");
    }
  }

  function syncCheckboxGroup(group, changedCheck) {
    var value = changedCheck.getAttribute("data-value");
    var isChecked = changedCheck.checked;

    if (value === "all" && isChecked) {
      // Uncheck all specific options in this group
      filterChecks.forEach(function (c) {
        if (c.getAttribute("data-group") === group && c.getAttribute("data-value") !== "all") {
          c.checked = false;
        }
      });
    } else if (value !== "all") {
      if (isChecked) {
        // Uncheck the "all" option for this group
        filterChecks.forEach(function (c) {
          if (c.getAttribute("data-group") === group && c.getAttribute("data-value") === "all") {
            c.checked = false;
          }
        });
      }
      // If nothing specific is checked, restore "all"
      var anySpecificChecked = false;
      filterChecks.forEach(function (c) {
        if (c.getAttribute("data-group") === group && c.getAttribute("data-value") !== "all" && c.checked) {
          anySpecificChecked = true;
        }
      });
      if (!anySpecificChecked) {
        filterChecks.forEach(function (c) {
          if (c.getAttribute("data-group") === group && c.getAttribute("data-value") === "all") {
            c.checked = true;
          }
        });
      }
    }
  }

  // ── Before/After comparison sliders (results.html) ──────
  var baSliders = document.querySelectorAll(".ba-slider");

  baSliders.forEach(function (slider) {
    var before = slider.querySelector(".ba-before");
    var handle = slider.querySelector(".ba-handle");
    var active = false;

    function moveTo(clientX) {
      var rect = slider.getBoundingClientRect();
      var pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(2, Math.min(98, pct));
      before.style.clipPath = "inset(0 " + (100 - pct) + "% 0 0)";
      handle.style.left = pct + "%";
    }

    // Click anywhere on slider to jump position
    slider.addEventListener("click", function (e) {
      moveTo(e.clientX);
    });

    // Drag handle
    handle.addEventListener("mousedown", function (e) {
      active = true;
      e.preventDefault();
    });
    document.addEventListener("mousemove", function (e) {
      if (active) moveTo(e.clientX);
    });
    document.addEventListener("mouseup", function () {
      active = false;
    });

    // Touch support
    handle.addEventListener("touchstart", function () {
      active = true;
    }, { passive: true });
    document.addEventListener("touchmove", function (e) {
      if (active) {
        moveTo(e.touches[0].clientX);
        e.preventDefault();
      }
    }, { passive: false });
    document.addEventListener("touchend", function () {
      active = false;
    });
  });

  // ── Results filter pills (results.html) ──────────────────
  var rpFilters = document.querySelectorAll(".rp-filter");
  var rpCards = document.querySelectorAll(".ba-card");

  if (rpFilters.length > 0 && rpCards.length > 0) {
    rpFilters.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var filter = btn.getAttribute("data-filter");

        rpFilters.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");

        rpCards.forEach(function (card) {
          var concerns = card.getAttribute("data-concern") || "";
          var show = filter === "all" || concerns.indexOf(filter) !== -1;
          card.classList.toggle("rp-hidden", !show);
        });
      });
    });
  }

  // ── Shop product filter (shop.html) ──────────────────────
  var spFilters = document.querySelectorAll(".sp-filter");
  var productCards = document.querySelectorAll(".product-card");
  var spCount = document.getElementById("spCount");

  function applySpFilter(filter) {
    spFilters.forEach(function (b) { b.classList.remove("active"); });
    var matchBtn = document.querySelector('.sp-filter[data-filter="' + filter + '"]');
    if (matchBtn) matchBtn.classList.add("active");
    else if (spFilters[0]) spFilters[0].classList.add("active");

    var visible = 0;
    productCards.forEach(function (card) {
      var cardFilter = card.getAttribute("data-filter") || "";
      var show = filter === "all" || cardFilter === filter;
      card.classList.toggle("sp-hidden", !show);
      if (show) visible++;
    });
    if (spCount) spCount.textContent = String(visible);
  }

  if (spFilters.length > 0 && productCards.length > 0) {
    spFilters.forEach(function (btn) {
      btn.addEventListener("click", function () {
        applySpFilter(btn.getAttribute("data-filter"));
      });
    });

    // Deep-link support: shop.html#ageing etc.
    var hashFilter = window.location.hash.replace("#", "");
    if (hashFilter) applySpFilter(hashFilter);
  }

  if (filterChecks.length > 0 && serviceCards.length > 0) {
    // Check for pending concern filter from mega-menu navigation
    var pendingConcern = sessionStorage.getItem("pendingConcernFilter");
    if (pendingConcern) {
      sessionStorage.removeItem("pendingConcernFilter");
      filterChecks.forEach(function (check) {
        if (check.getAttribute("data-group") === "concern") {
          if (check.getAttribute("data-value") === pendingConcern) {
            check.checked = true;
          } else if (check.getAttribute("data-value") === "all") {
            check.checked = false;
          }
        }
      });
      applyCheckboxFilters();
    }

    filterChecks.forEach(function (check) {
      check.addEventListener("change", function () {
        var group = check.getAttribute("data-group");
        syncCheckboxGroup(group, check);
        applyCheckboxFilters();
      });
    });
  }
})();

// ── BOOKING FORM ──────────────────────────────────────────────
(function () {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  // Set minimum date to tomorrow
  const dateInput = form.querySelector('#bf-date');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];
  }

  // Pre-fill treatment from data-treatment attribute
  const preset = form.dataset.treatment;
  if (preset) {
    const sel = form.querySelector('#bf-treatment');
    if (sel) {
      for (const opt of sel.options) {
        if (opt.value === preset) { opt.selected = true; break; }
      }
    }
  }

  // Clear error highlight on input
  form.querySelectorAll('[required]').forEach(function (el) {
    el.addEventListener('input', function () { el.classList.remove('bf-error'); });
    el.addEventListener('change', function () { el.classList.remove('bf-error'); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name      = form.querySelector('#bf-name').value.trim();
    const phone     = form.querySelector('#bf-phone').value.trim();
    const treatment = form.querySelector('#bf-treatment').value;
    const date      = form.querySelector('#bf-date').value;
    const time      = form.querySelector('#bf-time').value;
    const notes     = form.querySelector('#bf-notes').value.trim();

    // Validate required fields
    let valid = true;
    form.querySelectorAll('[required]').forEach(function (el) {
      if (!el.value.trim()) { el.classList.add('bf-error'); valid = false; }
    });
    if (!valid) return;

    // Format date
    const dateObj = new Date(date + 'T00:00:00');
    const dateFormatted = dateObj.toLocaleDateString('en-KE', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    // Build WhatsApp message
    let msg = 'Hi, I\'d like to book an appointment at Face Needling.\n\n';
    msg += '*Name:* ' + name + '\n';
    msg += '*Phone:* ' + phone + '\n';
    msg += '*Treatment:* ' + treatment + '\n';
    msg += '*Date:* ' + dateFormatted + '\n';
    msg += '*Time:* ' + time;
    if (notes) msg += '\n*Notes:* ' + notes;

    window.open('https://wa.me/254706590440?text=' + encodeURIComponent(msg), '_blank');
  });
})();
