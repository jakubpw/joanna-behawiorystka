---
layout: default
title: "Kontakt"
permalink: /kontakt/
---

<section class="page-hero">
  <div class="container">
    <div class="page-hero-ornament">✉</div>
    <h1>Kontakt</h1>
    <p class="page-subtitle">Skontaktuj się ze mną — odpiszę w ciągu 24 godzin.</p>
  </div>
</section>

<section class="page-content">
  <div class="container">
    <div class="contact-grid">
      <div class="contact-info">
        <h2>Dane kontaktowe</h2>

        <div class="contact-detail">
          <div class="contact-detail-icon">✉</div>
          <div class="contact-detail-text">
            <p class="label">E-mail</p>
            <!-- TODO: zaktualizuj e-mail w _config.yml -->
            <a href="mailto:{{ site.email }}">{{ site.email }}</a>
          </div>
        </div>

        <div class="contact-detail">
          <div class="contact-detail-icon">📞</div>
          <div class="contact-detail-text">
            <p class="label">Telefon</p>
            <!-- TODO: zaktualizuj numer w _config.yml -->
            <a href="tel:{{ site.phone | remove: ' ' }}">{{ site.phone }}</a>
          </div>
        </div>

        <div class="contact-detail">
          <div class="contact-detail-icon">📍</div>
          <div class="contact-detail-text">
            <p class="label">Lokalizacja</p>
            <p>{{ site.city }} i okolice<br>Konsultacje online — cała Polska</p>
          </div>
        </div>

        <div class="social-links">
          {% if site.instagram_url %}
          <a href="{{ site.instagram_url }}" target="_blank" rel="noopener" class="social-link">
            📸 Instagram
          </a>
          {% endif %}
          {% if site.facebook_url %}
          <a href="{{ site.facebook_url }}" target="_blank" rel="noopener" class="social-link">
            Facebook
          </a>
          {% endif %}
        </div>
      </div>

      <div>
        <h2 style="font-size: 1.4rem; margin-bottom: 1.5rem;">Napisz do mnie</h2>

        <!-- Formularz przez Formspree — TODO: zastąp YOUR-FORM-ID swoim ID z formspree.io -->
        <form action="https://formspree.io/f/YOUR-FORM-ID" method="POST">
          <div class="form-group">
            <label for="name">Imię i nazwisko *</label>
            <input type="text" id="name" name="name" required placeholder="Jan Kowalski">
          </div>

          <div class="form-group">
            <label for="email">E-mail *</label>
            <input type="email" id="email" name="email" required placeholder="jan@example.com">
          </div>

          <div class="form-group">
            <label for="message">Wiadomość *</label>
            <textarea id="message" name="message" required placeholder="W czym mogę Ci pomóc?"></textarea>
          </div>

          <input type="hidden" name="_subject" value="Wiadomość ze strony — kontakt">

          <button type="submit" class="btn btn-gold" style="width:100%; padding:1rem;">
            Wyślij wiadomość
          </button>
        </form>
      </div>
    </div>
  </div>
</section>
