import { sanitizeHTML } from '../utils.js';

export class ScamCard {
  constructor({ title, description, icon = '', iconIsHtml = false, status = '', statusIsHtml = false, onClick, extraHtml = '' }) {
    this.title = title;
    this.description = description;
    this.icon = icon;
    this.iconIsHtml = iconIsHtml;
    this.status = status;
    this.statusIsHtml = statusIsHtml;
    this.onClick = onClick;
    this.extraHtml = extraHtml;
  }

  render() {
    const card = document.createElement('div');
    card.className = 'bg-surface rounded-2xl p-5 shadow-lg hover:bg-surface-elevated transition-colors cursor-pointer animate-fade-in-up w-full';
    if (this.onClick) card.addEventListener('click', this.onClick);

    card.innerHTML = `
      <div class="flex items-center gap-4">
        ${this.icon ? `<span class="text-2xl">${this.iconIsHtml ? this.icon : sanitizeHTML(this.icon)}</span>` : ''}
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-semibold text-on-surface truncate">${sanitizeHTML(this.title)}</h3>
          <p class="text-sm text-on-surface-variant mt-1">${sanitizeHTML(this.description)}</p>
          ${this.extraHtml}
        </div>
        ${this.status ? `<span class="text-xs font-medium px-3 py-1 rounded-full bg-primary/20 text-primary whitespace-nowrap">${this.statusIsHtml ? this.status : sanitizeHTML(this.status)}</span>` : ''}
      </div>
    `;
    return card;
  }
}
