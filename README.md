<p align="center">
  <img src="assets/images/readme-icon.png" alt="App Icon" width="120">
</p>

<h1 align="center">Kiwi</h1>

<p align="center">
  Belege fotografieren — Daten automatisch erfassen — Jederzeit exportieren.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Android-3DDC84?logo=android&logoColor=white" alt="Android">
  <img src="https://img.shields.io/badge/Built%20with-Expo-000020?logo=expo&logoColor=white" alt="Expo">
  <img src="https://img.shields.io/badge/AI-Gemini-4285F4?logo=google&logoColor=white" alt="Gemini">
</p>

---

## Screenshots

<p align="center">
  <img src="play-store-assets/phone_screenshot_home.jpg" alt="Home" width="22%">
  <img src="play-store-assets/phone_screenshot_belege_scannen.jpg" alt="Beleg scannen" width="22%">
  <img src="play-store-assets/phone_screenshot_beleg_pruefen.jpg" alt="Beleg prüfen" width="22%">
  <img src="play-store-assets/phone_screenshot_belege.jpg" alt="Belegliste" width="22%">
</p>

---

## Download

<p align="center">
  <a href="https://github.com/Schiggy-3000/kiwi/releases/latest/download/kiwi.apk">
    <img src="https://img.shields.io/badge/Download-APK-3DDC84?style=for-the-badge&logo=android&logoColor=white" alt="Download APK">
  </a>
</p>

Die APK-Datei kann direkt auf einem Android-Gerät installiert werden (kein Google Play Store erforderlich).

**Installation:**
1. APK herunterladen
2. Auf dem Android-Gerät: Einstellungen → Sicherheit → „Unbekannte Quellen" aktivieren
3. APK-Datei öffnen und installieren

---

## Features

- **Beleg scannen** — Kamera öffnen, Foto aufnehmen, fertig
- **KI-Erkennung** — Datum, Geschäft, Betrag, MwSt und Zahlungsart werden automatisch ausgelesen (Google Gemini)
- **Prüfen & Speichern** — Felder kontrollieren, anpassen, lokal speichern
- **Belegliste** — Alle Belege auf einen Blick, bearbeitbar und löschbar
- **CSV-Export** — Alle Belege als CSV exportieren und per E-Mail, Drive oder WhatsApp teilen

---

## Tech Stack

| Layer | Technologie |
|-------|-------------|
| Framework | React Native + Expo (EAS Build) |
| Navigation | Expo Router |
| Datenbank | SQLite (`expo-sqlite`) |
| KI / OCR | Google Gemini API (`gemini-2.5-flash`) |
| Kamera | `expo-image-picker` |
| Export | `expo-file-system` + `expo-sharing` |

---

## Architecture

```
kiwi/
├── app/                        # Screens (Expo Router, file-based routing)
│   ├── (tabs)/                 # Bottom tab navigator
│   │   ├── _layout.tsx         # Tab bar configuration
│   │   ├── index.tsx           # Home screen — logo, scan button
│   │   └── receipts.tsx        # Belege screen — receipt list, CSV export
│   ├── _layout.tsx             # Root layout — SQLite init, navigation stack
│   ├── scan.tsx                # Camera screen — photo capture + Gemini OCR
│   ├── receipt-form.tsx        # New receipt form — review/edit extracted data
│   ├── receipt-detail.tsx      # Receipt detail view — full data + image
│   └── receipt-edit.tsx        # Edit existing receipt
│
├── components/                 # Reusable UI components
│   ├── ui/                     # Low-level primitives
│   │   ├── icon-symbol.tsx     # Cross-platform icon wrapper (Expo Vector Icons)
│   │   └── collapsible.tsx     # Animated collapsible section
│   ├── form-field.tsx          # Labelled text input for receipt forms
│   ├── dropdown-field.tsx      # Labelled dropdown (payment method selector)
│   └── scan-button.tsx         # Pill-shaped "Beleg scannen" button
│
├── lib/                        # Business logic / service layer
│   ├── database.ts             # SQLite schema, CRUD operations for receipts
│   ├── gemini.ts               # Gemini API call — photo → structured receipt data
│   └── export.ts               # CSV generation + share sheet trigger
│
├── constants/
│   └── theme.ts                # Brand colours (#004e2a green, #bccf21 lime, #f5f5f0 cream)
│
├── assets/images/              # Static images
│   ├── kiwi-icon.png           # Source logo (546×493)
│   ├── splash-icon.png         # Splash screen logo (rounded corners)
│   ├── readme-icon.png         # README header icon
│   └── ...                     # Android adaptive icon layers, favicon
│
├── docs/                       # GitHub Pages (privacy policy)
│   └── index.html              # Datenschutzerklärung — https://schiggy-3000.github.io/kiwi/
│
├── scripts/                    # One-off build utilities (Node.js, jimp-compact)
│   ├── generate-icon.js        # Produces play-store-icon-512.png (512×512, green bg)
│   ├── round-splash-icon.js    # Rounds corners of splash-icon.png (r=80px)
│   └── generate-readme-icon.js # Produces readme-icon.png
│
├── play-store-assets/          # Google Play Store submission assets
│   ├── app_icon.PNG            # 512×512 store icon
│   ├── feature_graphic.PNG     # 1024×500 feature banner
│   ├── phone_screenshot_*.jpg  # 4 phone screenshots
│   └── archive/                # HTML mockup sources for screenshots
│
├── app.json                    # Expo app config (name, package ID, icons, splash)
├── eas.json                    # EAS Build + Submit config (profiles: dev/preview/production)
├── constants/theme.ts          # (see above)
└── .env                        # Local only — EXPO_PUBLIC_GEMINI_API_KEY (gitignored)
```

### Data Flow

```
Camera → scan.tsx → gemini.ts (Gemini API) → receipt-form.tsx → database.ts (SQLite)
                                                                       ↓
                                                 receipts.tsx ← receipt-detail.tsx
                                                       ↓
                                                  export.ts → CSV → Share sheet
```

---

## Setup

### Voraussetzungen

- [Node.js](https://nodejs.org) ≥ 18
- [EAS CLI](https://docs.expo.dev/eas/) — `npm install -g eas-cli`
- Google AI Studio API Key — [aistudio.google.com](https://aistudio.google.com)

### Installation

```bash
git clone https://github.com/Schiggy-3000/kiwi.git
cd kiwi
npm install
```

### Umgebungsvariablen

Erstelle eine `.env`-Datei im Projektverzeichnis:

```env
EXPO_PUBLIC_GEMINI_API_KEY=dein_api_key_hier
```

### Entwicklungs-Build starten

```bash
# Build erstellen (einmalig oder bei nativen Änderungen)
eas build --profile development --platform android

# Dev-Server starten
npx expo start --dev-client
```

---

## Datenschutz

Die App überträgt Belegfotos ausschliesslich zur Texterkennung an die Google Gemini API (HTTPS-verschlüsselt). Alle Belegdaten werden lokal auf dem Gerät gespeichert. Keine Konten, kein Tracking, keine Werbung.

Datenschutzerklärung: [schiggy-3000.github.io/kiwi](https://schiggy-3000.github.io/kiwi/)
