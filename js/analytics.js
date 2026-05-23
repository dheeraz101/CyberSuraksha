import { stateManager } from './state.js';

export function logEvent(type, payload = {}) {
  const events = stateManager.get('analytics.events') || [];
  const next = [...events, { type, payload, ts: new Date().toISOString() }].slice(-500);
  stateManager.set('analytics.events', next);
}

export function logFailure(simKey) {
  const mf = stateManager.get('analytics.mostFailed') || {};
  mf[simKey] = (mf[simKey] || 0) + 1;
  stateManager.set('analytics.mostFailed', mf);
}
