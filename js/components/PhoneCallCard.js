import { sanitizeHTML } from '../utils.js';

export class PhoneCallCard {
  constructor({ caller = 'Unknown', label = 'Incoming call', transcript = '' }) {
    this.caller = caller;
    this.label = label;
    this.transcript = transcript;
  }

  render() {
    const el = document.createElement('div');
    el.className = 'bg-surface rounded-2xl p-5 border border-white/10 shadow-lg';
    el.innerHTML = `
      <div class="flex items-center justify-between mb-4">
        <span class="text-xs uppercase tracking-widest text-on-surface-variant">${sanitizeHTML(this.label)}</span>
        <span class="text-red-400 text-xs">LIVE</span>
      </div>
      <div class="text-center mb-4">
        <div class="w-14 h-14 mx-auto rounded-full bg-danger/10 text-danger flex items-center justify-center text-2xl"><i class="ri-phone-fill"></i></div>
        <h3 class="mt-3 text-lg font-semibold">${sanitizeHTML(this.caller)}</h3>
      </div>
      <p class="text-sm text-on-surface-variant">${sanitizeHTML(this.transcript)}</p>
    `;
    return el;
  }
}
