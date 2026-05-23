import { stateManager } from './state.js';

export function render(container) {
  const hi = (stateManager.get('language') || 'en') === 'hi';
  container.innerHTML = `
    <h2 class="text-2xl font-bold mb-2"><i class="ri-community-line mr-2"></i>${hi ? 'कम्युनिटी और अलर्ट' : 'Community & Alerts'}</h2>
    <p class="text-sm text-on-surface-variant mb-4">${hi ? 'निर्माणाधीन' : 'Under construction'}</p>
    <div class="bg-surface rounded-2xl p-5 border border-white/10 space-y-4">
      <form id="report-form" class="space-y-3">
        <p class="font-semibold">${hi ? 'स्कैम पैटर्न रिपोर्ट करें' : 'Report Scam Pattern'} <span class="text-xs text-on-surface-variant">(${hi ? 'निर्माणाधीन' : 'Under construction'})</span></p>
        <input required id="scam-title" class="w-full bg-surface-elevated border border-white/10 rounded-xl px-3 py-2" placeholder="${hi ? 'स्कैम शीर्षक' : 'Scam title'}" />
        <textarea required id="scam-desc" class="w-full bg-surface-elevated border border-white/10 rounded-xl px-3 py-2" placeholder="${hi ? 'क्या हुआ?' : 'What happened?'}"></textarea>
        <button class="px-4 py-2 bg-primary text-white rounded-xl">${hi ? 'सबमिट करें' : 'Submit'}</button>
      </form>
    </div>
  `;
  container.querySelector('#report-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert(hi ? 'रिपोर्ट प्राप्त हुई। धन्यवाद।' : 'Scam pattern submitted. Thank you.');
    e.target.reset();
  });
}
