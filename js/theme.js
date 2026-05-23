export function applyTheme(theme) {
  const isDark = theme === 'dark';
  document.documentElement.classList.toggle('dark', isDark);
  document.body?.setAttribute('data-theme', isDark ? 'dark' : 'light');
}

export function applyAccessibility({ contrast = 'normal', fontSize = 'md' } = {}) {
  if (!document.body) return;
  document.body.setAttribute('data-contrast', contrast);
  document.body.setAttribute('data-font-size', fontSize);
}
