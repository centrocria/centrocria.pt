(function () {
  'use strict';

  // --- Mobile Menu Toggle ---
  const toggle = document.querySelector('.navbar__toggle');
  const mobileMenu = document.querySelector('.navbar__mobile');

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function () {
      toggle.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Sticky Navbar ---
  const navbar = document.querySelector('.navbar');

  function handleScroll() {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --- Smooth Scroll ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var navHeight = navbar ? navbar.offsetHeight : 0;
        var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Active Nav Link Highlighting (Scroll Spy) ---
  function updateActiveNav() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.navbar__links a, .navbar__mobile a');
    var navHeight = navbar ? navbar.offsetHeight + 100 : 100;

    var currentSection = '';

    sections.forEach(function (section) {
      var sectionTop = section.offsetTop - navHeight;
      if (window.pageYOffset >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      var href = link.getAttribute('href');
      if (href && href.includes('#' + currentSection)) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // --- Testimonials Carousel ---
  document.querySelectorAll('.carousel').forEach(function (carousel) {
    var track = carousel.querySelector('.carousel__track');
    var slides = carousel.querySelectorAll('.carousel__slide');
    var prevBtn = carousel.querySelector('.carousel__btn--prev');
    var nextBtn = carousel.querySelector('.carousel__btn--next');
    var dotsContainer = carousel.querySelector('.carousel__dots');
    var currentIndex = 0;
    var autoplayInterval;

    function getSlidesPerView() {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 640) return 2;
      return 1;
    }

    function getMaxIndex() {
      return Math.max(0, slides.length - getSlidesPerView());
    }

    function updateCarousel() {
      var perView = getSlidesPerView();
      var slideWidth = 100 / perView;
      track.style.transform = 'translateX(-' + (currentIndex * slideWidth) + '%)';
      updateDots();
    }

    function updateDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      var maxIdx = getMaxIndex();
      for (var i = 0; i <= maxIdx; i++) {
        var dot = document.createElement('button');
        dot.className = 'carousel__dot' + (i === currentIndex ? ' active' : '');
        dot.setAttribute('aria-label', 'Ir para slide ' + (i + 1));
        (function (idx) {
          dot.addEventListener('click', function () {
            currentIndex = idx;
            updateCarousel();
            resetAutoplay();
          });
        })(i);
        dotsContainer.appendChild(dot);
      }
    }

    function next() {
      currentIndex = currentIndex >= getMaxIndex() ? 0 : currentIndex + 1;
      updateCarousel();
    }

    function prev() {
      currentIndex = currentIndex <= 0 ? getMaxIndex() : currentIndex - 1;
      updateCarousel();
    }

    function resetAutoplay() {
      clearInterval(autoplayInterval);
      autoplayInterval = setInterval(next, 3000);
    }

    if (nextBtn) nextBtn.addEventListener('click', function () { next(); resetAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); resetAutoplay(); });

    window.addEventListener('resize', function () {
      if (currentIndex > getMaxIndex()) currentIndex = getMaxIndex();
      updateCarousel();
    });

    carousel.addEventListener('mouseenter', function () { clearInterval(autoplayInterval); });
    carousel.addEventListener('mouseleave', function () { resetAutoplay(); });

    updateCarousel();
    autoplayInterval = setInterval(next, 3000);
  });

  // --- Evento Toggle (Saber mais / Mostrar menos) ---
  var toggleBtn = document.getElementById('toggleButton');
  var extraContent = document.getElementById('extraText');
  if (toggleBtn && extraContent) {
    toggleBtn.addEventListener('click', function () {
      var isShown = extraContent.classList.contains('show');
      if (isShown) {
        extraContent.classList.remove('show');
        toggleBtn.textContent = 'Saber mais';
      } else {
        extraContent.classList.add('show');
        toggleBtn.textContent = 'Mostrar menos';
      }
    });
  }

  // --- Intersection Observer for Scroll Animations ---
  var animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback for older browsers
    animatedElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // --- Page Transitions ---
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href) return;
    // Skip anchors, external links, new-tab links, and non-HTML links
    if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if (link.target === '_blank') return;
    if (link.origin && link.origin !== window.location.origin) return;
    // Only transition for internal page navigations
    e.preventDefault();
    document.body.classList.add('page-exit');
    setTimeout(function () {
      window.location.href = href;
    }, 250);
  });

  // --- Instagram Section: Dot-Grid Canvas Background ---
  (function () {
    var canvas = document.querySelector('.ig-section__canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    function paint() {
      var W = canvas.offsetWidth;
      var H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(42, 157, 143, 0.35)';
      for (var x = 14; x < W; x += 28) {
        for (var y = 14; y < H; y += 28) {
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    paint();
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(paint, 150);
    });
  })();

})();
