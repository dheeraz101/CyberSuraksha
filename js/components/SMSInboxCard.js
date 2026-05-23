import { sanitizeHTML } from '../utils.js';

export class SMSInboxCard {
  constructor({ sender = 'UNKNOWN', message = '' }) {
    this.sender = sender;
    this.message = message;
  }

  render() {
    const el = document.createElement('div');
    el.className = 'bg-surface rounded-2xl border border-white/10 shadow-lg overflow-hidden';
    el.innerHTML = `
      <div class="px-4 py-3 bg-surface-elevated border-b border-white/10 flex items-center gap-2">
        <i class="ri-message-3-line text-primary"></i><span class="text-sm font-medium">Messages</span>
      </div>
      <div class="p-4">
        <p class="text-xs text-on-surface-variant mb-1">${sanitizeHTML(this.sender)}</p>
        <p class="text-sm text-on-surface">${sanitizeHTML(this.message)}</p>
      </div>
    `;
    return el;
  }
}
