import { stateManager } from '../state.js';
import { ActionChoice } from '../components/ActionChoice.js';
import { ExplanationPanel } from '../components/ExplanationPanel.js';
import { XPToast } from '../components/XPToast.js';
import { ChatThread } from '../components/ChatThread.js';
import { EmailPreview } from '../components/EmailPreview.js';
import { ScamPopup } from '../components/ScamPopup.js';
import { PhoneCallCard } from '../components/PhoneCallCard.js';
import { SMSInboxCard } from '../components/SMSInboxCard.js';
import { PortalMockCard } from '../components/PortalMockCard.js';
import { AppMockCard } from '../components/AppMockCard.js';
import { addXP } from '../xp.js';
import { evaluateBadges } from '../badges.js';
import { t, localizeSimulationText } from '../i18n.js';

function sim(key, title, desc, category, severity, icon, iconColor, mode, signal) {
  return { key, title, desc, category, severity, icon, iconColor, mode, signal };
}

export const extraSimulators = [
  sim('whatsapp', 'WhatsApp Scam', 'Fake message urgency and OTP theft', 'Messaging', 'severe', 'ri-chat-3-line', 'text-green-400', 'chat', 'Urgent message asks for OTP and account verification.'),
  sim('upi', 'UPI Fraud', 'Collect request and PIN misuse traps', 'Banking', 'critical', 'ri-bank-card-line', 'text-blue-400', 'popup', 'Receive money request asks you to enter UPI PIN.'),
  sim('phishing', 'Phishing Email', 'Domain spoofing and credential theft', 'Identity', 'severe', 'ri-mail-open-line', 'text-violet-400', 'email', 'KYC mail asks login through suspicious domain.'),
  sim('olx', 'OLX Resale Scam', 'Buyer token and QR payment tricks', 'Investment', 'severe', 'ri-store-2-line', 'text-orange-400', 'chat', 'Buyer asks token payment to release full amount.'),
  sim('parcel', 'Parcel / Courier Scam', 'Fake customs fee and link fraud', 'Messaging', 'severe', 'ri-truck-line', 'text-amber-400', 'sms', 'Pay customs fee now to release your parcel.'),
  sim('scam-identification', 'Identifying Scams', 'Spot urgency, spoofing and pressure', 'Messaging', 'low', 'ri-search-eye-line', 'text-cyan-400', 'chat', 'Urgent claim link from unknown sender.'),
  sim('fake-website', 'Fake Website', 'Lookalike domains stealing logins', 'Identity', 'severe', 'ri-global-line', 'text-orange-400', 'email', 'Domain mismatch and fake SSL claims.'),
  sim('fake-upi-app', 'Fake UPI App', 'Clone apps and collect request traps', 'Banking', 'critical', 'ri-smartphone-line', 'text-blue-400', 'popup', 'Install request outside official store.'),
  sim('fake-aadhaar-link', 'Fake Aadhaar Link', 'UID spoof links and identity theft', 'Identity', 'critical', 'ri-profile-line', 'text-indigo-400', 'email', 'Aadhaar suspension + payment demand.'),
  sim('fake-kyc', 'Fake KYC Request', 'Forced KYC updates via scam links', 'Identity', 'severe', 'ri-shield-keyhole-line', 'text-sky-400', 'popup', 'Account freeze warning within minutes.'),
  sim('otp-scam', 'OTP Scam', 'OTP theft through support impersonation', 'Banking', 'critical', 'ri-key-2-line', 'text-red-400', 'chat', 'Share OTP to receive money.'),
  sim('qr-scam', 'QR Code Scam', 'Scan-to-receive deception', 'Banking', 'severe', 'ri-qr-code-line', 'text-yellow-400', 'popup', 'Scan QR to get refund.'),
  sim('telegram-job', 'Telegram Job Scam', 'Task fraud and deposit traps', 'Messaging', 'severe', 'ri-telegram-line', 'text-blue-500', 'chat', 'Deposit first to unlock salary.'),
  sim('fake-government-scheme', 'Fake Government Scheme', 'Subsidy bait and fee theft', 'Identity', 'severe', 'ri-government-line', 'text-emerald-400', 'email', 'Fake DBT/benefit processing fee.'),
  sim('fake-investment-app', 'Fake Investment App', 'Guaranteed returns and locked withdrawals', 'Investment', 'critical', 'ri-line-chart-line', 'text-green-400', 'popup', 'Recharge more to withdraw profits.'),
  sim('digital-arrest', 'Digital Arrest Scam', 'Authority impersonation extortion', 'Messaging', 'critical', 'ri-alarm-warning-line', 'text-red-500', 'chat', 'Stay on call and transfer now.'),
  sim('fake-bank-message', 'Fake SBI/HDFC Message', 'SMS spoofing with phishing links', 'Banking', 'severe', 'ri-message-2-warning-line', 'text-orange-500', 'email', 'Bank account blocked link.'),
  sim('pan-card-fraud', 'PAN Card Fraud', 'Tax panic notices for payment theft', 'Identity', 'severe', 'ri-file-shield-2-line', 'text-amber-400', 'popup', 'PAN suspension penalty in 20 min.'),
  sim('loan-app-fraud', 'Loan App Fraud', 'Data-harvesting instant loan apps', 'Banking', 'critical', 'ri-money-rupee-circle-line', 'text-lime-400', 'chat', 'Grant contacts/gallery for loan.'),
  sim('deepfake-scam', 'Deepfake Scam', 'Voice/video impersonation pressure', 'Messaging', 'critical', 'ri-user-voice-line', 'text-fuchsia-400', 'chat', 'Relative voice asks urgent transfer.'),
  sim('phishing-page', 'Phishing Page', 'Credential capture login clones', 'Identity', 'severe', 'ri-spy-line', 'text-violet-400', 'email', 'Brand billing failure login link.'),
  sim('malicious-apk', 'Malicious APK Download', 'Sideloaded malware installers', 'Malware', 'critical', 'ri-bug-line', 'text-rose-400', 'popup', 'Enable unknown sources to install security patch.'),

  sim('ransomware-attack', 'Ransomware Attack', 'File encryption and crypto demand', 'Malware', 'critical', 'ri-folder-lock-line', 'text-red-500', 'popup', 'Your files are encrypted. Pay in crypto.'),
  sim('banking-trojan', 'Banking Trojan & Infostealer', 'Credential theft via infected files', 'Malware', 'critical', 'ri-virus-line', 'text-red-400', 'email', 'Invoice attachment installs trojan.'),
  sim('sim-swap', 'SIM Swap / SIM Cloning', 'OTP interception by SIM takeover', 'Identity', 'critical', 'ri-sim-card-line', 'text-purple-400', 'chat', 'Telecom KYC update asks code.'),
  sim('vishing-call', 'Vishing Call Fraud', 'Fake RBI/CyberCrime payment call', 'Messaging', 'critical', 'ri-phone-line', 'text-orange-400', 'chat', 'Immediate legal action unless paid.'),
  sim('fake-tech-support', 'Fake Tech Support', 'Remote-access support extortion', 'Malware', 'critical', 'ri-customer-service-2-line', 'text-blue-300', 'popup', 'Call support and install remote tool.'),
  sim('public-wifi-mitm', 'Public Wi-Fi MITM', 'Credential theft on open hotspots', 'Malware', 'severe', 'ri-wifi-line', 'text-cyan-300', 'popup', 'Free airport Wi-Fi login intercept.'),
  sim('social-media-takeover', 'Social Media Account Takeover', 'Business account hijack for fraud', 'Messaging', 'severe', 'ri-instagram-line', 'text-pink-400', 'chat', 'Login reverify link from Meta team.'),
  sim('credential-stuffing', 'Credential Stuffing', 'Password reuse across services', 'Identity', 'severe', 'ri-key-line', 'text-yellow-300', 'email', 'Old breach password reused.'),
  sim('ecommerce-refund-scam', 'E-commerce Refund Scam', 'UPI collect-request refund fraud', 'Banking', 'critical', 'ri-shopping-bag-3-line', 'text-indigo-300', 'chat', 'Refund agent asks collect approval.'),
  sim('tds-refund-phishing', 'Income Tax / TDS Refund Phishing', 'Tax refund link credential theft', 'Identity', 'severe', 'ri-receipt-line', 'text-emerald-300', 'email', 'Income tax refund click-now message.'),
  sim('aeps-fraud', 'AePS Fraud', 'Biometric misuse and micro-ATM withdrawals', 'Banking', 'critical', 'ri-fingerprint-line', 'text-amber-300', 'popup', 'Biometric verification request from unknown vendor.'),
  sim('fake-digilocker', 'Fake DigiLocker / mParivahan', 'DL/RC credential theft portals', 'Identity', 'severe', 'ri-wallet-3-line', 'text-blue-300', 'email', 'Vehicle document update link.'),
  sim('electricity-bill-scam', 'Electricity / Utility Bill Scam', 'Power disconnection threats with payment links', 'Banking', 'severe', 'ri-flashlight-line', 'text-yellow-500', 'chat', 'Last warning: power cut in 15 mins.'),
  sim('sextortion-blackmail', 'Sextortion & Blackmail', 'Fear-based extortion emails', 'Messaging', 'severe', 'ri-error-warning-line', 'text-rose-500', 'email', 'Claims webcam footage unless paid.'),

  sim('atm-skimming', 'ATM/Card Skimming', 'Overlay + PIN capture at ATM', 'Banking', 'severe', 'ri-bank-card-2-line', 'text-cyan-500', 'popup', 'Loose keypad and hidden camera signs.'),
  sim('nfc-skimming', 'Contactless NFC Skimming', 'Tap card data theft in crowds', 'Banking', 'low', 'ri-nfc-line', 'text-teal-400', 'popup', 'Unknown tap device in metro crowd.'),
  sim('smishing', 'Smishing SMS', 'Malicious short links in SMS', 'Messaging', 'severe', 'ri-message-3-line', 'text-orange-300', 'email', 'Speed Post parcel fee shortened URL.'),
  sim('bec-fraud', 'Business Email Compromise', 'Vendor invoice redirection scam', 'Investment', 'critical', 'ri-briefcase-4-line', 'text-slate-300', 'email', 'Invoice updated with new bank details.'),
  sim('fake-customer-care', 'Fake Customer Care via Search', 'SEO poison support numbers', 'Messaging', 'severe', 'ri-search-line', 'text-sky-300', 'chat', 'Support asks UPI payment for refund.'),
  sim('juice-jacking', 'Juice Jacking', 'Public USB charging data theft', 'Malware', 'low', 'ri-battery-charge-line', 'text-green-300', 'popup', 'Railway charging kiosk inject prompt.'),
  sim('shoulder-surfing', 'Shoulder Surfing', 'Observed PIN entry theft', 'Banking', 'low', 'ri-eye-line', 'text-gray-300', 'chat', 'Person standing too close at ATM.'),
  sim('romance-scam', 'Romance / Dating Scam', 'Emotional manipulation for money', 'Messaging', 'severe', 'ri-heart-3-line', 'text-pink-500', 'chat', 'Emergency transfer request from match.'),
  sim('matrimonial-fraud', 'Matrimonial Site Fraud', 'Verification-fee extortion profiles', 'Messaging', 'severe', 'ri-user-heart-line', 'text-fuchsia-300', 'chat', 'Profile asks one-time KYC fee.'),
  sim('work-from-home-mule', 'Work-from-home Mule Account', 'Money laundering via your account', 'Banking', 'critical', 'ri-home-office-line', 'text-lime-300', 'chat', 'Use your account for payment routing.'),
  sim('fake-ngo-donation', 'Fake NGO / Disaster Donation', 'UPI mimic handles for relief fraud', 'Investment', 'severe', 'ri-hand-heart-line', 'text-emerald-500', 'popup', 'Urgent flood relief fake handle.'),
  sim('fake-scholarship-portal', 'Fake Scholarship Portal', 'Education-fee phishing pages', 'Identity', 'severe', 'ri-graduation-cap-line', 'text-indigo-500', 'email', 'Scholarship seat confirmation fee.'),
  sim('gaming-fantasy-scam', 'Gaming / Fantasy Sports Scam', 'Rigged withdrawals and bonus traps', 'Investment', 'low', 'ri-gamepad-line', 'text-violet-500', 'popup', 'Deposit more to unlock winnings.'),
  sim('fake-pm-kisan', 'Fake PM Kisan / DBT Scheme', 'Rural subsidy phishing', 'Identity', 'severe', 'ri-plant-line', 'text-green-500', 'email', 'Farmer subsidy update link.'),
  sim('fake-police-notice', 'Fake Police / Lawyer Notice', 'Legal intimidation extortion', 'Messaging', 'severe', 'ri-scales-3-line', 'text-red-300', 'email', 'Number involved in crime; pay fine.'),
  sim('relative-distress', 'Relative in Distress Scam', 'Emergency accident/arrest call fraud', 'Messaging', 'critical', 'ri-parent-line', 'text-orange-300', 'chat', 'Your child is in hospital send money now.'),

  sim('malvertising', 'Malvertising', 'Malicious ads on trusted sites', 'Malware', 'low', 'ri-advertisement-line', 'text-yellow-300', 'popup', 'Click ad for codec update.'),
  sim('drive-by-download', 'Drive-by Download', 'Auto malware download from compromised sites', 'Malware', 'low', 'ri-download-cloud-2-line', 'text-cyan-200', 'popup', 'Unexpected download starts automatically.'),
  sim('usb-drop-attack', 'USB Drop Attack', 'Infected pen drives as bait', 'Malware', 'low', 'ri-usb-line', 'text-gray-400', 'chat', 'Unknown USB found in office parking.'),
  sim('cookie-hijacking', 'Browser Cookie Hijacking', 'Session theft without password', 'Identity', 'severe', 'ri-cookie-line', 'text-amber-200', 'email', 'Suspicious extension steals session token.'),
  sim('formjacking', 'Formjacking', 'Payment form skimming scripts', 'Banking', 'severe', 'ri-bank-card-line', 'text-blue-200', 'popup', 'Checkout script exfiltrates card data.'),
  sim('cryptojacking', 'Cryptojacking', 'Unauthorized browser mining', 'Malware', 'low', 'ri-cpu-line', 'text-orange-200', 'popup', 'Device overheating from hidden miner.'),
  sim('iot-compromise', 'IoT Device Compromise', 'Router/CCTV takeover via weak passwords', 'Malware', 'severe', 'ri-router-line', 'text-slate-200', 'chat', 'Default admin password still active.'),
  sim('bluetooth-skimming', 'Bluetooth Skimming', 'Always-on Bluetooth exploitation', 'Malware', 'low', 'ri-bluetooth-line', 'text-blue-200', 'popup', 'Unknown pairing request flood.'),
  sim('fake-vpn-antivirus', 'Fake VPN/Antivirus App', 'Security app that steals data', 'Malware', 'severe', 'ri-shield-cross-line', 'text-teal-200', 'popup', 'Install protection app from ad link.'),
  sim('typosquatting', 'Typosquatting', 'Misspelled domains mimic trusted brands', 'Identity', 'severe', 'ri-link-m', 'text-violet-200', 'email', 'amaz0n/flipkrt style domains.'),
  sim('call-forwarding-ussd', 'Call Forwarding / USSD Scam', 'USSD trick to divert calls/OTPs', 'Banking', 'critical', 'ri-phone-find-line', 'text-red-200', 'chat', 'Dial code now to verify account.'),
  sim('sms-forwarding-malware', 'SMS Forwarding Malware', 'Silent OTP forwarding trojans', 'Malware', 'critical', 'ri-message-2-line', 'text-rose-200', 'popup', 'SMS permission abuse after install.'),
  sim('screen-overlay', 'Screen Overlay Attack', 'Fake login layered over real banking app', 'Malware', 'critical', 'ri-layout-masonry-line', 'text-pink-200', 'popup', 'Overlay asks netbanking credentials.'),
  sim('fake-job-offer-letter', 'Fake Job Offer Letter', 'Counterfeit offer docs for visa fraud', 'Identity', 'low', 'ri-file-paper-2-line', 'text-sky-200', 'email', 'Offer letter demands processing fee.'),
  sim('real-estate-rental-scam', 'Real Estate / Rental Scam', 'Property token amount fraud', 'Investment', 'severe', 'ri-home-8-line', 'text-emerald-200', 'chat', 'Pay token before site visit.'),

  sim('ai-kyc-bypass', 'AI Synthetic KYC Bypass', 'Deepfake docs/faces for account opening', 'Identity', 'critical', 'ri-user-shared-2-line', 'text-purple-300', 'popup', 'Video KYC mismatch indicators.'),
  sim('ai-voice-ivr', 'AI Voice Cloning for IVR', 'Cloned voice resets banking credentials', 'Banking', 'critical', 'ri-voice-recognition-line', 'text-indigo-300', 'chat', 'Voice verification bypass alert.'),
  sim('llm-prompt-injection', 'LLM Prompt Injection', 'Manipulating chatbot to leak data', 'Malware', 'severe', 'ri-robot-2-line', 'text-cyan-300', 'chat', 'Prompt asks bot for hidden records.'),
  sim('realtime-deepfake-video', 'Real-time Deepfake Video Call', 'Live face swap fraud calls', 'Messaging', 'critical', 'ri-vidicon-2-line', 'text-fuchsia-300', 'chat', 'Video identity appears inconsistent.'),
  sim('shadow-ai-leakage', 'Shadow AI Data Leakage', 'Sensitive data uploaded to unsanctioned AI tools', 'Identity', 'severe', 'ri-database-2-line', 'text-amber-300', 'popup', 'Employee pasted customer PII in public AI tool.'),
  sim('adversarial-ml-fraud', 'Adversarial ML Attack', 'Fraud model evasion techniques', 'Malware', 'severe', 'ri-focus-3-line', 'text-rose-300', 'popup', 'Transaction pattern crafted to bypass AI checks.'),
  sim('quantum-crypto-threat', 'Quantum Encryption Threat', 'Future cryptographic break simulation', 'Malware', 'low', 'ri-atom-line', 'text-lime-200', 'popup', 'Legacy encryption flagged as weak.'),
  sim('smart-city-attack', 'Smart City Infrastructure Attack', 'SCADA traffic/power system compromise', 'Malware', 'critical', 'ri-building-4-line', 'text-orange-200', 'popup', 'Traffic/power control anomaly detected.'),
  sim('ev-charging-attack', 'EV Charging Station Attack', 'Data exfiltration through charging interfaces', 'Malware', 'severe', 'ri-charging-pile-2-line', 'text-green-200', 'popup', 'Charging kiosk requests phone permissions.'),
  sim('drone-sniffing', 'Drone Sniffing Attack', 'Aerial Wi-Fi packet capture', 'Malware', 'low', 'ri-drone-line', 'text-slate-300', 'popup', 'Unknown drone hovering near office Wi-Fi.'),
  sim('network-slicing-5g', '5G Network Slicing Vulnerability', 'Enterprise slice isolation failure', 'Malware', 'severe', 'ri-signal-tower-line', 'text-blue-100', 'popup', 'Cross-slice traffic leak warning.'),
  sim('ar-vr-phishing', 'AR/VR Phishing', 'Credential theft in virtual spaces', 'Identity', 'low', 'ri-vr-line', 'text-purple-100', 'popup', 'Virtual storefront asks bank login.'),
  sim('satellite-terminal-attack', 'Satellite Terminal Attack', 'Remote terminal exploitation', 'Malware', 'low', 'ri-satellite-line', 'text-cyan-100', 'popup', 'Unpatched terminal exposed to internet.'),
  sim('supply-chain-compromise', 'Supply Chain Software Compromise', 'Trojanized software update delivery', 'Malware', 'critical', 'ri-git-branch-line', 'text-red-300', 'email', 'Trusted vendor update hash mismatch.')
];

function renderScenario(item) {
  const lang = stateManager.get('language') || 'en';
  const signal = localizeSimulationText(lang, item.signal);
  const title = localizeSimulationText(lang, item.title);
  const mode = getSceneMode(item);
  if (mode === 'chat') {
    return new ChatThread({
      title,
      sender: lang === 'hi' ? 'अज्ञात संपर्क' : 'Unknown Contact',
      messages: [
        { from: 'scammer', text: signal },
        { from: 'user', text: lang === 'hi' ? 'क्या मैं इसे आधिकारिक माध्यम से सत्यापित कर सकता हूं?' : 'Can I verify this via official channel?' }
      ]
    }).render();
  }
  if (mode === 'email') {
    return new EmailPreview({
      from: 'alert@security-check.in',
      subject: title,
      body: signal,
      suspicious: true
    }).render();
  }
  if (mode === 'call') {
    return new PhoneCallCard({ caller: lang === 'hi' ? 'अज्ञात अधिकारी' : 'Unknown Official', label: lang === 'hi' ? 'वॉइस सत्यापन' : 'Voice Verification', transcript: signal }).render();
  }
  if (mode === 'sms') {
    return new SMSInboxCard({ sender: 'ALERT-SVC', message: signal }).render();
  }
  if (mode === 'portal') {
    return new PortalMockCard({ domain: 'secure-verify-help.in', title, prompt: lang === 'hi' ? 'अभी सत्यापित करें' : 'Verify Now' }).render();
  }
  if (mode === 'app') {
    return new AppMockCard({ appName: title, action: lang === 'hi' ? 'जारी रखें' : 'Continue', note: signal }).render();
  }
  return new ScamPopup({ title, message: signal, cta: lang === 'hi' ? 'अभी जारी रखें' : 'Proceed Now' }).render();
}

function getSceneMode(item) {
  const callKeys = new Set(['vishing-call', 'relative-distress', 'digital-arrest', 'ai-voice-ivr', 'realtime-deepfake-video']);
  const smsKeys = new Set(['smishing', 'fake-bank-message', 'sms-forwarding-malware', 'electricity-bill-scam', 'call-forwarding-ussd']);
  const portalKeys = new Set(['fake-website', 'phishing-page', 'fake-digilocker', 'fake-scholarship-portal', 'fake-pm-kisan', 'tds-refund-phishing', 'fake-government-scheme']);
  const appKeys = new Set(['fake-upi-app', 'fake-investment-app', 'loan-app-fraud', 'gaming-fantasy-scam', 'fake-vpn-antivirus']);
  if (callKeys.has(item.key)) return 'call';
  if (smsKeys.has(item.key)) return 'sms';
  if (portalKeys.has(item.key)) return 'portal';
  if (appKeys.has(item.key)) return 'app';
  return item.mode;
}

export function startExtraSimulator(container, key) {
  const lang = stateManager.get('language') || 'en';
  const item = extraSimulators.find((s) => s.key === key);
  if (!item) {
    container.innerHTML = '<p class="text-danger">Simulator not found.</p>';
    return;
  }

  let score = 0;
  let step = 0;
  const stages = [
    { prompt: t(lang, 'safe_choice'), ok: true, psych: lang === 'hi' ? 'मनोविज्ञान: सतर्कता और सत्यापन' : 'Psychology: verification mindset' },
    { prompt: lang === 'hi' ? 'थोड़ी जल्दी करें, क्या नुकसान होगा?' : 'Hurry a bit, what could go wrong?', ok: false, psych: lang === 'hi' ? 'मनोविज्ञान: जल्दबाज़ी और भय' : 'Psychology: urgency and fear' },
    { prompt: lang === 'hi' ? 'अंतिम निर्णय: सुरक्षित मार्ग चुनें' : 'Final decision: choose safe path', ok: true, psych: lang === 'hi' ? 'मनोविज्ञान: नियंत्रण वापस लें' : 'Psychology: regain control' }
  ];

  container.innerHTML = `<h2 class="text-2xl font-bold text-on-surface mb-2">${localizeSimulationText(lang, item.title)}</h2><p class="text-sm text-on-surface-variant mb-2">${localizeSimulationText(lang, item.desc)}</p><p class="text-xs text-on-surface-variant mb-4">${t(lang, 'legal_disclaimer')} • ${t(lang, 'last_updated', { date: '2026-05-23' })}</p>`;
  container.appendChild(renderScenario(item));

  const choicesContainer = document.createElement('div');
  choicesContainer.className = 'flex flex-col gap-3 mt-6';
  const reportDrawer = document.createElement('div');
  reportDrawer.className = 'mt-4 bg-surface rounded-2xl border border-white/10 p-4';
  reportDrawer.innerHTML = `
    <p class="font-semibold mb-2">${lang === 'hi' ? 'अभी रिपोर्ट करें' : 'Report now'}</p>
    <div class="flex flex-wrap gap-2 text-sm">
      <a class="text-primary underline" href="tel:1930">1930</a>
      <a class="text-primary underline" target="_blank" rel="noopener" href="https://cybercrime.gov.in">cybercrime.gov.in</a>
      <button id="copy-template" class="px-3 py-1 rounded-xl bg-surface-elevated border border-white/10">${lang === 'hi' ? 'शिकायत कॉपी करें' : 'Copy complaint template'}</button>
    </div>
  `;
  container.appendChild(reportDrawer);
  reportDrawer.querySelector('#copy-template').addEventListener('click', () => {
    const text = lang === 'hi'
      ? 'मैं साइबर धोखाधड़ी की शिकायत दर्ज करना चाहता/चाहती हूं। लेन-देन संदर्भ और स्क्रीनशॉट संलग्न हैं।'
      : 'I want to file a cyber fraud complaint. Transaction reference and screenshots attached.';
    navigator.clipboard?.writeText(text);
    alert(lang === 'hi' ? 'टेम्पलेट कॉपी हो गया' : 'Template copied');
  });

  function renderStepChoices() {
    choicesContainer.innerHTML = '';
    const current = stages[step];
    const choices = [
      { text: current.prompt, correct: current.ok, feedback: current.ok ? t(lang, 'safe_feedback') : t(lang, 'unsafe_feedback') },
      { text: t(lang, 'unsafe_choice'), correct: false, feedback: t(lang, 'unsafe_feedback') }
    ];
    choices.forEach((choice) => {
    const action = new ActionChoice({ text: choice.text });
    const el = action.render();
    el.addEventListener('click', () => {
      document.querySelectorAll('#app button').forEach((b) => { b.disabled = true; });
      if (choice.correct) {
        action.setVariant('correct');
        score = 10;
      } else {
        action.setVariant('incorrect');
      }

      const fb = document.getElementById('fb-extra') || document.createElement('div');
      fb.id = 'fb-extra';
      fb.innerHTML = '';
      fb.appendChild(new ExplanationPanel({ type: choice.correct ? 'success' : 'error', message: choice.feedback }).render());
      const psych = document.createElement('p');
      psych.className = 'text-xs text-on-surface-variant mt-2';
      psych.textContent = current.psych;
      fb.appendChild(psych);

      const doneBtn = document.createElement('button');
      doneBtn.className = 'mt-4 w-full py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl';
      doneBtn.textContent = step < stages.length - 1 ? (lang === 'hi' ? 'अगला चरण' : 'Next Step') : t(lang, 'finish');
      doneBtn.addEventListener('click', () => {
        if (step < stages.length - 1) {
          step += 1;
          renderStepChoices();
          return;
        }
        stateManager.set(`simulators.${item.key}.completed`, true);
        stateManager.set(`simulators.${item.key}.score`, score);
        addXP(score);
        if (score > 0) stateManager.incrementCorrectAnswers();
        evaluateBadges();
        new XPToast(score, localizeSimulationText(lang, item.title)).show();
        container.innerHTML = `
          <div class="text-center animate-fade-in-up">
            <h2 class="text-2xl font-bold text-on-surface mb-4">${t(lang, 'complete_title')}</h2>
            <div class="bg-surface rounded-2xl p-8 shadow-lg">
              <p class="text-3xl font-bold text-primary">${score} XP</p>
              <button class="mt-6 py-3 px-8 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl" onclick="location.hash='#/simulators'">${t(lang, 'back_to_simulators')}</button>
            </div>
          </div>
        `;
      });
      fb.appendChild(doneBtn);
      container.appendChild(fb);
    });
    choicesContainer.appendChild(el);
    });
  }

  container.appendChild(choicesContainer);
  renderStepChoices();
}
