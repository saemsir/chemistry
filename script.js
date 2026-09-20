(() => {
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  // Mobile navigation
  const menuToggle = $('#menuToggle');
  const siteNav = $('#siteNav');
  const closeMenu = () => {
    siteNav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('menu-open');
  };

  menuToggle?.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('menu-open', isOpen);
  });

  $$('.site-nav a').forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (window.innerWidth > 760) closeMenu(); });

  // Reveal-on-scroll
  const revealItems = $$('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(el => revealObserver.observe(el));

  // Number counters
  const counters = $$('[data-count]');
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count || 0);
      const duration = 900;
      const start = performance.now();
      const tick = now => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = String(Math.round(target * eased));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterObserver.observe(el));

  // Web3Forms submission without leaving the page.
  const form = $('#enquiryForm');
  const status = $('#formStatus');
  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const submitButton = $('.form-submit', form);
    const buttonText = $('span', submitButton);
    const originalText = buttonText.textContent;
    status.textContent = 'Sending enquiry…';
    status.className = 'form-status';
    submitButton.disabled = true;
    buttonText.textContent = 'Sending…';

    try {
      const formData = new FormData(form);
      formData.set('botcheck', '');
      formData.set('page_url', window.location.href);

      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false) {
        throw new Error(result.message || 'Unable to submit the enquiry.');
      }

      status.textContent = 'Thank you. Your enquiry has been sent successfully.';
      status.className = 'form-status success';
      form.reset();
    } catch (error) {
      console.error(error);
      status.textContent = 'Submission failed. Please try WhatsApp or call +91 7033131480.';
      status.className = 'form-status error';
    } finally {
      submitButton.disabled = false;
      buttonText.textContent = originalText;
    }
  });

  // Footer year
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
