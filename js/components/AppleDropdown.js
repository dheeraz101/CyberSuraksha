export class AppleDropdown {
  constructor({ label = '', value = '', options = [], onChange }) {
    this.label = label;
    this.value = value;
    this.options = options;
    this.onChange = onChange;
    this.root = null;
    this.menu = null;
    this.button = null;
  }

  render() {
    this.root = document.createElement('div');
    this.root.className = 'relative';

    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.className = 'w-full bg-surface-elevated border border-white/10 rounded-xl px-4 py-3 text-sm flex items-center justify-between hover:border-primary/40 transition-colors';
    this.button.innerHTML = `<span>${this._labelFor(this.value)}</span><i class="ri-arrow-down-s-line text-on-surface-variant"></i>`;

    this.menu = document.createElement('div');
    this.menu.className = 'hidden absolute top-full left-0 right-0 mt-2 bg-surface border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50';

    this.options.forEach((opt) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'w-full text-left px-4 py-2.5 text-sm hover:bg-surface-elevated transition-colors';
      item.textContent = opt.label;
      item.addEventListener('click', () => {
        this.value = opt.value;
        this.button.innerHTML = `<span>${opt.label}</span><i class="ri-arrow-down-s-line text-on-surface-variant"></i>`;
        this.close();
        if (this.onChange) this.onChange(opt.value);
      });
      this.menu.appendChild(item);
    });

    this.button.addEventListener('click', () => {
      if (this.menu.classList.contains('hidden')) this.open();
      else this.close();
    });

    document.addEventListener('click', (e) => {
      if (!this.root.contains(e.target)) this.close();
    });

    this.root.appendChild(this.button);
    this.root.appendChild(this.menu);
    return this.root;
  }

  open() { this.menu.classList.remove('hidden'); }
  close() { this.menu.classList.add('hidden'); }

  _labelFor(value) {
    const hit = this.options.find((opt) => opt.value === value);
    return hit ? hit.label : this.label;
  }
}
