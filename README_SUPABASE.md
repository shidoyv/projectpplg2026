# Panduan Integrasi Supabase Cloud - Lelana Jateng (Studio Canting)

Dokumen ini berisi panduan dan status integrasi **Studio Canting** dengan **Supabase Cloud** (menggantikan backend Laravel).

> **STATUS: AKTIF & TERHUBUNG** ✅  
> - **Project**: `shidoyv's Project` (Organization: `Lelana-Studio`)  
> - **Project URL**: `https://dorygtvcekiimgflwtog.supabase.co`  
> - **Tabel Database**: `public.karya_batik`  
> - **Storage Bucket**: `karya-batik` (Akses Publik Aktif)  
> - **Status Pengujian**: Berhasil INSERT, GET, DELETE (HTTP 200/201 OK)

---

## 📌 Catatan Pemisahan Tugas Rental PS
- **Rental PS** adalah tugas terpisah dan **TIDAK ada hubungannya** dengan proyek Lelana Jateng.
- Seluruh berkas Rental PS sudah dipindahkan secara mandiri ke Laragon di direktori:
  📁 `C:\laragon\www\rental-ps\`
- Rental PS dapat dibuka langsung di browser melalui Laragon:
  🌐 `http://localhost/rental-ps/`

---

## 🚀 Panduan Setup Supabase dari Layar Dashboard Anda

Berdasarkan layar Supabase Anda saat ini di `https://supabase.com/dashboard/organizations`:

### Langkah 1: Buat Organization
1. Klik tombol hijau **`+ New organization`** yang ada di tengah layar.
2. Pada isian **Name**, masukkan nama organisasi Anda (contoh: `Lelana Studio` atau nama Anda).
3. Pada opsi **Pricing Plan**, pilih **Free** ($0/month).
4. Klik tombol **Create organization**.

---

### Langkah 2: Buat Project Baru
1. Setelah organisasi terbentuk, klik tombol **`+ New project`**.
2. Isi formulir konfigurasi proyek:
   - **Name**: `lelana-jateng` (atau nama lain sesuai keinginan)
   - **Database Password**: Buat password yang kuat (dan simpan/ingat password ini)
   - **Region**: Pilih yang paling dekat dengan Indonesia, yaitu **`Southeast Asia (Singapore)`**
   - **Pricing Plan**: Pilih **Free**
3. Klik tombol **Create new project**.
4. Tunggu sekitar 1–2 menit sampai proses penyiapan database selesai dan statusnya menjadi aktif.

---

### Langkah 3: Jalankan Skrip Skema SQL Database
Skrip SQL sudah disiapkan secara lengkap di dalam proyek: [supabase_schema.sql](file:///c:/Users/vincent%20lim/Downloads/projectpplg2026-main/supabase_schema.sql).

1. Di dashboard Supabase proyek Anda, lihat bilah menu sebelah kiri.
2. Klik menu **SQL Editor** (ikon terminal dengan lambang `>_`).
3. Klik tombol **`+ New query`**.
4. Salin (Copy) seluruh isi file [supabase_schema.sql](file:///c:/Users/vincent%20lim/Downloads/projectpplg2026-main/supabase_schema.sql) dan tempel (Paste) ke dalam editor query.
5. Klik tombol hijau **Run** (atau tekan `Ctrl + Enter`).
6. Supabase akan secara otomatis:
   - Membuat tabel `public.karya_batik`
   - Mengatur Row Level Security (RLS) sehingga galeri bisa dilihat dan disimpan
   - Membuat Storage Bucket `karya-batik` dengan akses publik untuk menyimpan gambar kain batik.

---

### Langkah 4: Salin API Keys (Project URL & Anon Key)
1. Di dashboard Supabase, klik ikon gerigi **Project Settings** (di pojok kiri bawah).
2. Pilih submenu **API** (di bawah bagian Configuration).
3. Anda akan melihat dua informasi penting:
   - **Project URL**: berbentuk URL seperti `https://xxxxxxxxxxxx.supabase.co`
   - **Project API Keys**: cari yang berlabel **`anon` / `public`** (deretan karakter acak panjang).
4. Salin kedua nilai tersebut.

---

### Langkah 5: Sambungkan ke Studio Canting
1. Pastikan server lokal aktif, lalu buka Studio Canting di browser:
   🌐 `http://localhost:3000/studio-canting.html`
2. Scroll ke bagian **Galeri Pameran Busana Batik**.
3. Di sebelah kanan judul galeri, klik tombol **"Koneksi Supabase"** (dengan logo petir Supabase hijau).
4. Sebuah jendela modal pengaturan akan muncul:
   - Masukkan **Project URL** Anda
   - Masukkan **Anon Key** Anda
5. Klik tombol **"Simpan & Sambungkan"**.
6. Sistem akan otomatis memvalidasi koneksi ke Supabase Cloud. Jika berhasil, lampu indikator akan menyala hijau bertuliskan **"Supabase Terhubung"**!

---

## 🎨 Keunggulan Menggunakan Supabase
- **Tanpa Perlu Menjalankan Backend Lokal**: Tidak perlu `php artisan serve` atau Apache/MySQL terpisah untuk batik.
- **Penyimpanan Cloud Permanen**: Gambar karya busana batik tersimpan langsung di CDN Supabase Storage.
- **Mode Cadangan Otomatis**: Jika internet terputus, Studio Canting tetap berjalan mulus menggunakan cadangan memori lokal (`localStorage`).
