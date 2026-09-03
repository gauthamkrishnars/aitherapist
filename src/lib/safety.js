/**
 * Safety Crisis Detection Engine
 * Scans user inputs for self-harm, suicidal ideation, or violence risks.
 */

const CRISIS_PATTERNS = [
  // Suicidal ideation & intent
  /\b(suicid|kill\s+(my\s*self|me)|end\s+my\s+life|want\s+to\s+die|wish\s+i\s+was\s+dead|don'?t\s+want\s+to\s+live|rather\s+be\s+dead|take\s+my\s+own\s+life)\b/i,
  /\b(hang\s+myself|shoot\s+myself|overdose|slit\s+my\s+(wrists?|throat)|jump\s+off|blow\s+my\s+brains\s+out)\b/i,
  /\b(better\s+off\s+without\s+me|no\s+reason\s+to\s+live|ready\s+to\s+die|goodbye\s+cruel\s+world|final\s+goodbye)\b/i,

  // Self-harm
  /\b(self\s*harm|hurt\s+myself|cutting\s+myself|burn\s+myself|harming\s+myself|bleed\s+out)\b/i,

  // Extreme violence / Harm to others
  /\b(kill\s+(him|her|them|everyone|someone|people)|murder\s+someone|massacre|commit\s+a\s+shooting)\b/i,
];

const ELEVATED_DISTRESS_PATTERNS = [
  /\b(can'?t\s+take\s+this\s+anymore|completely\s+hopeless|drowning\s+in\s+pain|unbearable\s+pain|nobody\s+cares\s+if\s+i\s+disappear)\b/i,
  /\b(feeling\s+empty|nothing\s+matters|lost\s+all\s+will|give\s+up\s+on\s+life)\b/i,
];

export const CRISIS_RESOURCES = [
  {
    name: '988 Suicide & Crisis Lifeline',
    contact: 'Call or Text 988',
    details: 'Free, confidential support available 24/7 in the US and Canada.',
    url: 'https://988lifeline.org',
    country: 'United States & Canada',
  },
  {
    name: 'Crisis Text Line',
    contact: 'Text HOME to 741741',
    details: 'Connect with a live crisis counselor 24/7 via text message.',
    url: 'https://www.crisistextline.org',
    country: 'United States & UK',
  },
  {
    name: 'The Trevor Project (LGBTQ Youth)',
    contact: 'Call 1-866-488-7386 or Text START to 678-678',
    details: 'Dedicated 24/7 crisis support for young LGBTQ individuals.',
    url: 'https://www.thetrevorproject.org',
    country: 'United States',
  },
  {
    name: 'International Helplines (Global)',
    contact: 'Visit findahelpline.com',
    details: 'Immediate confidential support directory across 130+ countries worldwide.',
    url: 'https://findahelpline.com',
    country: 'International',
  },
  {
    name: 'Emergency Medical Dispatch',
    contact: 'Call 911 (US/CA) or 112 (Europe)',
    details: 'If you or someone you know is in immediate physical danger, contact emergency medical responders immediately.',
    url: 'https://en.wikipedia.org/wiki/List_of_emergency_telephone_numbers',
    country: 'Global Emergency',
  },
];

export function evaluateSafetyRisk(text) {
  if (!text || typeof text !== 'string') {
    return { isCrisis: false, level: 'safe', matched: null };
  }

  const cleanText = text.trim();

  // Check critical crisis patterns
  for (const pattern of CRISIS_PATTERNS) {
    if (pattern.test(cleanText)) {
      return {
        isCrisis: true,
        level: 'crisis',
        matched: pattern.source,
        message: 'Crisis language detected regarding self-harm or imminent danger.',
        resources: CRISIS_RESOURCES,
      };
    }
  }

  // Check elevated distress patterns
  for (const pattern of ELEVATED_DISTRESS_PATTERNS) {
    if (pattern.test(cleanText)) {
      return {
        isCrisis: false,
        level: 'elevated',
        matched: pattern.source,
        message: 'Elevated distress indicators observed.',
        resources: CRISIS_RESOURCES,
      };
    }
  }

  return {
    isCrisis: false,
    level: 'safe',
    matched: null,
  };
}

export function buildCrisisAssistantResponse() {
  return (
    `I hear how much pain you are experiencing right now, and I want you to be safe. Because I am an AI, I cannot provide medical treatment or emergency intervention. ` +
    `Your life has immense worth, and you do not have to carry this overwhelming burden alone.\n\n` +
    `Please reach out right now to a trained, compassionate human who can support you through this moment:\n\n` +
    `• **988 Suicide & Crisis Lifeline**: Call or text **988** (Free, confidential, available 24/7 in US & Canada)\n` +
    `• **Crisis Text Line**: Text **HOME** to **741741**\n` +
    `• **International Helplines**: Visit **[findahelpline.com](https://findahelpline.com)** for immediate local support in your country\n` +
    `• **Emergency**: Call **911** or go to the nearest emergency room if you are in immediate danger.\n\n` +
    `I am keeping our session open, but please make this call or text right now. People care about you and want to help.`
  );
}
