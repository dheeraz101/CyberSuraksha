import { sanitizeHTML } from '../utils.js';

export class AppMockCard {
  constructor({ appName = 'Secure App', action = 'Continue', note = '' }) {
    this.appName = appName;
    this.action = action;
    this.note = note;
  }

  render() {
    const el = document.createElement('div');
    el.className = 'bg-surface rounded-2xl border border-white/10 shadow-lg p-4';
    el.innerHTML = `
      <div class="flex items-center gap-3 mb-3">
        <div class="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center"><i class="ri-smartphone-line"></i></div>
        <div>
          <p class="text-sm font-semibold">${sanitizeHTML(this.appName)}</p>
          <p class="text-xs text-on-surface-variant">App verification required</p>
        </div>
      </div>
      <p class="text-sm text-on-surface-variant mb-3">${sanitizeHTML(this.note)}</p>
      <button class="w-full py-2 rounded-xl bg-primary text-white text-sm">${sanitizeHTML(this.action)}</button>
    `;
    return el;
  }
}
