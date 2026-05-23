export class XPToast {
  constructor(xp, source) {
    this.xp = xp;
    this.source = source;
    this.container = document.createElement('div');
    this.container.className = 'fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 animate-toast-in pointer-events-none';
    this.container.innerHTML = `
      <div class="bg-primary text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2">
        <span class="text-lg">âš¡</span>
        <span class="font-semibold">+${xp} XP</span>
        <span class="text-white/70 text-sm">${this.source}</span>
      </div>
    `;
  }

  show(duration = 2000) {
    document.body.appendChild(this.container);
    setTimeout(() => this.container.remove(), duration);
  }
}
