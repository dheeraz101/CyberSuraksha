import { sanitizeHTML } from '../utils.js';

export class PortalMockCard {
  constructor({ domain = '', title = '', prompt = '' }) {
    this.domain = domain;
    this.title = title;
    this.prompt = prompt;
  }

  render() {
    const el = document.createElement('div');
    el.className = 'bg-surface rounded-2xl border border-white/10 shadow-lg overflow-hidden';
    el.innerHTML = `
      <div class="px-4 py-2 bg-surface-elevated border-b border-white/10 text-xs text-on-surface-variant">https://${sanitizeHTML(this.domain)}</div>
      <div class="p-5">
        <h3 class="font-semibold mb-3">${sanitizeHTML(this.title)}</h3>
        <input disabled class="w-full bg-surface-elevated border border-white/10 rounded-xl px-3 py-2 text-xs mb-2" value="user@example.com" />
        <input disabled class="w-full bg-surface-elevated border border-white/10 rounded-xl px-3 py-2 text-xs mb-3" value="••••••••" />
        <button class="w-full py-2 rounded-xl bg-primary text-white text-sm">${sanitizeHTML(this.prompt)}</button>
      </div>
    `;
    return el;
  }
}
