# Strona Joanny Michniewicz — Behawiorystyka & Dietetyka

Ten dokument wyjaśnia jak zarządzać stroną, wgrywać ją na GitHub i skonfigurować płatności.

---

## Spis treści

1. [Pierwsze uruchomienie na GitHub Pages](#1-pierwsze-uruchomienie-na-github-pages)
2. [Aktualizowanie strony po zmianach](#2-aktualizowanie-strony-po-zmianach)
3. [Codzienna obsługa treści](#3-codzienna-obsługa-treści)
4. [Konfiguracja Calendly](#4-konfiguracja-calendly)
5. [Konfiguracja Formspree (formularz kontaktowy)](#5-konfiguracja-formspree-formularz-kontaktowy)
6. [Podpięcie płatności BLIK](#6-podpięcie-płatności-blik)
7. [Własna domena](#7-własna-domena)

---

## 1. Pierwsze uruchomienie na GitHub Pages

### Wymagania wstępne

Zainstaluj na swoim komputerze:

- **Git** — [git-scm.com/downloads](https://git-scm.com/downloads) (Windows: pobierz instalator; Mac: wpisz `git` w terminalu, system zaproponuje instalację)
- **Konto GitHub** — załóż na [github.com](https://github.com) (darmowe)

### Krok 1 — Utwórz repozytorium na GitHub

1. Zaloguj się na GitHub
2. Kliknij **„+"** (prawy górny róg) → **„New repository"**
3. Wypełnij:
   - **Repository name:** `joanna-behawiorystka` *(lub inna nazwa — musi być taka sama jak w kroku 2)*
   - Ustaw jako **Public**
   - *NIE* zaznaczaj „Initialize with README"
4. Kliknij **„Create repository"**

### Krok 2 — Dostosuj konfigurację pod swoje konto

Otwórz plik `_config.yml` i zmień dwie linie:

```yaml
baseurl: "/joanna-behawiorystka"   # ← musi być /NAZWA-REPOZYTORIUM
url: "https://TWOJA-NAZWA.github.io"  # ← zamień TWOJA-NAZWA na login GitHub
```

Przykład: jeśli login to `joanna123` i repo nazywa się `moja-strona`:
```yaml
baseurl: "/moja-strona"
url: "https://joanna123.github.io"
```

Przy okazji uzupełnij resztę danych w `_config.yml` (e-mail, telefon, linki do social mediów).

### Krok 3 — Wygeneruj token dostępu do GitHub

GitHub nie akceptuje hasła przy wgrywaniu przez terminal — wymaga **Personal Access Token** (jednorazowe hasło techniczne).

1. Zaloguj się na GitHub → kliknij swoje zdjęcie (prawy górny róg) → **Settings**
2. Przewiń na dół → **Developer settings** (lewe menu)
3. **Personal access tokens** → **Tokens (classic)** → **Generate new token (classic)**
4. Wypełnij:
   - **Note:** `strona-joanna` (cokolwiek dla pamięci)
   - **Expiration:** `No expiration` (lub np. 1 rok)
   - Zaznacz **`repo`** (cały blok — daje dostęp do repozytoriów)
5. Kliknij **Generate token** → **skopiuj token od razu** (nie zobaczysz go ponownie!)
6. Zapisz token np. w menadżerze haseł lub bezpiecznym pliku tekstowym

Token wygląda tak: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Krok 4 — Wgraj stronę przez terminal

Otwórz terminal w folderze `website/` (na Windowsie: kliknij prawym przyciskiem w folderze → *Open in Terminal* lub *Git Bash here*; na Mac: przeciągnij folder na ikonę Terminala):

```bash
# Jednorazowa inicjalizacja (tylko przy pierwszym wgrywaniu)
git init
git add .
git commit -m "Pierwsza wersja strony"
git branch -M main
git remote add origin https://TWOJA-NAZWA@github.com/TWOJA-NAZWA/joanna-behawiorystka.git

# Wgranie na GitHub — tu zostaniesz zapytana o hasło:
# Login: TWOJA-NAZWA (login GitHub)
# Password: wklej TOKEN wygenerowany w kroku 3 (NIE zwykłe hasło!)
git push -u origin main
```

**Ważne:** zamiast `TWOJA-NAZWA` wpisz swój login GitHub, a zamiast `joanna-behawiorystka` — nazwę repozytorium.

### Krok 5 — Włącz GitHub Pages

1. W repozytorium kliknij **Settings** → **Pages** (lewe menu)
2. **Source:** `Deploy from a branch`
3. **Branch:** `main`, folder: `/ (root)`
4. Kliknij **Save**

Strona będzie gotowa po ok. 1–2 minutach pod adresem:
`https://TWOJA-NAZWA.github.io/joanna-behawiorystka/`

Status budowania możesz śledzić w zakładce **Actions** w repozytorium.

---

## 2. Aktualizowanie strony po zmianach

Gdy wprowadzisz zmiany w plikach (nowy artykuł, zmiana cen, nowe zdjęcie) — wgraj je na GitHub:

```bash
# W folderze website/:
git add .
git commit -m "Opis co zmieniłam"
git push
```

Terminal zapyta o hasło — wklej token (ten sam co przy pierwszym wgrywaniu).

> **Wskazówka:** Możesz zapisać token w systemie raz i nie wpisywać go za każdym razem.
> Na Mac: `git config --global credential.helper osxkeychain`
> Na Windows: `git config --global credential.helper manager`
> Po pierwszym wpisaniu tokena system go zapamięta.

---

## 3. Codzienna obsługa treści

### Dodawanie artykułu na blog

1. Utwórz nowy plik w folderze `_posts/`
2. Nazwa pliku **musi** mieć format: `RRRR-MM-DD-tytuł-po-myślnikach.md`
   - Przykład: `2026-07-15-jak-dbac-o-zeby-psa.md`
3. Na początku pliku wklej nagłówek:

```markdown
---
layout: post
title: "Jak dbać o zęby psa"
date: 2026-07-15
categories: [Psy]
icon: 🐕
excerpt: "Krótki opis artykułu — pojawi się na liście artykułów."
---

Tutaj piszesz treść artykułu w normalnym tekście.

## Nagłówek sekcji

Akapit tekstu. **Pogrubienie** i *kursywa* działają standardowo.

- punkt listy
- kolejny punkt
```

4. Zapisz plik i wgraj na GitHub (`git add . && git commit -m "Nowy artykuł" && git push`)

### Zmiana danych kontaktowych

Otwórz `_config.yml` i zaktualizuj:

```yaml
email: "joanna@example.com"
phone: "+48 500 000 000"
instagram_url: "https://instagram.com/twoj-profil"
facebook_url: "https://facebook.com/twoja-strona"
city: "Warszawa"
```

### Aktualizacja cennika

Otwórz `cennik.html`. Każda usługa wygląda tak:

```html
<div class="cennik-item">
  <input type="checkbox" data-price="350">  ← ← ← zmień tę liczbę
  <div class="cennik-item-info">
    <div class="cennik-item-name">Nazwa usługi</div>
    <div class="cennik-item-desc">Opis (~czas trwania)</div>
  </div>
  <div class="cennik-item-price">350 PLN</div>  ← ← ← i tę
</div>
```

To samo zrób w `umow-wizyte.html` w sekcji `<select id="f-service">` — zmień liczby po `data-price=` i tekst w nawiasach.

### Dodawanie zdjęć

Wgraj zdjęcia do folderu `assets/images/`:

| Nazwa pliku | Gdzie się pojawia |
|---|---|
| `joanna.jpg` | Strona „O mnie" i homepage |
| `hero-dog.jpg` | Główny baner — zdjęcie psa |
| `hero-cat.jpg` | Główny baner — zdjęcie kota |
| `services/pies-terapia.jpg` | Strona Psy — sekcja terapii |
| `services/pies-trening.jpg` | Strona Psy — sekcja treningu |
| `services/kot-terapia.jpg` | Strona Koty |
| `services/dietetyka.jpg` | Strona Dietetyka |

Zdjęcia powinny być poziome (16:9 lub 4:3), min. 1200px szerokości, skompresowane (użyj [squoosh.app](https://squoosh.app)).

---

## 4. Konfiguracja Calendly

1. Załóż konto na [calendly.com](https://calendly.com)
2. Utwórz typy wydarzeń, np.:
   - „Konsultacja behawioralna — pies (wstępna)" — 90 min
   - „Konsultacja behawioralna — wizyta kontynuacyjna" — 60 min
   - itp.
3. Skopiuj link do swojego profilu Calendly (np. `https://calendly.com/joanna-michniewicz`)
4. Otwórz `_config.yml` i wklej:

```yaml
calendly_url: "https://calendly.com/joanna-michniewicz"
```

Calendly pojawi się automatycznie na stronie `Umów wizytę` — ale **tylko po opłaceniu** (klient musi najpierw wypełnić ankietę i zapłacić BLIK-iem).

> **Opcja: dwa kalendarze**
> Możesz mieć dwa osobne linki Calendly:
> - jeden dla opłaconych wizyt (pokazywany po BLIK)
> - drugi dla bezpłatnych rozmów wstępnych (widoczny publicznie)
>
> Stwórz dwa „Event Types" w Calendly. Skontaktuj się z autorem strony — doda drugie pole `calendly_free_url` do konfiguracji.

---

## 5. Konfiguracja Formspree (formularz kontaktowy)

Formspree przyjmuje wiadomości z formularza i przesyła je na Twój e-mail. Darmowy plan: 50 wiadomości/miesiąc.

1. Wejdź na [formspree.io](https://formspree.io) → załóż konto
2. Kliknij **„+ New Form"**
3. Wpisz swój e-mail — tu będą przychodziły wiadomości
4. Skopiuj ID formularza — to 8-znakowy kod w linku, np. `xpzgknjb`
5. Otwórz `umow-wizyte.html` — znajdź linię:
   ```html
   <form id="intake-form" action="https://formspree.io/f/YOUR-FORM-ID"
   ```
   i zastąp `YOUR-FORM-ID` swoim ID.
6. Otwórz `kontakt.md` — zrób to samo.

Po wgraniu na GitHub — przetestuj formularz, wysyłając testową wiadomość.

---

## 6. Podpięcie płatności BLIK

Strona ma gotowy interfejs płatności BLIK — wygląda jak prawdziwy, ale **jeszcze nie pobiera pieniędzy** (mockup). Poniżej dwie drogi integracji.

---

### Opcja A — Prosta (bez programowania): linki płatności Tpay lub Przelewy24

Najbardziej przystępna opcja jeśli nie chcesz angażować programisty.

**Jak działa:** zamiast BLIK-a w modalu, klient klika przycisk i trafia na stronę płatności Tpay/Przelewy24, gdzie może zapłacić BLIK-iem, kartą lub przelewem. Po opłaceniu dostaje link do Calendly e-mailem (wysyłasz go ręcznie lub konfigurojesz automatyzację w Tpay).

**Kroki:**
1. Załóż konto w [Tpay.com](https://tpay.com) (Panel Merchant → rejestracja firmy lub DG)
2. W panelu Tpay przejdź do **„Linki płatności"** (Payment Links) — możesz generować linki dla każdej ceny osobno albo z dynamiczną kwotą
3. Skontaktuj się z autorem strony — podmieni przycisk „Potwierdź płatność" na przekierowanie do Tpay zamiast BLIK-a

**Wady:** klient opuszcza stronę, musisz ręcznie potwierdzić płatność i wysłać link do Calendly.

---

### Opcja B — Pełna integracja BLIK (z programistą)

Prawdziwy BLIK w modalu na stronie wymaga **serwera**, który komunikuje się z API banku (przez PayU, Przelewy24 lub Tpay). GitHub Pages nie obsługuje kodu serwerowego, więc trzeba przenieść stronę na **Netlify** (darmowy plan wystarczy).

**Co jest potrzebne:**

| Co | Skąd |
|---|---|
| Konto Merchant | [PayU](https://payu.pl/dla-firm) lub [Przelewy24](https://przelewy24.pl) lub [Tpay](https://tpay.com) |
| POS ID + klucz MD5 (PayU) / Merchant ID + klucz (P24) | Panel operatora po aktywacji konta |
| Konto Netlify | [netlify.com](https://netlify.com) — darmowe |

**Przebieg integracji (dla programisty):**

1. Przenieś hosting z GitHub Pages na Netlify (import repozytorium, ta sama zawartość)
2. Dodaj `netlify/functions/blik.js` — serverless function, która:
   - odbiera kod BLIK z frontu
   - wysyła zapytanie do API PayU/Tpay
   - zwraca `{ success: true }` lub błąd
3. W `assets/js/main.js` podmień blok `// TODO: INTEGRACJA` na:
   ```js
   fetch('/.netlify/functions/blik', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ code: digits, amount: amount })
   }).then(r => r.json()).then(data => {
     if (data.success) handlePaymentSuccess();
     else alert('Błąd płatności: ' + data.message);
   });
   ```
4. Klucze API wpisz w panelu Netlify → **Environment variables** (nigdy w plikach strony!)

**Szacunkowy czas:** 4–8 godzin pracy programisty (zależnie od operatora płatności).

---

### Opcja C — Najprostsza (tymczasowa): płatność po konsultacji

Jeśli chcesz uruchomić stronę szybko i zająć się płatnościami później:
1. Wyłącz modal BLIK w `umow-wizyte.html` — skontaktuj się z autorem strony
2. Formularz ankietowy bezpośrednio po wysłaniu pokazuje Calendly
3. Pieniądze pobierasz gotówką lub przelewem po wizycie

---

## 7. Własna domena

Jeśli chcesz mieć adres `joanna-behawiorystka.pl` zamiast `github.io`:

1. Kup domenę u dowolnego rejestratora — polecane: [home.pl](https://home.pl), [nazwa.pl](https://nazwa.pl), [domeny.pl](https://domeny.pl) — koszt ok. 50–100 PLN/rok za domenę `.pl`

2. W panelu DNS rejestratora dodaj rekord:
   ```
   Typ: CNAME
   Nazwa: www
   Wartość: TWOJA-NAZWA.github.io
   ```
   Jeśli chcesz też bez `www` (tzw. apex domain), dodaj 4 rekordy A:
   ```
   Typ: A  Wartość: 185.199.108.153
   Typ: A  Wartość: 185.199.109.153
   Typ: A  Wartość: 185.199.110.153
   Typ: A  Wartość: 185.199.111.153
   ```

3. Na GitHubie w repozytorium: **Settings → Pages → Custom domain** → wpisz `www.joanna-behawiorystka.pl` → Save

4. Zaznacz **„Enforce HTTPS"** — certyfikat SSL (kłódka) zostanie wystawiony automatycznie w ciągu kilku minut

5. W `_config.yml` zaktualizuj:
   ```yaml
   url: "https://www.joanna-behawiorystka.pl"
   baseurl: ""
   ```
   i wgraj zmiany na GitHub.

> **Uwaga:** zmiana DNS może propagować się do 24–48 godzin, choć zwykle zajmuje kilka minut.

---

## Propozycje usprawnień na przyszłość

Poniżej rzeczy, które mogą znacząco poprawić stronę — w kolejności od najprostszych:

### Szybkie (kilka minut, samodzielnie)

- **Uzupełnij `_config.yml`** — e-mail, telefon, social media. Brakuje też linka do Instagrama i Facebooka — te pola są już gotowe w stopce.
- **Zamień placeholdery na zdjęcia** — strona wygląda o wiele lepiej z prawdziwymi zdjęciami. Wystarczą 3: Twoje (np. z psem/kotem), pies do banera, kot do banera.
- **Dodaj linka do Google Maps** w sekcji kontakt — klienci jednym kliknięciem otworzą nawigację.

### Warte rozważenia (wymaga programisty, 1–3h)

- **Przycisk WhatsApp** — jedno kliknięcie i klient pisze do Ciebie bezpośrednio. Bardzo skuteczne w Polsce w branży usługowej.
- **Google Analytics** — dowiesz się skąd przychodzą klienci (Instagram? Google?), które podstrony są najczęściej odwiedzane, czy warto pisać więcej artykułów. Wymaga też **paska cookie consent** (RODO/GDPR).
- **Strona z opiniami / referencjami** — opinie klientów to silny argument przekonujący do rezerwacji. Nawet 3–5 zdań od zadowolonych właścicieli robi różnicę.
- **Pakiety usług** — np. „Pakiet Start: 3 wizyty behawioralne w cenie 2" — zwiększa wartość koszyka i buduje lojalność.

### Większe zmiany (wymaga programisty, kilka dni)

- **Prawdziwe płatności BLIK** — Opcja B opisana wyżej. Eliminuje ręczne potwierdzanie płatności.
- **Dwa kalendarze Calendly** — jeden dla klientów opłaconych (po BLIK), drugi widoczny publicznie dla tych, którzy chcą najpierw porozmawiać.
- **Blog ze zdjęciami** — dodanie możliwości wstawiania zdjęć do artykułów (teraz są tylko emoji). Przyciąga ruch z Google.

---

*Masz pytania? Napisz do autora strony.*
