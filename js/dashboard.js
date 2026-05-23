import { stateManager } from './state.js';

export function render(container, t, lang, simulatorCatalog) {
  const hi = (typeof lang === 'function' ? lang() : 'en') === 'hi';
  const state = stateManager.getState();
  const completed = simulatorCatalog.filter((s) => state.simulators?.[s.key]?.completed).length;
  const mostFailed = Object.entries(state.analytics?.mostFailed || {}).sort((a, b) => b[1] - a[1]).slice(0, 5);
  container.innerHTML = `
    <h2 class="text-2xl font-bold mb-4"><i class="ri-bar-chart-box-line mr-2"></i>${hi ? 'प्रभाव डैशबोर्ड' : 'Impact Dashboard'} <span class="text-sm text-on-surface-variant">(${hi ? 'निर्माणाधीन' : 'Under construction'})</span></h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div class="bg-surface rounded-2xl p-5 border border-white/10"><p class="text-xs text-on-surface-variant">${hi ? 'प्रशिक्षित लोग' : 'People Trained'}</p><p class="text-2xl font-bold">${state.analytics?.events?.length || 0}</p></div>
      <div class="bg-surface rounded-2xl p-5 border border-white/10"><p class="text-xs text-on-surface-variant">${hi ? 'पूर्ण मॉड्यूल' : 'Modules Completed'}</p><p class="text-2xl font-bold">${completed}</p></div>
      <div class="bg-surface rounded-2xl p-5 border border-white/10"><p class="text-xs text-on-surface-variant">${hi ? 'साप्ताहिक लक्ष्य' : 'Weekly Goal'}</p><p class="text-2xl font-bold">${state.weeklyCompleted || 0}/${state.weeklyGoal || 5}</p></div>
    </div>
    <div class="bg-surface rounded-2xl p-5 border border-white/10">
      <h3 class="font-semibold mb-2">${hi ? 'सबसे कठिन परिदृश्य' : 'Top Failed Scenarios'}</h3>
      ${mostFailed.length ? `<ul class="space-y-1 text-sm">${mostFailed.map((m) => `<li>${m[0]}: ${m[1]}</li>`).join('')}</ul>` : `<p class="text-on-surface-variant text-sm">${hi ? 'अभी डेटा उपलब्ध नहीं' : 'No data yet'}</p>`}
    </div>
  `;
}
