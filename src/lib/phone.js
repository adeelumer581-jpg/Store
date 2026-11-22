/**
 * Pakistani mobile number normalization and validation.
 * Accepts 03XXXXXXXXX, +923XXXXXXXXX, and 923XXXXXXXXX (with spaces or dashes).
 * Normalizes valid numbers to "+92 3XX XXXXXXX".
 */

const PK_MOBILE_REGEX = /^(?:\+?92|0)3\d{9}$/;

export function stripPhoneSeparators(raw) {
  if (typeof raw !== 'string') return '';
  return raw.replace(/[\s\-()]/g, '').trim();
}

export function isValidPakistaniPhone(raw) {
  const cleaned = stripPhoneSeparators(raw);
  return PK_MOBILE_REGEX.test(cleaned);
}

export function normalizePakistaniPhone(raw) {
  const cleaned = stripPhoneSeparators(raw);
  if (!PK_MOBILE_REGEX.test(cleaned)) {
    return null;
  }
  let localTen = '';
  if (cleaned.startsWith('+92')) {
    localTen = cleaned.slice(3);
  } else if (cleaned.startsWith('92')) {
    localTen = cleaned.slice(2);
  } else if (cleaned.startsWith('0')) {
    localTen = cleaned.slice(1);
  }
  // localTen is 3XXXXXXXXX (10 digits)
  return `+92 ${localTen.slice(0, 3)} ${localTen.slice(3)}`;
}
