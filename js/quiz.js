import { stateManager } from './state.js';
import { ActionChoice } from './components/ActionChoice.js';
import { ExplanationPanel } from './components/ExplanationPanel.js';
import { XPToast } from './components/XPToast.js';
import { addXP } from './xp.js';
import { evaluateBadges } from './badges.js';
import { t } from './i18n.js';

const questions = {
  en: [
    { q: 'What should you do with an unsolicited OTP?', options: ['Ignore it', 'Share if asked', 'Forward to friend', 'Call bank support'], correct: 3 },
    { q: 'A key phishing sign is:', options: ['Official logo', 'Spelling mistakes + urgency', 'Known contact name', 'None'], correct: 1 },
    { q: 'How do you verify suspicious payment request?', options: ['Call number in message', 'Click link', 'Use official website/app', 'Reply quickly'], correct: 2 }
  ],
  hi: [
    { q: 'अनचाहा OTP आने पर क्या करें?', options: ['इसे नजरअंदाज करें', 'मांगने पर साझा करें', 'मित्र को भेजें', 'बैंक सहायता को कॉल करें'], correct: 3 },
    { q: 'फिशिंग का प्रमुख संकेत क्या है?', options: ['ऑफिशियल लोगो', 'वर्तनी गलती और तुरंत दबाव', 'जान-पहचान का नाम', 'कोई नहीं'], correct: 1 },
    { q: 'संदिग्ध पेमेंट रिक्वेस्ट कैसे सत्यापित करें?', options: ['मैसेज वाला नंबर कॉल करें', 'लिंक खोलें', 'ऑफिशियल वेबसाइट या ऐप इस्तेमाल करें', 'तुरंत उत्तर दें'], correct: 2 }
  ]
};

export function start(container) {
  const lang = stateManager.get('language') || 'en';
  const qset = questions[lang] || questions.en;
  let current = 0;
  let score = 0;

  function render() {
    const q = qset[current];
    container.innerHTML = `<h2 class="text-2xl font-bold text-on-surface mb-6">${t(lang, 'quiz_heading')}</h2>`;

    const card = document.createElement('div');
    card.className = 'bg-surface rounded-2xl p-5 shadow-lg mb-4';
    card.innerHTML = `<h3 class="font-semibold text-on-surface">${current + 1}. ${q.q}</h3>`;
    container.appendChild(card);

    const choices = document.createElement('div');
    choices.className = 'flex flex-col gap-3';
    q.options.forEach((opt, idx) => {
      const action = new ActionChoice({ text: opt });
      const el = action.render();
      el.addEventListener('click', () => handleAnswer(idx, action));
      choices.appendChild(el);
    });
    container.appendChild(choices);

    const fb = document.createElement('div');
    fb.id = 'fb';
    container.appendChild(fb);
  }

  function handleAnswer(selected, actionComp) {
    const q = qset[current];
    const correct = selected === q.correct;
    document.querySelectorAll('#app button').forEach((b) => { b.disabled = true; });
    if (correct) {
      actionComp.setVariant('correct');
      score += 1;
    } else {
      actionComp.setVariant('incorrect');
    }

    const fb = document.getElementById('fb');
    fb.appendChild(new ExplanationPanel({
      type: correct ? 'success' : 'error',
      message: correct ? t(lang, 'quiz_correct') : t(lang, 'quiz_wrong_answer', { answer: q.options[q.correct] })
    }).render());

    const next = document.createElement('button');
    next.className = 'mt-4 w-full py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl';
    next.textContent = current < qset.length - 1 ? t(lang, 'quiz_next') : t(lang, 'finish');
    next.addEventListener('click', () => {
      if (current < qset.length - 1) {
        current += 1;
        render();
      } else {
        finish();
      }
    });
    fb.appendChild(next);
  }

  function finish() {
    const points = score * 10;
    stateManager.set('quiz.completed', true);
    stateManager.set('quiz.score', points);
    stateManager.set('quiz.totalQuestions', qset.length);
    stateManager.set('quiz.correctAnswers', score);
    addXP(points);
    stateManager.incrementCorrectAnswers();
    evaluateBadges();
    new XPToast(points, t(lang, 'quiz_title')).show();

    container.innerHTML = `
      <div class="text-center animate-fade-in-up">
        <h2 class="text-2xl font-bold text-on-surface mb-4">${t(lang, 'complete_title')}</h2>
        <div class="bg-surface rounded-2xl p-8 shadow-lg">
          <p class="text-3xl font-bold text-primary">${points} XP</p>
          <p class="text-on-surface-variant">${score}/${qset.length}</p>
          <button class="mt-6 py-3 px-8 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl" onclick="location.hash='#/home'">${t(lang, 'home')}</button>
        </div>
      </div>
    `;
  }

  render();
}
