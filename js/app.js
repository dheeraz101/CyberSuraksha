import { stateManager } from './state.js';
import { Router } from './router.js';
import { ScamCard } from './components/ScamCard.js';
import { AppleDropdown } from './components/AppleDropdown.js';
import { SettingsModal } from './components/SettingsModal.js';
import { getLevel, getLevelProgressPercent, getProgressToNextLevel, XP_PER_LEVEL } from './xp.js';
import { evaluateBadges } from './badges.js';
import { applyTheme, applyAccessibility } from './theme.js';
import { t, localizeSimulationText } from './i18n.js';
import { logEvent } from './analytics.js';
import { updateStreak } from './streak.js';
import { extraSimulators, startExtraSimulator } from './simulators/extras.js';
import * as Quiz from './quiz.js';
import * as Emergency from './emergency.js';
import * as Dashboard from './dashboard.js';
import * as Community from './community.js';
import * as FamilyPack from './familyPack.js';
import * as Educator from './educator.js';
import * as CSR from './csr.js';

const appContainer = document.getElementById('app');
const router = new Router();

const baseSimulators = [
  { key: 'whatsapp', title: 'WhatsApp Scam', desc: 'Fake message urgency', icon: 'ri-chat-3-line', iconColor: 'text-green-400', category: 'Messaging', severity: 'severe' },
  { key: 'upi', title: 'UPI Fraud', desc: 'Collect request traps', icon: 'ri-bank-card-line', iconColor: 'text-blue-400', category: 'Banking', severity: 'critical' },
  { key: 'phishing', title: 'Phishing Email', desc: 'Domain spoof attacks', icon: 'ri-mail-open-line', iconColor: 'text-violet-400', category: 'Identity', severity: 'severe' },
  { key: 'olx', title: 'OLX Resale Scam', desc: 'QR and army ID tricks', icon: 'ri-store-2-line', iconColor: 'text-orange-400', category: 'Investment', severity: 'severe' },
  { key: 'parcel', title: 'Parcel / Courier Scam', desc: 'Fee and KYC extortion', icon: 'ri-truck-line', iconColor: 'text-amber-400', category: 'Messaging', severity: 'severe' }
];
const simulatorCatalog = [...baseSimulators];
const seen = new Set(baseSimulators.map((x) => x.key));
extraSimulators.forEach((sim) => {
  if (seen.has(sim.key)) return;
  seen.add(sim.key);
  simulatorCatalog.push(sim);
});

stateManager.init();
applyTheme(stateManager.get('theme') || 'dark');
applyAccessibility({ contrast: stateManager.get('contrast') || 'normal', fontSize: stateManager.get('fontSize') || 'md' });
updateStreak(stateManager);
evaluateBadges();

const LANG_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: '\u0939\u093f\u0902\u0926\u0940' }
];

function lang() {
  return stateManager.get('language') || 'en';
}

function renderHeader() {
  const aboutBtn = document.getElementById('about-btn');
  const settingsBtn = document.getElementById('settings-btn');
  const settingsDot = document.getElementById('settings-dot');
  const appTitle = document.getElementById('app-title');
  const installLabel = document.getElementById('install-pwa-label');
  if (!settingsBtn) return;

  const currentLang = lang();
  if (appTitle) appTitle.textContent = t(currentLang, 'app_name');
  if (installLabel) installLabel.textContent = t(currentLang, 'install_app');
  const footer = document.getElementById('app-footer-note');
  if (footer) footer.textContent = t(currentLang, 'footer_professional');
  if (settingsDot) settingsDot.classList.toggle('hidden', Boolean(stateManager.get('settingsSeen')));

  if (aboutBtn) {
    aboutBtn.onclick = () => openAboutModal(currentLang);
  }

  settingsBtn.onclick = () => {
    if (!stateManager.get('settingsSeen')) {
      stateManager.set('settingsSeen', true);
      settingsDot?.classList.add('hidden');
    }
    const modal = new SettingsModal({
      t,
      lang: currentLang,
      onLanguageChange: () => {
        renderHeader();
        router._onChange();
      }
    });
    modal.open();
  };

  const navMap = [
    ['home', t(currentLang, 'nav_home')],
    ['simulators', t(currentLang, 'nav_simulators')],
    ['quiz', t(currentLang, 'nav_quiz')],
    ['emergency', t(currentLang, 'nav_emergency')]
  ];
  navMap.forEach(([key, label]) => {
    const link = document.querySelector(`[data-nav="${key}"] span`);
    if (link) link.textContent = label;
  });
}

function openAboutModal(L) {
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4';
  overlay.innerHTML = `
    <div role="dialog" aria-modal="true" aria-label="${t(L, 'about_title')}" class="w-full max-w-lg bg-surface border border-white/10 rounded-2xl p-5 shadow-2xl animate-fade-in-up">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <h2 class="text-lg font-semibold">${t(L, 'about_title')}</h2>
          <span class="text-[10px] px-2 py-1 rounded-full bg-success/20 text-success border border-success/30 font-semibold">${t(L, 'beta')}</span>
        </div>
        <button id="about-close" class="w-9 h-9 rounded-xl bg-surface-elevated border border-white/10"><i class="ri-close-line"></i></button>
      </div>
      <p class="text-sm text-on-surface-variant">${t(L, 'about_tagline')}</p>
      <p class="text-sm text-on-surface-variant mt-2">${t(L, 'beta_notice')}</p>
      <p class="text-sm mt-3">${t(L, 'about_description')}</p>
      <a target="_blank" rel="noopener" href="https://yabp.netlify.app/" class="mt-4 inline-flex text-primary underline text-sm">${t(L, 'about_project_link')}</a>
      <div class="mt-4 flex items-center gap-3">
        <a aria-label="Email" href="mailto:cybersuraksha.2i7nm@aleeas.com" class="w-10 h-10 rounded-full bg-surface-elevated border border-white/10 inline-flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/30 transition-colors"><i class="ri-mail-fill text-lg"></i></a>
        <a aria-label="GitHub" target="_blank" rel="noopener" href="https://github.com/" class="w-10 h-10 rounded-full bg-surface-elevated border border-white/10 inline-flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/30 transition-colors"><i class="ri-github-fill text-lg"></i></a>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  const close = () => overlay.remove();
  overlay.querySelector('#about-close')?.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
}

function welcomeView() {
  const L = lang();
  appContainer.innerHTML = `
    <section class="animate-fade-in-up min-h-[75vh] flex items-center">
      <div class="w-full bg-surface rounded-3xl p-6 md:p-10 border border-white/10 shadow-2xl">
        <div class="flex items-center justify-between gap-3">
          <div class="inline-flex items-center rounded-full bg-success/20 text-success border border-success/30 px-3 py-1 text-xs font-semibold">${t(L, 'beta')}</div>
          <p class="text-[11px] text-on-surface-variant text-right">${t(L, 'legal_disclaimer')}</p>
        </div>
        <p class="text-xs text-on-surface-variant mt-2">${t(L, 'beta_notice')}</p>
        <p class="text-xs uppercase tracking-[0.2em] text-on-surface-variant mt-4 mb-3">${t(L, 'welcome_tag')}</p>
        <h1 class="text-3xl md:text-5xl font-bold leading-tight">${t(L, 'welcome_title')}</h1>
        <p class="text-on-surface-variant mt-3 text-sm md:text-base max-w-2xl">${t(L, 'welcome_desc')}</p>
        <div class="mt-6">
          <p class="text-xs uppercase tracking-widest text-on-surface-variant mb-2">${t(L, 'choose_language')}</p>
          <div id="welcome-language"></div>
          <p class="text-xs text-on-surface-variant mt-2">${t(L, 'more_languages_coming_soon')}</p>
        </div>
        <div class="mt-8 flex flex-col sm:flex-row gap-3">
          <button id="start-btn" class="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-semibold">${t(L, 'start_training')}</button>
          <button id="tour-btn" class="w-full sm:w-auto px-6 py-3 bg-surface-elevated border border-white/10 rounded-xl font-semibold">${t(L, 'explore_simulators')}</button>
        </div>
      </div>
    </section>
  `;

  const wl = document.getElementById('welcome-language');
  const welcomeDrop = new AppleDropdown({
    value: L,
    options: LANG_OPTIONS,
    onChange: (value) => {
      stateManager.set('language', value);
      renderHeader();
      welcomeView();
    }
  });
  wl.appendChild(welcomeDrop.render());

  document.getElementById('start-btn').addEventListener('click', () => {
    stateManager.set('onboarded', true);
    location.hash = '#/home';
  });
  document.getElementById('tour-btn').addEventListener('click', () => {
    stateManager.set('onboarded', true);
    location.hash = '#/simulators';
  });
}

function homeView() {
  const L = lang();
  const state = stateManager.getState();
  const level = getLevel();
  const progressPercent = getLevelProgressPercent();
  const progressXP = getProgressToNextLevel();

  appContainer.innerHTML = `
    <div class="animate-fade-in-up space-y-6">
      <div>
        <h1 class="text-3xl md:text-4xl font-bold text-on-surface">${t(L, 'home_title')}</h1>
        <p class="text-on-surface-variant text-sm mt-1">${t(L, 'home_subtitle')}</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-surface rounded-2xl p-5 shadow-lg md:col-span-2">
          <div class="flex justify-between items-end mb-2">
            <span class="text-sm text-on-surface-variant">${t(L, 'level')} ${level}</span>
            <span class="text-sm text-on-surface-variant">${progressXP} / ${XP_PER_LEVEL} XP</span>
          </div>
          <div class="w-full bg-white/10 rounded-full h-2.5 overflow-hidden"><div class="bg-primary h-full rounded-full transition-all" style="width: ${progressPercent}%"></div></div>
          <p class="text-on-surface-variant mt-2 text-sm">${t(L, 'total_xp')}: <span class="text-primary font-semibold">${state.xp}</span></p>
        </div>
      </div>
      <div><h2 class="text-lg font-semibold mb-3">${t(L, 'simulators')}</h2><div id="home-simcards" class="grid grid-cols-1 md:grid-cols-2 gap-3"></div></div>
      <div><h2 class="text-lg font-semibold mb-3">${t(L, 'knowledge_check')}</h2><div id="home-quizcard"></div></div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <a href="#/dashboard" class="bg-surface rounded-2xl p-4 border border-white/10 hover:bg-surface-elevated transition-colors"><i class="ri-bar-chart-box-line mr-2"></i>${t(L, 'impact_dashboard')} <span class="text-xs text-on-surface-variant">(${t(L, 'under_construction')})</span></a>
        <a href="#/community" class="bg-surface rounded-2xl p-4 border border-white/10 hover:bg-surface-elevated transition-colors"><i class="ri-community-line mr-2"></i>${t(L, 'community_hub')} <span class="text-xs text-on-surface-variant">(${t(L, 'under_construction')})</span></a>
        <a href="#/family-pack" class="bg-surface rounded-2xl p-4 border border-white/10 hover:bg-surface-elevated transition-colors"><i class="ri-shield-user-line mr-2"></i>${t(L, 'family_safety_pack')}</a>
        <button id="share-achievement" class="bg-surface rounded-2xl p-4 border border-white/10 text-left hover:bg-surface-elevated transition-colors"><i class="ri-share-forward-line mr-2"></i>${t(L, 'share_achievement_card')} <span class="text-xs text-on-surface-variant">(${t(L, 'under_construction')})</span></button>
        <a href="#/educator" class="bg-surface rounded-2xl p-4 border border-white/10 hover:bg-surface-elevated transition-colors"><i class="ri-graduation-cap-line mr-2"></i>${t(L, 'educator_panel')} <span class="text-xs text-on-surface-variant">(${t(L, 'under_construction')})</span></a>
        <a href="#/csr" class="bg-surface rounded-2xl p-4 border border-white/10 hover:bg-surface-elevated transition-colors"><i class="ri-briefcase-4-line mr-2"></i>${t(L, 'csr_panel')} <span class="text-xs text-on-surface-variant">(${t(L, 'under_construction')})</span></a>
      </div>
      <div class="bg-surface rounded-2xl p-4 border border-white/10 text-sm">${t(L, 'daily_challenge', { days: state.streak?.days || 0, done: state.weeklyCompleted || 0, goal: state.weeklyGoal || 5 })}</div>
      <button id="reset-btn" class="text-xs text-danger underline mt-2">${t(L, 'reset_progress')}</button>
    </div>
  `;

  const simContainer = document.getElementById('home-simcards');
  simulatorCatalog.slice(0, 8).forEach((cfg) => {
    const data = state.simulators[cfg.key] || { completed: false, score: 0 };
    const status = data.completed ? t(L, 'done_xp', { xp: data.score }) : t(L, 'pending');
    simContainer.appendChild(new ScamCard({ title: localizeSimulationText(L, cfg.title), description: localizeSimulationText(L, cfg.desc), icon: `<i class="${cfg.icon} ${cfg.iconColor || 'text-primary'}"></i>`, iconIsHtml: true, status, onClick: () => { location.hash = `#/simulator/${cfg.key}`; } }).render());
  });

  const quizData = state.quiz;
  document.getElementById('home-quizcard').appendChild(new ScamCard({
    title: t(L, 'quiz_title'),
    description: t(L, 'quiz_desc'),
    icon: '<i class="ri-question-line"></i>',
    iconIsHtml: true,
    status: quizData.completed ? `${quizData.correctAnswers}/${quizData.totalQuestions}` : t(L, 'pending'),
    onClick: () => { location.hash = '#/quiz'; }
  }).render());

  document.getElementById('share-achievement').addEventListener('click', () => {
    const text = t(L, 'achievement_share_text', { xp: state.xp });
    if (navigator.share) {
      navigator.share({ title: t(L, 'achievement_share_title'), text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      alert(t(L, 'achievement_copied'));
    }
  });

  logEvent('view_home', { lang: L });
}

function simulatorsListView() {
  const L = lang();
  appContainer.innerHTML = `
    <h2 class="text-2xl font-bold text-on-surface mb-3">${t(L, 'simulators')}</h2>
    <div id="sim-stats" class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4"></div>
    <div class="bg-surface rounded-2xl p-4 mb-4 border border-white/10">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input id="sim-search" class="w-full bg-surface-elevated border border-white/10 rounded-xl px-4 py-3 text-sm" placeholder="${t(L, 'search_placeholder')}" />
        <div id="sort-dropdown"></div>
      </div>
      <div class="mt-3"><p class="text-xs uppercase tracking-widest text-on-surface-variant mb-2">${t(L, 'category')}</p><div id="category-chips" class="flex flex-wrap gap-2"></div></div>
      <div class="mt-3"><p class="text-xs uppercase tracking-widest text-on-surface-variant mb-2">${t(L, 'severity')}</p><div id="severity-chips" class="flex flex-wrap gap-2"></div></div>
    </div>
    <div id="list-cards" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
    <div class="mt-4 flex items-center justify-between">
      <button id="sim-prev" class="px-4 py-2 rounded-xl border border-white/10 bg-surface-elevated text-sm">${t(L, 'previous')}</button>
      <p id="sim-page-info" class="text-sm text-on-surface-variant"></p>
      <button id="sim-next" class="px-4 py-2 rounded-xl border border-white/10 bg-surface-elevated text-sm">${t(L, 'next')}</button>
    </div>
  `;

  const container = document.getElementById('list-cards');
  const statsWrap = document.getElementById('sim-stats');
  const searchInput = document.getElementById('sim-search');
  const sortSlot = document.getElementById('sort-dropdown');
  const categoryWrap = document.getElementById('category-chips');
  const severityWrap = document.getElementById('severity-chips');
  const prevBtn = document.getElementById('sim-prev');
  const nextBtn = document.getElementById('sim-next');
  const pageInfo = document.getElementById('sim-page-info');

  let selectedCategory = 'All';
  let selectedSeverity = 'All';
  let selectedSort = 'severity';
  let query = '';
  let page = 1;
  const pageSize = 18;

  const categories = [
    { value: 'All', label: t(L, 'cat_all') },
    { value: 'Banking', label: t(L, 'cat_banking') },
    { value: 'Identity', label: t(L, 'cat_identity') },
    { value: 'Messaging', label: t(L, 'cat_messaging') },
    { value: 'Investment', label: t(L, 'cat_investment') },
    { value: 'Malware', label: t(L, 'cat_malware') }
  ];
  const severities = [
    { value: 'All', label: t(L, 'sev_all') },
    { value: 'critical', label: t(L, 'sev_critical') },
    { value: 'severe', label: t(L, 'sev_severe') },
    { value: 'low', label: t(L, 'sev_low') }
  ];

  sortSlot.appendChild(new AppleDropdown({ value: selectedSort, options: [
    { value: 'severity', label: t(L, 'sort_severity') },
    { value: 'az', label: t(L, 'sort_az') },
    { value: 'completed', label: t(L, 'sort_completed') }
  ], onChange: (v) => { selectedSort = v; page = 1; renderCards(); } }).render());

  function chip(label, active, cb) {
    const b = document.createElement('button');
    b.className = `px-3 py-1.5 rounded-full text-xs border ${active ? 'bg-primary/20 text-primary border-primary/30' : 'bg-surface-elevated text-on-surface-variant border-white/10'}`;
    b.textContent = label;
    b.addEventListener('click', cb);
    return b;
  }

  function renderChips() {
    categoryWrap.innerHTML = '';
    severityWrap.innerHTML = '';
    categories.forEach((cat) => categoryWrap.appendChild(chip(cat.label, selectedCategory === cat.value, () => { selectedCategory = cat.value; page = 1; renderChips(); renderCards(); })));
    severities.forEach((sev) => severityWrap.appendChild(chip(sev.label, selectedSeverity === sev.value, () => { selectedSeverity = sev.value; page = 1; renderChips(); renderCards(); })));
  }

  function filtered() {
    const arr = simulatorCatalog.filter((item) => {
      const c = selectedCategory === 'All' || item.category === selectedCategory;
      const s = selectedSeverity === 'All' || item.severity === selectedSeverity;
      const q = !query || `${item.title} ${item.desc} ${item.category} ${item.severity}`.toLowerCase().includes(query);
      return c && s && q;
    });
    const rank = { critical: 0, severe: 1, low: 2 };
    arr.sort((a, b) => {
      if (selectedSort === 'az') return a.title.localeCompare(b.title);
      if (selectedSort === 'completed') {
        const ad = stateManager.get(`simulators.${a.key}`)?.completed ? 1 : 0;
        const bd = stateManager.get(`simulators.${b.key}`)?.completed ? 1 : 0;
        if (bd !== ad) return bd - ad;
        return a.title.localeCompare(b.title);
      }
      return (rank[a.severity] ?? 9) - (rank[b.severity] ?? 9);
    });
    return arr;
  }

  function renderStats() {
    const total = simulatorCatalog.length;
    const done = simulatorCatalog.filter((x) => stateManager.get(`simulators.${x.key}`)?.completed).length;
    const byS = [
      `${t(L, 'sev_critical')}: ${simulatorCatalog.filter((x) => x.severity === 'critical').length}`,
      `${t(L, 'sev_severe')}: ${simulatorCatalog.filter((x) => x.severity === 'severe').length}`,
      `${t(L, 'sev_low')}: ${simulatorCatalog.filter((x) => x.severity === 'low').length}`
    ].join(', ');
    const byC = [
      `${t(L, 'cat_banking')}: ${simulatorCatalog.filter((x) => x.category === 'Banking').length}`,
      `${t(L, 'cat_identity')}: ${simulatorCatalog.filter((x) => x.category === 'Identity').length}`,
      `${t(L, 'cat_messaging')}: ${simulatorCatalog.filter((x) => x.category === 'Messaging').length}`,
      `${t(L, 'cat_investment')}: ${simulatorCatalog.filter((x) => x.category === 'Investment').length}`,
      `${t(L, 'cat_malware')}: ${simulatorCatalog.filter((x) => x.category === 'Malware').length}`
    ].join(', ');
    statsWrap.innerHTML = `
      <div class="bg-surface border border-white/10 rounded-2xl p-4"><p class="text-xs text-on-surface-variant">${t(L, 'overall')}</p><p class="text-lg font-semibold">${done}/${total} ${t(L, 'completed_word')}</p></div>
      <div class="bg-surface border border-white/10 rounded-2xl p-4"><p class="text-xs text-on-surface-variant">${t(L, 'by_severity')}</p><p class="text-sm">${byS}</p></div>
      <div class="bg-surface border border-white/10 rounded-2xl p-4"><p class="text-xs text-on-surface-variant">${t(L, 'by_category')}</p><p class="text-sm">${byC}</p></div>
    `;
  }

  function renderCards() {
    container.innerHTML = '';
    const arr = filtered();
    const pages = Math.max(1, Math.ceil(arr.length / pageSize));
    if (page > pages) page = pages;
    const slice = arr.slice((page - 1) * pageSize, page * pageSize);

    if (!arr.length) {
      container.innerHTML = `<div class="bg-surface rounded-2xl p-5 border border-white/10 text-on-surface-variant">${t(L, 'no_matches')}</div>`;
      pageInfo.textContent = '0';
      return;
    }

    slice.forEach((item) => {
      const data = stateManager.get(`simulators.${item.key}`) || { completed: false, score: 0 };
      const sevClass = item.severity === 'critical' ? 'text-red-400' : item.severity === 'severe' ? 'text-orange-400' : 'text-emerald-400';
      container.appendChild(new ScamCard({
        title: localizeSimulationText(L, item.title),
        description: `${localizeSimulationText(L, item.desc)}, ${localizeSimulationText(L, item.category)}, ${t(L, `sev_${item.severity}`)}`,
        icon: `<i class="${item.icon} ${item.iconColor || 'text-primary'}"></i>`,
        iconIsHtml: true,
        status: data.completed ? t(L, 'done_xp', { xp: data.score }) : `<span class="${sevClass}">${t(L, `sev_${item.severity}`)}</span>`,
        statusIsHtml: !data.completed,
        onClick: () => { location.hash = `#/simulator/${item.key}`; }
      }).render());
    });

    pageInfo.textContent = t(L, 'page_info', { page, pages, count: arr.length });
    prevBtn.disabled = page <= 1;
    nextBtn.disabled = page >= pages;
  }

  searchInput.addEventListener('input', (e) => { query = e.target.value.trim().toLowerCase(); page = 1; renderCards(); });
  prevBtn.addEventListener('click', () => { if (page > 1) { page -= 1; renderCards(); } });
  nextBtn.addEventListener('click', () => { if (page < Math.ceil(filtered().length / pageSize)) { page += 1; renderCards(); } });

  renderStats();
  renderChips();
  renderCards();
}

router.add('/welcome', welcomeView);
router.add('/home', homeView);
router.add('/simulators', simulatorsListView);
router.add('/simulator/whatsapp', () => startExtraSimulator(appContainer, 'whatsapp'));
router.add('/simulator/upi', () => startExtraSimulator(appContainer, 'upi'));
router.add('/simulator/phishing', () => startExtraSimulator(appContainer, 'phishing'));
router.add('/simulator/olx', () => startExtraSimulator(appContainer, 'olx'));
router.add('/simulator/parcel', () => startExtraSimulator(appContainer, 'parcel'));
extraSimulators.forEach((sim) => {
  if (baseSimulators.find((x) => x.key === sim.key)) return;
  router.add(`/simulator/${sim.key}`, () => startExtraSimulator(appContainer, sim.key));
});
router.add('/quiz', () => Quiz.start(appContainer));
router.add('/emergency', () => Emergency.render(appContainer, lang));
router.add('/dashboard', () => Dashboard.render(appContainer, t, lang, simulatorCatalog));
router.add('/community', () => Community.render(appContainer));
router.add('/family-pack', () => FamilyPack.render(appContainer));
router.add('/educator', () => Educator.render(appContainer));
router.add('/csr', () => CSR.render(appContainer));

if (!stateManager.get('onboarded') && !location.hash) location.hash = '#/welcome';
renderHeader();
router.start();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

let deferredInstallPrompt = null;
const installBtn = document.getElementById('install-pwa-btn');
function isAppInstalled() {
  return window.matchMedia('(display-mode: standalone)').matches || window.matchMedia('(display-mode: fullscreen)').matches || window.navigator.standalone === true;
}
function canShowInstallUI() {
  return window.matchMedia('(display-mode: browser)').matches && !isAppInstalled();
}
function showInstallUI(show) {
  if (!installBtn) return;
  if (!canShowInstallUI()) {
    installBtn.classList.add('hidden');
    return;
  }
  installBtn.classList.toggle('hidden', !show || !deferredInstallPrompt);
}
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  showInstallUI(true);
});

installBtn?.addEventListener('click', async () => {
  if (!deferredInstallPrompt) {
    showInstallUI(false);
    return;
  }
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  showInstallUI(false);
});

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  showInstallUI(false);
});

showInstallUI(false);

window.addEventListener('error', (e) => {
  logEvent('error', { message: e.message, file: e.filename, line: e.lineno });
});
window.addEventListener('unhandledrejection', (e) => {
  logEvent('unhandledrejection', { reason: String(e.reason || '') });
});
