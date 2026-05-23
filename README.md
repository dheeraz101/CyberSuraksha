# CyberSuraksha

CyberSuraksha is an interactive, simulation-first cyber safety web app focused on real scam patterns in India.  
It helps users practice safer decisions through guided scenarios, quizzes, emergency actions, and progress tracking.

## Live Project

- YABP project page: https://yabp.netlify.app/

## Key Features

- Scam simulation library across messaging, banking, identity, malware, and investment fraud themes
- Guided decision flows with immediate feedback
- Quiz mode for knowledge checks
- Emergency response page with priority actions and reporting guidance
- Language support:
- English
- Hindi
- Accessibility controls:
- Theme (dark/light)
- Contrast (normal/high)
- Font size (small/medium/large)
- Progress tracking:
- XP and levels
- Simulator completion
- Basic badges
- PWA support (installable app behavior)

## Tech Stack

- Vanilla JavaScript (ES modules)
- HTML + Tailwind CSS (CDN)
- Service Worker + Web App Manifest
- LocalStorage for state persistence

## Project Structure

```text
.
├─ index.html
├─ manifest.webmanifest
├─ sw.js
├─ css/
│  └─ tokens.css
├─ js/
│  ├─ app.js
│  ├─ i18n.js
│  ├─ state.js
│  ├─ router.js
│  ├─ analytics.js
│  ├─ simulators/
│  └─ components/
└─ assets/
   └─ icons/
```

## Getting Started

### 1. Clone

```bash
git clone <your-repo-url>
cd <repo-folder>
```

### 2. Run locally

Use any static server. Example with VS Code Live Server:

- Open the project folder
- Run **Live Server** on `index.html`
- Visit `http://127.0.0.1:5500` (or your server URL)

## PWA Notes

- Install prompt availability is browser-controlled.
- It generally appears only when PWA criteria are met and the app is not already installed.
- If you change service worker behavior, unregister old SW once and hard refresh.

## Localization (i18n)

- Main translation dictionary: `js/i18n.js`
- Translation helper: `t(lang, key, vars)`
- Add new UI strings to both `en` and `hi` dictionaries.

## Release Checklist

- Verify no broken local paths (`manifest`, icons, module imports)
- Verify both languages for key screens (Welcome, Settings, Simulators, Emergency, Family Pack)
- Validate PWA install behavior on desktop + Android
- Check responsive layout for common mobile widths

## Roadmap Ideas

- Expand regional language coverage
- Add richer analytics dashboard
- Add stronger offline-first behavior for key routes
- Add automated tests and CI checks

## Credits

- Built as a **YABP (Yet Another Boring Project)** initiative
- Inspired by practical scam-awareness education for everyday users

## License

Add your preferred license (for example, MIT) in a `LICENSE` file.
