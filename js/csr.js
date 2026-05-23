import { stateManager } from './state.js';

export function render(container) {
  const hi = (stateManager.get('language') || 'en') === 'hi';
  container.innerHTML = `
    <h2 class="text-2xl font-bold mb-2"><i class="ri-briefcase-4-line mr-2"></i>${hi ? 'सीएसआर पैनल' : 'CSR Panel'}</h2>
    <p class="text-sm text-on-surface-variant mb-4">${hi ? 'निर्माणाधीन' : 'Under construction'}</p>
    <div class="bg-surface rounded-2xl p-5 border border-white/10"><p class="text-on-surface-variant text-sm">${hi ? 'सीएसआर प्रभाव रिपोर्ट जल्द उपलब्ध होंगी।' : 'CSR impact reports coming soon.'}</p></div>
  `;
}
