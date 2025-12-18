import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-forwarded-for, x-real-ip',
};

// ============= URL/LINK DETECTION =============

const URL_PATTERNS: RegExp[] = [
  /https?:\/\/[^\s]+/gi,
  /www\.[^\s]+/gi,
  /[a-zA-Z0-9][-a-zA-Z0-9]*\.(com|org|net|edu|gov|io|co|me|app|dev|xyz|info|biz|tv|cc|gg|ly|to|tk|ml|ga|cf|gq|ws|link|click|online|site|website|tech|store|shop|blog|page|space|live|stream|video|game|play|download|free|porn|xxx|sex|adult|casino|bet|win|money|crypto|bitcoin|nft|discord|telegram|whatsapp|tiktok|instagram|facebook|twitter|youtube|twitch|reddit|snapchat|onlyfans)\b/gi,
  /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/gi,
  /discord\.gg\/[^\s]+/gi,
  /discord\.com\/invite\/[^\s]+/gi,
  /bit\.ly\/[^\s]+/gi,
  /tinyurl\.com\/[^\s]+/gi,
  /t\.co\/[^\s]+/gi,
  /goo\.gl\/[^\s]+/gi,
  /[a-zA-Z0-9]+\s*[\[\(]?\s*(?:dot|d0t|\.)\s*[\]\)]?\s*(?:com|org|net|io|co|gg|ly|xyz)/gi,
];

function containsLink(message: string): boolean {
  const normalizedMessage = message.toLowerCase().replace(/\s+/g, '');
  for (const pattern of URL_PATTERNS) {
    if (pattern.test(message) || pattern.test(normalizedMessage)) return true;
  }
  return false;
}

// ============= BAD WORD FILTERING =============

const BLOCKED_PATTERNS: RegExp[] = [
  /n[i!1|l\*][g9q][g9q][e3a@][r]/gi,
  /n[i!1|l\*][g9q]{2}[a@4]/gi,
  /n[i!1|l\*][g9q][a@4]/gi,
  /n[i!1|l\*]gg/gi,
  /n[i!1|l\*][g9q][g9q]/gi,
  /\|\|?[i!1|l][g9q]/gi,
  /n[\s._\-\*]*[i!1|l][\s._\-\*]*[g9q][\s._\-\*]*[g9q]/gi,
  /n[\W_]*i[\W_]*g[\W_]*g/gi,
  /[n|\|/\\][i!1|l\|][g9q][g9q]/gi,
  /negro/gi,
  /f[u\*@v][c\(k]/gi,
  /f[\s._\-]*u[\s._\-]*c[\s._\-]*k/gi,
  /sh[i!1\*][t\+]/gi,
  /f[a@4][g9]{1,2}[o0]t/gi,
  /f[a@4][g9]+/gi,
  /r[e3]t[a@4]rd/gi,
  /c[u\*][n\*]t/gi,
  /b[i!1\*]tch/gi,
  /wh[o0]r[e3]/gi,
  /sl[u\*]t/gi,
  /k[i!1]ll[\s]*y[o0]urs[e3]lf/gi,
  /kys\b/gi,
  /nazi/gi,
  /h[i!1]tl[e3]r/gi,
  /kkk/gi,
  /p[o0]rn/gi,
  /s[e3]x[y]?\b/gi,
];

const BLOCKED_WORDS = new Set([
  'nigger', 'nigga', 'nig', 'niger', 'n1gger', 'n1gga', 'nibba', 'negro',
  'fuck', 'fucker', 'fucking', 'fck', 'fuk', 'motherfucker',
  'shit', 'shitty', 'sh1t', 'bullshit',
  'cunt', 'cunts',
  'fag', 'faggot', 'fags', 'f4g',
  'retard', 'retarded',
  'bitch', 'bitches', 'b1tch',
  'dick', 'dicks', 'dickhead',
  'cock', 'cocksucker',
  'pussy', 'pussies',
  'whore', 'slut',
  'kys', 'nazi', 'hitler', 'kkk',
  'porn', 'porno', 'penis', 'vagina',
  'rape', 'rapist', 'pedo', 'pedophile',
]);

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

function containsBlockedContent(message: string): { blocked: boolean; reason?: string } {
  const lowerMessage = message.toLowerCase();
  const normalizedMessage = normalizeText(message);
  
  // Check for links
  if (containsLink(message)) {
    return { blocked: true, reason: 'Links and URLs are not allowed' };
  }
  
  const words = lowerMessage.split(/\s+/);
  for (const word of words) {
    const cleanWord = word.replace(/[^\w]/g, '');
    if (BLOCKED_WORDS.has(cleanWord)) return { blocked: true, reason: 'inappropriate language' };
  }
  
  for (const blockedWord of BLOCKED_WORDS) {
    if (normalizedMessage.includes(blockedWord.replace(/\s/g, ''))) {
      return { blocked: true, reason: 'inappropriate language' };
    }
  }
  
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(message) || pattern.test(normalizedMessage)) {
      return { blocked: true, reason: 'inappropriate language' };
    }
  }
  
  return { blocked: false };
}

function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  
  if (s1 === s2) return 1;
  if (s1.length === 0 || s2.length === 0) return 0;
  
  const matrix: number[][] = [];
  for (let i = 0; i <= s1.length; i++) matrix[i] = [i];
  for (let j = 0; j <= s2.length; j++) matrix[0][j] = j;
  
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
  
  return 1 - matrix[s1.length][s2.length] / Math.max(s1.length, s2.length);
}

// ============= SHA256 HASHING =============

async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function getClientIP(req: Request): string {
  // Try various headers that might contain the real IP
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const ips = forwardedFor.split(',').map(ip => ip.trim());
    return ips[0]; // First IP is the original client
  }
  
  const realIP = req.headers.get('x-real-ip');
  if (realIP) return realIP;
  
  const cfConnectingIP = req.headers.get('cf-connecting-ip');
  if (cfConnectingIP) return cfConnectingIP;
  
  // Fallback - this shouldn't happen in production
  return 'unknown';
}

// Timeout durations in minutes (escalating)
const TIMEOUT_DURATIONS = [1, 10, 60, 360, 720, 1440, 2880, 10080]; // up to 1 week

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get client IP and hash it
    const clientIP = getClientIP(req);
    const ipHash = await hashIP(clientIP);
    
    console.log(`Request from IP hash: ${ipHash.substring(0, 16)}...`);
    
    const { username, message, source = 'website', reply_to_id, reply_to_username, reply_to_message } = await req.json();
    
    console.log(`Processing message from ${username} (${source}): ${message?.substring(0, 50)}...`);
    
    // Validate input
    if (!username || !message) {
      return new Response(
        JSON.stringify({ error: 'Username and message are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (message.length > 500) {
      return new Response(
        JSON.stringify({ error: 'Message too long (max 500 characters)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Check username for blocked content
    const usernameCheck = containsBlockedContent(username);
    if (usernameCheck.blocked) {
      return new Response(
        JSON.stringify({ error: 'Username contains inappropriate content' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Get or create moderation record by IP hash
    let { data: moderation, error: modError } = await supabase
      .from('chat_moderation')
      .select('*')
      .eq('ip_hash', ipHash)
      .single();
    
    if (modError && modError.code !== 'PGRST116') {
      console.error('Error fetching moderation:', modError);
    }
    
    // Check if user is permanently banned
    if (moderation?.is_banned) {
      return new Response(
        JSON.stringify({ 
          error: 'You have been permanently banned from chat.',
          banned: true 
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if user is timed out
    if (moderation?.timeout_until && new Date(moderation.timeout_until) > new Date()) {
      const remaining = Math.ceil((new Date(moderation.timeout_until).getTime() - Date.now()) / 60000);
      const timeStr = remaining >= 60 
        ? `${Math.floor(remaining / 60)} hour${Math.floor(remaining / 60) !== 1 ? 's' : ''}`
        : `${remaining} minute${remaining !== 1 ? 's' : ''}`;
      return new Response(
        JSON.stringify({ 
          error: `You are timed out. Try again in ${timeStr}.`,
          timeout: true,
          remainingMinutes: remaining
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Check for blocked content in message
    const contentCheck = containsBlockedContent(message);
    if (contentCheck.blocked) {
      const newWarningCount = (moderation?.warning_count || 0) + 1;
      let timeoutUntil = null;
      let response: { error: string; warning?: number; timeout?: boolean; timeoutMinutes?: number };
      
      if (newWarningCount >= 3) {
        const timeoutIndex = Math.min(newWarningCount - 3, TIMEOUT_DURATIONS.length - 1);
        const timeoutMinutes = TIMEOUT_DURATIONS[timeoutIndex];
        timeoutUntil = new Date(Date.now() + timeoutMinutes * 60000).toISOString();
        
        const timeStr = timeoutMinutes >= 60 
          ? `${Math.floor(timeoutMinutes / 60)} hour${Math.floor(timeoutMinutes / 60) !== 1 ? 's' : ''}`
          : `${timeoutMinutes} minute${timeoutMinutes !== 1 ? 's' : ''}`;
        
        response = { 
          error: `Your message contains ${contentCheck.reason}. You have been timed out for ${timeStr}.`,
          warning: newWarningCount,
          timeout: true,
          timeoutMinutes 
        };
      } else {
        response = { 
          error: `Warning ${newWarningCount}/3: Your message contains ${contentCheck.reason}. ${3 - newWarningCount} more warning${3 - newWarningCount !== 1 ? 's' : ''} before timeout.`,
          warning: newWarningCount 
        };
      }
      
      // Update or insert moderation record
      if (moderation) {
        await supabase
          .from('chat_moderation')
          .update({ 
            warning_count: newWarningCount, 
            timeout_until: timeoutUntil,
          })
          .eq('id', moderation.id);
      } else {
        await supabase
          .from('chat_moderation')
          .insert({ 
            ip_hash: ipHash,
            warning_count: newWarningCount,
            timeout_until: timeoutUntil
          });
      }
      
      return new Response(
        JSON.stringify(response),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Check for similar messages (spam detection)
    if (moderation?.last_message) {
      const similarity = calculateSimilarity(message, moderation.last_message);
      const timeSinceLastMessage = moderation.last_message_time 
        ? Date.now() - new Date(moderation.last_message_time).getTime() 
        : Infinity;
      
      // If very similar and within 30 seconds, reject
      if (similarity >= 0.8 && timeSinceLastMessage < 30000) {
        return new Response(
          JSON.stringify({ error: 'Message too similar to your previous message. Please wait before sending similar messages.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Rate limiting - minimum 1 second between messages
      if (timeSinceLastMessage < 1000) {
        return new Response(
          JSON.stringify({ error: 'You are sending messages too quickly. Please slow down.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
    
    // Update last message tracking
    if (moderation) {
      await supabase
        .from('chat_moderation')
        .update({ 
          last_message: message,
          last_message_time: new Date().toISOString(),
        })
        .eq('id', moderation.id);
    } else {
      await supabase
        .from('chat_moderation')
        .insert({ 
          ip_hash: ipHash,
          warning_count: 0,
          last_message: message,
          last_message_time: new Date().toISOString()
        });
    }
    
    // Build message data
    const messageData: Record<string, any> = {
      username,
      message,
      source
    };
    
    // Add reply data if present
    if (reply_to_id) {
      messageData.reply_to_id = reply_to_id;
      messageData.reply_to_username = reply_to_username || null;
      messageData.reply_to_message = reply_to_message ? reply_to_message.substring(0, 100) : null;
    }
    
    // Insert the message
    const { data: insertedMessage, error: insertError } = await supabase
      .from('global_chat')
      .insert(messageData)
      .select()
      .single();
    
    if (insertError) {
      console.error('Error inserting message:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to send message' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Clean up old messages (keep only 100)
    const { data: allMessages } = await supabase
      .from('global_chat')
      .select('id')
      .order('created_at', { ascending: false });
    
    if (allMessages && allMessages.length > 100) {
      const idsToDelete = allMessages.slice(100).map(m => m.id);
      await supabase
        .from('global_chat')
        .delete()
        .in('id', idsToDelete);
      console.log(`Cleaned up ${idsToDelete.length} old messages`);
    }
    
    console.log(`Message sent successfully: ${insertedMessage.id}`);
    
    return new Response(
      JSON.stringify({ success: true, message: insertedMessage }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error processing message:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
