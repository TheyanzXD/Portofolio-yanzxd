/**
 * Cloudflare Workers API — portofolio
 * Replaces api/server.js (Node.js) for Cloudflare Workers deployment.
 *
 * Deploy: wrangler deploy workers/api/index.js
 * Env vars (wrangler secret): TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
 * KV namespace: PAGE_PORTFOLIO (create via wrangler)
 */

const HAIDAR_BASE = 'https://api.haidarxd.my.id/api/v1';
const HAIDAR_API_KEY = 'haidarapis-43ee0ef3199221b320f01c50';
const TEMPM_BASE = 'https://tempmailhaidar.vercel.app/api';

const MAX_BODY_SIZE = 5 * 1024 * 1024;

const ALLOWED_DOMAINS_KEY = 'allowed_domains';
const DOMAINS_CACHE_KEY = 'allowed_domains_cached_at';
const VISITOR_DB_KEY = 'visitor_db';

let domCache = ['suarj.com','mfxis.com','anogz.com','jgkcr.com','vbgvd.com','wzjpj.com'];
let domCacheAt = 0;

async function getAllowedDomains(env) {
  const now = Date.now();
  if (now - domCacheAt < 3600000 && domCache.length) return domCache;
  try {
    const res = await fetch(`${TEMPM_BASE}/init`);
    const d = await res.json();
    if (d && Array.isArray(d.domains) && d.domains.length) {
      domCache = d.domains.map(x => x.toLowerCase());
      domCacheAt = now;
    }
  } catch {}
  return domCache;
}

function isValidTempmailEmail(email) {
  if (!email || !email.includes('@')) return false;
  const dom = email.split('@').pop().toLowerCase();
  return domCache.some(x => x === dom);
}

function jsonResponse(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      ...init.headers
    }
  });
}

function corsResponse(data, status = 200) {
  return jsonResponse(data, { status });
}

// GET eksternal via native fetch
async function fetchJson(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'yandev-portfolio' }
    });
    return await res.json();
  } catch (e) {
    return { ok: false, error: { message: e.message } };
  }
}

// Telegram helpers
async function sendTelegram(env, message) {
  const token = env.TELEGRAM_BOT_TOKEN;
  if (!token || token.includes('YOUR_BOT')) {
    console.log('[Telegram] Bot token belum dikonfigurasi. Pesan:', message);
    return;
  }
  const chatId = env.TELEGRAM_CHAT_ID;
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' })
    });
    const parsed = await res.json();
    if (parsed.ok) console.log('[Telegram] Pesan terkirim!');
    else console.log('[Telegram] Response:', JSON.stringify(parsed));
  } catch (e) {
    console.error('[Telegram] Error:', e.message);
  }
}

async function sendTelegramPhoto(env, caption, base64Data) {
  const token = env.TELEGRAM_BOT_TOKEN;
  if (!token || token.includes('YOUR_BOT')) {
    console.log('[Telegram] Bot token belum dikonfigurasi. Photo caption:', caption);
    return;
  }
  const chatId = env.TELEGRAM_CHAT_ID;
  const boundary = '----FormBoundary' + Date.now().toString(36);
  const bodyParts = [
    `--${boundary}\r\nContent-Disposition: form-data; name="chat_id"\r\n\r\n${chatId}`,
    `--${boundary}\r\nContent-Disposition: form-data; name="caption"\r\n\r\n${caption}`,
    `--${boundary}\r\nContent-Disposition: form-data; name="parse_mode"\r\n\r\nHTML`,
    `--${boundary}\r\nContent-Disposition: form-data; name="photo"; filename="selfie.jpg"\r\nContent-Type: image/jpeg\r\n\r\n`,
  ];

  const pre = bodyParts.join('\r\n') + '\r\n';
  const post = `\r\n--${boundary}--\r\n`;
  const binaryData = base64Data ? Uint8Array.from(atob(base64Data), c => c.charCodeAt(0)) : new Uint8Array(0);
  const fullBody = new Uint8Array([...new TextEncoder().encode(pre), ...binaryData, ...new TextEncoder().encode(post)]);

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
      method: 'POST',
      headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}` },
      body: fullBody
    });
    const parsed = await res.json();
    if (parsed.ok) console.log('[Telegram] Foto terkirim!');
    else console.log('[Telegram] Photo response:', JSON.stringify(parsed));
  } catch (e) {
    console.error('[Telegram] Photo error:', e.message);
  }
}

// Visitor DB via KV
async function saveVisitor(env, ip, userAgent) {
  let db = { visitors: [] };
  try {
    const raw = await env.KV.get(VISITOR_DB_KEY, 'text');
    if (raw) db = JSON.parse(raw);
  } catch {}

  const now = new Date();
  const entry = {
    ip,
    userAgent: userAgent || '',
    timestamp: now.toISOString(),
    date: now.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
    time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  };

  const idx = db.visitors.findIndex(v => v.ip === ip);
  if (idx === -1) db.visitors.push(entry);
  else db.visitors[idx] = entry;

  try {
    await env.KV.put(VISITOR_DB_KEY, JSON.stringify(db));
  } catch (e) {
    console.error('[KV] Gagal simpan visitor:', e.message);
  }
  return entry;
}

// Parse POST body
async function readBody(request) {
  const contentLength = parseInt(request.headers.get('content-length') || '0');
  if (contentLength > MAX_BODY_SIZE) {
    throw new Error('Payload too large');
  }
  try {
    return await request.json();
  } catch {
    return {};
  }
}

function getRealIP(request) {
  const fwd = request.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return request.headers.get('cf-connecting-ip') || 'unknown';
}

// ============================================================
// MAIN FETCH HANDLER
// ============================================================
async function handleRequest(request, env) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400'
      }
    });
  }

  // ---- /api/track-ip (POST)
  if (pathname === '/api/track-ip' && request.method === 'POST') {
    const data = await readBody(request).catch(() => ({}));
    const ip = data.ip || getRealIP(request);
    const ua = data.userAgent || request.headers.get('user-agent') || '';
    const siteUrl = url.origin;
    const entry = await saveVisitor(env, ip, ua);
    console.log(`[IP Logged] ${ip} at ${entry.timestamp}`);

    if (data.isNew !== false) {
      const msg = `👤 <b>Pengunjung Baru!</b>\n\n` +
        `📡 IP: <code>${ip}</code>\n` +
        `🌐 URL: ${siteUrl}\n` +
        `🕐 Waktu: ${entry.date}, ${entry.time}\n` +
        `📱 UA: ${ua.substring(0, 80)}`;
      await sendTelegram(env, msg);
    }
    return corsResponse({ ok: true, visitor: entry });
  }

  // ---- /api/send-telegram (POST)
  if (pathname === '/api/send-telegram' && request.method === 'POST') {
    const data = await readBody(request).catch(() => ({}));
    await sendTelegram(env, data.message || 'Hello from website!');
    return corsResponse({ ok: true });
  }

  // ---- /api/send-selfie (POST) — base64 photo via KV + Telegram
  if (pathname === '/api/send-selfie' && request.method === 'POST') {
    const data = await readBody(request).catch(() => ({}));
    const name = data.name || 'Anonim';
    const ip = data.ip || getRealIP(request);
    const photoBase64 = (data.photo || '').replace(/^data:image\/\w+;base64,/, '');
    const siteUrl = url.origin;
    const now = new Date();

    if (photoBase64) {
      const timestamp = now.toISOString().replace(/[:.]/g, '-');
      const filename = `selfie_${name.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.jpg`;
      try {
        await env.KV.put('selfie_' + filename, photoBase64);
        console.log(`[Selfie] Stored in KV: ${filename}`);
      } catch (e) {
        console.error('[Selfie KV] Gagal simpan:', e.message);
      }
    }

    const caption =
      `📸 <b>Selfie Baru dari Website!</b>\n\n` +
      `👤 Nama: <b>${name}</b>\n` +
      `📡 IP: <code>${ip}</code>\n` +
      `🌐 URL: ${siteUrl}\n` +
      `🕐 Waktu: ${now.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`;

    await sendTelegramPhoto(env, caption, photoBase64);
    return corsResponse({ ok: true });
  }

  // ---- /api/spotify/search (GET)
  if (pathname === '/api/spotify/search' && request.method === 'GET') {
    const q = url.searchParams.get('q') || '';
    const limit = url.searchParams.get('limit') || '6';
    if (!q) return corsResponse({ ok: false, error: { message: 'Param q wajib diisi' } }, 400);
    const result = await fetchJson(`${HAIDAR_BASE}/spotify/search?q=${encodeURIComponent(q)}&limit=${encodeURIComponent(limit)}&apikey=${HAIDAR_API_KEY}`);
    return corsResponse(result);
  }

  // ---- /api/spotify/download (GET)
  if (pathname === '/api/spotify/download' && request.method === 'GET') {
    const spotifyUrl = url.searchParams.get('url') || '';
    const index = url.searchParams.get('index') || '1';
    if (!spotifyUrl) return corsResponse({ ok: false, error: { message: 'Param url wajib diisi' } }, 400);
    const result = await fetchJson(`${HAIDAR_BASE}/downloader/spotify?url=${encodeURIComponent(spotifyUrl)}&index=${encodeURIComponent(index)}&apikey=${HAIDAR_API_KEY}`);
    return corsResponse(result);
  }

  // ---- /api/alight/auto (GET)
  if (pathname === '/api/alight/auto' && request.method === 'GET') {
    const result = await fetchJson(`${HAIDAR_BASE}/alight-motion/auto?apikey=${HAIDAR_API_KEY}`);
    return corsResponse(result);
  }

  // ---- /api/alight/send (GET)
  if (pathname === '/api/alight/send' && request.method === 'GET') {
    const email = url.searchParams.get('email') || '';
    if (!email) return corsResponse({ ok: false, error: { message: 'Param email wajib diisi' } }, 400);
    const result = await fetchJson(`${HAIDAR_BASE}/alight-motion/send?email=${encodeURIComponent(email)}&apikey=${HAIDAR_API_KEY}`);
    return corsResponse(result);
  }

  // ---- /api/alight/verify (GET)
  if (pathname === '/api/alight/verify' && request.method === 'GET') {
    const email = url.searchParams.get('email') || '';
    const link = url.searchParams.get('link') || '';
    if (!email || !link) return corsResponse({ ok: false, error: { message: 'Param email & link wajib diisi' } }, 400);
    const result = await fetchJson(`${HAIDAR_BASE}/alight-motion/verify?email=${encodeURIComponent(email)}&link=${encodeURIComponent(link)}&apikey=${HAIDAR_API_KEY}`);
    return corsResponse(result);
  }

  // ---- /api/tempmail/domains (GET)
  if (pathname === '/api/tempmail/domains' && request.method === 'GET') {
    const domains = await getAllowedDomains(env);
    return corsResponse({ status: 'success', domains });
  }

  // ---- /api/tempmail/inbox (GET) — whitelist check
  if (pathname === '/api/tempmail/inbox' && request.method === 'GET') {
    const email = url.searchParams.get('email') || '';
    if (!email) return corsResponse({ ok: false, error: { message: 'Param email wajib diisi' } }, 400);
    if (!isValidTempmailEmail(email)) {
      return corsResponse({ ok: false, error: { message: 'Domain email tidak terdaftar di tempmail. Gunakan email hasil Auto Create / Tempmail Baru.' } }, 403);
    }
    const result = await fetchJson(`${TEMPM_BASE}/inbox?email=${encodeURIComponent(email)}`);
    return corsResponse(result);
  }

  // ---- /api/tempmail/message (GET) — whitelist check
  if (pathname === '/api/tempmail/message' && request.method === 'GET') {
    const email = url.searchParams.get('email') || '';
    const id = url.searchParams.get('id') || '';
    if (!email || !id) return corsResponse({ ok: false, error: { message: 'Param email & id wajib diisi' } }, 400);
    if (!isValidTempmailEmail(email)) {
      return corsResponse({ ok: false, error: { message: 'Domain email tidak terdaftar di tempmail. Gunakan email hasil Auto Create / Tempmail Baru.' } }, 403);
    }
    const result = await fetchJson(`${TEMPM_BASE}/message?email=${encodeURIComponent(email)}&id=${encodeURIComponent(id)}`);
    return corsResponse(result);
  }

  // ---- /api/tools/bypaslink (GET)
  if (pathname === '/api/tools/bypaslink' && request.method === 'GET') {
    const targetUrl = url.searchParams.get('url') || '';
    if (!targetUrl) return corsResponse({ ok: false, error: { message: 'Param url wajib diisi' } }, 400);
    const result = await fetchJson(`${HAIDAR_BASE}/tools/bypaslink?url=${encodeURIComponent(targetUrl)}&apikey=${HAIDAR_API_KEY}`);
    return corsResponse(result);
  }

  // ---- /api/tools/cekban (GET)
  if (pathname === '/api/tools/cekban' && request.method === 'GET') {
    const number = url.searchParams.get('number') || '';
    if (!number) return corsResponse({ ok: false, error: { message: 'Param number wajib diisi' } }, 400);
    const result = await fetchJson(`${HAIDAR_BASE}/tools/cekban?number=${encodeURIComponent(number)}&apikey=${HAIDAR_API_KEY}`);
    return corsResponse(result);
  }

  // ---- /api/ff/profile (GET)
  if (pathname === '/api/ff/profile' && request.method === 'GET') {
    const uid = url.searchParams.get('uid') || '';
    if (!uid) return corsResponse({ ok: false, error: { message: 'Param uid wajib diisi' } }, 400);
    const result = await fetchJson(`${HAIDAR_BASE}/stalker/ffchecker?uid=${encodeURIComponent(uid)}&apikey=${HAIDAR_API_KEY}`);
    return corsResponse(result);
  }

  // ---- /api/ff/prime (GET)
  if (pathname === '/api/ff/prime' && request.method === 'GET') {
    const uid = url.searchParams.get('uid') || '';
    if (!uid) return corsResponse({ ok: false, error: { message: 'Param uid wajib diisi' } }, 400);
    const result = await fetchJson(`${HAIDAR_BASE}/stalker/cek-prime-ff?uid=${encodeURIComponent(uid)}&apikey=${HAIDAR_API_KEY}`);
    return corsResponse(result);
  }

  // 404 for unknown API routes
  if (pathname.startsWith('/api/')) {
    return corsResponse({ ok: false, error: 'Not found' }, 404);
  }

  // Non-API requests: let Pages or static serve handle them
  return fetch(request);
}

// ============================================================
// WORKER ENTRY POINT
// ============================================================
export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, env);
  }
};
