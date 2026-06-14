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


// Pricing calculator
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

  updateTotal();
})();


// BLIK payment modal
(function () {
  const overlay   = document.getElementById('blik-modal');
  if (!overlay) return;

  const closeBtn    = document.getElementById('blik-close');
  const codeInput   = document.getElementById('blik-code');
  const confirmBtn  = document.getElementById('blik-confirm');
  const amountEl    = document.getElementById('blik-amount');
  const servicesList = document.getElementById('blik-services-list');
  const formView    = document.getElementById('blik-form-view');
  const successView = document.getElementById('blik-success-view');
  const bookBtn     = document.getElementById('cennik-book-btn');

  // Open modal when clicking the cennik summary button
  if (bookBtn) {
    bookBtn.addEventListener('click', () => {
      // Sync amount from calculator
      const totalEl = document.getElementById('cennik-total');
      if (totalEl && amountEl) amountEl.textContent = totalEl.textContent;

      // List selected services
      if (servicesList) {
        servicesList.innerHTML = '';
        document.querySelectorAll('.cennik-item input[type="checkbox"]:checked').forEach(cb => {
          const name = cb.closest('.cennik-item').querySelector('.cennik-item-name').textContent;
          const li = document.createElement('li');
          li.textContent = name;
          servicesList.appendChild(li);
        });
      }

      // Reset form state
      codeInput.value = '';
      codeInput.classList.remove('valid');
      confirmBtn.disabled = true;
      confirmBtn.textContent = 'Potwierdź płatność';
      confirmBtn.classList.remove('loading');
      formView.hidden = false;
      successView.hidden = true;

      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      setTimeout(() => codeInput.focus(), 100);
    });
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // Format BLIK code: digits only, display as "XXX XXX"
  codeInput.addEventListener('input', () => {
    const digits = codeInput.value.replace(/\D/g, '').slice(0, 6);
    codeInput.value = digits.length > 3 ? digits.slice(0, 3) + ' ' + digits.slice(3) : digits;
    const valid = digits.length === 6;
    confirmBtn.disabled = !valid;
    codeInput.classList.toggle('valid', valid);
  });

  confirmBtn.addEventListener('click', () => {
    const digits = codeInput.value.replace(/\D/g, '');
    if (digits.length !== 6) return;

    // =========================================================
    // TODO: INTEGRACJA Z SYSTEMEM PŁATNOŚCI
    // =========================================================
    // Aby włączyć prawdziwe płatności BLIK, zastąp poniższy
    // blok wywołaniem API PayU / Przelewy24 / Tpay.
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
    //   .then(data => {
    //     if (data.success) showSuccess();
    //     else showError(data.message);
    //   });
    //
    // WAŻNE: klucze API muszą być po stronie serwera (Netlify Functions /
    // Vercel API Routes), NIE w tym pliku.
    // =========================================================

    // MOCKUP — symuluje oczekiwanie i pokazuje sukces
    confirmBtn.classList.add('loading');
    confirmBtn.textContent = 'Przetwarzanie…';

    setTimeout(showSuccess, 1600);
  });

  function showSuccess() {
    formView.hidden = true;
    successView.hidden = false;
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
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
