export class Router {
  constructor() {
    this.routes = new Map();
    window.addEventListener('hashchange', () => this._onChange());
  }

  add(pattern, handler) {
    this.routes.set(pattern, handler);
  }

  start() {
    if (!location.hash) location.hash = '#/home';
    this._onChange();
  }

  _onChange() {
    const hash = location.hash.slice(1) || '/home';
    const handler = this.routes.get(hash);
    if (handler) {
      try {
        handler();
        this._updateNav(hash);
      } catch (err) {
        const app = document.getElementById('app');
        if (app) {
          app.innerHTML = `
            <div style="color:#ff453a;padding:16px;font-family:system-ui">
              Something went wrong while opening <b>${hash}</b>. Please try again.
            </div>
          `;
        }
      }
    } else {
      location.hash = '#/home';
    }
  }

  _updateNav(hash) {
    document.querySelectorAll('[data-nav]').forEach(el => {
      const route = el.getAttribute('data-nav');
      const isSimulator = hash.startsWith('/simulator') && route === 'simulators';
      if (hash === `/${route}` || isSimulator) {
        el.classList.add('text-primary');
      } else {
        el.classList.remove('text-primary');
      }
    });
  }
}
