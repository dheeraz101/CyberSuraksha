import { sanitizeHTML } from '../utils.js';

export class ChatThread {
  constructor({ title, sender, messages = [] }) {
    this.title = title;
    this.sender = sender;
    this.messages = messages;
  }

  render() {
    const card = document.createElement('div');
    card.className = 'bg-surface rounded-2xl p-4 shadow-lg border border-white/10';

    const bubbles = this.messages.map((msg) => {
      const side = msg.from === 'scammer' ? 'items-start' : 'items-end';
      const bubble = msg.from === 'scammer' ? 'bg-surface-elevated text-on-surface' : 'bg-primary text-white';
      return `
        <div class="flex ${side}">
          <div class="max-w-[85%] rounded-2xl px-3 py-2 text-sm ${bubble}">${sanitizeHTML(msg.text)}</div>
        </div>
      `;
    }).join('');

    card.innerHTML = `
      <div class="flex items-center justify-between mb-3">
        <div>
          <p class="text-sm text-on-surface-variant">Chat</p>
          <h3 class="font-semibold text-on-surface">${sanitizeHTML(this.title)}</h3>
        </div>
        <span class="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">${sanitizeHTML(this.sender)}</span>
      </div>
      <div class="space-y-2">${bubbles}</div>
    `;

    return card;
  }
}
