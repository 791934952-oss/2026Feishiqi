/**
 * 菲诗绮服装店官网 — Feishiqi Fashion Boutique
 * Main JavaScript
 */

(function () {
  'use strict';

  /* ---- Navigation ---- */
  function initNav() {
    const nav = document.querySelector('.site-nav');
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    if (!nav) return;

    const hero = document.querySelector('.hero, .page-hero--dark');
    if (hero && hero.classList.contains('page-hero--dark') === false && document.querySelector('.hero')) {
      nav.classList.add('nav-dark');
    }

    function onScroll() {
      if (window.scrollY > 60) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
      const floating = document.querySelector('.floating-cta');
      if (floating) {
        floating.classList.toggle('visible', window.scrollY > 400);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (toggle && links) {
      toggle.addEventListener('click', function () {
        toggle.classList.toggle('active');
        links.classList.toggle('open');
      });
      links.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          toggle.classList.remove('active');
          links.classList.remove('open');
        });
      });
    }

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      const href = a.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });
  }

  /* ---- Carousel ---- */
  function initCarousel() {
    document.querySelectorAll('.carousel').forEach(function (carousel) {
      const track = carousel.querySelector('.carousel__track');
      const slides = carousel.querySelectorAll('.carousel__slide');
      const dots = carousel.querySelectorAll('.carousel__dot');
      const prev = carousel.querySelector('.carousel__arrow--prev');
      const next = carousel.querySelector('.carousel__arrow--next');
      if (!track || slides.length === 0) return;

      let index = 0;
      let autoplayTimer;

      function goTo(i) {
        index = (i + slides.length) % slides.length;
        track.style.transform = 'translateX(-' + index * 100 + '%)';
        dots.forEach(function (dot, d) {
          dot.classList.toggle('active', d === index);
        });
      }

      function nextSlide() {
        goTo(index + 1);
      }

      function startAutoplay() {
        stopAutoplay();
        autoplayTimer = setInterval(nextSlide, 5000);
      }

      function stopAutoplay() {
        clearInterval(autoplayTimer);
      }

      if (next) next.addEventListener('click', function () { goTo(index + 1); startAutoplay(); });
      if (prev) prev.addEventListener('click', function () { goTo(index - 1); startAutoplay(); });

      dots.forEach(function (dot, d) {
        dot.addEventListener('click', function () {
          goTo(d);
          startAutoplay();
        });
      });

      carousel.addEventListener('mouseenter', stopAutoplay);
      carousel.addEventListener('mouseleave', startAutoplay);

      startAutoplay();
    });
  }

  /* ---- Reviews Carousel ---- */
  function initReviewsCarousel() {
    const wrapper = document.querySelector('.reviews-carousel');
    if (!wrapper) return;

    const track = wrapper.querySelector('.reviews-track');
    const slides = wrapper.querySelectorAll('.review-slide');
    const prev = wrapper.querySelector('[data-review-prev]');
    const next = wrapper.querySelector('[data-review-next]');
    if (!track || slides.length === 0) return;

    let index = 0;

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + index * 100 + '%)';
    }

    if (next) next.addEventListener('click', function () { goTo(index + 1); });
    if (prev) prev.addEventListener('click', function () { goTo(index - 1); });

    setInterval(function () { goTo(index + 1); }, 6000);
  }

  /* ---- Scroll Reveal ---- */
  function initReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---- Counter Animation ---- */
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'), 10);
          const duration = 2000;
          const start = performance.now();

          function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = target;
          }

          requestAnimationFrame(update);
          observer.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (c) {
      observer.observe(c);
    });
  }

  /* ---- Product Filter ---- */
  function initProductFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.product-card[data-category]');
    if (!filterBtns.length || !cards.length) return;

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const filter = btn.getAttribute('data-filter');
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        cards.forEach(function (card) {
          const cat = card.getAttribute('data-category') || '';
          const cats = cat.split(/\s+/);
          const show = filter === 'all' || cats.indexOf(filter) !== -1;
          card.style.display = show ? '' : 'none';
          if (show) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(12px)';
            requestAnimationFrame(function () {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          }
        });
      });
    });
  }

  /* ---- Contact Form ---- */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = form.querySelector('[name="name"]');
      const email = form.querySelector('[name="email"]');
      const message = form.querySelector('[name="message"]');
      let valid = true;

      [name, email, message].forEach(function (field) {
        if (!field || !field.value.trim()) {
          valid = false;
          field && (field.style.borderBottomColor = '#c45c5c');
        } else {
          field.style.borderBottomColor = '';
        }
      });

      if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        valid = false;
        email.style.borderBottomColor = '#c45c5c';
      }

      if (!valid) {
        showToast('请完善留言信息');
        return;
      }

      showToast('感谢您的留言，我们将尽快与您联系');
      form.reset();
    });
  }

  function showToast(msg) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function () {
      toast.classList.remove('show');
    }, 3000);
  }

  /* ---- Smooth anchor ---- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        const id = a.getAttribute('href');
        if (id.length < 2) return;
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ---- Init ---- */
  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initCarousel();
    initReviewsCarousel();
    initReveal();
    initCounters();
    initProductFilter();
    initContactForm();
    initSmoothScroll();
  });
})();
