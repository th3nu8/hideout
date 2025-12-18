// Comprehensive chat filter for blocking bad words, URLs, bypass attempts, and spam

// ============= URL/LINK DETECTION =============

// Patterns to detect URLs and links
const URL_PATTERNS: RegExp[] = [
  // Standard URLs
  /https?:\/\/[^\s]+/gi,
  /www\.[^\s]+/gi,
  // Domain patterns without protocol
  /[a-zA-Z0-9][-a-zA-Z0-9]*\.(com|org|net|edu|gov|io|co|me|app|dev|xyz|info|biz|tv|cc|gg|ly|to|tk|ml|ga|cf|gq|ws|link|click|online|site|website|tech|store|shop|blog|page|space|live|stream|video|game|play|download|free|porn|xxx|sex|adult|casino|bet|win|money|crypto|bitcoin|nft|discord|telegram|whatsapp|tiktok|instagram|facebook|twitter|youtube|twitch|reddit|snapchat|onlyfans)\b/gi,
  // IP addresses
  /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/gi,
  // Discord invites
  /discord\.gg\/[^\s]+/gi,
  /discord\.com\/invite\/[^\s]+/gi,
  // Shortened URLs
  /bit\.ly\/[^\s]+/gi,
  /tinyurl\.com\/[^\s]+/gi,
  /t\.co\/[^\s]+/gi,
  /goo\.gl\/[^\s]+/gi,
  /ow\.ly\/[^\s]+/gi,
  /is\.gd\/[^\s]+/gi,
  /buff\.ly\/[^\s]+/gi,
  // Bypass attempts with spaces/special chars
  /[a-zA-Z0-9]+[\s._\-]+(?:com|org|net|io|co|gg|ly|xyz)\b/gi,
  // Obfuscated URLs (d0t, [dot], etc)
  /[a-zA-Z0-9]+\s*[\[\(]?\s*(?:dot|d0t|\.)\s*[\]\)]?\s*(?:com|org|net|io|co|gg|ly|xyz)/gi,
];

// Check if message contains URLs or links
export function containsLink(message: string): boolean {
  const normalizedMessage = message.toLowerCase().replace(/\s+/g, '');
  
  for (const pattern of URL_PATTERNS) {
    if (pattern.test(message) || pattern.test(normalizedMessage)) {
      return true;
    }
  }
  
  // Check for obfuscated domains
  const obfuscatedDomainPattern = /[a-zA-Z0-9]+\s*[\[\(\{]?\s*(?:dot|d0t|punkt|punto|\.)\s*[\]\)\}]?\s*[a-zA-Z]{2,}/gi;
  if (obfuscatedDomainPattern.test(message)) {
    return true;
  }
  
  return false;
}

// ============= BAD WORD FILTERING =============

// List of severely inappropriate words with bypass patterns
const BLOCKED_PATTERNS: RegExp[] = [
  // N-word and variations (comprehensive)
  /n[i!1|l\*][g9q][g9q][e3a@][r]/gi,
  /n[i!1|l\*][g9q]{2}[a@4]/gi,
  /n[i!1|l\*][g9q][a@4]/gi,
  /n[i!1|l\*]gg/gi,
  /n[i!1|l\*][g9q][g9q]/gi,
  /\|\|?[i!1|l][g9q]/gi,
  /n[\s._\-\*]*[i!1|l][\s._\-\*]*[g9q][\s._\-\*]*[g9q]/gi,
  /n[\W_]*i[\W_]*g[\W_]*g/gi,
  /[n|\|/\\][i!1|l\|][g9q][g9q]/gi,
  /n[!i1][b6][b6][a@]/gi,
  /negro/gi,
  
  // F-word and variations
  /f[u\*@v][c\(k]/gi,
  /f[\s._\-]*u[\s._\-]*c[\s._\-]*k/gi,
  /fvck/gi,
  /f\*\*k/gi,
  /f\*ck/gi,
  /f[*]?ck/gi,
  /fuk/gi,
  /fuc/gi,
  /phuck/gi,
  /phuk/gi,
  
  // S-word and variations
  /sh[i!1\*][t\+]/gi,
  /sh[\s._\-]*[i!1][\s._\-]*t/gi,
  /sh1t/gi,
  /5h1t/gi,
  /5hit/gi,
  
  // Other slurs and offensive terms
  /f[a@4][g9]{1,2}[o0]t/gi,
  /f[a@4][g9]+/gi,
  /r[e3]t[a@4]rd/gi,
  /sp[i!1]c/gi,
  /ch[i!1]nk/gi,
  /k[i!1]k[e3]/gi,
  /tr[a@4]nn/gi,
  /d[y!1]k[e3]/gi,
  /c[u\*][n\*]t/gi,
  /c[\s._\-]*u[\s._\-]*n[\s._\-]*t/gi,
  /b[i!1\*]tch/gi,
  /wh[o0]r[e3]/gi,
  /sl[u\*]t/gi,
  /a[s5\$][s5\$]h[o0]l[e3]/gi,
  
  // Racial slurs
  /w[e3]tb[a@4]ck/gi,
  /b[e3][a@4]n[e3]r/gi,
  /g[o0]{2}k/gi,
  /j[a@4]p\b/gi,
  /cr[a@4]ck[e3]r/gi,
  /p[a@4]k[i!1]/gi,
  /t[o0]w[e3]lh[e3][a@4]d/gi,
  /c[o0]{2}n/gi,
  /s[a@4]mb[o0]/gi,
  /j[i!1]g[a@4]b[o0]{2}/gi,
  /d[a@4]rk[i!1][e3]/gi,
  
  // Sexual content
  /p[e3]n[i!1]s/gi,
  /d[i!1\*]ck/gi,
  /c[o0]ck/gi,
  /p[u\*]ss[y!1]/gi,
  /v[a@4]g[i!1]n[a@4]/gi,
  /b[o0]{2}b[s5]?/gi,
  /t[i!1]t[s5]?/gi,
  /cum\b/gi,
  /j[i!1]zz/gi,
  /p[o0]rn/gi,
  /s[e3]x[y]?\b/gi,
  /h[o0]rn[y!1]/gi,
  /er[e3]ct/gi,
  /org[a@4]sm/gi,
  /mast[u]rbat/gi,
  
  // Death threats / violence
  /k[i!1]ll[\s]*y[o0]urs[e3]lf/gi,
  /kys\b/gi,
  /d[i!1][e3][\s]*b[i!1]tch/gi,
  /g[o0][\s]*d[i!1][e3]/gi,
  /k[i!1]ll[\s]*y[o0]u/gi,
  /murder/gi,
  /sui[c]ide/gi,
  /hang[\s]*y[o0]urs[e3]lf/gi,
  
  // Hate symbols
  /nazi/gi,
  /h[i!1]tl[e3]r/gi,
  /kkk/gi,
  /wh[i!1]t[e3][\s]*p[o0]w[e3]r/gi,
  /h[e3][i!1]l/gi,
  /sw[a@4]st[i!1]k[a@4]/gi,
];

// Additional exact match blocked words (lowercase)
const BLOCKED_WORDS: Set<string> = new Set([
  'nigger', 'nigga', 'nig', 'niger', 'n1gger', 'n1gga', 'nigg3r', 'n!gger', 'nibba', 'negro',
  'fuck', 'fucker', 'fucking', 'fucked', 'fck', 'fuk', 'fuq', 'motherfucker', 'motherfucking',
  'shit', 'shitty', 'bullshit', 'sh1t', 'sh!t', 'shite',
  'ass', 'asshole', 'asswipe', 'arse', 'arsehole',
  'bitch', 'bitches', 'b1tch', 'biatch',
  'cunt', 'cunts', 'c*nt',
  'dick', 'dicks', 'dickhead', 'd1ck',
  'cock', 'cocks', 'cocksucker',
  'pussy', 'pussies', 'puss', 'p*ssy',
  'whore', 'whores', 'wh0re',
  'slut', 'sluts', 'sl*t',
  'fag', 'faggot', 'fags', 'faggots', 'f4g', 'f4ggot',
  'retard', 'retarded', 'retards', 'ret4rd',
  'niglet', 'coon', 'spic', 'kike', 'chink', 'gook', 'wetback', 'beaner', 'cracker',
  'tranny', 'trannie', 'dyke',
  'porn', 'porno', 'pornography', 'pr0n',
  'penis', 'vagina', 'boobs', 'tits', 'cum', 'jizz', 'cock', 'dildo', 'vibrator',
  'kys', 'kill yourself', 'go die', 'neck yourself',
  'nazi', 'hitler', 'kkk', 'white power', 'heil', 'swastika',
  'rape', 'rapist', 'molest', 'pedophile', 'pedo',
]);

// Normalize text to detect bypass attempts
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[0@]/g, 'o')
    .replace(/[1!|l]/g, 'i')
    .replace(/3/g, 'e')
    .replace(/[4@]/g, 'a')
    .replace(/[5\$]/g, 's')
    .replace(/7/g, 't')
    .replace(/8/g, 'b')
    .replace(/9/g, 'g')
    .replace(/\*/g, '')
    .replace(/[\s._\-]+/g, '')
    .replace(/[^\w]/g, '');
}

// Check if message contains blocked content
export function containsBlockedContent(message: string): { blocked: boolean; reason?: string } {
  const lowerMessage = message.toLowerCase();
  const normalizedMessage = normalizeText(message);
  
  // Check for links/URLs
  if (containsLink(message)) {
    return { blocked: true, reason: 'Links and URLs are not allowed in chat' };
  }
  
  // Check exact word matches
  const words = lowerMessage.split(/\s+/);
  for (const word of words) {
    const cleanWord = word.replace(/[^\w]/g, '');
    if (BLOCKED_WORDS.has(cleanWord)) {
      return { blocked: true, reason: 'Message contains inappropriate language' };
    }
  }
  
  // Check normalized text for bypass attempts
  for (const blockedWord of BLOCKED_WORDS) {
    if (normalizedMessage.includes(blockedWord.replace(/\s/g, ''))) {
      return { blocked: true, reason: 'Message contains inappropriate language' };
    }
  }
  
  // Check regex patterns
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(message) || pattern.test(normalizedMessage)) {
      return { blocked: true, reason: 'Message contains inappropriate language' };
    }
  }
  
  return { blocked: false };
}

// Check if username is appropriate
export function isUsernameAppropriate(username: string): { valid: boolean; reason?: string } {
  const check = containsBlockedContent(username);
  if (check.blocked) {
    return { valid: false, reason: 'Username contains inappropriate content' };
  }
  
  if (username.length < 3) {
    return { valid: false, reason: 'Username must be at least 3 characters' };
  }
  
  if (username.length > 20) {
    return { valid: false, reason: 'Username must be 20 characters or less' };
  }
  
  if (/^(admin|moderator|mod|staff|owner|system|bot|official|support|help)$/i.test(username)) {
    return { valid: false, reason: 'Username cannot impersonate staff' };
  }
  
  // Disallow usernames that are just numbers or special chars
  if (/^[^a-zA-Z]+$/.test(username)) {
    return { valid: false, reason: 'Username must contain at least one letter' };
  }
  
  return { valid: true };
}

// Calculate similarity between two messages (for spam detection)
export function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  
  if (s1 === s2) return 1;
  if (s1.length === 0 || s2.length === 0) return 0;
  
  const matrix: number[][] = [];
  
  for (let i = 0; i <= s1.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= s2.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= s2.length; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  
  const maxLength = Math.max(s1.length, s2.length);
  return 1 - matrix[s1.length][s2.length] / maxLength;
}

// Check if message is too similar to previous
export function isTooSimilar(newMessage: string, previousMessage: string, threshold: number = 0.8): boolean {
  return calculateSimilarity(newMessage, previousMessage) >= threshold;
}

// ============= LOCAL STORAGE BASED WARNINGS/TIMEOUTS (LEGACY) =============

const STORAGE_KEYS = {
  WARNING_COUNT: 'hideout_chat_warning_count',
  TIMEOUT_UNTIL: 'hideout_chat_timeout_until',
  LAST_MESSAGE: 'hideout_chat_last_message',
  LAST_MESSAGE_TIME: 'hideout_chat_last_message_time',
};

// Timeout durations in milliseconds (escalating)
const TIMEOUT_DURATIONS_MS = [
  1 * 60 * 1000,        // 1 minute
  10 * 60 * 1000,       // 10 minutes
  60 * 60 * 1000,       // 1 hour
  6 * 60 * 60 * 1000,   // 6 hours
  12 * 60 * 60 * 1000,  // 12 hours
  24 * 60 * 60 * 1000,  // 24 hours
  48 * 60 * 60 * 1000,  // 48 hours
  7 * 24 * 60 * 60 * 1000, // 1 week
];

// Get warning count from localStorage
export function getWarningCount(): number {
  try {
    const count = localStorage.getItem(STORAGE_KEYS.WARNING_COUNT);
    return count ? parseInt(count, 10) : 0;
  } catch {
    return 0;
  }
}

// Set warning count in localStorage
export function setWarningCount(count: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.WARNING_COUNT, count.toString());
  } catch (e) {
    console.error('Failed to save warning count:', e);
  }
}

// Get timeout end timestamp from localStorage
export function getTimeoutUntil(): number | null {
  try {
    const timeout = localStorage.getItem(STORAGE_KEYS.TIMEOUT_UNTIL);
    if (timeout) {
      const ts = parseInt(timeout, 10);
      if (ts > Date.now()) {
        return ts;
      }
      // Expired, clear it
      localStorage.removeItem(STORAGE_KEYS.TIMEOUT_UNTIL);
    }
  } catch {
    // ignore
  }
  return null;
}

// Set timeout in localStorage
export function setTimeoutUntil(timestamp: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TIMEOUT_UNTIL, timestamp.toString());
  } catch (e) {
    console.error('Failed to save timeout:', e);
  }
}

// Check if user is currently timed out
export function isTimedOut(): { timedOut: boolean; remainingMs: number } {
  const timeoutEnd = getTimeoutUntil();
  if (timeoutEnd) {
    const remaining = timeoutEnd - Date.now();
    if (remaining > 0) {
      return { timedOut: true, remainingMs: remaining };
    }
  }
  return { timedOut: false, remainingMs: 0 };
}

// Format remaining time for display
export function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return '';
  
  const seconds = Math.ceil(ms / 1000);
  if (seconds < 60) return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  
  const minutes = Math.ceil(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''}`;
  
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? 's' : ''}`;
}

// Add a warning and potentially apply timeout
export function addWarning(): { warningGiven: boolean; timeoutApplied: boolean; message: string } {
  const currentCount = getWarningCount();
  const newCount = currentCount + 1;
  setWarningCount(newCount);
  
  // First two violations are just warnings
  if (newCount <= 2) {
    return {
      warningGiven: true,
      timeoutApplied: false,
      message: `Warning ${newCount}/2: Please follow chat rules. Next violation will result in a timeout.`
    };
  }
  
  // Calculate timeout duration based on violation count (3rd violation = first timeout)
  const timeoutIndex = Math.min(newCount - 3, TIMEOUT_DURATIONS_MS.length - 1);
  const timeoutDuration = TIMEOUT_DURATIONS_MS[timeoutIndex];
  const timeoutEnd = Date.now() + timeoutDuration;
  
  setTimeoutUntil(timeoutEnd);
  
  return {
    warningGiven: true,
    timeoutApplied: true,
    message: `You have been timed out for ${formatTimeRemaining(timeoutDuration)} due to repeated violations.`
  };
}

// Get last sent message from localStorage
export function getLastMessage(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.LAST_MESSAGE);
  } catch {
    return null;
  }
}

// Save last sent message to localStorage
export function setLastMessage(message: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_MESSAGE, message);
    localStorage.setItem(STORAGE_KEYS.LAST_MESSAGE_TIME, Date.now().toString());
  } catch (e) {
    console.error('Failed to save last message:', e);
  }
}

// Get last message time
export function getLastMessageTime(): number | null {
  try {
    const time = localStorage.getItem(STORAGE_KEYS.LAST_MESSAGE_TIME);
    return time ? parseInt(time, 10) : null;
  } catch {
    return null;
  }
}

// Check for rapid message spam (rate limiting)
export function isSpammingTooFast(): boolean {
  const lastTime = getLastMessageTime();
  if (!lastTime) return false;
  
  const timeSinceLastMessage = Date.now() - lastTime;
  // Minimum 1 second between messages
  return timeSinceLastMessage < 1000;
}

// Validate a message before sending (client-side)
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateMessage(message: string): ValidationResult {
  // Check timeout
  const timeoutStatus = isTimedOut();
  if (timeoutStatus.timedOut) {
    return {
      valid: false,
      error: `You are timed out. Try again in ${formatTimeRemaining(timeoutStatus.remainingMs)}.`
    };
  }
  
  // Check empty
  if (!message.trim()) {
    return { valid: false, error: 'Message cannot be empty.' };
  }
  
  // Check message length
  if (message.length > 500) {
    return { valid: false, error: 'Message is too long (max 500 characters).' };
  }
  
  // Check rate limiting
  if (isSpammingTooFast()) {
    return { valid: false, error: 'You are sending messages too quickly. Please wait a moment.' };
  }
  
  // Check bad words and links
  const blockedCheck = containsBlockedContent(message);
  if (blockedCheck.blocked) {
    const warningResult = addWarning();
    return { valid: false, error: warningResult.message };
  }
  
  // Check spam (similarity to last message)
  const lastMsg = getLastMessage();
  if (lastMsg && isTooSimilar(message, lastMsg)) {
    return { valid: false, error: "Please don't send the same message repeatedly." };
  }
  
  return { valid: true };
}
