// Mobile navigation
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!toggle) return;

  function closeNav() {
    toggle.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    navLinks.classList.toggle('open', !open);
    document.body.style.overflow = open ? '' : 'hidden';
  });

  // Mobile: tap on parent link opens dropdown instead of navigating
  document.querySelectorAll('.has-dropdown > a').forEach(link => {
    link.addEventListener('click', e => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        link.parentElement.classList.toggle('open');
      }
    });
  });

  // Close nav when a leaf link is tapped
  navLinks.querySelectorAll('a:not(.has-dropdown > a)').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) closeNav();
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeNav();
  });
})();


// Cennik — species toggle + click-to-book
(function () {
  const speciesBtns = document.querySelectorAll('.species-btn');
  const servicesPanels = document.querySelectorAll('.cennik-services');

  if (!speciesBtns.length) return;

  // Species toggle
  speciesBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      speciesBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      servicesPanels.forEach(p => p.classList.toggle('visible', p.dataset.species === btn.dataset.species));
    });
  });

  // Each service row navigates directly to booking with that service pre-selected
  function navigateToBooking(item) {
    const service = { name: item.dataset.service, price: parseInt(item.dataset.price, 10) };
    sessionStorage.setItem('cennik_service', JSON.stringify(service));
    window.location.href = item.dataset.href;
  }

  document.querySelectorAll('.cennik-item').forEach(item => {
    item.addEventListener('click', () => navigateToBooking(item));
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigateToBooking(item); }
    });
  });
})();


// Booking page — umow-wizyte (intake form → BLIK → Calendly)
(function () {
  const intakeForm = document.getElementById('intake-form');
  if (!intakeForm) return;

  const serviceSelect = document.getElementById('f-service');
  const priceTag      = document.getElementById('service-price-tag');
  const priceValue    = document.getElementById('service-price-value');

  // Restore service selected on cennik page
  const stored = sessionStorage.getItem('cennik_service');
  if (stored && serviceSelect) {
    try {
      const { name } = JSON.parse(stored);
      sessionStorage.removeItem('cennik_service');
      for (let i = 0; i < serviceSelect.options.length; i++) {
        if (serviceSelect.options[i].value === name) {
          serviceSelect.selectedIndex = i;
          break;
        }
      }
    } catch (_) {}
    updatePriceTag();
  }

  // Service dropdown → show price beneath it
  function updatePriceTag() {
    if (!serviceSelect || !priceTag || !priceValue) return;
    const opt   = serviceSelect.options[serviceSelect.selectedIndex];
    const price = parseInt(opt && opt.dataset.price, 10) || 0;
    if (price > 0) {
      priceValue.textContent = price.toLocaleString('pl-PL') + ' PLN';
      priceTag.hidden = false;
    } else {
      priceTag.hidden = true;
    }
  }

  if (serviceSelect) serviceSelect.addEventListener('change', updatePriceTag);

  function getBlikAmount() {
    const opt = serviceSelect && serviceSelect.options[serviceSelect.selectedIndex];
    return parseInt(opt && opt.dataset.price, 10) || 0;
  }

  function getBlikServiceName() {
    return serviceSelect && serviceSelect.value ? serviceSelect.value : '';
  }

  // ---- BLIK modal ----
  const overlay      = document.getElementById('blik-modal');
  const closeBtn     = document.getElementById('blik-close');
  const codeInput    = document.getElementById('blik-code');
  const confirmBtn   = document.getElementById('blik-confirm');
  const amountEl     = document.getElementById('blik-amount');
  const servicesList = document.getElementById('blik-services-list');
  const formView     = document.getElementById('blik-form-view');
  const successView  = document.getElementById('blik-success-view');
  const goCalBtn     = document.getElementById('blik-go-to-calendar');

  function openBlikModal(amount, serviceName) {
    if (amountEl) amountEl.textContent = amount.toLocaleString('pl-PL') + ' PLN';
    if (servicesList) {
      servicesList.innerHTML = '';
      if (serviceName) {
        const li = document.createElement('li');
        li.textContent = serviceName;
        servicesList.appendChild(li);
      }
    }
    codeInput.value = '';
    codeInput.classList.remove('valid');
    confirmBtn.disabled    = true;
    confirmBtn.textContent = 'Potwierdź płatność';
    confirmBtn.classList.remove('loading');
    formView.hidden    = false;
    successView.hidden = true;

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    advanceStep(2);
    setTimeout(() => codeInput.focus(), 100);
  }

  function closeBlikModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeBlikModal);
  if (overlay)  overlay.addEventListener('click', e => { if (e.target === overlay) closeBlikModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay && overlay.classList.contains('open')) closeBlikModal();
  });

  // BLIK code input — format as "XXX XXX"
  if (codeInput) {
    codeInput.addEventListener('input', () => {
      const digits = codeInput.value.replace(/\D/g, '').slice(0, 6);
      codeInput.value = digits.length > 3 ? digits.slice(0, 3) + ' ' + digits.slice(3) : digits;
      const valid = digits.length === 6;
      confirmBtn.disabled = !valid;
      codeInput.classList.toggle('valid', valid);
    });
  }

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      if (codeInput.value.replace(/\D/g, '').length !== 6) return;

      // =========================================================
      // TODO: INTEGRACJA Z SYSTEMEM PŁATNOŚCI
      // =========================================================
      // Zastąp ten blok wywołaniem API PayU / Przelewy24 / Tpay.
      // Szczegóły integracji: README.md → sekcja 6.
      // WAŻNE: klucze API muszą być po stronie serwera (Netlify Functions),
      // NIE w tym pliku.
      // =========================================================

      confirmBtn.classList.add('loading');
      confirmBtn.textContent = 'Przetwarzanie…';
      setTimeout(handlePaymentSuccess, 1600);
    });
  }

  function handlePaymentSuccess() {
    const paidField = document.getElementById('f-blik-paid');
    if (paidField) paidField.value = 'confirmed';
    submitFormBackground();

    // Populate Calendly link in success view
    const calUrl   = document.getElementById('calendly-container')?.dataset.url || '';
    const urlEl    = document.getElementById('blik-calendly-url');
    if (urlEl) urlEl.textContent = calUrl;

    formView.hidden    = true;
    successView.hidden = false;
    advanceStep(3);
  }

  // Copy Calendly link button (inside modal)
  document.getElementById('blik-copy-link')?.addEventListener('click', () => {
    const url = document.getElementById('blik-calendly-url')?.textContent || '';
    navigator.clipboard.writeText(url).catch(() => {});
    const btn = document.getElementById('blik-copy-link');
    if (btn) { btn.textContent = '✓ Skopiowano'; setTimeout(() => { btn.textContent = 'Kopiuj'; }, 2000); }
  });

  if (goCalBtn) {
    goCalBtn.addEventListener('click', () => {
      closeBlikModal();
      showCalendlyStep();
    });
  }

  // Intercept form submit: validate → open BLIK
  intakeForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!intakeForm.checkValidity()) { intakeForm.reportValidity(); return; }

    const amount = getBlikAmount();
    if (amount === 0) {
      if (serviceSelect) serviceSelect.focus();
      return;
    }

    openBlikModal(amount, getBlikServiceName());
  });

  function submitFormBackground() {
    const action = intakeForm.getAttribute('action');
    if (!action || action.includes('YOUR-FORM-ID')) return;
    fetch(action, {
      method: 'POST',
      body: new FormData(intakeForm),
      headers: { Accept: 'application/json' }
    }).catch(() => {});
  }

  // Step indicator
  function advanceStep(activeNum) {
    for (let i = 1; i <= 3; i++) {
      const ind = document.getElementById('step-ind-' + i);
      if (!ind) continue;
      ind.classList.remove('active', 'done');
      if (i < activeNum)  ind.classList.add('done');
      if (i === activeNum) ind.classList.add('active');
    }
    for (let i = 1; i <= 2; i++) {
      const conn = document.getElementById('step-conn-' + i);
      if (conn) conn.classList.toggle('done', i < activeNum);
    }
  }

  // Reveal Calendly embed
  function showCalendlyStep() {
    const step1  = document.getElementById('booking-step-1');
    const step3  = document.getElementById('booking-step-3');
    const contEl = document.getElementById('calendly-container');

    if (step1) step1.hidden = true;
    if (step3) step3.hidden = false;

    if (contEl && !contEl.dataset.loaded) {
      contEl.dataset.loaded = 'true';
      const calUrl = contEl.dataset.url;

      const widget = document.createElement('div');
      widget.className     = 'calendly-inline-widget';
      widget.dataset.url   = calUrl;
      widget.style.minWidth = '320px';
      widget.style.height   = '630px';
      contEl.appendChild(widget);

      const script = document.createElement('script');
      script.src   = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);
    }

    if (step3) step3.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
})();


// Smooth scroll for anchor links
document.querySelectorAll('a[href*="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const hash = link.getAttribute('href').split('#')[1];
    if (!hash) return;
    const target = document.getElementById(hash);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
