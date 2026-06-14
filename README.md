# Strona Joanny Michniewicz — Behawiorystyka & Dietetyka Zwierząt

## Jak opublikować stronę na GitHub Pages (krok po kroku)

### 1. Załóż konto na GitHub
Wejdź na [github.com](https://github.com) i załóż darmowe konto (jeśli jeszcze nie masz).

### 2. Stwórz nowe repozytorium
- Kliknij „+" → „New repository"
- Nazwa repozytorium: `joanna-behawiorystka` (lub dowolna inna)
- Ustaw jako **Public** (wymagane dla darmowego GitHub Pages)
- Kliknij „Create repository"

### 3. Wgraj pliki strony
Możesz to zrobić bezpośrednio przez przeglądarkę:
- W nowym repozytorium kliknij „Add file" → „Upload files"
- Przeciągnij wszystkie pliki z tego folderu (`website/`)
- Kliknij „Commit changes"

Lub przez terminal (jeśli masz Git zainstalowany):
```bash
cd website/
git init
git add .
git commit -m "Pierwsza wersja strony"
git remote add origin https://github.com/TWOJA-NAZWA/joanna-behawiorystka.git
git push -u origin main
```

### 4. Włącz GitHub Pages
- Wejdź w Settings → Pages
- Source: `Deploy from a branch`
- Branch: `main`, folder: `/ (root)`
- Kliknij Save

Strona będzie dostępna pod adresem: `https://TWOJA-NAZWA.github.io/joanna-behawiorystka/`

---

## Jak aktualizować treść strony

### Dodawanie nowego artykułu (blog)
1. Wejdź na GitHub do folderu `_posts/`
2. Kliknij „Add file" → „Create new file"
3. Nazwa pliku musi mieć format: `RRRR-MM-DD-tytuł-artykułu.md`
   - Przykład: `2026-07-15-jak-dbac-o-zeby-psa.md`
4. Na początku pliku wklej:
```
---
layout: post
title: "Tytuł artykułu"
date: 2026-07-15
categories: [Psy, Dietetyka]
icon: 🐕
excerpt: "Krótki opis artykułu (pojawi się na liście)."
---

Tutaj treść artykułu w formacie Markdown...
```
5. Kliknij „Commit changes" — artykuł pojawi się automatycznie na stronie!

### Zmiana danych kontaktowych
Otwórz plik `_config.yml` i zaktualizuj:
- `email` — Twój adres e-mail
- `phone` — numer telefonu
- `instagram_url` — link do Instagrama
- `facebook_url` — link do Facebooka
- `city` — miasto

### Dodawanie zdjęć
Wgraj zdjęcia do folderu `assets/images/`:
- `joanna.jpg` — Twoje zdjęcie (na stronie „O mnie" i homepage)
- `hero-dog.jpg` — zdjęcie psa do głównego bannera
- `hero-cat.jpg` — zdjęcie kota do głównego bannera
- `services/pies-terapia.jpg`, `services/pies-trening.jpg` itd. — zdjęcia usług

### Aktualizacja cennika
Otwórz plik `cennik.html` i znajdź linie z `data-price="XXX"` — zmień liczby na swoje stawki. Zaktualizuj też opisane obok nazwy i opisy usług.

---

## Konfiguracja dodatkowych narzędzi

### Calendly (kalendarz rezerwacji)
1. Załóż konto na [calendly.com](https://calendly.com)
2. Utwórz typy wydarzeń (np. „Konsultacja behawioralna — pies")
3. Skopiuj link do swojego profilu Calendly
4. Wklej go w `_config.yml` w polu `calendly_url`
5. Wklej też do pliku `umow-wizyte.html` — znajdź `YOUR-CALENDLY-LINK` i zastąp swoim linkiem

### Formspree (formularz kontaktowy)
1. Wejdź na [formspree.io](https://formspree.io) → załóż darmowe konto
2. Utwórz nowy formularz
3. Skopiuj ID formularza (np. `xpzgknjb`)
4. W plikach `umow-wizyte.html` i `kontakt.md` znajdź `YOUR-FORM-ID` i zastąp swoim ID

### Płatności BLIK (PayU/Przelewy24)
Gdy będziesz gotowa skonfigurować płatności online:
1. Załóż konto merchant w [PayU](https://payu.pl) lub [Przelewy24](https://przelewy24.pl)
2. Skontaktuj się ze mną — dodam odpowiedni widget do strony cennika

---

## Własna domena (np. joanna-behawiorystka.pl)

1. Kup domenę u dowolnego rejestratora (np. home.pl, nazwa.pl) — koszt ok. 50–100 PLN/rok
2. W panelu rejestratora dodaj rekord DNS: `CNAME www → TWOJA-NAZWA.github.io`
3. Na GitHubie: Settings → Pages → Custom domain → wpisz swoją domenę
4. Odznacz "Enforce HTTPS" i poczekaj chwilę — certyfikat SSL zostanie wystawiony automatycznie

---

*Masz pytania? Napisz do autora strony.*
