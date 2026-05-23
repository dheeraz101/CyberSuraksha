import { stateManager } from './state.js';

// Check and award badges based on current state
export function evaluateBadges() {
  const state = stateManager.getState();
  const sims = state.simulators;

  // First Step: complete at least one simulator
  const anySimCompleted = Object.values(sims).some(s => s.completed);
  if (anySimCompleted && !state.badges.includes('First Step')) {
    stateManager.addBadge('First Step');
  }

  // Scam Spotter: 5 correct answers (total from simulators + quiz)
  if (state.totalCorrectAnswers >= 5 && !state.badges.includes('Scam Spotter')) {
    stateManager.addBadge('Scam Spotter');
  }

  // Cyber Guardian: 100 XP
  if (state.xp >= 100 && !state.badges.includes('Cyber Guardian')) {
    stateManager.addBadge('Cyber Guardian');
  }
}
