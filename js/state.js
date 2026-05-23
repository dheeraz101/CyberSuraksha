const STORAGE_KEY = 'cybersuraksha_progress';

const defaultState = () => ({
  onboarded: false,
  theme: 'dark',
  language: 'en',
  contrast: 'normal',
  fontSize: 'md',
  settingsSeen: false,
  streak: { days: 0, lastPlayedDate: null },
  weeklyGoal: 5,
  weeklyCompleted: 0,
  modes: { educator: false, csr: false },
  analytics: { events: [], mostFailed: {} },
  xp: 0,
  totalCorrectAnswers: 0,
  badges: [],
  simulators: {
    whatsapp: { completed: false, score: 0 },
    upi: { completed: false, score: 0 },
    phishing: { completed: false, score: 0 },
    olx: { completed: false, score: 0 },
    parcel: { completed: false, score: 0 }
  },
  quiz: { completed: false, score: 0, totalQuestions: 0, correctAnswers: 0 }
});

class StateManager {
  constructor() {
    this._state = defaultState();
    this._listeners = [];
  }

  init() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this._state = this._sanitizeState(parsed);
      } catch (e) {
        this._state = defaultState();
      }
    } else {
      this._state = defaultState();
    }
    this._save();
  }

  get(path) {
    return path.split('.').reduce((obj, key) => obj?.[key], this._state);
  }

  set(path, value) {
    const keys = path.split('.');
    let obj = this._state;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!obj[keys[i]]) obj[keys[i]] = {};
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
    this._save();
    this._notify();
  }

  // Add XP and update total
  addXP(amount) {
    this._state.xp += amount;
    this._save();
    this._notify();
    return this._state.xp;
  }

  // Increment total correct answers (used for badge)
  incrementCorrectAnswers() {
    this._state.totalCorrectAnswers++;
    this._save();
    this._notify();
  }

  // Badge management
  addBadge(badge) {
    if (!this._state.badges.includes(badge)) {
      this._state.badges.push(badge);
      this._save();
      this._notify();
    }
  }

  getState() {
    return { ...this._state };
  }

  _save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._state));
  }

  reset() {
    this._state = defaultState();
    this._save();
    this._notify();
  }

  subscribe(callback) {
    this._listeners.push(callback);
    return () => {
      this._listeners = this._listeners.filter(cb => cb !== callback);
    };
  }

  _notify() {
    this._listeners.forEach(cb => cb(this._state));
  }

  _sanitizeState(parsed) {
    const defaults = defaultState();
    const safe = parsed && typeof parsed === 'object' ? parsed : {};
    const safeSims = safe.simulators && typeof safe.simulators === 'object' ? safe.simulators : {};
    const safeQuiz = safe.quiz && typeof safe.quiz === 'object' ? safe.quiz : {};

    return {
      ...defaults,
      ...safe,
      badges: Array.isArray(safe.badges) ? safe.badges : defaults.badges,
      simulators: {
        ...defaults.simulators,
        ...safeSims
      },
      quiz: {
        ...defaults.quiz,
        ...safeQuiz
      }
    };
  }
}

export const stateManager = new StateManager();
