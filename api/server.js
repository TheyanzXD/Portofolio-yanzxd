const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  try {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) return;
      const key = trimmed.substring(0, eqIdx).trim();
      const val = trimmed.substring(eqIdx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val;
      }
    });
    console.log('[ENV] .env file loaded successfully');
    console.log('[ENV] TELEGRAM_BOT_TOKEN:', process.env.TELEGRAM_BOT_TOKEN ? 'OK (loaded)' : 'MISSING');
    console.log('[ENV] TELEGRAM_CHAT_ID:', process.env.TELEGRAM_CHAT_ID ? 'OK (loaded)' : 'MISSING');
  } catch (e) {
    console.warn('[ENV] .env file not found, using fallback');
  }
}
loadEnv();

const PORT = process.env.PORT || 3000;
const ROOT = path.join(__dirname, '..');

const CONFIG = {
  get telegramBotToken() { return process.env.TELEGRAM_BOT_TOKEN || ''; },
  get telegramChatId() { return process.env.TELEGRAM_CHAT_ID || ''; }
};

const MAX_BODY_SIZE = 5 * 1024 * 1024; // 5MB

// -------------------------------------------------
// EKSTERNAL API (semua proxy logic ada di backend)
// -------------------------------------------------
const HAIDAR_BASE = 'https://api.haidarxd.my.id/api/v1';
const HAIDAR_API_KEY = 'haidarapis-43ee0ef3199221b320f01c50'; // ponytail: public demo key, hardcode per user request
const TEMPM_BASE = 'https://tempmailhaidar.vercel.app/api';

// GET eksternal, error-safe: selalu kembalikan JSON (bukan throw)
function fetchJson(url) {
  return new Promise((resolve) => {
    const u = new URL(url);
    const req = https.request({ hostname: u.hostname, port: 443, path: u.pathname + u.search, method: 'GET', headers: { 'User-Agent': 'yandev-portfolio' } }, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch (e) { resolve({ ok: false, error: { message: 'Respons bukan JSON' } }); }
      });
    });
    req.on('error', e => resolve({ ok: false, error: { message: e.message } }));
    req.end();
  });
}

function sendJson(res, data) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

const asyncHandler = fn => (req, res) => fn(req, res).catch(e => {
  console.error('[ERROR]', e.message);
  if (!res.headersSent) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: false, error: 'Internal Server Error' }));
  }
});

// Writable storage: /tmp on Vercel, data/ locally
const IS_VERCEL = !!process.env.VERCEL;
const STORAGE_ROOT = IS_VERCEL ? '/tmp' : ROOT;

const SELFIE_DIR = path.join(STORAGE_ROOT, 'data', 'selfies');
try {
  if (!fs.existsSync(SELFIE_DIR)) {
    fs.mkdirSync(SELFIE_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('[STORAGE] Gagal buat folder selfies:', e.message);
}

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// ============================================
// TELEGRAM: KIRIM PESAN TEKS
// ============================================
function sendTelegram(message) {
  if (!CONFIG.telegramBotToken || CONFIG.telegramBotToken.includes('YOUR_BOT')) {
    console.log('[Telegram] Bot token belum dikonfigurasi. Pesan:', message);
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const url = `https://api.telegram.org/bot${CONFIG.telegramBotToken}/sendMessage`;
    const data = JSON.stringify({ chat_id: CONFIG.telegramChatId, text: message, parse_mode: 'HTML' });
    const u = new URL(url);
    const req = https.request({
      hostname: u.hostname,
      port: 443,
      path: u.pathname,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    }, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed.ok) console.log('[Telegram] Pesan terkirim!');
          else console.log('[Telegram] Response:', body);
        } catch (e) {
          console.log('[Telegram] Response:', body);
        }
        resolve();
      });
    });
    req.on('error', e => { console.error('[Telegram] Error:', e.message); resolve(); });
    req.write(data);
    req.end();
  });
}

// ============================================
// TELEGRAM: KIRIM FOTO (multipart/form-data)
// ============================================
function sendTelegramPhoto(caption, imageBuffer) {
  if (!CONFIG.telegramBotToken || CONFIG.telegramBotToken.includes('YOUR_BOT')) {
    console.log('[Telegram] Bot token belum dikonfigurasi. Photo caption:', caption);
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const boundary = '----FormBoundary' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    const url = `https://api.telegram.org/bot${CONFIG.telegramBotToken}/sendPhoto`;

    // Build multipart body parts
    const parts = [];
    parts.push({ name: 'chat_id', value: CONFIG.telegramChatId });
    parts.push({ name: 'caption', value: caption });
    parts.push({ name: 'parse_mode', value: 'HTML' });

    let preBodyStr = '';
    parts.forEach(p => {
      preBodyStr += `--${boundary}\r\n`;
      preBodyStr += `Content-Disposition: form-data; name="${p.name}"\r\n\r\n`;
      preBodyStr += `${p.value}\r\n`;
    });

    // Photo part header
    const photoHeader = `--${boundary}\r\nContent-Disposition: form-data; name="photo"; filename="selfie.jpg"\r\nContent-Type: image/jpeg\r\n\r\n`;
    const postBodyStr = `\r\n--${boundary}--\r\n`;

    const preBody = Buffer.from(preBodyStr + photoHeader, 'utf8');
    const postBody = Buffer.from(postBodyStr, 'utf8');
    const fullBody = Buffer.concat([preBody, imageBuffer, postBody]);

    const u = new URL(url);
    const req = https.request({
      hostname: u.hostname,
      port: 443,
      path: u.pathname,
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': fullBody.length
      }
    }, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed.ok) console.log('[Telegram] Foto terkirim!');
          else console.log('[Telegram] Photo response:', body);
        } catch (e) {
          console.log('[Telegram] Photo response:', body);
        }
        resolve();
      });
    });
    req.on('error', e => { console.error('[Telegram] Photo error:', e.message); resolve(); });
    req.write(fullBody);
    req.end();
  });
}

// ============================================
// SAVE VISITOR
// ============================================
function saveVisitor(ip, userAgent) {
  const dbPath = path.join(STORAGE_ROOT, 'data', 'database.json');
  let db = { visitors: [] };
  try {
    db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } catch (e) {
    db = { visitors: [] };
  }
  const now = new Date();
  const entry = {
    ip,
    userAgent: userAgent || '',
    timestamp: now.toISOString(),
    date: now.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
    time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  };
  const idx = db.visitors.findIndex(v => v.ip === ip);
  if (idx === -1) {
    db.visitors.push(entry);
  } else {
    db.visitors[idx] = entry;
  }
  try {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  } catch (e) {
    console.error('[DB] Gagal simpan database:', e.message);
  }
  return entry;
}

// ============================================
// READ BODY HELPER
// ============================================
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    let size = 0;
    req.on('data', chunk => {
      size += chunk.length;
      if (size > MAX_BODY_SIZE) {
        req.destroy();
        reject(new Error('Payload too large'));
        return;
      }
      body += chunk;
    });
    req.on('end', () => {
      try { resolve(JSON.parse(body)); } catch (e) { resolve(body); }
    });
    req.on('error', reject);
  });
}

// ============================================
// GET REAL IP
// ============================================
function getRealIP(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (fwd) return fwd.split(',')[0].trim();
  return req.socket.remoteAddress || 'unknown';
}

// ============================================
// REQUEST HANDLER
// ============================================
async function handleRequest(req, res) {
  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = urlObj.pathname;
  const siteUrl = req.headers.host ? `https://${req.headers.host}` : `http://localhost:${PORT}`;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  // ----------------------------------------
  // API: TRACK IP + KIRIM KE TELEGRAM
  // ----------------------------------------
  if (pathname === '/api/track-ip' && req.method === 'POST') {
    const data = await readBody(req);
    const ip = data.ip || getRealIP(req);
    const ua = data.userAgent || req.headers['user-agent'] || '';
    const entry = saveVisitor(ip, ua);
    console.log(`[IP Logged] ${ip} at ${entry.timestamp}`);

    if (data.isNew !== false) {
      const msg = `👤 <b>Pengunjung Baru!</b>\n\n` +
        `📡 IP: <code>${ip}</code>\n` +
        `🌐 URL: ${siteUrl}\n` +
        `🕐 Waktu: ${entry.date}, ${entry.time}\n` +
        `📱 UA: ${ua.substring(0, 80)}`;
      await sendTelegram(msg);
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, visitor: entry }));
    return;
  }

  // ----------------------------------------
  // API: SEND TEKS KE TELEGRAM
  // ----------------------------------------
  if (pathname === '/api/send-telegram' && req.method === 'POST') {
    const data = await readBody(req);
    await sendTelegram(data.message || 'Hello from website!');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  // ----------------------------------------
  // API: KIRIM SELFIE KE TELEGRAM
  // ----------------------------------------
  if (pathname === '/api/send-selfie' && req.method === 'POST') {
    const data = await readBody(req);
    const name = data.name || 'Anonim';
    const ip = data.ip || 'unknown';
    const photoBase64 = data.photo || '';

    if (!photoBase64) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: 'No photo provided' }));
      return;
    }

    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-');
    const filename = `selfie_${name.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.jpg`;
    const filePath = path.join(SELFIE_DIR, filename);

    const base64Data = photoBase64.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    try {
      fs.writeFileSync(filePath, imageBuffer);
      console.log(`[Selfie] Saved: ${filename} (${imageBuffer.length} bytes)`);
    } catch (e) {
      console.error('[Selfie] Gagal simpan foto:', e.message);
    }

    const caption =
      `📸 <b>Selfie Baru dari Website!</b>\n\n` +
      `👤 Nama: <b>${name}</b>\n` +
      `📡 IP: <code>${ip}</code>\n` +
      `🌐 URL: ${siteUrl}\n` +
      `🕐 Waktu: ${now.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`;

    await sendTelegramPhoto(caption, imageBuffer);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, filename }));
    return;
  }

  // ----------------------------------------
  // PROXY: SPOTIFY
  // ----------------------------------------
  if (pathname === '/api/spotify/search' && req.method === 'GET') {
    const q = urlObj.searchParams.get('q') || '';
    const limit = urlObj.searchParams.get('limit') || '6';
    if (!q) { sendJson(res, { ok: false, error: { message: 'Param q wajib diisi' } }); return; }
    const url = `${HAIDAR_BASE}/spotify/search?q=${encodeURIComponent(q)}&limit=${encodeURIComponent(limit)}&apikey=${HAIDAR_API_KEY}`;
    sendJson(res, await fetchJson(url));
    return;
  }
  if (pathname === '/api/spotify/download' && req.method === 'GET') {
    const url = urlObj.searchParams.get('url') || '';
    const index = urlObj.searchParams.get('index') || '1';
    if (!url) { sendJson(res, { ok: false, error: { message: 'Param url wajib diisi' } }); return; }
    const up = `${HAIDAR_BASE}/downloader/spotify?url=${encodeURIComponent(url)}&index=${encodeURIComponent(index)}&apikey=${HAIDAR_API_KEY}`;
    sendJson(res, await fetchJson(up));
    return;
  }

  // ----------------------------------------
  // PROXY: ALIGHT MOTION
  // ----------------------------------------
  if (pathname === '/api/alight/auto' && req.method === 'GET') {
    sendJson(res, await fetchJson(`${HAIDAR_BASE}/alight-motion/auto?apikey=${HAIDAR_API_KEY}`));
    return;
  }
  if (pathname === '/api/alight/send' && req.method === 'GET') {
    const email = urlObj.searchParams.get('email') || '';
    if (!email) { sendJson(res, { ok: false, error: { message: 'Param email wajib diisi' } }); return; }
    sendJson(res, await fetchJson(`${HAIDAR_BASE}/alight-motion/send?email=${encodeURIComponent(email)}&apikey=${HAIDAR_API_KEY}`));
    return;
  }
  if (pathname === '/api/alight/verify' && req.method === 'GET') {
    const email = urlObj.searchParams.get('email') || '';
    const link = urlObj.searchParams.get('link') || '';
    if (!email || !link) { sendJson(res, { ok: false, error: { message: 'Param email & link wajib diisi' } }); return; }
    sendJson(res, await fetchJson(`${HAIDAR_BASE}/alight-motion/verify?email=${encodeURIComponent(email)}&link=${encodeURIComponent(link)}&apikey=${HAIDAR_API_KEY}`));
    return;
  }

  // ----------------------------------------
  // PROXY: TEMPMAIL (langsung ke tempmailhaidar)
  // ----------------------------------------
  if (pathname === '/api/tempmail/inbox' && req.method === 'GET') {
    const email = urlObj.searchParams.get('email') || '';
    if (!email) { sendJson(res, { ok: false, error: { message: 'Param email wajib diisi' } }); return; }
    sendJson(res, await fetchJson(`${TEMPM_BASE}/inbox?email=${encodeURIComponent(email)}`));
    return;
  }
  if (pathname === '/api/tempmail/message' && req.method === 'GET') {
    const email = urlObj.searchParams.get('email') || '';
    const id = urlObj.searchParams.get('id') || '';
    if (!email || !id) { sendJson(res, { ok: false, error: { message: 'Param email & id wajib diisi' } }); return; }
    sendJson(res, await fetchJson(`${TEMPM_BASE}/message?email=${encodeURIComponent(email)}&id=${encodeURIComponent(id)}`));
    return;
  }

  // ----------------------------------------
  // PROXY: TOOLS (bypaslink, cekban)
  // ----------------------------------------
  if (pathname === '/api/tools/bypaslink' && req.method === 'GET') {
    const url = urlObj.searchParams.get('url') || '';
    if (!url) { sendJson(res, { ok: false, error: { message: 'Param url wajib diisi' } }); return; }
    sendJson(res, await fetchJson(`${HAIDAR_BASE}/tools/bypaslink?url=${encodeURIComponent(url)}&apikey=${HAIDAR_API_KEY}`));
    return;
  }
  if (pathname === '/api/tools/cekban' && req.method === 'GET') {
    const number = urlObj.searchParams.get('number') || '';
    if (!number) { sendJson(res, { ok: false, error: { message: 'Param number wajib diisi' } }); return; }
    sendJson(res, await fetchJson(`${HAIDAR_BASE}/tools/cekban?number=${encodeURIComponent(number)}&apikey=${HAIDAR_API_KEY}`));
    return;
  }

  // ----------------------------------------
  // PROXY: FREE FIRE CHECKER
  // ----------------------------------------
  if (pathname === '/api/ff/profile' && req.method === 'GET') {
    const uid = urlObj.searchParams.get('uid') || '';
    if (!uid) { sendJson(res, { ok: false, error: { message: 'Param uid wajib diisi' } }); return; }
    sendJson(res, await fetchJson(`${HAIDAR_BASE}/stalker/ffchecker?uid=${encodeURIComponent(uid)}&apikey=${HAIDAR_API_KEY}`));
    return;
  }
  if (pathname === '/api/ff/prime' && req.method === 'GET') {
    const uid = urlObj.searchParams.get('uid') || '';
    if (!uid) { sendJson(res, { ok: false, error: { message: 'Param uid wajib diisi' } }); return; }
    sendJson(res, await fetchJson(`${HAIDAR_BASE}/stalker/cek-prime-ff?uid=${encodeURIComponent(uid)}&apikey=${HAIDAR_API_KEY}`));
    return;
  }

  // ----------------------------------------
  // STATIC FILE SERVING
  // ----------------------------------------
  let filePath = pathname === '/' ? '/index.html' : pathname;
  filePath = path.join(ROOT, filePath);

  const resolvedPath = path.resolve(filePath);
  if (!resolvedPath.startsWith(ROOT)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  const ext = path.extname(resolvedPath);

  fs.readFile(resolvedPath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        fs.readFile(path.join(ROOT, 'index.html'), (e, c) => {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(c);
        });
      } else {
        res.writeHead(500);
        res.end('Internal Server Error');
      }
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' });
    res.end(content);
  });
}

// ============================================
// EXPORTS (Vercel serverless) & LOCAL SERVER
// ============================================
module.exports = asyncHandler(handleRequest);

if (!process.env.VERCEL) {
  const server = http.createServer(asyncHandler(handleRequest));

  server.listen(PORT, async () => {
    console.log(`\n========================================`);
    console.log(`  Server berjalan di http://localhost:${PORT}`);
    console.log(`  Bot Token: ${CONFIG.telegramBotToken ? 'OK' : 'TIDAK ADA!'}`);
    console.log(`  Chat ID:   ${CONFIG.telegramChatId ? 'OK' : 'TIDAK ADA!'}`);
    console.log(`========================================\n`);

    if (CONFIG.telegramBotToken) {
      const msg = `🚀 <b>Website Deployed!</b>\n\n` +
        `📡 Status: <b>ONLINE</b>\n` +
        `🌐 URL: http://localhost:${PORT}\n` +
        `🕐 Waktu: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}\n` +
        `✅ Semua fitur aktif.`;
      await sendTelegram(msg);
    } else {
      console.log('[Telegram] Bot token tidak ada, notifikasi dilewati.');
    }
  });
}
