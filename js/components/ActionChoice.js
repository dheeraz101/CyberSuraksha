export class ActionChoice {
  constructor({ text, onClick, disabled = false, variant = 'default' }) {
    this.text = text;
    this.onClick = onClick;
    this.disabled = disabled;
    this.variant = variant; // 'default', 'correct', 'incorrect'
    this.element = null;
  }

  render() {
    this.element = document.createElement('button');
    this._applyClasses();
    this.element.textContent = this.text;
    if (this.onClick) this.element.addEventListener('click', this.onClick);
    if (this.disabled) this.element.disabled = true;
    return this.element;
  }

  setVariant(variant) {
    this.variant = variant;
    if (this.element) this._applyClasses();
  }

  _applyClasses() {
    const base = 'w-full text-left p-4 rounded-xl border-2 transition-all duration-200 font-medium text-base focus:outline-none focus:ring-2 focus:ring-primary/50';
    switch (this.variant) {
      case 'correct':
        this.element.className = `${base} border-success bg-success/10 text-success`;
        break;
      case 'incorrect':
        this.element.className = `${base} border-danger bg-danger/10 text-danger`;
        break;
      default:
        this.element.className = `${base} border-white/10 bg-surface hover:border-primary/50 text-on-surface`;
    }
  }
}
