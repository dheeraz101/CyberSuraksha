import { sanitizeHTML } from '../utils.js';

export class EmailPreview {
  constructor({ from, subject, body, suspicious = true }) {
    this.from = from;
    this.subject = subject;
    this.body = body;
    this.suspicious = suspicious;
  }

  render() {
    const box = document.createElement('div');
    box.className = 'bg-surface rounded-2xl p-4 shadow-lg border border-white/10';
    box.innerHTML = `
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-semibold text-on-surface">${sanitizeHTML(this.subject)}</h3>
        <span class="text-xs px-2 py-1 rounded-full ${this.suspicious ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'}">${this.suspicious ? 'Suspicious' : 'Verified'}</span>
      </div>
      <p class="text-xs text-on-surface-variant mb-2">From: ${sanitizeHTML(this.from)}</p>
      <p class="text-sm text-on-surface-variant whitespace-pre-line">${sanitizeHTML(this.body)}</p>
    `;
    return box;
  }
}
