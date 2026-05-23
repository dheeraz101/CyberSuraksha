import { t, localizeSimulationText } from './i18n.js';

export function render(container, getLang) {
  const lang = typeof getLang === 'function' ? getLang() : 'en';
  container.innerHTML = `
    <h2 class="text-2xl md:text-3xl font-bold text-on-surface mb-2">${t(lang, 'emergency_title')}</h2>
    <p class="text-on-surface-variant mb-6">${t(lang, 'emergency_subtitle')}</p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <a href="tel:1930" class="bg-surface rounded-2xl p-5 shadow-lg border border-primary/30 block hover:bg-surface-elevated transition-colors">
        <p class="text-xs uppercase tracking-widest text-on-surface-variant">${t(lang, 'priority_step')}</p>
        <h3 class="text-lg font-semibold mt-1">${t(lang, 'call_cyber_helpline')}</h3>
        <p class="text-3xl font-bold text-primary mt-2">1930</p>
        <p class="text-sm text-on-surface-variant mt-2">${t(lang, 'tap_to_call')}</p>
      </a>
      <a href="https://cybercrime.gov.in" target="_blank" rel="noopener" class="bg-surface rounded-2xl p-5 shadow-lg border border-white/10 block hover:bg-surface-elevated transition-colors">
        <p class="text-xs uppercase tracking-widest text-on-surface-variant">${t(lang, 'report_portal')}</p>
        <h3 class="text-lg font-semibold mt-1">cybercrime.gov.in</h3>
        <p class="text-on-surface-variant mt-2">${t(lang, 'report_portal_desc')}</p>
      </a>
    </div>

    <div class="mt-4 bg-surface rounded-2xl p-5 shadow-lg border border-white/10">
      <h3 class="text-lg font-semibold">${t(lang, 'first_30_actions')}</h3>
      <p class="text-on-surface-variant mt-2">${t(lang, 'first_30_actions_desc')}</p>
      <div class="mt-3 flex flex-wrap gap-2">
        <span class="bg-primary/20 text-primary text-xs px-3 py-1.5 rounded-full">${t(lang, 'transaction_id')}</span>
        <span class="bg-primary/20 text-primary text-xs px-3 py-1.5 rounded-full">${t(lang, 'scam_number')}</span>
        <span class="bg-primary/20 text-primary text-xs px-3 py-1.5 rounded-full">${t(lang, 'chat_email_shots')}</span>
        <span class="bg-primary/20 text-primary text-xs px-3 py-1.5 rounded-full">${t(lang, 'upi_reference')}</span>
      </div>
    </div>

    <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-surface rounded-2xl p-5 shadow-lg">
        <h3 class="text-lg font-semibold">${t(lang, 'official_contacts')}</h3>
        <p class="text-on-surface-variant mt-2"><span class="text-on-surface font-semibold">${t(lang, 'women_helpline')}:</span> <a class="text-primary underline" href="tel:1091">1091</a></p>
        <p class="text-on-surface-variant mt-2"><span class="text-on-surface font-semibold">CERT-In:</span> <a class="text-primary underline" href="https://www.cert-in.org.in" target="_blank" rel="noopener">cert-in.org.in</a></p>
        <p class="text-on-surface-variant mt-2"><span class="text-on-surface font-semibold">${t(lang, 'support_email')}:</span> <a class="text-primary underline" href="mailto:incident@cert-in.org.in">incident@cert-in.org.in</a></p>
      </div>
      <div class="bg-surface rounded-2xl p-5 shadow-lg">
        <h3 class="text-lg font-semibold">${t(lang, 'critical_donts')}</h3>
        <p class="text-on-surface-variant mt-2"><span class="text-on-surface font-semibold">${t(lang, 'never_share')}:</span> ${t(lang, 'never_share_desc')}</p>
        <p class="text-on-surface-variant mt-2"><span class="text-on-surface font-semibold">${t(lang, 'never_install')}:</span> ${t(lang, 'never_install_desc')}</p>
        <p class="text-on-surface-variant mt-2"><span class="text-on-surface font-semibold">${t(lang, 'never_panic_pay')}:</span> ${t(lang, 'never_panic_pay_desc')}</p>
      </div>
    </div>

    <div class="mt-4 bg-surface rounded-2xl p-5 shadow-lg border border-white/10">
      <h3 class="text-lg font-semibold">${t(lang, 'run_targeted_sims')}</h3>
      <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
        <a class="text-primary underline" href="#/simulator/upi">${localizeSimulationText(lang, 'UPI Fraud')}</a>
        <a class="text-primary underline" href="#/simulator/vishing-call">${localizeSimulationText(lang, 'Vishing Call Fraud')}</a>
        <a class="text-primary underline" href="#/simulator/sim-swap">${localizeSimulationText(lang, 'SIM Swap')}</a>
        <a class="text-primary underline" href="#/simulator/ransomware-attack">${localizeSimulationText(lang, 'Ransomware Attack')}</a>
        <a class="text-primary underline" href="#/simulator/fake-bank-message">${localizeSimulationText(lang, 'Fake SBI/HDFC Message')}</a>
        <a class="text-primary underline" href="#/simulator/malicious-apk">${localizeSimulationText(lang, 'Malicious APK Download')}</a>
        <a class="text-primary underline" href="#/simulator/public-wifi-mitm">${localizeSimulationText(lang, 'Public Wi-Fi MITM')}</a>
        <a class="text-primary underline" href="#/simulator/deepfake-scam">${localizeSimulationText(lang, 'Deepfake Scam')}</a>
      </div>
    </div>
  `;
}
