export function updateStreak(stateManager) {
  const today = new Date().toISOString().slice(0, 10);
  const last = stateManager.get('streak.lastPlayedDate');
  const days = stateManager.get('streak.days') || 0;
  if (last === today) return;
  const next = days + 1;
  stateManager.set('streak.lastPlayedDate', today);
  stateManager.set('streak.days', next);
}
