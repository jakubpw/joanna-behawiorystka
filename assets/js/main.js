// Mobile navigation
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navCta = document.querySelector('.nav-cta');

  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    navLinks.classList.toggle('open', !open);
    if (navCta) navCta.classList.toggle('open', !open);
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

  // Close menu on resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      toggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('open');
      if (navCta) navCta.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
})();


// Pricing calculator (cennik page)
(function () {
  const speciesBtns = document.querySelectorAll('.species-btn');
  const servicesPanels = document.querySelectorAll('.cennik-services');
  const totalEl = document.getElementById('cennik-total');
  const bookBtn = document.getElementById('cennik-book-btn');

  if (!speciesBtns.length) return;

  // Switch species tab
  speciesBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.species;
      speciesBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      servicesPanels.forEach(p => p.classList.toggle('visible', p.dataset.species === target));
      updateTotal();
    });
  });

  // Checkbox row click
  document.querySelectorAll('.cennik-item').forEach(item => {
    item.addEventListener('click', e => {
      if (e.target.type === 'checkbox') return;
      const cb = item.querySelector('input[type="checkbox"]');
      cb.checked = !cb.checked;
      item.classList.toggle('selected', cb.checked);
      updateTotal();
    });
    const cb = item.querySelector('input[type="checkbox"]');
    cb.addEventListener('change', () => {
      item.classList.toggle('selected', cb.checked);
      updateTotal();
    });
  });

  function updateTotal() {
    let sum = 0;
    document.querySelectorAll('.cennik-item input[type="checkbox"]:checked').forEach(cb => {
      sum += parseInt(cb.dataset.price, 10);
    });
    if (totalEl) totalEl.textContent = sum.toLocaleString('pl-PL') + ' PLN';
    if (bookBtn) bookBtn.disabled = sum === 0;
  }

  // Book button: save selections to sessionStorage, then navigate to booking page
  if (bookBtn) {
    bookBtn.addEventListener('click', () => {
      const services = [];
      document.querySelectorAll('.cennik-item input[type="checkbox"]:checked').forEach(cb => {
        const name = cb.closest('.cennik-item').querySelector('.cennik-item-name').textContent;
        services.push({ name, price: parseInt(cb.dataset.price, 10) });
      });
      const total = services.reduce((s, x) => s + x.price, 0);
      sessionStorage.setItem('cennik_total', String(total));
      sessionStorage.setItem('cennik_services', JSON.stringify(services));
      window.location.href = bookBtn.dataset.href;
    });
  }

  updateTotal();
})();


// Booking page — umow-wizyte (intake form → BLIK → Calendly)
(function () {
  const intakeForm = document.getElementById('intake-form');
  if (!intakeForm) return;

  const serviceSelect = document.getElementById('f-service');
  const priceTag      = document.getElementById('service-price-tag');
  const priceValue    = document.getElementById('service-price-value');
  const prefillBar    = document.getElementById('cennik-prefill-notice');
  const prefillAmtEl  = document.getElementById('cennik-prefill-amount');
  const prefillClear  = document.getElementById('cennik-prefill-clear');

  let prefillAmount   = 0;
  let prefillServices = [];

  // Restore cennik selection from sessionStorage
  const storedTotal    = sessionStorage.getItem('cennik_total');
  const storedServices = sessionStorage.getItem('cennik_services');
  if (storedTotal) {
    prefillAmount   = parseInt(storedTotal, 10);
    prefillServices = JSON.parse(storedServices || '[]');
    sessionStorage.removeItem('cennik_total');
    sessionStorage.removeItem('cennik_services');
    if (prefillBar && prefillAmtEl) {
      prefillAmtEl.textContent = prefillAmount.toLocaleString('pl-PL') + ' PLN';
      prefillBar.hidden = false;
    }
  }

  if (prefillClear) {
    prefillClear.addEventListener('click', () => {
      prefillAmount   = 0;
      prefillServices = [];
      if (prefillBar) prefillBar.hidden = true;
      updatePriceTag();
    });
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

  // Which amount / services list to send to BLIK
  function getBlikAmount() {
    if (prefillAmount > 0) return prefillAmount;
    const opt = serviceSelect && serviceSelect.options[serviceSelect.selectedIndex];
    return parseInt(opt && opt.dataset.price, 10) || 0;
  }

  function getBlikServices() {
    if (prefillServices.length > 0) return prefillServices;
    if (!serviceSelect || !serviceSelect.value) return [];
    const opt = serviceSelect.options[serviceSelect.selectedIndex];
    return [{ name: serviceSelect.value, price: parseInt(opt.dataset.price, 10) || 0 }];
  }

  // ---- BLIK modal wiring ----
  const overlay      = document.getElementById('blik-modal');
  const closeBtn     = document.getElementById('blik-close');
  const codeInput    = document.getElementById('blik-code');
  const confirmBtn   = document.getElementById('blik-confirm');
  const amountEl     = document.getElementById('blik-amount');
  const servicesList = document.getElementById('blik-services-list');
  const formView     = document.getElementById('blik-form-view');
  const successView  = document.getElementById('blik-success-view');
  const goCalBtn     = document.getElementById('blik-go-to-calendar');

  function openBlikModal(amount, services) {
    if (amountEl)     amountEl.textContent = amount.toLocaleString('pl-PL') + ' PLN';
    if (servicesList) {
      servicesList.innerHTML = '';
      services.forEach(s => {
        const li = document.createElement('li');
        li.textContent = s.name;
        servicesList.appendChild(li);
      });
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

  // Format code input as "XXX XXX"
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
      const digits = codeInput.value.replace(/\D/g, '');
      if (digits.length !== 6) return;

      // =========================================================
      // TODO: INTEGRACJA Z SYSTEMEM PŁATNOŚCI
      // =========================================================
      // Aby włączyć prawdziwe BLIK, zastąp poniższy blok
      // wywołaniem API PayU / Przelewy24 / Tpay.
      //
      // Przykład (PayU):
      //   confirmBtn.classList.add('loading');
      //   confirmBtn.textContent = 'Przetwarzanie...';
      //   fetch('/api/blik', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({ code: digits, amount: <kwota w groszach> })
      //   })
      //   .then(r => r.json())
      //   .then(data => { if (data.success) handlePaymentSuccess(); else showError(data.message); });
      //
      // WAŻNE: klucze API muszą być po stronie serwera (Netlify Functions),
      // NIE w tym pliku.
      // =========================================================

      // MOCKUP — symuluje oczekiwanie i pokazuje sukces
      confirmBtn.classList.add('loading');
      confirmBtn.textContent = 'Przetwarzanie…';
      setTimeout(handlePaymentSuccess, 1600);
    });
  }

  function handlePaymentSuccess() {
    // Mark payment field and submit form to Formspree in background
    const paidField = document.getElementById('f-blik-paid');
    if (paidField) paidField.value = 'confirmed';
    submitFormBackground();

    formView.hidden    = true;
    successView.hidden = false;
    advanceStep(3);
  }

  if (goCalBtn) {
    goCalBtn.addEventListener('click', () => {
      closeBlikModal();
      showCalendlyStep();
    });
  }

  // Intercept form submit: validate → open BLIK
  intakeForm.addEventListener('submit', e => {
    e.preventDefault();

    if (!intakeForm.checkValidity()) {
      intakeForm.reportValidity();
      return;
    }

    const amount = getBlikAmount();
    if (amount === 0) {
      if (serviceSelect) serviceSelect.focus();
      return;
    }

    openBlikModal(amount, getBlikServices());
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
      widget.className       = 'calendly-inline-widget';
      widget.dataset.url     = calUrl;
      widget.style.minWidth  = '320px';
      widget.style.height    = '630px';
      contEl.appendChild(widget);

      const script  = document.createElement('script');
      script.src    = 'https://assets.calendly.com/assets/external/widget.js';
      script.async  = true;
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
