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
    { title: 'Fake Collect Request', msg: 'Receive money by entering UPI PIN now.', safe: 'Block and report', unsafe: 'Enter UPI PIN', whySafe: 'Receiving money never requires UPI PIN.', whyUnsafe: 'Entering UPI PIN authorizes a debit.' }
  ],
  hi: [
    { title: 'फर्जी कलेक्ट रिक्वेस्ट', msg: 'अभी UPI PIN डालें और पैसे प्राप्त करें।', safe: 'ब्लॉक करें और रिपोर्ट करें', unsafe: 'UPI PIN दर्ज करें', whySafe: 'पैसे प्राप्त करने के लिए UPI PIN नहीं लगता।', whyUnsafe: 'UPI PIN डालने से पैसे कट सकते हैं।' }
  ]
};

export function start(container) {
  const lang = stateManager.get('language') || 'en';
  const s = (scenarios[lang] || scenarios.en)[0];
  let score = 0;

  container.innerHTML = `<h2 class="text-2xl font-bold text-on-surface mb-6">${lang === 'hi' ? 'यूपीआई धोखाधड़ी' : 'UPI Fraud'}</h2>`;
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
        stateManager.set('simulators.upi.completed', true);
        stateManager.set('simulators.upi.score', score);
        addXP(score);
        if (score > 0) stateManager.incrementCorrectAnswers();
        evaluateBadges();
        new XPToast(score, lang === 'hi' ? 'यूपीआई' : 'UPI').show();
        container.innerHTML = `<div class="text-center"><h2 class="text-2xl font-bold mb-4">${t(lang, 'complete_title')}</h2><button class="py-3 px-8 bg-primary text-white rounded-xl" onclick="location.hash='#/simulators'">${t(lang, 'back_to_simulators')}</button></div>`;
      };
      fb.appendChild(done);
      box.appendChild(fb);
    });
    box.appendChild(el);
  });

  container.appendChild(box);
}


