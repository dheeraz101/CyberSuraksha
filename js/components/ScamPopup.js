import { sanitizeHTML } from '../utils.js';

export class ScamPopup {
  constructor({ title, message, cta }) {
    this.title = title;
    this.message = message;
    this.cta = cta;
  }

  render() {
    const wrap = document.createElement('div');
    wrap.className = 'bg-surface rounded-2xl border border-danger/30 p-4 shadow-lg';
    wrap.innerHTML = `
      <div class="flex items-center justify-between mb-2">
        <h3 class="font-semibold text-on-surface">${sanitizeHTML(this.title)}</h3>
        <span class="text-xs text-danger bg-danger/10 px-2 py-1 rounded-full">Alert</span>
      </div>
      <p class="text-sm text-on-surface-variant mb-3">${sanitizeHTML(this.message)}</p>
      <button class="w-full py-2 rounded-xl bg-danger text-white text-sm font-medium">${sanitizeHTML(this.cta)}</button>
    `;
    return wrap;
  }
}
