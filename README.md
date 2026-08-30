<div align="center">

```text
▗▄▄▖  ▗▄▖ ▗▄▄▖ ▗▄▄▄▖ ▗▄▖ ▗▄▄▄▖ ▗▄▖ ▗▖    ▄▄▄  ▗▄▖
▐▛▀▜▖ █▀█ ▐▛▀▜▌▝▀█▀▘ █▀█ ▐▛▀▀▘ █▀█ ▐▌    ▀█▀  █▀█
▐▌ ▐▌▐▌ ▐▌▐▌ ▐▌  █  ▐▌ ▐▌▐▌   ▐▌ ▐▌▐▌     █  ▐▌ ▐▌
▐██▛ ▐▌ ▐▌▐███   █  ▐▌ ▐▌▐███ ▐▌ ▐▌▐▌     █  ▐▌ ▐▌
▐▌   ▐▌ ▐▌▐▌▝█▖  █  ▐▌ ▐▌▐▌   ▐▌ ▐▌▐▌     █  ▐▌ ▐▌
▐▌    █▄█ ▐▌ ▐▌  █   █▄█ ▐▌    █▄█ ▐▙▄▄▖ ▄█▄  █▄█
▝▘    ▝▀▘ ▝▘ ▝▀  ▀   ▝▀▘ ▝▘    ▝▀▘ ▝▀▀▀▘ ▀▀▀  ▝▀▘
```

</div>

<h2 align="center">🎧 Music · Streaming · 🎬 Tools · 🔐 Admin</h2>

<p align="center">
  <img alt="Version" src="https://img.shields.io/badge/version-3.1.0-8b5cf6.svg?style=for-the-badge&logo=vercel" />
  <a href="https://yandev.my.id" target="_blank">
    <img alt="Live Demo" src="https://img.shields.io/badge/LIVE_DEMO-yandev.my.id-00c853.svg?style=for-the-badge&logo=vercel" />
  </a>
  <img alt="License" src="https://img.shields.io/badge/License-MIT-a855f7.svg?style=for-the-badge" />
  <img alt="Theme" src="https://img.shields.io/badge/Theme-Neon_Purple-6366f1.svg?style=for-the-badge" />
  <img alt="Last commit" src="https://img.shields.io/github/last-commit/TheyanzXD/Portofolio-yanzxd?style=for-the-badge" />
</p>

<p align="center">
  💜 Portfolio personal tema ungu neon — lengkap dengan music player, tools Alight Motion, IP tracking + notifikasi Telegram, dan mini tools interaktif.
</p>

---

## ✨ Fitur Utama

| Kategori | Fitur |
|----------|-------|
| 🎧 **Music Player** | Streaming Spotify: cari lagu, putar/pause, progress bar, download otomatis, shortcut keyboard (Spasi, Ctrl+K, Esc) |
| 🎬 **Alight Motion** | Auto create email + inbox, kirim verifikasi, aktivasi akun (3 langkah) + **Inbox Realtime** (poll OTP setiap 5 detik) |
| 📊 **Tracking** | IP logging + notifikasi pengunjung baru ke Telegram |
| 📸 **Kamera** | Selfie langsung dari browser → dikirim ke Telegram Bot |
| 🛠 **Tools** | Kalkulator, stopwatch, konversi suhu, random picker, tebak angka, quotes, bypass link shortener, FF checker, **Cek Ban WA** |
| 🎨 **Desain** | Tema gelap ungu neon (Tailwind CSS + Inter, Font Awesome 6), responsif mobile 320px+ |

---

## 🚀 Demo

> **Live:** [yandev.my.id](https://yandev.my.id) — bagian **Music Player** & **Alight Motion Tools**

Pengunjung akan otomatis:
- 📍 IP dicatat + notifikasi pengunjung baru ke Telegram
- 📸 Foto selfie dikirim ke Telegram Bot
- 🎵 Lagu favorit & player tersedia langsung di halaman

---

## 🛠 Tech Stack

```text
Frontend  → HTML5 · Tailwind CSS (CDN) · Vanilla JS (IIFE) · Font Awesome 6 · Google Font
Backend   → Node.js serverless (Vercel Functions)
Deploy    → Vercel (GitHub auto-deploy)
Integrasi → Telegram Bot API · Spotify API · API HaidarXD (ai.haidarxd.my.id)
```

---

## 📁 Struktur

```text
.
├── index.html            # Halaman utama (Music Player + tools grid)
├── tools/                # Semua halaman tools
│   ├── alight.html       # Alight Motion Tools (auto/send/verify + inbox realtime)
│   ├── bypaslink.html    # Bypass / expand link shortener
│   ├── cekban.html       # Cek status ban WhatsApp
│   ├── ff-checker.html   # Free Fire & Prime checker
│   ├── kalkulator.html   # Kalkulator
│   ├── konversi-suhu.html# Konversi suhu
│   ├── quotes.html       # Random quotes
│   ├── random-picker.html# Random picker
│   ├── stopwatch.html    # Stopwatch
│   └── tebak-angka.html  # Game tebak angka
├── api/                  # Backend serverless (Telegram / IP tracking)
│   ├── index.js          # Vercel entry point
│   └── server.js         # API handlers (track-ip, send-selfie, send-telegram)
├── data/
│   └── playlist.json     # Daftar lagu favorit
├── ui/
│   └── style.css         # Global styles (tema ungu neon)
├── vercel.json           # Vercel config
└── LICENSE
```

---

## 🎧 Music Player

Streaming langsung dari Spotify (di-proxy backend `/api`).

```text
Search   → GET /api/spotify/search?q={query}&limit=6
Download → GET /api/spotify/download?url={url}&index=1
```

- Default lagu: **Secukupnya – Hindia**
- Cari → klik hasil → download & putar otomatis
- Progress bar bisa diklik & drag (pointer events)
- Shortcut: `Spasi` (play/pause) · `Ctrl+K`/`Cmd+K` (fokus search) · `Esc` (tutup hasil)

> ⚠️ URL download bersifat sementara (expired) — diambil ulang setiap kali lagu dipilih.

---

## 🎬 Alight Motion Tools

Akses di **/tools/alight.html**. Tiga langkah aktivasi:

1. **Auto Create** → dapat email temporer + inbox URL (berlaku 1 tahun)
2. **Kirim Verifikasi** → kirim link ke email
3. **Aktivasi** → tempel email + link, aktifkan akun

Tombol **"Buka Inbox Temp Mail"** membuka halaman inbox eksternal secara manual.

**Inbox Realtime** (Card 4) menampilkan email masuk di halaman yang sama:
- Auto-poll `/api/tempmail/inbox?email={email}` setiap **5 detik** (jeda saat tab tidak aktif)
- Dukung email dari **Auto Create / Tempmail Baru**, atau **email custom** via kolom + tombol **Pantau** (hanya domain tempmail terdaftar — email di luar whitelist ditolak)
- Setiap pesan punya tombol **Buka Link** → ambil isi via `/api/tempmail/message`, tampilkan link login (bisa dibuka & disalin)

```text
Auto    → GET /api/alight/auto
Send    → GET /api/alight/send?email={email}
Verify  → GET /api/alight/verify?email={email}&link={link}
Domains → GET /api/tempmail/domains
Inbox   → GET /api/tempmail/inbox?email={email}
Detail  → GET /api/tempmail/message?email={email}&id={id}
```

> **Inbox & Detail cuma menerima email ber-domain tempmail resmi** (dari `/api/tempmail/domains`, contoh: `suarj.com`, `anogz.com`, dll). Semua request API eksternal di-proxy lewat backend **`/api/*`** — API key tersimpan **server-side**, tidak bocor ke client.

---

## 💬 Cek Ban WhatsApp

Akses di **/tools/cekban.html**.

Masukkan nomor (dengan kode negara, mis. `6285...`) lalu cek status:
- **Banned / Safe** + status terdaftar (registered)
- Detail (provider, tipe SIM, validasi) & metode pemblokiran potensial
- Salin nomor / hasil JSON, Enter untuk cek

```text
CekBan → GET /api/tools/cekban?number={number}
```

> Request di-proxy backend `/api` (key server-side).

---

## ☁️ Deploy (Vercel)

Repo ini auto-deploy via GitHub → Vercel.

```bash
git clone https://github.com/TheyanzXD/Portofolio-yanzxd.git
cd Portofolio-yanzxd
```

Masukkan env vars di **Vercel → Settings → Environment Variables**:

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

> **Cara dapat token:** buka [@BotFather](https://t.me/BotFather) → `/newbot` → copy token.
> Tanpa env ini, fitur Telegram otomatis dilewati (tidak error).

---

## ⚠️ Known Issues

- Data visitor ephemeral di Vercel (disimpan ke `/tmp`)
- Tidak ada rate limiting API eksternal

---

## 👤 Author

**@TheyanzXD**

| Platform | Link |
|----------|------|
| Website | [yandev.my.id](https://yandev.my.id) |
| GitHub | [@TheyanzXD](https://github.com/TheyanzXD) |
| Twitter | [@yanzxd](https://twitter.com/yanzxd) |
| LinkedIn | [@muhammadizyan](https://linkedin.com/in/muhammadizyan) |

---

## 📄 License

Distributed under the **MIT License**. Lihat [LICENSE](LICENSE).

---

<p align="center">
  💜 Dibuat dengan ❤️ oleh <b>YanzXD</b> — The Coders
</p>
