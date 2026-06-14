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
