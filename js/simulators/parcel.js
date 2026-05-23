import { stateManager } from '../state.js';
import { ActionChoice } from '../components/ActionChoice.js';
import { ExplanationPanel } from '../components/ExplanationPanel.js';
import { XPToast } from '../components/XPToast.js';
import { ChatThread } from '../components/ChatThread.js';
import { addXP } from '../xp.js';
import { evaluateBadges } from '../badges.js';
import { t } from '../i18n.js';

const scenarios = {
  en: [
    { title: 'Customs Fee Alert', msg: 'Pay customs fee now to release parcel.', safe: 'Block and report', unsafe: 'Pay fee from link', whySafe: 'Verify courier from official app or helpline.', whyUnsafe: 'Fake parcel links steal payment and identity data.' }
  ],
  hi: [
    { title: 'कस्टम शुल्क अलर्ट', msg: 'पार्सल रिलीज करने के लिए अभी शुल्क भरें।', safe: 'ब्लॉक करें और रिपोर्ट करें', unsafe: 'लिंक से शुल्क भरें', whySafe: 'कूरियर की पुष्टि केवल आधिकारिक ऐप या हेल्पलाइन से करें।', whyUnsafe: 'फर्जी पार्सल लिंक भुगतान और पहचान डेटा चुरा सकते हैं।' }
  ]
};

export function start(container) {
  const lang = stateManager.get('language') || 'en';
  const s = (scenarios[lang] || scenarios.en)[0];
  let score = 0;

  container.innerHTML = `<h2 class="text-2xl font-bold text-on-surface mb-6">${lang === 'hi' ? 'पार्सल या कूरियर स्कैम' : 'Parcel or Courier Scam'}</h2>`;
  container.appendChild(new ChatThread({ title: s.title, sender: 'Unknown', messages: [{ from: 'scammer', text: s.msg }] }).render());

  const box = document.createElement('div');
  box.className = 'flex flex-col gap-3 mt-6';
  [
    { text: s.safe, ok: true, fb: s.whySafe },
    { text: s.unsafe, ok: false, fb: s.whyUnsafe }
  ].forEach((c) => {
    const a = new ActionChoice({ text: c.text });
    const el = a.render();
    el.addEventListener('click', () => {
      document.querySelectorAll('#app button').forEach((b) => { b.disabled = true; });
      a.setVariant(c.ok ? 'correct' : 'incorrect');
      if (c.ok) score = 10;
      const fb = document.createElement('div');
      fb.appendChild(new ExplanationPanel({ type: c.ok ? 'success' : 'error', message: c.fb }).render());
      const done = document.createElement('button');
      done.className = 'mt-4 w-full py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl';
      done.textContent = t(lang, 'finish');
      done.onclick = () => {
        stateManager.set('simulators.parcel.completed', true);
        stateManager.set('simulators.parcel.score', score);
        addXP(score);
        if (score > 0) stateManager.incrementCorrectAnswers();
        evaluateBadges();
        new XPToast(score, lang === 'hi' ? 'पार्सल' : 'Parcel').show();
        container.innerHTML = `<div class="text-center"><h2 class="text-2xl font-bold mb-4">${t(lang, 'complete_title')}</h2><button class="py-3 px-8 bg-primary text-white rounded-xl" onclick="location.hash='#/simulators'">${t(lang, 'back_to_simulators')}</button></div>`;
      };
      fb.appendChild(done);
      box.appendChild(fb);
    });
    box.appendChild(el);
  });

  container.appendChild(box);
}


