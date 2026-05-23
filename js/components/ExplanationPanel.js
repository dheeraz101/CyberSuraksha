export class ExplanationPanel {
  constructor({ type = 'info', message }) {
    this.type = type; // 'success', 'error', 'info'
    this.message = message;
  }

  render() {
    const panel = document.createElement('div');
    const bgMap = {
      success: 'bg-success/10 border-success/30 text-success',
      error: 'bg-danger/10 border-danger/30 text-danger',
      info: 'bg-primary/10 border-primary/30 text-primary'
    };
    panel.className = `p-4 rounded-xl border ${bgMap[this.type] || bgMap.info} animate-fade-in-up mt-4`;
    panel.textContent = this.message;
    return panel;
  }
}
