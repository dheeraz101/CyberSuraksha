import { stateManager } from './state.js';
import { t } from './i18n.js';

export function render(container) {
  const L = stateManager.get('language') || 'en';
  container.innerHTML = `
    <h2 class="text-2xl font-bold mb-4">${t(L, 'family_safety_pack')}</h2>
    <div class="bg-surface rounded-2xl p-5 border border-white/10 space-y-3" id="pack">
      <p>${t(L, 'family_emergency_line')}</p>
      <p>${t(L, 'family_never_share_line')}</p>
      <p>${t(L, 'family_never_install_line')}</p>
      <p>${t(L, 'family_verify_line')}</p>
      <p>${t(L, 'family_rule_line')}</p>
    </div>
    <button id="print-pack" class="mt-4 px-4 py-2 bg-primary text-white rounded-xl">${t(L, 'print_pack')}</button>
  `;
  container.querySelector('#print-pack')?.addEventListener('click', () => window.print());
}
