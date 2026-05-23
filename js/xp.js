import { stateManager } from './state.js';

export const XP_PER_LEVEL = 50;

export function getXP() {
  return stateManager.get('xp');
}

export function addXP(amount) {
  const newXP = stateManager.addXP(amount);
  return newXP;
}

export function getLevel() {
  return Math.floor(getXP() / XP_PER_LEVEL) + 1;
}

export function getProgressToNextLevel() {
  const xp = getXP();
  const currentLevelXP = (getLevel() - 1) * XP_PER_LEVEL;
  return xp - currentLevelXP; // XP within current level
}

export function getLevelProgressPercent() {
  return Math.floor((getProgressToNextLevel() / XP_PER_LEVEL) * 100);
}

export function resetProgress() {
  stateManager.set('xp', 0);
  stateManager.set('totalCorrectAnswers', 0);
  stateManager.set('badges', []);
}
