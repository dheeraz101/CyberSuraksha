import { stateManager } from '../state.js';
import { AppleDropdown } from './AppleDropdown.js';
import { applyTheme, applyAccessibility } from '../theme.js';

export class SettingsModal {
  constructor({ t, lang, onLanguageChange }) {
    this.t = t;
    this.lang = lang;
    this.onLanguageChange = onLanguageChange;
    this.overlay = null;
  }

  open() {
    const s = stateManager.getState();
    this.overlay = document.createElement('div');
    this.overlay.className = 'fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4';
    this.overlay.innerHTML = `
      <div role="dialog" aria-modal="true" aria-label="${this.t(this.lang, 'settings_aria_label')}" class="w-full max-w-xl bg-surface border border-white/10 rounded-2xl p-5 shadow-2xl">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">${this.t(this.lang, 'settings_title') || 'Settings'}</h2>
          <button id="settings-close" class="w-9 h-9 rounded-xl bg-surface-elevated border border-white/10"><i class="ri-close-line"></i></button>
        </div>
        <div class="space-y-4" id="settings-body"></div>
      </div>
    `;
    document.body.appendChild(this.overlay);

    this.overlay.querySelector('#settings-close').addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });

    const body = this.overlay.querySelector('#settings-body');

    const rows = [
      { id: 'lang', label: this.t(this.lang, 'choose_language'), value: s.language || 'en', options: [{ value: 'en', label: 'English' }, { value: 'hi', label: 'हिंदी' }, { value: 'coming_soon', label: this.t(this.lang, 'more_languages_coming_soon') }] },
      { id: 'theme', label: this.t(this.lang, 'theme') || 'Theme', value: s.theme || 'dark', options: [{ value: 'dark', label: this.t(this.lang, 'theme_dark') || 'Dark' }, { value: 'light', label: this.t(this.lang, 'theme_light') || 'Light' }] },
      { id: 'contrast', label: this.t(this.lang, 'contrast') || 'Contrast', value: s.contrast || 'normal', options: [{ value: 'normal', label: this.t(this.lang, 'contrast_normal') || 'Normal' }, { value: 'high', label: this.t(this.lang, 'contrast_high') || 'High' }] },
      { id: 'font', label: this.t(this.lang, 'font_size') || 'Font Size', value: s.fontSize || 'md', options: [{ value: 'sm', label: this.t(this.lang, 'font_small') || 'Small' }, { value: 'md', label: this.t(this.lang, 'font_medium') || 'Medium' }, { value: 'lg', label: this.t(this.lang, 'font_large') || 'Large' }] }
    ];

    rows.forEach((row) => {
      const wrap = document.createElement('div');
      wrap.innerHTML = `<p class="text-xs uppercase tracking-widest text-on-surface-variant mb-2">${row.label}</p><div id="row-${row.id}"></div>`;
      body.appendChild(wrap);
      const dd = new AppleDropdown({
        value: row.value,
        options: row.options,
        onChange: (val) => {
          if (row.id === 'lang') {
            if (val === 'coming_soon') {
              alert(this.t(this.lang, 'more_languages_alert'));
              return;
            }
            stateManager.set('language', val);
            if (this.onLanguageChange) this.onLanguageChange(val);
          }
          if (row.id === 'theme') {
            stateManager.set('theme', val);
            applyTheme(val);
          }
          if (row.id === 'contrast') {
            stateManager.set('contrast', val);
            applyAccessibility({ contrast: val, fontSize: stateManager.get('fontSize') || 'md' });
          }
          if (row.id === 'font') {
            stateManager.set('fontSize', val);
            applyAccessibility({ contrast: stateManager.get('contrast') || 'normal', fontSize: val });
          }
        }
      });
      wrap.querySelector(`#row-${row.id}`).appendChild(dd.render());
    });
  }

  close() {
    if (this.overlay) this.overlay.remove();
    this.overlay = null;
  }
}
