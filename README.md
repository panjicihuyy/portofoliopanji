# Panji Setiawan | Portfolio (gaya Persona 3 Reload)

HTML, CSS, JavaScript murni. Tanpa npm, tanpa build.

## Menjalankan di VS Code
1. Buka folder ini di VS Code (`File > Open Folder`).
2. Pasang ekstensi **Live Server** (Ritwick Dey).
3. Klik kanan `index.html` > **Open with Live Server**.
4. Di layar pertama, pilih Music / Sound effects, lalu tekan **Enter**.

Membuka `index.html` dengan klik dua kali juga bisa. Bedanya hanya efek suara
memakai cara cadangan yang sedikit lebih lambat.

## Handphone
Website sekarang tampil di HP (potret dan lanskap) dan tablet. Cukup sentuh:
- Layar pilihan suara: sentuh baris Music / Sound effects, lalu sentuh ENTER.
- Menu: sentuh tulisannya. Project dan Resume: sentuh kartu sekali untuk memilih, sentuh lagi (atau tombol TAP Confirm) untuk membuka link.
- Tombol Back / Prev / Next di pojok bawah bisa disentuh. Daftar yang panjang bisa digeser.
- HP memakai video latar menu versi 720p (`bg-intro-mobile.mp4`, `bg-loop-mobile.mp4`) supaya ringan. Layar 1024 px ke atas tetap memakai video asli.

## Kontrol
- Panah atas/bawah (atau W/S): pilih. Enter: buka.
- ESC atau B: kembali. Q/E atau panah kiri/kanan: ganti tab / lagu (di SKILLS dan SYSTEM).
- M: nyalakan/matikan musik. N: lagu berikutnya.

## Struktur
```
index.html            kerangka halaman saja
css/                  gaya per bagian (urutan nomor = urutan dimuat; 13-mobile.css = tampilan HP)
js/data/              ISI WEBSITE: edit di sini
js/core/              mesin: suara, musik, transisi, daftar halaman, boot
js/pages/             satu file per halaman
assets/ fonts/        video, musik, gambar, efek suara, font
```

## Mengubah isi (cukup file di `js/data/`)
| File | Isi |
|------|-----|
| `profile.js`  | nama, jurusan, foto, bio, kutipan |
| `projects.js` | daftar project, deskripsi, tag, link |
| `skills.js`   | tab dan level skill (angka awal hanya perkiraan, sesuaikan) |
| `resume.js`   | linimasa sekolah dan project |
| `contact.js`  | kotak surat. Tambah GitHub / Instagram / WhatsApp di sini |
| `music.js`    | daftar lagu |
| `menu.js`     | urutan dan kemiringan tulisan menu |

Foto profil: ganti `assets/images/profile.jpg`.

## Menambah halaman baru
1. Tambah `<section id="xxx-page">` di `index.html`.
2. Buat `js/pages/xxx.js` yang memanggil `Pages.register({ id: "xxx", ... })`, lalu tambahkan `<script>`-nya.
3. Tambah satu baris di `js/data/menu.js`.

## Catatan
Font Rodin / NewRodin / Skip, video latar, dan musik berasal dari Persona 3 Reload (Atlus / SEGA).
Pakai hanya untuk portfolio pribadi dan jangan dijual atau dipublikasikan sebagai milik sendiri.
