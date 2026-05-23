import { stateManager } from './state.js';

export function render(container) {
  const hi = (stateManager.get('language') || 'en') === 'hi';
  container.innerHTML = `
    <h2 class="text-2xl font-bold mb-2"><i class="ri-graduation-cap-line mr-2"></i>${hi ? 'एजुकेटर पैनल' : 'Educator Panel'}</h2>
    <p class="text-sm text-on-surface-variant mb-4">${hi ? 'निर्माणाधीन' : 'Under construction'}</p>
    <div class="bg-surface rounded-2xl p-5 border border-white/10"><p class="text-on-surface-variant text-sm">${hi ? 'स्कूल/कॉलेज रिपोर्ट जल्द उपलब्ध होंगी।' : 'School/college reports coming soon.'}</p></div>
  `;
}
