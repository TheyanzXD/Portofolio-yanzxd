# Changelog

Semua perubahan penting pada proyek ini didokumentasikan di sini.

Format mengikuti [Keep a Changelog](https://keepachangelog.com/id/1.1.0/),
versi mengikuti [Semantic Versioning](https://semver.org/).

## [3.3.1] - 2026-08-30

### Changed
- Pindahkan **semua** panggilan API eksternal (Spotify, Alight, Tempmail, BypasLink, CekBan, FF) dari client ke backend `api/server.js` via route same-origin `/api/*`. API key `haidarapis-...` kini tersimpan **server-side**, tidak lagi di-hardcode di client.
  - `/api/spotify/search|download` · `/api/alight/auto|send|verify` · `/api/tempmail/inbox|message` · `/api/tools/bypaslink|cekban` · `/api/ff/profile|prime`
  - Client sudah tidak menyentuh `api.haidarxd.my.id` / `tempmailhaidar.vercel.app` langsung (hanya `api.ipify.org`, `data/playlist.json`, dan widget DOM murni yang tetap client-side).
- **Alight Inbox Realtime** diarahkan ulang ke `/api/tempmail/*`. Tombol "Salin OTP" diganti **Buka Link** — fetch isi pesan (`/api/tempmail/message`) lalu ekstrak & tampilkan link login (buat dibuka/disalin). Alight tidak mengirim OTP angka.
- **Alight** tambah kolom **email custom** + tombol **Pantau** di kartu Inbox — bisa pantau inbox email tersendiri tanpa harus Auto Create.

## [3.3.0] - 2026-08-30

### Added
- Halaman baru `tools/cekban.html` — Cek status ban WhatsApp (banned/safe, status terdaftar, detail, salin nomor/JSON) via `tools/cekban`.
- **Inbox Realtime** di `tools/alight.html` — auto-poll inbox temp mail setiap 5 detik, tampilkan OTP dengan tombol salin (jedha saat tab tidak aktif).
- Kartu "Cek Ban WA" di grid `index.html`.

### Changed
- Migrasi semua halaman tools (9 halaman) ke **Tailwind CSS (CDN)** — `kalkulator`, `konversi-suhu`, `quotes`, `random-picker`, `stopwatch`, `tebak-angka`, `bypaslink`, `ff-checker`, `alight`. JS & state class (`pick`, `show`, `active`, `visible`, `hidden`, `guess-tag`, dll) dipertahankan agar tidak ada error.

### Removed
- Hapus `tools/pengunjung.html` (admin panel) & endpoint `/api/visitors` di `api/server.js` — fitur tracking IP/telegram tetap berjalan via `/api/track-ip`, hanya dashboard admin yang dihilangkan. Dokumentasi admin panel dihapus dari README.

## [3.2.0] - 2026-08-30

### Added
- Halaman baru `tools/ff-checker.html` — Cek profil Free Fire (player, rank, equip, pet, guild) & cek status Prime + taksiran harga akun.
- Halaman baru `tools/bypaslink.html` — Bypass / expand link shortener (Linkvertise, Adf.ly, Bit.ly, Tinyurl, dll).
- `CHANGELOG.md`.

### Changed
- Direktori `/yanz/` dipindah menjadi `/tools/` — semua link halaman & README diperbarui.
- UI grid tools di `index.html`: kartu lebih halus — chip ikon berwarna per-tool, lift + glow saat hover, animasi shine, panah bergeser, entri berurutan (stagger).

## [3.1.0] - 2026-08-29

### Changed
- Redesign UI Alight Motion Tools + beautify README.

## [3.0.0] - 2026-08-29

### Changed
- Reorganisasi: sub-halaman dipindah ke `/yanz`, backend dirapikan ke `api/`.
- Perbaikan path API Alight Motion (tambah segmen `/alight-motion/`).
- Tema ungu neon diterapkan di semua halaman.
- Hapus embed/import Spotify lama, pertahankan daftar playlist + player baru.