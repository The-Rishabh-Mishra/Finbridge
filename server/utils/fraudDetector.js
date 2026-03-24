const KEYWORDS = [
  'urgent',
  'click here',
  'verify now',
  'otp',
  'lottery',
  'free',
  'account blocked',
  'password reset',
  'credit card',
  'claim now'
];

const URL_REGEX = /https?:\/\/[\w\-\.]+(\.[a-z]{2,})(:[0-9]+)?([\/\w\-\.\?\=\&\#%]*)?/gi;

export function detectFraud(message) {
  if (!message || typeof message !== 'string') {
    return {
      riskScore: 0,
      status: 'Safe',
      reasons: ['No message content provided'],
    };
  }

  const trimmed = message.trim();
  if (!trimmed) {
    return {
      riskScore: 0,
      status: 'Safe',
      reasons: ['Empty message content'],
    };
  }

  const lower = trimmed.toLowerCase();
  const reasons = [];
  let riskScore = 0;

  // Keyword detection
  const foundKeywords = KEYWORDS.filter((keyword) => lower.includes(keyword));
  if (foundKeywords.length > 0) {
    foundKeywords.forEach((keyword) => {
      reasons.push(`Detected suspicious keyword: "${keyword}"`);
    });
    riskScore += Math.min(50, foundKeywords.length * 12); // each key adds up to 50
  }

  // URL detection
  const urls = trimmed.match(URL_REGEX) || [];
  if (urls.length > 0) {
    reasons.push('Contains one or more URLs');
    riskScore += 25;

    urls.forEach((url) => {
      if (url.includes('@')) {
        reasons.push('URL contains @ symbol (phishing indicator)');
        riskScore += 15;
      }
      if (/bit\.ly|tinyurl\.com|goo\.gl|ow\.ly/i.test(url)) {
        reasons.push(`Uses shortened/untrusted URL: ${url}`);
        riskScore += 15;
      }

      const domainMatch = url.match(/https?:\/\/([^\/]+)/i);
      if (domainMatch) {
        const domain = domainMatch[1].toLowerCase();
        const knownSafe = ['facebook.com', 'gmail.com', 'google.com', 'paypal.com', 'banking.com'];
        const isSafe = knownSafe.some((safeDomain) => domain.includes(safeDomain));
        if (!isSafe) {
          reasons.push(`Unknown or suspicious domain: ${domain}`);
          riskScore += 10;
        }
      }
    });
  }

  // Excessive uppercase / exclamation heuristics
  if (/[A-Z]{2,}/.test(message) && (message.match(/[!]/g) || []).length > 1) {
    reasons.push('Excessive uppercase and punctuation may indicate spam/fraud');
    riskScore += 10;
  }

  if (riskScore > 100) riskScore = 100;

  let status = 'Safe';
  if (riskScore >= 71) status = 'Fraud';
  else if (riskScore >= 31) status = 'Suspicious';

  if (reasons.length === 0) {
    reasons.push('No suspicious patterns detected');
  }

  return {
    riskScore,
    status,
    reasons,
  };
}

export default detectFraud;
